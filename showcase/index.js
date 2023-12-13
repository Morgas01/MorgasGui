fetch("showcases.json").then(r=>r.ok?r.json():Promise.reject(r)).then(showcases=>
{
	document.getElementById("showcaseList").innerHTML=showcases.map(showcase=>`<a href="#${showcase}">${showcase}</a>`).join("\n");

	if(location.hash!==""&&location.hash!=="#")
	{
		document.querySelector("[href='${location.hash}']")?.scrollIntoView({behavior:"smooth"});
	}
},e=>{console.error(e);alert(e.message)});
let updateShowcase=function()
{
	if(location.hash!==""&&location.hash!=="#")
	{
		document.getElementById("showcase").src=`showcase.html?${location.hash.slice(1)}`;
	}
};
updateShowcase();
window.addEventListener("hashchange",updateShowcase);