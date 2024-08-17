
let elementTypeMap=new WeakMap();

let casePromise=fetch(`cases/${location.search.slice(1)}.json`).then(r=>r.ok?r.json():Promise.reject(r))
let typesPromise=fetch(`types.json`).then(r=>r.ok?r.json():Promise.reject(r));
Promise.all([typesPromise,casePromise]).then(([types,cases])=>
{
	let type=types[location.search.slice(1)];
	if(!type)
	{
		console.error("no type for "+location.search.slice(1));
		return;
	}

	let testType={
		_type:"parameters",
		template:"string",
		init:{
			_type:"function",
			params:["element"]
		},
		element:type
	};
	let casesContainer=document.getElementById("cases");
	casesContainer.innerHTML=Object.keys(cases).map(c=>`<button data-case="${c}">${c}</button>`).join("");
	let parametersWrapper=document.getElementById("parameters");

	casesContainer.addEventListener("click",e=>
	{
		let caseName=e.target.dataset.case;
		if(caseName in cases)
		{
			let caseJson=cases[caseName];
			updateFixture(caseJson);
			parametersWrapper.replaceChildren(buildTypeInputs(testType,"",caseJson));
		}
	});

	let paramForm=buildTypeInputs(testType);
	parametersWrapper.appendChild(paramForm);
	let formActionListener=function (event)
	{
		if(event.type==="click"&&event.target.tagName!=="BUTTON") return;

		let target=event.target;
		let dataset=target.dataset;
		switch (dataset.action)
		{
			case "updateMultiType":
			{
				let container=target.nextElementSibling;
				container.replaceChildren();
				let childType=target.value;
				if(childType)
				{
					let childEl=buildTypeInputs(childType, dataset.path);
					container.appendChild(childEl);
				}
				break;
			}
			case "toggleOptional":
			{
				let container=target.parentNode.parentNode.lastElementChild;
				container.replaceChildren();
				if(target.checked)
				{
					let typeDescriptor=elementTypeMap.get(target.closest("details"));
					let childType=typeDescriptor[dataset.key];
					let childEl=buildTypeInputs(childType, dataset.path);
					container.appendChild(childEl);
				}
				break;
			}
			case "addObjectEntry":
			{
				let table=target.previousElementSibling;
				let typeDescriptor=elementTypeMap.get(target.closest("details"));
				let childType=typeDescriptor._valueType;
				let row=getObjectMapEntry(childType, dataset.path);
				table.appendChild(row);

				break;
			}
			case "removeObjectEntry":
			{
				target.closest("tr").remove();
				break;
			}
			case "addArrayEntry":
			{
				let container=target.previousElementSibling;
				let typeDescriptor=elementTypeMap.get(target.closest("details"));
				let childType=typeDescriptor._valueType;
				let entryEl=getArrayEntry(childType, dataset.path);
				container.appendChild(entryEl);
				break;
			}
		}
	};
	parametersWrapper.addEventListener("change",formActionListener);
	parametersWrapper.addEventListener("click",formActionListener);


	document.getElementById("apply").addEventListener("click",applyParameters);

},e=>{console.error(e);alert(e.message)});

let updateFixture=function(caseJson)
{
	document.getElementById("fixture").src=`fixture.html?${encodeURIComponent(JSON.stringify(caseJson))}`;
};
let applyParameters=function()
{

}

