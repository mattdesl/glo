var test = require('tape')

var createShader = require('../src/glo-shader')
var createContext = require('webgl-context')

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

  // t.equal(result.types.uniforms)
  // var result = require('../src/glo-shader/reflect')(result.types.uniforms, true)
  // console.log(JSON.stringify(result, undefined, 2))

  var loc = gl.getUniformLocation(result.handle, 'lights[0].falloff')
  console.log(loc)

  result.dispose()
  t.end()
})

