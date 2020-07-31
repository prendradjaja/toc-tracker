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

For auth, create an app in the [Facebook developer console][facebook-dev] and copy your app ID and app secret into `.env`.

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
npm run server-dev
```

Then visit: http://localhost:8000/

## Deploying to Heroku

Prerequisites: Heroku CLI

```
heroku create
git push heroku master
heroku addons:create heroku-postgresql:hobby-dev
heroku pg:psql < server/migrations/010--create-tables-book-and-chapter.sql
heroku pg:psql < server/migrations/020--create-table-user.sql
```

For auth, create an app in the [Facebook developer console][facebook-dev] and then set your app id and app secret via

Differences from local development: You need to add the redirect URL (and maybe the domain). (And make sure to visit via HTTPS)
```
heroku config:set FACEBOOK_CLIENT_ID=youridhere
heroku config:set FACEBOOK_CLIENT_SECRET=yoursecrethere
```

[facebook-dev]: https://developers.facebook.com/apps/
