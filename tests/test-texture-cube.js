/*global Image*/
var test = require('tape')

var baboon = require('baboon-image-uri')
var loadImage = require('img')
var createTextureCube = require('../src/texture/cube')
var createContext = require('webgl-context')

test('should create cube texture', function (t) {
  var gl = createContext()
  var array = new Uint8Array(128 * 128 * 4)
  var image = document.createElement('canvas')
  image.width = image.height = 128
  image.getContext('2d').fillRect(0, 0, 128, 128)

  t.plan(4)
  t.throws(function () {
    createTextureCube(gl, [])
  }, 'needs 6 faces')

  t.doesNotThrow(function () {
    createTextureCube(gl, [ image, image, image, image, image, image ])
  }, 'accepts 6 images')

  t.doesNotThrow(function () {
    createTextureCube(gl, [ image, array, image, array, image, image ])
  }, 'accepts mixed image and arrays')

  loadImage(baboon, function (err, image2) {
    if (err) t.fail(err)
    var image1 = new Image()
    t.throws(function () {
      createTextureCube(gl, [ image2, array, image1, array, image2, image ])
    }, 'images must have same dimensions')
  })
})

