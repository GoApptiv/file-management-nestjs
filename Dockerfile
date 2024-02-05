FROM node:16.13.0

WORKDIR /app

ARG NPM_GITHUB_TOKEN

COPY package*.json ./

COPY .npmrc .npmrc  

RUN npm ci

RUN rm -f .npmrc

COPY . .

RUN npx nest build

CMD ["npm", "run" , "start:prod"]
