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
			text:"item 2"
		}
	];
	let children=new Map();
	let item_2_3={
		text:"item 2-3"
	};
	children.set(menuData[1],[
		{
			text:"item 2-1"
		},
		{
			text:"item 2-2"
		},
		item_2_3
	]);
	children.set(item_2_3,[
		{
			text:"item 2-3-1"
		},
		{
			text:"item 2-3-2"
		}
	]);

	let loader=function(data)
	{
		data.children=children.get(data);
		return new Promise(resolve=>setTimeout(resolve,Math.random()*2e3+1e3));
	};
	module("menu/DynamicMenu",[
		function (container)
		{
			let menu=new µ.gui.menu.DynamicMenu(loader,menuData,mapper/**,{clickable:true}/**/);
			container.appendChild(menu.element);
		}
	]);
})();