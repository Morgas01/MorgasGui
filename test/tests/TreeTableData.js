(function(){
	var getData=()=>new µ.gui.TreeTableData([
		{
			string:"string 1",
			functionName:"function name 1",
			object:"object 1"
		},
		{
			string:"string 2",
			functionName:"function name 2",
			object:"object 2",
			children:[
				{
					string:"string 2-1",
					functionName:"function name 2-1",
					object:"object 2-1"
				},
				{
					string:"string 2-2",
					functionName:"function name 2-2",
					object:"object 2-2",
					children:[
						{
							string:"string 2-2-1",
							functionName:"function name 2-2-1",
							object:"object 2-2-1"
						},
						{
							string:"string 2-2-2",
							functionName:"function name 2-2-2",
							object:"object 2-2-2",
						},
						{
							string:"string 2-2-3",
							functionName:"function name 2-2-3",
							object:"object 2-2-3"
						}
					]
				},
				{
					string:"string 2-3",
					functionName:"function name 2-3",
					object:"object 2-3"
				}
			]
		},
		{
			string:"string 3",
			functionName:"function name 3",
			object:"object 3"
		}
	]);
	module("TreeTableData",[
		function header(container)
		{
			var data=getData();
			data.addColumn("string");
			data.addColumn(function functionName(cell){cell.textContent=this.functionName});
			data.addColumn({name:"object",fn:function(cell){cell.textContent=this.object}});
			
			container.appendChild(data.getTable());
		},
		function noHeader(container)
		{
			var data=getData();
			data.addColumn(function(cell){cell.textContent=this.functionName});
			data.addColumn({fn:function(cell){cell.textContent=this.object}});
			container.appendChild(data.getTable());
		}
	]);
})();