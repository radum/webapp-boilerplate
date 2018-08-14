# Local testing using HTTPS / SSL

Either use `src/ssl/localhost.{crt | key}` files or generate new ones using:

```shell
# https://github.com/FiloSottile/mkcert
brew install mkcert

cd src/ssl
mkcert -install
mkcert localhost 127.0.0.1 ::1
```

This works on Mac, yet to be tested on Windows.

To start testing `HTTPS_ENABLED` env prop needs to be set and the env vars to the key and cert files.

```
Browsersync only works in one or another, doesn't know how to handle both in the same time. Although testing the local server works BS will fail for one or another based on the env var being set or not.
```
