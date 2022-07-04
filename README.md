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

After this has finished building, you will want to install your JavaScript dependencies using the same `develop` script. *This can take quite a few minutes as it is being run inside of the container*.

```bash
./develop yarn
```

Before we move onto setting up the database, let's take a second to compile our static assets. *You can use either `dev` or `watch` here, depending on what you want to do. The `watch` command will continually recompile your changes, should you have the desire to keep checking your progress via the browser*.

```bash
./develop yarn dev
```

### Database

As part of our Docker setup, we included a MariaDB database. Let's run our migrations now in order to populate the correct database schema. Open your terminal and change into the root directory of this application.

```bash
./develop artisan migrate
```

In addition to migrating that database, we will need to migrate the testing database, which can be accomplished by running the following command:

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

After that is complete, we will work on implementing the front-end interactions a user would take when managing the aforementioned To Do's using [React](https://beta.reactjs.org/learn) with [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)/[Jest](https://jestjs.io/). Without further ado, let's jump right into our first section.

### Laravel and PHPUnit

#### 1. Creating a New To Do

Before we jump into writing any code, let's first take a look at the general structure of [the pre-existing test file](/tests/Feature/CanPerformVariousActionsWithToDosTest.php). Each test lays out an expected case that we are wanting to cover, and does so with a specific format called [Arrange, Act, Assert](https://automationpanda.com/2020/07/07/arrange-act-assert-a-pattern-for-writing-good-tests/). This is an incredibly powerful (but simple) pattern for writing *good* tests. The process follows a very prescribed order of operations, such as the following:

1. Arrange inputs and targets. Arrange steps should set up the test case. Does the test require any objects or special settings? Does it need to prep a database? Does it need to log into a web app? Handle all of these operations at the start of the test.

2. Act on the target behavior. Act steps should cover the main thing to be tested. This could be calling a function or method, calling a REST API, or interacting with a web page. Keep actions focused on the target behavior.

3. Assert expected outcomes. Act steps should elicit some sort of response. 
Assert steps verify the goodness or badness of that response. Sometimes, assertions are as simple as checking numeric or string values. Other times, they may require checking multiple facets of a system. Assertions will ultimately determine if the test passes or fails.

With that out of the way, let's get down to writing our first test. When thinking in an Arrange, Act, Assert fashion for "creating a new To Do", the easiest place to start is probably with the idea of "what makes up a To Do". If we look at [the model](/app/Models/ToDo.php) and [the migration](/database/migrations/2022_05_18_121643_create_to_dos_table.php) we can see that it has two main attributes, a string title to hold the user provided action to take place and flag representing whether it has been completed or not. It does not make sense that a new To Do would already be completed, so we would only want to be supplying the title of the To Do when we are creating it. 

In order to do this, we will want the ability to generate fake data. Laravel offer's a `WithFaker` trait out of the box that you can attach to this class to have access to [FakerPHP](https://fakerphp.github.io/). *Be aware of the type being returned from FakerPHP as we will want a string, but depending what you chose, you might need to instruct FakerPHP to give you a string through the use of a method argument*. Now that we have a fake To Do title we can utilize, we have completed our Arrange step.

