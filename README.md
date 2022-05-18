# Test Driven Development

## Setup

### Environment

Before anything else, make sure to copy the `.env.example` file to `.env`.

```bash
cp .env.example .env
```

### Dependencies

Next up, we will need to install our PHP dependencies so we can kick off our Docker environment (based on [Laravel Sail](https://laravel.com/docs/9.x/sail)).

```bash
composer install -o
```

Before continuing with our Docker build, we need to ensure Laravel has an application key set up in our `.env` file.

```bash
php artisan key:generate
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

### Database

As part of our Docker setup, we included a MariaDB database. Let's run our migrations now in order to populate the correct database schema. Open your terminal and change into the root directory of this application.

```bash
./develop artisan migrate
```

### Preview

Lastly, let's take a quick look at the initial state of the application in the browser. If you've followed up to this point, you should be able to open up a browser and navigate to [http://localhost/](http://localhost/). You should see a box with a text input that states "What needs to be done?" in front of you. With that, we are good to start.

## Project

The project that we will be building is an incredibly simplified version of [TodoMVC](https://todomvc.com/), which if it's not obvious, is a To Do list application. 

We will be going through building out the server side endpoints to handle our database interactions (creating, reading, updating, deleting) and returning usable data to the frontend. Following that we will be building out the interactions on the frontend (the UI is already pre-built to save time, you just have to assemble it ... ![Ikea](/resources/images/ikea.png) !).

### Laravel and PHPUnit

#### 1. Creating a New To Do

...

#### 2. Read Existing To Do's

...

#### 3. Update an Existing To Do

...

#### 4. Delete an Existing To Do

...

### React and Testing Library / Jest

#### 1. Creating a New To Do

...

#### 2. Display Existing To Do's

...

#### 3. Mark an Existing To Do as Completed

...

#### 4. Delete an Existing To Do

...
