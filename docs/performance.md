# Performance (WIP)

## Node tooling profile

To profile the tooling node js scripts here is an example that generates a flamegraph using [0x](https://github.com/davidmarkclements/0x)

```
cross-env NODE_ENV=production BROWSERSLIST_ENV=modern npx 0x -o tools/run.js build --release
```
