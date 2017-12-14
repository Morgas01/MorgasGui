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
	tests.loadMorgas("Morgas.Patch");
	tests.loadMorgas("Morgas.util.function.proxy");
	tests.loadMorgas("Morgas.NodePatch");
	tests.loadMorgas("Morgas.util.object.adopt");
	tests.loadTest("Tree");
	tests.loadTest("TableConfig",true);
	tests.loadTest("TableConfig.Select");
	tests.loadTest("TreeTableConfig");
	tests.loadTest("TreeTableConfig.Select",true); // TableConfig.Select.less
	tests.loadTest("menu");
	tests.loadMorgas("Morgas.Config");
	tests.loadTest("form");
	tests.loadTest("tabs");
	tests.loadTest("actionize",true);
	tests.loadTest("dragBox");
	tests.loadMorgas("Morgas.util.function.rescope");
	tests.loadMorgas("Morgas.util.array.remove");
	tests.loadTest("InputHistory",true);

	document.write(String.raw`<script type="application/javascript" charset="utf-8" src="tests/checkGlobals.js" defer></script>`);

})();
