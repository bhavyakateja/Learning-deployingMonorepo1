FROM oven/bun:1

WORKDIR /app

# Copy ONLY dependency files first
COPY package.json bun.lock turbo.json ./

# (IMPORTANT for monorepo)
COPY packages/db/package.json ./packages/db/package.json
COPY apps/ws/package.json ./apps/ws/package.json

# Install dependencies (cached layer)
RUN bun install

# Copy rest of the code
COPY packages ./packages
COPY apps/ws ./apps/ws

# Move to web socket
WORKDIR /app/apps/ws

# Copy env
COPY apps/ws/.env .env

EXPOSE 3002

# Run app
CMD ["bun", "run", "index.ts"]