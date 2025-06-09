
FROM node:20-alpine AS builder


WORKDIR /app

COPY package.json package-lock.json* ./


RUN npm ci --prefer-offline --no-audit --progress=false

COPY . .


ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}


RUN npm run build -- --logLevel warn


FROM node:20-alpine

WORKDIR /app


RUN npm install -g serve --prefer-offline --no-audit --progress=false


COPY --from=builder /app/dist .

EXPOSE 3000


CMD ["serve", "-s", ".", "-l", "3000"]