# Stage 1: Use official Bun image
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install dependencies first to leverage Docker cache
COPY package.json bun.lockb* ./
# Using --frozen-lockfile if bun.lockb exists, otherwise just install
# This assumes bun.lockb is committed or will be generated correctly
RUN bun install --frozen-lockfile || bun install

# Copy the rest of the application code
COPY . .

# Application Environment Variables - these will be overridden by docker-compose or .env file locally
ENV NODE_ENV=production
# PORT is already set in your .env, but good to have a default here if needed
# ENV PORT=5001
# MONGODB_URI and JWT_SECRET will be injected by docker-compose

# Expose the port the app runs on
# This should match the PORT in your .env or the default if not set by docker-compose
EXPOSE ${PORT:-5001}

# Command to run the application
CMD ["bun", "run", "start"]
