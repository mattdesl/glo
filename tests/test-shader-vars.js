var test = require('tape')

var createShader = require('../src/glo-shader')
var createContext = require('webgl-context')
var mat4 = require('gl-mat4')

var glslify = require('glslify')
var gl = createContext()

test('shader should compile', function (t) {
  var expected = require('./fixtures/light-struct-types.json')
  var vert = glslify('./fixtures/light-struct.vert')
  var frag = glslify('./fixtures/light-struct.frag')
  var result = createShader(gl, {
    vertex: vert,
    fragment: frag
  })

  t.deepEqual(result.types, expected, 'provides types')
  result.bind()

  var tint = result.uniforms.tint()
  t.deepEqual(tint instanceof Float32Array, true, 'vec4 getter')
  t.deepEqual(tint.length, 4, 'length is 4')
  t.deepEqual(result.uniforms.bools(), [ false, false ], 'bvec2 getter')
  t.deepEqual(result.uniforms.tint3(), [ 0, 0, 0 ], 'vec3 getter')
  t.deepEqual(result.uniforms.tex(), 0, 'sampler2D getter')

  var identity = mat4.identity([])
  var zeroes = identity.map(function () {
    return 0
  })
  t.deepEqual(result.uniforms.model(), zeroes, 'mat4 getter')

  result.uniforms.model(identity)
  t.deepEqual(result.uniforms.model(), identity, 'setter works')
  t.deepEqual(result.uniforms.lights.length, 1, 'only 1 light uniform active')

  var loc = gl.getUniformLocation(result.handle, 'lights[0].ambient')
  result.uniforms.lights[0].ambient([ 1, 0, 0.5 ])
  t.deepEqual(gl.getUniform(result.handle, loc), [ 1, 0, 0.5 ], 'sets light struct array')
  t.deepEqual(gl.getUniform(result.handle, loc), [ 1, 0, 0.5 ], 'sets light struct array')
  result.dispose()
  t.end()
})

