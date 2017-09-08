[![David Dependency Badge](https://david-dm.org/radum/webapp-boilerplate-webpack/dev-status.svg)](https://david-dm.org/radum/webapp-boilerplate-webpack/#info=devDependencies)

<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [ES6 Web app boilerplate using Webpack](#es6-web-app-boilerplate-using-webpack)
	- [Features](#features)
	- [Getting Started](#getting-started)
	- [TODO](#todo)
	- [Contribute](#contribute)
	- [License](#license)

<!-- /TOC -->

# ES6 Web app boilerplate using Webpack

This is heavily inspired by the [React Static Boilerplate](https://github.com/kriasoft/react-static-boilerplate) so most credit will go to the RSB team.

## Features

* Enable [ES2015 features](https://babeljs.io/docs/learn-es2015/) using [Babel](https://babeljs.io)
* CSS Autoprefixing, PostCSS
* Built-in preview server with BrowserSync
* Hot Module Replacement (HMR)
* Map compiled CSS/JS to source stylesheets/js with source maps

## Getting Started

**Step 1**. Make sure that you have Node.js v6 or newer installed on your machine.

**Step 2**. Clone this repo

```shell
$ git clone -o webapp-boilerplate-webpack -b master --single-branch \
      https://github.com/radum/webapp-boilerplate-webpack.git MyApp
$ cd MyApp
$ npm install                   # Install project dependencies listed in package.json
```

**Step 3**. Compile and launch your app by running:

```
$  node run                     # Same as `npm start` or `node run start`
```

This will fire up a local web server, open http://localhost:3000 in your default browser and watch files for changes, reloading the browser automatically via [BrowserSync](https://www.browsersync.io/) and HMR.

You can also test your app in release (production) mode by running node run start --release or with HMR and React Hot Loader disabled by running node run start --no-hmr. The app should become available at http://localhost:3000/

## TODO

- Add missing tasks:
	- build release
	- lint
	- test
- Update these docs with more info
- Explore other webpack plugins:
	- https://github.com/lukeed/webpack-messages
	- https://github.com/geowarin/friendly-errors-webpack-plugin
	- https://github.com/FormidableLabs/webpack-dashboard

## Contribute

See the [contributing docs](CONTRIBUTING.md).

## License

[MIT](https://opensource.org/licenses/MIT) © Radu Micu
