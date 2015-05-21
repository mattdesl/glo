var createStruct = require('./struct')
var assign = require('object-assign')

var cameraLookAt = require('./camera-look-at')
var identity4x4 = require('gl-mat4/identity')
var setVec3 = require('gl-vec3/set')

module.exports = function cameraBase(opt) {
  var camera = createStruct(opt)
  
  function lookAt(target) {
    cameraLookAt(camera.direction, camera.up, camera.position, target)
  }

  function identity() {
    setVec3(camera.position, 0, 0, 0)
    setVec3(camera.direction, 0, 0, -1)
    setVec3(camera.up, 0, 1, 0)
    identity4x4(camera.view)
    identity4x4(camera.projection)
  }
  
  return assign(camera, {
    identity: identity,
    lookAt: lookAt
  })
}