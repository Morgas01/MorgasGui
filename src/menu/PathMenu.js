(function(µ,SMOD,GMOD,HMOD,SC){

	let guiMenu=GMOD("gui.menu");

	SC=SC({
		Reporter:"EventReporterPatch",
		Event:"Event"
	});

	let ACTIVE_STYLE="active";
	let indexOf=Function.prototype.call.bind(Array.prototype.indexOf);
	let includes=Function.prototype.call.bind(Array.prototype.includes);

	let PathMenu=guiMenu.PathMenu=µ.Class({
		constructor:function(data,mapper,{childrenGetter,active})
		{
			new SC.Reporter(this,[PathMenu.ChangeEvent]);

			this.domDataMap=new WeakMap();
			this.mapper=mapper
			this.menu=guiMenu(data,(element,data)=>
			{
				this.domDataMap.set(data,element);
				this.domDataMap.set(element,data);
				mapper(element,data);
			},childrenGetter);
			this.element=document.createElement("UL");
			this.element.classList.add("PathMenu","menu");
			this.element.addEventListener("focusin",this._showMenu.bind(this));
			this.element.addEventListener("click",this._selectItem.bind(this));

			this.activePath=[];

			this.setActive(active);
		},
		setActive(item)
		{
			this.element.innerHTML="";
			this.activePath.length=0;
			if(this.domDataMap.has(item))
			{
				if(item instanceof Element) item=this.domDataMap.get(item);
				this.active=item;

				this.activePath.push(item);
				let itemElement=this.domDataMap.get(item);
				while (itemElement.parentNode!==this.menu)
				{
					itemElement=itemElement.parentNode.parentNode;
					this.activePath.unshift(this.domDataMap.get(itemElement));
				}
				for(let pathItem of this.activePath)
				{
					let pathElement=document.createElement("LI");
					pathElement.tabIndex=-1;
					this.mapper(pathElement,pathItem);
					this.element.appendChild(pathElement);
				}
			}
			else
			{
				//TODO dummy item
			}
			this.reportEvent(new PathMenu.ChangeEvent(this.activePath));
		},
		getActive()
		{
			return this.activePath&&this.activePath[this.activePath.length]||null;
		},
		_showMenu(event)
		{
			let target=event.target;
			let pathIndex=indexOf(this.element.children,target);
			if(pathIndex==-1) return;
			let item=this.activePath[pathIndex];

			let itemElement=this.domDataMap.get(item);
			itemElement.classList.add(ACTIVE_STYLE);
			let subMenu=itemElement.parentNode;
			let subMenuParent=subMenu.parentNode;
			target.appendChild(subMenu);

			target.addEventListener("blur",()=>
			{
				if(subMenuParent) subMenuParent.appendChild(subMenu);
				else subMenu.remove();
				itemElement.classList.remove(ACTIVE_STYLE);
			},{once:true});
		},
		_selectItem(event)
		{
			let target=event.target;
			if(target==this.element||includes(this.element.children,target)) return;

			document.activeElement.blur();
			while(target&&!this.domDataMap.has(target)) target=target.parentNode;
			if(!target) return;
			this.setActive(target);
		}
	});


	PathMenu.ChangeEvent=µ.Class(SC.Event,{
		name:"pathChange",
		constructor:function(activePath)
		{
			this.active=activePath[activePath.length-1];
			this.path=activePath.slice();
		}
	});

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);