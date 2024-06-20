FROM node:18.19.1-alpine as build

WORKDIR /app

COPY package*.json /app/
RUN npm install --no-optional

COPY . /app/
RUN npm run build

FROM busybox as source
WORKDIR /app
COPY --from=build /app/dist/ /app/
