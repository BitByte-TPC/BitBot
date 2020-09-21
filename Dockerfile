FROM node:12-alpine

RUN apk add yarn

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN yarn install

EXPOSE 3000

RUN yarn build

CMD node ./bin/www
