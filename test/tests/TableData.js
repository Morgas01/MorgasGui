(function(){
	var getData=()=>new µ.gui.TableData([
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
	]);
	module("TableData",[
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