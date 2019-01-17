# Symlink Webpack Plugin

[![](https://img.shields.io/npm/v/symlink-webpack-plugin.svg?style=for-the-badge)](https://www.npmjs.com/package/symlink-webpack-plugin)

A webpack plugin to make symbolic links for emitted file.

## Installation

```bash
$ npm i -D symlink-webpack-plugin
```

## Usage

In your webpack config:

```js
const SymlinkWebpackPlugin = require('symlink-webpack-plugin');

// In plugins property
{
  plugins: [
    new SymlinkWebpackPlugin({ origin: 'index.html', symlink: '200.html' })
  ]
}
```

This setting makes symbolic link file `[ouput_path]/200.html` to `[ouput_path]/index.html`.
By the way, this setting works well for [client-side routing on surge.sh](https://surge.sh/help/adding-a-200-page-for-client-side-routing).

### You can give configurations as Array

```js
{
  plugins: [
    new SymlinkWebpackPlugin([
      { origin: 'index.html', symlink: '200.html' },
      { origin: 'index.html', symlink: '404.html' },
    ])
  ]
}
```

### `force` option (default: `false`)

```js
{ origin: 'index.html', symlink: '200.html', force: true },
```

The plugin doesn't the make symlink if the destination doesn't exist as default.
By giving `force: true`, make the symlink always.


## Development

```bash
$ yarn
$ yarn build
$ yarn test
```

## License

[MIT License](/LICENSE) / Copyright (c) hmsk <k.hamasaki@gmail.com>
