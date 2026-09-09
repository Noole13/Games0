import { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, type StringSelectMenuInteraction, type ChatInputCommandInteraction } from "discord.js";
import { gameById, games } from "./catalog";
import flags from "./flags";
import chairs from "./chairs";
import jokes from "./jokes";
import words from "./words";
import crowd from "./crowd";
import celebrities from "./celebrities";
import brands from "./brands";
import roulette from "./roulette";
import hideSeek from "./hide-seek";
import quick from "./quick";
import scramble from "./scramble";
import letterCatch from "./letter-catch";
import counting from "./counting";
import truthDare from "./truth-dare";
import duel from "./duel";
import type { GameModule } from "./types";
import { gameStateManager } from "./utils/state";
import { COLORS } from "./utils/helpers";

const modules: Record<string, GameModule> = Object.fromEntries([flags, chairs, jokes, words, crowd, celebrities, brands, roulette, hideSeek, quick, scramble, letterCatch, counting, truthDare, duel].map((game) => [game.id, game]));

export async function showGamePicker(interaction: ChatInputCommandInteraction): Promise<void> {
  const menu = new StringSelectMenuBuilder().setCustomId("game-picker").setPlaceholder("اختر لعبة للبدء").addOptions(games.map((game) => new StringSelectMenuOptionBuilder().setLabel(game.label).setDescription(game.description).setValue(game.id)));
  await interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.BRAND).setTitle("3RB Games").setDescription("اختر لعبة من القائمة وابدأ جولة جديدة مع الموجودين في القناة.")], components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu)] });
}

export async function handleGameSelection(interaction: StringSelectMenuInteraction): Promise<void> {
  const gameId = interaction.values[0];
  const game = gameById(gameId);
  const module = modules[gameId];
  if (!game || !module) return void await interaction.update({ content: "اللعبة غير متاحة حالياً.", embeds: [], components: [] });
  if (!gameStateManager.startRound(interaction.channelId, gameId)) return void await interaction.update({ content: "هناك جولة جارية في هذه القناة. انتظر انتهائها ثم ابدأ جولة جديدة.", embeds: [], components: [] });
  try { await module.run(interaction); } finally { gameStateManager.endRound(interaction.channelId); }
}

export { games };