let getDetailsWrapper=function(name,typeDescriptor)
{
	let details=document.createElement("DETAILS");
	details.open=true;
	let summary=document.createElement("SUMMARY");
	summary.innerText=name;
	details.appendChild(summary);
	elementTypeMap.set(details,typeDescriptor);

	return details;
};
let collection=0;
let getObjectMapEntry=function(type,path,key,value)
{
	let row=document.createElement("TR");

	let keyCol=document.createElement("TD");
	let keyInput=document.createElement("INPUT");
	keyInput.type="text";
	if(key) keyInput.value=key;
	keyCol.appendChild(keyInput);
	row.appendChild(keyCol);

	let container=document.createElement("TD");
	row.appendChild(container);

	let removeCol=document.createElement("TD");
	row.appendChild(removeCol);

	let removeBtn=document.createElement("BUTTON");
	removeBtn.innerText="🗑";
	removeBtn.dataset.action="removeObjectEntry";
	removeCol.appendChild(removeBtn);

	let childEl=buildTypeInputs(type, path+".{}",value);
	container.appendChild(childEl);

	return row;
};
let getArrayEntry=function(type,path,value)
{
	console.error("TODO");
	debugger;
	let entryEl=document.createElement("DIV");
	return entryEl;
}
let getValueType=function(value)
{
	switch (typeof value)
	{
		case "string":
			return "string";
		case "number":
			return "string";
		case "boolean":
			return "boolean";
		case "object":
			if(value===null) return "undefined";
			if("_type" in value) return value._type;
			if(Array.isArray(value)) return "array";
			return "object";
		default:
		case "undefined":
			return "undefined";
	}
}
let buildTypeInputs=function(typeDescriptor,path="",value)
{
	let type;
	if(typeof typeDescriptor==="string")
	{
		type=typeDescriptor;
		//TODO typeDescriptor=type from types.json
	}
	else if (Array.isArray(typeDescriptor))
	{
		debugger;//multitype?
		type="array"
	}
	else
	{
		type=typeDescriptor._type;
	}

	switch (type)
	{
		case "string":
		{
			let el=document.createElement("INPUT");
			el.dataset.path=path;
			el.type="text";
			if(typeof value==="object") el.value=value._value;
			else if(value) el.value=value;
			return el;
		}
		case "number":
		{
			let el=document.createElement("INPUT");
			el.type="number";
			el.dataset.path=path;
			if(typeof value==="object") el.value=value._value;
			else if(value) el.value=value;
			return el;
		}
		case "boolean":
		{
			let el=document.createElement("INPUT");
			el.type="checkbox";
			el.dataset.path=path;
			if(typeof value==="object") el.value=value._value;
			else if(value) el.checked=!!value;
			return el;
		}
		case "json":
		{
			let el=document.createElement("TEXTAREA");
			el.dataset.path=path;
			if(value)
			{
				if ("_value" in value) el.value=JSON.stringify(value._value);
				else el.value=JSON.stringify(value);
			}
			return el;
		}
		break;
		case "HTMLElement":
		{
			let el=document.createElement("INPUT");
			el.type="text";
			el.list="htmlElementList";
			//TODO datalist
			if(value) el.value=value;
			return el;
		}
		break;
		case "multiType":
		{
			let wrapper=document.createElement("DIV");

			let typeInput=document.createElement("INPUT");
			typeInput.type="hidden";
			wrapper.appendChild(typeInput);

			let el=document.createElement("SELECT");
			wrapper.appendChild(el);
			el.innerHTML="<option selected value=''></option>\n"+typeDescriptor._types.map(v=>`<option value="${v}">${v}</option>`).join("\n");
			el.dataset.action="updateMultiType";
			el.dataset.path=path+"._type";

			let valueContainer=document.createElement("div");
			wrapper.appendChild(valueContainer);

			if(value)
			{
				let valueType=getValueType(value);
				if(el.querySelector(`[value="${valueType}"]`))
				{
					el.value=valueType;
					let childEl=buildTypeInputs(valueType, path+"._value", value);
					valueContainer.appendChild(childEl);
				}
			}

			return wrapper;
		}
		case "object":
		case "parameters":
		{
			let details=getDetailsWrapper(type,typeDescriptor);
			let table=document.createElement("TABLE");
			details.appendChild(table);

			for(let key in typeDescriptor)
			{
				if(key.startsWith("_"))
				{
					continue;
				}
				let childDescriptor=typeDescriptor[key];
				let childPath=path+(path?".":"")+key;

				let row=document.createElement("TR");
				row.dataset.key=key;
				table.appendChild(row);

				let optionalCol=document.createElement("TD");
				let optional=childDescriptor._optional;
				if(optional)
				{
					let optionalInput=document.createElement("INPUT");
					optionalInput.type="checkbox";
					optionalInput.dataset.action="toggleOptional";
					optionalInput.dataset.key=key;
					optionalInput.dataset.path=childPath;
					if(value?.[key]) optionalInput.checked=true;
					optionalCol.appendChild(optionalInput);
				}

				row.appendChild(optionalCol);
				let nameCol=document.createElement("TD");
				nameCol.innerText=key;

				row.appendChild(nameCol);
				let valueCol=document.createElement("TD");
				if(!optional||value?.[key])
				{
					let childEl=buildTypeInputs(childDescriptor, childPath,value?.[key]);
					valueCol.appendChild(childEl);
				}
				row.appendChild(valueCol);
			}

			return details;
		}
		break;
		case "objectMap":
		{
			let details=getDetailsWrapper(type,typeDescriptor);
			let table=document.createElement("TABLE");
			table.innerHTML=`<tr><th>key</th><th>value</th><th></th></tr>`;
			details.appendChild(table);

			let addBtn=document.createElement("button");
			addBtn.innerText="✚";
			addBtn.dataset.action="addObjectEntry";
			addBtn.dataset.path=path;
			details.appendChild(addBtn);

			if(value)
			{
				for(let key in value)
				{
					let entryEl=getObjectMapEntry(typeDescriptor._valueType,path,key,value[key]);
					table.appendChild(entryEl);
				}
			}

			return details;
		}
		break;
		case "array":
		{
			let details=getDetailsWrapper(type,typeDescriptor);
			let container=document.createElement("DIV");
			details.appendChild(container);

			let addBtn=document.createElement("button");
			addBtn.innerText="✚";
			addBtn.dataset.action="addArrayEntry";
			details.appendChild(addBtn);

			if(value)
			{
				for(let entry of value)
				{
					let entryEl=getArrayEntry(typeDescriptor._valueType,path,entry);
					container.appendChild(entryEl);
				}
			}

			return details;
		}
		break;
		case "function":
		{
			let details=getDetailsWrapper(typeDescriptor.name??type,typeDescriptor);

			let typeInput=document.createElement("INPUT");
			typeInput.type="hidden";
			typeInput.value="function";
			typeInput.dataset.path=path+"._type";
			details.appendChild(typeInput);

			let functionContainer=document.createElement("DIV");
			functionContainer.classList.add("functionContainer");
			details.appendChild(functionContainer);

			let paramsContainer=document.createElement("DIV");
			functionContainer.appendChild(paramsContainer);
			for (let i=0; i<(typeDescriptor.params||[]).length; i++){
				let param=(typeDescriptor.params||[])[i];
				let paramInput=document.createElement("INPUT");
				paramInput.type="text";
				paramInput.dataset.path=path+`.params[${i}]`;
				paramInput.value=paramInput.placeholder=param;
				if(value)
				{
					paramInput.value=value.params[i];
				}
				paramsContainer.appendChild(paramInput);
			}
			let bodyInput=document.createElement("TEXTAREA");
			bodyInput.dataset.path=path+".body";
			if(value)
			{
				bodyInput.value=value.body;
			}
			functionContainer.appendChild(bodyInput);

			return details;
		}
		break;
		case "class":
		{
			let classType=typeDescriptor._module??type;
			let details=getDetailsWrapper(classType,typeDescriptor);

			let typeInput=document.createElement("INPUT");
			typeInput.type="hidden";
			typeInput.value=classType;
			typeInput.dataset.path=path+"._type";
			details.appendChild(typeInput);

			let classContainer=document.createElement("DIV");
			classContainer.classList.add("classContainer");
			details.appendChild(classContainer);

			let paramsContainer=document.createElement("DIV");
			details.appendChild(paramsContainer);
			for (let i=0; i<typeDescriptor.params.length; i++)
			{
				let paramDescriptor=typeDescriptor.params[i];
				let paramElement=buildTypeInputs(paramDescriptor,path+".params["+i+"]",value?.params[i]);
				paramsContainer.appendChild(paramElement);
			}

			return details;
		}
		break;
		default:
		{
			debugger;
		}
		break;
	}
};