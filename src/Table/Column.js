(function(µ,SMOD,GMOD,HMOD,SC){

	let Table=GMOD("gui.Table");

	SC=SC({});

	Table.Column=µ.Class({
		constructor:function({
			title="",
			update=()=>"",
			styleClass=title
		}={})
		{
			switch (typeof styleClass)
			{
				case "string":
					styleClass=styleClass.split(/[, ]+/);
					break;
				case "object":
					break;//assume array
				default:
					styleClass=[];
					break;
			}

			this.title=title;
			this.update=update;
			this.styleClass=styleClass;
		},
		async updateHeader(cell)
		{
			if(typeof this.title==="string")
			{
				cell.innerText=this.title;
				cell.classList.add(this.title);
			}
			else
			{
				await this.title(cell);
			}
		},
		async updateCell(cell,rowData)
		{
			if(this.styleClass)
			{
				cell.classList.add(...this.styleClass);
			}
			await this.update(cell,rowData);
		}
	});
	Table.Column.parse=function(param)
	{
		switch (typeof param)
		{
			case "function":
				return new Table.Column({title:param.name,update:param});
			case "object":
				if(param instanceof Table.Column) return param;
				return new Table.Column(param);
			default:
			case "string":
				return new Table.Column({title:param,update:(cell,data)=>param in data?cell.innerText=data[param]:param});
		}
	};

	SMOD("gui.Table.Column",Table.Column);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut)