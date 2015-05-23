// pulled out from gl-shader
// should be cleaned up a bit and modularized
module.exports = makeReflectTypes

// Construct type info for reflection.
// This iterates over the flattened list of uniform type values and smashes them into a JSON object.
// The leaf nodes of the resulting object contain:
//    { index, type, name }
// Where index is the index into the flat array, and name is the qualified location name.
function makeReflectTypes (array) {
  var obj = {}
  for (var i = 0; i < array.length; ++i) {
    var n = array[i].name
    var parts = n.split('.')
    var o = obj
    // for each nested struct
    for (var j = 0; j < parts.length; ++j) {
      // see if we have an array
      var x = parts[j].split('[')
      if(x.length > 1) { // it's an array...
        if(!(x[0] in o)) {
          o[x[0]] = []
        }
        o = o[x[0]]
        for (var k = 1; k < x.length; ++k) {
          var y = parseInt(x[k])
          if(k < x.length - 1 || j < parts.length - 1) {
            if(!(y in o)) {
              if(k < x.length - 1) {
                o[y] = []
              } else {
                o[y] = {}
              }
            }
            o = o[y]
          } else {
            o[y] = {
              type: array[i].type,
              name: array[i].name,
              index: i
            }
          }
        }
      } else if(j < parts.length - 1) {
        if(!(x[0] in o)) {
          o[x[0]] = {}
        }
        o = o[x[0]]
      } else {
        o[x[0]] = {
          type: array[i].type,
          name: array[i].name,
          index: i
        }
      }
    }
  }
  return obj
}
