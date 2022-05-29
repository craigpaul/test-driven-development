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

After that we will also want to introduce a testing specific `.env` file called `.env.testing`. Doing this will [tell Laravel to use a specific set of environment variables when running tests](https://laravel.com/docs/9.x/testing#the-env-testing-environment-file) vs the environment variables used when accessing the application through a browser.

```bash
cp .env.example .env.testing
```

Before we can continue, you will need to make one small change to the `.env.testing` file. Our Docker environment will automatically create a database for testing purposes called `testing`, so we need to make sure that file will utilize the correct database. Replace `DB_DATABASE=test_driven_development` within `.env.testing` with `DB_DATABASE=testing`.

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

In addition to migrating that database, we will need to migrate the testing database, which can be accomplised by running the following command:

```bash
./develop artisan migrate --env=testing
```

### Preview

Lastly, let's take a quick look at the initial state of the application in the browser. If you've followed up to this point, you should be able to open up a browser and navigate to [http://localhost/](http://localhost/). You should see a box with a text input that states "What needs to be done?" in front of you. With that, we are good to start.

## Project

The project that we will be building is an incredibly simplified version of [TodoMVC](https://todomvc.com/), which if it's not obvious, is a To Do list application. 

We will be going through building out the server side endpoints to handle our database interactions (creating, reading, updating, deleting) and returning usable data to the front-end. Following that we will be building out the interactions on the front-end (the UI is already pre-built to save time, you just have to assemble it ... ![Ikea](/resources/images/ikea.png) !).

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

Before we jump into writing any code, let's first take a look at the general structure of [the pre-existing test file](/tests/Feature/CanPerformVariousActionsWithToDosTest.php). Each test lays out an expected case that we are wanting to cover, and does so with a specific format called [Arrange, Act, Assert](https://automationpanda.com/2020/07/07/arrange-act-assert-a-pattern-for-writing-good-tests/). This is an incredibly powerful (but simple) pattern for writing *good* tests. The process follows a very prescribed order of operations, such as the following:

1. Arrange inputs and targets. Arrange steps should set up the test case. Does the test require any objects or special settings? Does it need to prep a database? Does it need to log into a web app? Handle all of these operations at the start of the test.

2. Act on the target behavior. Act steps should cover the main thing to be tested. This could be calling a function or method, calling a REST API, or interacting with a web page. Keep actions focused on the target behavior.

3. Assert expected outcomes. Act steps should elicit some sort of response. 
Assert steps verify the goodness or badness of that response. Sometimes, assertions are as simple as checking numeric or string values. Other times, they may require checking multiple facets of a system. Assertions will ultimately determine if the test passes or fails.

With that out of the way, let's get down to writing our first test. When thinking in an Arrange, Act, Assert fashion for "creating a new to do", the easiest place to start is probably with the idea of "what makes up a To Do". If we look at [the model](/app/Models/ToDo.php) and [the migration](/database/migrations/2022_05_18_121643_create_to_dos_table.php) we can see that it has two main attributes, a string title to hold the user provided action to take place and flag representing whether it has been completed or not. It does not make sense that a new To Do would already be completed, so we would only want to be supplying the title of the To Do when we are creating it. 

In order to do this, we will want the ability to generate fake data. Laravel offer's a `WithFaker` trait out of the box that you can attach to this class to have access to [FakerPHP](https://fakerphp.github.io/). *Be aware of the type being returned from FakerPHP as we will want a string, but depending what you chose, you might need to instruct FakerPHP to give you a string through the use of a method argument.* Now that we have a fake To Do title we can utilize, we have completed our Arrange step.

Next up, we will fill out our Act step. In a typical Feature/Integration test within Laravel, the Act step will usually contain code to make an HTTP request in the same manner that a user would be triggering from their end. For our purposes, we want to make a POST request with some information to an endpoint that will be used to create a new To Do. Laravel exposes an [easy way to reference routes](https://laravel.com/docs/9.x/routing#generating-urls-to-named-routes) by a static [string-based name](https://laravel.com/docs/9.x/routing#named-routes). We will use a conventional name and define the route later once we have finished the writing the test. With that, we have completed our Act step.

Finally, we will make any assertions to prove our expected flow has completed successfully. When we are talking about APIs and the contracts they form between the backend and the front-end, an important item to keep in mind is the status code returned from the server. Being the good developers we are, we will want to signal to the application that a To Do has indeed been created by asserting that the status returned with the response was a `201 Created` using a helpful method provided off of the `TestResponse` returned to us when we made the request. The front-end will likely want to receive an updated set of attributes once we've created the new To Do, so we should add an assertion that we have returned some JSON matching a format that we deem will work. The last thing we will want to verify is that a record was indeed stored with the expected attributes. Once again Laravel's built in testing utilies offers an easy way to do this.

Congratulations, you've (maybe) just finished writing your first test in a test-driven development fashion. Now that we have our test, it's time to run it. You can accomplish this with the following command:

```bash
./develop artisan test --filter testCanCreateNewToDo
```

Oh no, a failing test ![Ahhhhhhhhh](/resources/images/ahhhhhhhhh.gif)! That's ok, it was completely expected. This is actually a core tenant of how test-driven development is executed. Write a failing test, run the test, write the code to make it pass. Let's take a look at the error and see what we can do to move past it.

Our initial error is saying that the route we've provided to the `postJson` method doesn't exist, so let's define it now. In `routes/api.php` we can [define a route matching the name](https://laravel.com/docs/9.x/routing#named-routes) that we provided in the test with an action. What is an action you ask? That is the controller that will be handling incoming requests to that endpoint. Before we define this route, we might as well take a moment to create a controller that this endpoint can use. Using the artisan command line interface you can automatically generate a controller by opening your terminal and typing the following command:

```bash
./develop artisan make:controller ToDoController -r
```

Take notice of the `-r` option being provided in the above command. This will generate a controller stub with methods corresponding to the various RESTful verbs. For now, just know that we won't require all these methods to fill out this controller, so you can remove the `create`, `show`, and `edit` methods. *One more thing to note is that the generated controller stub contains [a reference to a parent class](https://laravel.com/docs/9.x/controllers#basic-controllers) that does not exist in this application. You can safely remove this extension as we will not need any features that the parent class usually provides.*.

Now we can safely provide the action for our new route. Let's point this route to the store method on the ToDoController and give our test another run to see where we are at.

Our next error states that we aren't returning a `201 Created` response, but rather a `200 OK`. We can resolve that by returning [a JSON response](https://laravel.com/docs/9.x/responses#json-responses) with [a specific status](https://laravel.com/docs/9.x/responses#response-objects) matching the one we expect.

Now we are seeing that we have passed the incorrect status error, but are running into a new error stating that our response structure doesn't match. For now, we can supply fake data matching the expected structure to move past this issue.

We've now arrived at our last error (for now). This exception tells us that nothing in our database matches the attributes we supplied in the test. We can now utilize our [Eloquent Model to insert the provided information](https://laravel.com/docs/9.x/eloquent#inserts) into the database.

Boom! That is the whole test-driven development process successfully completed! Now you might be saying, hold on a second there ... we're still returning fake data from the endpoint, and you'd be correct. Now I want you to take a second to figure out how you can prove that we're receiving the correct information back in the response before we call this endpoint a success and move onto the next one. Great job!

If you would like to take a look at an example solution to this chapter, feel free to switch to `feature/creating-a-new-to-do`.

#### 2. Read Existing To Do's

Now that we're all adept with test-driven development, we can jump right into our next chapter, which will involve reading and returning existing To Do's as a JSON response. As with the previous chapter, we should start off thinking of what we require in our Arrange step. In order to return existing To Do's ... we need existing To Do's, so let's create them.

Laravel offers a concept called [Model Factories](https://laravel.com/docs/9.x/database-testing#defining-model-factories) to help us quickly generate fake models, [persisted to the database](https://laravel.com/docs/9.x/database-testing#creating-models-using-factories) or [in memory](https://laravel.com/docs/9.x/database-testing#instantiating-models), to use in our tests. A factory has already been defined for our ToDo model, so we can use that to create a few ToDo models during the Arrange step of our test. Now that we have persisted a handful of To Do's to the storage, we can move on to the Act step.

As with the previous chapter's Act step, we are again going to make an HTTP request. This time it will be to the route that would normally be responsible for listing out resources. *See if you can figure out which one that is.*. With that we have completed the Act step.

Finally, we will make any assertions to prove our expected flow has completed successfully. This time around we don't want to assert that we have received a `201 Created` response since we are not expecting to create a new To Do. This time around we are hoping to receive a `200 OK` response. The purpose behind fetching a listing of To Do's in this application is to display them to the end-user, so we will want to make sure we are sending back the To Do's we created in the Arrange step in a structure that makes the most sense. Once again Laravel's built in testing utilies offers an easy way to do this.

Whew! We're already done writing that test, that one flew by so fast! Now that we have our test, it's time to run it. You can accomplish this with the following command:

```bash
./develop artisan test --filter testCanReadExistingToDos
```

It should be no surprise that this has resulted in a failure, right? ... Good. This should be a familiar error as it's the first one we ran into last time. We need to define our route, so it's back to `routes/api.php` we go.

Now that we have defined our route and re-run our tests we notice that we've skipped right over our response status assertion. Why did that happen ![wut](/resources/images/wut.jpg)? Under the hood, Laravel converts the return value from a controller into a response if it isn't already one. That means you *could* return a multitude of different values. In this case, a void return will result in an empty `200 OK` response. With that out of the way, we are now able to see that we're not matching the expected JSON structure. Let's set up a response with some fake data in the same manner as the previous chapter.

Wonderful, now that we're returning the expected structure, we can see that we're missing the actual expected values. Let's go ahead and retrieve the To Do's from storage that we're expecting and return them in the response.

You may or may not have run into an error stating that we are not returning a boolean for the completed attribute (depending on how you wrote your test and your controller action). This is a good opportunity to tell our ToDo model to [cast the completed attribute to a boolean](https://laravel.com/docs/9.x/eloquent-mutators#attribute-casting), so we don't have to do this manually.

Oh heck ya bud! That chapter flew by so fast! Congratulations on completing another chapter.

If you would like to take a look at an example solution to this chapter, feel free to switch to `feature/reading-existing-to-dos`.

#### 3. Update an Existing To Do

Our next chapter will involve updating our existing To Do's and returning the updated values as a JSON response. For this chapter, we're going to focus on marking a ToDo as complete. Let's start off again with a familiar first step of test-driven development, the Arrange step. Similar to the previous chapter, in order to update an existing To Do ... we need an existing To Do, so let's create it.

Let's use our ToDo model factory that we used in the previous chapter to quickly generate our To Do that we wish to update. If you re-call, our model factory is set up to provide a random boolean to the `completed` attribute, which will cause a consistency problem for the scenario we're going to test. There are a couple of options we can choose from to prevent this problem. We could [override the default attributes on the model factory](https://laravel.com/docs/9.x/database-testing#persisting-models), but this is a one off solution, meaning everytime we want to mark a ToDo as not completed within our test cases, we would have to manually pass in that attribute value which will get annoying quickly. A better option in this case is to [add a factory state to our ToDo model factory](https://laravel.com/docs/9.x/database-testing#factory-states). In this case, we'd want to add a state called `incomplete` where the `completed` attribute is **always** false. After we've added this factory state, let's go back and update our test so that our model is going to for sure be incomplete.

I'm sure that you know whats next ... the Act step! At this point, it should be no surprise that we're going to make an HTTP request to mark a given To Do as completed. That means we will be using the route that would be normally responsible for updating a single resource. *I'll let you re-review the HTTP verbs to figure out what that route and controller action should be*. With that we have completed the Act step.

I am once again asking you to make some assertions to prove our expected flow has completed successfully! When you're updating a resource in a REST API, the conventional response status to expect is a `200 OK` (as we did in the last chapter). In order to remain consistent with other endpoint's, we will want to make sure we are sending back the To Do with the most up-to-date attributes in the same structure. The last thing we will want to verify is that the expected record was indeed updated with the expected attributes.

We're done writing that test at this point. Now we can run it using the following command:

```bash
./develop artisan test --filter testCanUpdateExistingToDo
```

At this point I'm betting before you even ran the test, you had an inclination that there was going to be a failure? And I'm betting you knew what that failure was going to be! Well then, let's wait no longer and define our route. Open up the `routes/api.php` file and we will be on our way. *Keep in mind that we are working with a single resource in this case, and take a second to think how that URL would represent that kind of a request*.

Now that we've cleared up that error, we can see that we are not returning the expected JSON structure. Let's set up a response with some fake data in the same manner as we've done previously.

Good news everyone ![good news everyone](/resources/images/good-news-everyone.jpg)! We're returning the expected structure, but we're missing the actual expected values (just like the previous chapter). Let's go ahead and fetch our To Do from storage and swap out the fake data with our real data.

Notice that we are still not past the error that's telling us we're not sending the correct data. For the moment, let's fake the return value so we can get past this error and see what we need to do next.

Huzzah! Another error down for the count. Now we know that we're not properly persisting the provided changes within the request body. Let's go ahead and [update our model](https://laravel.com/docs/9.x/eloquent#updates) with the expected change(s). Since we're such good developers, we can also replace our (once again) faked data with the real data as well.

Oh yeah! A passing test, time to party! Before we move on, let's discuss the fact that this endpoint is currently only able to change the completed attribute of the To Do. That's *sort of* useful, but it wouldn't help provide the best experience for the end user. *See if you can write another test on your own that will allow for updating the title attribute without breaking the existing test we just wrote*.

If you would like to take a look at an example solution to this chapter, feel free to switch to `feature/updating-an-existing-to-do`.

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
