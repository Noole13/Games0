import type { StringSelectMenuInteraction } from "discord.js";
import type { GameModule } from "./types";
import { runAnswerGame } from "./utils/answer-game";
const game: GameModule = { id: "counting", async run(i: StringSelectMenuInteraction) { await runAnswerGame(i, { id: "counting", title: "عُد حتى الرقم", prompt: "اكتب الرقم 1", answer: "1", points: 5 }); } };
export default game;
