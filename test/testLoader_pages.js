(function(){

	window.tests={
		loadMorgas:function(name)
		{
			document.write(String.raw`<script type="application/javascript" charset="utf-8" src="https://morgas01.github.io/Morgas.js/src/${name}.js" defer></script>`);
		},
		loadTest:function(name,noStyle)
		{
			if(!noStyle)
			{
				document.write(String.raw`
					<style rel="stylesheet/less" type="text/x-less">
						@import "../src/less/mixins";
						@import "../src/less/structure/${name}";
						@import "../src/less/style/${name}";
					</style>
				`);
			}
			document.write(String.raw`<script type="application/javascript" charset="utf-8" src="../src/${name}.js" defer></script>`);
			document.write(String.raw`<script type="application/javascript" charset="utf-8" src="tests/${name}.js" defer></script>`);
		}
	};

	window.less={
		env: "development",
		async: true,
		fileAsync: true,
	};

})();