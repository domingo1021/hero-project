# Hero Project API

## Description

A Hero project backend server.

## Tech Stacks

1. `TypeScript` as **programming language**, which is a superset of JS, and also using **Node.js** as runtime.
2. `NestJS` as **backend framework**, and using express as internal library implementation.
3. `ESList` as **JavaScript Linter**
4. `Prettier` as **JavaScript Formatter**
5. `Husky` as **git hooks** to make sure code quality with **pre-commit** and **pre-push** scripts.

## Running the app

### Start with Docker compose

Docker compose will run multiple containers and start app after dependencies get ready.

- [x] Redis
- [x] Vault
- [x] Hero-app (NestJS application)

```
docker compose up
```

### Start app manually

1. Make sure `Node.js` is installed

```sh
node -v #v20.15.0
```

2. **Prerequisite**: run Redis

```sh
docker run -d --name redis -p 6379:6379 redis
```

2. Install dependency libraries

```sh
npm install
```

3. Run npm script to start app

```bash
# development
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test
```
