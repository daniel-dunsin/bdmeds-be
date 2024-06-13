FROM node:21-alpine

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

EXPOSE 3001

RUN npm run build

CMD npm run start