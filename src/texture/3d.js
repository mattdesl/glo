var prop = require('dprop')
var inherits = require('inherit-class')
var assign = require('object-assign')
var texImage3D = require('./tex-image-3d')
var TextureBase = require('./tex-base')
var util = require('./tex-util')
var anArray = require('an-array')

module.exports = createTexture3D
function createTexture3D (gl, data, size, opt) {
  return new Texture3D(gl, data, size, opt)
}

function Texture3D (gl, data, size, opt) {
  if (typeof gl.TEXTURE_3D === 'undefined') {
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

  TextureBase.call(this, gl, gl.TEXTURE_3D, opt)
  this.update(data, size)
}

inherits(Texture3D, TextureBase)

Object.defineProperties(Texture3D.prototype, {
  depth: prop(function () {
    return this.shape[2]
  })
})

assign(Texture3D.prototype, {

  _upload: function _upload (data, size, offset, level) {
    this.bind()
    this.setPixelStorage()
    texImage3D(this, this.target, data, size, offset, level)
  },

  _reshape: function _reshape (size) {
    this.shape[0] = size[0]
    this.shape[1] = size[1]
    this.shape[2] = size[2]
    this.shape[3] = util.getComponents(this.gl, this.format)
  }
})
