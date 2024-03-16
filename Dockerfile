FROM oven/bun

WORKDIR /usr/src/app

COPY package.json ./
RUN bun install
COPY . .

ENV NODE_ENV production

RUN bun build ./src/index.ts --outdir ./dist --target bun
CMD ["bun", "run", "dist/index.js"]