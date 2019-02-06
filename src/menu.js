(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		Node:"NodePatch"
	});
	
	if(!µ.gui) µ.gui={};

	let mapData=function(root,mapper,childrenGetter,clickable)
	{

		var rootResult=SC.Node.traverse(root,function(node,parent,parentResult,entry)
		{
			var item=document.createElement("LI");
			if(parent)
			{
				if(parent!=root)item.dataset.index=parentResult.item.dataset.index+"."+entry.index;
				else item.dataset.index=entry.index;
				if(!parentResult.container)
				{
					parentResult.container=document.createElement("UL");
					parentResult.item.appendChild(parentResult.container);
				}
				parentResult.container.appendChild(item);
			}
			if(clickable) item.tabIndex=-1;
			mapper.call(node,item,node,parent,entry.index);
			return {container:null,item:item};
		},childrenGetter);

		return rootResult.item;
	};

	µ.gui.menu=function(data,mapper,childrenGetter,clickable)
	{
		var menu=document.createElement("ul");
		for(var entry of data)
		{
			menu.appendChild(mapData(entry,mapper,childrenGetter,clickable));
		}
		menu.classList.add("menu");
		return menu;
	};

	µ.gui.menu.button=function(text,data,mapper,childrenGetter,clickable)
	{
		var wrapper=document.createDocumentFragment();
		var button=document.createElement("button");
		button.textContent=button.dataset.translation=text;
		button.classList.add("menu");
		var menu=µ.gui.menu(data,mapper,childrenGetter,clickable);
		menu.classList.add("menu");

		wrapper.appendChild(button);
		wrapper.appendChild(menu);
		return wrapper;
	};

	µ.gui.menu.splitButton=function(text,data,mapper,childrenGetter,clickable)
	{
		var wrapper=document.createDocumentFragment();
		var button=document.createElement("button");
		button.classList.add("splitButton");
		wrapper.appendChild(button);

		var splitWrapper=document.createElement("div");
		splitWrapper.appendChild(µ.gui.menu.button("▽",data,mapper,childrenGetter,clickable));
		wrapper.appendChild(splitWrapper);

		if(typeof text!="function")button.textContent=button.dataset.translation=text;
		else text.call(button,button);

		return wrapper;
	}

	SMOD("gui.menu",µ.gui.menu);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);