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
			this.groupMap=new Map();
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

			let combine=this.organizer.combine(false,this.sortKey);
			if(this.filterKey!=null)
			{
				combine.filter(this.filterKey);
			}
			for(let [groupKey,groupPart] of this.groupMap.entries())
			{
				combine.group(groupKey,groupPart);
			}

			combine.get().forEach(entry=>this.tableBody.appendChild(this.dataDomMap.get(entry)));

			this.tableElement.appendChild(this.tableBody); //readd to dom

			return true;
		},
		update(item)
		{
			if(item!=null)
			{
				this.organizer.update(entry);
			}
			this.mega();
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
		},
		addGroup(key,fn)
		{
			this.organizer.group(key,fn);
			return this;
		},
		getGroupParts(groupKey)
		{
			return this.organizer.getGroupParts(groupKey);
		},
		setGroup(groupKey,groupPart)
		{
			if(groupPart==null)
			{
				this.groupMap.delete(groupKey);
				return true;
			}
			if(this.organizer.hasGroup(groupKey)&&this.organizer.getGroupPart(groupKey,groupPart)!=null)
			{
				this.groupMap.set(groupKey,groupPart);
				return true;
			}
			return false;
		}
	});

	SMOD("gui.OrganizedTable",OrganizedTable);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);