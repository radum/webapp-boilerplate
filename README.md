[![David](https://img.shields.io/david/radum/webapp-boilerplate.svg?style=flat-square)](https://david-dm.org/radum/webapp-boilerplate) [![David](https://img.shields.io/david/dev/radum/webapp-boilerplate.svg?style=flat-square)](https://david-dm.org/radum/webapp-boilerplate/#info=devDependencies)

![Logo of the project](./images/logo.sample.png)

# ES6 Progressive Web App (PWA) boilerplate using Webpack, Express.js and more

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
- Template engine using [PUG.js](https://pugjs.org)
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

## FAQ

### Example: `import foo from './foo.js';` If you use dev tools debugger you cannot watch or execute foo because it is not defined.

This is because Webpack renames variable bindings in ES6 imports when it replaces them. More info here https://github.com/webpack/webpack/issues/3957

## Contribute

See the [contributing docs](CONTRIBUTING.md).

## Licensing

[MIT](https://opensource.org/licenses/MIT) © Radu Micu
