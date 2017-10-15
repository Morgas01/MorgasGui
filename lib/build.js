require("Morgas");
require("..");
var less=require("less");

var SC=µ.shortcut({
	File:"File",
	util:"File.util",
	Promise:"Promise",
	itAs:"iterateAsync"
});

var root				= new SC.File(__dirname).changePath("..");
var src					= root.clone().changePath("src");
var build				= root.clone().changePath("build");

var lessFolder			= src.clone().changePath("less");
var lessStructureFolder	= lessFolder.clone().changePath("structure");
var lessStyleFolder		= lessFolder.clone().changePath("style");
var lessThemeFolder		= lessFolder.clone().changePath("theme");
var defaultTheme		= lessThemeFolder.clone().changePath("default.less");

var cssFolder			= build.clone().changePath("css");
var cssStructureFolder	= cssFolder.clone().changePath("structure");
var cssStyleFolder		= cssFolder.clone().changePath("style");

/*** dependencies ***/

(new (require("Morgas/lib/dependencyParser"))).addSource("src").parse("src")
.then(function(result)
{
	root.clone().changePath("src/Morgas.gui.ModuleRegister.json").write(JSON.stringify(result.moduleRegister,null,"\t")).then(null,function(err)
	{
		µ.logger.error("could not save ModuleRegister",err);
	});
	root.clone().changePath("src/Morgas.gui.ModuleDependencies.json").write(JSON.stringify(result.moduleDependencies,null,"\t")).then(null,function(err)
	{
		µ.logger.error("could not save ModuleDependencies",err);
	});
})
.catch(µ.logger.error);



/*** styles ***/
/* TODO ?
var loadFiles=function(folder)
{
	return folder.listFiles().then(files=>
		SC.itAs(files,(i,f)=>
			folder.clone().changePath(f).read({encoding:"utf8"}).then(data=>({filename:f,data:data}))
		)
	);
}

SC.util.enshureDir(cssStructureFolder)
.then(()=>SC.util.enshureDir(cssStyleFolder))
.then(function()
{
	return new SC.Promise([defaultTheme.read({encoding:"utf8"}),loadFiles(lessStructureFolder),loadFiles(lessStyleFolder)])
	.then(function(defaultTheme,structureFiles,styleFiles)
	{
		return {
			defaultTheme:defaultTheme,
			structureFiles:structureFiles,
			styleFiles:styleFiles
		};
	});
})
.then(function(readData)
{
	return Promise.all(readData.structureFiles.map(s=>
		less.render(s.data+"\n"+readData.defaultTheme)
		.then(parsed=>
			cssStructureFolder.clone().changePath(s.filename.slice(0,-4)+"css").write(parsed.css).then(()=>null),
			error=>({filename:s.filename,error:error})
		)
	).concat(readData.styleFiles.map(s=>
		less.render(s.data+"\n"+readData.defaultTheme)
		.then(parsed=>
			cssStyleFolder.clone().changePath(s.filename.slice(0,-4)+"css").write(parsed.css).then(()=>null),
			error=>({filename:s.filename,error:error})
		)
	)));
})
.then(function(result)
{
	result=result.filter(a=>a!=null);
	if(result.length>0) return Promise.reject(result);
	return "ok";
})
.then(µ.logger.info,
function(e)
{
	µ.logger.error(e,e.stack);
});
*/