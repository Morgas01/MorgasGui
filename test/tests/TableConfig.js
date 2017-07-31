(function(){
	var data=[
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
	module("TableConfig",[
		function header(container)
		{
			var table=new µ.gui.TableConfig();
			table.addColumn("string");
			table.addColumn(function functionName(cell){cell.textContent=this.functionName});
			table.addColumn({name:"object",fn:function(cell){cell.textContent=this.object}});
			
			container.appendChild(table.getTable(data));
		},
		function noHeader(container)
		{
			var table=new µ.gui.TableConfig();
			table.addColumn(function(cell){cell.textContent=this.functionName});
			table.addColumn({fn:function(cell){cell.textContent=this.object}});
			container.appendChild(table.getTable(data));
		}
	]);
})();