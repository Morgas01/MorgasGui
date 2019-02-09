(function(){
	
	let mapper=function(element,data)
	{
		element.textContent=data.text;
	};
	let menuData=[
		{
			text:"item 1"
		},
		{
			text:"item 2",
			children:[
				{
					text:"item 2-1"
				},
				{
					text:"item 2-2",
				},
				{
					text:"item 2-3",
					children:[
						{
							text:"item 2-3-1"
						},
						{
							text:"item 2-3-2"
						}
					]
				}
			]
		}
	];
	module("menu/PathMenu",[
		function (container)
		{
			let menu=new µ.gui.menu.PathMenu(menuData,mapper/*,{active:menuData[1].children[2]}*/);
			container.appendChild(menu.element);
			menu.addEventListener("pathChange",null,e=>alert(JSON.stringify(e,null,"\t")));
		}
	]);
})();