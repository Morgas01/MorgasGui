module("form",[
	function(container)
	{
		container.appendChild(µ.gui.form({
			string:"string",
			boolean:{
				type:"boolean"
			},
			number:{
				type:"number",
				default:1
			},
			select:{
				type:"select",
				values:[2,4,8,16],
				default:4
			},
			"select multiple":{
				type:"select",
				values:["2","4","8","16"],
				default:["4","16"],
				multiple:true
			},
			range:{
				type:"number",
				default:2,
				min:0,
				step:3,
				max:9
			}
		},null,"simple"));
	},
	function(container)
	{
		var testField={
			type:"string",
			pattern:/^[A-Z]+$/,
			validate:s=>s[0]=="A"?true:"Start with A"
		};
		var form=µ.gui.form({
			test:testField,
			object:{
				nested:testField
			},
			array:{
				type:"array",
				model:testField,
				default:["AAA"]
			},
			map:{
				type:"map",
				model:testField,
				default:{
					test:"AAA"
				}
			},
			"table":{
				type:"array",
				model:{
					type:"array",
					model:{
						type:"number",
						default:1
					},
					default:[2]
				},
				default:[[3,4],[5,6]]
			},
			library:{
				type:"map",
				model:{
					type:"map",
					model:"number"
				},
				default:{
					key:{
						value:8
					}
				}
			}
		},null,"nested");
		container.appendChild(form);
		var alertEvent=function(event)
		{
			alert(event.type+"\n"+JSON.stringify(event.detail,null,"\t"));
		}
		form.addEventListener("FormChange",alertEvent);
		form.addEventListener("FormAdd",alertEvent);
	}
]);