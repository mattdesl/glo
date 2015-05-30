module.exports = isDOMImage
function isDOMImage (data) {
  /*global HTMLCanvasElement, ImageData, HTMLImageElement, HTMLVideoElement */
  return (typeof HTMLCanvasElement !== 'undefined' && data instanceof HTMLCanvasElement)
    || (typeof ImageData !== 'undefined' && data instanceof ImageData)
    || (typeof HTMLImageElement !== 'undefined' && data instanceof HTMLImageElement)
    || (typeof HTMLVideoElement !== 'undefined' && data instanceof HTMLVideoElement)
}