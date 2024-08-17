(async function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		Element:"gui.Element"
	});

	let types = await fetch(`types.json`).then(r=>r.ok?r.json():Promise.reject(r));

	let parsedCase=JSON.parse(decodeURIComponent(location.search.slice(1)),function(key,value)
	{
		if (typeof value==="object"&&"_type" in value)
		{
			switch (value._type)
			{
				case "string":
				case "number":
				case "boolean":
				case "object":
				{
					return value._value;
				}
				case "function":
					if(value.name)
					{
						return new Function(`return function ${value.name} (${value.param}) {${value.body}`)();
					}
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
					break;
				}
				case "HTMLElement":
				{
					return document.querySelector(value._value);
				}
				default:
					if (value._type in types)
					{
						if (types[value._type]._type==="class")
						{
							let module=types[value._type];
							let clazz=GMOD(module);
							if (!clazz)
							{
								console.error("couldn't find module:"+module);
							}
							else
							{
								return new clazz(...value.params);
							}
						}
						else if ("_value" in value)
						{
							return value;
						}
						else
						{
							console.error("can't revive unknown type:"+value._type);
						}
					}
					else
					{
						console.error("can't revive unknown type:"+value._type);
					}
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