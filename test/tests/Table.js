(function(){
	let data=[
		{
			string:"string 1",
			functionName:"function name 1",
			object:"object 1"
		},
		{
			string:"string 2",
			functionName:"function name 2",
			object:"object 2"
		},
		{
			string:"string 3",
			functionName:"function name 3",
			object:"object 3"
		}
	];
	module("Table",[
		function header(container)
		{
			let tableConf=new µ.gui.TableConfig([
				"string",
				function functionName(cell){cell.textContent=this.functionName},
				{
					name:"object",
					fn:function(cell)
					{
						cell.textContent=this.object
					}
				}
			]);
			let table=new µ.gui.Table(tableConf);
			table.add(data);
			container.appendChild(table.getTable());
		},
		function noHeaderSelect(container)
		{
			let tableConf=new µ.gui.TableConfig.Select([
				{getter:d=>d.string},
				function(cell){cell.textContent=this.functionName},
				{fn:function(cell){cell.textContent=this.object}}
			],
			{noInput:true});
			let table=new µ.gui.Table(tableConf);
			table.add(data);
			container.appendChild(table.getTable());
		}
	]);
})();