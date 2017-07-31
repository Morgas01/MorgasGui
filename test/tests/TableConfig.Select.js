(function(){
	var data=[
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
	];
	
	module("TableConfig.Select",[
		function simple(container)
		{
			var tableConfig=new µ.gui.TableConfig.Select(["a","b","c"]);
			var table=tableConfig.getTable(data);
			container.appendChild(table);
		},
		function radio(container)
		{
			var tableConfig=new µ.gui.TableConfig.Select(["a","b","c"],{radioName:"testRadio"});
			var table=tableConfig.getTable(data);
			container.appendChild(table);
		},
		function noInput(container)
		{
			var tableConfig=new µ.gui.TableConfig.Select(["a","b","c"]);
			var table=tableConfig.getTable(data);
			table.noInput=true;
			container.appendChild(table);
		},
		function selectionControl(container)
		{
			var tableConfig=new µ.gui.TableConfig.Select(["a","b","c"],{noInput:true,control:true});
			var table=tableConfig.getTable(data);
			container.appendChild(table);
		}
	]);
})();