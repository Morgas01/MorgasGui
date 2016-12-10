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

	SMOD("gui.menu",µ.gui.menu);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);