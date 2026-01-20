# Base stage

FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json .env dbLogs.js ./

RUN apk add --no-cache bash inotify-tools jq curlie



# Dev stage

FROM base AS dev

RUN npm ci

COPY . .

ENV PORT 3000

EXPOSE $PORT

# Overridden in docker-compose
CMD ["npm", "start"]



# Build stage

FROM base AS builder

RUN npm ci

COPY . .

RUN npm run build




# Production stage
FROM base AS prod

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

ENV PORT 3000

EXPOSE $PORT

# Overridden in docker-compose
CMD ["npm", "start"]
