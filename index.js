var path=require("path");
var less=require("less");
exports.dirname=path.resolve(__dirname,"src");
exports.getStyle=function(component,theme)
{
	return less.render(
		'@import "'+path.resolve(exports.dirname,"less","theme","default.less")+'";'+
		'\n@import "'+path.resolve(exports.dirname,"less","style",component)+'";'+
		'\n@import "'+path.resolve(exports.dirname,"less","structure",component)+'";'+
		(theme? '\nimport "'+path.resolve(exports.dirname,"less","theme",theme+".less")+'";':"")
	).then(
		data=>data.css,
		error=>Promise.reject(JSON.stringify(error))
	);
};
if(Morgas)
{// Morgas.js is loaded
	Morgas.addResourceFolder(exports.dirname);
}
