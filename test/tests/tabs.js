(function(){
	module("tabs",[
		function markup(container)
		{
			//TODO
			container.innerHTML+=String.raw
`
`;
		},
		function data(container)
		{
			var tab3=document.createElement("div");
			tab3.textContent="tab3";
			var content3=document.createElement("div");
			content3.textContent="content3";
			var data=new Map([["tab1","content1"],[e=>e.innerHTML="<span>tab2</span>",e=>e.textContent="content2"],[tab3,content3]]);
			container.appendChild(µ.gui.tabs(data,1));
		}
	]);
})();