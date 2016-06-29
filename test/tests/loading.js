module("loading",[
	function loading_1(container)
	{
		container.appendChild(µ.gui.loading());
	},
	function loading_1_layered(container)
	{
		container.appendChild(µ.gui.loading.layered());
	},
	function loading_2(container)
	{
		container.appendChild(µ.gui.loading2());
	},
	function loading_2_layered(container)
	{
		container.appendChild(µ.gui.loading2.layered());
	}
]);