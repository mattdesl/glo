var glslify = require('glslify')
module.exports = {
  vertex: glslify('./basic.vert'),
  fragment: glslify('./basic.frag')
}
