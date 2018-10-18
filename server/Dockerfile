FROM node:latest
RUN mkdir -p /usr/src/app/static_build
WORKDIR /usr/src
COPY build ./app
WORKDIR app
COPY static_build/ ./static_build/
COPY package.json .
COPY yarn.lock .
COPY .env .
RUN yarn install --production=true
EXPOSE 80