module("InputHistory",[
	function simple(container)
	{
		var input=document.createElement("input");
		input.type="text";
		container.appendChild(input);

		var inputHistory=new µ.gui.InputHistory();
		inputHistory.register(input);

		input.addEventListener("change",function(e)
		{
			inputHistory.add(input.value);
			input.value="";
			input.focus();
		});
	},
	function prefilled(container)
	{
		var input=document.createElement("input");
		input.type="text";
		container.appendChild(input);

		var inputHistory=new µ.gui.InputHistory(["test 2","test 1","test 2","test 3"]);
		inputHistory.register(input);

		input.addEventListener("change",function(e)
		{
			inputHistory.add(input.value);
			input.value="";
		});
	},
	function max5(container)
	{
		var input=document.createElement("input");
		input.type="text";
		container.appendChild(input);

		var inputHistory=new µ.gui.InputHistory(["test 2","test 1","test 2","test 3"]);
		inputHistory.register(input);

		inputHistory.setMax(5);
		input.list=inputHistory.id;

		input.addEventListener("change",function(e)
		{
			inputHistory.add(input.value);
			input.value="";
		});
	},
]);