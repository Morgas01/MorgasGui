(function(µ,SMOD,GMOD,HMOD,SC){
	
	//SC=SC({});
	
	if(!µ.gui) µ.gui={};
	
	µ.gui.blocked=function(element)
	{
		element=element||document.createElement("div");
		element.block		=element.classList.add.bind(element.classList,"blocked");
		element.unblock		=element.classList.remove.bind(element.classList,"blocked");
		element.toggleBlock	=element.classList.toggle.bind(element.classList,"blocked");
		return element;
	};
	µ.gui.blocked.unblock=function(element)
	{
		element.classList.remove("blocked");
		return element;
	}
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);