## EquipUA API

An API for the EquipUA web application.

## Features

- User registration and authentication (with email verification)
- User profile management
- Project creation with different types of tasks
- Investment tracking
- Investment management
- Real-time communication for users


## Tech details
- Multi-layered architecture with separation of concerns
- RESTful API design
- Patter repository for data access
- Mappers for data transformation
- Guards for authorization
- Global exception filter

## Tech stack
- NestJS & Express
- PrismaORM
- PostgreSQL
- Socket.io
- JWT
- Docker & Docker Compose
- Node mailer
- SMTP

## WebSocket Integration

Our project includes WebSocket support for real-time communication using socket.io. The WebSocket implementation enables users to join chat rooms, send messages, and leave rooms dynamically.

### Events

The WebSocket connection handles the following three events:

- **join** – Allows a user to join a specific chat room.

- **message** – Enables sending and receiving messages within the chat room.

- **leave** – Notifies when a user leaves a chat room.

## Installation

```bash
$ git clone https://github.com/Sikorsky-Devs/investment-platform-api.git

$ cd investment-platform-api
```

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Swagger

We have Swagger for the project.

![image](https://github.com/user-attachments/assets/1de9f795-a700-4221-b61e-12402313324b)

Public API documentation is available at http://51.120.120.77:3005/api


## Environment variables

```bash
DATABASE_URL=
PORT=4555

FRONT_BASE_URL=http://localhost:3000
BACK_BASE_URL=http://localhost:4555

SMTP_HOST=
SMTP_USERNAME=
SMTP_PASSWORD=

SECRET=
TTL=
```

## Deployment

First of all? we have dockerization for the project. Our Dockerfile is ready to use.

```dockerfile
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
```

And we have docker-compose for the all project.

```yml
services:
  api:
    image: stbasarab/equipua-api
    restart: always
    container_name: api
    volumes:
      - ~/static:/app/static
    ports:
      - "3005:4555"
    env_file:
      - ~/.env.api
    depends_on:
      - db
  db:
    image: postgres:15
    restart: always
    container_name: postgres-db
    volumes:
      - ~/postgres/data:/var/lib/postgresql/data
    ports:
      - "5553:5432"
    env_file:
      - ~/.env.postgres

  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    restart: always
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 30

  web:
    image: stbasarab/equipua-web
    restart: always
    container_name: web
    ports:
      - "3001:3000"
    env_file:
      - ~/.env.web
    depends_on:
      - api
```

Our backend is available on the Docker Hub. You can pull it from there.

```bash
$ docker pull stbasarab/equipua-api
```

Also we have a **GitHub Actions** workflow for the project. Questly API is automatically deployed to the Docker Hub when a new release is created.

<img width="1429" alt="image" src="https://github.com/user-attachments/assets/3fdd7f0b-6784-437e-828c-718763b92e90" />


We deploy our project to the **Google Cloud Platform**. We use the Google Cloud VM instance.

![image](https://github.com/user-attachments/assets/4debf1fe-ce54-4d07-9352-7d29f8db6fe5)

PUBLIC API LINK: http://51.120.120.77:3005/api
