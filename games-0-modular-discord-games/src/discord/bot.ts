import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  type Interaction,
} from "discord.js";
import { config } from "../config";
import { getLeaderboard } from "../lib/leaderboard";
import { logger } from "../lib/logger";
import {
  handleGameSelection,
  showGamePicker,
} from "../games/engine";

function serializeError(error: unknown): {
  name?: string;
  message: string;
  stack?: string;
} {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: String(error),
  };
}

export const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const commands = [
  new SlashCommandBuilder()
    .setName("play")
    .setDescription("ابدأ لعبة من 3RB Games")
    .addSubcommand((command) =>
      command
        .setName("game")
        .setDescription("اختر لعبة من القائمة"),
    ),

  new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("اعرض لوحة المتصدرين")
    .addStringOption((option) =>
      option
        .setName("game")
        .setDescription("فلترة النتائج حسب اللعبة")
        .setRequired(false)
        .addChoices(
          {
            name: "الكل",
            value: "all",
          },
          {
            name: "تخمين الأعلام",
            value: "flags",
          },
          {
            name: "الكراسي",
            value: "chairs",
          },
          {
            name: "التحدي السريع",
            value: "quick",
          },
        ),
    ),
].map((command) => command.toJSON());

async function registerCommands(): Promise<void> {
  const rest = new REST({ version: "10" }).setToken(
    config.discordToken,
  );

  const route = config.discordGuildId
    ? Routes.applicationGuildCommands(
        config.discordClientId,
        config.discordGuildId,
      )
    : Routes.applicationCommands(
        config.discordClientId,
      );

  await rest.put(route, {
    body: commands,
  });

  logger.info(
    {
      scope: config.discordGuildId
        ? "guild"
        : "global",
    },
    "Discord slash commands registered",
  );
}

export async function startDiscordBot(): Promise<void> {
  await registerCommands();

  discordClient.once("clientReady", (client) => {
    logger.info(
      {
        tag: client.user.tag,
      },
      "3RB Games is online",
    );

    client.user.setActivity("/play game", {
      type: 0,
    });
  });

  discordClient.on(
    "interactionCreate",
    async (interaction: Interaction) => {
      try {
        if (
          interaction.isChatInputCommand() &&
          interaction.commandName === "play" &&
          interaction.options.getSubcommand() === "game"
        ) {
          await showGamePicker(interaction);
        } else if (
          interaction.isChatInputCommand() &&
          interaction.commandName === "leaderboard"
        ) {
          const game =
            interaction.options.getString("game") ?? "all";

          const leaders = await getLeaderboard(game);

          const body = leaders.length
            ? leaders
                .map(
                  (player, index) =>
                    `**${index + 1}.** ${player.username} — **${player.points} نقطة**`,
                )
                .join("\n")
            : "لا توجد نتائج بعد. ابدأ أول لعبة!";

          await interaction.reply({
            embeds: [
              {
                color: 0x28c7a6,
                title: "لوحة المتصدرين",
                description: body,
                footer: {
                  text: "3RB Games • النتائج محفوظة في Firebase",
                },
              },
            ],
          });
        } else if (
          interaction.isStringSelectMenu() &&
          interaction.customId === "game-picker"
        ) {
          await handleGameSelection(interaction);
        }
      } catch (error) {
        logger.error(
          {
            error: serializeError(error),
          },
          "Discord interaction failed",
        );

        if (
          interaction.isRepliable() &&
          !interaction.replied &&
          !interaction.deferred
        ) {
          await interaction.reply({
            content:
              "حدث خطأ أثناء تشغيل الجولة. حاول مرة أخرى.",
            ephemeral: true,
          });
        }
      }
    },
  );

  try {
    await discordClient.login(config.discordToken);
  } catch (error) {
    throw new Error(
      `Discord login failed: ${
        serializeError(error).message
      }`,
      {
        cause: error,
      },
    );
  }
}
