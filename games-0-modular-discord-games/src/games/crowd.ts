import type { StringSelectMenuInteraction } from "discord.js";
import type { GameModule } from "./types";
import { runAnswerGame } from "./utils/answer-game";
const game: GameModule = { id: "crowd", async run(i: StringSelectMenuInteraction) { await runAnswerGame(i, { id: "crowd", title: "تصحيح الجموع", prompt: "ما جمع كلمة كتاب؟", answer: "كتب", points: 15 }); } };
export default game;
