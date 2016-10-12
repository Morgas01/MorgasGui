(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		Node:"NodePatch",
		adopt:"adopt"
	});

	if(!µ.gui) µ.gui={};

	var TREE=µ.gui.tree=function(root,mapper,options)
	{
		options=SC.adopt({
			childrenKey:null,
			detacheHidden:true,
		},options);

		var tree=document.createElement("ul");

		var detachedMap=new Map();
		var domToData=new Map();
		var dataToDom=new Map();
		filtered=new Set();

		var attach=function(domParent,domChild)
		{
			var before=null;
			var index=parseInt(domChild.dataset.index.split(".").pop(),10);
			for(var i=0;i<=index&&i<domParent.children.length;i++)
			{
				var child=domParent.children[i];
				if(parseInt(child.dataset.index.split(".").pop(),10)>index)
				{
					before=child;
					break;
				}
			}
			domParent.insertBefore(domChild,before);
			detachedMap.delete(domChild);
		};
		var expand=function(state,all)
		{
			if(state==null||state===!this.classList.contains("expanded"))
			{
				var isExpanded=this.classList.toggle("expanded");
				if(isExpanded)
				{
						Array.from(detachedMap.entries())
						.filter(arr=>arr[1]==this&&!filtered.has(domToData.get(arr[0]))
						)
						.map(arr=>arr[0])
						.sort((a,b)=>parseInt(a.dataset.index.split(".").pop(),10)>parseInt(b.dataset.index.split(".").pop(),10))
						.forEach(e=>
						{
							if(all&&e.lastChild&&typeof e.lastChild.expand=="function")
							{
								e.lastChild.expand(true,true);
							}
							attach(this,e);
						});
				}
				else
				{
					for(var child of Array.from(this.children))
					{
						if(tree.detacheHidden)
						{
							detachedMap.set(child,this);
							this.removeChild(child);
						}
						if(all&&child.lastChild&&typeof child.lastChild.expand=="function")
						{
							child.lastChild.expand(false,true);
						}
					}
				}

				this.dispatchEvent(new CustomEvent("treetoggle",{
					bubbles:true,
					detail:{
						expanded:isExpanded,
						tree:tree
					}
				}));
				return isExpanded;
			}
			return null;
		};

		var rootResult=SC.Node.traverse(root,function(node,parent,parentDOM,entry)
		{
			var li=document.createElement("li");
			domToData.set(li,node);
			dataToDom.set(node,li);

			if(parent)
			{
				if(parent!=root)li.dataset.index=parentDOM.li.dataset.index+"."+entry.index;
				else li.dataset.index=entry.index;
				if(!parentDOM.ul)
				{
					parentDOM.ul=document.createElement("ul");
					parentDOM.ul.expand=expand;
					parentDOM.li.appendChild(parentDOM.ul);
				}
				parentDOM.ul.appendChild(li);
			}
			mapper.call(node,li,node,parent,entry.index);
			return {ul:null,li:li};
		},options.childrenKey);

		tree.classList.add("tree");
		tree.appendChild(rootResult.li);
		tree.addEventListener("click",function(event)
		{
			event.target.expand&&event.target.expand(null,event.ctrlKey)
		},false);

		tree.getData=domToData.get.bind(domToData);

		Object.defineProperty(tree,"detacheHidden",{
			configurable:false,
			enumerable:true,
			set:function(val)
			{
				tree.dataset.detacheHidden=!!val;
				if(val) for(var parent of Array.from(tree.querySelectorAll("li>ul")))
				{
					for(var child of Array.from(parent.children))
					{
						detachedMap.set(child,parent);
						parent.removeChild(child);
					}
				}

			},
			get:function(){return tree.dataset.detacheHidden==="true"}
		});
		tree.detacheHidden=options.detacheHidden;

		tree.filter=function(filterFn)
		{
			tree.classList.remove("filtered");
			for(var node of filtered)
			{
				var domChild=dataToDom.get(node);
				if(detachedMap.get(domChild).classList.contains("expanded"))
				{
					attach(detachedMap.get(domChild),domChild);
				}
			}
			filtered.clear();

			if(filterFn)
			{
				tree.classList.add("filtered");
				SC.Node.traverse(root,function(node,parent,parentresult)
				{
					if(!parentresult)
					{//root
						return [];
					}

					if(!filterFn.call(node,node))
					{
						filtered.add(node);
						return parentresult.concat(node);
					}
					else
					{
						for(var parent of parentresult) filtered.delete(parent);
						parentresult.length=0;
						return [];
					}
				},options.childrenKey);

				for(var child of filtered)
				{
					var domChild=dataToDom.get(child);
					if(!detachedMap.has(domChild))
					{
						detachedMap.set(domChild,domChild.parentNode);
						domChild.remove();
					}
				}
			}
		}
		return tree;
	};

	SMOD("gui.tree",µ.gui.tree);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
