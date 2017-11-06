module("InputHistory",[
	function simple(container)
	{
		let input=document.createElement("input");
		input.type="text";
		container.appendChild(input);

		let inputHistory=new µ.gui.InputHistory();
		inputHistory.register(input);

		input.addEventListener("keydown",function(e)
		{
			if(e.key=="Enter")
			{
				inputHistory.add(e.target.value);
				e.target.value="";
			}
		});
	},
	function prefilled(container)
	{
		let input=document.createElement("input");
		input.type="text";
		container.appendChild(input);

		let inputHistory=new µ.gui.InputHistory(["test 3","test 2","test 1","test 2"]);
		inputHistory.register(input);

		input.addEventListener("keydown",function(e)
		{
			if(e.key=="Enter")
			{
				inputHistory.add(e.target.value);
				e.target.value="";
			}
		});
	},
	function max5(container)
	{
		let input=document.createElement("input");
		input.type="text";
		container.appendChild(input);

		let inputHistory=new µ.gui.InputHistory(["test 3","test 2","test 1","test 2"]);
		inputHistory.register(input);

		inputHistory.setMax(5);

		input.addEventListener("keydown",function(e)
		{
			if(e.key=="Enter")
			{
				inputHistory.add(e.target.value);
				e.target.value="";
			}
		});
	},
	function multiple(container)
	{
		let inputHistory=new µ.gui.InputHistory(["test 3","test 2","test 1","test 2"]);

		for(let i=0;i<2;i++)
		{
			let input=document.createElement("input");
			input.type="text";
			container.appendChild(input);
			inputHistory.register(input);
			input.addEventListener("keydown",function(e)
			{
				if(e.key=="Enter")
				{
					inputHistory.add(e.target.value);
					e.target.value="";
				}
			});
		}
	},
]);