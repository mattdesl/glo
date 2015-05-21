var fromQuat = require('gl-mat4/fromQuat')
var identity4x4 = require('gl-mat4/identity')
var setAxisAngle = require('gl-quat/setAxisAngle')
var transformMat4 = require('gl-vec3/transformMat4')
var setVec4 = require('gl-vec4/set')

var tmpMat4 = identity4x4([])
var tmpQuat = [0, 0, 0, 1]
var tmpVec4 = [0, 0, 0, 0]

module.exports = rotate

function rotate (out, vec, axis, radians) {
	setAxisAngle(tmpQuat, axis, radians)
	fromQuat(tmpMat4, tmpQuat)
	return transformMat4(out, vec, tmpMat4)
}