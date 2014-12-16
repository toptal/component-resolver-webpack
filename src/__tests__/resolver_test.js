var fs = require('fs');
var path = require('path');
var ComponentResolverPlugin = require('../resolver');

describe('ComponentResolverPlugin behavior', function() {
  var resolveFn;
  var resolveContext = {
    fileSystem: fs,
    doResolve: function() {}
  };

  // Emulate webpack plugin setup & extract resolve function
  var emulateAndExtract = function(exts) {
    var plugin = new ComponentResolverPlugin(exts);
    plugin.apply({
      plugin: function(__, fn) { resolveFn = fn.bind(resolveContext) }
    });
  };

  var fixturesDir = path.join(__dirname, '_fixtures');

  afterEach(function() {
    if (resolveContext.doResolve.restore) {
      resolveContext.doResolve.restore();
    }
  });

  context('with default extransions set', function() {
    beforeEach(function() {
      emulateAndExtract();
    });

    context('when component file is not found', function() {
      var request = {
        path: fixturesDir,
        request: 'dir_without_file'
      };

      it('calls callback', function(done) {
        resolveFn(request, done);
      });
    });

    context('when component file is not a file', function() {
      var request = {
        path: fixturesDir,
        request: 'dir_inside_of_dir'
      };

      it('calls callback', function(done) {
        resolveFn(request, done);
      });
    });

    context('when stat function is errored', function() {
      var request = {
        path: fixturesDir,
        request: 'dir_with_file',
        query: 'qwerty'
      };

      beforeEach(function() {
        this.originStat = fs.stat;
        fs.stat = function(__, cb) {
          cb('Nasty error');
        };
      });

      afterEach(function() {
        fs.stat = this.originStat;
      });

      it('calls callback', function(done) {
        resolveFn(request, done);
      });
    });

    context('when component file is found', function() {
      var request = {
        path: fixturesDir,
        request: 'dir_with_file',
        query: 'qwerty'
      };

      it('calls doResolve on context with proper arguments', function(done) {
        var cb = function() {};
        var doResolve = sinon.spy(resolveContext, 'doResolve');
        resolveFn(request, cb);

        setTimeout(function() {
          expect(doResolve).to.be.calledWith(
            'file',
            sinon.match({
              path: path.join(request.path, request.request),
              query: 'qwerty',
              request: request.request + '.jsx'
            },
            cb
         ));

          doResolve.restore();
          done();
        }, 10);
      });
    });

    context('when request is undefined', function() {
      var request = {
        path: path.join(fixturesDir, 'dir_with_file')
      };
    });
  });

  context('with specefied extensions', function() {
    var request = {
      path: fixturesDir,
      request: 'dir_with_few_files',
      query: 'qwerty'
    };

    context('when none of passed extensions are found', function() {
      beforeEach(function() {
        emulateAndExtract(['ts', 'cljs']);
      });

      it('calls callback', function(done) {
        resolveFn(request, done);
      });
    });

    context('when first specified extension is found', function() {
      beforeEach(function() {
        emulateAndExtract(['js', 'jsx', 'coffee']);
      });

      it('calls doResolve on context with proper arguments', function(done) {
        var cb = function() {};
        var doResolve = sinon.spy(resolveContext, 'doResolve');
        resolveFn(request, cb);

        setTimeout(function() {
          expect(doResolve).to.be.calledWith(
            'file',
            sinon.match({
              path: path.join(request.path, request.request),
              query: 'qwerty',
              request: request.request + '.js'
            },
            cb
         ));

          doResolve.restore();
          done();
        }, 10);
      });
    });

    context('when second specefied extension is found', function() {
      beforeEach(function() {
        emulateAndExtract(['ts', 'jsx', 'coffee']);
      });

      it('calls doResolve on context with proper arguments', function(done) {
        var cb = function() {};
        var doResolve = sinon.spy(resolveContext, 'doResolve');
        resolveFn(request, cb);

        setTimeout(function() {
          expect(doResolve).to.be.calledWith(
            'file',
            sinon.match({
              path: path.join(request.path, request.request),
              query: 'qwerty',
              request: request.request + '.jsx'
            },
            cb
         ));

          doResolve.restore();
          done();
        }, 10);
      });
    });
  });

  context('with file named as component and component in the same dir', function() {
    var request = {
      path: fixturesDir,
      request: 'dir_with_file_and_component/component'
    };

    beforeEach(function() {
      emulateAndExtract();
    });

    it('calls doResolve on context with proper arguments', function(done) {
      var cb = function() {};
      var doResolve = sinon.spy(resolveContext, 'doResolve');
      resolveFn(request, cb);

      setTimeout(function() {
        expect(doResolve).to.be.calledWith(
          'file',
          sinon.match({
            path: path.join(request.path, 'dir_with_file_and_component'),
            request: 'component.js'
          },
          cb
       ));

        doResolve.restore();
        done();
      }, 10);
    });
  });

  context('when node module is required', function() {
    var request = {
      path: fixturesDir,
      request: 'dir_with_node_modules/node_modules/component'
    };

    beforeEach(function() {
      emulateAndExtract();
    });

    it('calls callback', function(done) {
      resolveFn(request, done);
    });
  });
});

