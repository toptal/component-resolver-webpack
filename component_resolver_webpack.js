var path = require('path');

// Captures component id (e.g 'feedback_form' from 'feedback/feedback_form').
var COMPONENT_ID_PATTERN = /([^\/]+)$/;

var ComponentResolverPlugin = function() {};

ComponentResolverPlugin.prototype.apply = function(resolver) {
  resolver.plugin('directory', function(request, callback) {
    var enclosingDirPath = path.join(request.path, request.request || '');
    var captured = enclosingDirPath.match(COMPONENT_ID_PATTERN);

    if (captured) {
      var componentId = captured[1];
      // TODO: Allow to use any or set of extensions
      var componentFileName = componentId + '.jsx';
      var componentFilePath = path.join(enclosingDirPath, componentFileName);

      this.fileSystem.stat(componentFilePath, function(err, stats) {
        if (err || !stats.isFile()) {
          return callback();
        }

        this.doResolve('file', {
          path: enclosingDirPath,
          query: request.query,
          request: componentFileName
        }, callback);
      }.bind(this));

    } else {
      callback();
    }
  });
};

module.exports = ComponentResolverPlugin;

