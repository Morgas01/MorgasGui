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
		 * @param {Array.<string|function|ColumnDef>} (columns=undefined)
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
		getHeader:function(rowTagName,columnTagName,callback)
		{
			if(!rowTagName) rowTagName="tr";
			if(!columnTagName) columnTagName="th";
			var row=document.createElement(rowTagName);
			for( var c of this.columns)
			{
				var element=document.createElement(columnTagName);
				if(c.name) element.dataset.translation=element.textContent=c.name;
				row.appendChild(element);
			}
			if(callback)callback.call(row,row,this);
			return row;
		},
		getRows:function(rowTagName,columnTagName,callback)
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
					c.name&&cell.classList.add(c.name);
					c.fn.call(data,cell,data);
					row.appendChild(cell);
				}
				if(callback)callback.call(row,row,data,this);
				rtn.push(row);
			}
			return rtn;
		},
		getTable:function(options)
		{
			options=options||{};
			options.header=options.header||{};

			if(!options.container)options.container="table";
			if(!options.headerSection)options.headerSection="thead";
			if(!options.contentSection)options.contentSection="tbody";

			var table=document.createElement(options.container);
			if(this.hasHeader())
			{
				var header=document.createElement(options.headerSection);
				var headerRow=this.getHeader(options.header.row,options.header.column,options.header.callback);
				header.appendChild(headerRow);
				table.appendChild(header);
			}
			var body=document.createElement(options.contentSection);
			for(var r of this.getRows(options.row,options.column,options.callback))body.appendChild(r);
			table.appendChild(body);
			return table;
		},
		getData:function(index)
		{
			return this.data[index];
		}
	});
	SMOD("gui.TableData",µ.gui.TableData);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
