(function(){

	window.module=function(name,testFns)
	{
		var container=getContainer(name);
		if(testFns) for(var t of testFns)test(t.name,t,container);
		document.body.appendChild(container);

		var moduleListEntry=document.createElement("li");
		moduleListEntry.innerHTML=String.raw`<a href="#${name}">${name}</a>`
		moduleList.appendChild(moduleListEntry);

	};

	window.tests.checkGlobals=function()
	{
		var addedGlobals=Object.keys(window).filter(e=>globals.indexOf(e)==-1&&e!="Morgas"&&e!="µ")
		if(addedGlobals.length>0) alert(`⚠ added globals: ${addedGlobals}`);
	};
	var globals=Object.keys(window);


	var moduleList=document.createElement("ul");
	window.addEventListener("load",()=>document.body.insertBefore(moduleList,document.body.firstElementChild));

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

	var test=function(name,testFn,moduleContainer)
	{
		var container=getContainer(name);
		testFn(container);
		moduleContainer.appendChild(container);
	};


	tests.loadMorgas("Morgas");

	tests.loadTest("blocked");
	tests.loadTest("loading");
	tests.loadTest("Dialog");
	tests.loadMorgas("Patch");
	tests.loadMorgas("util/function/proxy");
	tests.loadMorgas("NodePatch");
	tests.loadMorgas("util/object/adopt");
	tests.loadTest("Tree");
	tests.loadMorgas("util/function/rescope");
	tests.loadMorgas("util/array/remove");
	tests.loadTest("Tree/Select");
	tests.loadTest("TableConfig",true);
	tests.loadTest("TableConfig/Select");
	tests.loadMorgas("Event");
	tests.loadTest("Table",true);
	tests.loadMorgas("SortedArray");
	tests.loadMorgas("util/object/equals");
	tests.loadMorgas("util/object/goPath");
	tests.loadMorgas("Organizer");
	tests.loadTest("Table/OrganizedTable",true);
	tests.loadTest("TreeTableConfig");
	tests.loadTest("TreeTableConfig/Select",true); // TableConfig.Select.less
	tests.loadTest("menu");
	tests.loadMorgas("Config");
	tests.loadTest("form");
	tests.loadTest("tabs");
	tests.loadTest("actionize",true);
	tests.loadTest("dragBox");
	tests.loadTest("InputHistory",true);

	document.write(String.raw`<script type="application/javascript" charset="utf-8" src="tests/checkGlobals.js" defer></script>`);

})();