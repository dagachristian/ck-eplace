FROM node:14.17.0-alpine

COPY ./bff/dist /dist
COPY ./web/build /dist/build
COPY ./bff/package.json /package.json
COPY ./bff/package-lock.json /package-lock.json

RUN NODE_ENV=$NODE_ENV npm install
EXPOSE 8080
CMD ["node", "."]