import type { StringSelectMenuInteraction } from "discord.js";
import type { GameModule } from "./types";
import { runAnswerGame } from "./utils/answer-game";
const game: GameModule = { id: "scramble", async run(i: StringSelectMenuInteraction) { await runAnswerGame(i, { id: "scramble", title: "تركيب الحروف", prompt: "رتب الحروف: ب ت ك", answer: "كتب", points: 15 }); } };
export default game;
