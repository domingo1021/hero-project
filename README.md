# Hero Project API

> A backend API project for a game, providing two unified API interfaces to display hero information and profiles to users.

## Problem Statement

**Hero** gaming backend is designed to provide hero profiles to users via an [External API](https://github.com/hahow/hahow-recruit/blob/master/backend.md#%E6%88%91%E5%80%91%E6%89%80%E6%8F%90%E4%BE%9B%E7%9A%84%E8%B3%87%E6%96%99%E5%8F%8A-api). However, this external API is somewhat unstable, occasionally returning unexpected response body formats or status codes. To provide a reliable service, the Hero Project needs to devise a strategy to overcome this issue.

## Hypothesis

1. After a deep dive into the business logic, we found that the **frequency of read operations is significantly higher than that of write operations**.
2. The external API's data pertains to **Heroes**, the characters in the game. This data changes infrequently, approximately once a week or at most once per day. We assume that updates occur during off-peak times (e.g., 4:00 AM).
3. Temporary data inconsistencies within a short period are acceptable for the gaming system.

## Solution

1. Implement a caching mechanism in the gaming backend API: When a user calls the API to retrieve **Hero** data, the request lifecycle might be: `presentation layer` --> `business layer` --> `data access layer`. Knowing that the bottleneck lies in the unstable data layer, we can introduce a caching mechanism before accessing the infrequently changing data source.
2. Design a cache strategy for the use case: We employ the **Cache-Aside** caching strategy, which writes data into the cache after the first **cache miss**, making the same **data available in memory for subsequent requests**.

## Running the app

### Start with Docker Compose

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

## Project structure

```
.
├── config                  Local config for vault
├── logs                    Logs folder for winston (Node.js logger)
├── scripts                 Utility scripts (e.g., K6 load test)
├── src                     Source code
│   ├── cores               Utility components for modules
│   │   ├── constants       Constant variables
│   │   ├── decorators      Custom decorators
│   │   ├── exceptions      Exception filter
│   │   ├── guards          Authentication guard
│   │   ├── interceptors    NestJS lifecycle interceptor
│   │   ├── middlewares     NestJS Middleware
│   │   └── types           Type definitions for the project
│   └── modules             Modules for specific functionalities
│       ├── app             Root module
│       ├── auth            Authentication module
│       ├── cache           Cache module (access to Redis)
│       ├── hero            Hero module (endpoint, biz logics, data fetching)
│       │   └── dto         Hero data transfer object(DTO)
│       ├── http            HTTP client module (access to 3rd party API)
│       └── logger          Logger module
│           └── type        Interface for system/application logger
└── test                    Tests (organized by modules)
    └── modules
        ├── app
        ├── hero
        └── http
```

## Tech Stacks

### General

1. `TypeScript` as **programming language**, which is a superset of JS, and also using **Node.js** as runtime.
2. `NestJS` as **backend framework**, and using express as internal library implementation.
3. `Redis` as **Cache**, helps us store data from external API
4. `Vault` as **Secret Manager**, stores Environment variable or Secrets
5. `Docker` as **Container Platform**, helps to containerize application.
6. `Github Actions` as **Continuous Integration** tool, runs test every time PR is created or when code is merged into **main** branch.
7. `ESList` as **JavaScript Linter**
8. `Prettier` as **JavaScript Formatter**
9. `Husky` as **git hooks** to make sure code quality with **pre-commit** and **pre-push** scripts.

### Library

1. Production pacakge:
   - HTTP client
     - `@nestjs/axios`: `axios` HTTP client compatible with `NestJS` framework.
   - Cache
     - `@nestjs/cache-manager`: Cache Manager which help NestJS wrap cache client
     - `cache-manager`: Cache module for Node.js, support various storage type, including in-memory and Redis
     - `cache-manager-redis-store`: cache-manager plugin to use Redis as cache store.
     - `redis`: Regis client in Node.js
   - Logger
     - `winston`: Node.js Logging library which supports log levels, log storage
     - `winston-daily-rotate-file`: Help winston to transport & rotate log into files.
   - Data validation
     - `class-validator`: Validate input parameters at Controller
     - `class-transformer`: Transform data from http request to controller input parameter
   - Configuration / Env
     - `config`: adding secrets / env variable from config file (set in `NODE_CONFIG_DIR`)
   - Utils
     - `rxjs`: Reactive programming package using Observables
     - `uuid`: UUID generator
     - `bcrypt`: Help hash / compare secrets (e.g user password)
2. Development package
   - Test
     - `jest`: Unit test framework, help spy & mock components.
     - `supertest`: Library for testing HTTP servers, used to check API endpoints.
     - `nock`: HTTP interceptor, help to loose the dependency to external API when test.
   - Code Quality
     - `eslint`: TS & JS Linter, help to check coding style / standard.
     - `prettier`: TS & JS formatter, automatically format code with standard in **.prettierrc**
     - `husky`: Git hook, help to check coding style at git related hook point(e.g. **pre-commit** / **pre-push**)
     - `lint-staged`: Linter for git staged files.

## Comment Principle

1. **Class Domumentation** & **Function Documentation**: Describe the purpose of the class, methods, or function, its parameters, and its return value using JSDoc.
2. **Special Case Comments**: Use inline comments to explain complex logic, special cases, and important decisions within the code.
