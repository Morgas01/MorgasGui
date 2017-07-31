(function(){
	var onClick=function(){alert(this.text)};
	var mapper=function(element,data)
	{
		element.textContent=data.text;
		if(data.fn) element.addEventListener("click",onClick.bind(data));
	};
	var menuData=[
		{
			text:"item 1",
			fn:true
		},
		{
			text:"item 2",
			children:[
				{
					text:"item 2-1",
					fn:true
				},
				{
					text:"item 2-2",
				},
				{
					text:"item 2-3",
					fn:true,
					children:[
						{
							text:"item 2-3-1",
							fn:true
						},
						{
							text:"item 2-3-2",
						}
					]
				},
			]
		}
	];
	module("menu",[
		function markup(container)
		{
			container.innerHTML+=String.raw
`
<ul class="menu">
	<li>item 1</li>
	<li>
		item 2
		<ul>
			<li>item 2-1</li>
			<li>item 2-2</li>
			<li>
				item 2-3
				<ul>
					<li>item 2-3-1</li>
					<li>item 2-3-2</li>
				</ul>
			</li>
			<li>
				item 2-4
				<ul>
					<li>item 2-4-1</li>
					<li>item 2-4-2</li>
				</ul>
			</li>
		</ul>
	</li>
</ul>
`;
		},
		function button_markup(container)
		{
			container.innerHTML+=String.raw
`
<button class="menu">button menu</button>
	<ul class="menu">
		<li>item 1</li>
		<li>
			item 2
			<ul>
				<li>item 2-1</li>
				<li>item 2-2</li>
				<li>
					item 2-3
					<ul>
						<li>item 2-3-1</li>
						<li> item 2-3-2</li>
					</ul>
				</li>
				<li>
					item 2-4
					<ul>
						<li>item 2-4-1</li>
						<li>item 2-4-2</li>
					</ul>
				</li>
			</ul>
		</li>
	</ul>
</div>
`;
		},
		function data(container)
		{
			container.appendChild(µ.gui.menu(menuData,mapper));
		},
		function data_Button(container)
		{
			container.appendChild(µ.gui.menu.button("button",menuData,mapper));
		},
		function splitButton_markup(container)
		{
			container.innerHTML+=String.raw
`
<button class="splitButton">button menu</button><!-- prevent white space
--><div>
	<button class="menu">&#709;</button>
         	<ul class="menu">
         		<li>item 1</li>
         		<li>
         			item 2
         			<ul>
         				<li>item 2-1</li>
         				<li>item 2-2</li>
         				<li>
         					item 2-3
         					<ul>
         						<li>item 2-3-1</li>
         						<li> item 2-3-2</li>
         					</ul>
         				</li>
         				<li>
         					item 2-4
         					<ul>
         						<li>item 2-4-1</li>
         						<li>item 2-4-2</li>
         					</ul>
         				</li>
         			</ul>
         		</li>
         	</ul>
</div>
`;
		},
		function data_splitButton(container)
		{
			container.appendChild(µ.gui.menu.splitButton(b=>b.textContent="button",menuData,mapper));
		}
	]);
})();