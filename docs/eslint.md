# ESlint

To see the generated config from all plugins and extended rules run:

```shell
./node_modules/.bin/eslint --print-config .eslintrc.json
```

We are running from node_modules because eslint doesn't know about plugins from local installed repos.

## Other gotchas

The order in the extends config is important, overlapping rules will be overridden by the ones bellow.

```
"extends": [
	"eslint:recommended",
	"plugin:import/errors",
	"plugin:import/warnings",
	"kentcdodds/possible-errors",
	"kentcdodds/best-practices",
	"kentcdodds/es6/best-practices",
	"kentcdodds/es6/possible-errors",
	"kentcdodds/import",
	"plugin:promise/recommended"
]
```

Extends can only be used on top and not part of `overrides`. If you needs different extends add a new file in each folder and remove the override.
