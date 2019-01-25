(function(){
	let data=[
		{
			id:0,
			group:"rabbit",
			data:{value:31},
			active:false
		},
		{
			id:1,
			group:"rabbit",
			data:{value:47},
			active:true
		},
		{
			id:2,
			group:"hedgehog",
			data:{value:11},
			active:false
		},
		{
			id:3,
			group:"hedgehog",
			data:{value:19},
			active:true
		},
		{
			id:4,
			group:["hedgehog","rabbit"],
			data:{value:3},
			active:true
		}
	 ];
	 module("Table/OrganizedTable",[
	 	function(container)
	 	{
	 		container.innerHTML=`
	 			<label>
	 				<span>sort:</span>
					<select name="sort">
						<option value="">none</option>
						<option value="id+">id ASC</option>
						<option value="id-">id DESC</option>
						<option value="dataValue+">data value ASC</option>
						<option value="dataValue-">data value DESC</option>
					</select>
				</label>
	 			<label>
	 				<span>filter:</span>
					<select name="filter">
						<option value="">none</option>
						<option value="active">active</option>
					</select>
				</label>
	 			<label>
	 				<span>group:</span>
					<select name="group">
						<option value="">none</option>
					</select>
				</label>
	 		`;
	 		let table=new µ.gui.Table.OrganizedTable(new µ.gui.TableConfig(["id","group",{name:"data",getter:d=>JSON.stringify(d.data)},"active"]));

	 		table.addSort("id+",µ.Organizer.orderBy(d=>d.id,false))
	 		.addSort("id-",µ.Organizer.orderBy(d=>d.id,true))
	 		.addSort("dataValue+",µ.Organizer.orderBy(d=>d.data.value,false))
	 		.addSort("dataValue-",µ.Organizer.orderBy(d=>d.data.value,true))

	 		.addFilter("active",d=>d.active)

	 		.addGroup("animalGroup",d=>d.group);


			table.add(data);

	 		let groupSelect=container.querySelector("[name='group']");
	 		for(let groupPartName of table.getGroupParts("animalGroup"))
			{
				let option=document.createElement("OPTION");
				option.textContent=option.value=groupPartName;
				groupSelect.appendChild(option);
			}

	 		container.appendChild(table.getTable());
	 		container.addEventListener("change",function(event)
	 		{
	 			let select=event.target;
	 			let value=select.value;
	 			if(value=="") value=null;
	 			switch(select.name)
	 			{
	 				case "sort":
	 					table.setSort(value);
	 					break;
	 				case "filter":
	 					table.setFilter(value);
	 					break;
	 				case "group":
	 					table.setGroup("animalGroup",value);
	 					break;
	 			}
	 			table.updateTable();
	 		});
	 	}
	 ])
})()