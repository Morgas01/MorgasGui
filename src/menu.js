(function(µ,SMOD,GMOD,HMOD,SC){
	

	SC=SC({
		Node:"NodePatch"
	});
	
	if(!µ.gui) µ.gui={};
	
	µ.gui.menu=function(data,mapper,childrenKey)
	{
		var menu=createMenu(data,mapper,childrenKey);
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
	var createMenu=function(data,mapper,childrenKey)
	{
		var menu=document.createElement("ul");
		data.map(root=>SC.Node.traverse(root,function(node,parent,parentDOM,entry)
		{
			var li=document.createElement("li");

			if(parent)
			{
				if(parent!=root)li.dataset.index=parentDOM.li.dataset.index+"."+entry.index;
				else li.dataset.index=entry.index;
				if(!parentDOM.ul)
				{
					parentDOM.ul=document.createElement("ul");
					parentDOM.li.appendChild(parentDOM.ul);
				}
				parentDOM.ul.appendChild(li);
			}
			else
			{
				menu.appendChild(li);
			}
			var fn=mapper.call(node,li,node,parent,entry.index);
			if(typeof fn =="function") li.addEventListener("click",e=>fn.call(node,e,node),false);
			return {ul:null,li:li};
		},childrenKey||"children"));
		return menu;
	}

	SMOD("gui.menu",µ.gui.menu);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);