var path = require('path');

// Captures component id (e.g 'feedback_form' from 'feedback/feedback_form').
var COMPONENT_ID_PATTERN = /([^\/]+)$/;

// Captures enclosing dir
// (e.g '_fixtures/dir_with_file_and_component' from
// '_fixtures/dir_with_file_and_component/component')
var ENCLOSING_DIR_PATTERN = /(.+)\/.+$/;

var getResolveComponent = function(exts) {
  return function(request, callback) {
    var enclosingDirPath = request.request || '';
    if (enclosingDirPath.indexOf('/') !== 0) {
      enclosingDirPath = path.join(request.path, enclosingDirPath);
    }
    var captured = enclosingDirPath.match(COMPONENT_ID_PATTERN);

    // Ignore npm modules
    // TODO: Allow to pass ignore patterns
    var ignored = /node_modules$/.test(
      enclosingDirPath.match(ENCLOSING_DIR_PATTERN)[1]
    );

    if (captured && !ignored) {
      var componentId = captured[1];
      var context = this;

      var extObjsForFiles = exts.map(function(ext) {
        return { ext: ext, file: true };
      });
      var extObjs = extObjsForFiles.concat(exts.map(function(ext) {
        return { ext: ext, file: false };
      }));

      var tryToFindExtension = function(index) {
        var extObj = extObjs[index];

        // None of passed extensions are found
        if (!extObj) {
          return callback();
        }

        var resolvePath, componentFileName, componentFilePath;

        // Try to load regular file
        if (extObj.file) {
          resolvePath = enclosingDirPath.match(ENCLOSING_DIR_PATTERN)[1];
          componentFileName = componentId + '.' + extObj.ext;
          componentFilePath = enclosingDirPath + '.' + extObj.ext;

        } else {
          resolvePath = enclosingDirPath;
          componentFileName = componentId + '.' + extObj.ext;
          componentFilePath = path.join(enclosingDirPath, componentFileName);
        }

        context.fileSystem.stat(componentFilePath, function(err, stats) {
          if (err || !stats.isFile()) {
            return tryToFindExtension(index + 1);
          }

          context.doResolve('file', {
            path: resolvePath,
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
  this.exts = exts || ['jsx', 'js'];
};

ComponentResolverPlugin.prototype.apply = function(resolver) {
  resolver.plugin('directory', getResolveComponent(this.exts));
};

module.exports = ComponentResolverPlugin;

