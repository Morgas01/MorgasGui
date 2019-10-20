window.showcases=[
	{
		name:"default",
		description:`
Simple Dialog.
<code>let content=\`
	&lt;label&gt;Name:&lt;input type="text" name="name"&gt;&lt;/label&gt;
	&lt;label&gt;Age:&lt;input type="number" name="age" min="0" required=""&gt;&lt;/label&gt;
\`;
button.addEventListener("click",function()
{
	new µ.gui.Dialog.Input(content).then(values=&gt;alert(JSON.stringify(values)),()=&gt;alert("cancel"));
});</code>
`,
		fn:function(stage)
		{
			stage.innerHTML=`<button>open</button>`;
			let content=`
				<label>Name:<input type="text" name="name"></label>
				<label>Age:<input type="number" name="age" min="0" required></label>
			`;
			let button=stage.children[0];
			button.addEventListener("click",function()
			{
				new µ.gui.Dialog.Input(content).then(values=>alert(JSON.stringify(values)),()=>alert("cancel"));
			});
		}
	},
	{
		name:"modal",
		description:`
Simple modal Dialog.
<code>let content=\`
	&lt;h1&gt; my dialog&lt;/h1&gt;
	&lt;button data-action="close"&gt;close&lt;/button&gt;
\`;
button.addEventListener("click",function()
{
	new µ.gui.Dialog(content,{modal:true});
});</code>
`,
		fn:function(stage)
		{
			stage.innerHTML=`<button>open</button>`;
			let content=`
				<h1> my dialog</h1>
				<button data-action="close">close</button>
			`;
			let button=stage.children[0];
			button.addEventListener("click",function()
			{
				new µ.gui.Dialog(content,{modal:true});
			});
		}
	}
];