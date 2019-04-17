(function(µ,SMOD,GMOD,HMOD,SC){

	let guiMenu=GMOD("gui.menu");

	SC=SC({
		rs:"rescope",
		Node:"NodePatch",
		encase:"encase"
	});

	let DynamicMenu=guiMenu.DynamicMenu=µ.Class({
		constructor:function(loader,data,mapper,param)
		{
			SC.rs.all(this,["_trigger","_mapper"]);
			this.loader=loader;

			this.data=[];
			this.domDataMap=new WeakMap();
			this.mapper=mapper;
			this.param=param;

			this.element=guiMenu(data,this._mapper,param);
			this.element.classList.add("DynamicMenu");
			this.element.addEventListener("click",this._trigger);
			this.element.addEventListener("mouseover",this._trigger);
		},
		_mapper(element,data)
		{
			this.domDataMap.set(data,element);
			this.domDataMap.set(element,data);
			this.mapper(element,data);
		},
		_updateMenu(element,data)
		{
			guiMenu.update(element,data,this._mapper,µ.constantFunctions.same,this.param);
		},
		async _loadData(data,menuItem)
		{
			await this.loader(data);
			this._updateMenu(menuItem,data);
		},
		_trigger(event)
		{
			let target=event.target;
			if(target.tagName==="LI"&&(event.type==="click")===target.hasAttribute("tabindex"))
			{
				this._loadData(this.domDataMap.get(target),target);
			}
		}
	});

	SMOD("gui.DynamicMenu",DynamicMenu);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);