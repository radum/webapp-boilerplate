[![David Dependency Badge](https://david-dm.org/radum/webapp-boilerplate/status.svg)](https://david-dm.org/radum/webapp-boilerplate/) [![David Dev Dependency Badge](https://david-dm.org/radum/webapp-boilerplate/dev-status.svg)](https://david-dm.org/radum/webapp-boilerplate/#info=devDependencies) [![Greenkeeper badge](https://badges.greenkeeper.io/radum/webapp-boilerplate.svg)](https://greenkeeper.io/)

![Logo of the project](./images/logo.sample.png)

# ES6 Progressive Web App (PWA) boilerplate using Webpack, Expressjs and more

> Additional information or tag line

A brief description of your project, what it is used for.

## Features

- Enable [ES2015 features](https://babeljs.io/docs/learn-es2015/) using [Babel](https://babeljs.io)
- Bundled JS code using [webpack](https://webpack.js.org/).
- CSS [Autoprefixing](https://github.com/postcss/autoprefixer), [PostCSS](http://postcss.org/)
- Built-in preview server with [BrowserSync](https://www.browsersync.io/)
- Map compiled CSS/JS to source stylesheets/js with source maps
- PWA features
- Built in Node JS server (including http2 / https support) using [Express.js](https://expressjs.com/)
- Template engine using [Marko.js](https://markojs.com/docs/express/)
- [browserslist](http://browserl.ist/) support for babel and friends
- Linting done with [eslint](https://eslint.org/) and [stylelint](https://stylelint.io/)
- Custom task runner using promises

## Installing / Getting started

A quick introduction of the minimal setup you need to get a hello world up &
running.

```shell
commands here
```

Here you should say what actually happens when you execute the code above.

## Developing

### Built With

List main libraries, frameworks used including versions (React, Angular etc...)

### Prerequisites

What is needed to set up the dev environment. For instance, global dependencies or any other tools. include download links.

### Setting up Dev

Here's a brief intro about what a developer must do in order to start developing
the project further:

```shell
git clone https://github.com/your/your-project.git
cd your-project/
packagemanager install
```

And state what happens step-by-step. If there is any virtual environment, local server or database feeder needed, explain here.

### Building

If your project needs some additional steps for the developer to build the
project after some code changes, state them here. for example:

```shell
./configure
make
make install
```

Here again you should state what actually happens when the code above gets
executed.

### Deploying / Publishing

give instructions on how to build and release a new version
In case there's some step you have to take that publishes this project to a
server, this is the right time to state it.

```shell
packagemanager deploy your-project -s server.com -u username -p password
```

And again you'd need to tell what the previous code actually does.

## Versioning

We can maybe use [SemVer](http://semver.org/) for versioning. For the versions available, see the [link to tags on this repository](/tags).

## Configuration

Here you should write what are all of the configurations a user can enter when
using the project.

### Babel

`"@babel/preset-env" - Env preset`

Babel preset that automatically determines the Babel plugins you need based on your supported environments. Uses compat-table
https://github.com/babel/babel/tree/master/packages/babel-preset-env

TODO: Check that it actually works.
Enable transformation of ES6 module syntax to another module type.
Setting this to false will not transform modules.
This means webpack will be able to do Tree Shaking and remove unused exports from your bundle to bring down the file size.
"modules": false,

TODO: Understand this thing and what it does
A way to apply @babel/preset-env for polyfills (via @babel/polyfill).
"useBuiltIns": "usage"

## Tests

Describe and show how to run the tests with code examples.
Explain what these tests test and why.

```shell
Give an example
```

## Style guide

Explain your code style and show how to check it.

## Api Reference

If the api is external, link to api documentation. If not describe your api including authentication methods as well as explaining all the endpoints with their required parameters.

## Database

Explaining what database (and version) has been used. Provide download links.
Documents your database design and schemas, relations etc... 

## TODO

- [ ]  Add missing tasks:
      - [ ]  Lint task
      - [ ]  Test using some framework
      - [ ]  Eslint and stylelint auto fix tasks
      - [ ]  Coverage
      - [ ]  Clean separate task
- [ ]  Update these docs with more info
- [ ]  Consolidate Browserlist array. It is all over the place, in a config file, package.json, stylelint config, babel. The main config file should be enough
- [ ]  Add Yeoman generator
- [ ]  Add Docker builds
- [ ]  Add webp images on build
- [ ]  Fix all TODOs within all src files
- [ ]  Explore other webpack plugins or tools to use:
	  - https://github.com/FormidableLabs/webpack-stats-plugin // To use to get the files generated by webpack
      - https://github.com/ebidel/lighthouse-ci
      - https://github.com/geowarin/friendly-errors-webpack-plugin
      - https://github.com/asfktz/autodll-webpack-plugin
      - https://github.com/researchgate/webpack-watchman-plugin
      - https://github.com/philipwalton/analyticsjs-boilerplate
      - https://github.com/googleanalytics/autotrack
      - https://github.com/GoogleChrome/workbox
      - https://github.com/philipwalton/blog/blob/master/tasks/javascript.js
      - https://github.com/jonathantneal/postcss-normalize
      - https://github.com/NekR/offline-plugin
      - https://github.com/fervorous/fervor
      - https://mozilla.github.io/server-side-tls/ssl-config-generator/
      - https://github.com/evilebottnawi/favicons
      - https://www.npmjs.com/package/npm-run-all
      - https://github.com/jaredpalmer/backpack
      - https://github.com/FormidableLabs/builder
      - http://schemastore.org/json/
      - https://www.npmjs.com/package/express-brute
      - https://github.com/sebhildebrandt/http-graceful-shutdown
      - https://github.com/marionebl/commitlint
      - https://github.com/facebook/dataloader
      - https://www.npmjs.com/package/boom
      - https://github.com/godaddy/terminus
      - https://github.com/mzgoddard/hard-source-webpack-plugin
	  - https://github.com/terkelg/tiny-glob
	  - https://github.com/webpack/watchpack
- [ ]  Learn from others how its done:
      - https://github.com/parcel-bundler/parcel/commit/af4cd330e91197fd88d826fd17440452f64e5c8a
      - https://github.com/dmnsgn/frontend-boilerplate/blob/643424183ae27ff773f4b28839a892a6a3bfa750/config/scripts/favicons.js
      - https://github.com/insin/nwb/blob/next/src/createWebpackConfig.js
      - https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/config/webpack.config.dev.js
      - https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/src/utils/webpack.config.js
      - view-source:https://mobile.twitter.com/home
      - https://survivejs.com/webpack/building/bundle-splitting/
      - https://medium.com/@okonetchnikov/long-term-caching-of-static-assets-with-webpack-1ecb139adb95
      - https://medium.com/@paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3
      - https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
      - https://alistapart.com/article/yes-that-web-project-should-be-a-pwa
      - https://www.viget.com/articles/managing-css-js-http-2
      - https://youtu.be/5xj4kqSFs8Q?t=19055
	  - https://blog.risingstack.com/node-js-project-structure-tutorial-node-js-at-scale/
	  - https://philipwalton.com/articles/deploying-es2015-code-in-production-today/
	  - https://philipwalton.com/articles/the-google-analytics-setup-i-use-on-every-site-i-build/
	  - https://github.com/GoogleChromeLabs/webpack-libs-optimizations
	  - https://github.com/GoogleChromeLabs/webpack-training-project
	  - https://github.com/lakshyaranganath/pwa
	  - https://github.com/schleyfox/example-node-ops
	  - https://medium.com/codyhouse/create-your-design-system-part-1-typography-7c630d9092bd

## Contribute

See the [contributing docs](CONTRIBUTING.md).

## Licensing

[MIT](https://opensource.org/licenses/MIT) © Radu Micu
