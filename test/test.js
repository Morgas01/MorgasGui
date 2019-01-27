(function(){

	let filterModule=µ.util.queryParam.module;
	window.module=function(name,testFns)
	{
		if(filterModule&&filterModule!=name) return;

		let moduleListEntry=document.createElement("li");
		moduleListEntry.innerHTML=String.raw`<a href="#${name}">${name}</a>`
		moduleList.appendChild(moduleListEntry);

		let container=getContainer(name,"?module="+name);
		if(testFns) for(let t of testFns)test(name,t.name,t,container);
		document.body.appendChild(container);

	};

	window.tests.checkGlobals=function()
	{
		let addedGlobals=Object.keys(window).filter(e=>globals.indexOf(e)==-1&&e!="Morgas"&&e!="µ")
		if(addedGlobals.length>0) alert(`⚠ added globals: ${addedGlobals}`);
	};
	let globals=Object.keys(window);


	let moduleList=document.createElement("ul");

	if(filterModule)
	{
		let moduleListBackEntry=document.createElement("li");
		moduleListBackEntry.innerHTML=String.raw`<a href="?">back</a>`
		moduleList.appendChild(moduleListBackEntry);
	}

	window.addEventListener("load",()=>document.body.insertBefore(moduleList,document.body.firstElementChild));

	let getContainer=function(name,anchor)
	{
		if(name)
		{
			let rtn=document.createElement("fieldset");
			rtn.innerHTML=String.raw`<legend><a name="${name}" ${anchor?`href="${anchor}"`:''}>${name}</a></legend>`;
			return rtn;
		}
		return document.createElement("div");
	}

	let test=function(module,name,testFn,moduleContainer)
	{
		let container=getContainer(name);
		testFn(container);
		moduleContainer.appendChild(container);
	};

	tests.loadTest("blocked");
	tests.loadTest("loading");
	tests.loadTest("Dialog");
	tests.loadTest("Tree");
	tests.loadTest("Tree/Select");
	tests.loadTest("TableConfig",true);
	tests.loadTest("TableConfig/Select");
	tests.loadTest("Table",true);
	tests.loadTest("Table/OrganizedTable",true);
	tests.loadTest("TreeTableConfig");
	tests.loadTest("TreeTableConfig/Select",true); // TableConfig.Select.less
	tests.loadTest("menu");
	tests.loadTest("form");
	tests.loadTest("tabs");
	tests.loadTest("actionize",true);
	tests.loadTest("dragBox");
	tests.loadTest("InputHistory",true);

	document.write(String.raw`<script type="application/javascript" charset="utf-8" src="tests/checkGlobals.js" defer></script>`);

})();