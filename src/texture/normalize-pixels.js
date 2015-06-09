var pack = require('array-pack-2d')
var dtype = require('dtype')
var fromGLType = require('gl-to-dtype')

module.exports = normalize
function normalize (pixels, glType, channels) {
  if (Array.isArray(pixels)) {
    var type = fromGLType(glType)
    if (!type) {
      throw new Error('bare arrays must use a common gl texture type')
    }
    if (Array.isArray(pixels[0])) { // nested
      if (pixels[0].length !== channels) {
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
