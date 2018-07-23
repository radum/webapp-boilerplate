# Deploying to Heroku using Docker

More info here: https://devcenter.heroku.com/articles/container-registry-and-runtime

```shell
# This will log you in your account
# Log in to Container Registry
heroku container:login
# or directly via the Docker CLI:
# docker login --username=_ --password=$(heroku auth:token) registry.heroku.com

# Create a new Heroku app
heroku create

# Build the image and push to Container Registry (specific to our app)
# This works if in the root folder of he project we have our `Dockerfile` and `docker-compose.yml`
heroku container:push web

# Release the image to the app and run the container
heroku container:release web

# Open a browser page with the newly running app
heroku open
```
