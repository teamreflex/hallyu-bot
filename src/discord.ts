import { env } from "./env";
import type { Product } from "./products";

export async function postToDiscord(product: Product) {
  const response = await fetch(env.DISCORD_WEBHOOK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: `@here: ${product.title}: ${product.url}`,
    }),
  });

  return response.ok;
}
