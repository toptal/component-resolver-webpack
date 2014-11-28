var path = require('path');

// Captures component id (e.g 'feedback_form' from 'feedback/feedback_form').
var COMPONENT_ID_PATTERN = /([^\/]+)$/;

var getResolveComponent = function(exts) {
  return function(request, callback) {
    var enclosingDirPath = path.join(request.path, request.request || '');
    var captured = enclosingDirPath.match(COMPONENT_ID_PATTERN);

    if (captured) {
      var componentId = captured[1];
      var context = this;

      var tryToFindExtension = function(index) {
        var ext = exts[index];

        // None of passed extensions are found
        if (!ext) {
          return callback();
        }

        var componentFileName = componentId + '.' + ext;
        var componentFilePath = path.join(enclosingDirPath, componentFileName);

        context.fileSystem.stat(componentFilePath, function(err, stats) {
          if (err || !stats.isFile()) {
            return tryToFindExtension(index + 1);
          }

          context.doResolve('file', {
            path: enclosingDirPath,
            query: request.query,
            request: componentFileName
          }, callback);
        });
      };

      tryToFindExtension(0);

    } else {
      callback();
    }
  };
};

var ComponentResolverPlugin = function(exts) {
  this.exts = exts || ['jsx'];
};

ComponentResolverPlugin.prototype.apply = function(resolver) {
  resolver.plugin('directory', getResolveComponent(this.exts));
};

module.exports = ComponentResolverPlugin;

