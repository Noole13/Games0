import { EmbedBuilder, type StringSelectMenuInteraction } from "discord.js";
import type { GameModule } from "./types";
import { getUserName, waitForChannelMessage } from "./utils/helpers";
import { recordScore } from "../lib/leaderboard";
const game: GameModule = { id: "letter-catch", async run(i: StringSelectMenuInteraction) { const reply = await i.editReply({ embeds: [new EmbedBuilder().setTitle("صيد الحرف").setDescription("اكتب كلمة تبدأ بحرف س خلال 12 ثانية")], components: [] }); const m = await waitForChannelMessage(reply.channel, x => !x.author.bot && x.content.trim().startsWith("س"), 12000); if (m) { await recordScore({ game: "letter-catch", userId: m.author.id, username: getUserName(m), points: 10 }); await i.editReply({ embeds: [new EmbedBuilder().setTitle("تم صيد الحرف").setDescription(`<@${m.author.id}> فاز بالجولة.`)] }); } } };
export default game;
