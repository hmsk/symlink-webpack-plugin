# Symlink Webpack Plugin

[![](https://img.shields.io/npm/v/symlink-webpack-plugin.svg?style=for-the-badge)](https://www.npmjs.com/package/symlink-webpack-plugin)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/hmsk/symlink-webpack-plugin/Node%20CI?style=for-the-badge)](https://github.com/hmsk/symlink-webpack-plugin/actions?query=workflow%3A%22Node+CI%22)

A webpack plugin to make symbolic links for emitted file.

## Installation

```bash
npm i -D symlink-webpack-plugin
```

## Usage

In your webpack config:

```js
const SymlinkWebpackPlugin = require('symlink-webpack-plugin');

module.exports = {
  // ...etc
  plugins: [
    new SymlinkWebpackPlugin({ origin: 'index.html', symlink: '200.html' })
  ]
};
```

This setting makes symbolic link file `[ouput_path]/200.html` to `[ouput_path]/index.html`.

### You can give configurations as Array

```js
const SymlinkWebpackPlugin = require('symlink-webpack-plugin');

module.exports = {
  // ...etc
  plugins: [
    new SymlinkWebpackPlugin([
      { origin: 'index.html', symlink: '200.html' },
      { origin: 'index.html', symlink: 'error_pages/404.html' },
    ])
  ]
};
```

### `force` option (default: `false`)

```js
const SymlinkWebpackPlugin = require('symlink-webpack-plugin');

module.exports = {
  // ...etc
  plugins: [
    new SymlinkWebpackPlugin([
      { origin: 'index.html', symlink: '200.html', force: true },
      { origin: 'index.html', symlink: '404.html' },
    ])
  ]
};
```

The plugin doesn't make any symlink if a directory for a destination doesn't exist as default.
Passing an option `force: true`, will create it regardless.

When directories of symlink don't exist, `force` option allows to dig. For instance, what if a config has `symlink: 'one/two/200.html'` but `one/two/` dir doesn't exist when the plugin runs, `one`, `one/two` directories will be created.

### `hook` option (default: `afterEmit`)

You can point an exact [compiler hook](https://webpack.js.org/api/compiler-hooks/) to make a symlink.

```js
  { origin: 'index.html', symlink: '200.html', hook: 'entryOption' },
```


## Development

```bash
yarn
yarn test
```

## License

[MIT](/LICENSE)
