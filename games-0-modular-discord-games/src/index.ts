import app from "./app";
import { logger } from "./lib/logger";
import { startDiscordBot } from "./discord/bot";

function serializeError(error: unknown): { name?: string; message: string; stack?: string; cause?: unknown } {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    };
  }
  return { message: String(error) };
}

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});

void startDiscordBot().catch((error: unknown) => {
  logger.error({ error: serializeError(error) }, "Failed to start 3RB Games Discord bot");
  process.exitCode = 1;
});
