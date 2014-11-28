var fs = require('fs');
var path = require('path');
var ComponentResolverPlugin = require('../resolver');

// Emulate webpack plugin setup & extract resolve function
var emulateAndExtract = function(exts) {
  // TODO: Use extensions array
  var resolveFn;
  var resolveContext = {
    fileSystem: fs,
    doResolve: function() {}
  };
  ComponentResolverPlugin.prototype.apply({
    plugin: function(__, fn) { resolveFn = fn.bind(resolveContext) }
  });

  return {
    fn: resolveFn,
    context: resolveContext
  };
}

describe('ComponentResolverPlugin behavior', function() {
  var extracted = emulateAndExtract();
  var resolveFn = extracted.fn;
  var resolveContext = extracted.context;

  var fixturesDir = path.join(__dirname, '_fixtures');

  context('when component file is not found', function() {
    var request = {
      path: fixturesDir,
      request: 'dir_without_file'
    };

    it('calls callback without any arguments', function(done) {
      resolveFn(request, done);
    });
  });

  context('when component file is not a file', function() {
    var request = {
      path: fixturesDir,
      request: 'dir_inside_of_dir'
    };

    it('calls callback without any arguments', function(done) {
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

    it('calls callback without any arguments', function(done) {
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

  context('when few extensions were specefied', function() {
    var request = {
      path: fixturesDir,
      request: 'dir_with_file',
      query: 'qwerty'
    };

  });
});

