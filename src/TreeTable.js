(function(µ,SMOD,GMOD,HMOD,SC){

	var TABLE=GMOD("gui.Table");

	SC=SC({
		TreeTableConfig:"gui.TreeTableConfig",
		arrayRemove:"array.remove",
		Node:"NodePatch"
	});

	var TreeTable=µ.gui.TreeTable=µ.Class(TABLE,{
		constructor:function(tableConfig=new SC.TreeTableConfig())
		{
			this.mega(tableConfig);
		},
		add:function(entry,parent)
		{
			if(this.tableElement==null&&!parent) this.mega(entry);
			else if (this.tableElement!=null)
			{
				var childrenGetter=SC.Node.normalizeChildrenGetter(this.tableConfig.options.childrenGetter);
				var todo=[{entry:entry,parent:parent}];
				var t;
				while(t=todo.shift())
				{
					var depth=0;
					let pRow;
					if(t.parent)
					{
						pRow=this.change(t.parent);
						depth=pRow.querySelector(".indent").children.length+1;
					}
					var row=this.tableConfig.getRow(t.entry,depth);

					this.dataDomMap.set(t.entry,row);
					this.dataDomMap.set(row,t.entry);
					if(t.parent)
					{
						pRow.treeChildren.push(row);
						pRow.classList.toggle("collapsed",!pRow.classList.contains("expanded"));
					}
					else this.tableBody.appendChild(row);
					var children=childrenGetter(t.entry);
					if(children&&children.length>0)
					{
						todo.push(...(children.map(c=>({entry:c,parent:t.entry}))));
					}
				}
				if(parent)
				{
					var parentRow=this.change(parent);
					var wasExpanded=parentRow.isExpanded();
					parentRow.expand(false);
					parentRow.expand(wasExpanded);
				}
				else
				{
					this.data.push(entry);
				}
				this.reportEvent(new TABLE.AddEvent(entry,this.change(entry)));
			}
			else this.reportEvent(new TABLE.AddEvent(entry,null));
		},
		clear:function()
		{
			this.data.length=0;
			if(this.tableBody)
			{
				while(this.tableBody.firstChild)this.tableBody.firstChild.remove();
			}
		},
		getSelectedRows:function()
		{
			var rtn=[];
			if(this.tableElement)
			{
				for(var entry of this.data)
				{
					SC.Node.traverse(this.change(entry),(row)=>
					{
						if(row.firstChild.checked) rtn.push(row);
					},{childrenGetter:"treeChildren"});
				}
			}
			return rtn;
		},
		getSelected:function()
		{
			return this.getSelectedRows().map(r=>this.change(r));
		}
	});

	SMOD("gui.TreeTable",TreeTable);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);