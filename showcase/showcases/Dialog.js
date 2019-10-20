window.showcases=[
	{
		name:"default",
		description:`
Simple Dialog.
<code>let content=\`
	&lt;h1&gt; my dialog&lt;/h1&gt;
	&lt;button data-action="close"&gt;close&lt;/button&gt;
\`;
button.addEventListener("click",function()
{
	new µ.gui.Dialog(content);
});</code>
`,
		fn:function(stage)
		{
			stage.innerHTML=`<button style="font-size:2em">open</button>`;
			let content=`
				<h1> my dialog</h1>
				<button data-action="close">close</button>
			`;
			let button=stage.children[0];
			button.addEventListener("click",function()
			{
				new µ.gui.Dialog(content);
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
			stage.innerHTML=`<button style="font-size:2em">open</button>`;
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
	},
	{
		name:"actions",
		description:`
Dialogs are always <a href="presenter?showcase=actionize">actionized</a>.
<code>let content=\`
	&lt;h1&gt; my dialog&lt;/h1&gt;
	&lt;button data-action="toggle"&gt;toggle modal&lt;/button&gt;
	&lt;button data-action="close"&gt;close&lt;/button&gt;
\`;
button.addEventListener("click",function()
{
	new µ.gui.Dialog(content,{
		actions:{
			toggle:function()
			{
				this.modal=!this.modal;
			}
		}
	});
});</code>
`,
		fn:function(stage)
		{
			stage.innerHTML=`<button style="font-size:2em">open</button>`;
			let content=`
				<h1> my dialog</h1>
				<button data-action="toggle">toggle modal</button>
				<button data-action="close">close</button>
			`;
			let button=stage.children[0];
			button.addEventListener("click",function()
			{
				new µ.gui.Dialog(content,{
					actions:{
						toggle:function()
						{
							this.modal=!this.modal;
						}
					}
				});
			});
		}
	}
];