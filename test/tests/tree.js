module("tree",[
	function markup(container)
	{
		container.innerHTML+=String.raw
`
<ul class="tree">
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
		µ.gui.tree(container.querySelector(".tree"));
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
		var tree=µ.gui.tree(root,function(element,node)
		{
			element.textContent=node.name;
		});
		container.appendChild(tree);
	}
]);