Next up, we will fill out our Act step. In a typical Feature/Integration test within Laravel, the Act step will usually contain code to make an HTTP request in the same manner that a user would be triggering from their end. For our purposes, we want to make a POST request with some information to an endpoint that will be used to create a new To Do. Laravel exposes an [easy way to reference routes](https://laravel.com/docs/9.x/routing#generating-urls-to-named-routes) by a static [string-based name](https://laravel.com/docs/9.x/routing#named-routes). We will use a conventional name and define the route later once we have finished the writing the test. With that, we have completed our Act step.

Finally, we will make any assertions to prove our expected flow has completed successfully. When we are talking about APIs and the contracts they form between the back-end and the front-end, an important item to keep in mind is the status code returned from the server. Being the good developers we are, we will want to signal to the application that a To Do has indeed been created by asserting that the status returned with the response was a `201 Created` using a helpful method provided off of the `TestResponse` returned to us when we made the request. The front-end will likely want to receive an updated set of attributes once we've created the new To Do, so we should add an assertion that we have returned some JSON matching a format that we deem will work. The last thing we will want to verify is that a record was indeed stored with the expected attributes. Once again Laravel's built in testing utilies offers an easy way to do this.

Congratulations, you've (maybe) just finished writing your first PHP test in a test-driven development fashion. Now that we have our test, it's time to run it. You can accomplish this with the following command:

```bash
./develop artisan test --filter testCanCreateNewToDo
```

Oh no, a failing test ![Ahhhhhhhhh](/resources/images/ahhhhhhhhh.gif)! That's ok, it was completely expected. This is actually a core tenant of how test-driven development is executed. Write a failing test, run the test, write the code to make it pass. Let's take a look at the error and see what we can do to move past it.

Our initial error is saying that the route we've provided to the `postJson` method doesn't exist, so let's define it now. In `routes/api.php` we can [define a route matching the name](https://laravel.com/docs/9.x/routing#named-routes) that we provided in the test with an action. What is an action you ask? That is the controller that will be handling incoming requests to that endpoint. Before we define this route, we might as well take a moment to create a controller that this endpoint can use. Using the artisan command line interface you can automatically generate a controller by opening your terminal and typing the following command:

```bash
./develop artisan make:controller ToDoController --api
```

Take notice of the `--api` option being provided in the above command. This will generate a controller stub with methods corresponding to the various RESTful verbs that would typically be used in an API controller. *One more thing to note is that the generated controller stub contains [a reference to a parent class](https://laravel.com/docs/9.x/controllers#basic-controllers) that does not exist in this application. You can safely remove this extension as we will not need any features that the parent class usually provides*.

Now we can safely provide the action for our new route. Let's point this route to the store method on the ToDoController and give our test another run to see where we are at.

Our next error states that we aren't returning a `201 Created` response, but rather a `200 OK`. We can resolve that by returning [a JSON response](https://laravel.com/docs/9.x/responses#json-responses) with [a specific status](https://laravel.com/docs/9.x/responses#response-objects) matching the one we expect.

Now we are seeing that we have passed the incorrect status error, but are running into a new error stating that our response structure doesn't match. For now, we can supply fake data matching the expected structure to move past this issue.

We've now arrived at our last error (for now). This exception tells us that nothing in our database matches the attributes we supplied in the test. We can now utilize our [Eloquent Model to insert the provided information](https://laravel.com/docs/9.x/eloquent#inserts) into the database.

Boom! That is the whole test-driven development process successfully completed! Now you might be saying, hold on a second there ... we're still returning fake data from the endpoint, and you'd be correct. Now I want you to take a second to figure out how you can prove that we're receiving the correct information back in the response before we call this endpoint a success and move onto the next one. Great job!

If you would like to take a look at an example solution to this chapter, feel free to switch to `feature/PHP-1-creating-a-new-to-do`.

#### 2. Read Existing To Do's

Now that we're all adept with test-driven development, we can jump right into our next chapter, which will involve reading and returning existing To Do's as a JSON response. As with the previous chapter, we should start off thinking of what we require in our Arrange step. In order to return existing To Do's ... we need existing To Do's, so let's create them.

Laravel offers a concept called [Model Factories](https://laravel.com/docs/9.x/database-testing#defining-model-factories) to help us quickly generate fake models, [persisted to the database](https://laravel.com/docs/9.x/database-testing#creating-models-using-factories) or [in memory](https://laravel.com/docs/9.x/database-testing#instantiating-models), to use in our tests. A factory has already been defined for our ToDo model, so we can use that to create a few ToDo models during the Arrange step of our test. Now that we have persisted a handful of To Do's to the storage, we can move on to the Act step.

As with the previous chapter's Act step, we are again going to make an HTTP request. This time it will be to the route that would normally be responsible for listing out resources. *See if you can figure out which one that is*. With that we have completed the Act step.

Finally, we will make any assertions to prove our expected flow has completed successfully. This time around we don't want to assert that we have received a `201 Created` response since we are not expecting to create a new To Do. This time around we are hoping to receive a `200 OK` response. The purpose behind fetching a listing of To Do's in this application is to display them to the end-user, so we will want to make sure we are sending back the To Do's we created in the Arrange step in a structure that makes the most sense. Once again Laravel's built in testing utilies offer an easy way to do this.

Whew! We're already done writing that test, that one flew by so fast! Now that we have our test, it's time to run it. You can accomplish this with the following command:

```bash
./develop artisan test --filter testCanReadExistingToDos
```

It should be no surprise that this has resulted in a failure, right? ... Good. This should be a familiar error as it's the first one we ran into last time. We need to define our route, so it's back to `routes/api.php` we go.

Now that we have defined our route and re-run our tests we notice that we've skipped right over our response status assertion. Why did that happen ![wut](/resources/images/wut.jpg)? Under the hood, Laravel converts the return value from a controller into a response if it isn't already one. That means you *could* return a multitude of different values. In this case, a void return will result in an empty `200 OK` response. With that out of the way, we are now able to see that we're not matching the expected JSON structure. Let's set up a response with some fake data in the same manner as the previous chapter.

Wonderful, now that we're returning the expected structure, we can see that we're missing the actual expected values. Let's go ahead and retrieve the To Do's from storage that we're expecting and return them in the response.

You may or may not have run into an error stating that we are not returning a boolean for the completed attribute (depending on how you wrote your test and your controller action). This is a good opportunity to tell our ToDo model to [cast the completed attribute to a boolean](https://laravel.com/docs/9.x/eloquent-mutators#attribute-casting), so we don't have to do this manually.

Oh heck ya bud! That chapter flew by so fast! Congratulations on completing another chapter.

If you would like to take a look at an example solution to this chapter, feel free to switch to `feature/PHP-2-reading-existing-to-dos`.

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

If you would like to take a look at an example solution to this chapter, feel free to switch to `feature/PHP-3-updating-an-existing-to-do`. You can also see an example solution to allowing updating the title attribute if you switch to `feature/PHP-3-updating-the-title-of-an-existing-to-do`.

#### 4. Delete an Existing To Do

Wow! Hard to believe we've already arrived at our final chapter of our test-driven development lessons for Laravel and PHPUnit. Up to this point, we've fulfilled three out out of the four portions of [the CRUD actions](https://developer.mozilla.org/en-US/docs/Glossary/CRUD). As a quick review, CRUD (Create, Read, Update, Delete) is an acronym for ways one can operate on stored data. It is a mnemonic for the four basic functions of persistent storage. CRUD typically refers to operations performed in a database or datastore, but it can also apply to higher level functions of an application such as soft deletes where data is not actually deleted but marked as deleted via a status.

That means it's now time to add the ability to delete a To Do. As we've done three times before, we will start off with our Arrange step. In a similar manner to the previous chapter, in order to delete an existing To Do ... we need an existing  To Do, so let's create it.

This time around we don't need anything special for our ToDo model factory, so we can just create a new fake To Do and move on to our Act step!

I don't think I need to tell you what we're going to do here ... SURPRISE! We're making an HTTP request to delete a To Do. As with previous routes, we're sticking to [the RESTful HTTP methods](https://restfulapi.net/http-methods/). This time, we're going to utilize [the DELETE method](https://restfulapi.net/http-methods/#delete). Now that we've made our DELETE request, we are good to move onto our next step.

Depending on your use case, the response status/structure of the DELETE endpoint can change. For the purpose of this application we should be safe to assume that we do not need to return any content in our response. This means we want to return a `204 No Content` status with an empty body. In order to verify that the correct actions have taken place, we need to reach for Laravel's built in testing utilities to understand that our expected To Do no longer exists in storage. 

Maybe this is surprising to you, maybe it's not ... but we're done with this test! You can run it using the following command:

```bash
./develop artisan test --filter testCanDeleteExistingToDo
```

I know at this point you're probably thinking ... well I know exactly what your going to say and exactly what is going to happen the moment I run the test! Perhaps I should just ["do the thing"](https://www.youtube.com/watch?v=ojhTu9aAa_Y). While you might be tempted to, I'd urge you to continue working through errors one at a time for now. There will come a time later in your career where you feel absolutely comfortable with test-driven development to know and understand that you can skip a few steps, but this will take lot's of practice to ensure you don't do anything unnecessary. *[Make it work, make it right, make it fast](https://thetombomb.com/posts/make-it-work-right-fast)*. In this context, it refers to your skills in applying *proper* test-driven development. Keep at it, and it will become second nature.

With that out of the way, now we know that we have to define our route for deleting an existing To Do. Open up the `routes/api.php` file and start typing! *As with the previous chapter, keep in mind that we are working with a single resource in this case, and take a second to think how that URL would represent that kind of a request*.

If you recall back from Chapter 2, the default response of an empty Laravel controller action will be a `200 OK` which we see here as our first error. Let's start off by returning a `204 No Content` response. Luckily, Laravel's built in `ResponseFactory` has a nicely abstracted method for returning just such a response. *See if you can deduce just what that method name would be*.

Next we see that our To Do isn't actually being deleted, which isn't a very good thing for our DELETE action to not be doing. Let's go ahead and [implement that deletion](https://laravel.com/docs/9.x/eloquent#deleting-models).

Oh my gosh, I think I have whiplash! We finished that chapter so fast!

If you would like to take a look at an example solution to this chapter, feel free to switch to `feature/PHP-4-delete-an-existing-to-do`.

#### Conclusion

Amazing job so far! You've completed your introduction into test-driven development using [Laravel](https://laravel.com/docs/9.x/http-tests) and [PHPUnit](https://github.com/sebastianbergmann/phpunit). Give yourself a huge pat on the back!

As a quick review of your accomplishments so far, we've successfully implemented a handful of endpoints to satisfy the necessary CRUD actions that a To Do list application would require. We are now ready to move onto our front-end application which we will be building in a test-driven development fashion using [React](https://beta.reactjs.org/learn) and [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)/[Jest](https://jestjs.io/).

When you're ready, let's move on to the next section.

### React and Testing Library/Jest

#### 1. Creating a New To Do

Before we jump into writing any code, let's first take a look at the general structure of [the pre-existing test file](/resources/js/components/App.test.jsx). As with our Laravel/PHPUnit tests, each test lays out an expected use case that we are wanting to cover, and does so with a specific format called [Arrange, Act, Assert](https://automationpanda.com/2020/07/07/arrange-act-assert-a-pattern-for-writing-good-tests/). You'll find that this structure will work in a very similar fashion to your PHP tests from the previous section, but you'll sometimes end up with assertions mixed in between your actions being taken (depending on the level of testing you're performing).

You've surely noticed the drastic difference in boilerplate code between the PHP tests vs the JavaScript tests. [Jest is a test runner that focuses more on simplicity](https://jestjs.io/). With that in mind, we might want to take a quick look at the [various "global" functions](https://jestjs.io/docs/api) available when writing a Jest test. The important one to focus on for now is [`test` (which is aliased as `it`)](https://jestjs.io/docs/api#testname-fn-timeout) as this function is how you set up a test case (which is why we're all here, right?).

An important point to keep in mind when writing JavaScript tests with [(React) Testing Library](https://testing-library.com/docs/react-testing-library/intro) is that our focus shifts more to [how a user would interact with the application/components in question](https://testing-library.com/docs/guiding-principles), as opposed to how we wrote our PHP tests. Also unlike our PHP tests, we won't have any sort of API mocking available out of the box with Testing Library/Jest. This is very important to keep in mind since (like the majority of web applications) we will be communicating with the API we build in the previous section. If we don't handle some way of mocking our API, we are implicitly coupling our web application to the API and it will be required to run any sort of tests. In a real-life situation, you might not have the API already built, but rather a specification of the expected inputs and outputs for the API. By utilizing a library such as [Mock Service Worker](https://mswjs.io/) we can enable a flow where the front-end and back-end can be worked on simultaneously. We will be making use of this library to intercept our API calls and return fake data in response, just as if it was the real API responding. *We won't be doing it here, but if you want to look into it, Mock Service Worker can also [run in the browser](https://mswjs.io/docs/getting-started/integrate/browser), making your web application completely usable without the actual API being available while you're developing locally*.

With that out of the way, let's get down to writing our first test. When thinking about what needs to happen during the Arrange step in order to allow for "creating a new To Do" to work, we should probably start with handling the communication between the server and the web application. The [boilerplate for setting up Mock Service Worker](https://mswjs.io/docs/getting-started/integrate/node) has already been handled for you, so we can jump right into the more interesting part of [writing a request handler and response resolver](https://mswjs.io/docs/getting-started/mocks/rest-api). A common pattern you might seen with these handlers/resolvers is to make a readable helper function that you can re-use across tests, as opposed to writing the handler/resolver directly in the test(s).

In order to do this, let's create a helper function that will set up a successful To Do creation endpoint. This will involve pulling in `faker` from [@faker-js/faker](https://www.npmjs.com/package/@faker-js/faker) as well as the `rest` and `server` variables from the [mocks/server](/resources/js/mocks/server.js) file. Once you have set up a request handler and response resolver to return a fake To Do, we can move on. *Remember to match your expected endpoint and JSON structure you created in the previous section. Also, be sure to return your fake To Do from your helper function so we can use it in our test(s)*.

The next thing we need during our Arrange step is to set up "our world". What does that mean you might ask? Every web application is created using the same basic building blocks. HTML, CSS and JavaScript. In order for anything to function, we need to have our React components (aka HTML) being rendered into a document so we can make our assertions. Testing Library offers this in a convenient and [easy to use API](https://testing-library.com/docs/react-testing-library/api#render). For our purposes, we will only be rendering a simple tree using the top level `<App />` component and the associated context provider. *Don't worry too much if you're unsure of what exactly a context provider is just yet, that will make more sense as we delve deeper into React*. Now that we've successfully mocked our API interaction and the fake To Do that it will send back to us, as well as rendered our application, we can move onto the next step!

In a Testing Library/Jest test, the Act step and the Assert step are very important and can often be some what intertwined. This portion of your test is where you have to stop thinking like a developer and start thinking like an end user. What would the end user of this application do in order to accomplish the task at hand (creating a new To Do). As you practice this process, in combination with test-driven development, you'll start to notice your tests give you some pretty awesome benefits. You will be less likely to [test implementation details](https://kentcdodds.com/blog/testing-implementation-details) because your implementation doesn't exist yet, which leads to stronger tests that offer greater refactorability.

With that in mind, let's start thinking about what a user would do to create a new To Do. Typically, you'd provide a value stating what the To Do is for (the title, if we're talking strictly about the schema we already had set up) and then you would submit that value to the server so it could do whatever it needs with it. Well ... let's do exactly that. Testing Library offers [a range of different queries](https://testing-library.com/docs/queries/about/) through the `screen` object, but they wisely [prescribe a priority](https://testing-library.com/docs/queries/about/#priority) on those queries which you should think about before querying the DOM. To help ensure your application is as accessible as possible by the widest range of end-users, they suggest you use the [ByRole queries](https://testing-library.com/docs/queries/byrole/) as they can be used to query against every element that is exposed in the accessibility tree. Let's find our text input so we can enter a value into it and submit the form. *See if you can figure out what the correct role for the input element is from [the ARIA in HTML specification](https://www.w3.org/TR/html-aria/#docconformance)*. Now that we have our element (and we've guaranteed that using a `getByRole` query, hopefully) it's time to fill in and submit that form. To do that, Testing Library offers a package called `@testing-library/user-event` (which has already been pre-installed) to handle the majority of actions a real user would normally do within a web application. Let's use this to type the fake To Do title into the input and then have the user type the "Enter" key within the input in order to trigger a submit. Just like that, we've finished up the Act step!

Finally, we will make any assertions to prove our expected flow has completed successfully. If you think about what you'd expect to happen in a To Do list application after you create a new To Do, what would that be? The likeliest answer is that it would display a list with the matching To Do as a list item within that list, right? Sounds like a pretty solid plan, let's go ahead and add some assertions to match our plan. After the user submits the form we instinctively know that means that an HTTP request will be made to our API, so that means we'll be waiting a certain amount of time for the response to come back in the real world, so we need a way to do the same here. Testing Library exposes a couple of [helpful functions to allow you to wait for something to happen or to appear](https://testing-library.com/docs/guide-disappearance#waiting-for-appearance). We can either use a `findBy` query or a wrap some logic within a `waitFor` callback. The choice here is usually pretty dependant on your use case, but in this case, we are waiting for a list to appear, so we should be pretty safe to utilize a `findByRole` query so we can wait for the list to appear. *Take note of the difference between the `getBy`/`queryBy` queries when compared to the `findBy` queries. The `findBy` query is an asynchronous function that will automatically wait for the element you're attempting to find to appear (with a reasonable timeout) whereas the other two will not retry their queries*. Next we want to look for the matching list item that we expect to be within the list. It is sometimes handy to scope your queries within a specific element depending on the size of the component tree currently being tested. Luckily, [Testing Library supplies an easy abstraction to handle just that case](https://testing-library.com/docs/dom-testing-library/api-within/). Using the `within` utility, we can look for a list item matching the title of the To Do within the list that we previously queried. *See if you can figure out how to query for the correct role and match it with the name of the To Do*. We are just about done writing our first Testing Library/Jest test, but what good is a test if it doesn't contain any assertions!? Now seems like a good time to add some assertions. In our case, we simply want to verify that the [list and the list item are in the document](https://github.com/testing-library/jest-dom#tobeinthedocument). Before we move on, there is one small usability item we might want to think about and test for. After a successful form submission, the input would still contain the title we originally typed into it ... that's not super awesome. Let's assert that the input's value gets [reset back to an empty string](https://github.com/testing-library/jest-dom#tohavevalue) and [is focused](https://github.com/testing-library/jest-dom#tohavefocus).

Congratulations, you've (maybe) just finished writing your first JavaScript test in a test-driven development fashion. Now that we have our test, it's time to run it. You can accomplish this with the following command:

```bash
./develop yarn test -t 'can create a new to do'
```

Woah, a failing test ![Ahhhhhhhhh](/resources/images/ahhhhhhhhh.gif)! Just kidding! I know you were expecting that. After all, you're a veteran at this point. Let's take a look at the error and see what we can do to move past it.

Our initial error is saying that we are unable to find an element with the role of `list`. If we take a look at [the component we're testing](/resources/js/components/App.jsx), we can see that the `<List />` component is in the component tree, but it won't be rendered until we have at least one item to render. The next logic place to check out is the context provider where the items are stored, perhaps there will be some clues there as to how our items are propogated to our list. Looks as if it's just storing the items in state using [the useState hook from React](https://beta.reactjs.org/apis/usestate). Let's think for a second ... if we don't have any existing items to render our list ... where are we going to get them from? If we recall our expected flow in the test we just wrote, we are submitting a form with the expectation that after that request has returned a response, that the list will be shown! Seems as though the form is the correct place to start.

Submitting forms in React has been a hotly contested debate over the years, with every John and Jane developer you talk to having their own opinion on the matter. There are multiple libraries to assist with the matter as well. For this exercise, we'll be utilizing [react-hook-form](https://react-hook-form.com/) since it's a relatively easy library to understand and does a lot of the heavy lifting for us. In order to [get started](https://react-hook-form.com/get-started#Quickstart), we'll want to set up our event listener and register our input with a specific name (perhaps one that matches the agreed upon schema?). For now, it's probably enough to simply `console.log` the values being submitted by your test so we can see that we've set up the listener correctly.

You may have noticed something very odd in that `console.log` call when you ran your test. The input might have been missing a few characters from your title (as in all but one!). If this did indeed happen to you, now is a good time to take advantage of the other asynchronous utility we learned about earlier, `waitFor`. This has to do with certain incompatibilities between certain versions of Jest and Testing Library that are out of scope for this exercise, but we can adjust our test to work around it (and as such, strengthen our tests in the long run). In between typing the title of the To Do into the input and pressing the enter, we can "wait for" the input [to have a value](https://github.com/testing-library/jest-dom#tohavevalue) matching the To Do title. Huzzah! The logged message shows a much better looking title now.

Now that we have that out of the way, we can handle actually submitting a request to the server to create our new To Do. Way back in the day there were all sorts of HTTP clients you'd need to chose from to communicate with the back-end in an easy way, but that is now a thing of the past (for the majority of developers). Browsers come with a built in utility known as the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). *Take a few minutes to familiarize yourself with this API as it will prove very useful*. In order to submit the new To Do, we will [make a JSON POST request](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#uploading_json_data) with fetch to our expected endpoint. After receiving our response and converting it to JSON, we should add another `console.log` to see if we've successfully received our response and then we can go back and run our test.

You hopefully see the same error, but a log being printed out that contains the JSON structure you defined in your Mock Service Worker response resolver we set up earlier. If so, that's excellent! We're now one step closer to getting our list to show up. Since the To Do's are being stored in a React context, we will need to expose a way for consumers of that context to push an item onto the stack. *Before we continue, if you're unsure about React context, be sure to read [the documentation explaining what they are and how they work](https://beta.reactjs.org/learn/passing-data-deeply-with-context) and [this article on how to use them effectively](https://kentcdodds.com/blog/how-to-use-react-context-effectively)*.

With all that reading in mind, let's go ahead and expose a function through the context provider that allows us to push an item into the existing state and pass our newly created item through it. *See if you can figure out how to push an item into a piece of React state properly*.

Holy cow! We've moved onto the next error! You'll notice we have a handy little (pre-existing) `console.log` showing up now telling us that we have a single item in our list, but the actual list item not showing up yet. Coincidentally, that is exactly what our error message is telling us too! Perhaps we best take a look at the `<List />` component and see if we can figure out the best way forward.

Well well well... how the turn tables... as it turns out, we aren't rendering the items at all. Let's take a moment and see if we can figure out how to [display all the potential items within the list](https://beta.reactjs.org/learn/rendering-lists). While we're at it, we can remove that unnecessary `console.log` message. Now that we've got our pre-existing item component being rendered based on the items list, let's see what our test says.

Yes! That passed the previous error. Now we have an error stating that the form inputs value is not matching our expectations. There are a handful of ways to manipulate an input's value that are out of scope for this discussion, so we'll stick with [one](https://react-hook-form.com/api/useform/reset) of the [two](https://react-hook-form.com/api/useform/resetfield) options that our form library exposes. *See if you can reset the form field's value using the exposed functions*.

Awwwwwwww yis! It was a long road, but we now have a passing test and have provided our end users with the exciting new feature of being able to create a new To Do. Great job!

If you would like to take a look at an example solution to this chapter, feel free to switch to `feature/JS-1-creating-a-new-to-do`.

#### 2. Display Existing To Do's

Now that we're feeling a little more comfortable with test-driven development with Testing Library/Jest, we can jump right into our next chapter, which will involve displaying existing To Do's upon loading the application. As with the previous chapter, we should start off thinking of what we require in our Arrange step. In order to display existing To Do's ... we need to handle the communication between the server and the web application. Let's write a new request handler and response resolver for fetching existing To Do's!

In order to do this, let's create another helper function in the same manner as the previous chapter. Once you have set up a request handler and response resolver to return a few fake To Do's, we can move on. *Remember to match your expected endpoint and JSON structure you created in the previous section. Also, be sure to return your fake To Do's from your helper function so we can use it in our test(s)*.

As with the previous chapter, the next thing we need during our Arrange step is to set up "our world". This test will again only be rendering a simple tree using the top level `<App />` component and the associated context provider. Now that we've successfully mocked our API interaction and some fake To Do's that it will send back to us, as well as rendered our application, we can move onto the next step!

Let's take a second to think about what the user would be doing in order to see existing To Do's... well... nothing? That's right, the user would only be loading the page in this case, which is what we are doing when we pass our component tree to the `render` function. Give yourselves a pat on the back, you just completed the easiest Act step you'll ever do!

Now we will make a few assertions to prove that we are indeed seeing the correct To Do's being displayed. This time around we are not really interacting with the application in anyway, we are simply waiting for the list (and subsequent list items) to show up. *Recall back to the previous chapter how you can use asynchronous utilities to wait for an element to show up to*. One thing we might want to do once we have our list is verify that the [correct amount of list items](https://jestjs.io/docs/expect#tohavelengthnumber) are within that list. After that, we should confirm that they are actually the correct list items, perhaps by looping through the fake To Do's that we are returning from the API?

Now that we have our test, it's time to run it. You can accomplish this with the following command:

```bash
./develop yarn test -t 'can display existing to dos'
```

Unsurprisingly, we have a failing test! Let's take a look at the error and see what we can do to move past it.

Our initial error is saying that we are unable to find an element with the role of `list`. If you recall from the previous chapter, the list will only show up once we have items in state to display. In order to get those items, we need to make initiate some form of communication with the server to retrieve them.

Want to talk about another hotly contested subject in the React community? No? Well... too bad, cause we're going to. There has been lots of debate about where to trigger [side-effects](https://beta.reactjs.org/learn/keeping-components-pure#side-effects-unintended-consequences) within a React application, with the React core team being [the voice of reason as of late](https://beta.reactjs.org/learn/keeping-components-pure#where-you-can-cause-side-effects). That presents a problem, however, for initial loading of required data. There are solutions coming about in future versions of React, but for now we will stick with a tried and true method of fetching within a `useEffect` hook. *Perhaps you're unfamilar with the hook? Be sure to [read up on useEffect](https://overreacted.io/a-complete-guide-to-useeffect/) to get a leg up!*.

Are you back already? That was a pretty long article. Well... alright, let's get started! Since we're using our context provider to contain all of our logic related to our To Do's, it seems like a good place to fetch any existing To Do's. Let's add an effect that will trigger a GET request to the appropriate endpoint and then add the returned items to state. Once you've completed that, let's run our test and see if we've passed that error.

Huzzah! A passing test! That was pretty quick... almost too quick. Something might be nagging in the back of your brain saying "Hey!... wait a minute". Let's run all of our tests to confirm that nagging suspicion. You can accomplish this with the following command:

```bash
./develop yarn test
```

That nagging feeling is correct! We've just introduced a breaking change to our already written test for creating a To Do by causing a network failure. Since we were not previously fetching existing To Do's in that test, but have introduced the logic to do so here, we get a failure. This can be easily amended, however, by calling the same request handler / response resolver function in our first test. Let's add it and see what happens.

It's still failing, how can that be? Well, if you recall the original test, the list did not show up until the new To Do was created. With this change, however, the list will show up before we've had the opportunity to create the new To Do. Don't fret though, there are a couple of ways that we can handle this. We _could_ change the existing test to wait for the specific list item to be available, but that changes the conditions of the test and makes it more fragile. An alternative solution could be to adjust our helper function so that we can control how many fake To Do's get returned from the API. That would allow us to keep the original test conditions intact while ensuring the newly introduced API call does not introduce any unwanted side-effects. *See what you can come up with to allow for this configurability in order to prevent unwanted side-effects in our tests*.

We hit a little pot hole in the road, but we got to our destination all the same. Great work!

If you would like to take a look at an example solution to this chapter, feel free to switch to `feature/JS-2-display-existing-to-dos`.

#### 3. Mark an Existing To Do as Completed

Our next chapter will involve allowing the end-user to mark an existing To Do as completed. Let's start off thinking of what should happen in our Arrange step. Just like the previous chapter, we will need to handle the communication between the server and the web application to ensure there are existing To Do's to actually mark as completed. Luckily, we already wrote a helper function to do this for us in the last chapter! One thing that might be bugging you about this function though, is that the completed attribute is completely random, and if there is one thing that causes havok on a test involving very specific conditions, it's random data! *See if you can figure out a way to conditionally ensure all To Do's are given a specific completed value*.

As with the previous chapter, the next thing we need during our Arrange step is to set up "our world". This test will again only be rendering a simple tree using the top level `<App />` component and the associated context provider. Now that we've successfully mocked our API interaction and some fake To Do's that it will send back to us, as well as rendered our application, we can move onto the next step!

In order for the user to mark an existing To Do as complete, we need to ensure the To Do's are actually showing up on the screen. *Recall back to the previous chapter how you can use asynchronous utilities to wait for an element to show up to*.

Now that we've successfully found our list of To Do's and the specific To Do we're going to update, it's time to take action! Within our To Do's list item, we have a checkbox that the user can update. *See if you can figure out how to click a checkbox using the utilities provided to you by Testing Library*.

Now that we've had the end-user click the checkbox, we need to assert that what we expect to happen afterwards has indeed happened. In this case, the label associated with our checkbox is going to render an SVG inside of it to indicate that it's been completed. In the accessibility tree, SVG elements don't actually have a traditional role as with most elements, which means we have to utilize [a different style of query](https://testing-library.com/docs/queries/about/#priority). The best query to reach for in this case is the [ByTitle query](https://testing-library.com/docs/queries/bytitle/). *See if you can add a title to the SVG (that makes sense) and ensure it shows up once the To Do has been completed. Keep in mind the usage of asynchronous utilities to wait for an element to show up to*.

Now that we have our test, it's time to run it. You can accomplish this with the following command:

```bash
./develop yarn test -t 'can mark a to do as completed'
```

I'm sure it's no surprise, but we have a failing test! Let's dig in and see what we can do to move past it.

Our initial error is saying that we are unable to find an element matching the title we just added to our SVG. How can that be? We clicked the checkbox. Well, currently that checkbox is actually not causing any sort of state updates, so we need to trigger that state update. 

Before we dig into that, let's take a second to review [how to respond to events](https://beta.reactjs.org/learn/responding-to-events) in React.

Now that we've touched up on our event handling knowledge, it's time to figure out how we can listen for when a checkbox's state has changed and trigger a function in response to that change. *See if you can figure out the correct event listener*.

Now that we've got our event listener in place, it's time to actually submit a request to the server to update our existing To Do. If you recall in a previous chapter, we are using the built in utility, [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), to submit our requests. This time, we'll want to [make a PUT request](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#uploading_json_data) to our expected endpoint containing the necessary data. After receiving our response and converting it to JSON we should receive our updated To Do information. Now we can go back and run our test.

We are still receiving an error and it now tells us that we're hitting an endpoint that we haven't set up a matching request handler for! Oh no! Well, that's a simple enough fix though as we're already champions at writing request handlers. Let's add a helper function for setting up a successful To Do update.

Now that we've cleared out that pesky warning, we have one last thing we need to take care of. I know that you're a smart cookie and you're yelling at the screen right now... "UPDATE THE STATE!". Well, you're correct, we need to actually apply our change. If you recall during the previous chapter, we exposed a function to push an item into our array of To Do's, this time we need to update an existing item. *Try writing and calling a function that will [update the state with your new item while maintaining the other existing state](https://beta.reactjs.org/apis/usestate#updating-state-based-on-the-previous-state)*. Beautiful! Now let's run our test one more time.

Huzzah! A passing test! Before we move on, you may or may not see a warning pop up stating "Warning: An update to ToDoProvider inside a test was not wrapped in act(...)." depending on how you implemented the user interaction. This particular problem is a [bug within the testing framework](https://github.com/testing-library/react-testing-library/issues/1051) which remains unsolved at the time of writing. You can get around it by using the [fireEvent API](https://testing-library.com/docs/dom-testing-library/api-events/) instead of userEvent in order to click the checkbox.

Now then, let's discuss the fact that this component is currently only able to mark the To Do as completed. That's *pretty* useful, but we can do more to provide the best experience for the end user. *See if you can write another test on your own that will allow for changing the title without breaking the existing test we just wrote*.

If you would like to take a look at an example solution to this chapter, feel free to switch to `feature/JS-3-updating-an-existing-to-do`. You can also see an example solution to allowing changing the title if you switch to `feature/JS-3-updating-the-title-of-an-existing-to-do`.

#### 4. Delete an Existing To Do

...
