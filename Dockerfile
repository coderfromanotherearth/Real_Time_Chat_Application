FROM node:15.3.0-alpine3.10
WORKDIR /app

ADD package*.json ./
RUN npm install

ADD . .
CMD npm run start