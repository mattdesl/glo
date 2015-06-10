var assign = require('object-assign')
var inherits = require('inherit-class')
var TextureBase = require('./tex-base')
var isDOMImage = require('is-dom-image')
var util = require('./tex-util')
var texImage2D = require('./tex-image-2d')
var prop = require('dprop')

module.exports = createTextureCube
function createTextureCube (gl, elements, size, opt) {
  return new TextureCube(gl, elements, size, opt)
}

function TextureCube (gl, elements, size, opt) {
  // allow options to be second parameter
  if (elements && !Array.isArray(elements)) {
    opt = elements
    size = null
    elements = null
  }

  // default size to 1x1x1
  if (!Array.isArray(size)) {
    size = [1, 1, 1]
  }

  TextureBase.call(this, gl, gl.TEXTURE_CUBE_MAP, opt)
  this.update(elements, size)
}

inherits(TextureCube, TextureBase)

Object.defineProperties(TextureCube.prototype, {
  depth: prop(function () {
    return 6
  })
})

assign(TextureCube.prototype, {

  _upload: function _upload (elements, size, offset, level) {
    validate(elements, size)

    this.bind()
    this.setPixelStorage()

    for (var i = 0; i < 6; i++) {
      var data = elements ? elements[i] : null
      var target = this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i
      texImage2D(this, target, data, size, offset, level)
    }
  },

  _reshape: function _reshape (size) {
    this.shape[0] = size[0]
    this.shape[1] = size[1]
    this.shape[2] = 6
    this.shape[3] = util.getComponents(this.gl, this.format)
  }

})

function validate (elements, size) {
  if (!elements) {
    // empty texture is OK
    return
  }

  // not enough elements
  if (!Array.isArray(elements) || elements.length !== 6) {
    throw new Error('must provide six images or pixel arrays')
  }

  // user didn't provide size
  if (!Array.isArray(size)) {
    throw new Error('must provide a [width, height] for cube map')
  }

  // ensure all images match the size
  elements.forEach(function (image) {
    if (isDOMImage(image) &&
      (image.width !== size[0] || image.height !== size[1])) {
      throw new Error('all faces must have the same [width, height]')
    }
  })
}
