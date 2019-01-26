(function(µ,SMOD,GMOD,HMOD,SC){

	let Table=GMOD("gui.Table");

	SC=SC({
		org:"Organizer",
		encase:"encase"
	});

	let OrganizedTable=Table.OrganizedTable=µ.Class(Table,{
		constructor:function(tableConfig)
		{
			this.mega(tableConfig);

			this.organizer=new SC.org();
			this.sortKey=null;
			this.sortReverse=false;
			this.filterKey=null;
			this.groupMap=new Map();
		},
		add(data)
		{
			this.mega(data);
			this.organizer.addAll(data);
		},
		clear()
		{
			this.organizer.clear();
			this.sortKey=null;
			this.sortReverse=false;
			this.filterKey=false;
			this.groupMap.clear();
			this.mega();
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
			for(let [groupKey,groupParts] of this.groupMap.entries())
			{
				for(let groupPart of groupParts)
				{
					combine.group(groupKey,groupPart);
				}
			}

			let values=combine.get();
			if(this.sortReverse) values.reverse();
			values.forEach(entry=>this.tableBody.appendChild(this.dataDomMap.get(entry)));

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
		setSort(sortKey,sortReverse=false)
		{
			if(sortKey==null)
			{
				this.sortKey=null;
				return true;
			}
			if(this.organizer.hasSort(sortKey))
			{
				this.sortKey=sortKey;
				this.sortReverse=sortReverse;
				return true;
			}
			return false;
		},
		getSort()
		{
			return this.sortKey;
		},
		getSortReverse()
		{
			return this.sortReverse;
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
		getFilter()
		{
			return this.filterKey;
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
		setGroup(groupKey,groupParts)
		{
			groupParts=SC.encase(groupParts);
			if(groupParts.length==0)
			{
				this.groupMap.delete(groupKey);
				return true;
			}
			if(this.organizer.hasGroup(groupKey)&&groupParts.every(groupPart=>this.organizer.getGroupPart(groupKey,groupPart)!=null))
			{
				this.groupMap.set(groupKey,groupParts);
				return true;
			}
			return false;
		},
		getGroups()
		{
			let rtn={};
			for(let [groupKey,groupParts] of this.groupMap.entries())
			{
				rtn[groupKey]=groupParts.slice();
			}
			return rtn;
		},
		getTable()
		{
			let tableElement=this.mega();
			tableElement.classList.add("OrganizedTable");
			return tableElement;
		}
	});

	SMOD("gui.OrganizedTable",OrganizedTable);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);