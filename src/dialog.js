(function(µ,SMOD,GMOD,HMOD,SC){

	//SC=SC({});
	
	if(!µ.gui) µ.gui={};
	
	µ.gui.dialog=function(html,actions)
	{
		var wrapper=document.createElement("div");
		wrapper.classList.add("dialog-wrapper","modal");
		var dialog=document.createElement("div");
		dialog.classList.add("dialog");
		
		wrapper.appendChild(dialog);
		document.body.appendChild(wrapper);
		
		dialog.appendTo=function(element)
		{
			element.appendChild(wrapper);
		}
		dialog.remove=wrapper.remove.bind(wrapper);
		
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
		
		//TODO html & actions
		
		return dialog;
	}
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);