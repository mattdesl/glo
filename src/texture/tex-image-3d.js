var normalize = require('./normalize-pixels')

// for gl.TEXTURE_2D_ARRAY and gl.TEXTURE_3D
module.exports = texImage3D
function texImage3D (texture, target, data, shape, offset, level) {
  var gl = texture.gl
  var format = texture.format
  var type = texture.type
  var compressed = texture.compressed

  var width = shape[0]
  var height = shape[1]
  var depth = shape[2]
  data = normalize(data, type, shape[shape.length-1])
  level = level || 0
  
  if (offset) {
    if (compressed) {
      gl.compressedTexSubImage3D(target, level,
          offset[0], offset[1], offset[2], 
          width, height, depth, format, data)
    } else {
      gl.texSubImage3D(target, level, 
          offset[0], offset[1], offset[2],
          width, height, depth, format, type, data)
    }
  } else {
    if (compressed) {
      gl.compressedTexImage3D(target, level, format,
        width, height, depth, 0, data)
    } else {
      gl.texImage3D(target, level, format, 
        width, height, depth,
        0, format, type, data)
    }
  }
}
