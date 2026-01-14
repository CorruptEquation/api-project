FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache bash inotify-tools jq curlie && npm ci

COPY . .

ENV PORT 3000

EXPOSE $PORT

# Overridden in docker-compose
CMD ["npm", "start"]
