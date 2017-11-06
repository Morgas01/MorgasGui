(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		remove:"array.remove",
		rs:"rescope"
	});
	if(!µ.gui) µ.gui={};

	let InputHistory=µ.gui.InputHistory=µ.Class({
		constructor:function(entries,{
			max=null
		}={})
		{
			SC.rs.all(this,["onKeyPress"]);

			this.max=max;

			this.history=[];

			if(entries) this.set(entries);
		},
		clear:function()
		{
			this.history.length=0;
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
			this.history.unshift(entry);
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
			SC.remove(this.history,entry);
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
			if(this.max!=null&&this.max>0&&this.max<this.history.length)
			{
				this.history.length=this.max;
			}
			return this;
		},
		getValues:function()
		{
			return this.history.slice();
		},
		register:function(input)
		{
			input.removeEventListener("keypress",this.onKeyPress,false);
			input.addEventListener("keypress",this.onKeyPress,false);
			return this;
		},
		onKeyPress:function(event)
		{
			let input=event.target;
			if(input.value===""&&event.key=="ArrowUp") input.value=this.history[0]||"";
			else
			{
				let index=this.history.indexOf(input.value);
				if(index!=-1)
				{
					if(event.key=="ArrowUp"&&index+1<this.history.length)input.value=this.history[index+1];
					if(event.key=="ArrowDown")input.value=this.history[index-1]||"";
				}
			}
		}
	});

	SMOD("gui.InputHistory",InputHistory)

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);