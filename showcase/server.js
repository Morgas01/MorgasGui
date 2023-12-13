let fs=require("node:fs/promises");
let path=require("node:path");

(async ()=>
{
	await fs.readdir(path.resolve(__dirname,"cases")).then(list=>
	{
		let names=list.map(entry=>entry.replace(/\.json$/, ""));
		return fs.writeFile(path.resolve(__dirname,"showcases.json"), JSON.stringify(names));
	}).then(()=>console.log("updated showcases.json"), e=>console.error("failed to update showcases.json",e));


	let NIWA=require("niwa");

	new NIWA({
		yard: __dirname,
		door: 9876,
		welcomeSign: "showcase",
		logLevel: "TRACE"
	}).open().catch(e=>console.log("FATAL:", e));
})();