(function(){
	var onClick=function(){alert(this.dataset.translation)};
	var menuData={
		"item 1":onClick,
		"item 2":{
			"item 2-1":onClick,
			"item 2-2":onClick,
			"item 2-3":(function()
			{
				var item23=function(){alert(this.dataset.translation)};
				item23["item 2-3-1"]=onClick;
				item23["item 2-3-2"]=onClick;
				return item23;
			})(),
			"item 2-4":(function()
			{
				var item24=function(){alert(this.dataset.translation)};
				item24["item 2-4-1"]=onClick;
				item24["item 2-4-2"]=onClick;
				return item24;
			})()
		}
	};
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
			container.appendChild(µ.gui.menu(menuData));
		},
		function data_Button(container)
		{
			container.appendChild(µ.gui.menu.button("button",menuData));
		}
	]);
})();