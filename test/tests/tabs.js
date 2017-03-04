(function(){
	module("tabs",[
		function (container)
		{
			var tab3=document.createElement("div");
			tab3.textContent="tab3";
			var content3=document.createElement("div");
			content3.textContent="content3 ".repeat(20);
			var data=new Map([["tab1","content1"],[e=>e.innerHTML='<span>tab2</span><button data-action="closeTab">X</button>',e=>e.textContent="content2"],[tab3,content3]]);
			container.appendChild(µ.gui.tabs(data,1));
		}
	]);
})();