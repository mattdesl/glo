var assign = require('object-assign')
var inherits = require('inherit-class')
var TextureBase = require('./tex-base')
var isDOMImage = require('is-dom-image')
var util = require('./tex-util')
var texImage2D = require('./tex-image-2d')
var prop = require('dprop')

// user can upload a null 6-sided cube map
var empties = [ null, null, null, null, null, null ]

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

Object.defineProperties(TextureCube.prototype, {

  depth: prop(function () {
    return 6
  })
})

assign(TextureCube.prototype, {

  _upload: function (elements, shape, offset, level) {
    this.bind()
    this._setParameters()
    
    elements = elements || empties
    elements.forEach(function (data, i) {
      var target = this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i
      texImage2D(this, target, data, shape, offset, level)
    }, this)
  },

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

    this._upload(elements, shape, null, level)
  },

  updateSubImage: function updateSubImage (data, shape, offset, level) {
    // possible overloads:
    //   updateSubImage([data], [ 25, 15 ], [ x, y ], mipLevel)
    //   updateSubImage([images], [ x, y ], mipLevel)
    if (!Array.isArray(offset)) {
      
    }
  }
})

function textureSize (elements, shape) {
  if (!elements)
    return util.getSize(null) // [1, 1]

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
