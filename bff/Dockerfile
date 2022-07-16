FROM node:14.17.0-alpine

COPY ./dist /dist
COPY ./package.json /package.json
COPY ./package-lock.json /package-lock.json

RUN NODE_ENV=$NODE_ENV npm install
EXPOSE 8080
CMD ["node", "."]