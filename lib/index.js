/////
// Dependencies
/////
const each = require('async').each,
    extend = require('extend'),
    handlebars = require('handlebars')

// expose plugin
module.exports = plugin

/////
// Helper
/////
let readPartials = require('./helpers/read-partials')

/**
 * Metalsmith plugin to replace handlebar partials in the files
 * @param {Object} options
 *   @property {String} extension (optional)
 *   @property {String} partials (optional)
 *   @property {String} partialExtension (optional)
 *   @property {Boolean} logging (optional)
 * @return {Function}
 */
function plugin(opts) {
    // default values
    opts = opts || {}

    let ext = opts.extension || 'html|php|md|hbs|htaccess',
        partialExtension = opts.partialExtension || '.hbs',
        partials = opts.partials,
        logging = opts.logging || false

    // plugin action
    return (files, metalsmith, done) => {
        if(logging) {
            console.log(' ')
            console.log('[Plugin] partial')
        }
        let metadata = metalsmith.metadata(),
            keys = Object.keys(files),
            params = {},
            partialsList = null

        // read the partials
        partialsList = readPartials(partials, partialExtension, metalsmith)

        if(logging) {
			console.log('following partials where found')
			//console.log(metadata)
            for (let partial in partialsList) {
                console.log('>', partial)
            }
		}
		// register them as handlebar partials
		handlebars.registerPartial(partialsList)

        //console.log(files)
        //console.log(metadata)

        // replace the partials in all files
        if(logging) {
            console.log(' ')
            console.log('replace in the following files')
        }
        // regex for the filematch
        let regex = `.*\.(${ext})`
        each(Object.keys(files), (file, next) => {
            // search for valid files
            if (file.match(new RegExp(regex, 'i')) !== null || file == '.htaccess') {
                if(logging) {
                    console.log('>', file)
                }
                replacePartialsInFile(file, next)
            } else {
                // jump to next file
                next()
            }
        }, done)


        function replacePartialsInFile(file, next) {
            // create data
            let data = extend({}, files[file], metadata)
            
            // convert the content from buffer to string
            let contents = data.contents.toString()

            // create function from the content with hndlebars
            let compiled = handlebars.compile(contents)

            // build template, with the variables of the meta data
            let content = compiled(data)
            /*
            console.log(file)
            console.log(data)
            console.log(content)
            */

            // set new content with replaced partials
            files[file].contents = new Buffer(content)

            // next
            next()
        }
    }
}