var ComponentResolverPlugin = function() {};

ComponentResolverPlugin.prototype.apply = function(resolver) {

  resolver.plugin('directory', function(request, callback) {

    var fullPath;
    if (!request.request) {
      fullPath = request.path
    } else {
      fullPath = request.path + '/' + request.request
    }

    var captures = fullPath.match(/([^\/]+)$/);

    if (captures) {
      var fs = this.fileSystem;
      var componentName = captures[1];
      var componentFileName = componentName + '.jsx';
      var componentEntryPath = fullPath + '/' + componentFileName;

      fs.stat(componentEntryPath, function(err, stats) {
        if (err || !stats.isFile()) {
          return callback();
        }

        this.doResolve('file', {
          path: fullPath,
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

