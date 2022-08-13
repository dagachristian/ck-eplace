FROM node:14.17.0-alpine as build

COPY . /web

RUN cd web && npm run clean && npm i && npm run build

FROM node:14.17.0-alpine

COPY --from=build web/build /build

RUN npm install -g serve
EXPOSE 8080
CMD ["serve", "-s", "build", "-l", "8080"]