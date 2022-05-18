## Test Driven Development

### Setup

#### Environment

Before anything else, make sure to copy the `.env.example` file to `.env`.

```bash
cp .env.example .env
```

#### Database

We will need a database in order to store our data. For the purposes of this application, SQLite will fulfill our needs. Take note of the following environment variables in the `.env.example` file.

```ini
DB_CONNECTION=sqlite
DB_DATABASE=./database/test-driven-development.sqlite
```

Let's create this database file and run our migrations. Open your terminal and change into the root directory of this application.

```bash
touch database/test-driven-development.sqlite
```

Next, make sure to update your local .env file to match the correct path and connection name if it doesn't already. After that we can run our migrations.

```bash
php artisan migrate
```
