(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		Node:"NodePatch",
		encase:"encase"
	});

	if(!µ.gui) µ.gui={};

	let TREE=µ.gui.Tree=µ.Class({
		constructor:function(data=[],mapper,{
			childrenGetter=null
		}={})
		{
			this.data=[];
			this.mapper=mapper;
			this.childrenGetter=SC.Node.normalizeChildrenGetter(childrenGetter);
			this.element=document.createElement("UL");
			this.element.classList.add("Tree");
			/** @Type Set */
			this.filtered=null

			this.dataDomMap=new WeakMap();
			this.element.addEventListener("click",event=>
			{
				if(event.target.tagName==="UL"&&event.target!=this.element)
				{
					this.expand(event.target.parentNode,undefined,event.ctrlKey);
				}
			},false);

			this.add(data);
		},
		add(roots)
		{
			roots=SC.encase(roots);
			for(let root of roots)
			{
				this.data.push(root);
				SC.Node.traverse(root,node=>this.dataDomMap.set(node,null),{childrenGetter:this.childrenGetter});
				this.element.appendChild(this.change(root));
			}

			return this;
		},
		clear()
		{
			this.data.length=0;
			this.dataDomMap=new WeakMap(); // clear map
			this.element.innerHTML="";

			return this;
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
					rtn=this._createDomNode(item);
				}
				return rtn;
			}
			return undefined;
		},
		_createDomNode:function(item)
		{
			let rtn=document.createElement("LI");
			let content=document.createElement("SPAN");
			rtn.appendChild(content);
			let children=this.childrenGetter(item);
			if(children&&children[Symbol.iterator]&&children[Symbol.iterator]().next().value!=null)
			{
				let subTree=document.createElement("UL");
				rtn.appendChild(subTree);
			}
			this.mapper.call(item,content,item);
			this.dataDomMap.set(item,rtn);
			this.dataDomMap.set(rtn,item);
			return rtn;
		},
		expand:async function(item,state,all)
		{
			if(item instanceof HTMLElement)
			{
				item=this.change(item);
			}
			let element=this.change(item);
			let subTree=element.children[element.children.length-1];
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
