(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		deps:require.bind(null,"../../lib/dependencies"),
		DependenciesRestApi:"DependenciesRestApi"
	});

	module.exports = SC.DependenciesRestApi(SC.deps);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut)
