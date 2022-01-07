FROM node:14.15.4-alpine3.12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @nestjs/cli

RUN npm install

COPY . .

EXPOSE 3333

CMD [ "npm", "run","start:dev" ]
