# component-resolver-webpack
[![Build Status](https://travis-ci.org/toptal/component-resolver-webpack.svg?branch=master)](https://travis-ci.org/toptal/component-resolver-webpack) [![Build status](https://ci.appveyor.com/api/projects/status/qmvi3h6lk0xu8833?svg=true)](https://ci.appveyor.com/project/kossnocorp/component-resolver-webpack)

[Webpack](http://webpack.github.io) plugin that provides simple convention on
how to organize components:
> The component file should be placed in a directory named as component itself e.g `button.jsx` must be placed inside `button` directorty: `button/button.jsx`.

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

* Ignore patterns (like `node_modules`)
* Simpler API (if it's possible with webpack)

--

[_License (MIT)_](https://github.com/toptal/component-resolver-webpack/blob/master/docs/LICENSE.md)

