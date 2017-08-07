(function(µ,SMOD,GMOD,HMOD,SC){

	var LISTERNERS=GMOD("Listeners");

	SC=SC({
		TableConfig:"gui.TableConfig",
		arrayRemove:"array.remove"
	});

	if(!µ.gui) µ.gui={};

	var Table=µ.gui.Table=µ.Class(LISTERNERS,{
		init:function(tableConfig=new SC.TableConfig())
		{
			this.mega();

			this.tableConfig=tableConfig;
			this.tableElement=null;
			this.tableHeader=null;
			this.tableBody=null;
			this.dataDomMap=new WeakMap();
			this.data=[];

			this.createListener("add update remove");
		},
		getTable:function()
		{
			if(this.tableElement==null);
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
			var row=this.dataDomMap.get(item);
			row.remove();
			this.dataDomMap.delete(item);
			this.dataDomMap.delete(row);
			SC.arrayRemove(this.data,item);
			this.fire("remove",{entry:item,row:row});
			return true;
		},
		add:function(rowData)
		{
			if(!Array.isArray(rowData)) rowData=[rowData];
			for(var entry of rowData)
			{
				this.data.push(entry);
				var row;
				if(this.tableElement!=null)
				{
					row=this.tableConfig.getRow(entry);

					this.dataDomMap.set(entry,row);
					this.dataDomMap.set(row,entry);
					this.tableBody.appendChild(row);
				}
				this.fire("add",{entry:entry,row:row});
			}
		},
		update:function(item)
		{
			if(item==null)//update all
			{
				for(var entry of this.data) this.update(entry);
			}
			else
			{
				if(!this.dataDomMap.has(item)) return false;
				if(item instanceof HTMLElement)
				{
					item=this.dataDomMap.get(item);
				}
				var row=this.dataDomMap.get(item);
				while(row.firstChild) row.firstChild.remove();
				this.tableConfig.fillRow(entry,row);
			}
		},
		/**
		 * exchanges entry with matching row and vice versa
		 */
		change:function(item)
		{
			return this.dataDomMap.get(item);
		}
	});

	SMOD("gui.Table",Table);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);