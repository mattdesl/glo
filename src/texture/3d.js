var prop = require('dprop')
var inherits = require('inherit-class')
var assign = require('object-assign')
var texImage3D = require('./tex-image-3d')
var TextureBase = require('./tex-base')
var util = require('./tex-util')

module.exports = createTexture3D
function createTexture3D (gl, data, shape, opt) {
  return new Texture3D(gl, data, shape, opt)
}

var zero = [0, 0, 0]
var one = [1, 1, 1]

function Texture3D (gl, data, shape, opt) {
  if (typeof gl.TEXTURE_3D === 'undefined') {
    throw new Error('must provide a WebGL2 context')
  }  

  TextureBase.call(this, gl, gl.TEXTURE_3D, opt)

  var depth = util.getComponents(this.gl, this.format)
  this.shape = [0, 0, 0, depth]
  this.update(data, shape)
}

inherits(Texture3D, TextureBase)

Object.defineProperties(Texture3D.prototype, {
  depth: prop(function () {
    return this.shape[2]
  })
})

assign(Texture3D.prototype, {

  _upload: function (target, data, shape, offset, level) {
    this.bind()
    this._setParameters()
    texImage3D(this, target, data, shape, offset, level)
  },

  update: function update (data, shape, level) {
    shape = shape || one

    // level zero, update texture shape
    if (!level) {
      var channels = util.getComponents(this.gl, this.format)
      this.shape[0] = shape[0]
      this.shape[1] = shape[1]
      this.shape[2] = shape[2]
      this.shape[3] = channels
      shape = this.shape
    }

    this._upload(this.target, data, shape, null, level)
  },

  updateSubImage: function updateSubImage (data, shape, offset, level) {
    shape = shape || one
    offset = offset || zero
    this._upload(this.target, data, shape, offset, level)
  }
})
