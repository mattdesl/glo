var transformMat4 = require('gl-vec4/transformMat4')
var set = require('gl-vec4/set')

var NEAR_RANGE = 0
var FAR_RANGE = 1
var tmpVec4 = [0, 0, 0, 0]

module.exports = function (out, vec, viewport, combinedProjView) {
  var vX = viewport[0],
    vY = viewport[1],
    vWidth = viewport[2],
    vHeight = viewport[3],
    n = NEAR_RANGE,
    f = FAR_RANGE

  //convert: clip space -> NDC -> window coords

  // implicit 1.0 for w component
  set(tmpVec4, vec[0], vec[1], vec[2], 1.0)

  // transform into clip space
  transformMat4(tmpVec4, tmpVec4, combinedProjView)

  // now transform into NDC
  var w = tmpVec4[3]
  tmpVec4[0] = tmpVec4[0] / w
  tmpVec4[1] = tmpVec4[1] / w
  tmpVec4[2] = tmpVec4[2] / w

  // and finally into window coordinates
  // the foruth component is (1/clip.w)
  // which is the same as gl_FragCoord[3]
  out[0] = vX + vWidth / 2 * tmpVec4[0] + (0 + vWidth / 2)
  out[1] = vY + vHeight / 2 * tmpVec4[1] + (0 + vHeight / 2)
  out[2] = (f - n) / 2 * tmpVec4[2] + (f + n) / 2
  out[3] = 1 / tmpVec4[3]
  return out
}
