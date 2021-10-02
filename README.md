<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

# chrome-extension-archive-webpack-plugin

> Create Chrome Extension archive for submitting to Chrome Web Store

## Installation

```console
npm i --save-dev html-webpack-plugin
```

```console
yarn add --dev html-webpack-plugin
```

## Options

| Name        | Type     | Default            | Description                  |
|-------------|----------|--------------------|------------------------------|
| `algorithm` | `string` | `zip`              | The compression algorithm    |
| `filename`  | `string` | `directory` option | Name of the archive          |
| `directory` | `string` | `undefined`        | Path to the target directory |
| `to`        | `string` | `.`                | Output path                  |

## Usage

### Basic

```javascript
import {ChromeExtensionArchiveWebpackPluginOptions} from 'chrome-extension-archive-webpack-plugin'

modules.exports = {
    plugins: [
        new ChromeExtensionArchiveWebpackPluginOptions({
            directory: 'build'
        })
    ]
}
```

## License

[MIT](./LICENSE)
