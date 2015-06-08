var assign = require('object-assign')
var inherits = require('inherit-class')
var TextureBase = require('./tex-base')
var isDOMImage = require('./is-dom-image')
var util = require('./tex-util')
var texImage2D = require('./tex-image-2d')

module.exports = createTextureCube
function createTextureCube (gl, elements, shape, opt) {
  return new TextureCube(gl, elements, shape, opt)
}

function TextureCube (gl, elements, shape, opt) {
  // if user specifies cube(gl, elements, [opt])
  if (!Array.isArray(shape)) {
    opt = shape
    shape = null
  }

  TextureBase.call(this, gl, gl.TEXTURE_CUBE_MAP, opt)

  var depth = util.getComponents(this.gl, this.format)
  this.shape = [0, 0, 6, depth]
  this.update(elements, shape)
}

inherits(TextureCube, TextureBase)

assign(TextureCube.prototype, {

  update: function update (elements, shape, level) {
    // possible overloads:
    //   update(elements, [ 25, 15 ], mipLevel)
    //   update(elements, mipLevel)

    if (!Array.isArray(shape)) {
      level = shape
      shape = null
    }

    shape = shape || textureSize(elements, shape)

    // level zero, update texture shape
    if (!level) {
      var depth = util.getComponents(this.gl, this.format)

      this.shape[0] = shape[0]
      this.shape[1] = shape[1]
      this.shape[3] = depth
      shape = this.shape
    }

    this.bind()
    elements.forEach(function (data, i) {
      var target = this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i
      texImage2D(this, target, data, shape, null, level)
    }, this)
  }
})

function textureSize (elements, shape) {
  if (!Array.isArray(elements) || elements.length !== 6) {
    throw new Error('must provide six images or pixel arrays')
  }

  // user didn't provide size
  if (!Array.isArray(shape)) {
    // get first image's size
    var images = elements.filter(isDOMImage)
    if (images.length === 0) {
      throw new Error('must provide a [width, height] for plain arrays')
    }
    shape = util.getSize(images[0])
  }

  // ensure all images match the shape
  elements.forEach(function (image) {
    if (isDOMImage(image) &&
        (image.width !== shape[0] || image.height !== shape[1])) {
      throw new Error('all faces must have the same [width, height]')
    }
  })

  return shape
}
