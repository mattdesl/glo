var identity = require('gl-mat4/identity')
var defined = require('defined')

module.exports = function(opt) {
  opt = opt || {}
  return {
    projection: opt.projection || identity([]),
    view: opt.projection || identity([]),
    position: opt.position || [0, 0, 0],
    direction: opt.direction || [0, 0, -1],
    up: opt.up || [0, 1, 0]
  }
}



