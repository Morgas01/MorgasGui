

fetch(`cases/${location.search.slice(1)}.json`).then(r=>r.ok?r.json():Promise.reject(r)).then(cases=>
{
	let casesContainer=document.getElementById("cases");
	casesContainer.innerHTML=Object.keys(cases).map(c=>`<button data-case="${c}">${c}</button>`).join("");


	casesContainer.addEventListener("click",e=>
	{
		let caseName=e.target.dataset.case;
		if(caseName in cases)
		{
			let caseJson=cases[caseName];
			updateFixture(caseJson);
			updateParameters(caseJson);
		}
	});

},e=>{console.error(e);alert(e.message)});
fetch(`types.json`).then(r=>r.ok?r.json():Promise.reject(r)).then(types=>
{
	let type=types[location.search.slice(1)];
	if(!type)
	{
		console.error("no type for "+location.search.slice(1));
		return;
	}

	//TODO construct parameters
},e=>{console.error(e);alert(e.message)});

let updateFixture=function(caseJson)
{
	document.getElementById("fixture").src=`fixture.html?${encodeURIComponent(JSON.stringify(caseJson))}`;
};
let updateParameters=function(caseJson)
{
	//TODO
}