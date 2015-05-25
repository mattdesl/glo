module.exports.bind = bindAttribs
module.exports.unbind = unbindAttribs
module.exports.unbindAll = unbindAll

function bindAttribs (gl, attributes, elements, locations) {
  if (elements) {
    elements.bind()
  } else {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
  }

  // simple case for now, optimize redundant calls later
  for (var i = 0; i < attributes.length; i++) {
    var attrib = attributes[i]
    var buffer = attrib.buffer
    var loc = getLocation(locations, attrib)
    if (loc === null) continue

    var size = typeof attrib.size === 'number' ? attrib.size : 4
    var type = typeof attrib.type === 'number' ? attrib.type : gl.FLOAT
    var normalized = Boolean(attrib.normalized)
    var stride = attrib.stride || 0
    var offset = attrib.offset || 0

    buffer.bind()
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, size, type, normalized, stride, offset)
  }
}

function unbindAttribs (gl, attributes, elements, locations) {
  // TODO: optimize redundant calls with
  // WeakMap + state manager
  for (var i = 0; i < attributes.length; i++) {
    var attrib = attributes[i]
    var loc = getLocation(locations, attrib)
    if (loc === null) continue
    gl.disableVertexAttribArray(loc)
  }
}

function unbindAll (gl, count) {
  for (var i = 0; i < count; i++) {
    gl.disableVertexAttribArray(i)
  }
}

function getLocation (locations, attribute) {
  var name = attribute.name
  var shaderAttrib = locations[name]
  if (!shaderAttrib) {
    return null
  }
  return shaderAttrib.location
}
