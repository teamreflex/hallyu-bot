import { sleep } from "bun";

type RawProduct = {
  id: string;
  title: string;
  handle: string;
  created_at: string;
  images: {
    src: string;
  }[];
};

export type Product = {
  id: string;
  title: string;
  url: string;
  created_at: Date;
  image: string;
};

export async function getProducts(): Promise<Product[]> {
  const res = await fetch("https://hallyusuperstore.com/products.json");

  if (!res.ok) {
    if (res.status === 429) {
      console.log("Rate limit hit, waiting 5 minutes...");
      await sleep(1000 * 60 * 5);
      return await getProducts();
    }

    throw new Error(`Failed to fetch products: ${res.statusText}`);
  }

  const data = (await res.json()) as {
    products: RawProduct[];
  };

  return data.products.map((product) => ({
    id: product.id,
    title: product.title,
    url: `https://hallyusuperstore.com/products/${product.handle}`,
    created_at: new Date(product.created_at),
    image: product.images[0]?.src ?? "",
  }));
}
