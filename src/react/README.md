

##  Introduction
Freshworks developer platform now supports React local development natively in the FDK through Webpack. This documentation is intended to walk you through the implementation in FDK, and the process to be followed to start with the development using React.

### Implementation

The FDK comes built-in with Webpack 5 and a Webpack configuration file to mount during the compilation, whenever FDK detects the project is developed with React, the project is compiled using Webpack with the default Webpack configuration. Though the FDK has a default Webpack configuration for React apps, It is possible to provide your own configuration, the guidelines for that are addressed in the latter part of this documentation.

### Create your first React app

To create a new React project,

1. Update the FDK to the latest version.

2. Create a new folder named my_app and open the terminal/command prompt inside the newly created folder

```shell
vel@freshworks:~$ mkdir my_app && cd my_app
```

3. Run _fdk create_ and select the product of your choice.

![Choose Product](../assets/choose_prod.png)

4. Once you have chosen the desired product and select _your_first_react_app_ template.

![Choose Product](../assets/choose_react.png)

5. After creating the project, run _npm install_ to install all the dependencies and devDependencies.

```shell
vel@freshworks:~/my_app$ npm install
```


### React app folder structure

The React App in the Freshworks ecosystem is similar to the React app created using create-react-app or a React app bundled using the Webpack, with some minor changes in the folder structure to support integration with the FDK.

The folder structure of the React app is given below

```shell
  ├── __mocks__
  │   └── svgrMock.js
  ├── app                               -> app folder houses built assets
  │   ├── icon.svg
  │   └── index.html                    -> Template for the frontend app to render
  ├── config
  │   └── iparams.json
  ├── jest.config.js                    -> unit test configuration for react components
  ├── manifest.json
  ├── package.json                      -> package.json for react app
  ├── public
  │   └── index.html                    -> React template file
  ├── setUpTests.js
  └── src                               -> React source code
      ├── App.css
      ├── App.js
      ├── App.test.js
      ├── assets
      │   ├── icon.svg
      │   └── logo.svg
      ├── components                    -> React components
      │   └── HelloUser.js
      ├── hooks
      │   └── useScript.js
      ├── index.css
      ├── index.js                      -> React entry point.
      └── logo.svg
```

### Run your first React app using the FDK

Running a React app locally using the FDK is similar to running any other app,

- Open the app folder in terminal and run _fdk run_

  ```shell
  vel@freshworks:~/my_app$ fdk run
  ```

- The FDK runs the app with Webpack if `package.json` is present in the root folder of the project with the following object,

  ```json
    "fdkConfig": {
      "frontendFramework": "react",
      "customConfig": ""
    }
  ```

- The `frontendFramework` key in the `fdkConfig` objects denotes the framework of the project, FDK currently supports

  1. React
  2. Vue
  3. Vue3

- The `customConfig` key denotes the path of the custom Webpack config you want to provide, although this is not mandatory, the FDK will use the default config if any of the following scenarios holds true.

  1. when there is no `customConfig` key in fdkConfig
  2. when `customConfig` is an empty string
  3. when the path provided is not a valid path.

::: warning
The path to the custom Webpack config module should be relative to the app's root folder.
:::



## Usage of existing frontend platform features in React

All the frontend features and interfaces should work as they would in the normal frontend app created using vanillaJS or JQuery, Although there few features that had to be implemented in a different way due to the restrictions imposed by React.

### Injecting the freshclient.js

The `fresh_client.js` is the interface that bridges your app and the developer platform. The `fresh_client.js` enables you to access the platform features such as request, db, interface, and instance through the client object.

In the normal vanilla Freshworks application, the `fresh_client.js' is included in the template.html as a script src like shown below

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta http-equiv="X-UA-Compatible" content="ie=edge" />
		<script src="https://static.freshdev.io/fdk/2.0/assets/fresh_client.js"></script>
	</head>
	<body>
		<div id="app"></div>
	</body>
</html>
```

Unlike the vanillaJS application, we will not be able to include the `fresh_client.js` inside the index.html, instead, the script is added to the app using React hooks like the example below

```javascript
import React, { useState, useEffect } from "react";
import "./App.css";
import Child from "./compoenents/Child";

const App = () => {
	const [loaded, setLoaded] = useState(false);
	const [child, setChild] = useState(<h3>App is loading</h3>);

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://static.freshdev.io/fdk/2.0/assets/fresh_client.js";
		script.addEventListener("load", () => setLoaded(true));
		script.defer = true;
		document.head.appendChild(script);
	}, []);

	useEffect(() => {
		if (!loaded) return;
		app.initialized().then((client) => {
			setChild(<Child client={client} />);
		});
	}, [loaded]);

	return (
		<div>
			<header>My React App</header>
			{child}
		</div>
	);
};

export default App;
```


### Passing the client Object to the child components.

Once the `fresh_client.js` is loaded, all the platform features can be accessed in the React app through the client object, the client object can then be passed down to the child components as a prop like shown below

```javascript
return (
	<div>
		<Child client={client} />
	</div>
);
```

you can find a sample app that addresses passing down of props to the child component in this [link](#)


### Render App in multiple app locations

One of the most significant features of the Freshworks developer platform is to render an app in multiple locations, and it can be achieved by defining multiple template `html` files in manifest.json like shown in the example below

*manifest.json*
```json
{
	"platform-version": "2.1",
	"product": {
		"freshdesk": {
			"location": {
				"ticket_sidebar": {
					"url": "index.html",
					"icon": "icon.svg"
				},
				"full_page_app": {
					"url": "full_page.html",
					"icon": "icon.svg"
				}
			}
		}
	}
}
```

Since React is a Single Page Application framework it is not possible to define multiple `html` files for a single app
but you can make use of the instance to achieve the same behavior and render different React components based on the app location instead of template `html` file


*App.js*
```javascript
import React, { useState, useEffect } from "react";
import "./App.css";
import HelloUser from "./components/HelloUser";
import Fullpage from "./components/Fullpage";
import Modal from "./components/Modal";


const App = () => {
	const [loaded, setLoaded] = useState(false);
	const [child, setChild] = useState(<h3>App is loading</h3>);

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://static.freshdev.io/fdk/2.0/assets/fresh_client.js";
		script.addEventListener("load", () => setLoaded(true));
		script.defer = true;
		document.head.appendChild(script);
	}, []);

	useEffect(() => {
		if (!loaded) return;
		app.initialized().then((client) => {
			client.instance.context().then(function (data) {
				let location = data.location;

				if (location === "ticket_sidebar") {
					setChild(<HelloUser client={client} />);
				}
				if (location === "full_page_app") {
					setChild(<Fullpage client={client} />);
				}
				if (location === "modal") {
					setChild(<Modal client={client} />);
				}
			});
		});
	}, [loaded]);

	return <div>{child}</div>;
};

export default App;
```

*manifest.json*
```json
{
	"platform-version": "2.1",
	"product": {
		"freshdesk": {
			"location": {
				"ticket_sidebar": {
					"url": "index.html",
					"icon": "icon.svg"
				},
				"full_page_app": {
					"url": "index.html",
					"icon": "icon.svg"
				}
			}
		}
	}
}
```

The logic discussed above can also be applied to interface methods like modals.


::: tip
All the app locations and interface methods in a React app should point to the same template html file, for eg: index.html or the custom html defined by you in the Webpack config, though it is possible to use multiple html files and initialize fresh_client.js in all the html files, it is not recommended.
:::
