(function(µ,SMOD,GMOD,HMOD,SC){

	var TABLE=GMOD("gui.Table");

	SC=SC({
		TreeTableConfig:"gui.TreeTableConfig",
		arrayRemove:"array.remove",
		Node:"NodePatch"
	});

	var TreeTable=µ.gui.TreeTable=µ.Class(TABLE,{
		init:function(tableConfig=new SC.TreeTableConfig())
		{
			this.mega(tableConfig);
		},
		add:function(entry,parent)
		{
			if(!parent) this.mega(entry);
			else if (this.tableElement!=null)
			{
				var row=this.tableConfig.getRow(entry);

				this.dataDomMap.set(entry,row);
				this.dataDomMap.set(row,entry);
				this.change(parent).treeChildren.push();
				if(relative.classList.contains("expanded"))
				{
					var relative=this.change(parent);
					var childrenGetter=SC.Node.normalizeChildrenGetter(this.tableConfig.childrenGetter);
					while (relative.classList.contains("expanded"))
					{
						var children=childrenGetter(this.change(relative));
						relative=this.change(children[children.length-1]);
					}
					this.tableBody.insertBefore(row,relative.nextElementSibling);
				}

				this.fire("add",{entry:entry,row:row})
			}
			else this.fire("add",{entry:entry,row:null});
		}
	});

	SMOD("gui.TreeTable",TreeTable);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);