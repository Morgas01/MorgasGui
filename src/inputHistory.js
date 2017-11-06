(function(µ,SMOD,GMOD,HMOD,SC){

	//SC=SC({});
	if(!µ.gui) µ.gui={};

	let InputHistory=µ.gui.InputHistory=µ.Class({
		constructor:function(entries)
		{
			this.max=null;
			this.list=document.createElement("datalist");
			this.list.id=InputHistory.ID_PREFIX+InputHistory.ID_COUNTER++;

			if(entries) this.set(entries);

			document.body.appendChild(this.list);
		},
		clear:function()
		{
			while(this.list.firstChild)this.list.firstChild.remove();
			return this;
		},
		set:function(entries)
		{
			this.clear();
			this.addAll(entries);
			return this;
		},
		add:function(entry,index=0)
		{
			this.remove(entry);

			let option=document.createElement("option");
			option.textContent= option.dataset.translation= option.value= entry;
			this.list.insertBefore(option,this.list.children[index]);

			this.checkCount();
			return this;
		},
		addAll:function(entries,index=0)
		{
			for(let entry of entries)
			{
				this.add(entry,index++);
			}
			return this;
		},
		remove:function(entry)
		{
			for(let option of this.list.children)
			{
				if (option.value==entry) option.remove();
			}
			return this;
		},
		setMax:function(max)
		{
			if(max!=null&&max>0) this.max=max;
			else this.max=null;
			this.checkCount();
			return this;
		},
		checkCount:function()
		{
			if(this.max!=null&&this.max>0)
			{
				while(this.list.children.length>this.max) this.list.children[this.max].remove();
			}
			return this;
		},
		getValues:function()
		{
			return Array.from(this.list.children).map(o=>o.value);
		},
		register:function(input)
		{
			input.setAttribute("list",this.list.id);
		}
	});
	InputHistory.ID_PREFIX="intputHistory_";
	InputHistory.ID_COUNTER=0;

	SMOD("gui.InputHistory",InputHistory)

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);