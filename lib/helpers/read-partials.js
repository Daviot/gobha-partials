/**
 * Dependencies
 */
var path = require('path')
var read = require('fs-readdir-recursive')
var jetpack = require('fs-jetpack')

/**
 * Expose `readPartials`
 */
module.exports = readPartials

/**
 * Helper for reading a folder with partials, returns a `partials` object that
 * can be consumed by consolidate.
 *
 * @param {String} partialsPath
 * @param {Object} metalsmith
 * @return {Object}
 */
function readPartials(partialsPath, partialExtension, metalsmith) {
  var partialsAbs = path.isAbsolute(partialsPath) ? partialsPath : path.join(metalsmith.path(), partialsPath)
  var files = read(partialsAbs)
  var partials = {}

  // Return early if there are no partials
  if (files.length === 0) {
    return partials
  }

  // Read and process all partials
  for (var i = 0; i < files.length; i++) {
    var fileInfo = path.parse(files[i])
    var name = path.join(fileInfo.dir, fileInfo.name)
    var partialAbs = path.join(partialsAbs, name)
    var partialPath = jetpack.path(__dirname, partialAbs)
	
	// add extension otherwise fs-jetpack can't find the file
	if(jetpack.exists(partialPath + '.html')) {
		// console.log(partialPath, 'uses HTML')
    	partialPath += '.html'
	}
	if(jetpack.exists(partialPath + '.hbs')) {
		// console.log(partialPath, 'uses HBS')
    	partialPath += '.hbs'
	}
      //console.log(name, partialPath)


    if (!partialExtension || fileInfo.ext == partialExtension) {
      partials[name.replace(/\\/g, '/')] = jetpack.read(partialPath)
    }
  }

  return partials
}