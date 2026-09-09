import type { StringSelectMenuInteraction } from "discord.js";
import type { GameModule } from "./types";
import { runAnswerGame } from "./utils/answer-game";
const game: GameModule = { id: "brands", async run(i: StringSelectMenuInteraction) { await runAnswerGame(i, { id: "brands", title: "الماركات", prompt: "ما الشركة التي شعارها تفاحة مقضومة؟", answer: "أبل", points: 15 }); } };
export default game;
