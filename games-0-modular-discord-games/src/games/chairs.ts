import type { StringSelectMenuInteraction } from "discord.js";
import type { GameModule } from "./types";
import { runAnswerGame } from "./utils/answer-game";
const game: GameModule = { id: "chairs", async run(i: StringSelectMenuInteraction) { await runAnswerGame(i, { id: "chairs", title: "الكراسي", prompt: "اكتب عدد أرجل الكرسي التقليدي.", answer: "4", points: 10 }); } };
export default game;
