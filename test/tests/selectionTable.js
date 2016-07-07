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
	
	module("selectionTable",[
		function simple(container)
		{
			container.appendChild(µ.gui.selectionTable(data));
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
		}
	]);
})();