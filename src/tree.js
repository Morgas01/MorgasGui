(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		Node:"NodePatch"
	});

	if(!µ.gui) µ.gui={};

	µ.gui.tree=function(root,mapper,childrenKey)
	{
		var tree=document.createElement("ul");
		var rootResult=SC.Node.traverse(root,function(node,parent,parentDOM,entry)
		{
			var li=document.createElement("li");
			if(parent)
			{
				if(parent!=root)li.dataset.index=parentDOM.li.dataset.index+"."+entry.index;
				else li.dataset.index=entry.index;
				if(!parentDOM.ul)
				{
					parentDOM.ul=document.createElement("ul");
					parentDOM.li.appendChild(parentDOM.ul);
				}
				parentDOM.ul.appendChild(li);
			}
			mapper.call(node,li,node,parent,entry.index);
			return {ul:null,li:li};
		},childrenKey);

		tree.classList.add("tree");
		tree.appendChild(rootResult.li);
		tree.addEventListener("click",µ.gui.tree.toggleNode,false);
		return tree;
	}

	µ.gui.tree.toggleNode=function(event)
	{
		if(event.target.tagName==="UL")
		{
			event.target.classList.toggle("expanded");
		}
	}

	SMOD("gui.tree",µ.gui.tree);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
