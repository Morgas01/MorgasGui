module("blocked",[
	function markup(container)
	{
		container.innerHTML+=String.raw
`
<div class="blocked" style="width:30em;">
	<div>
		<span style="color:#f00">R</span>
		<span style="color:#f50">a</span>
		<span style="color:#ff0">i</span>
		<span style="color:#5f0">n</span>
	</div>
	Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
</div>
<button>toggle</button>
`;
		var blocking=container.children[1];
		container.children[2].addEventListener("click",function()
		{
			container.children[1].classList.toggle("blocked");
		});
	},
	function method(container)
	{
		var blocking=µ.gui.blocked();
		blocking.innerHTML=String.raw
`
<div>
	<span style="color:#f00">R</span>
	<span style="color:#f50">a</span>
	<span style="color:#ff0">i</span>
	<span style="color:#5f0">n</span>
</div>
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
`;
		blocking.style="width:30em;";
		var button=document.createElement("button");
		button.textContent="toggle";
		button.addEventListener("click",function()
		{
			blocking.toggleBlock();
		});
		container.appendChild(blocking);
		container.appendChild(button);
	}
]);