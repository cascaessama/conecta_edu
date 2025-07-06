FROM node:22-alpine

WORKDIR /usr/app

COPY package.json ./

RUN npm install

COPY . .

ARG MONGO_URL

ENV MONGO_URL=$MONGO_URL

RUN echo "MONGO_URL=${MONGO_URL}" > .env

RUN npm install -g pnpm

RUN pnpm build

EXPOSE 3010

CMD ["node", "dist/main"]