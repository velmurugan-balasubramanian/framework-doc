
## Introduction

Freshworks developer platform now supports Vue local development natively in the FDK through [Webpack 5](https://webpack.js.org/blog/2020-10-10-webpack-5-release/). This documentation is intended to walk you through the implementation in the FDK, and the process to follow to get started with the Vue development using the FDK.

::: tip
FDK supports both Vue version 2 and version 3, make sure you choose the right template while creating a new app.
:::

### Implementation

The FDK comes built-in with Webpack 5 and a Webpack configuration file to mount during the compilation and the build phases, whenever the FDK detects the project is developed with Vue, the project is compiled using Webpack with default Webpack configuration.

Though the FDK has a default Webpack configuration for Vue, It is possible to provide custom configurations, the guidelines to define [custom Webpack configurations](/vue/#custom-webpack-config) are addressed in the latter part of this documentation.

### Create your first Vue app

To create a new Vue project,

1. Update the FDK to the latest version.

2. Create a new folder named my_app and open the terminal/command prompt inside the newly created folder

```shell
vel@freshworks:~$ mkdir my_app && cd my_app
```

3. Run _fdk create_ and select the product of your choice.

![Choose Product](../assets/choose_prod.png)

4. Once you have chosen the desired product, select either your_first_vue_app or your_first_vue3_app template,

![Choose Product](../assets/choose_vue.png)

<div align="center">
OR
</div>

![Choose Product](../assets/choose_vue3.png)

5. After creating the project, run _npm install_ to install all the dependencies and devDependencies.

```shell
vel@freshworks:~/my_app$ npm install
```


### Vue app folder structure

The Vue App in the Freshworks ecosystem is similar to the Vue app created using vue-cli or a Vue app bundled using the Webpack, with some minor changes in the folder structure to support integration with the FDK.

The folder structure of the Vue app is explained below

```shell
  ├── app
  │   ├── icon.svg
  │   └── index.html
  ├── babel.config.js
  ├── config
  │   └── iparams.json
  ├── manifest.json
  ├── package-lock.json
  ├── package.json
  ├── public
  │   └── index.html
  └── src
      ├── App.vue
      ├── assets
      │   ├── icon.svg
      │   ├── logo.png
      │   └── vuejs.svg
      ├── components
      │   └── Sidebar.vue
      └── main.js
```


#### The manifest.json file

The `manifest.json` file contains the app metadata about your app, such as app locations, platform version, and other app related information.

#### The package.json file

The `package.json` file contains the information about the framework used and the dependencies and devDependencies used by the and configurations if any.

#### The app folder

The `app` folder contains the built/compiled app and the content of the app folder is served by the FDK in `http://localhost:10001/iframe` during *`fdk run`*

::: warning

* Do not delete, replace or modify the `index.html` file inside the app folder, any changes made will be overwritten during the build. If you need to add or remove anything in the `app/index.html`, make sure you do it in `public/index.html` as it serves as the template file for `app/index.html`

* Replace the `icon.svg` file in the app folder, if you choose to use a custom icon for the app. Make sure you change the name of the icon in `manifest.json` to the replaced/newly added image.

* If you choose to use a [custom webpack config](/react/#custom-webpack-config), make sure the output always points to the app folder or its subfolders.  
:::

#### The Config folder

The `config` folder contains the installation parameter of the app.

::: danger

* Do not define your [custom webpack config](/react/#custom-webpack-config) inside the `config` folder
:::

#### The src folder

The `src` folder contains your Vue components and services.

#### The public folder

The `public` folder contains an `index.html` file which serves as a template to the `app/index.html`. Adding css or script to the app can be done in the `public/index.html`.

### Run your first Vue app using the FDK

Running a Vue app using FDK is similar to running any other app,

* Open the app folder in terminal and run _fdk run_

  ```shell
  vel@freshworks:~/my_app$ fdk run
  ```

* The FDK runs the app with Webpack if `package.json` is present in the root folder of the project with the following object,

  ```json
    "fdkConfig": {
      "frontendFramework": "vue",
      "customConfig": ""
    }
  ```

* the `frontendFramework` key in the `fdkConfig` objects denotes the framework of the project, FDK currently supports

  1. React
  2. Vue
  3. Vue3

* the `customConfig` key denotes the path of the custom Webpack config you want to provide, although the `customConfig` not mandatory, the FDK will use the default config if any of the following scenarios holds true.

  1. when there is no `customConfig` key in fdkConfig
  2. when `customConfig` is an empty string
  3. when the path provided is not a valid path.

::: warning
The path to the custom Webpack config module should be relative to the app's root folder.
:::

### Lifecycle of a FDK Vue App

Lifecycle/App execution flow of a Vue app in FDK is shown in the image below. 

![Vue Flowchart](../assets/spa.png)

## Usage of existing frontend platform features in Vue

All the frontend features and interfaces should work as they would in the normal frontend app created using vanillaJS or JQuery, Although there few features that had to be implemented in a different way due to the restrictions imposed by Vue.

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

Like in the vanillaJS application, you can include the `fresh_client.js` direclty in the `public/index.html`.

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
		<!-- built files will be auto injected -->
	</body>
</html>
```

### Passing the client Object to the child components.

Once the `fresh_client.js` is loaded, all the platform features can be accessed in the Vue app through the client object, the client object can then be passed down to the child components as a prop like shown below

*App.vue*

```javascript
<template >
  <div>
      <Sidebar :client="client" />
  </div>
</template>
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

Since react is a Single Page Application framework it is not possible to define multiple `html` files for a single app
but you can make use of the instance to achieve the same behavior and render different Vue components based on the app location instead of the template `html` file

*App.vue*

```js

<template >
  <div v-if="location === 'username'">
      <Sidebar :client="client" />
  </div>
  <div v-if="location === 'full_page_app'">
      <Fullpage :client="client" />
  </div>
  <div v-if="location === 'modal'">
      <Modal :client="client" />
  </div>
</template>


<script>
import Sidebar from "./components/Sidebar.vue";
import Fullpage from "./components/Fullpage.vue";
import Modal from "./components/Modal.vue";

export default {
  mounted() {
    this.get();
  },
  name: "App",
  components: {
    Sidebar,
  },
  data() {
    return {
      client: {},
      location: ''
    };
  },
  methods: {
    get() {
      app.initialized().then((client) => {
        this.client = client;
        client.instance.context().then((data) => {
           this.location = data.location;
			});
      });
    },
  },
};

</script>

<style scoped>

</style>

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
All the app locations and interface methods in a Vue app should point to the same template html file, for eg: index.html or the custom html defined by you in the Webpack config, though it is possible to use multiple html files and initialize fresh_client.js in all the html files, it is not recommended.
:::


## Custom Webpack Config

FDK comes with a provision to provide custom webpack configuration, you can define the custom webpack configuration by providing a path to the configuration on the package.json file of the app.

The path to the configuration is provided in the `configPath` of the `fdkConfig` in package.json

*package.json*

```json
{
  "name": "vue-webpack-setup",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "fdkConfig": {
    "frontendFramework": "vue3",
    "configPath": "webpack-config/webpack.config.js"    // path to Your Custom Webpack config, 
  },
  "scripts": {
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "clean-webpack-plugin": "^3.0.0",
    "core-js": "^3.9.1",
    "html-webpack-plugin": "^5.3.1",
    "mini-css-extract-plugin": "^1.4.0",
    "vue": "^3.0.0",
    "vue-loader-3": "npm:vue-loader@^16.1.2",
    "vue-router": "^4.0.5"
  },
  "devDependencies": {
    "@babel/core": "^7.13.10",
    "@babel/preset-env": "^7.13.10",
    "vue-loader": "^16.1.2",
    "@vue/compiler-sfc": "^3.0.7"
  },
  "browserslist": [
    "Chrome >= 45",
    "Firefox ESR",
    "Edge >= 12",
    "Explorer >= 10",
    "iOS >= 9",
    "Safari >= 9",
    "Android >= 4.4",
    "Opera >= 30",
    "> 1%",
    "last 2 versions",
    "not dead"
  ]
}

```

### Default config

The code snippet shown below is the defalt webpack configuration that comes with the FDK, you can choose to make whatever changes you wish to the configuration, but make sure you follow the guideilnes given below

1. The `output` should always point to or be inside the app directory, so the app can packed properly during *fdk pack* 
2. If you use any new dependencies in the configuration, make sure you install the dependencies inside the project. 


```js
'use strict';

const { VueLoaderPlugin } = require('vue-loader-3');
const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
 
module.exports = {
  entry: {
    main: ['@babel/polyfill', `${process.cwd()}/src/main.js`]
  },
  output: {
    filename: '[name].[contenthash:8].js',
    path: `${process.cwd()}/app/scripts`,
    chunkFilename: '[name].[contenthash:8].js',
    publicPath: './scripts'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          /node_modules/,
          /app/
        ],
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader-3'
      },
      {
        test: /\.(css|scss)$/,
        use: [
            'style-loader',
            'css-loader'
        ]
    },
      {
        test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|jpe?g|gif|webm|mp4|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name][contenthash:8].[ext]',
          outputPath: '/assets/img',
          esModule: false
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].css'
    }),
    new htmlWebpackPlugin({
      template: `${process.cwd()}/public/index.html`,
      filename: `${process.cwd()}/app/index.html`
    })
  ],
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          chunks: 'all'
        }
      }
    }
  }
};

```


### Sample Custom config

A sample custom config to place the built javascript assets inside `js` folder instead of the default `scripts` folder.

```js
'use strict';

const { VueLoaderPlugin } = require('vue-loader-3');
const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
 
module.exports = {
  entry: {
    main: ['@babel/polyfill', `${process.cwd()}/src/main.js`]
  },
  output: {
    filename: '[name].[contenthash:8].js',
    path: `${process.cwd()}/app/scripts`,
    chunkFilename: '[name].[contenthash:8].js',
    publicPath: './js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          /node_modules/,
          /app/
        ],
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader-3'
      },
      {
        test: /\.(css|scss)$/,
        use: [
            'style-loader',
            'css-loader'
        ]
    },
      {
        test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|jpe?g|gif|webm|mp4|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name][contenthash:8].[ext]',
          outputPath: '/assets/images',
          esModule: false
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].css'
    }),
    new htmlWebpackPlugin({
      template: `${process.cwd()}/public/index.html`,
      filename: `${process.cwd()}/app/index.html`
    })
  ],
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          chunks: 'all'
        }
      }
    }
  }
};

```