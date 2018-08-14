# Deploying to Heroku using Docker

More info here: https://devcenter.heroku.com/articles/container-registry-and-runtime

```shell
# Make sure you have a working Docker installation (eg. docker ps)
# and that you’re logged in to Heroku (heroku login).
# Log in to Container Registry:

# This will log you in your account
# Log in to Container Registry
heroku container:login
# or directly via the Docker CLI:
# docker login --username=_ --password=$(heroku auth:token) registry.heroku.com

# Create a new Heroku app
heroku create {heroku app name} --region eu

# Build the image and push to Container Registry (specific to our app)
# This works if in the root folder of he project we have our `Dockerfile` and `docker-compose.yml`
heroku container:push web --app={heroku app name}

# Release the image to the app and run the container
heroku container:release web --app={heroku app name}

# Open a browser page with the newly running app
heroku open -a {heroku app name}

# And to destroy it
heroku apps:destroy --app={heroku app name}

# And to check out the logs
heroku logs --tail --app {heroku app name}
```
