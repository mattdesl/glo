var smokestack = require('smokestack')
var entries = ['tests/test-texture-2d']

var file = require.resolve('tap-closer/bundle.js')
var closer = require('fs').readFileSync(file)

var browserify = require('browserify')
var watchify = require('watchify')
var concat = require('concat-stream')

var bundler = browserify({
  cache: {},
  packageCache: {},
  transform: require('glslify')
}).add('tests/test-texture-2d')

bundler = watchify(bundler, { delay: 0 })
bundler.on('update', rebundle)
rebundle()

function rebundle() {
  var bundle = bundler.bundle()
  bundle.on('error', function(err) {
    err = String(err)
    console.error(err)
  })

  var stream = smokestack()
  stream.write(closer)
  bundle.pipe(stream).pipe(process.stdout)
}