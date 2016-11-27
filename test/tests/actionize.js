module("actionize",[
	function (container)
	{
		container.innerHTML=String.raw
`
<span>
	<span style="border:1px solid black;display:inline-block" data-action="testAction">test action</span>
	<span style="border:1px solid black;display:inline-block" data-action="nestedAction"><a>nested action</a></span>
	<span style="border:1px solid black;display:inline-block" data-action="cascadeAction"><span data-action="cascade">cascade action</span></span>
	<span style="border:1px solid black;display:inline-block" data-action="unknownAction">unknown action</span>
<span>
`
		;
		µ.gui.actionize({
			testAction:alert.bind(window,"ok"),
			nestedAction:function(e,target,element)
			{
				alert(String.raw
`
event target:	${e.target.tagName}
target:			${target.tagName}
element:		${element.tagName}
scope:			${element==this}
`
				);
			},
			cascade:alert.bind(window,"ok")
		},container.firstElementChild);
		container.addEventListener("click",function(e)
		{
			alert(e.target.dataset.action=="unknownAction"?"ok":String.raw`Error: [${e.target.dataset.action}] from ${e.target.tagName}`);
		})
	}
]);