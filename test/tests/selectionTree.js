module("selectionTree",[
	function markup(container)
	{
		container.innerHTML+=String.raw
`
todo
`;
		//container.querySelector(".tree").addEventListener("click",µ.gui.tree.toggleNode,false);
	},
	function fromData (container)
	{
		var root={
			name:"root",
			children:[
				{
					name:"child1"
					//no children
				},
				{
					name:"child2",
					children:[
						{
							name:"grandchild",
							children:[] //empty children
						}
					]
				}
			]
		};
		var tree=µ.gui.selectionTree(root,function(element,node)
		{
			element.textContent=node.name;
		});
		container.appendChild(tree);
	}
]);
