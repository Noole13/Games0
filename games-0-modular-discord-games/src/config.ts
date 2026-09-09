import "dotenv/config";

type RequiredEnvKey =
  | "DISCORD_TOKEN"
  | "DISCORD_CLIENT_ID"
  | "FIREBASE_DATABASE_URL"
  | "FIREBASE_PROJECT_ID"
  | "FIREBASE_CLIENT_EMAIL"
  | "FIREBASE_PRIVATE_KEY";

function required(key: RequiredEnvKey): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  discordToken: required("DISCORD_TOKEN"),
  discordClientId: required("DISCORD_CLIENT_ID"),
  discordGuildId: process.env["DISCORD_GUILD_ID"],
  discordMessageContentIntent: process.env["DISCORD_MESSAGE_CONTENT_INTENT"] === "true",
  firebase: {
    databaseURL: required("FIREBASE_DATABASE_URL"),
    projectId: required("FIREBASE_PROJECT_ID"),
    clientEmail: required("FIREBASE_CLIENT_EMAIL"),
    privateKey: required("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
  },
  commandName: "3RB Games",
} as const;