(function(µ,SMOD,GMOD,HMOD,SC){

	var TableConfig=GMOD("gui.TableConfig")

	SC=SC({
		Node:"NodePatch"
	});

	var TREE=µ.gui.TreeTableConfig=µ.Class(TableConfig,{

		//init see {@link TableConfig}

		this.setOptions:function(options)
		{
			this.mega(options);
			if(options&&"childrenGetter" in options) this.options.childrenGetter=options.childrenGetter;
			return this;
		},
		getHeader:function(callback)
		{
			var row=this.mega();
			var indent=document.createElement(this.options.header.columnTag);
			row.insertBefore(indent,row.firstChild);
			var toggleCol=document.createElement(this.options.header.columnTag);
			row.insertBefore(toggleCol,row.firstChild);

			if(callback)callback.call(row,row,this);
			return row;
		}
		getRows:function(data,callback)
		{
			return data.map(root=>SC.Node.traverse(root,(node,parent,parentResult,entry)=>
			{
				var row=document.createElement(this.options.body.rowTag);

				var toggleCell=document.createElement(this.options.body.columnTag);
				var toggler=document.createElement("span");
				toggler.classList.add("toggler");
				toggleCell.appendChild(toggler);
				row.appendChild(toggleCell);

				var indentCell=document.createElement(this.options.body.columnTag);
				var indent=document.createElement("span");
				indent.classList.add("indent");
				indent.innerHTML='<span></span>'.repeat(depth);
				indentCell.appendChild(indent);
				row.appendChild(indentCell);

				this.fillRow(data,row,entry.depth);

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
				};

				var result={};
				if(!parentResult)
				{
					result.fragment=document.createDocumentFragment();
					result.fragment.appendChild(row);
				}
				else
				{
					parentResult.addChildRow(row);
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
				};

				return result;
			},this.options.childrenGetter).fragment);
		},
		getTable:function(data,headerCallback,rowCallback)
		{
			var table=this.mega(data,headerCallback,rowCallback);
			table.classList.add("tree");
			return table;
		}
	});
	SMOD("gui.TreeTableConfig",TREE);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
