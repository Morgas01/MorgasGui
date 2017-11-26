(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		Node:"NodePatch",
	});

	if(!µ.gui) µ.gui={};

	let mapData=function(root,mapper,childrenGetter)
	{

		var rootResult=SC.Node.traverse(root,function(node,parent,parentResult,entry)
		{
			var item=document.createElement("LI");
			if(parent)
			{
				if(parent!=root)item.dataset.index=parentResult.item.dataset.index+"."+entry.index;
				else item.dataset.index=entry.index;
				if(!parentResult.container)
				{
					parentResult.container=document.createElement("UL");
					parentResult.item.appendChild(parentResult.container);
				}
				parentResult.container.appendChild(item);
			}
			mapper.call(node,item,node,parent,entry.index);
			return {container:null,item:item};
		},childrenGetter);

		return rootResult.item;
	}

	var TREE=µ.gui.Tree=µ.Class({
		constructor:function(data=[],mapper,{
			childrenGetter=null
		}={})
		{
			this.data=[].concat(data);
			this.mapper=mapper;
			this.childrenGetter=SC.Node.normalizeChildrenGetter(childrenGetter);
			this.element=document.createElement("UL");
			this.element.classList.add("Tree");
			/** @Type Set */
			this.filtered=null

			this.dataDomMap=new WeakMap();

			for(let root of this.data)
			{
				SC.Node.traverse(root,node=>this.dataDomMap.set(node,null));
				this.element.appendChild(this.change(root));
			}
			this.element.addEventListener("click",event=>
			{
				if(event.target.tagName==="UL"&&event.target!=this.element)
				{
					this.expand(event.target.parentNode,undefined,event.ctrlKey);
				}
			},false);

		},
		/**
		 * exchanges entry with matching row and vice versa
		 */
		change:function(item)
		{
			if(this.dataDomMap.has(item))
			{
				let rtn=this.dataDomMap.get(item);
				if(!rtn)
				{
					rtn=document.createElement("LI");
					let content=document.createElement("SPAN");
					rtn.appendChild(content);
					let children=this.childrenGetter(item);
					if(children&&children.length>0)
					{
						let subTree=document.createElement("UL");
						rtn.appendChild(subTree);
					}
					this.mapper.call(item,content,item);
					this.dataDomMap.set(item,rtn);
					this.dataDomMap.set(rtn,item);
				}
				return rtn;
			}
			return undefined;
		},
		expand:async function(item,state,all)
		{
			if(item instanceof HTMLElement)
			{
				item=this.change(item);
			}
			let element=this.change(item);
			let subTree=element.children[1];
			if(subTree&&subTree.tagName==="UL")
			{
				state=subTree.classList.toggle("expanded",state);
				if(!state)
				{
					for(let child of Array.from(subTree.children)) subTree.removeChild(child);
				}
				else
				{
					for(let child of this.childrenGetter(item))
					{
						if(!this.filtered||this.filtered.has(child))
						{
							subTree.appendChild(this.change(child));
						}
					}
				}
				if(all)
				{
					for(let child of this.childrenGetter(item)) await this.expand(child,state,all);
				}
			}
		},
		expandRoots:async function(state)
		{
			for(let root of this.data)
			{
				await this.expand(root,state,true);
			}
		},
		filter:async function(filterFn)
		{
			this.filtered=null;
			for( let subTree of this.element.querySelectorAll("ul.expanded"))
			{
				await this.expand(subTree.parentNode,true);
			}
			if(!filterFn) return;
			this.filtered=new Set();
			let parentMap=new Map();

			for(let root of this.data)
			{
				SC.Node.traverse(root,(node,parent,parentResult)=>
				{
					parentMap.set(node,parent);
					if(parentResult||filterFn(node))
					{
						this.filtered.add(node);
						return true;
					}
					return false;
				});
			}

			for(let entry of this.filtered) this.filtered.add(parentMap.get(entry));
			for(let root of this.data)
			{
				SC.Node.traverse(root,(node,parent,parentResult)=>
				{
					if(node!==root&&!this.filtered.has(node)&&!parentResult)
					{
						this.change(node).remove();
						return true;
					}
				});
			}
		}

	});
	TREE.decorateHTML=function(ul)
	{
		ul.classList.add("tree");
		ul.addEventListener("click",function(event)
		{
			if(event.target.tagName==="UL")
			{
				let state=event.target.classList.toggle("expanded");
				if(event.ctrlKey)
				{
					for( let subTree of event.target.querySelectorAll("ul"))
					{
						subTree.classList.toggle("expanded",state);
					}
				}
			}
		},false);
	};

	SMOD("gui.Tree",TREE);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
