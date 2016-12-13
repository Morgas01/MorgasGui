(function(){
	var data=new µ.gui.TableData([
		{
			a:1,
			b:2,
			c:3
		},
		{
			a:4,
			b:5,
			c:6
		},
		{
			a:7,
			b:8,
			c:9
		},
		{
			a:10,
			b:11,
			c:12
		}
	],
	["a","b","c"]);
	var toJSON=function(){return this.string};
	var treeData=new µ.gui.TreeTableData([
		{
			string:"string 1",
			functionName:"function name 1",
			object:"object 1",
			toJSON:toJSON
		},
		{
			string:"string 2",
			functionName:"function name 2",
			object:"object 2",
			toJSON:toJSON,
			children:[
				{
					string:"string 2-1",
					functionName:"function name 2-1",
					object:"object 2-1",
					toJSON:toJSON
				},
				{
					string:"string 2-2",
					functionName:"function name 2-2",
					object:"object 2-2",
					toJSON:toJSON,
					children:[
						{
							string:"string 2-2-1",
							functionName:"function name 2-2-1",
							object:"object 2-2-1",
						 	toJSON:toJSON
						},
						{
							string:"string 2-2-2",
							functionName:"function name 2-2-2",
							object:"object 2-2-2",
							toJSON:toJSON
						},
						{
							string:"string 2-2-3",
							functionName:"function name 2-2-3",
							object:"object 2-2-3",
							toJSON:toJSON
						}
					]
				},
				{
					string:"string 2-3",
					functionName:"function name 2-3",
					object:"object 2-3",
					toJSON:toJSON
				}
			]
		},
		{
			string:"string 3",
			functionName:"function name 3",
			object:"object 3",
			toJSON:toJSON
		}
	],["string",function functionName(cell){cell.textContent=this.functionName},{name:"object",fn:function(cell){cell.textContent=this.object}}]);
	
	module("selectionTable",[
		function simple(container)
		{
			var table=µ.gui.selectionTable(data);
			container.appendChild(table);
			var button=document.createElement("button");
			button.textContent="selected";
			button.addEventListener("click",function(){alert(JSON.stringify(table.getSelected()))});
			container.appendChild(button);
		},
		function radio(container)
		{
			container.appendChild(µ.gui.selectionTable(data,"testRadio"));
		},
		function noInput(container)
		{
			var table=µ.gui.selectionTable(data);
			table.noInput=true;
			container.appendChild(table);
		},
		function selectionControl(container)
		{
			var table=µ.gui.selectionTable(data);
			µ.gui.selectionTable.selectionControl(table);
			container.appendChild(table);
		},
		function simpleTree(container)
		{
			var table=µ.gui.selectionTable(treeData);
			container.appendChild(table);
			var button=document.createElement("button");
			button.textContent="selected";
			button.addEventListener("click",function(){alert(JSON.stringify(table.getSelected()))});
			container.appendChild(button);
		},
		function radioTree(container)
		{
			container.appendChild(µ.gui.selectionTable(treeData,"testRadioTree"));
		},
		function noInputTree(container)
		{
			var table=µ.gui.selectionTable(treeData);
			table.noInput=true;
			container.appendChild(table);
		},
		function selectionControlTree(container)
		{
			var table=µ.gui.selectionTable(treeData);
			µ.gui.selectionTable.selectionControl(table);
			container.appendChild(table);
		}
	]);
})();