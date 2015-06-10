var VolumeTexture = require('./tex-volume')

module.exports = createTexture3D
function createTexture3D (gl, data, size, opt) {
  return new VolumeTexture(gl, gl.TEXTURE_3D, data, size, opt)
}
