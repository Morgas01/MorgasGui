(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		Config:"Config"
	});

	var FORM=µ.gui.form=function(config,value,header,path)
	{
		if(!(config instanceof SC.Config)) config=SC.Config.parse(config,value);
		var form=parseContainer(config,header,path);
		form.classList.add("form");

		form.addEventListener("click",function(event)
		{
			var button=event.target;
			var action=button.dataset.action;
			if(action)
			{
				event.stopPropagation();
				event.stopImmediatePropagation();
				event.preventDefault();

				switch (action)
				{
					case "add":
						if(button.classList.contains("addField")) button.parentNode.addField();
						else
						{
							var keyField=button.previousSibling;
							keyField.setCustomValidity("");
							if(keyField.checkValidity())
							{
								button.parentNode.parentNode.addField(keyField.value);
							}
							else keyField.setCustomValidity(keyField.validationMessage);
						}
						break;
					case "remove":
						var field=button.parentNode;
						var container=field.parentNode;
						container.removeField(field.dataset.name)
						break;
					default:
						µ.logger.warning(String.raw`unknown form action ${action}`);
				}
			}
		});

		return form;
	};
	var FIELD=µ.gui.form.field=function(config,name,path)
	{
		name=name==null?"":name;
		var field;
		switch (config.type)
		{
			case "string":
				if(config.display=="textArea")
				{
					field=document.createElement("textArea");
				}
				else
				{
					field=document.createElement("input");
					field.type="text";
					if(config.pattern)field.pattern=config.pattern.toSource().match(/\/?\^?(.*?)\$?\//)[1]
				}
				field.value=config.get();
				break;
			case "boolean":
				field=document.createElement("input");
				field.type="checkbox";
				field.checked=config.get();
				break;
			case "number":
				field=document.createElement("input");
				field.type="number";
				field.value=config.get();
				break;
			case "select":
				field=document.createElement("select");
				for(var val of config.values)
				{
					var option=document.createElement("option");
					option.value=option.textContent=val;
					option.dataset.translation=name+"."+val;
					field.appendChild(option);
				}
				field.value=config.get();
				break;
			default:
				throw "unknown type "+config.type;
		}

		field.name=name;
		if(path) field.dataset.path=path;

		field.isValid=function()
		{
			return (!field.checkValidity||field.checkValidity()) && (config.isValid(field.valueAsNumber||field.value))
		}
		field.addEventListener("change",function()
		{
			var value=field.valueAsNumber||field.value;
			field.setCustomValidity("");
			var valid=field.isValid();
			if(valid!==true)
			{
				field.setCustomValidity(valid||"invalid");
			}
			else
			{
				var formChangeEvent=new CustomEvent("FormChange",{
					bubbles:true,
					detail:{
						old:config.get(),
						new:value,
						key:name,
						path:path
					}
				});
				config.set(value);
				field.dispatchEvent(formChangeEvent);
			}
		},false);
		return field;
	};
	var parseContainer=function(config,header,path)
	{
		var container=document.createElement("fieldset");
		container.dataset.path=path;
		if(header!=null)
		{
			var legend=document.createElement("legend");
			legend.dataset.translation=legend.textContent=header;
			container.appendChild(legend);
		}
		else
		{
			container.classList.add("no-legend");
		}


		if(config instanceof SC.Config.Container.Array)
		{
			container.classList.add("Array");

			var addButton=document.createElement("button");
			addButton.classList.add("addField");
			addButton.dataset.action="add";
			addButton.dataset.translation="form.addButton";
			addButton.textContent="+";

			container.appendChild(addButton);
		}
		else if(config instanceof SC.Config.Container.Map)
		{
			container.classList.add("Map");

			var span=document.createElement("span");
			span.classList.add("addField");

			var input=document.createElement("input");
			input.type="text";
			input.required=true;
			span.appendChild(input);

			var addButton=document.createElement("button");
			addButton.dataset.action="add";
			addButton.dataset.translation="form.addButton";
			addButton.textContent="+";
			span.appendChild(addButton);

			container.appendChild(span);
		}
		var fields=[];
		for(var [name,field] of config)
		{
			var field=parseConfig(name,field,config,path);
			container.appendChild(field);
			fields.push(field);
		};
		container.isValid=function()
		{
			return fields.every(f=>f.isValid());
		}
		container.addField=function(key,value)
		{
			var field;
			if(config instanceof SC.Config.Container.Array)
			{
				value=key;
				key=config.length;
				field=config.push(value);
			}
			else if(config instanceof SC.Config.Container.Map)
			{
				field=config.add(key,value);
			}
			else return;

			field=parseConfig(key,field,config,path);
			container.appendChild(field);
			fields.push(field);
			var formAddEvent=new CustomEvent("FormAdd",{
				bubbles:true,
				detail:{
					key:key,
					path:path,
					value:value
				}
			});
			field.dispatchEvent(formAddEvent);
		}
		return container;
	};
	var parseConfig=function(name,config,parent,path)
	{
		if(config instanceof SC.Config.Container)
		{
			var subPath;
			if(path)
			{
				if(parent instanceof SC.Config.Container.Array)
				{
					subPath=path+"["+name+"]";
				}
				else subPath=path+"."+name
			}
			else subPath=name;
			var container=parseContainer(config,name,subPath);
			if(parent instanceof SC.Config.Container.Array || parent instanceof SC.Config.Container.Map)
			{
				var removeButton=document.createElement("button")
				removeButton.classList.add("removeField");
				removeButton.dataset.action="remove";
				removeButton.dataset.translation="form.removeButton"
				removeButton.textContent="-";
				container.insertBefore(removeButton,container.firstChild);
			}
			return container;
		}
		else
		{
			var label=document.createElement("label");
			label.dataset.name=name;
			if(parent instanceof SC.Config.Container.Array || parent instanceof SC.Config.Container.Map)
			{
				var removeButton=document.createElement("button")
				removeButton.classList.add("removeField");
				removeButton.dataset.action="remove";
				removeButton.dataset.translation="form.removeButton"
				removeButton.textContent="-";
				label.appendChild(removeButton);
			}

			var span=document.createElement("span");
			span.classList.add("label");
			span.dataset.translation=span.textContent=name;
			label.appendChild(span);

			var field=FIELD(config,name,path);
			label.appendChild(field);
			label.isValid=()=>field.isValid();
			return label;
		}
	}

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
