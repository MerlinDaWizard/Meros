# 🐟Meros🐟

A discord bot built with Discordx.
Built for personal use in a personal discord server.

## 🌲 Enviroment

Poplate enviroment or .env file with

```
BOT_TOKEN={Discord Bot Token}
THE_CREATORS_ID={Discord user id for secret relay command}
```

## 🏗 Development

```
npm install
npm run dev
```

If you want to use [Nodemon](https://nodemon.io/) to auto-reload while in development:

```
npm run watch
```

To manually run database migrations:
```
kysely migrate up
```
New migrations are also ran on startup.

To get typehints, run `kysely-codegen` after running migrations.

## 💻 Production

```
npm install --production
npm run build
npm run start
```

## 🐋 Docker

To start your application:

```
docker-compose up -d
```

To shut down your application:

```
docker-compose down
```

To view your application's logs:

```
docker-compose logs
```
