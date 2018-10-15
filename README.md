# gobha-partials

A [Metalsmith](www.metalsmith.io) plugin to use complex partials inside metalsmith

## Installation

	$ npm install gobha-partials

## Javascript Usage

```js
let partials = require('gobha-partials')

metalsmith.use(partials())
```

## Options

```js
{
	extension: "html|php|md|hbs",
	partialExtension: ".hbs",
	partials: "partials"
}
```
#### extension

The plugin checks every file extension and when the extension matches the regex it will process the file and replace the partials in this file

#### partialExtension

Defines which extension the partials have, othewise they will be ignored

#### partials

Defines the root folder of the partials, based on the directory where metalsmith is executed.  
It will search in all files and folder in the partials folder

## Create partial

create a new file in the partials folder with the extension hbs

``` hbs
{{!-- button.hbs --}}
<a href="{{link}}">{{text}}</a>
```

Now you can place the partial in your files

``` hbs
{{> button link="http://metalsmith.io" text="Metalsmith" }}
```
### Structure your partials

To structure your partials you can put them in subfolders in the partials folder

**Example:** If you have a file `/partials/layout/fancy_button.hbs` you can add them by putting the subfolder infront of the partialname

``` hbs
{{> layout/fancy_button param="" }}
```

## License
MIT