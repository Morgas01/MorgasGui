window.showcases=[
	{
		name:"default",
		description:`
blocks a container to prevent interactions with it.
<code>µ.gui.blocked(container);</code>
`,
		fn:function(stage)
		{
			stage.innerHTML=`
			<div style="width:30em">
				<div>
					<span style="color:#FF0000">R</span>
					<span style="color:#FF7F00">a</span>
					<span style="color:#FFFF00">i</span>
					<span style="color:#00FF00">n</span>
					<span style="color:#0000FF">b</span>
					<span style="color:#4B0082">o</span>
					<span style="color:#8B00FF">w</span>
				</div>
				<button>toggle</button>
				<div>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</div>
			</div>
			<button>toggle</button>
			`;
			let div=stage.children[0];
			µ.gui.blocked(div);
			for(let button of stage.querySelectorAll("button"))
			{
				button.addEventListener("click",div.toggleBlock);
			}
		}
	}
]