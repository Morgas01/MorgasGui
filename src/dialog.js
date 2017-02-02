(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		adopt:"adopt",
		action:"gui.actionize"
	});
	
	if(!µ.gui) µ.gui={};
	/**
	 * @param {String|Element|Function} content
	 * @param {Object} (param)
	 * @param {boolean} (param.modal=false)
	 * @param {Element} (param.target=body)
	 * @param {boolean} (param.autofocus=true) - try to focus an element with the "autofocus" attribute when the dialog is appended to a container
	 * @param {Object.<String,Function>} param.actions
	 *
	 * uses "close" action to close the dialog
	 */
	µ.gui.dialog=function(content,param)
	{
		var wrapper=document.createElement("div");
		wrapper.classList.add("dialog-wrapper","modal");
		var dialog=parse(content);
		dialog.classList.add("dialog");
		
		wrapper.appendChild(dialog);
		
		dialog.appendTo=function(element)
		{
			element.appendChild(wrapper);
			if(param.autofocus!=false)
			{
				var toFocus=dialog.querySelector("[autofocus]");
				if(toFocus) toFocus.focus();
			}
		};
		dialog.close=wrapper.remove.bind(wrapper);
		
		Object.defineProperty(dialog,"modal",{
			configurable:true,
			enumerable:true,
			set:function(val)
			{
				if(val)wrapper.classList.add("modal");
				else wrapper.classList.remove("modal");
			},
			get:wrapper.classList.contains.bind(wrapper.classList,"modal")
		});

		param=SC.adopt({
			modal:false,
			target:document.body,
			actions:{}
		},param);

		dialog.modal=param.modal;
		if(param.target) dialog.appendTo(param.target);
		param.actions.close=dialog.close;

		SC.action(param.actions,dialog);
		
		return dialog;
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

	SMOD("gui.dialog",µ.gui.dialog);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);