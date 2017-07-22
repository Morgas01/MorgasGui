(function(){

	var getContainer=function(name)
	{
		if(name)
		{
			var rtn=document.createElement("fieldset");
			rtn.innerHTML=String.raw`<legend><a name="${name}">${name}</a></legend>`;
			return rtn;
		}
		return document.createElement("div");
	}
	var moduleList=document.createElement("ul");
	window.addEventListener("load",()=>document.body.insertBefore(moduleList,document.body.firstElementChild));

	window.module=function(name,testFns)
	{
		var container=getContainer(name);
		if(testFns) for(t of testFns)test(t.name,t,container);
		document.body.appendChild(container);

		var moduleListEntry=document.createElement("li");
		moduleListEntry.innerHTML=String.raw`<a href="#${name}">${name}</a>`
		moduleList.appendChild(moduleListEntry);

	};
	var test=function(name,testFn,moduleContainer)
	{
		var container=getContainer(name);
		testFn(container);
		moduleContainer.appendChild(container);
	};
	var loadMorgas=function(name)
	{
		document.write(String.raw`<script type="application/javascript" charset="utf-8" src="/Morgas.js/src/${name}.js" defer></script>`);
	}
	var load=function(name,noStyle){
		noStyle||document.write(String.raw`<link rel="stylesheet" href="/morgas/gui/css/${name}.less"/>`);
		document.write(String.raw`<script type="application/javascript" charset="utf-8" src="../src/${name}.js" defer></script>`);
		document.write(String.raw`<script type="application/javascript" charset="utf-8" src="tests/${name}.js" defer></script>`);
	};
	//*

	loadMorgas("Morgas");

	load("blocked");
	load("loading");
	load("dialog");
	loadMorgas("Morgas.Patch");
	loadMorgas("Morgas.util.object.iterate");
	loadMorgas("Morgas.util.function.proxy");
	loadMorgas("Morgas.nodePatch");
	loadMorgas("Morgas.util.object.adopt");
	load("tree");
	load("selectionTree");
	load("TableData",true);
	load("TreeTableData");
	load("selectionTable");
	load("menu");
	loadMorgas("Morgas.Config");
	load("form");
	load("tabs");
	load("actionize",true);
	load("dragBox");
	load("inputHistory");


})();
