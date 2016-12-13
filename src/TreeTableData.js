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
		getRows:function(rowTagName,columnTagName,callback)
		{
			if(!rowTagName) rowTagName="tr";
			if(!columnTagName) columnTagName="td";
			return this.data.map((root,index)=>SC.Node.traverse(root,(node,parent,parentResult,entry)=>
			{
				var row=document.createElement(rowTagName);
				for( var c of this.columns)
				{
					var cell=document.createElement(columnTagName);
					c.name&&cell.classList.add(c.name);
					c.fn.call(node,cell,node);
					row.appendChild(cell);
				}
				var toggler=document.createElement("span");
				toggler.classList.add("toggler");
				row.firstElementChild.insertBefore(toggler,row.firstElementChild.firstChild);
				var indent=document.createElement("span");
				indent.classList.add("indent");
				indent.innerHTML='<span></span>'.repeat(entry.depth);
				row.firstElementChild.insertBefore(indent,row.firstElementChild.firstChild);

				row.dataset.index=parentResult&&parentResult.index?parentResult.index+"."+entry.index:index;
				row.dataset.depth=entry.depth;

				if(callback)callback.call(row,row,node,this);

				row.treeChildren=[];
				var insertHelper=document.createDocumentFragment();
				row.expand=function(state,all)
				{
					if(this.treeChildren.length>0&&(state==null||state===!this.classList.contains("expanded")))
					{
						if(row.classList.toggle("collapsed",!row.classList.toggle("expanded")))
						{
							for(var child of row.treeChildren) insertHelper.appendChild(child);
						}
						else
						{
							row.parentNode.insertBefore(insertHelper,row.nextSibling);
						}

						if(all)
						{
							for(var child of row.treeChildren) child.expand(state,true);
						}
					}
				}

				var result={};
				if(!parentResult)
				{
					result.fragment=document.createDocumentFragment();
					result.fragment.appendChild(row);
					result.index=index;
				}
				else
				{
					parentResult.addChildRow(row);
					result.index=parentResult.index+"."+entry.index;
				}

				result.addChildRow=function(childRow)
				{
					row.treeChildren.push(childRow);

					insertHelper.appendChild(childRow);

					if(row.treeChildren.length==1)
					{//first time
						row.classList.add("collapsed");
						toggler.addEventListener("click",function(event)
						{
							row.expand(null,event.ctrlKey);
							event.stopPropagation();
							event.preventDefault();
						},false);
					}
				}


				return result;
			},this.childrenKey).fragment);
		},
		getData:function(index)
		{
			if(typeof index=="string") index=index.split(".");
			return SC.Node.traverseTo(this.data[index.shift()],index,this.childrenKey);
		}
	});
	SMOD("gui.TreeTableData",TREE);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
