(function(µ,SMOD,GMOD,HMOD,SC){

	//SC=SC({});

	if(!µ.gui) µ.gui={};

	/**
	 * @typedef {object} ColumnDef
	 * @param {string} (name=undefined)
	 * @param {function} fn function that sets the content of the cell
	 *
	 */

	µ.gui.TableData=µ.Class({
		/**
		 *
		 * @param {any[]} data
		 * @param {string[]|function[]|ColumnDef[]} (columns=undefined)
		 *
		 */
		init:function(data,columns)
		{
			this.data=data;
			this.columns=[];
			if(columns) for(var c of columns) this.addColumn(c);
		},
		/**
		 *
		 * @param {string|function|ColumnDef} (columns=undefined)
		 *
		 */
		addColumn:function(column)
		{
			switch (typeof column)
			{
				case "string":
					var key=column;
					column={
						name:column,
						fn:function(cell)
						{
							cell.dataset.translation=cell.textContent=this[key];
						}
					};
					break;
				case "function":
					column={name:column.name,fn:column};
					break;
				case "object":
					var getter=column.getter;
					column={name:column.name,fn:column.fn};
					if(!column.fn&&getter) column.fn=function(cell,data)
					{
						cell.dataset.translation=cell.textContent=getter(data);
					}
					break;
				default:
					return false;
			}
			this.columns.push(column);
			return true;
		},

		hasHeader:function()
		{
			for( var c of this.columns)
			{
				if(c.name) return true; //any column has a name
			}
			return false;
		},
		getHeaders:function(tagName)
		{
			if(!tagName) tagName="th";
			var rtn=[];
			for( var c of this.columns)
			{
				var element=document.createElement(tagName);
				if(c.name) element.dataset.translation=element.textContent=c.name;
				rtn.push(element);
			}
			return rtn;
		},
		getRows:function(rowTagName,columnTagName)
		{
			if(!rowTagName) rowTagName="tr";
			if(!columnTagName) columnTagName="td";
			var rtn=[];
			for(var i=0;i<this.data.length;i++)
			{
				var data=this.data[i];
				var row=document.createElement(rowTagName);
				row.dataset.index=i;
				for( var c of this.columns)
				{
					var cell=document.createElement(columnTagName);
					c.fn.call(data,cell,data);
					row.appendChild(cell);
				}
				rtn.push(row);
			}
			return rtn;
		},
		getTable:function()
		{
			var table=document.createElement("table");
			if(this.hasHeader())
			{
				var header=document.createElement("thead");
				var headerRow=document.createElement("tr");
				for(var h of this.getHeaders())headerRow.appendChild(h);
				header.appendChild(headerRow);
				table.appendChild(header);
			}
			var body=document.createElement("tbody")
			for(var r of this.getRows())body.appendChild(r);
			table.appendChild(body);
			return table;
		}
	});
	SMOD("gui.TableData",µ.gui.TableData);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
