(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		tree:"gui.tree",
		goPath:"goPath"
	});

	if(!µ.gui) µ.gui={};

	µ.gui.selectionTree=function(root,mapper,childrenKey)
	{
		var dataToDom=new Map();
		var domToData=new Map();
		var tree= SC.tree(root,function(element,node,parent,index)
		{
			dataToDom.set(node,element);
			domToData.set(element,node);

			var label=document.createElement("label");
			element.appendChild(label);
			var input=document.createElement("input");
			input.type="checkbox";
			input.value=element.dataset.index;
			label.appendChild(input);

			var span=document.createElement("span");
			label.appendChild(span);
			mapper.call(node,span,node,parent,index);
		},childrenKey);
		tree.classList.add("selectionTree");

		tree.getSelectedItems=function()
		{
			return Array.from(tree.querySelectorAll("ul>input:checked"))
			.map(e=>domToData.get(e.parentNode.parentNode));
		}

		return tree;
	};

	SMOD("gui.selectionTree",µ.gui.selectionTree);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
