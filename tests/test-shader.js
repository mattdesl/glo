var test = require('tape')

var createShader = require('../src/glo-shader')
var createContext = require('webgl-context')

var glslify = require('glslify')
var quiet = true
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
  result.dispose()
  t.end()
})

test('shader should support reloading', function (t) {
  var expected = require('./fixtures/light-struct-types.json')
  var vert1 = glslify('./fixtures/light-struct.vert')
  var frag1 = glslify('./fixtures/light-struct.frag')

  var vert2 = glslify('./fixtures/light-struct.vert')
  var frag2 = glslify('./fixtures/pass.frag')

  var result = createShader(gl, {
    vertex: vert1,
    fragment: frag1
  })

  t.deepEqual(result.types, expected, 'provides types')

  var expected2 = { attributes: [ { name: 'position', type: 'vec4' }, { name: 'someAttrib', type: 'float' } ], uniforms: [ { name: 'view', type: 'mat4' }, { name: 'projection', type: 'mat4' }, { name: 'model', type: 'mat4' } ] }
  result.reload(vert2, frag2)
  t.deepEqual(result.types, expected2, 'reloads shader and gets new types')
  result.dispose()
  t.end()
})

test('shader should fail on compile', function (t) {
  var vert = glslify('./fixtures/light-struct.vert')
  var frag = glslify('./fixtures/multi-syntax-error.frag')

  function setup () {
    var result = createShader(gl, {
      vertex: vert,
      fragment: frag,
      quiet: quiet
    })
    result.dispose()
    return
  }

  t.throws(setup, 'frag shader should not compile')
  t.end()
})

test('shader should fail on link', function (t) {
  var vert = glslify('./fixtures/link-err.vert')
  var frag = glslify('./fixtures/link-err.frag')

  function setup () {
    var result = createShader(gl, {
      vertex: vert,
      fragment: frag,
      quiet: quiet
    })
    result.dispose()
    return
  }

  t.throws(setup, 'should throw error on link')
  t.end()
})
