(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		TableConfig:"gui.TableConfig",
		arrayRemove:"array.remove",
		reporter:"EventReporterPatch",
		Event:"Event"
	});

	if(!µ.gui) µ.gui={};

	let Table=µ.gui.Table=µ.Class({
		constructor:function(tableConfig=new SC.TableConfig())
		{
			this.mega();

			this.tableConfig=tableConfig;
			this.tableElement=null;
			this.tableHeader=null;
			this.tableBody=null;
			this.dataDomMap=new WeakMap();
			this.data=[];

			new SC.reporter(this,[Table.AddEvent,Table.UpdateEvent,Table.RemoveEvent]);
		},
		getTable:function()
		{
			if(this.tableElement==null)
			{
				this.tableElement=this.tableConfig.getTable(this.data,null,(row,data)=>
				{
					this.dataDomMap.set(data,row);
					this.dataDomMap.set(row,data);
				});
				if(this.tableConfig.hasHeader())
				{
					this.tableHeader=this.tableElement.firstElementChild;
					this.tableBody=this.tableHeader.nextElementSibling;
				}
				else this.tableBody=this.tableElement.firstElementChild;
			}
			return this.tableElement;
		},
		remove:function(item)
		{
			if(item==null||!this.dataDomMap.has(item)) return false;
			if(item instanceof HTMLElement)
			{
				item=this.dataDomMap.get(item);
			}
			let row=this.dataDomMap.get(item);
			row.remove();
			this.dataDomMap.delete(item);
			this.dataDomMap.delete(row);
			SC.arrayRemove(this.data,item);

			this.reportEvent(new Table.RemoveEvent(item,row));
			return true;
		},
		clear:function()
		{
			for(let entry of this.data.slice())
			{
				this.remove(entry);
			}
		},
		add:function(rowData)
		{
			if(!Array.isArray(rowData)) rowData=[rowData];
			for(let entry of rowData)
			{
				this.data.push(entry);
				let row;
				if(this.tableElement!=null)
				{
					row=this.tableConfig.getRow(entry);

					this.dataDomMap.set(entry,row);
					this.dataDomMap.set(row,entry);
					this.tableBody.appendChild(row);
				}
				this.reportEvent(new Table.AddEvent(entry,row));
			}
		},
		update:function(item)
		{
			if(item==null)//update all
			{
				for(let entry of this.data) this.update(entry);
			}
			else
			{
				if(!this.dataDomMap.has(item)) return false;
				if(item instanceof HTMLElement)
				{
					item=this.dataDomMap.get(item);
				}
				let row=this.dataDomMap.get(item);
				this.tableConfig.fillRow(item,row);

				this.reportEvent(new Table.UpdateEvent(item,row));
			}
		},
		/**
		 * exchanges entry with matching row and vice versa
		 */
		change:function(item)
		{
			return this.dataDomMap.get(item);
		},

		//*** methods for TableConfig.Select ***//

		getSelectedRows:function()
		{
			return this.data.reduce((rtn,entry)=>
			{
				let row=this.change(entry);
				if(row!=null&&row.firstElementChild.checked) rtn.push(row);
				return rtn;
			},[]);
		},
		getSelected:function()
		{
			return this.data.filter(entry=>
			{
				let row=this.change(entry);
				return row!=null&&row.firstElementChild.checked;
			});
		}
	});

	Table.AddEvent=µ.Class(SC.Event,{
		name:"tableAdd",
		constructor:function(entry,row)
		{
			this.entry=entry;
			this.row=row;
		}
	});

	Table.UpdateEvent=µ.Class(SC.Event,{
		name:"tableUpdate",
		constructor:function(entry,row)
		{
			this.entry=entry;
			this.row=row;
		}
	});

	Table.RemoveEvent=µ.Class(SC.Event,{
		name:"tableRemove",
		constructor:function(entry,row)
		{
			this.entry=entry;
			this.row=row;
		}
	});

	SMOD("gui.Table",Table);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);