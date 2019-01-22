(function(µ,SMOD,GMOD,HMOD,SC){

	let Table=GMOD("gui.Table");

	SC=SC({
		TableConfig:"gui.TableConfig.Select",
		org:"Organizer",
		proxy:"proxy"
	});

	let OrganizedTable=µ.Class(Table,{
		constructor:function(tableConfig)
		{
			this.mega(tableConfig);

			this.organizer=new SC.org();
			this.sortKey=null;
			this.filterKey=null;

			SC.proxy(this.organizer,{
				"sort":"addSort",
				"filter":"addFilter"
			},this);
		},
		add(data)
		{
			this.mega(data);
			this.organizer.addAll(data);
		},
		remove(data)
		{
			this.mega();
			this.organizer.remove(data);
		}
		updateTable:function()
		{
			if(!this.tableElement) return false;

			this.tableElement.removeChild(this.tableBody); //remove from dom for performance
			while(this.tableBody.firstChild) this.tableBody.removeChild(this.tableBody.firstChild);

			let values=null;
			if(this.sortKey!=null)
			{
				if(this.filter==null) values=this.organizer.getSort(this.sortKey);
				else values=this.organizer.combine(false,this.sortKey).filter(this.filterKey).get();
			}
			else if(this.filter!=null)
			{
				values=this.organizer.getFilter(this.filterKey).getValues();
			}
			else
			{
				values=this.organizer.getValues();
			}

			values.forEach(entry=>this.tableBody.appendChild(this.dataDomMap.get(entry)));

			return true;
		},
		setSort(sortKey)
		{
			if(this.organizer.hasSort(sortKey))
			{
				this.sortKey=sortKey;
				return true;
			}
			return false;
		}
		setFilter(filterKey)
		{
			if(this.organizer.hasFilter(filterKey))
			{
				this.filterKey=filterKey;
				return true;
			}
			return false;
		};
	});

	SMOD("gui.OrganizedTable",OrganizedTable);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);