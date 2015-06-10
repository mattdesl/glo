var test = require('tape')

var createTexture2D = require('../src/texture/2d')
var createContext = require('webgl-context')
var baboon = require('baboon-image-uri')
var loadImage = require('img')
var readTexture = require('gl-texture2d-pixels')

test('should handle array data', function (t) {
  var gl = createContext()
  var expected = new Uint8Array([0, 5, 84, 255])
  var pixels = [ 0, 5, 84 ]
  var shape = [1, 1]
  var tex = createTexture2D(gl, pixels, shape, {
    format: gl.RGB,
    type: gl.UNSIGNED_BYTE
  })
  pixels = readTexture(tex)
  t.deepEqual(pixels, expected, 'flat array')

  pixels = [ [ 0, 5, 84 ] ]
  tex = createTexture2D(gl, pixels, shape, {
    format: gl.RGB,
    type: gl.UNSIGNED_BYTE
  })
  pixels = readTexture(tex)
  t.deepEqual(pixels, expected, 'nested array')

  function shouldThrow () {
    pixels = [ [ 0, 5, 84, 15 ] ]
    createTexture2D(gl, pixels, shape, {
      format: gl.RGB,
      type: gl.UNSIGNED_BYTE
    })
  }
  t.throws(shouldThrow, 'invalid depth in nested array')

  function shouldNotThrow () {
    pixels = [ [ 0, 5, 84, 15 ] ]
    createTexture2D(gl, pixels, shape, {
      format: gl.RGBA,
      type: gl.UNSIGNED_BYTE
    })
  }
  t.doesNotThrow(shouldNotThrow, 'valid depth in nested array')

  function shouldNotThrow2 () {
    pixels = [ 0, 100, -150 ]
    tex = createTexture2D(gl, pixels, shape, {
      format: gl.RGB,
      type: gl.FLOAT
    })
  }
  if (gl.getExtension('OES_texture_float')) {
    t.doesNotThrow(shouldNotThrow2, 'handles Float32Array conversion')
  }

  readTexture.dispose()
  t.end()
})

test('should accept canvas element', function (t) {
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')
  canvas.width = 1
  canvas.height = 1
  ctx.fillStyle = 'red'
  ctx.fillRect(0, 0, 1, 1)

  var gl = createContext()
  var tex = createTexture2D(gl, canvas, [ canvas.width, canvas.height ])
  tex.bind()
  var pixels = readTexture(tex)
  t.deepEqual(pixels, new Uint8Array([ 255, 0, 0, 255 ]))

  readTexture.dispose()
  t.end()
})

test('should handle constructor', function (t) {
  var gl = createContext()

  var tex = createTexture2D(gl)
  t.equal(tex.format, gl.RGBA, 'format')
  t.equal(tex.compressed, false, 'compressed')
  t.equal(tex.premultiplyAlpha, false, 'premultiplyAlpha')
  t.equal(tex.flipY, false, 'flipY')
  t.equal(tex.type, gl.UNSIGNED_BYTE, 'type')
  tex.dispose()

  tex = createTexture2D(gl, { format: gl.RGB })
  t.equal(tex.format, gl.RGB, 'matches format')
  tex.dispose()

  tex = createTexture2D(gl, null, [2, 3], { format: gl.RGB })
  t.equal(tex.format, gl.RGB, 'matches format')
  t.deepEqual(tex.shape, [ 2, 3, 3 ])
  tex.dispose()

  tex = createTexture2D(gl, null)
  t.equal(tex.format, gl.RGBA, 'matches format')
  t.deepEqual(tex.shape, [1, 1, 4], 'matches shape')
  tex.dispose()
  t.end()
})

