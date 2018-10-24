# Running PM2 & Node.js in Production Environments

There are many process managers out there, most notably [Forever](https://github.com/foreverjs/forever), [StrongLoop’s Process Manager](http://strong-pm.io/), and good ol’ [SystemD](https://en.wikipedia.org/wiki/Systemd).

And then there is PM2, with over 60 million downloads and 25k GitHub stars (and rising!). We like PM2 because, simply put, it’s easy to use and makes managing a production environment seamless.

PM2 is a production ready runtime and process manager for Node.js applications. It comes with a built-in load balancer, as well. Best of all, it works on Linux, Windows, and macOS.

## Installing PM2

```
# macOS

npm i -g pm2
```

If you’re on Linux, Windows, or using a Docker container, follow the instructions https://pm2.io/doc/en/runtime/guide/installation/

## Example Ecosystem File

https://pm2.io/doc/en/runtime/guide/ecosystem-file/

```
# ecosystem.config.js
module.exports = {
  apps : [{
    name: 'endodeploywww',
	cwd: 'path/to/appfolder',
    script: 'app.js',
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
	watch: false
  }]
}

pm2 start | startOrRestart ecosystem.config.js # uses variables from `env`
pm2 start ecosystem.config.js --env production # uses variables from `env_production`

# refresh the environment
pm2 restart ecosystem.config.js --update-env

# switch the environment
pm2 restart ecosystem.config.js --env production --update-env

pm2 start --only {app_name}
```

## Tips & Tricks

### Auto Restart

Once it’s started, your app is forever alive, auto-restarting after crashes and machine restarts — all with one simple command:

```
pm2 startup
```

### Process Management

```
#  Start process(es) via process JSON file
pm2 start process_prod.json 

#  Show a list of all applications
pm2 ls 

#  Stops a specific application
pm2 stop <app> 

#  Starts a specific application
pm2 start <app> 

#  Scales the application you specify to N number of instances (can be used to scale up or down)
pm2 <app> scale N 

#  Kills all running applications
pm2 kill 

#  Restarts all running applications
pm2 restart 

#  Reloads the app configuration (this comes in handy when you modify your application’s environment variables)
pm2 reload 

# Will return a rich set of data around your application’s health. For example, you’ll see CPU utilization, memory usage, requests/minute, and more!
pm2 monit
```

### Log Management

```
#  Outputs logs from all running applications
pm2 logs 

#  Outputs logs from only the app application
pm2 logs app 

#  Flushes all log data, freeing up disk space
pm2 flush 

pm2 install pm2-logrotate
```

## Best Practices:

```
One codebase tracked in revision control, many deploys
Explicitly declare and isolate dependencies
Store config in the environment
Treat backing services as attached resources
Strictly separate build and run stages
Execute the app as one or more stateless processes
Export services via port binding
Scale out via the process model
Maximize robustness with fast startup and graceful shutdown
Keep development, staging, and production as similar as possible
Treat logs as event streams
Run admin/management tasks as one-off processes
```
