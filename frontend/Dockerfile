FROM node:18-slim

WORKDIR /app

ENV ROLLUP_FORCE_JS=true
ENV NODE_OPTIONS=--openssl-legacy-provider

COPY package*.json ./

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
