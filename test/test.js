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
	var loadMorgas=function(name)
	{
		document.write(String.raw`<script type="application/javascript" charset="utf-8" src="/Morgas.js/src/${name}.js" defer></script>`);
	}
	var load=function(name){
		document.write(String.raw`<link rel="stylesheet" href="/morgas/gui/css/${name}.less"/>`);
		document.write(String.raw`<script type="application/javascript" charset="utf-8" src="../src/${name}.js" defer></script>`);
		document.write(String.raw`<script type="application/javascript" charset="utf-8" src="tests/${name}.js" defer></script>`);
	};
	//*

	loadMorgas("Morgas");

	load("blocked");
	load("loading");
	load("menu");
	load("TableData");
	load("selectionTable");
	load("dialog");
	loadMorgas("Morgas.Patch");
	loadMorgas("Morgas.util.object.iterate");
	loadMorgas("Morgas.util.function.proxy");
	loadMorgas("Morgas.nodePatch");
	loadMorgas("Morgas.util.object.adopt");
	load("tree");
	load("selectionTree");
	loadMorgas("Morgas.Config");
	load("form");


})();
