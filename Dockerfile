FROM node:14.17.0-alpine as build

COPY ./bff /bff
COPY ./web /web

RUN (cd bff && npm run clean && npm i && npm run build) & (cd web && npm run clean && npm i && npm run build)

FROM node:14.17.0-alpine

COPY --from=build bff/dist dist
COPY --from=build web/build dist/build
COPY ./bff/package.json /package.json
COPY ./bff/package-lock.json /package-lock.json
RUN npm i

EXPOSE 8080
CMD ["node", "."]