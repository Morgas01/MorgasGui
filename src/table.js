(function(µ,SMOD,GMOD,HMOD,SC){

	var LISTERNERS=GMOD("Listeners");

	SC=SC({
		TableConfig:"gui.TableConfig",
		arrayRemove:"array.remove"
	});

	var Table=µ.Class(LISTERNERS,{
		init:function(TableConfig=new SC.TableConfig())
		{
			this.mega();

			this.tableConfig=TableConfig;
			this.tableElement=null;
			this.dataDomMap=new WeakMap();
			this.data=[];

			this.createListener("add update remove");
		},
		getTable:function(headerCallback,rowCallback)
		{
			if(this.tableElement==null);
			{
				this.tableElement=this.tableConfig.getTable(this.data,headerCallback,(row,data)=>
				{
					this.dataDomMap.set(data,row);
					this.dataDomMap.set(row,data);
					if(rowCallback) rowCallback.call(row,row,data,this.tableConfig);
				});
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

			var row=this.connections.get(item);
			row.remove();
			this.dataDomMap.delete(item);
			this.dataDomMap.delete(row);
			this.fire("remove",{entry:item,row:row});
			return true;
		},
		add:function(rowData)
		{
			if(!Array.isArray(rowData)) rowData=[rowData];
			for(var entry of rowData)
			{
				this.data.push(entry);
				if(this.tableElement!=null)
				{
					this.tableConfig.getRow((data,row)=>
					{
						this.dataDomMap.set(data,row);
						this.dataDomMap.set(row,data);
						if(this.tableConfig.options.callback) this.tableConfig.options.callback.call(row,row,data,this.tableConfig);
						this.tableBody.appendChild(row);
					});
				}
			}
		},
		update:function(entry,callback)
		{
			if(entry==null)//update all
			{
				for(var entry of this.data) this.update(entry,callback);
			}
			else
			{
				if(!this.dataDomMap.has(item)) return false;
				if(item instanceof HTMLElement)
				{
					item=this.dataDomMap.get(item);
				}
				var row=this.dataDomMap.get(entry);
				while(row.firstChild) row.firstChild.remove();
				this.tableConfig.fillRow(entry,row);
				if(callback) callback.call(row,row,entry,this.tableConfig);
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