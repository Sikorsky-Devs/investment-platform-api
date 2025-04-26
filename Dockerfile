FROM node:20 AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma generate &&  \
    yarn build && \
    mkdir static

EXPOSE 4555

CMD ["yarn", "start:prod"]