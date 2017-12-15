(function(µ,SMOD,GMOD,HMOD,SC){

	let TREE=GMOD("gui.Tree");

	SC=SC({
		rescope:"rescope",
		remove:"array.remove"
	});

	TREE.Select=µ.Class(TREE,{
		constructor:function(data=[],mapper,param={})
		{
			this.radioName=param.radioName;
			this.mega(data,mapper,param);
			this.element.classList.add("Select");

			this.selected=[];

			SC.rescope.all(this,["_onSelect"]);
			this.element.addEventListener("change",this._onSelect,false);
		},
		_createDomNode:function(item)
		{
			let rtn=this.mega(item);
			let input=document.createElement("input");
			input.classList.add("TreeSelectInput");
			if(this.radioName)
			{
				input.name=this.radioName;
				input.type="radio";
			}
			else
			{
				input.type="checkbox";
			}

			rtn.insertBefore(input,rtn.firstChild);
			return rtn;
		},
		_onSelect:function(event)
		{
			let input=event.target;
			if(input.classList.contains("TreeSelectInput"))
			{
				if(this.radioName)
				{
					for(let item of this.selected)
					{
						this.change(item).firstChild.checked=false; // deselect input outside of document dom tree
					}
					this.selected.length=0;
				}
				let domItem=input.parentNode
				if(input.checked)
				{
					this.selected.push(this.change(domItem));
				}
				else
				{
					SC.remove(this.selected,this.change(domItem));
				}
			}
		},
		getSelected:function()
		{
			return this.selected;
		},
		getSelectedItems:function()
		{
			return this.selected.map(this.change,this);
		}

	});

	SMOD("gui.Tree.Select",TREE.Select);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
