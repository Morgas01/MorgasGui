(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		deps:require.bind(null,"../../lib/dependencies"),
		DependenciesRestApi:"DependenciesRestApi"
	});

	let deps=SC.deps;
	module.exports = SC.DependenciesRestApi(deps);

	module.exports.log=function()
	{
		console.log(deps);
		return deps;
	}

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut)
