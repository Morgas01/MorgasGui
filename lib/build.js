//TODO use DependencyManager

require("morgas");
let guiApi=require("..");
let less=require("less");

let SC=µ.shortcut({
	File:"File",
	util:"File/util",
	DepRes:"DepRes",
	DependencyParser:"DependencyParser",
	moduleRegister:"Morgas.ModuleRegister"
});

let root				= new SC.File(__dirname).changePath("..");
let sourceDir			= root.clone().changePath("src");
let outputDir			= root.clone().changePath("dist");

let lessFolder			= sourceDir.clone().changePath("less");
let lessStructureFolder	= lessFolder.clone().changePath("structure");
let lessStyleFolder		= lessFolder.clone().changePath("style");
let lessThemeFolder		= lessFolder.clone().changePath("theme");
let defaultTheme		= lessThemeFolder.clone().changePath("default.less");

let cssFolder			= outputDir.clone().changePath("css");
let cssStructureFolder	= cssFolder.clone().changePath("structure");
let cssStyleFolder		= cssFolder.clone().changePath("style");

/*** dependencies ***/

new SC.DependencyParser()
.addSources([
	sourceDir,
	sourceDir.clone().changePath("Dialog"),
	sourceDir.clone().changePath("menu"),
	sourceDir.clone().changePath("Table"),
	sourceDir.clone().changePath("TableConfig"),
	sourceDir.clone().changePath("Tree"),
	sourceDir.clone().changePath("TreeTableConfig")
])
.addProvidedModules(Object.keys(SC.moduleRegister))
.parse(sourceDir)
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

	let resolver=new SC.DepRes(result.fileDependencies);
	let createBundle=function(outputFilename,modules)
	{
		let outputFile=outputDir.clone().changePath(outputFilename);
		let outputMap=outputDir.clone().changePath(outputFilename+".map");
		let outputStyle=outputDir.clone().changePath(outputFilename.slice(0,-3)+".css");

		let moduleFiles=modules.map(module=>
		{
			let file=result.moduleRegister[module];
			if(!file) throw `module "${module}" unknown`;
			return file;
		});
		let resolvedFiles=resolver.resolve(moduleFiles,false);

		return SC.util.enshureDir(outputDir)
		.then(()=>Promise.all(resolvedFiles
			.map(f=>
			{
				return Promise.all([
					sourceDir.clone().changePath(f).read(),
					lessStructureFolder.clone().changePath(f.slice(0,-3)+".less").exists().then(µ.constantFunctions.t,µ.constantFunctions.f),
				])
				.then(([data,styled])=>({name:f,data,styled}))
			})
		))
		.then(function(fileContents)
		{
			let Concat=require("concat-with-sourcemaps");
			let concat=new Concat(true,outputFilename,"\n/********************/\n");
			for (let {name,data} of fileContents)
			{
				concat.add(name,data);
			}

			let styledComponents=fileContents.filter(c=>c.styled).map(c=>c.name.slice(0,-3));

			return Promise.all([
				outputFile.write(concat.content+"\n//# sourceMappingURL="+outputMap.getName()),
				outputMap.write(Buffer.from(concat.sourceMap)),
				guiApi.getTheme(undefined,styledComponents).then(css=>outputStyle.write(css))
			]);
		});
	};
	let packageJson=require("../package");
	createBundle("MorgasGui-"+packageJson.version+".js",Object.keys(result.moduleRegister));

	if(process.argv.length>2)
	{
		let outputFilename=process.argv[2];
		let modules=process.argv.slice(3);

		createBundle(outputFilename,modules);
	}

})
.then(function()
{
	console.log("build finished!");
},
function(error)
{
	console.error("build failed!",error,error.stack);
});



/*** styles ***/
/* TODO ?
let loadFiles=function(folder)
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