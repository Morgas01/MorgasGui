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
						<option value="groupHedgehog">group hedgehog</option>
						<option value="groupRabbit">group rabbit</option>
						<option value="active">active</option>
					</select>
				</label>
	 		`;
	 		let table=new µ.gui.Table.OrganizedTable(new µ.gui.TableConfig(["id","group",{name:"data",getter:d=>JSON.stringify(d.data)},"active"]));

	 		table.addSort("id+",µ.Organizer.orderBy(d=>d.id,false))
	 		.addSort("id-",µ.Organizer.orderBy(d=>d.id,true))
	 		.addSort("dataValue+",µ.Organizer.orderBy(d=>d.data.value,false))
	 		.addSort("dataValue-",µ.Organizer.orderBy(d=>d.data.value,true))

	 		.addFilter("groupHedgehog",d=>[].concat(d.group).includes("hedgehog"))
	 		.addFilter("groupRabbit",d=>[].concat(d.group).includes("rabbit"))
	 		.addFilter("active",d=>d.active);

	 		table.add(data);
	 		container.appendChild(table.getTable());
	 		container.addEventListener("change",function(event)
	 		{
	 			let select=event.target;
	 			switch(select.name)
	 			{
	 				case "sort":
	 					if(select.value==="") table.setSort(null);
	 					else table.setSort(select.value);
	 					break;
	 				case "filter":
	 					if(select.value==="") table.setFilter(null);
	 					else table.setFilter(select.value);
	 					break;
	 			}
	 			table.updateTable();
	 		});
	 	}
	 ])
})()