(function(µ,SMOD,GMOD,HMOD,SC){

	var TableData=GMOD("gui.TableData")

	SC=SC({
		Node:"NodePatch"
	});



	/**
	 * @typedef {object} ColumnDef
	 * @param {string} (name=undefined)
	 * @param {function} fn function that sets the content of the cell
	 *
	 */

	var TREE=µ.gui.TreeTableData=µ.Class(TableData,{
		/**
		 *
		 * @param {any[]} data
		 * @param {Array.<string|function|ColumnDef>} (columns=undefined)
		 * @param {String} (childrenKey=undefined)
		 *
		 */
		init:function(data,columns,childrenKey)
		{
			this.mega(data,columns);
			this.childrenKey=childrenKey;
		},
		getRows:function(rowTagName,columnTagName)
		{
			if(!rowTagName) rowTagName="tr";
			if(!columnTagName) columnTagName="td";
			return this.data.map(root=>SC.Node.traverse(root,(node,parent,rtn,entry)=>
			{
				rtn=rtn||document.createDocumentFragment();
				var row=document.createElement(rowTagName);
				for( var c of this.columns)
				{
					var cell=document.createElement(columnTagName);
					c.name&&cell.classList.add(c.name);
					c.fn.call(node,cell,node);
					row.appendChild(cell);
				}
				var indent=document.createElement("span");
				indent.classList.add("indent");
				indent.innerHTML='<span></span>'.repeat(entry.depth);
				row.firstElementChild.insertBefore(indent,row.firstElementChild.firstChild);
				rtn.appendChild(row);
				return rtn;
			},this.childrenKey));
		}
	});
	SMOD("gui.TreeTableData",TREE);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
