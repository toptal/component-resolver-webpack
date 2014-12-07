# component-resolver-webpack

## Installation

```
npm install --save-dev component-resolver-webpack
```

## Usage

`webpack.config.js`:
``` javascript
var webpack = require('webpack');
var ComponentResolverPlugin = require('component-resolver-webpack');

module.exports = {
  plugins: [
    new webpack.ResolverPlugin([
      new ComponentResolverPlugin(
        // array of extensions e.g `['js']` (default: `['jsx', 'js']`)
      )
    ])
  ]
};
```

