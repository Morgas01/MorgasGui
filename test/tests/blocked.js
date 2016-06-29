module("blocked",[function(container)
{
	container.innerHTML=String.raw
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
	var blocking=µ.gui.blocked(container.children[0]);
	container.children[1].addEventListener("click",function()
	{
		blocking.toggleBlock();
	});
}]);