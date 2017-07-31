(function(){
	/* TODO
	var toJSON=function(){return this.string};
	var treeData=new µ.gui.TableConfig.TreeSelection([
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
	*/
})();