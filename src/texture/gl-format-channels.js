module.exports = getChannels
function getChannels (gl, format) {
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
