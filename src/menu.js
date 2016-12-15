(function(µ,SMOD,GMOD,HMOD,SC){
	

	SC=SC({
		tree:"gui.tree"
	});
	
	if(!µ.gui) µ.gui={};
	
	µ.gui.menu=function(data,mapper,childrenKey)
	{
		var menu=document.createElement("ul");
		for(var entry of data)
		{
			menu.appendChild(SC.tree.create(entry,mapper,{childrenKey:childrenKey}));
		}
		menu.classList.add("menu");
		return menu;
	};
	
	µ.gui.menu.button=function(text,data,mapper,childrenKey)
	{
		var wrapper=document.createDocumentFragment();
		var button=document.createElement("button");
		button.textContent=button.dataset.translation=text;
		button.classList.add("menu");
		var menu=µ.gui.menu(data,mapper,childrenKey);
		menu.classList.add("menu");
		
		wrapper.appendChild(button);
		wrapper.appendChild(menu);
		return wrapper;
	};

	µ.gui.menu.splitButton=function(text,data,mapper,childrenKey)
	{
		var wrapper=document.createDocumentFragment();
		var button=document.createElement("button");
		button.classList.add("splitButton");
		wrapper.appendChild(button);

		var splitWrapper=document.createElement("div");
		splitWrapper.appendChild(µ.gui.menu.button("\u02C5",data,mapper,childrenKey));
		wrapper.appendChild(splitWrapper);

		if(typeof text!="function")button.textContent=button.dataset.translation=text;
		else text.call(button,button);

		return wrapper;
	}

	SMOD("gui.menu",µ.gui.menu);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);