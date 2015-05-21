module.exports = link
function link (gl, program, shaders, attributes, quiet) {
  // attach new shaders
  shaders.forEach(function (shader) {
    gl.attachShader(program, shader)
  })

  // bind attributes
  if (attributes) {
    attributes.forEach(function (attrib) {
      if (typeof attrib.location === 'number') {
        gl.bindAttribLocation(program, attrib.location, attrib.name)
      }
    })
  }

  // link the attached shaders
  gl.linkProgram(program)

  // check for log / errors
  var log = gl.getProgramInfoLog(program) || ''
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    // dispose shaders before throwing error
    shaders.forEach(function (shader) {
      gl.detachShader(program, shader)
      gl.deleteShader(shader)
    })

    if (!quiet) {
      console.warn(log)
    }
    throw new Error('Could not link shader program')
  } else if (log && !quiet) {
    console.warn('Shader program log:\n' + log)
  }
}
