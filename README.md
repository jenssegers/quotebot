Quotebot for slack.

## Configuration

### Create a Google API client

Go to https://console.developers.google.com/apis/credentials and create a new oauth client for authentication.

Make sure you add your url to the list of authorized redirect URIs and JavaScript origins.

Copy the Client ID which looks like `***.apps.googleusercontent.com` and use that as the `GOOGLE_CLIENT_ID` environment in a `.env` file (see `.env.example`).

### Create a Slack app

Go to https://api.slack.com/apps and create a new app.

Through 'feature and functionality', add 'Slash Commands' and 'Permissions'. For slash commands, add:

- `/quote` with a request url of `https://your-domain.com/api/quotes/add`
- `/randomquote` with a request url of `https://your-domain.com/api/quotes/random`

In the permissions feature, add the `users.profile:read` permission. Then install the Slack app into your workspace and copy the 'Bot User OAuth Access Token' value and use that as `SLACK_TOKEN` in your `.env`.

### Run a MySQL server

To store quotes you need a MySQL server. You can start a local one by running `docker-compose up` in the project root.

You can check out the database schema in `docker/schema.sql`.

Make sure the mysql server configuration is set in your `.env`:

```
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=quotebot
```

### Starting locally

Start a local version of the quotebot with `npm run dev`. It should then be available on http://localhost:3000.

### Running as a docker container

Example `docker-compose.yml` file for running the quotebot using docker:

```
version: '3'

services:

  quotebot:
    image: jenssegers/quotebot
    container_name: quotebot
    restart: always
    ports:
        - 3000:80
    environment:
        DB_HOST: mysql
        DB_DATABASE: quotebot
        DB_USERNAME: root
        DB_PASSWORD: root
        SLACK_TOKEN: xoxb-123-***
        GOOGLE_CLIENT_ID: ***.apps.googleusercontent.com
        GOOGLE_DOMAIN: your-google-domain.com

  mysql:
    image: mysql:5.7
    container_name: quotebot-mysql
    ports:
        - 3306:3306
    environment:
        MYSQL_ROOT_PASSWORD: root
        MYSQL_DATABASE: quotebot
    volumes:
        - ./docker/schema.sql:/docker-entrypoint-initdb.d/init-data.sql
```
