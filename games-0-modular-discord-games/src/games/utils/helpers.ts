import {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Message,
} from "discord.js";
import type { StringSelectMenuInteraction, ChatInputCommandInteraction } from "discord.js";

const BRAND_COLOR = 2672550;
const ERROR_COLOR = 16234837;
const SUCCESS_COLOR = 6153098;
const CONTINUATION_TIMEOUT = 30000;

export const COLORS = {
  BRAND: BRAND_COLOR,
  ERROR: ERROR_COLOR,
  SUCCESS: SUCCESS_COLOR,
} as const;

export const TIMEOUTS = {
  CONTINUATION: CONTINUATION_TIMEOUT,
} as const;

/**
 * تقصير النص حتى لا يتجاوز حدود Discord.
 */
export function truncateText(text: string): string {
  return text.length > 100 ? `${text.slice(0, 97)}...` : text;
}

/**
 * معلومات المستخدم من Interaction أو Message.
 */
export function getUserInfo(
  source: ChatInputCommandInteraction | StringSelectMenuInteraction | Message
): {
  id: string;
  name: string;
} {
  if ("user" in source) {
    return {
      id: source.user.id,
      name: source.user.globalName ?? source.user.username,
    };
  }
  return {
    id: source.author.id,
    name: source.author.globalName ?? source.author.username,
  };
}

/**
 * اسم المستخدم.
 */
export function getUserName(
  source: ChatInputCommandInteraction | StringSelectMenuInteraction | Message
): string {
  return getUserInfo(source).name;
}

/**
 * انتظار رسالة من القناة باستخدام الـ Collector المباشر لضمان الاستجابة.
 */
export async function waitForChannelMessage(
  channel: any,
  filter: (msg: Message) => boolean,
  timeout: number
): Promise<Message | undefined> {
  if (!channel || typeof channel.createMessageCollector !== "function") {
    return undefined;
  }

  return new Promise((resolve) => {
    const collector = channel.createMessageCollector({
      filter: (msg: Message) => !msg.author.bot && filter(msg),
      time: timeout,
      max: 1,
    });

    collector.on("collect", (msg: Message) => {
      resolve(msg);
    });

    collector.on("end", (collected: { size: number }) => {
      if (collected.size === 0) {
        resolve(undefined);
      }
    });
  });
}

/**
 * أزرار الاستمرار / الإلغاء.
 */
export async function showContinuationButtons(
  interaction: StringSelectMenuInteraction,
  resultEmbed: EmbedBuilder
): Promise<void> {
  const continueBtn = new ButtonBuilder()
    .setCustomId("round:continue")
    .setLabel("استمرار")
    .setStyle(ButtonStyle.Success);

  const cancelBtn = new ButtonBuilder()
    .setCustomId("round:cancel")
    .setLabel("إلغاء")
    .setStyle(ButtonStyle.Secondary);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    continueBtn,
    cancelBtn
  );

  const followUpMsg = await interaction.followUp({
    embeds: [
      resultEmbed.setFooter({
        text: "3RB Games • اختر استمرار للعب لعبة أخرى",
      }),
    ],
    components: [row],
  });

  const response = await followUpMsg
    .awaitMessageComponent({
      componentType: 2,
      time: CONTINUATION_TIMEOUT,
    })
    .catch(() => null);

  if (!response) {
    await followUpMsg.edit({
      components: [],
    });
    return;
  }

  if (response.customId === "round:continue") {
    await response.update({
      components: [],
    });
  } else {
    await response.update({
      components: [],
    });
  }
}

/**
 * Embed خطأ عام.
 */
export function createErrorEmbed(
  title: string,
  description: string
): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(ERROR_COLOR)
    .setTitle(title)
    .setDescription(description);
}

/**
 * Embed نجاح عام.
 */
export function createSuccessEmbed(
  title: string,
  description: string
): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(SUCCESS_COLOR)
    .setTitle(title)
    .setDescription(description);
}
