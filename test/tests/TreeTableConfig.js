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
	];
	module("TreeTableConfig",[
		function header(container)
		{
			var config=new µ.gui.TreeTableConfig([
				"string",
				function functionName(cell){cell.textContent=this.functionName},
				{name:"object",fn:function(cell){cell.textContent=this.object}}
			]);
			
			container.appendChild(config.getTable(data));
		},
		function noHeader(container)
		{
			var config=new µ.gui.TreeTableConfig([
				function(cell){cell.textContent=this.functionName},
				{fn:function(cell){cell.textContent=this.object}}
			]);
			container.appendChild(config.getTable(data));
		}
	]);
})();