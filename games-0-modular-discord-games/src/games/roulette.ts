import { EmbedBuilder, type StringSelectMenuInteraction } from "discord.js";
import type { GameModule } from "./types";
const game: GameModule = { id: "roulette", async run(i: StringSelectMenuInteraction) { await i.editReply({ embeds: [new EmbedBuilder().setColor(0x5865f2).setTitle("عجلة الروليت").setDescription("الفائز العشوائي: اضغط واستمتع بالجولة.")], components: [] }); } };
export default game;
