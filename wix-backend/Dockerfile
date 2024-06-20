FROM node:18.19.1-alpine as build

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
RUN npm install --no-optional

COPY . /usr/src/app/
RUN npm run build

FROM node:18.19.1-alpine as source
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist/ /usr/src/app/
COPY --from=build /usr/src/app/package*.json /usr/src/app/
RUN npm install --production --no-optional

CMD [ "node", "main.js" ]