test('should handle non-POT with grace', function (t) {
  var gl = createContext()
  var tex = createTexture2D(gl, [
    [ 0, 0, 255 ], [ 0, 255, 0 ], [ 255, 0, 0 ]
  ], [ 3, 1 ], { format: gl.RGB })
  tex.bind()
  var pixels = readTexture(tex)
  var expected = new Uint8Array([0, 0, 255, 255, 0, 255, 0, 255, 255, 0, 0, 255 ])
  t.deepEqual(pixels, expected, 'matches pixels')

  readTexture.dispose()
  t.end()
})

test('should create empty texture', function (t) {
  var gl = createContext()
  var tex = createTexture2D(gl)
  tex.bind()
  var pixels = readTexture(tex)
  t.deepEqual(pixels, new Uint8Array([ 0, 0, 0, 0 ]))
  t.deepEqual(tex.shape, [ 1, 1, 4 ])

  tex.format = gl.RGB
  tex.update(null, [ 2, 2 ])
  tex.bind()
  pixels = readTexture(tex)
  t.deepEqual(pixels, new Uint8Array([
    0, 0, 0, 255,
    0, 0, 0, 255,
    0, 0, 0, 255,
    0, 0, 0, 255
  ]))
  t.deepEqual(tex.shape, [ 2, 2, 3 ])
  readTexture.dispose()
  t.end()
})

test('should create texture from image', function (t) {
  var gl = createContext()
  var ext = gl.getExtension('EXT_texture_filter_anisotropic')

  var count = 7
  if (ext) {
    count++
  }
  t.plan(count)

  loadImage(baboon, function (err, image) {
    if (err) t.fail(err)

    var tex = createTexture2D(gl, image, [image.width, image.height], {
      wrap: gl.REPEAT,
      minFilter: gl.LINEAR,
      magFilter: gl.NEAREST,
      mipSamples: 3
    })

    tex.bind()
    var pixels = readTexture(tex)
    t.equal(pixels.length, image.width * image.height * 4, 'correct pixels')
    t.equal(tex.width, image.width)
    t.equal(tex.height, image.height)
    t.deepEqual(tex.shape, [ image.width, image.height, 4 ])

    t.equal(tex.minFilter, gl.LINEAR)
    t.equal(tex.magFilter, gl.NEAREST)
    t.deepEqual(tex.wrap, [ gl.REPEAT, gl.REPEAT ])

    if (ext) {
      var samples = gl.getTexParameter(tex.target, ext.TEXTURE_MAX_ANISOTROPY_EXT)
      t.equal(samples, 3, 'mip samples set')
    }
    readTexture.dispose()
  })
})

test('should create from RGB uint8_clamped pixels', function (t) {
  var gl = createContext()
  var pixels = new Uint8ClampedArray([ 155, 15, 255 ])
  var expected = new Uint8Array([ 155, 15, 255, 255 ])
  run(t, pixels, gl.RGB, gl.UNSIGNED_BYTE, expected)
})

test('should create from RGBA uint8_clamped pixels', function (t) {
  var gl = createContext()
  var pixels = new Uint8ClampedArray([ 155, 15, 255, 128 ])
  var expected = new Uint8Array([ 155, 15, 255, 128 ])
  run(t, pixels, gl.RGBA, gl.UNSIGNED_BYTE, expected)
})

test('should accept float type texture', function (t) {
  var gl = createContext()
  var pixels = new Float32Array([ 1, -3, -10, -50 ])

  var ext = gl.getExtension('OES_texture_float')
  if (!ext) {
    t.fail('This device does not support OES_texture_float')
  }
  var shape = [1, 1]
  var tex = createTexture2D(gl, pixels, shape, {
    format: gl.RGBA,
    type: gl.FLOAT
  })
  tex.bind()
  t.ok(true, 'got a float type')
  t.end()
})

function run (t, pixels, format, type, expected) {
  var gl = createContext()

  var shape = [1, 1]
  var tex = createTexture2D(gl, pixels, shape, {
    format: format,
    type: type
  })
  tex.bind()

  var imagePixels = readTexture(tex)
  t.deepEqual(imagePixels, expected, 'matches color')
  readTexture.dispose()
  t.end()
}