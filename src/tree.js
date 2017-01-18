(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		Node:"NodePatch",
		adopt:"adopt"
	});

	if(!µ.gui) µ.gui={};

	var TREE=µ.gui.tree=function(root,mapper,options)
	{
		options=SC.adopt({
			childrenGetter:null, //NodePatch.traverse default
			detacheHidden:true,
		},options);

		var tree;

		var detachedMap=new Map();
		var domDataMap=new Map();
		var filtered=new Set();

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
						.filter(arr=>arr[1]==this&&!filtered.has(domDataMap.get(arr[0]))
						)
						.map(arr=>arr[0])
						.sort((a,b)=>parseInt(a.dataset.index.split(".").pop(),10)>parseInt(b.dataset.index.split(".").pop(),10))
						.forEach(e=>
						{
							if(all&&e.lastElementChild&&typeof e.lastElementChild.expand=="function")
							{
								e.lastElementChild.expand(true,true);
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
						if(all&&child.lastElementChild&&typeof child.lastElementChild.expand=="function")
						{
							child.lastElementChild.expand(false,true);
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
		if(root instanceof HTMLElement)
		{
			tree=root;
			options.detacheHidden=tree.dataset.detacheHidden!="false";

			var todo=[{
				subTree:tree,
				index:null
			}];
			var entry;
			while(entry=todo.shift())
			{
				entry.subTree.expand=expand;
				for(var i=0;i<entry.subTree.children.length;i++)
				{
					var child=entry.subTree.children[i];
					var index=entry.index==null?i:entry.index+"."+i;
					child.dataset.index=index;
					if(child.lastElementChild&&child.lastElementChild.tagName==="UL")
					{
						todo.push({
							subTree:child.lastElementChild,
							index:index
						});
					}
				}
			}
		}
		else
		{
			tree=TREE.create(root,function(item,node,parent,index)
			{
				mapper.call(node,item,node,parent,index);
				domDataMap.set(node,item);					// data			-> dom
				domDataMap.set(item,node);					// dom			-> data
				domDataMap.set(item.dataset.index,node);	// data-index	-> data

				if(item.parentNode)item.parentNode.expand=expand;
			},{
				childrenGetter:options.childrenGetter,
				rootContainer:true
			});
		}

		tree.classList.add("tree");
		tree.addEventListener("click",function(event)
		{
			event.target.expand&&event.target.expand(null,event.ctrlKey)
		},false);
		tree.expand=function(state,all)
		{
			this.firstElementChild.lastElementChild.expand(state,all);
		}

		tree.getData=domDataMap.get.bind(domDataMap);

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
				var domChild=domDataMap.get(node);
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
				},options.childrenGetter);

				for(var child of filtered)
				{
					var domChild=domDataMap.get(child);
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
	TREE.create=function(root,mapper,options)
	{
		options=SC.adopt({
			childrenGetter:null, //NodePatch.traverse default
			itemTag:"li",
			containerTag:"ul",
			rootContainer:false
		},options);
		var rootResult=SC.Node.traverse(root,function(node,parent,parentDOM,entry)
		{
			var item=document.createElement(options.itemTag);
			if(parent)
			{
				if(parent!=root)item.dataset.index=parentDOM.item.dataset.index+"."+entry.index;
				else item.dataset.index=entry.index;
				if(!parentDOM.container)
				{
					parentDOM.container=document.createElement(options.containerTag);
					parentDOM.item.appendChild(parentDOM.container);
				}
				parentDOM.container.appendChild(item);
			}
			mapper.call(node,item,node,parent,entry.index);
			return {container:null,item:item};
		},options.childrenGetter);

		if(options.rootContainer)
		{
			var rootContainer=document.createElement(options.containerTag);
			rootContainer.appendChild(rootResult.item);
			return rootContainer;
		}
		return rootResult.item;
	}

	SMOD("gui.tree",TREE);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
