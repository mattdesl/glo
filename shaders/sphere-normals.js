var glslify = require('glslify')
module.exports = {
  vertex: glslify('./sphere-normals.vert'),
  fragment: glslify('./sphere-normals.frag')
}
