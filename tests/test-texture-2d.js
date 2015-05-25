var test = require('tape')

var createTexture2D = require('../src/texture/2d')
var createContext = require('webgl-context')
var baboon = require('baboon-image-uri')
var loadImage = require('img')

test('should create array buffer', function (t) {
  var gl = createContext()
  t.plan(1)

  loadImage(baboon, function (err, image) {
    if (err) t.fail(err)
    
    var tex = createTexture2D(gl, image, {
      wrap: gl.REPEAT,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR
    })
  })
})