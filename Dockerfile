FROM node:16.13.0

WORKDIR /usr/src/app

ARG NPM_GITHUB_TOKEN

COPY package*.json ./

COPY .npmrc .npmrc  

RUN npm install

RUN rm -f .npmrc

COPY . .

RUN npx nest build

EXPOSE 80
CMD ["node", "start"]