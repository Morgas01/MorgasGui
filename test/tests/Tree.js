module("Tree",[
	function markup(container)
	{
		container.innerHTML+=String.raw
`
<ul>
	<li>
		root
		<ul>
			<li>child1</li>
			<li>
				child2
				<ul>
					<li>grandchild</li>
				</ul>
			</li>
		</ul>
	</li>
</ul>
`;
		µ.gui.Tree.decorateHTML(container.lastElementChild);
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

		var tree=new µ.gui.Tree(root,function(element,node)
		{
			element.textContent=node.name;
		});
		container.appendChild(tree.element);
	},
	function filter(container)
	{

		let input=document.createElement("INPUT");
		container.appendChild(input);
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

		var tree=new µ.gui.Tree(root,function(element,node)
		{
			element.textContent=node.name;
		});
		container.appendChild(tree.element);

		input.addEventListener("change",function()
		{
			tree.filter(node=>node.name.startsWith(input.value));
		});
	}
]);
