FROM node:9.5

COPY . /src

WORKDIR /src

RUN yarn install

CMD ["npm", "start"]