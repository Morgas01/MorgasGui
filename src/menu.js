(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		Node:"NodePatch",
		encase:"encase"
	});
	
	if(!µ.gui) µ.gui={};
	let indexOf=Function.prototype.call.bind(Array.prototype.indexOf);


	/**
	 * maps data to DOM
	 * @callback µ.gui.menu~mapper
	 * @this * the data to map
	 * @param {HTMLLIElement} element
	 * @param {*} data
	 *
	 */

	/**
	 * Creates a Menu from 'data'.
	 * The whole functionality happens in DOM and style!
	 * DOM structure:
	 *  - cascaded ul/li lists. (<ul><li> [content] [<ul>[...]</ul>]</li></ul>)
	 *  - a submenu's <ul> must be the last element in li
	 *  - top ul has the style class '.menu'
	 *  - clickable (click to open submenu) items must have a tabindex (uses :focus pseudo-class)
	 *
	 *  this function does not create empty submenus
	 *
	 * @param data
	 * @param mapper
	 * @param param
	 * @return {HTMLElement}
	 */
	
	µ.gui.menu=function(data,mapper,param)
	{
		let menu=document.createElement("UL");
		data=SC.encase(data);
		for(let i=0;i<data.length;i++)
		{
			menu.appendChild(mapData(data[i],mapper,{indexPath:i,...param}));
		}
		menu.classList.add("menu");
		return menu;
	};

	/**
	 * @param {HTMLUListElement} (submenu=null)
	 * @param {*} data
	 * @param {µ.gui.menu~mapper} mapper - maps data to dom
	 * @param {Function} (identifier) - returns true when (data===element)
	 * @param {Object} (param)
	 * @param {µ.gui.menu~mapper} updateMapper - maps updated data
	 * @param {Function} childrenGetter
	 * @param {Function} filter
	 */
	µ.gui.menu.update=function(element,data,mapper,identifier,param={})
	{
		param.childrenGetter=SC.Node.normalizeChildrenGetter(param.childrenGetter);
		let {updateMapper=mapper,childrenGetter,filter}=param;

		if(!element) throw new ReferenceError("#gui.menu:001 no element");

		let todo=[{element,data}];
		while (todo.length>0)
		{
			let {element,data,indexPath,parentSubMenu}=todo.shift();
			if(!element)
			{
				element=mapData(data,mapper,{indexPath,...param});
				parentSubMenu.appendChild(element);
			}
			else
			{
				element.dataset.index=element.dataset.index.match(/(?:.*\.)?/)[0]+indexOf(element.parentNode.children,element);
				updateMapper.call(data,element,data);

				let children=childrenGetter(data);
				if(filter) children=children.filter(filter);
				let nextSubMenu=element.lastElementChild;

				if(!children||children.length===0)
				{
					if(nextSubMenu&&nextSubMenu.tagName==="UL")
					{
						nextSubMenu.remove();
					}
				}
				else
				{
					if(!nextSubMenu||nextSubMenu.tagName!=="UL")
					{
						nextSubMenu=document.createElement("UL");
						element.appendChild(nextSubMenu);
					}

					let menuItems=Array.from(nextSubMenu.children);
					for(let i=0;i<children.length;i++)
					{
						let item=children[i];
						let childTodo={
							indexPath:element.dataset.index+"."+i,
							data:item,parentSubMenu:nextSubMenu
						};
						for(let i=0;identifier&&i<menuItems.length;i++)
						{
							let menuItem=menuItems[i];
							if(identifier(item,menuItem))
							{
								menuItems.splice(i,1);
								childTodo.menuItem=menuItem;
							}
						}
						todo.push(childTodo);
					}
					menuItems.forEach(e=>e.remove());
				}
			}
		}
	};
	/**
	 * creates menu structure from data
	 * @param {HTMLUListElement} submenu
	 * @param {*} item
	 * @param {µ.gui.menu~mapper} mapper
	 * @param {Function} childrenGetter
	 * @param {boolean} clickable
	 * @param {Function} filter
	 * @return {*}
	 */
	let mapData=function(item,mapper,{childrenGetter,clickable,filter,indexPath=""}={})
	{
		let rootResult=SC.Node.traverse(item,function(data,parent,parentResult,entry)
		{
			let item=document.createElement("LI");
			if(parent)
			{
				let parentSubMenu=parentResult.lastElementChild;
				if(!parentSubMenu||parentSubMenu.tagName!=="UL")
				{
					parentSubMenu=document.createElement("UL");
					parentResult.appendChild(parentSubMenu);
				}
				parentSubMenu.appendChild(item);
				item.dataset.index=parentSubMenu.parentNode.dataset.index+"."+entry.index;
			}
			else
			{
				item.dataset.index=indexPath;
			}

			if(clickable) item.tabIndex=-1;
			mapper.call(data,item,data);
			return item;
		},{childrenGetter,filter});

		return rootResult;
	};

	µ.gui.menu.button=function(text,data,mapper,param)
	{
		let wrapper=document.createDocumentFragment();
		let button=document.createElement("button");
		button.textContent=button.dataset.translation=text;
		button.classList.add("menu");
		let menu=µ.gui.menu(data,mapper,param);
		menu.classList.add("menu");

		wrapper.appendChild(button);
		wrapper.appendChild(menu);
		return wrapper;
	};

	µ.gui.menu.splitButton=function(text,data,mapper,param)
	{
		let wrapper=document.createDocumentFragment();
		let button=document.createElement("button");
		button.classList.add("splitButton");
		wrapper.appendChild(button);

		let splitWrapper=document.createElement("div");
		splitWrapper.appendChild(µ.gui.menu.button("▽",data,mapper,param));
		wrapper.appendChild(splitWrapper);

		if(typeof text!="function")button.textContent=button.dataset.translation=text;
		else text.call(button,button);

		return wrapper;
	};

	SMOD("gui.menu",µ.gui.menu);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);