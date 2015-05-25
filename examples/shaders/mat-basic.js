var glslify = require('glslify')
module.exports = {
  vertex: glslify('./mat-basic.vert'),
  fragment: glslify('./mat-basic.frag'),
  name: 'mat-basic'
}
