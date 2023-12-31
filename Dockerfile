FROM node:lts-bullseye-slim

ARG BUILD_CMD
WORKDIR /app
COPY . /app

RUN npm install
RUN npm run $BUILD_CMD

EXPOSE 3000
ENTRYPOINT ["node", "dist/main"]