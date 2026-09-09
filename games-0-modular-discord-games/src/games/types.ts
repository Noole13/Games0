import type { StringSelectMenuInteraction } from "discord.js";

export type GameModule = {
  id: string;
  run(interaction: StringSelectMenuInteraction): Promise<void>;
};
