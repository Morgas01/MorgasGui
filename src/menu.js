(function(µ,SMOD,GMOD,HMOD,SC){
	
	//SC=SC({});
	
	if(!µ.gui) µ.gui={};
	
	µ.gui.menu=function(data)
	{
		var menu=createMenu(data);
		menu.classList.add("menu");
		return menu;
	};
	
	µ.gui.menu.button=function(text,data)
	{
		var wrapper=document.createElement("span");
		var button=document.createElement("button");
		button.textContent=button.dataset.translation=text;
		button.classList.add("menu");
		var menu=createMenu(data);
		menu.classList.add("menu");
		
		wrapper.appendChild(button);
		wrapper.appendChild(menu);
		return wrapper;
	};
	
	var createMenu=function(data)
	{
		var menu=document.createElement("ul");
		for(var key in data)
		{
			var item=document.createElement("li");
			item.textContent=item.dataset.translation=key;
			if(data[key])
			{
				if(typeof data[key]==="function")
				{
					item.addEventListener("click",function(event)
					{
						if(event.target==this)data[key].call(this,event)
					});
				}
				if(Object.keys(data[key]).length>0)
				{
					var submenu=createMenu(data[key]);
					item.appendChild(submenu);
				}
			}
			menu.appendChild(item);
		}
		return menu;
	};
	
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);