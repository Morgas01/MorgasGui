(function(µ,SMOD,GMOD,HMOD,SC){
	
	//SC=SC({});
	
	if(!µ.gui) µ.gui={};
	
	µ.gui.blocked=function(element)
	{
		element=element||document.createElement("div");
		element.classList.add("blocked");
		element.block		=function(){element.classList.add("blocked")};
		element.unblock		=function(){element.classList.remove("blocked")};
		element.toggleBlock	=function(){element.classList.toggle("blocked")};
		return element;
	};
	µ.gui.blocked.unblock=function(element)
	{
		element.classList.remove("blocked");
		return element;
	}

	SMOD("gui.blocked",µ.gui.blocked);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);