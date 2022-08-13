FROM node:14.17.0-alpine as build

COPY . /bff

RUN cd bff && npm run clean && npm i && npm run build

FROM node:14.17.0-alpine

COPY --from=build bff/dist dist
COPY --from=build bff/package.json package.json
COPY --from=build bff/package-lock.json package-lock.json
RUN npm i

EXPOSE 8080
CMD ["node", "."]