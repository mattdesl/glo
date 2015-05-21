module.exports.unproject = unproject
module.exports.project = project

/**
 * Unproject a point from screen space to 3D space.
 * The point should have its x and y properties set to
 * 2D screen space, and the z either at 0 (near plane)
 * or 1 (far plane). The provided matrix is assumed to already
 * be combined, i.e. projection * view * model.
 *
 * After this operation, the out vector's (x, y, z) components will
 * represent the unprojected 3D coordinate.
 *
 * @param  {vec3} out               the output vector
 * @param  {vec3} vec               the vector to unproject
 * @param  {vec4} viewport          screen x, y, width and height in pixels
 * @param  {mat4} invProjectionView combined projection and view matrix
 * @return {vec3}                   the output vector
 */
function unproject (out, vec, viewport, invProjectionView) {
  var viewX = viewport[0],
    viewY = viewport[1],
    viewWidth = viewport[2],
    viewHeight = viewport[3]

  var x = vec[0],
    y = vec[1],
    z = vec[2]

  x = x - viewX
  y = viewHeight - y - 1
  y = y - viewY

  out[0] = (2 * x) / viewWidth - 1
  out[1] = (2 * y) / viewHeight - 1
  out[2] = 2 * z - 1

  return project(out, out, invProjectionView)
}

/**
 * Multiplies the input vec by the specified matrix, 
 * applying a W divide, and stores the result in out 
 * vector. This is useful for projection,
 * e.g. unprojecting a 2D point into 3D space.
 *
 * @method  prj
 * @param {vec3} out the output vector
 * @param {vec3} vec the input vector to project
 * @param {mat4} m the 4x4 matrix to multiply with 
 * @return {vec3} the out vector
 */
function project (out, vec, m) {
  var x = vec[0],
    y = vec[1],
    z = vec[2],
    a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3],
    a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7],
    a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11],
    a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15]

  var lw = 1 / (x * a03 + y * a13 + z * a23 + a33)

  out[0] = (x * a00 + y * a10 + z * a20 + a30) * lw
  out[1] = (x * a01 + y * a11 + z * a21 + a31) * lw
  out[2] = (x * a02 + y * a12 + z * a22 + a32) * lw
  return out
}
