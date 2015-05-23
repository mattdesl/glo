var compileShader = require('./compile-shader')
var linkShaders = require('./link-program')
var extract = require('gl-shader-extract')
var reflect = require('glsl-extract-reflect')

module.exports = createShader
function createShader (gl, opt) {
  var attributes = opt.attributes || []
  var quiet = opt.quiet
  var program = gl.createProgram()
  var vertexShader, fragmentShader, types, uniforms

  var shader = {
    dispose: disposeProgram,
    bind: bind,
    reload: reload
  }

  // compile the program
  reload(opt.vertex, opt.fragment)

  // probably could use a wrapper to clean these up
  Object.defineProperties(shader, {
    handle: getter(function () {
      return program
    }),
    vertexShader: getter(function () {
      return vertexShader
    }),
    fragmentShader: getter(function () {
      return fragmentShader
    }),
    types: getter(function () {
      return types
    }),
    uniforms: getter(function () {
      return uniforms
    })
  })

  return shader

  function bind () {
    gl.useProgram(program)
  }

  function disposeShaders () {
    if (vertexShader) {
      gl.detachShader(program, vertexShader)
      gl.deleteShader(vertexShader)
    }
    if (fragmentShader) {
      gl.detachShader(program, fragmentShader)
      gl.deleteShader(fragmentShader)
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
    vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertSrc, quiet)
    fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc, quiet)

    // re-link
    var shaders = [ vertexShader, fragmentShader ]
    linkShaders(gl, program, shaders, attributes, quiet)

    // extract uniforms and attributes
    types = extract(gl, program)

    // provide optimized getters/setters
    uniforms = reflect(types.uniforms, function (uniform, index) {
      return makeUniformProp(uniform, index)
    })
  }

  function makeUniformProp (uniform, index) {
    /*eslint-disable no-new-func*/
    var path = uniform.path
    var type = uniform.type
    var location = gl.getUniformLocation(program, path)
    var setter = getPropSetter(path, location, type)

    var generated = new Function('self', 'gl', 'program', 'location', [
      'return function (value, transposed) {',
        'if (typeof value === "undefined")',
          'return gl.getUniform(program, location)',
        'else {',
          setter,
          'return self',
        '}',
      '}'
    ].join('\n'))
    return generated(shader, gl, program, location)
  }
}

function getter (fn) {
  return {
    configurable: true,
    enumerable: true,
    get: fn
  }
}

function getPropSetter (path, location, type) {
  // currently this just handles GLSL ES 1.0
  // https://www.khronos.org/files/opengles_shading_language.pdf
  switch (type) {
    case 'bool':
    case 'int':
    case 'sampler2D':
    case 'samplerCube':
      return 'gl.uniform1i(location, value)'
    case 'float':
      return 'gl.uniform1f(location, value)'
  }

  var vecIdx = type.indexOf('vec')
  var count = parseInt(type.charAt(type.length - 1), 10)
  if (vecIdx === 0 || vecIdx === 1) {
    var vtype = type.charAt('0')
    switch (vtype) {
      case 'b':
      case 'i':
        return 'gl.uniform' + count + 'iv(location, value)'
      case 'v': // regular vecN
        return 'gl.uniform' + count + 'fv(location, value)'
      default:
        throw new Error('unrecognized uniform type ' + type + ' for ' + path)
    }
  } else if (type.indexOf('mat') === 0 && type.length === 4) {
    return 'gl.uniformMatrix' + count + 'fv(location, Boolean(transposed), value)'
  } else {
    throw new Error('unrecognized uniform type ' + type + ' for ' + path)
  }
}
