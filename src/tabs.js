(function(µ,SMOD,GMOD,HMOD,SC){
	
	//SC=SC({});
	
	if(!µ.gui) µ.gui={};
	/**
	 * @param {Map.<String|Element|Function,String|Element|Function>} map - Object/Map of title:content
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
		var tabMap=new Map();
		container.addTab=function(title,content,activate,index)
		{
			title=parse(title);
			if(!tabMap.has(title))
			{
				content=parse(content);
				tabMap.set(title,content);
			}
			if(index<0) index=header.children.length+index;
			header.insertBefore(title,header.children[index]);
			if(activate)container.setActive(title);

			return header.children.length-1;//index
		};
		container.getTab=function(tabQualifier)
		{
			return tabMap.get(container.getHeader(tabQualifier));
		};
		container.removeTab=function(tabQualifier)
		{
			var header=container.getHeader(tabQualifier);
			if(header)
			{
				tabMap.get(header).remove();
				if(title.classList.contains("active"))
				{
					container.setActive(header.nextSibling||header.previousSibling);
				}
				header.remove();
				tabMap.delete(header);
			}
		};
		/**
		 * @param {Element,Number} tabQualifier - header element, tab element or index of header
		 * @return {Elemenr} header
		 */
		container.getHeader=function(tabQualifier)
		{
			if(tabMap.has(tabQualifier))return tabQualifier;
			if(Number.isInteger(tabQualifier) && tabQualifier in header.children) return header.children[tabQualifier];
			for(var entry of tabMap.entries())
			{
				if(entry[1]==tabQualifier) return entry[0];
			}
			return null;
		};
		container.setActive=function(tabQualifier)
		{
			var active=container.getActive();
			if(active)
			{
				active.classList.remove("active");
				tabMap.get(active).remove();
			}

			active=container.getHeader(tabQualifier)
			if(active)
			{
				var content=tabMap.get(active);
				container.appendChild(content);
				active.classList.add("active");
			}
		};
		container.getActive=function()
		{
			return header.querySelector(".active");
		};
		container.getActiveTab=function()
		{
			return tabMap.get(container.getActive());
		};
		container.getTabsByTitleContent=function(title)
		{
			return Array.prototype.filter.call(header.children,c=>c.textContent==title).map(h=>tabMap.get(h));
		};

		header.addEventListener("click",function(e)
		{
			var title=e.target;
			while(title&&title.parentNode!=header)
			{
				if(title==header) return;
				title=title.parentNode;
			}
			if(title)
			{
				if(e.target.dataset.action==="closeTab") container.removeTab(title);
				else container.setActive(title);
			}
		});

		if(map)
		{
			for(var entry of map)
			{
				container.addTab(entry[0],entry[1]);
			}
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
				element.textContent=param;
				break;
			case "function":
				param(element);
				break;
		}
		return element;
	};
	SMOD("gui.tabs",µ.gui.tabs);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);