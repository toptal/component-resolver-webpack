# component-resolver-webpack
[![Build Status](https://travis-ci.org/toptal/component-resolver-webpack.svg?branch=master)](https://travis-ci.org/toptal/component-resolver-webpack) [![component-resolver-webpack](http://img.shields.io/npm/v/component-resolver-webpack.svg)]()`component-resolver-webpack` ([changelog](https://github.com/toptal/component-resolver-webpack/blob/master/docs/CHANGELOG.md))

[Webpack](http://webpack.github.io) plugin that provides simple convention on
how to organize components:
> Component file should be placed in directory named as component it self.

## Idea

It allows to shorten `require` calls and make them more expressive:

``` js
var Button = require('ui/button');
// instead of:
var Button = require('ui/button/button.jsx');
```

**Why not `'ui/button.jsx'`?**

Because then you can use directories as module containers. As an example, you can
combine `component-resolver-webpack` with 
[`component-css-loader`](https://github.com/toptal/component-css-loader):

``` js
var Button = require('ui/button');

// Single `require` to get React component and style associated with it.
require('ui/button/button.styl');
var Button = require('ui/button/button.jsx');
```

Directory also may contain tests ([Jest](https://facebook.github.io/jest/)-like approach).

## Installation

Install via [npm](https://www.npmjs.com/package/component-resolver-webpack):

```
npm install --save-dev component-resolver-webpack
```

Update webpack config (default: `webpack.config.js`):

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

You also may want to specify `modulesDirectories` in webpack config: 

``` javascript
// ...

module.exports = {
  // ...
  
  resolve: {
    modulesDirectories: [
      // It will allow to use path without leading `./` in require
      // for directories placed in `app`:
      'app'
    ]
  }
}
```

## Tests

```
npm test
```

For watch mode:

```
npm run-script autotest
```

## Roadmap

* Simpler API (if it's possible with webpack)

--

[_License (MIT)_](https://github.com/toptal/component-resolver-webpack/blob/master/docs/LICENSE.md)
