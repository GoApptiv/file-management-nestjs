FROM node:16.14.2

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80
CMD ["node", "start"]