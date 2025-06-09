FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .


RUN npm run build || { echo "Build failed!"; exit 1; }


RUN echo "--- Listing all files after build step ---" && ls -R


RUN test -d /app/dist || { echo "Error: /app/dist directory not found!"; exit 1; }

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist


RUN echo "--- Listing all files in final stage ---" && ls -R

EXPOSE 5001

CMD ["node", "dist/index.js"]