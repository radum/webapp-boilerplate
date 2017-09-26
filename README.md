[![David Dependency Badge](https://david-dm.org/radum/webapp-boilerplate-webpack/dev-status.svg)](https://david-dm.org/radum/webapp-boilerplate-webpack/#info=devDependencies)

# ES6 Progressive Web App (PWA) boilerplate using Gulp and Webpack

## Features

* Enable [ES2015 features](https://babeljs.io/docs/learn-es2015/) using [Babel](https://babeljs.io)
* Bundled JS code using [webpack](https://webpack.js.org/).
* CSS [Autoprefixing](https://github.com/postcss/autoprefixer), [PostCSS](http://postcss.org/)
* Built-in preview server with [BrowserSync](https://www.browsersync.io/)
* Map compiled CSS/JS to source stylesheets/js with source maps
* PWA features
* Built in Node JS server (including http2 / https support)
* [browserslist](http://browserl.ist/) support for babel and friends
* Linting done with [eslint](https://eslint.org/) and [stylelint](https://stylelint.io/)

## Getting Started

**Step 1**. Make sure that you have Node.js v8 or newer installed on your machine.

**Step 2**. Clone this repo

```shell
$ git clone -o webapp-boilerplate-webpack -b master --single-branch \
      https://github.com/radum/webapp-boilerplate-webpack.git MyApp
$ cd MyApp
$ npm install                   # Install project dependencies listed in package.json
```

**Step 3**. Compile and launch your app by running:

```
$  node run dev                   # Same as `npm start` or `node run start`
```

This will fire up a local web server, open http://localhost:3000 in your default browser and watch files for changes, reloading the browser automatically via [BrowserSync](https://www.browsersync.io/).

## TODO

- Add missing tasks:
	- lint
	- test
- Update these docs with more info
- Explore other webpack plugins or tools to use:
	- https://github.com/lukeed/webpack-messages
	- https://github.com/geowarin/friendly-errors-webpack-plugin
	- https://github.com/FormidableLabs/webpack-dashboard
	- https://github.com/webpack-contrib/babel-minify-webpack-plugin
	- https://www.npmjs.com/package/gulp-sizereport
	- https://github.com/asfktz/autodll-webpack-plugin
	- https://github.com/researchgate/webpack-watchman-plugin
	- https://github.com/schmich/connect-browser-sync
	- https://github.com/philipwalton/analyticsjs-boilerplate
	- https://github.com/googleanalytics/autotrack
	- https://github.com/GoogleChrome/workbox
	- https://github.com/philipwalton/blog/blob/master/tasks/javascript.js

## Contribute

See the [contributing docs](CONTRIBUTING.md).

## License

[MIT](https://opensource.org/licenses/MIT) © Radu Micu
