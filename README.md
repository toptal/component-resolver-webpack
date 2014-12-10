# component-resolver-webpack

[Webpack](http://webpack.github.io) plugin that provides simple convention on
how to organize components: _**component should be placed in directory named 
as component it self**._

It allows to shorten `require` calls and make them more expressive:

``` js
var Button = require('ui/button');
// instead of:
var Button = require('ui/button/button.jsx');
```

Why not `'ui/button.jsx'`? Because then you can use directories
as module container. As an example, you can conbine `component-resolver-webpack`
with [`component-css-loader`](https://github.com/toptal/component-css-loader):

``` js
var Button = require('ui/button');

// Single `require` to get React component and style associated with it.
require('ui/button/button.styl');
var Button = require('ui/button/button.jsx');
```

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

You also may want to specify `modulesDirectories`: 

`webpack.config.js`:
``` javascript
// ...

module.exports = {
  // ...
  
  resolve: {
    modulesDirectories: [
      'new',
      'app/components',
      'app',
      'spec',
      'node_modules'
    ]
  }
}
```
