import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { getProducts } from "./products";
import { db } from "./db";
import { env } from "./env";
import { products } from "./db/schema";
import { inArray } from "drizzle-orm";
import { postToDiscord } from "./discord";

console.log("hallyu-bot starting");

// migrate database
migrate(db, { migrationsFolder: "./drizzle" });

// start loop
setInterval(main, env.LOOP_INTERVAL);

async function main() {
  console.log("Fetching products...");

  // fetch products and filter for polaroids
  const polaroids = await getProducts().then((products) =>
    products.filter((product) =>
      product.title.toLowerCase().includes("polaroid")
    )
  );

  if (polaroids.length === 0) {
    return;
  }

  // check if any of the polaroids are already in the database
  const dbPolaroids = await db
    .select()
    .from(products)
    .where(
      inArray(
        products.id,
        polaroids.map((listing) => listing.id)
      )
    )
    .limit(50);

  // filter out the polaroids that are already in the database
  const newPolaroids = polaroids.filter(
    (listing) =>
      dbPolaroids.map((dbP) => String(dbP.id)).includes(String(listing.id)) ===
      false
  );

  if (newPolaroids.length === 0) {
    return;
  }

  console.log(`Found ${newPolaroids.length} new polaroids`);

  for (const listing of newPolaroids) {
    console.log(`Posting ${listing.title}...`);
    await postToDiscord(listing);
    await db.insert(products).values({
      id: listing.id,
      title: listing.title,
      url: listing.url,
      createdAt: listing.created_at.toISOString(),
      image: listing.image,
    });
  }
}
