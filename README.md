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
By the way, this setting works well for [client-side routing on surge.sh](https://surge.sh/help/adding-a-200-page-for-client-side-routing).

### You can give configurations as Array

```js
const SymlinkWebpackPlugin = require('symlink-webpack-plugin');

module.exports = {
  // ...etc
  plugins: [
    new SymlinkWebpackPlugin([
      { origin: 'index.html', symlink: '200.html' },
      { origin: 'index.html', symlink: '404.html' },
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

The plugin doesn't make the symlink if the destination doesn't exist as default.
Passing the option `force: true`, will create it regardless.


## Development

```bash
yarn
yarn test
```

## License

[MIT License](/LICENSE) / Copyright (c) hmsk <k.hamasaki@gmail.com>
