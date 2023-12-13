(function(µ,SMOD,GMOD,HMOD,SC){

	let Element=GMOD("gui.Element");

	SC=SC({
		action:"gui.actionize",
	});
	
	if(!µ.gui) µ.gui={};

	/**
	 * @typedef {Object} gui.Dialog~param
	 * @property {boolean} (param.modal=false)
	 * @property {Element} (param.target=document.body)
	 * @property {boolean} (param.autofocus=true) - try to focus an element with the "autofocus" attribute when the dialog is appended to a container
	 * @property {Object.<String,Function>} (param.actions={})
	 * @property {String} (param.contentTagName="div") - tag name of the dialog element
	 */
	/**
	 * @param {String|Element|Function} content
	 * @param {gui.Dialog~param} (param)
	 *
	 * uses "close" action to close the dialog
	 */
	µ.gui.Dialog=µ.Class(Element,{
		styleClass:"gui-dialog",
		constructor:function(content,{
		modal=false,
		target=document.body,
		autofocus=true,
		actions={},
		contentTagName="div",
		actionEvents=undefined
		}={})
		{
			Element.call(this,{tagName:"dialog"});

			this.content=parse(content,contentTagName);

			this.el.appendChild(this.content);

			Object.defineProperty(this,"modal",{
				configurable:true,
				enumerable:true,
				set:val=>
				{
					if(val)this.el.classList.add("modal");
					else this.el.classList.remove("modal");
				},
				get:this.el.classList.contains.bind(this.el.classList,"modal")
			});

			this.modal=modal;
			this.autofocus=autofocus;
			if(target) this.appendTo(target);
			if(!actions.close)actions.close=this.close;

			this.actions=actions;

			SC.action({actions:this.actions,element:this.content,scope:this,events:this.actionEvents});
		},
		appendTo(element)
		{
			element.appendChild(this.el);
			if(this.autofocus)
			{
				let toFocus=this.content.querySelector("[autofocus]");
				if(toFocus) toFocus.focus();
			}
		},
		open()
		{
			this.modal?this.el.showModal():this.el.show();
		},
		close()
		{
			this.el.close();
		}
	});


	let parse=function(param,tagName="div")
	{
		if(param instanceof HTMLElement||param instanceof DocumentFragment) return param;

		let element=document.createElement(tagName);
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

	SMOD("gui.Dialog",µ.gui.Dialog);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);