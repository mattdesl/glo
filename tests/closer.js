var console  = require('global/console')
var window   = require('global/window')
var finished = require('tap-finished')
var stream   = finished(onFinished)

var _log = console.log
console.log = function tapCloserLog(data) {
  stream.write(data)
  stream.write('\n')
  return _log.apply(console, arguments)
}

function onFinished() {
  if (!(window && window.close)) {
    return typeof process !== 'undefined'
        && process.exit
        && process.exit()
  }

  setTimeout(function() {
    window.close()
  }, 125)
}