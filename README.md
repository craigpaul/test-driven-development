# Test-Driven Development

## Prerequisites

Before proceeding, please be sure you have the following software installed on your device.

- PHP (minimum of v8.0.2)
- Composer (minimum of v2.0)

You can verify both of these are installed by opening up a terminal window and typing the following commands.

```bash
php --version
```

```bash
composer --version
```

If you see any errors, please be sure to rectify those before proceeding.

## Setup

### Environment

First thing we need to do before setting up our application is that we need to make sure to copy the `.env.example` file to `.env`.

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

### Why We Test?

By writing automated tests for our application code, we prove that our code does what we want it to do. Tests help us prevent simply errors such as syntax issues from slipping through the cracks. Going forward, these tests can act as documentation to other developers (and yourself when you eventually forget 🤪) so they can understand how parts of the system they might not work on should behave.

Well written tests provide us with huge safety nets when it comes to doing our job. We can feel confident in refactoring our code (changing the inner workings of any given system) without breaking the expected output of the code we are changing.

A huge benefit of having a good test suite is that it can reduce cognitive overhead, meaning if we can prove that the code is doing what it should be doing, we don't have to constantly keep that functionality front of mind, if we break it by changing something else, our test suite will let us know.

### Types of Tests

There are many different types of tests you can reach for when it comes to automated software testing. We will look at the three most common forms of tests that you will hear come up when talking about automated software teting: Unit, Feature/Integration, and End to End.

Unit tests are typically very small and focused on a single section of code, often a single function. While unit tests are cheap to write and run, [they do not provide a large amount of confidence](https://twitter.com/erinfranmc/status/1148986961207730176) that your application is necessarily working correctly, rather only a small part of it instead.

Feature/Integration tests offer a good middle ground between Unit and End to End tests. These types of tests will typically start touching multiple areas of your code base and will almost certainly start interacting with outside systems such as your database. They are more involved to write and take longer to run then unit tests, but they can provide a huge amount of confidence that your application is working correctly.

End to End tests offer the highest level of confidence that your application is working as you intended since they are typically written with software that *actually* interacts directly with the application in question, just as if it was an end-user sitting in front of their computer. The tradeoff with End to End tests is that they take an incredibly long amount of time to run when compared to Feature/Integration and Unit tests.

Each of the previous types of tests have their pros and cons that should be weighed when considering the needs of your application and yourself. A good general sentiment to keep in mind when it comes to testing is ["Write tests. Not too many. Mostly integration"](https://kentcdodds.com/blog/write-tests).

## Test-Driven Development

It's now time that we get on with the reason you've cloned this application and gone through this guide in the first place, to learn about and practice test-driven development.

We will begin by implementing a set of API endpoints that can be used to create, read, update and delete To Do's from our configured storage using Laravel with it's [built in testing utilities](https://laravel.com/docs/9.x/http-tests) (based on [PHPUnit](https://github.com/sebastianbergmann/phpunit)).

After that is complete, we will work on implementing the front-end interactions a user would take when managing the aforementioned To Do's using [React](https://reactjs.org/docs/getting-started.html) with [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)/[Jest](https://jestjs.io/). Without further ado, let's just right into our first section.

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
