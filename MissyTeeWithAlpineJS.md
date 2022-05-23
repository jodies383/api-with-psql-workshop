# Using Missy Tee with AlpineJS

In this project we will explore AlpineJS with APIs.

Convert your existing [API with psql workshop](https://github.com/codex-academy/api-with-psql-workshop) to an ExpressJS API and add a Missy Tee online shop thats using AlpineJS.

## Todos

* Copy [the code](https://github.com/codex-academy/api-with-psql-workshop/blob/main/test/test.api.js#L1-L19) that is setting up ExpressJS in the `test.api.js` file to your `index.js` file (It will be empty). Add an `app.listen` method call to start the API.
* Create a `public` folder to host HTML & stylesheets.
* Link the public folder using static middleware using `app.use(express.static('public'))` - this will expose the files in your public folder at your apps root folder.
* Get the garment images from the original Missy Tee project.
* Add AlpineJS support to your pages.
* Call the API using `fetch` or `axios`.
* Ensure use the API methods in your Missy Tee app. Add the function to your app. You can add new API endpoints.

### Calling APIs from AlpineJS

See the examples below on how to call APIs from AlpineJS.

Calling the API on page load:

```html
<h2>Call API on page load</h2>
	<div x-data="{ users : []}" x-init="fetch('https://jsonplaceholder.typicode.com/users')
			.then(r => r.json())
			.then(userData => users = userData )"  >
		<ul>
			<template x-for="user in users" >
				<li x-text="user.name" ></li>
			</template>
		</ul>
	</div>
```

Calling the API on button click:

```html
<h2>Call API on click</h2>
	<div x-data="{ users : [] }" x-init=""  >
		<button @click="fetch('https://jsonplaceholder.typicode.com/users')
			.then(r => r.json())
			.then(userData => users = userData )"   >Load users</button>
		<ul>
			<template x-for="user in users" >
				<li x-text="user.name" ></li>
			</template>
		</ul>
	</div>
```

The complete example of calling APIs from AlpineJS is [here](https://github.com/codex-academy/api-with-psql-workshop/blob/main/apis-with-alpine.html).

If your AlpineJS code is in a seperate JavaScript file (nice!!!) - it looks like this:

```js
Alpine.data('users', () => ({
    init() {
		fetch('https://jsonplaceholder.typicode.com/users')
			.then(r => r.json())
			.then(userData => this.users = userData )
    },
	users : []
}));
```

## Remember

Deploy your app the Heroku.