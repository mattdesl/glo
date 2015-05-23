var addLineNumbers = require('./add-line-numbers')

module.exports = compile
function compile (gl, type, source, quiet) {
  // use a trimmed source for better logging
  source = source.toString().trim()

  var shader = gl.createShader(type)
  if (!shader) {
    throw new Error('Could not create shader type: ' + type)
  }

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  // determine where error came from
  var typeStr = (type === gl.VERTEX_SHADER) ? 'vertex' : 'fragment'
  var shaderLog = gl.getShaderInfoLog(shader) || ''

  // try to print errors in a nice and readable fashion
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (!quiet) {
      showError(typeStr, shaderLog, source, quiet)
    }
    throw new Error('Could not compile ' + typeStr + ' shader')
  } else if (shaderLog && !quiet) {
    console.warn(typeStr + ' shader log:\n' + shaderLog)
  }

  return shader
}

function showError (type, log, source) {
  var lines = addLineNumbers(source)
  var full = lines.join('\n')
  console.warn('Error in ' + type + ' shader:\n' + full + '\n')
  console.warn('Shader Log:\n' + log)
}
