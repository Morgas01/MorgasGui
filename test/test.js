(function(){

	var getContainer=function(name)
	{
		if(name)
		{
			var rtn=document.createElement("fieldset");
			rtn.innerHTML=String.raw`<legend>${name}</legend>`;
			return rtn;
		}
		return document.createElement("div");
	}
	var activeModule=document.body;
	
	window.module=function(name,testFns)
	{
		activeModule=getContainer(name);
		if(testFns) for(t of testFns)test(t.name,t);
		document.body.appendChild(activeModule);
	};
	window.test=function(name,testFn)
	{
		var container=getContainer(name);
		testFn(container);
		activeModule.appendChild(container);
	};
	/*
	var load=function(name){
		document.write(String.raw`<link rel="stylesheet" href="../src/css/${name}.css"></script>`);
		document.write(String.raw`<script type="application/javascript" charset="utf-8" src="../src/${name}.js" defer></script>`);
		document.write(String.raw`<script type="application/javascript" charset="utf-8" src="tests/${name}.js" defer></script>`);
	};
	/*/
	var load=function(name){
		document.write(String.raw`<link rel="stylesheet" href="../build/css/structure/${name}.css"></script>`);
		document.write(String.raw`<link rel="stylesheet" href="../build/css/style/${name}.css"></script>`);
		document.write(String.raw`<script type="application/javascript" charset="utf-8" src="../src/${name}.js" defer></script>`);
		document.write(String.raw`<script type="application/javascript" charset="utf-8" src="tests/${name}.js" defer></script>`);
	};
	//*
	
	
	load("blocked");
	load("loading");
	load("menu");
	
	
})();