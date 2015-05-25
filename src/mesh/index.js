var assign = require('object-assign')
var pack = require('array-pack-2d')
var dtype = require('dtype')
var fromGLType = require('gl-to-dtype')
var createBuffer = require('./buffer')
var createVBO = require('./vertex-buffer-object')
var createVAO = require('./vertex-array-object')

var indexOfName = require('indexof-property')('name')
var defined = require('defined')
var getter = require('dprop')

module.exports = function createMesh (gl, opt) {
  return new AttributeMesh(gl, opt)
}

function AttributeMesh (gl, opt) {
  this.gl = gl
  this.attributes = []
  this._elements = null
  this._elementsSize = null
  this._elementsType = null
  this.bindings = opt.vao ? createVAO(gl) : createVBO(gl)
}

Object.defineProperty(AttributeMesh.prototype, 'count', getter(function () {
  if (this._elements) {
    return this._elements.length
  } else {
    if (this.attributes.length === 0) return 0
    return this.attributes[0].buffer.length / this.attributes[0].size
  }
}))

assign(AttributeMesh.prototype, {
  bind: function bind (shader) {
    if (!shader) {
      throw new Error('must provide shader to mesh bind()')
    }

    if (this._dirty) {
      for (var i = 0; i < this.attributes.length; i++) {
        var name = this.attributes[i].name
        var attrib = shader.attributes[name]
        if (!attrib || typeof attrib.location !== 'number') {
          console.warn("Specified shader does not have an attribute '" + name + "'")
        }
      }

      this.bindings.update(this.attributes, this._elements, this._elementsType)
      this._dirty = false
    }

    this.bindings.bind(shader)
    return this
  },

  unbind: function unbind (shader) {
    if (!shader) {
      throw new Error('must provide shader to mesh unbind()')
    }

    this.bindings.unbind(shader)
    return this
  },

  draw: function draw (mode, count, offset) {
    count = defined(count, this.count)
    this.bindings.draw(mode, count, offset)
    return this
  },

  // replaces attribute
  attribute: function attribute (name, data, opt) {
    var attribIdx = indexOfName(this.attributes, name)
    var attrib = attribIdx === -1 ? null : this.attributes[attribIdx]
    if (typeof data === 'undefined') { // getter
      return attrib
    }

    var gl = this.gl
    opt = opt || {}

    var array = unroll(data, fromGLType(opt.type) || 'float32')
    var size = opt.size || guessSize(data, 3)
    var buffer
    if (!attrib) { // create new attribute
      buffer = createBuffer(gl, array, gl.ARRAY_BUFFER, opt.usage)
      attrib = assign({
        name: name,
        buffer: buffer,
        size: size
      }, opt)
      this.attributes.push(attrib)
    } else { // update existing
      // mutate existing attribute info like stride/etc
      assign(attrib, opt)
      buffer.usage = defined(opt.usage, buffer.usage)
      buffer.update(array)
    }

    this._dirty = true
    return this
  },

  elements: function elements (data, opt) {
    if (typeof data === 'undefined') { // getter
      return this._elements
    }

    opt = opt || {}
    var gl = this.gl
    var size = opt.size || guessSize(data, 3)
    var array = unroll(data, fromGLType(opt.type) || 'uint16')

    if (this._elements) { // update existing
      this._elementsType = opt.type
      this._elements.usage = defined(opt.usage, this._elements.usage)
      this._elementsSize = size
      this._elements.update()
    } else { // create new element buffer
      this._elementsSize = defined(opt.size, this._elementsSize)
      this._elements = createBuffer(gl, array, gl.ELEMENT_ARRAY_BUFFER, opt.usage)
    }

    this._dirty = true
    return this
  }
})

function guessSize (data, defaultSize) {
  if (data.length && data[0].length) {
    return data[0].length
  }
  return defaultSize
}

function unroll (data, type) {
  if (Array.isArray(data)) { // plain array
    if (Array.isArray(data[0])) { // nested array
      return pack(data, type)
    } else { // flat array
      return new (dtype(type))(data)
    }
  } else { // assume typed array already
    return data
  }
}
