(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		tree:"gui.tree",
		goPath:"goPath",
		adopt:"adopt"
	});

	if(!µ.gui) µ.gui={};

	µ.gui.selectionTree=function(root,mapper,options)
	{
		options=SC.adopt({
			childrenGetter:null, //NodePatch.traverse default
			radioName:null,
			detacheHidden:true
		},options);
		var checkboxes=[];
		var tree= SC.tree(root,function(element,node,parent,index)
		{
			var label=document.createElement("label");
			element.appendChild(label);
			var input=document.createElement("input");
			if(options.radioName)
			{
				input.type="radio";
				input.name=options.radioName;
			}
			else input.type="checkbox";
			input.value=element.dataset.index;
			label.appendChild(input);

			checkboxes.push(input);

			var span=document.createElement("span");
			label.appendChild(span);
			mapper.call(node,span,node,parent,index);

		},options);
		tree.classList.add("selectionTree");

		tree.getSelectedItems=function()
		{
			return checkboxes.filter(e=>e.checked)
			.map(e=>e.parentNode.parentNode);
		};
		tree.getSelected=function()
		{
			return tree.getSelectedItems().map(tree.getData);
		}

		return tree;
	};

	SMOD("gui.selectionTree",µ.gui.selectionTree);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
