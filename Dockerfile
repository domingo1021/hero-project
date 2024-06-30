# Build stage
FROM node:20.15.0-alpine as builder
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
COPY ["tsconfig.json", "tsconfig.build.json", "./"]
COPY config ./config
COPY src ./src
RUN npm install &&\
    npm run build

# Development stage
FROM node:20.15.0-alpine as development
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/config ./config
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --only=production
CMD node ./dist/main.js

