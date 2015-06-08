var inherits = require('inherit-class')
var assign = require('object-assign')
var prop = require('dprop')
var isDOMImage = require('./is-dom-image')
var texImage2D = require('./tex-image-2d')
var TextureBase = require('./tex-base')
var util = require('./tex-util')

module.exports = createTexture2D
function createTexture2D (gl, element, shape, opt) {
  return new Texture2D(gl, element, shape, opt)
}

var zero = [0, 0]

function Texture2D (gl, element, shape, opt) {
  // texture(gl, element, [opt])
  if (!Array.isArray(shape)) {
    opt = shape
    shape = null
  }

  TextureBase.call(this, gl, gl.TEXTURE_2D, opt)

  var depth = util.getComponents(this.gl, this.format)
  this.shape = [0, 0, depth]
  this.update(element, shape)
}

inherits(Texture2D, TextureBase)

assign(Texture2D.prototype, {

  _upload: function (target, data, shape, offset, level) {
    this.bind()
    this._setParameters()
    texImage2D(this, target, data, shape, offset, level)
  },

  update: function update (data, shape, level) {
    // possible overloads:
    //   update(data, [ 25, 15 ], mipLevel)
    //   update(element, mipLevel)

    if (isDOMImage(data)) {
      level = shape
    }

    shape = shape || util.getSize(data)

    // level zero, update texture shape
    if (!level) {
      var depth = util.getComponents(this.gl, this.format)

      this.shape[0] = shape[0]
      this.shape[1] = shape[1]
      this.shape[2] = depth
      shape = this.shape
    }

    this._upload(this.target, data, shape, null, level)
  },

  updateSubImage: function updateSubImage (data, shape, offset, level) {
    // possible overloads:
    //   updateSubImage(data, [ 25, 15 ], mipLevel)
    //   updateSubImage(element, mipLevel)

    if (isDOMImage(data)) {
      level = offset
      offset = shape
    }

    offset = offset || zero
    shape = shape || util.getSize(data)
    this._upload(this.target, data, shape, offset, level)
  }
})
