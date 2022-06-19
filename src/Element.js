(function(µ,SMOD,GMOD,HMOD,SC){

	//SC=SC({});

	µ.gui={};

	let Element=µ.gui.Element=µ.Class({
		styleClass:"gui-element",
		constructor:function({el,tagName}={})
		{
			if(el) this.el=el;
			else if (tagName)
			{
				this.el=document.createElement(tagName);
			}
			else throw new SyntaxError("no element or tagName");

			for(let c=this; c; c=Object.getPrototypeOf(c))
			{
				if(c.styleClass) this.el.classList.add(c.styleClass);
			}

			Element.instanceMap.set(this.el,this);
		},
		getParent()
		{
			return this.el.parentNode && Element.getInstance(this.el.parentNode);
		}
	});
	Element.instanceMap=new WeakMap();
	Element.getInstance=function(el)
	{
		while(el)
		{
			let instance=Element.instanceMap.get(el);
			if(instance) return instance;
			el=el.parentNode?.closet(".gui-element");
		}
		return null;
	}


	SMOD("gui.Element",µ.gui.Element);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
