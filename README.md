# TOC reading tracker

## Running locally

### Requirements

- NPM & Node (I'm using NPM v6.14.4 and Node v12.18.0)
- PostgreSQL (I'm using v12.3)

### Install

#### Server

```
cd toc-tracker/server

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
npm run serve
```

Then visit: http://localhost:8000/

## Deploying to Heroku

Prerequisites: Heroku CLI

```
heroku create
git push heroku master
heroku addons:create heroku-postgresql:hobby-dev
heroku pg:psql < server/migrations/010--create-tables-book-and-chapter.sql
```
