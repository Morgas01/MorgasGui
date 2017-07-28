(function(µ,SMOD,GMOD,HMOD,SC){

	var LISTERNERS=GMOD("Listeners");

	SC=SC({
		TableData:"tableData",
		arrayRemove:"array.remove"
	});

	var Table=µ.Class(LISTERNERS,{
		init:function(tableData=new SC.TableData())
		{
			this.mega();

			this.tableData=tableData;
			this.tableElement=null;
			this.connections=new WeakMap();

			this.createListener("add update remove");
		},
		setTableDataOptions:function()
		{
			this.tableData.setOptions(options);
		},
		getTable:function()
		{
			if(this.tableElement==null);
			{
				var overrideOptions=Object.create(this.tableData.options);
				overrideOptions.callback=(row,data)=>
				{
					this.connections.set(row,data);
					this.connections.set(data,row);
					if(options.callback) options.callback(row,row,data,this.tableData);
				}
				this.tableElement=this.tableData.getTable(overrideOptions);
			}
			return this.tableElement;
		},
		remove:function(item)
		{
			if(item instanceof HTMLElement)
			{
				item=this.connections.get(item);
			}
			if(item==null||this.connections.has(item)) return false;

			arrayRemove(this.tableData.data,item);
			var element=this.connections.get(item);
			this.connections.delete(element);
			this.connections.delete(item);
			this.fire("remove",{data:item,element:element});
			return true;
		},
		add:function(rowData)
		{
			if(!Array.isArray(rowData)) rowData=[rowData];
			for(var data in rowData)
			{
				this.tableData.getRow(this.tableDataOptions.row,this.tableDataOptions.column,data,row=>
				{
					this.connections.set(row,data);
					this.connections.set(data,row);
					if(options.callback) options.callback.call(row,row,data,this.tableData);
					this.tableBody.appendChild(row);
				});
			}
		},
		update:function(item,callback)
		{
			if(item)
			{
				if(this.connections.has(item))
				{
					var row,data;
					if(item instanceof HTMLElement)
					{
						row=item;
						data=this.connections.get(item);
					}
					else
					{
						row=this.connections.get(item);
						data=item;
					}
					while(row.firstChild) row.firstChild.remove();
					this.tableData.fillRow(data,row);
					if(callback) callback.call(row,row,data,this.tableData);
				}
			}
			else //update all
			{
				for(var data of )
			}
		}
	})

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);