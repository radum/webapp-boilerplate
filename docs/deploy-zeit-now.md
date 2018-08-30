# Deploying to Zeit Now using Docker (beta)

More info here: https://zeit.co/blog/serverless-docker/
Examples: https://github.com/zeit/now-examples/
## Example:

Main page: https://webapp-boilerplate-rlimisbnmi.now.sh/
Logs for your app: https://zeit.co/radum/webapp-boilerplate/rlimisbnmi/logs
The actual source: https://zeit.co/radum/webapp-boilerplate/rlimisbnmi/source

## Requirements

The root folder needs a file called `now.json` (already provided in this repo)

```json
{
  "type": "docker",
  "public": true,
  "features": {
    "cloud": "v2"
  }
}
```

And a `Dockerfile` with the app running.

After you install Now, you can just type `now` in the root and the deploy process starts

```shell
now -e APP_DOMAIN_NAME=webapp-boilerplate-rlimisbnmi.now.sh
```
