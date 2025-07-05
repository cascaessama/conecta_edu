FROM node:22-alpine

WORKDIR /usr/app

COPY package.json ./

RUN npm install

COPY . .

ARG MONGO_URI

ENV MONGO_URI=$MONGO_URI

RUN echo "MONGO_URI=${MONGO_URI}" > .env

RUN npm install -g pnpm

RUN pnpm build

EXPOSE 3010

CMD ["node", "dist/main"]