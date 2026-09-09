import type { StringSelectMenuInteraction } from "discord.js";
import type { GameModule } from "./types";
import { runAnswerGame } from "./utils/answer-game";
const game: GameModule = { id: "duel", async run(i: StringSelectMenuInteraction) { await runAnswerGame(i, { id: "duel", title: "المبارزة", prompt: "أول من يكتب: هجوم يفوز.", answer: "هجوم", points: 20, timeoutMs: 15_000 }); } };
export default game;
