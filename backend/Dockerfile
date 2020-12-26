FROM node:14.15.3-alpine3.12

ENV APM_SERVER_URL="http://apm:8200"
ENV ES_SERVER_URL="http://elasticsearch:9200"

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --production

COPY . .

EXPOSE 3000
CMD [ "node", "index.js" ]