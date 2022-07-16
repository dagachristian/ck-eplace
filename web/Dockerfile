FROM node:14.17.0-alpine

COPY ./build /build

RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build"]