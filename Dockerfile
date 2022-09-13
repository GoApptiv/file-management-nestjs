FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx nest build

EXPOSE 80
CMD ["node", "start"]