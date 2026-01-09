FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; then \
	apk add --no-cache bash inotify-tools jq curlie && \
	npm ci; \
    else npm ci --omit=dev; \
    fi

COPY . .

ENV PORT 3000

EXPOSE $PORT

CMD ["npm", "start"]
