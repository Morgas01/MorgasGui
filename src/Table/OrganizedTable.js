(function(µ,SMOD,GMOD,HMOD,SC){

	let Table=GMOD("gui.Table");

	SC=SC({
		org:"Organizer"
	});

	let OrganizedTable=Table.OrganizedTable=µ.Class(Table,{
		constructor:function(tableConfig)
		{
			this.mega(tableConfig);

			this.organizer=new SC.org();
			this.sortKey=null;
			this.filterKey=null;
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
		},
		updateTable:function()
		{
			if(!this.tableElement) return false;

			this.tableElement.removeChild(this.tableBody); //remove from dom for performance
			while(this.tableBody.firstChild) this.tableBody.removeChild(this.tableBody.firstChild);

			let values=null;
			if(this.sortKey!=null)
			{
				if(this.filterKey==null) values=this.organizer.getSort(this.sortKey);
				else values=this.organizer.combine(false,this.sortKey).filter(this.filterKey).get();
			}
			else if(this.filterKey!=null)
			{
				values=this.organizer.getFilter(this.filterKey).getValues();
			}
			else
			{
				values=this.organizer.getValues();
			}

			values.forEach(entry=>this.tableBody.appendChild(this.dataDomMap.get(entry)));

			this.tableElement.appendChild(this.tableBody); //readd to dom

			return true;
		},
		addSort(key,fn)
		{
			this.organizer.sort(key,fn);
			return this;
		},
		setSort(sortKey)
		{
			if(sortKey==null)
			{
				this.sortKey=null;
				return true;
			}
			if(this.organizer.hasSort(sortKey))
			{
				this.sortKey=sortKey;
				return true;
			}
			return false;
		},
		addFilter(key,fn)
		{
			this.organizer.filter(key,fn);
			return this;
		},
		setFilter(filterKey)
		{
			if(filterKey==null)
			{
				this.filterKey=null;
				return true;
			}
			if(this.organizer.hasFilter(filterKey))
			{
				this.filterKey=filterKey;
				return true;
			}
			return false;
		}
	});

	SMOD("gui.OrganizedTable",OrganizedTable);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);