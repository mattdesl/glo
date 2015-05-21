var compileShader = require('./compile-shader')
var linkShaders = require('./link-program')
var extract = require('gl-shader-extract')

module.exports = createShader
function createShader (gl, opt) {
  var attributes = opt.attributes || []
  var quiet = opt.quiet
  var program = gl.createProgram()
  var vertex, fragment, types

  var shader = {
    dispose: disposeProgram,
    bind: bind,
    reload: reload
  }

  // create initial program
  reload(opt.vertex, opt.fragment)

  // probably could use a wrapper to clean these up
  Object.defineProperties(shader, {
    handle: {
      configurable: true, enumerable: true,
      get: function () {
        return program
      }
    },
    vertexShader: {
      configurable: true, enumerable: true,
      get: function () {
        return vertex
      }
    },
    fragmentShader: {
      configurable: true, enumerable: true,
      get: function () {
        return fragment
      }
    },
    types: {
      configurable: true, enumerable: true,
      get: function () {
        return types
      }
    }
  })

  return shader

  function bind () {
    gl.useShader(program)
  }

  function disposeShaders () {
    if (vertex) {
      gl.detachShader(program, vertex)
      gl.deleteShader(vertex)
    }
    if (fragment) {
      gl.detachShader(program, fragment)
      gl.deleteShader(fragment)
    }
  }

  function disposeProgram () {
    disposeShaders()
    gl.deleteProgram(program)
  }

  // reload shader with new source code
  function reload (vertSrc, fragSrc) {
    disposeShaders()

    // re-compile source
    vertex = compileShader(gl, gl.VERTEX_SHADER, vertSrc, quiet)
    fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc, quiet)

    // re-link
    linkShaders(gl, program, [ vertex, fragment ], attributes, quiet)

    // extract uniforms and attributes
    types = extract(gl, program)
    // TODO: wire up uniform locations and such
  }
}
