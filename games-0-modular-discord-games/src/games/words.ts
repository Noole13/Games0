import type { StringSelectMenuInteraction } from "discord.js";
import type { GameModule } from "./types";
import { runAnswerGame } from "./utils/answer-game";
const game: GameModule = { id: "words", async run(i: StringSelectMenuInteraction) { await runAnswerGame(i, { id: "words", title: "تجميع الكلمات", prompt: "رتب الحروف: م ل ع", answer: "علم", points: 15 }); } };
export default game;
