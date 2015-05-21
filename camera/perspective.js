var create = require('./simple-camera')
var assign = require('object-assign')
var defined = require('defined')

var perspective = require('gl-mat4/perspective')
var lookAtMat = require('gl-mat4/lookAt')
var add = require('gl-vec3/add')

module.exports = function cameraPerspective(opt) {
  opt = opt || {}

  var camera = create(opt)
  camera.fov = defined(opt.fov, Math.PI / 4)
  camera.near = defined(opt.near, 0)
  camera.far = defined(opt.far, 100)
  camera.aspect = defined(opt.aspect, 1)
  
  var center = [0, 0, 0]
  var tmpVec3 = [0, 0, 0]
    
  function update() {
    //build projection matrix
    perspective(camera.projection, camera.fov, camera.aspect, camera.near, camera.far)
    
    //build view matrix
    add(center, camera.position, camera.direction)
    lookAtMat(camera.view, camera.position, center, camera.up)
  }

  update()
  return assign(camera, { 
    update: update
  })
}