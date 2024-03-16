type Env = {
  DISCORD_WEBHOOK: string;
  LOOP_INTERVAL: number;
};

function parse(): Env {
  if (!process.env.DISCORD_WEBHOOK) {
    throw new Error("DISCORD_WEBHOOK environment variable is not set");
  }

  if (!process.env.LOOP_INTERVAL) {
    throw new Error("LOOP_INTERVAL environment variable is not set");
  }

  return {
    DISCORD_WEBHOOK: process.env.DISCORD_WEBHOOK,
    LOOP_INTERVAL: Number(process.env.LOOP_INTERVAL),
  };
}

export const env = parse();
