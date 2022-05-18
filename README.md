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

Before we move onto setting up the database, let's take a second to compile our static assets. *You can use either `dev` or `watch` here, depending on what you want to do. The `watch` command will continually recompile your changes, should you have the desire to keep checking your progress via the browser.*.

```bash
./develop yarn dev
```

#### Database

As part of our Docker setup, we included a MariaDB database. Let's run our migrations now in order to populate the correct database schema. Open your terminal and change into the root directory of this application.

```bash
./develop artisan migrate
```


#### Preview

Lastly, let's take a quick look at the initial state of the application in the browser. If you've followed up to this point, you should be able to open up a browser and navigate to [http://localhost/](http://localhost/). You should see a box with a text input that states "What needs to be done?" in front of you. With that, we are good to start.
