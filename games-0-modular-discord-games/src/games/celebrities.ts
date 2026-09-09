import type { StringSelectMenuInteraction } from "discord.js";
import type { GameModule } from "./types";
import { runAnswerGame } from "./utils/answer-game";
const game: GameModule = { id: "celebrities", async run(i: StringSelectMenuInteraction) { await runAnswerGame(i, { id: "celebrities", title: "المشاهير", prompt: "من أول إنسان صعد إلى القمر؟", answer: "نيل أرمسترونغ", points: 15 }); } };
export default game;
