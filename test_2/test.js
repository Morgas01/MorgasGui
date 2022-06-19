(async function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		depRes:"DependencyResolver"
	});

	let [moduleDependencies,moduleRegister] = await Promise.all([
		fetch("../src/Morgas.gui.ModuleDependencies.json").then(r=>r.ok?r.json():{}),
		fetch("../src/Morgas.gui.ModuleRegister.json").then(r=>r.ok?r.json():{})
	]);

	let cleanedModuleDependencies={};
	let depFilter=d=>d in moduleRegister;
	for(let [module,{deps,uses}] of Object.entries(moduleDependencies))
	{
		cleanedModuleDependencies[module]={
			deps:deps.filter(depFilter),
			uses:uses.filter(depFilter)}
	}
	let depRes=new SC.depRes(cleanedModuleDependencies);
	let list = depRes.resolve(Object.keys(moduleDependencies));


	let testModules=new Map();

	window.module=function(name,tests)
	{
		testModules.set(name,tests);

		//TODO create menu
		let moduleElement=document.createElement("LI");
		let html=`<a href="#${name}">${name}</a>`;
		if(typeof tests ==="object")
		{
			let todo=Object.keys(tests);
			if(todo.length>1)
			{
				html+=`<div>${todo.map(t=>`<a href="#${name}#${t}">${t}</a>`).join("")}</div>`;
			}
		}
		moduleElement.innerHTML=html;
		document.getElementById("menu").appendChild(moduleElement);
	};

	let showTestFromHash=function()
	{
		let hash=location.hash.slice(1).split("#");
		if(hash.length[0]!=="")
		{
			let testModule=testModules.get(hash[0]);
			let test=µ.util.object.goPath(testModule,hash.slice(1));
			if(test&&typeof test === "function")
			{
				test(document.getElementById("fixture"));
			}
		}
	}
	window.addEventListener("hashchange",showTestFromHash);

	/*
	window.tests.checkGlobals=function()
	{
		//TODO execute all tests

		let addedGlobals=Object.keys(window).filter(e=>globals.indexOf(e)==-1&&e!="Morgas"&&e!="µ")
		if(addedGlobals.length>0) alert(`⚠ added globals: ${addedGlobals}`);
	};
	let globals=Object.keys(window);

	 */



	let scriptPromises=[];
	for(let moduleName of list)
	{
		let file=moduleRegister[moduleName];
		if(!file)
		{
			µ.logger.error(`module "${moduleName}" not in register!`);
			continue;
		}
		let script=document.createElement("script");
		script.src="../src/"+file;
		script.setAttribute("defer","");
		scriptPromises.push(new Promise(rs=>
		{
			script.addEventListener("load",rs);
			script.addEventListener("error",rs);
		}));
		document.head.appendChild(script);

		let testScript=document.createElement("script");
		testScript.src="tests/"+file;
		testScript.setAttribute("defer","");
		scriptPromises.push(new Promise(rs=>
		{
			testScript.addEventListener("load",rs);
			testScript.addEventListener("error",rs);
		}));
		document.head.appendChild(testScript);
	}

	Promise.all(scriptPromises).then(()=>
	{
		console.log("scripts loaded");
		showTestFromHash();
	});


})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);