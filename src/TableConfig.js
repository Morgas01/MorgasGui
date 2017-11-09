(function(µ,SMOD,GMOD,HMOD,SC){

	//SC=SC({});

	if(!µ.gui) µ.gui={};

	/**
	 * @typedef {object} ColumnDef
	 * @param {string} (name=undefined)
	 * @param {function} fn function that sets the content of the cell
	 *
	 */

	µ.gui.TableConfig=µ.Class({
		/**
		 *
		 * @param {Array.<string|function|ColumnDef>} (columns=undefined)
		 *
		 */
		constructor:function(columns,options)
		{
			this.columns=[];
			this.options={
				tag:"table",
				header:{
					tag:"thead",
					rowTag:"tr",
					columnTag:"th"
				},
				body:{
					tag:"tbody",
					rowTag:"tr",
					columnTag:"td"
				}
			};

			if(columns) for(var c of columns) this.addColumn(c);
			if(options) this.setOptions(options);
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
						styleClass:column.replace(/ /g,"_"),
						fn:function(cell)
						{
							cell.dataset.translation=cell.textContent=this[key];
						}
					};
					break;
				case "function":
					column={name:column.name,styleClass:column.name,fn:column};
					break;
				case "object":
					var getter=column.getter;
					column={name:column.name,styleClass:column.styleClass,fn:column.fn};
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
		setOptions:function(options)
		{
			if(!options)
			{
				if(options.tag)this.options.tag=options.tag;
				if(options.header)
				{
					if(options.header.tag)this.options.header.tag=options.header.tag;
					if(options.header.rowTag)this.options.header.rowTag=options.header.rowTag;
					if(options.header.columnTag)this.options.header.columnTag=options.header.columnTag;
				}
				if(options.body)
				{
					if(options.body.tag)this.options.body.tag=options.body.tag;
					if(options.body.rowTag)this.options.body.rowTag=options.body.rowTag;
					if(options.body.columnTag)this.options.body.columnTag=options.body.columnTag;
				}
			}
			return this;
		},
		hasHeader:function()
		{
			for( var c of this.columns)
			{
				if(c.name) return true; //any column has a name
			}
			return false;
		},
		getHeader:function(callback)
		{
			var row=document.createElement(this.options.header.rowTag);
			for( var c of this.columns)
			{
				var element=document.createElement(this.options.header.columnTag);
				if(c.name)
				{
					element.dataset.translation=element.textContent=c.name;
				}
				if(c.styleClass)element.classList.add(c.styleClass);
				row.appendChild(element);
			}
			if(callback)callback.call(row,row,this);
			return row;
		},
		getRows:function(data,callback)
		{
			var rtn=[];
			for(var entry of data)
			{
				var row=this.getRow(entry);
				if(callback)callback.call(row,row,entry,this);
				rtn.push(row);
			}
			return rtn;
		},
		getRow:function(data)
		{
			var row=document.createElement(this.options.body.rowTag);
			this.fillRow(data,row);
			return row;
		},
		fillRow:function(data,row)
		{
			var cols=Array.filter(row.children,e=>e.tagName==this.options.body.columnTag.toUpperCase());
			for( var c of this.columns)
			{
				var cell=cols.shift()||document.createElement(this.options.body.columnTag);
				if(c.styleClass)cell.classList.add(c.styleClass);
				if(!cell.parentNode) row.appendChild(cell);
				c.fn.call(data,cell,data);
			}
			cols.forEach(e=>e.remove());
		},
		getTable:function(data,headerCallback,rowCallback)
		{
			var table=document.createElement(this.options.tag);
			table.classList.add("TableConfig");

			if(this.hasHeader())
			{
				var header=document.createElement(this.options.header.tag);
				var headerRow=this.getHeader(headerCallback);
				header.appendChild(headerRow);
				table.appendChild(header);
			}
			var body=document.createElement(this.options.body.tag);
			for(var r of this.getRows(data,rowCallback))body.appendChild(r);
			table.appendChild(body);
			return table;
		}
	});
	SMOD("gui.TableConfig",µ.gui.TableConfig);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
