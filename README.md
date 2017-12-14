MorgasGui
=========
Gui Elements for Morgas.js

[tests](https://morgas01.github.io/MorgasGui/test/test_pages.html)

###Generating styles
load gui
```js
require("morgas");		// creates global µ
require("morgas.gui");	// integrates into µ.gui
```
use less folder for lookup
```js
let less=require("less");
 
less.render(lessInput,{
	paths:[µ.gui.lessFolder]
})
.then(output=> ...
```
or use getters
```js
µ.gui.getComponentStyle(component,theme="default").then(css=> ...
µ.gui.getTheme(theme="default",components=[]).then(css=> ...
```

##Less Structure
```
./src/less
├─structure
├─style
├─theme
├─mixins.less
└─variables.less
```
Every styled Gui Element has 2 less files in `structure` and `style` with the same name as the .js and Morgas module.
The structure file is to enshure the intended function of the Gui Element, and the style file is to enhance its appearance.

In every "root" selector there is a scope with `.name-scope();` to enable overwriting variables for single modules.
All available variables are defined in `variables.less`.
 
Themes should overwrite styles as few as possible and use variables instead.