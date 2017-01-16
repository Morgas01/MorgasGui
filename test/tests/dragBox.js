module("dragBox",[
	function simple(container)
	{
		container.innerHTML+=String.raw
`
<div style="width:10em;height:10em;border:1px solid">
`;
		var dragArea=container.children[1];
		µ.gui.dragBox(dragArea,{
			start:function(){µ.logger.info("start")},
			move:function(dimension){µ.logger.info("move",dimension)},
			stop:function(dimension){alert(JSON.stringify(dimension,null,"\t"))},
		});
	},
	function clip(container)
	{
		container.innerHTML+=String.raw
`
<div style="width:10em;height:10em;border:1px solid">
`;
		var dragArea=container.children[1];
		µ.gui.dragBox(dragArea,{
			clip:true
		});
	}
]);