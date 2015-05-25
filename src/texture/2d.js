var defined = require('defined')
var assign = require('object-assign')
var prop = require('dprop')

module.exports = createTexture2D
function createTexture2D (gl, element, shape, opt) {
  return new Texture2D(gl, element, shape, opt)
}

var zero = [0, 0]
var tmp = [0, 0]

function Texture2D (gl, element, shape, opt) {
  // accept element only constructor (no shape)
  if (isDOMType(element)
      && !Array.isArray(shape)
      && typeof shape === 'object') {
    opt = shape
    shape = texShape(element)
  }

  opt = opt || {}

  this.gl = gl
  this.format = opt.format || gl.RGBA
  this.type = opt.type || gl.UNSIGNED_BYTE
  this.flipY = Boolean(opt.flipY)
  this.unpackAlignment = defined(opt.unpackAlignment, 1)
  this.premultiplyAlpha = Boolean(opt.premultiplyAlpha)
  this.handle = gl.createTexture()
  this.target = gl.TEXTURE_2D
  this.shape = [0, 0]

  this._wrap = []
  this._minFilter = null
  this._magFilter = null
  this._mipSamples = 1
  this.update(element, shape)

  this.minFilter = defined(opt.minFilter, gl.NEAREST)
  this.magFilter = defined(opt.magFilter, gl.NEAREST)
  this.wrap = defined(opt.wrap, gl.CLAMP_TO_EDGE)
  this.mipSamples = defined(opt.mipSamples, 1)
}

Object.defineProperties(Texture2D.prototype, {

  width: prop(function () {
    return this.shape[0]
  }),

  height: prop(function () {
    return this.shape[1]
  }),

  // anisotropic filtering
  mipSamples: prop(function () {
    return this._mipSamples
  }, function (samples) {
    var old = this._mipSamples
    this._mipSamples = Math.max(samples, 1) | 0
    if (old !== this._mipSamples) {
      var gl = this.gl
      var ext = gl.getExtension('EXT_texture_filter_anisotropic')
      if (ext) {
        gl.texParameterf(this.target, ext.TEXTURE_MAX_ANISOTROPY_EXT, this._mipSamples)
      }
    }
  }),

  minFilter: prop(function () {
    return this._minFilter
  }, function (filter) {
    var gl = this.gl
    this._minFilter = filter
    this.bind()
    gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, filter)
  }),

  magFilter: prop(function () {
    return this._magFilter
  }, function (filter) {
    var gl = this.gl
    this._magFilter = filter
    this.bind()
    gl.texParameteri(this.target, gl.TEXTURE_MAG_FILTER, filter)
  }),

  wrap: prop(function () {
    return this._wrap
  }, function (modes) {
    if (!Array.isArray(modes)) {
      modes = [ modes, modes ]
    }
    if (modes.length !== 2) {
      throw new Error('must specify wrapS, wrapT modes')
    }

    var gl = this.gl
    this.bind()
    this._wrap[0] = modes[0]
    this._wrap[1] = modes[1]
    gl.texParameteri(this.target, gl.TEXTURE_WRAP_S, modes[0])
    gl.texParameteri(this.target, gl.TEXTURE_WRAP_T, modes[1])
  })
})

assign(Texture2D.prototype, {

  bind: function bind (slot) {
    var gl = this.gl
    var target = this.target
    if (typeof slot === 'number') {
      gl.activeTexture(gl.TEXTURE0 + slot)
    }
    gl.bindTexture(target, this.handle)
  },

  generateMipmap: function generateMipmap () {
    this.bind()
    this.gl.generateMipmap(this.target)
  },

  update: function update (data, shape, level) {
    shape = shape || texShape(data)
    this.shape[0] = shape[0]
    this.shape[1] = shape[1]

    var depth = 4
    var gl = this.gl
    switch (this.format) {
      case gl.DEPTH_COMPONENT:
      case gl.ALPHA:
      case gl.LUMINANCE:
        depth = 1; break
      case gl.LUMINANCE_ALPHA:
        depth = 2; break
      case gl.RGB:
        depth = 3; break
      case gl.RGBA:
        depth = 4; break
    }

    this.shape[2] = depth
    this.bind()
    texImage(this, data, this.shape, null, level)
  },

  updateSubImage: function updateSubImage (data, shape, offset, level) {
    // possible overloads:
    //   updateSubImage(data, [ 25, 15 ], mipLevel)
    //   updateSubImage(element, mipLevel)

    if (isDOMType(data)) {
      level = offset
      offset = shape
    }

    offset = offset || zero
    shape = shape || texShape(data)
    this.bind()
    texImage(this, data, shape, offset, level)
  }
})

function texShape (data) {
  // fetch shape from DOM element
  if (typeof data.width === 'number' && typeof data.height === 'number') {
    tmp[0] = data.width
    tmp[1] = data.height
    return tmp
  } else {
    throw new TypeError('could not determine shape (width, height) for texture.updateSubImage')
  }
}

function texImage (texture, data, shape, offset, level) {
  var gl = texture.gl
  var format = texture.format
  var type = texture.type
  var target = texture.target
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultiplyAlpha)
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, texture.unpackAlignment)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, texture.flipY)

  data = normalize(data)
  level = level || 0
  if (isDOMType(data)) {
    if (offset) {
      gl.texSubImage2D(target, level, offset[0], offset[1],
        format, type, data)
    } else {
      gl.texImage2D(target, level, format, format, type, data)
    }
  } else {
    if (offset) {
      gl.texSubImage2D(target, level, offset[0], offset[1],
          shape[0], shape[1], format, type, data)
    } else {
      gl.texImage2D(target, level, format, shape[0], shape[1],
        0, format, type, data)
    }
  }
}

function isDOMType (data) {
  /*global HTMLCanvasElement, ImageData, HTMLImageElement, HTMLVideoElement */
  return (typeof HTMLCanvasElement !== 'undefined' && data instanceof HTMLCanvasElement)
    || (typeof ImageData !== 'undefined' && data instanceof ImageData)
    || (typeof HTMLImageElement !== 'undefined' && data instanceof HTMLImageElement)
    || (typeof HTMLVideoElement !== 'undefined' && data instanceof HTMLVideoElement)
}

function normalize (pixels) {
  // normalize uint8 types
  if (pixels instanceof Uint8ClampedArray || Array.isArray(pixels))
    return new Uint8Array(pixels)
  return pixels || null
}
