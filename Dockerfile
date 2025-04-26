FROM node:20 AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    unoconv \
    libreoffice \
    && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma generate &&  \
    yarn build && \
    mkdir static

EXPOSE 4555

CMD ["yarn", "start:prod"]