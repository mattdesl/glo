var isPOT = require('is-power-of-two')

var tmp = [0, 0]

module.exports.getComponents = getComponents
module.exports.getSize = getSize
module.exports.isNPOT = isNPOT

function getSize (data) {
  // fetch shape from DOM element
  if (data && typeof data.width === 'number' && typeof data.height === 'number') {
    tmp[0] = data.width
    tmp[1] = data.height
    return tmp
  } else {
    tmp[0] = 1
    tmp[1] = 1
    return tmp
  }
}

function isNPOT (n) {
  return (!isPOT(n) || n === 0) && n >= 0
}

function getComponents (gl, format) {
  switch (format) {
    case gl.DEPTH_COMPONENT:
    case gl.ALPHA:
    case gl.LUMINANCE:
      return 1
    case gl.LUMINANCE_ALPHA:
      return 2
    case gl.RGB:
      return 3
    default:
      return 4
  }
}