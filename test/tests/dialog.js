module("dialog",[
	function(container)
	{
		container.innerHTML+=String.raw
`
<button data-action="dialog">dialog</button>
<button data-action="modal">modal dialog</button>
<button data-action="script">script dialog</button>
<button data-action="script" data-modal="true">script modal dialog</button>
`
		;
		container.addEventListener("click",function(e)
		{
			var dialogHTML=String.raw
`
<div>I'm a ${(e.target.dataset.modal?"modal ":"")+e.target.dataset.action}</div>
<button data-action="close">close</button>
`
			;
			var dialog,wrapper;
			switch(e.target.dataset.action)
			{
				case "modal":
					wrapper=document.createElement("div");
					wrapper.classList.add("dialog-wrapper","modal");
				case "dialog":
					dialog=document.createElement("div");
					dialog.classList.add("dialog");
					if(wrapper)
					{
						wrapper.appendChild(dialog);
						document.body.appendChild(wrapper);
					}
					else document.body.appendChild(dialog);
					dialog.innerHTML=dialogHTML;
					dialog.querySelector("button").addEventListener("click",function()
					{
						(wrapper?wrapper:dialog).remove();
					});
					break;
				case "script":
					var dialog=new µ.gui.dialog(dialogHTML);
					dialog.modal=e.target.dataset.modal;
					break;
				default:
					return;
			}
		})
	}
]);