import type { StringSelectMenuInteraction } from "discord.js";
import type { GameModule } from "./types";
import { runAnswerGame } from "./utils/answer-game";
const game: GameModule = { id: "jokes", async run(i: StringSelectMenuInteraction) { await runAnswerGame(i, { id: "jokes", title: "فكاهة", prompt: "ما الشيء الذي كلما أخذت منه كبر؟", answer: "الحفرة", points: 10 }); } };
export default game;
