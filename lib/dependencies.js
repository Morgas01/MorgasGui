(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		DependencyManager:"DependencyManager",
	});

	let path=require("node:path")

	let manager=new SC.DependencyManager({basePath:path.resolve(__dirname,"../src")});
	manager.addSources(["."]);


	module.exports = manager;

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut)
