(function(µ,SMOD,GMOD,HMOD,SC){
	
	//SC=SC({});
	
	if(!µ.gui) µ.gui={};
	
	µ.gui.loading=function(element)
	{
		element=element||document.createElement("div");
		element.classList.add("loading_1");
		return element;
	};
	µ.gui.loading.layered=function(element)
	{
		element=element||document.createElement("div");
		element.classList.add("layered_1");
		element.innerHTML=String.raw
`
<div class="loading_1">
	<div class="loading_1">
		<div class="loading_1">
			<div class="loading_1"></div>
		</div>
	</div>
</div>
`;
		return element;
	};
	
	µ.gui.loading2=function(element)
	{
		element=element||document.createElement("div");
		element.classList.add("loading_2");
		return element;
	};
	µ.gui.loading2.layered=function(element)
	{
		element=element||document.createElement("div");
		element.classList.add("layered_2");
		element.innerHTML=String.raw
`
<div class="loading_2 layer_1"></div>
<div class="loading_2 layer_2"></div>
<div class="loading_2 layer_3"></div>
`;
		return element;
	};

	SMOD("gui.loading",µ.gui.loading);
	SMOD("gui.loading2",µ.gui.loading2);

	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);