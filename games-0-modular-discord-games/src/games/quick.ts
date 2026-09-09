import type { StringSelectMenuInteraction } from "discord.js";
import type { GameModule } from "./types";
import { runAnswerGame } from "./utils/answer-game";
const game: GameModule = { id: "quick", async run(i: StringSelectMenuInteraction) { await runAnswerGame(i, { id: "quick", title: "التحدي السريع", prompt: "ما ناتج 7 × 8؟", answer: "56", points: 20, timeoutMs: 10_000 }); } };
export default game;
