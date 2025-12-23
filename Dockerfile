## build runner
FROM node:lts AS build-runner

# Set temp directory
WORKDIR /tmp/app

# Move package.json
COPY package.json .

ENV DATABASE_URL="devdb.sqlite"

# Install dependencies
RUN npm install

# Move source files
COPY src ./src
COPY tsconfig.json   .
COPY kysely.config.ts .

# Run migrations to create empty dev db
RUN npm run migrate
# Build typescript model for database from empty dev instead of prod
RUN npm run codegen
# Build project
RUN npm run build

## production runner
FROM node:lts-alpine AS prod-runner

# Set work directory
WORKDIR /app

# Copy package.json from build-runner
COPY --from=build-runner /tmp/app/package.json /app/package.json

# Install dependencies
RUN npm install --omit=dev

# Move build files
COPY --from=build-runner /tmp/app/build /app/build

# Start bot
CMD [ "npm", "run", "start" ]
