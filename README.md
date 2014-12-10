# component-resolver-webpack

[Webpack](http://webpack.github.io) plugin that provides simple convention on
how to organize components.

_**Component should be placed in directory named as component it self**._

## Installation

```
npm install --save-dev component-resolver-webpack
```

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

## Usage


``` js
var Button = require('ui/button');
```

... instead of:

``` js
var Button = require('ui/button/button.jsx');
```
