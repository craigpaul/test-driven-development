## Test Driven Development

### Setup

#### Environment

Before anything else, make sure to copy the `.env.example` file to `.env`.

```bash
cp .env.example .env
```

#### Dependencies

Next up, we will need to install our PHP dependencies so we can kick off our Docker environment (based on [Laravel Sail](https://laravel.com/docs/9.x/sail)).

```bash
composer install -o
```

Once that is complete, you will want to kick off the Docker build steps. Included in this repository is a `develop` script to allow for a similar access pattern to the underlying Docker resources as in other repositories within the Coconut Software organization.

```bash
./develop up -d
```

After this has finished building, you will want to install your JavaScript dependencies using the same `develop` script. *This can take quite a few minutes as it is being run inside of the container.*

```bash
./develop yarn
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
