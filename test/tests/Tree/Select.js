module("Tree.Select",[
	function data (container)
	{
		let root={
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

		let mapper=function(element,node)
		{
			element.textContent=node.name;
		};

		let check=new µ.gui.Tree.Select(root,mapper);
		let radio=new µ.gui.Tree.Select(root,mapper,{radioName:"treeSelectRadio"});
		container.appendChild(check.element);
		container.appendChild(radio.element);
	},
	function filter(container)
	{

		let input=document.createElement("INPUT");
		container.appendChild(input);
		let root={
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

		let tree=new µ.gui.Tree.Select(root,function(element,node)
		{
			element.textContent=node.name;
		},{radioName:"treeSelectFilter"});
		container.appendChild(tree.element);

		input.addEventListener("change",function()
		{
			tree.filter(node=>node.name.startsWith(input.value));
		});
	}
]);
