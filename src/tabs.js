(function(µ,SMOD,GMOD,HMOD,SC){
	
	//SC=SC({});
	
	if(!µ.gui) µ.gui={};
	/**
	 * @param {Object.<String|Element|Function,String|Element|Function>} map - Object/Map of title:content
	 *
	 * Strings will be innerHTML.
	 * Functions get an element as an argument
	 */
	µ.gui.tabs=function(map,active)
	{
		var container=document.createElement("div")
		container.classList.add("tabs");
		var header=document.createElement("header")
		container.appendChild(header);
		header.addEventListener("click",function(e)
		{
			var title=e.target;
			while(title&&title.parentNode!=header) title=title.parentNode;
			if(e.target.dataset.action==="closeTab") container.removeTab(title);
			else container.setActive(title);
		})
		var tabMap=new Map();
		for(var entry of map)
		{
			var title=parse(entry[0]);
			var content=parse(entry[1]);
			tabMap.set(title,content);
			header.appendChild(title);
		}
		container.addTab=function(title,content,activate)
		{
			title=parse(title);
			content=parse(content);
			if(tabMap.has(title)) return false;
			tabMap.set(title,content);
			header.appendChild(title);

			if(activate)container.setActive(title);

			return header.children.length-1;//index
		};
		container.removeTab=function(title)
		{
			if(!tabMap.has(title))title=header.children[title];
			if(tabMap.has(title))
			{
				tabMap.get(title).remove();
				if(title.classList.contains("active"))
				{
					container.setActive(title.nextSibling||title.previousSibling);
				}
				title.remove();
				tabMap.delete(title);
			}
		};
		container.setActive=function(index)
		{
			var active=container.getActive();
			if(active)
			{
				active.classList.remove("active");
				tabMap.get(active).remove();
			}

			if(!tabMap.has(index))active=header.children[index];
			else active=index;
			if(active)
			{
				var content=tabMap.get(active);
				container.appendChild(content);
				active.classList.add("active");
			}
		};
		container.getActive=function()
		{
			return header.querySelector(".active")
		}

		container.setActive(active||0);
		return container;
	};

	var parse=function(param)
	{
		if(param instanceof HTMLElement) return param;
		var element=document.createElement("div");
		switch(typeof param)
		{
			case "string":
			default:
				element.innerHTML=param;
				break;
			case "function":
				param(element);
				break;
		}
		return element;
	};
	SMOD("gui.tabs",µ.gui.tabs);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);