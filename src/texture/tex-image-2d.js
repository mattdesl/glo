// for gl.TEXTURE_2D and gl.TEXTURE_CUBE_MAP
var isDOMImage = require('is-dom-image')
var normalize = require('./normalize-pixels')

module.exports = texImage2D
function texImage2D (texture, target, data, shape, offset, level) {
  var gl = texture.gl
  var format = texture.format
  var type = texture.type
  var compressed = texture.compressed

  var width = shape[0]
  var height = shape[1]
  data = normalize(data, type, shape[shape.length-1])
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
