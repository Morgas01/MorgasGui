(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		action:"gui.actionize"
	});
	
	if(!µ.gui) µ.gui={};

	/**
	 * @typedef {Object} gui.Dialog~param
	 * @property {boolean} (param.modal=false)
	 * @property {Element} (param.target=document.body)
	 * @property {boolean} (param.autofocus=true) - try to focus an element with the "autofocus" attribute when the dialog is appended to a container
	 * @property {Object.<String,Function>} (param.actions={})
	 * @property {String} (param.dialogTagName="div") - tag name of the dialog element
	 */
	/**
	 * @param {String|Element|Function} content
	 * @param {gui.Dialog~param} (param)
	 *
	 * uses "close" action to close the dialog
	 */
	µ.gui.Dialog=µ.Class({
		constructor:function(content,{
		modal=false,
		target=document.body,
		autofocus=true,
		actions={},
		dialogTagName="div",
		actionEvents
		}={})
		{
			this.wrapper=document.createElement("div");
			this.wrapper.classList.add("dialog-wrapper","modal");
			this.content=parse(content,dialogTagName);
			this.content.classList.add("dialog");

			this.wrapper.appendChild(this.content);

			Object.defineProperty(this,"modal",{
				configurable:true,
				enumerable:true,
				set:val=>
				{
					if(val)this.wrapper.classList.add("modal");
					else this.wrapper.classList.remove("modal");
				},
				get:this.wrapper.classList.contains.bind(this.wrapper.classList,"modal")
			});

			this.modal=modal;
			this.autofocus=autofocus;
			if(target) this.appendTo(target);
			if(!actions.close)actions.close=this.close;

			this.actions=actions;

			SC.action(this.actions,this.content,this,actionEvents);
		},
		appendTo(element)
		{
			element.appendChild(this.wrapper);
			if(this.autofocus)
			{
				let toFocus=this.content.querySelector("[autofocus]");
				if(toFocus) toFocus.focus();
			}
		},
		close(){
			this.wrapper.remove()
		}
	});


	let parse=function(param,tagName)
	{
		if(param instanceof HTMLElement) return param;

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