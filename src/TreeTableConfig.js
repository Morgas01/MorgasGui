(function(µ,SMOD,GMOD,HMOD,SC){

	var TableConfig=GMOD("gui.TableConfig")

	SC=SC({
		Node:"NodePatch"
	});

	var TREE=µ.gui.TreeTableConfig=µ.Class(TableConfig,{

		//init see {@link TableConfig}

		setOptions:function(options)
		{
			this.mega(options);
			if(options&&"childrenGetter" in options) this.options.childrenGetter=options.childrenGetter;
			return this;
		},
		getRows:function(data,callback)
		{
			return data.map(root=>SC.Node.traverse(root,(node,parent,parentResult,entry)=>
			{
				var row=this.getRow(node,entry.depth);

				if(callback)callback.call(row,row,node,this);

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

					if(row.treeChildren.length==1)
					{//first time
						row.classList.add("collapsed");
					}
				};

				return result;
			},this.options.childrenGetter).fragment);
		},
		getRow:function(data,depth=0)
		{
			var row=document.createElement(this.options.body.rowTag);

			this.fillRow(data,row);

			var firstCell=row.firstElementChild;
			var firstCellChild=firstCell.firstChild;

			var indent=document.createElement("span");
			indent.classList.add("indent");
			indent.innerHTML='<span></span>'.repeat(depth);
			firstCell.insertBefore(indent,firstCellChild);

			var toggler=document.createElement("span");
			toggler.classList.add("toggler");
			firstCell.insertBefore(toggler,firstCellChild);

			toggler.addEventListener("click",function(event)
			{
				row.expand(null,event.ctrlKey);
				event.stopPropagation();
				event.preventDefault();
			},false);

			row.treeChildren=[];

			var insertHelper=document.createDocumentFragment();
			row.expand=function(state,all)
			{
				if(this.treeChildren.length>0&&(state==null||state===!this.classList.contains("expanded")))
				{
					if(row.classList.toggle("collapsed",!row.classList.toggle("expanded")))
					{
						for(var child of row.treeChildren) child.remove();
					}
					else
					{
						for(var child of row.treeChildren) insertHelper.appendChild(child);
						row.parentNode.insertBefore(insertHelper,row.nextSibling);
					}

					if(all)
					{
						for(var child of row.treeChildren) child.expand(state,true);
					}
				}
			};

			return row;
		},
		getTable:function(data,headerCallback,rowCallback)
		{
			var table=this.mega(data,headerCallback,rowCallback);
			table.classList.add("Tree");
			return table;
		}
	});
	SMOD("gui.TreeTableConfig",TREE);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
