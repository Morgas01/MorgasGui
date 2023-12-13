(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		Element:"gui.Element"
	});

	let parsedCase=JSON.parse(decodeURIComponent(location.search.slice(1)),function(key,value)
	{
		if (typeof value==="object"&&"_type" in value)
		{
			switch (value._type)
			{
				case "function":
					return new Function(...(value.params||[]),value.body);
				case "class":
				{
					let clazz=GMOD(value._module);
					if(!clazz)
					{
						console.error("couldn't find module:"+value._module);
					}
					else
					{
						return new clazz(...value.params);
					}
				}
				default:
					console.error("can't revive unknown type:"+value._type);
			}
		}
		return value;
	});

	let element;
	if(parsedCase instanceof SC.Element)
	{
		element=parsedCase;
	}
	else
	{//test object
		element=parsedCase.element;
		if(parsedCase.template)
		{
			document.body.innerHTML=parsedCase.template;
		}
		if(typeof parsedCase.init==="function")
		{
			parsedCase.init(element);
		}
	}

	document.body.appendChild(element.el);


})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut)