var prop = require('dprop')
var inherits = require('inherit-class')
var assign = require('object-assign')
var texImage3D = require('./tex-image-3d')
var TextureBase = require('./tex-base')
var getChannels = require('./gl-format-channels')
var anArray = require('an-array')

module.exports = VolumeTexture
function VolumeTexture (gl, target, data, size, opt) {
  if (typeof gl.TEXTURE_3D === 'undefined'
    || typeof gl.TEXTURE_2D_ARRAY === 'undefined') {
    throw new Error('must provide a WebGL2 context')
  }

  // if options is second param
  if (data && !anArray(data)) {
    opt = data
    data = null
    size = null
  }

  // default volume is 1x1x1
  if (!Array.isArray(size)) {
    size = [ 1, 1, 1 ]
  }

  TextureBase.call(this, gl, target, opt)
  this.update(data, size)
}

inherits(VolumeTexture, TextureBase)

Object.defineProperties(VolumeTexture.prototype, {
  depth: prop(function () {
    return this.shape[2]
  })
})

assign(VolumeTexture.prototype, {

  _upload: function _upload (data, size, offset, level) {
    this.bind()
    this.setPixelStorage()
    texImage3D(this, this.target, data, size, offset, level)
  },

  _reshape: function _reshape (size) {
    this.shape[0] = size[0]
    this.shape[1] = size[1]
    this.shape[2] = size[2]
    this.shape[3] = getChannels(this.gl, this.format)
  }
})
