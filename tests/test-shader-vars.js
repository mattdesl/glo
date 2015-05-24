var test = require('tape')

var createShader = require('../src/shader')
var createContext = require('webgl-context')
var mat4 = require('gl-mat4')

var glslify = require('glslify')
var gl = createContext()

test('shader should compile', function (t) {
  var expected = require('./fixtures/light-struct-types.json')
  var vert = glslify('./fixtures/light-struct.vert')
  var frag = glslify('./fixtures/light-struct.frag')
  var shader = createShader(gl, {
    vertex: vert,
    fragment: frag
  })

  t.deepEqual(shader.types.attributes, expected.attributes, 'provides attribute types')
  t.deepEqual(shader.types.uniforms, expected.uniforms, 'provides uniform types')
  shader.bind()

  var tint = shader.uniforms.tint()
  t.deepEqual(tint instanceof Float32Array, true, 'vec4 getter')
  t.deepEqual(tint.length, 4, 'length is 4')
  t.deepEqual(shader.uniforms.bools(), [ false, false ], 'bvec2 getter')
  t.deepEqual(shader.uniforms.tint3(), [ 0, 0, 0 ], 'vec3 getter')
  t.deepEqual(shader.uniforms.tex(), 0, 'sampler2D getter')

  var identity = mat4.identity([])
  var zeroes = identity.map(function () {
    return 0
  })
  t.deepEqual(shader.uniforms.model(), zeroes, 'mat4 getter')

  shader.uniforms.model(identity)
  t.deepEqual(shader.uniforms.model(), identity, 'setter works')
  t.deepEqual(shader.uniforms.lights.length, 1, 'only 1 light uniform active')

  var loc = gl.getUniformLocation(shader.handle, 'lights[0].ambient')
  shader.uniforms.lights[0].ambient([ 1, 0, 0.5 ])
  t.deepEqual(gl.getUniform(shader.handle, loc), [ 1, 0, 0.5 ], 'sets light struct array')

  // test default bindings, position is usually always 0
  t.deepEqual(shader.attributes, { position: { location: 0, size: 4, type: 'vec4' }, someAttrib: { location: 1, size: 1, type: 'float' } }, 'attributes and locations')

  // Oddly bindAttribLocation produces a warning in Chrome 43 although it works fine
  shader = createShader(gl, {
    quiet: true,
    vertex: vert,
    fragment: frag,
    attributes: [
      { name: 'position', location: 1 }
    ]
  })
  t.deepEqual(shader.attributes, { position: { location: 1, size: 4, type: 'vec4' }, someAttrib: { location: 0, size: 1, type: 'float' } }, 'bind attrib locations')

  shader.dispose()
  t.end()
})