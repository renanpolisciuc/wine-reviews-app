# estágio de compilação
FROM node:14.15.3-alpine3.12 as build-stage
ENV VUE_APP_SERVER_URL="http://localhost:3000"
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn run build

# estágio de produção
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]