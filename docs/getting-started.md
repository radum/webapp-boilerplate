## Getting Started

### Requirements

  * Mac OS X, Windows, or Linux
  * [Node.js](https://nodejs.org/) v8 or newer

### Directory Layout

Before you start, take a moment to see how the project structure looks like:

```
.
├── /build/                     # The folder for compiled output
├── /docs/                      # Documentation files for the project
├── /extra/                     # Extra resources like nginx config file and so on
├── /node_modules/              # 3rd-party libraries and utilities
├── /src/                       # The source code of the application
│   ├── /client/                # All JS files will be here
│   ├── /html/                  # All templates used by the Node server ([Marko](http://markojs.com/))
│   ├── /server/                # Node.js server files and config
│   ├── /ssl/                   # SSL local certificates to use on your machine. (The certificate is for localhost domain name)
│   ├── /static/                # All static files will be here. Images, robots.txt, favicon, etc.
│   ├── /styles/                # Styles folder, using Sass
├── /test/                      # Unit and end-to-end tests
├── /tools/                     # Build automation scripts and utilities
│   ├── /lib/                   # Utilities used for various tasks like fs, logging etc.
│   ├── /tasks/                 # Task files to clean compile and build
│   	├── /browserSync.js     # Browsersync task
│   	├── /clean.js           # Cleans up the output (build) folder
│   	├── /compiler.js        # Compiles js code using webpack
│   	├── /copy.js            # Copies static files and various extra to output (build) folder
│   	├── /gulpfile.js        # Main gulp entry file where all tasks are defined
│   	├── /minify-css.js      # Task to minify the CSS output using CleanCSS
│   	├── /postcss.config.js  # Configuration for transforming styles with PostCSS plugins
│   	├── /runServer.js       # Launches (or restarts) Node.js server
│   ├── /config.js              # Config file used by all tasks
│  	├── /postcss.config.js      # Configuration for transforming styles with PostCSS plugins
│   └── /webpack.config.js      # Configurations for client-side bundles
├── Dockerfile                  # TODO: Commands for building a Docker image for production
└── package.json                # The list of 3rd party libraries and utilities
```

### Quick Start

#### 1. Get the latest version

You can start by cloning the latest version on your local machine by running:

```shell
$ git clone -o webapp-boilerplate-webpack -b master --single-branch \
      https://github.com/radum/webapp-boilerplate-webpack.git MyApp
$ cd MyApp
```

Alternatively, you can start a new project by using Yeoman generator (TODO).

#### 2. Run `npm install`

This will install both run-time project dependencies and developer tools listed
in [package.json](../package.json) file.

#### 3. Run `npm run dev`

This command will build the app from the source files (`/src`) into the output
`/build` folder. As soon as the initial build completes, it will start the
Node.js server and [Browsersync](https://browsersync.io/).

> [http://localhost:3000/](http://localhost:3000/) — Node.js server with Browsersync and HMR enabled<br>
> [http://localhost:3001/](http://localhost:3002/) — Browsersync control panel (UI)

*NOTE: Port number are subject to change based on the .env.dev file in the root folder*

Now you can open your web app in a browser, on mobile devices and start
hacking. Whenever you modify any of the source files inside the `/src` folder,
the module bundler ([Webpack](http://webpack.github.io/)) will recompile the
app on the fly and refresh all the connected browsers.

Note that the `npm run dev` command launches the app in `development` mode,
the compiled output files are not optimized and minimized in this case.

### How to Build, Test, Deploy

If you need just to build the app (without running a dev server), simply run:

```shell
$ npm run build
```

After running this command, the `/build` folder will contain the compiled
version of the app. For example, you can launch Node.js server normally by
running `node build/server/server.js`.

TODO: To check the source code for syntax errors and potential issues run:

```shell
$ npm run lint
```

TODO: To launch unit tests:

```shell
$ npm run test          # Run unit tests with Mocha
$ npm run test:watch    # Launch unit test runner and start watching for changes
```

TODO: To deploy the app, run:

```shell
$ npm run deploy
```

### How to Update

If you need to keep your project up to date with the recent changes made to RSK,
you can always fetch and merge them from [this repo](https://github.com/radum/webapp-boilerplate-webpack)
back into your own project by running:

```shell
$ git checkout master
$ git fetch webapp-boilerplate-webpack
$ git merge webapp-boilerplate-webpack/master
$ npm install
```
