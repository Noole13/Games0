import { EmbedBuilder, type StringSelectMenuInteraction } from "discord.js";
import type { GameModule } from "./types";
const game: GameModule = { id: "truth-dare", async run(i: StringSelectMenuInteraction) { await i.editReply({ embeds: [new EmbedBuilder().setTitle("صراحة أم جرأة").setDescription("اكتب صراحة أو جرأة لاختيار التحدي.")], components: [] }); } };
export default game;
