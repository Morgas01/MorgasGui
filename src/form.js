(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		Config:"Config"
	});

	if(!µ.gui) µ.gui={};
	/**
	 * Creates a "form" with fieldsets from [config] data.
	 * uses "add" and "remove" actions.
	 */
	let FORM=µ.gui.form=function(config,value,header,path)
	{
		if(!(config instanceof SC.Config)) config=SC.Config.parse(config,value);
		path=Array.prototype.concat(path||[]);
		let form=parseContainer(config,header,path);
		form.classList.add("form");

		form.addEventListener("click",function(event)
		{
			let button=event.target;
			let action=button.dataset.action;
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
							let keyField=button.previousSibling;
							keyField.setCustomValidity("");
							if(keyField.checkValidity())
							{
								button.parentNode.parentNode.addField(keyField.value);
							}
							else keyField.setCustomValidity(keyField.validationMessage);
						}
						break;
					case "remove":
						let field=button.parentNode;
						let container=field.parentNode;
						let name=field.tagName=="LABEL"?field.dataset.name:field.firstElementChild.dataset.translation;
						container.removeField(name);
						break;
					default:
						µ.logger.info(String.raw`unknown form action ${action}`);
				}
			}
		});

		return form;
	};
	let FIELD=µ.gui.form.field=function(config,name,path)
	{
		path=Array.prototype.concat(path||[]);
		name=name==null?"":name;
		let field;
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
				for(let val of config.values)
				{
					let option=document.createElement("option");
					option.value=option.textContent=val;
					option.dataset.translation=name+"."+val;
					field.appendChild(option);
				}
				if(config.multiple)
				{
					field.size=field.children.length;
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

		let getValue=function()
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
			let valid=(!field.checkValidity||field.checkValidity()) && config.isValid(getValue());
			if(valid!==true)
            {
                field.setCustomValidity(valid||field.validationMessage||"invalid");
            }
			return valid;
		}
		field.addEventListener("change",function()
		{
			field.setCustomValidity("");
			let oldValue=config.get();
			let value=getValue();
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
	let parseContainer=function(config,header,path)
	{
		let container=document.createElement("fieldset");
		container.dataset.path=path.join(".");
		if(header!=null)
		{
			let legend=document.createElement("legend");
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

			let addButton=document.createElement("button");
			addButton.classList.add("addField");
			addButton.dataset.action="add";
			addButton.dataset.translation="form.addButton";
			addButton.textContent="+";

			container.appendChild(addButton);
		}
		else if(config instanceof SC.Config.Container.Map)
		{
			container.classList.add("Map");

			let span=document.createElement("span");
			span.classList.add("addField");

			let input=document.createElement("input");
			input.type="text";
			input.required=true;
			span.appendChild(input);

			let addButton=document.createElement("button");
			addButton.dataset.action="add";
			addButton.dataset.translation="form.addButton";
			addButton.textContent="+";
			span.appendChild(addButton);

			container.appendChild(span);
		}
		let fields=new Map();
		for(let [name,field] of config)
		{
			field=parseConfig(name,field,config,path);
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
			let field;
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

			let domField=parseConfig(key,field,config,path);
			container.appendChild(domField);
			fields.set(key,domField);
			let formAddEvent=new CustomEvent("formAdd",{
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
				let field=fields.get(key);
				if(field)
				{
					config.splice(key);
					container.removeChild(field);
					fields.delete(key);
					let oldIndex=key
					for(let index of fields.keys())
					{
						if(index>key)
						{
							let shiftField=fields.get(index);
							if(shiftField.tagName=="LABEL")
							{//Field
								shiftField.dataset.name=oldIndex;
								shiftField.querySelector("[name]").name=oldIndex;
							}
							else
							{//container
								shiftField.firstElementChild.dataset.translation=shiftField.firstElementChild.textContent=oldIndex;
								let oldPath=shiftField.dataset.path;
								let newPath=oldPath.replace(new RegExp(index+"$"),oldIndex);
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
				let field=fields.get(key);
				container.removeChild(field);
				fields.delete(key);
			}
			else return;

			let formAddEvent=new CustomEvent("formRemove",{
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
	let parseConfig=function(name,config,parent,path)
	{
		if(config instanceof SC.Config.Container)
		{
			let subPath=path.concat(name);
			let container=parseContainer(config,name,subPath);
			if(parent instanceof SC.Config.Container.Array || parent instanceof SC.Config.Container.Map)
			{
				let removeButton=document.createElement("button")
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
			let label=document.createElement("label");
			label.dataset.name=name;

			let span=document.createElement("span");
			span.classList.add("label");
			span.dataset.translation=span.textContent=name;
			label.appendChild(span);

			let field=FIELD(config,name,path);
			label.appendChild(field);
			label.isValid=()=>field.isValid();

			if(config.fieldFirst) label.appendChild(span);

			if(parent instanceof SC.Config.Container.Array || parent instanceof SC.Config.Container.Map)
			{
				let removeButton=document.createElement("button")
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
