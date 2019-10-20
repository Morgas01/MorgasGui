(function(µ,SMOD,GMOD,HMOD,SC){

	let queryParam=GMOD("queryParam");

	SC=SC({});

	let showcases=null;
	let header=document.getElementById("cases");
	let description=document.getElementById("description");
	let stage=document.getElementById("stage");

	let createHeader=function()
	{
		showcases.forEach(function(entry,index)
		{
			let element=document.createElement("SPAN");
			element.textContent=entry.name;
			element.dataset.index=index;
			header.appendChild(element);
		});
	};

	let activateShowcase=function(index=0)
	{
		stage.innerHTML="";
		description.innerHTML="";

		let entry=showcases[index];
		if(entry)
		{
			try
			{
				description.innerHTML=entry.description;
				entry.fn(stage);
			}
			catch(e)
			{
				console.error(e);
				showError();
			}
		}
		Array.from(header.querySelectorAll(".active")).forEach(a=>a.classList.remove("active"));
		header.querySelector('[data-index="'+index+'"]').classList.add("active");
	};

	let showError=function()
	{
		stage.innerHTML=`
			<h1>Oops, sorry!</h1>
			<div>an error occurred executing the showcase.</div>
			<div>please let me know about it -> <a href="https://github.com/Morgas01/MorgasGui/issues">github</a></div>
		`;
	}


	if(queryParam.showcase)
	{
		document.body.classList.add("blocked");
		let script = document.createElement("SCRIPT");
		script.addEventListener("load",function ()
		{
			if(window.showcases!=null)
			{
				showcases=window.showcases
				createHeader();
				activateShowcase(queryParam.index);
			}
			else
			{
				showError();
			}

			document.body.classList.remove("blocked");
		});
		script.addEventListener("error",function()
		{
			stage.innerHTML=`
				<h1>No Showcase</h1>
				<div>There are no showcases for this component jet</div>
			`;
			document.body.classList.remove("blocked");
		});
		script.src = `showcases/${queryParam.showcase}.js`;
		document.head.appendChild(script);
	}

	header.addEventListener("click",function(e)
	{
		if(e.target.dataset.index!=null) activateShowcase(e.target.dataset.index);
	})

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);