import { EmbedBuilder, type StringSelectMenuInteraction } from "discord.js";
import { getUserName, waitForChannelMessage } from "./helpers";
import { recordScore } from "../../lib/leaderboard";
import { isCorrectAnswer } from "../utils/normalizer";

export async function runAnswerGame(interaction: StringSelectMenuInteraction, options: { id: string; title: string; prompt: string; answer: string; points?: number; timeoutMs?: number }) {
  const reply = await interaction.editReply({ embeds: [new EmbedBuilder().setColor(0x5865f2).setTitle(options.title).setDescription(options.prompt)], components: [] });
  const message = await waitForChannelMessage(reply.channel, (candidate) => !candidate.author.bot && isCorrectAnswer(candidate.content, options.answer), options.timeoutMs ?? 20_000);
  if (message) {
    await recordScore({ game: options.id, userId: message.author.id, username: getUserName(message), points: options.points ?? 10, detail: "إجابة صحيحة" });
    await interaction.editReply({ embeds: [new EmbedBuilder().setColor(0x57f287).setTitle("إجابة صحيحة").setDescription(`<@${message.author.id}> أجاب بشكل صحيح وحصل على **${options.points ?? 10} نقطة**.`)] });
  } else {
    await interaction.editReply({ embeds: [new EmbedBuilder().setColor(0xed4245).setTitle("انتهى الوقت").setDescription(`الإجابة الصحيحة كانت: **${options.answer}**`)] });
  }
}
