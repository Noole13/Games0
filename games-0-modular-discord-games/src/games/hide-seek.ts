import type { StringSelectMenuInteraction } from "discord.js";
import type { GameModule } from "./types";
import { runAnswerGame } from "./utils/answer-game";
const game: GameModule = { id: "hide-seek", async run(i: StringSelectMenuInteraction) { await runAnswerGame(i, { id: "hide-seek", title: "غميضة", prompt: "اكتب المكان السري: الغابة", answer: "الغابة", points: 15 }); } };
export default game;
