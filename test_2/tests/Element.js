(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		Element:"gui.Element"
	});

	module("Element",function(container)
	{
		let el=new SC.Element({tagName:"header"}).el;
		el.textContent=`Base of all gui elements. adds the style class gui-element to its html element.`
		container.appendChild(el);
	});

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);