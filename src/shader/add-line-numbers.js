var padLeft = require('pad-left')

module.exports = addLineNumbers
function addLineNumbers (string) {
  var lines = string.split('\n')
  var totalDigits = String(lines.length).length
  return lines.map(function (line, i) {
    var c = i + 1
    var digits = String(c).length
    var prefix = padLeft(c, totalDigits - digits)
    return prefix + ': ' + line
  })
}
