FROM node:16.3.0-alpine

RUN apk add --no-cache bash

RUN npm install -g @nestjs/cli

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3333

CMD [ "npm", "run", "start:dev" ]
