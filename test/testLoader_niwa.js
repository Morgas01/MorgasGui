(function(){

	window.tests={
		loadTest:function(name,noStyle)
		{
			noStyle||document.write(String.raw`<link rel="stylesheet" href="/morgas/gui/css/${name}.less"/>`);
			document.write(String.raw`<script type="application/javascript" charset="utf-8" src="../src/${name}.js" defer></script>`);
			document.write(String.raw`<script type="application/javascript" charset="utf-8" src="tests/${name}.js" defer></script>`);
		}
	};

})();