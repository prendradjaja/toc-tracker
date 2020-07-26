# TOC reading tracker

## Running locally

### Requirements

- NPM & Node (I'm using NPM v6.14.4 and Node v12.18.0)
- PostgreSQL (I'm using v12.3)

### Install

#### Server

From the root directory:
```
cp .env_example .env
```

From the `server` directory:
```
# Set up database
psql -c "CREATE DATABASE toc_tracker"
./scripts/run-all-migrations.sh

# Install dependencies
npm install
```

#### Client

Nothing to build! Plain JS & HTML (for now?)

### Run

#### Server

In two separate terminals:

From server directory:
```
npm run build-watch
```

From root directory:
```
heroku local:run npm run _serve --prefix server
```

(Can't just do `npm run _serve` from the server directory because `heroku
local` is needed to provide environment variables, so I marked it "private"
with `_`. TODO: Maybe use `dotenv` package?)

Then visit: http://localhost:8000/

## Deploying to Heroku

Prerequisites: Heroku CLI

```
heroku create
git push heroku master
heroku addons:create heroku-postgresql:hobby-dev
heroku pg:psql < server/migrations/010--create-tables-book-and-chapter.sql
```
