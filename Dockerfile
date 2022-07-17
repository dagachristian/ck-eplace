FROM node:14.17.0-alpine

COPY ./bff /bff
COPY ./web /web
COPY ./bff/package.json /package.json
COPY ./bff/package-lock.json /package-lock.json

RUN rm web/.env
RUN rm -rf bff/dist bff/node_modules web/build web/node_modules
RUN cd bff && npm i && npm run build
RUN cd web && npm i && npm run build
RUN mv bff/dist dist
RUN mv bff/certs certs
RUN mv web/build dist/build
RUN rm -rf bff web
RUN npm i

EXPOSE 8080
EXPOSE 8443
CMD ["node", "."]