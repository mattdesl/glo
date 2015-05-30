var isDOMImage = require('./is-dom-image')
var pack = require('array-pack-2d')
var dtype = require('dtype')
var fromGLType = require('gl-to-dtype')

module.exports = texImage2D
function texImage2D (texture, target, data, shape, offset, level) {
	var gl = texture.gl
  var format = texture.format
  var type = texture.type
  var compressed = texture.compressed
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultiplyAlpha)
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, texture.unpackAlignment)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, texture.flipY)

  var width = shape[0]
  var height = shape[1]
  data = normalize(data, type, shape[2])
  level = level || 0
  if (isDOMImage(data)) {
    if (compressed) {
      throw new Error('compressed textures must provide ArrayBuffer')
    }
    if (offset) {
      gl.texSubImage2D(target, level, offset[0], offset[1],
        format, type, data)
    } else {
      gl.texImage2D(target, level, format, format, type, data)
    }
  } else {
    if (offset) {
      if (compressed) {
        gl.compressedTexSubImage2D(target, level, 
            offset[0], offset[1], width, height, format, data)
      } else {
        gl.texSubImage2D(target, level, offset[0], offset[1],
            width, height, format, type, data)
      }
    } else {
      if (compressed) {
        gl.compressedTexImage2D(target, level, format, 
          width, height, 0, data)
      } else {
        gl.texImage2D(target, level, format, width, height,
          0, format, type, data)
      }
    }
  }
}

function normalize (pixels, glType, depth) {
  if (Array.isArray(pixels)) {
    var type = fromGLType(glType)
    if (!type) {
      throw new Error('bare arrays must use a common gl texture type')
    }
    if (Array.isArray(pixels[0])) { // nested
      if (pixels[0].length !== depth) {
        throw new Error('nested array length does not match expected components in texture format')
      }
      return pack(pixels, type)
    } else {
      return new (dtype(type))(pixels)
    }
  } else if (pixels instanceof Uint8ClampedArray) {
    // normalize uint8 types for webGL
    return new Uint8Array(pixels)
  }
  return pixels || null
}
