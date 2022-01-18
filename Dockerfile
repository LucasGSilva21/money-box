FROM node:16.3.0-alpine

RUN apk add bash

RUN npm install -g @nestjs/cli

WORKDIR /home/node/app

COPY . .