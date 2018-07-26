# ENV Files

The Express app and everything else will load the local .env files following the rules bellow:

```
.env                # loaded in all cases
.env.local          # loaded in all cases, ignored by git
.env.[mode]         # only loaded in specified mode
.env.[mode].local   # only loaded in specified mode, ignored by git
```

where [mode] can be : test, development or production.

The machine defined env properties will never be overridden.
