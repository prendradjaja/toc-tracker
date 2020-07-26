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

```
cd toc-tracker/server
npm run build-watch
```

```
cd toc-tracker/server
heroku local:run npm run _serve --prefix server
```

`_serve` is defined in server/package.json, but won't work by running directly
because `heroku local` is needed to provide environment variables (TODO: Maybe
use `dotenv` package?), so I marked it "private" with `_`.

Then visit: http://localhost:8000/

## Deploying to Heroku

Prerequisites: Heroku CLI

```
heroku create
git push heroku master
heroku addons:create heroku-postgresql:hobby-dev
heroku pg:psql < server/migrations/010--create-tables-book-and-chapter.sql
```
