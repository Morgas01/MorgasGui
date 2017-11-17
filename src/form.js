(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		Config:"Config"
	});

	if(!µ.gui) µ.gui={};
	/**
	 * Creates a "form" with fieldsets from [config] data.
	 * uses "add" and "remove" actions.
	 */
	var FORM=µ.gui.form=function(config,value,header,path)
	{
		if(!(config instanceof SC.Config)) config=SC.Config.parse(config,value);
		path=Array.prototype.concat(path||[]);
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
						var name=field.tagName=="LABEL"?field.dataset.name:field.firstElementChild.dataset.translation;
						container.removeField(name);
						break;
					default:
						µ.logger.info(String.raw`unknown form action ${action}`);
				}
			}
		});

		return form;
	};
	var FIELD=µ.gui.form.field=function(config,name,path)
	{
		path=Array.prototype.concat(path||[]);
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
				field.checked=!!config.get();
				break;
			case "number":
				field=document.createElement("input");
				field.type="number";
				if(config.get()!=null) field.value=config.get();
				if(config.min!=null) field.min=config.min;
				if(config.step!=null) field.step=config.step;
				if(config.max!=null) field.max=config.max;
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
				field.size=field.children.length;
				if(config.multiple)
				{
					field.multiple=true;
				}
				field.value=null;
				[].concat(config.get()).map(v=>config.values.indexOf(v)).filter(i=>i>=0).map(i=>field.children[i].selected=true);
				break;
			default:
				throw "unknown type "+config.type;
		}

		field.name=name;
		field.dataset.path=path.join(".");

		var getValue=function()
		{
			switch (config.type) {
				case "number":
					return isNaN(field.valueAsNumber)?field.value:field.valueAsNumber;
					break;
				case "boolean":
					return field.checked;
					break;
				case "select":
					if(config.multiple) return Array.from(field.selectedOptions).map(o=>o.value);
				default:
					return field.value;
			}
		}
		field.getConfig=function(){return config};
		field.isValid=function()
		{
			var valid=(!field.checkValidity||field.checkValidity()) && config.isValid(getValue());
			if(valid!==true)
            {
                field.setCustomValidity(valid||field.validationMessage||"invalid");
            }
			return valid;
		}
		field.addEventListener("change",function()
		{
			field.setCustomValidity("");
			var oldValue=config.get();
			var value=getValue();
			if(field.isValid()===true&&config.set(value))
			{
				field.dispatchEvent(new CustomEvent("formChange",{
					bubbles:true,
					detail:{
						oldValue:oldValue,
						value:value,
						key:name,
						path:path
					}
				}));
			}
		},false);
		return field;
	};
	var parseContainer=function(config,header,path)
	{
		var container=document.createElement("fieldset");
		container.dataset.path=path.join(".");
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
		var fields=new Map();
		for(var [name,field] of config)
		{
			var field=parseConfig(name,field,config,path);
			container.appendChild(field);
			fields.set(name,field);
		};
		container.getConfig=function(){return config};
		container.isValid=function()
		{
			return Array.from(fields.values()).reduce((v,f)=>f.isValid()&&v,true);
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

			var domField=parseConfig(key,field,config,path);
			container.appendChild(domField);
			fields.set(key,domField);
			var formAddEvent=new CustomEvent("formAdd",{
				bubbles:true,
				detail:{
					path:path,
					key:key,
					value:value,
					field:field,
					element:domField
				}
			});
			container.dispatchEvent(formAddEvent);
		};
		container.removeField=function(key)
		{
			if(config instanceof SC.Config.Container.Array)
			{
				key=parseInt(key,10);
				var field=fields.get(key);
				if(field)
				{
					config.splice(key);
					container.removeChild(field);
					fields.delete(key);
					var oldIndex=key
					for(var index of fields.keys())
					{
						if(index>key)
						{
							var shiftField=fields.get(index);
							if(shiftField.tagName=="LABEL")
							{//Field
								shiftField.dataset.name=oldIndex;
								shiftField.querySelector("[name]").name=oldIndex;
							}
							else
							{//container
								shiftField.firstElementChild.dataset.translation=shiftField.firstElementChild.textContent=oldIndex;
								var oldPath=shiftField.dataset.path;
								var newPath=oldPath.replace(new RegExp(index+"$"),oldIndex);
								Array.from(shiftField.querySelectorAll('[data-path^="'+oldPath+'"]'))
								.forEach(e=>e.dataset.path=e.dataset.path.replace(oldPath,newPath));
								shiftField.dataset.path=newPath;
							}
							fields.set(oldIndex,shiftField);
							oldIndex=index;
						}
					}
				}
				else return;
			}
			else if(config instanceof SC.Config.Container.Map)
			{
				config.remove(key);
				var field=fields.get(key);
				container.removeChild(field);
				fields.delete(key);
			}
			else return;

			var formAddEvent=new CustomEvent("formRemove",{
				bubbles:true,
				detail:{
					key:key,
					path:path
				}
			});
			container.dispatchEvent(formAddEvent);
		}
		return container;
	};
	var parseConfig=function(name,config,parent,path)
	{
		if(config instanceof SC.Config.Container)
		{
			var subPath=path.concat(name);
			var container=parseContainer(config,name,subPath);
			if(parent instanceof SC.Config.Container.Array || parent instanceof SC.Config.Container.Map)
			{
				var removeButton=document.createElement("button")
				removeButton.classList.add("removeField");
				removeButton.dataset.action="remove";
				removeButton.dataset.translation="form.removeButton"
				removeButton.textContent="-";
				container.appendChild(removeButton);
			}
			return container;
		}
		else
		{
			var label=document.createElement("label");
			label.dataset.name=name;

			var span=document.createElement("span");
			span.classList.add("label");
			span.dataset.translation=span.textContent=name;
			label.appendChild(span);

			var field=FIELD(config,name,path);
			label.appendChild(field);
			label.isValid=()=>field.isValid();

			if(parent instanceof SC.Config.Container.Array || parent instanceof SC.Config.Container.Map)
			{
				var removeButton=document.createElement("button")
				removeButton.classList.add("removeField");
				removeButton.dataset.action="remove";
				removeButton.dataset.translation="form.removeButton"
				removeButton.textContent="-";
				label.appendChild(removeButton);
			}

			return label;
		}
	}
	SMOD("gui.form",FORM);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
