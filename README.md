## Symlink Webpack Plugin

A webpack plugin that make symbolic link for emitted file.

### Installation

```bash
$ npm install --save-dev symlink-webpack-plugin
```

### Usage

In your webpack config:

```js
var SymlinkWebpackPlugin = require('symlink-webpack-plugin');

// In plugins property
{
  plugins: [
    new SymlinkWebpackPlugin({ origin: 'index.html', symlink: '200.html' })
  ]
}
```

This setting makes symbolic link file `[ouput_path]/200.html` to `[ouput_path]/index.html`.
By the way, this setting works well for [client-side routing on surge.sh](https://surge.sh/help/adding-a-200-page-for-client-side-routing).

#### You can give configurations as Array

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


### Development

```bash
$ yarn
$ yarn build
$ yarn test
```

### License

```
The MIT License

Copyright (c) 2017 Kengo Hamasaki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
