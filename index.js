var path=require("path");
var less=require("less");
exports.dirname=path.resolve(__dirname,"src");
exports.lessFolder=path.resolve(exports.dirname,"less");
exports.getComponentStyle=function(component,theme)
{
	theme=theme||"default"
	return less.render(
		'\n@import "'+path.resolve(exports.dirname,"less","style",component)+'";'+
		'\n@import "'+path.resolve(exports.dirname,"less","structure",component)+'";'+
		'\n@import (reference)"'+path.resolve(exports.dirname,"less","theme",theme)+'";'
	).then(
		data=>data.css,
		error=>Promise.reject(JSON.stringify(error))
	);
};
exports.getTheme=function(theme,components)
{
	theme=theme||"default";
	components=components||[];
	return less.render(
		components.map(c=>
			'\n@import "'+path.resolve(exports.dirname,"less","style",c)+'";'+
			'\n@import "'+path.resolve(exports.dirname,"less","structure",component)+'";'
		).join("")+
		'\n@import "'+path.resolve(exports.dirname,"less","theme",theme)+'";'
	).then(
		data=>data.css,
		error=>Promise.reject(JSON.stringify(error))
	);
};
if(Morgas)
{// Morgas.js is loaded
	Morgas.addResourceFolder(exports.dirname);
}
