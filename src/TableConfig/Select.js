(function(µ,SMOD,GMOD,HMOD,SC){

	var TableConfig=GMOD("gui.TableConfig");
	//SC=SC({});
	/**
	 * @param {gui.TableData} tableData
	 * @param {string} (radioName=undefined) if radioName is provided selectionTable will use radio inputs instead of checkboxes
	 */
	TableConfig.Select=µ.Class(TableConfig,{
		constructor:function(columns,options)
		{
			this.mega(columns);
			this.options=Object.create(TableConfig.Select.options);
			this.options.radioName=null;
			this.options.noInput=false;
			this.options.control=false;
			this.setOptions(options);
		},
		setOptions:function(options)
		{
			this.mega(options)
			if(options)
			{
				if("radioName" in options) this.options.radioName=options.radioName;
				if("noInput" in options) this.options.noInput=!!options.noInput;
				if("control" in options) this.options.control=!!options.control;
			}
			return this;
		},
		getHeader:function(callback)
		{
			var row=this.mega();
			var inputCol=document.createElement("DIV");
			row.insertBefore(inputCol,row.firstChild);

			if(callback)callback.call(row,row,this);
			return row;
		},
		fillRow:function(data,row)
		{
			let input=Array.from(row.children).find(e=>e.tagName==="INPUT");
			if(!input)
			{
				input=document.createElement("INPUT");
				row.appendChild(input);
			}
			if(this.options.radioName)
			{
				input.type="radio";
				input.name=this.options.radioName;
			}
			else input.type="checkbox";

			this.mega(data,row);
		},
		getTable:function(data,headerCallback,rowCallback)
		{
			var table=this.mega(data,headerCallback,rowCallback);
			table.classList.add("Select");

			Object.defineProperty(table,"noInput",{
				configurable:false,
				enumerable:true,
				set:function(val)
				{
					if(val)table.classList.add("noInput");
					else table.classList.remove("noInput");
				},
				get:table.classList.contains.bind(table.classList,"noInput")
			});

			table.noInput=this.options.noInput;
			if(this.options.control) TableConfig.Select.control(table);

			return table;
		}
	});
	TableConfig.Select.options={
		tag:"div",
		header:{
			tag:"header",
			rowTag:"div",
			columnTag:"div",
		},
		body:{
			tag:"div",
			rowTag:"label",
			columnTag:"div",
		}
	};

	TableConfig.Select.control=function(table)
	{
		var tableBody=table.firstElementChild;
		if(tableBody&&tableBody.tagName!="DIV") tableBody=tableBody.nextElementSibling;

		if(tableBody)
		{
			var lastSelected=null;
			tableBody.addEventListener("click",function(e)
			{
				if(e.target.tagName!=="INPUT")e.preventDefault();
				e.stopPropagation();

				var row=e.target;
				while(row&&row.parentNode!==tableBody)
				{
					row=row.parentNode;
				}
				var rows=Array.from(tableBody.children);
				var selectionType=null;
				if (e.shiftKey)
				{//select all between here and last
					selectionType="range";
					window.getSelection().removeAllRanges();
					if (!e.ctrlKey)
					{//remove other selected
						rows.forEach(r=>r.children[0].checked=false);
					}

					var lastIndex=lastSelected?rows.indexOf(lastSelected):0;
					var index=rows.indexOf(row);

					rows.slice(Math.min(lastIndex,index),Math.max(lastIndex,index)+1)
					.forEach(r=>r.children[0].checked=true);
				}
				else if(e.ctrlKey)
				{//add to selection
					selectionType="toggle";
					window.getSelection().removeAllRanges();
					row.children[0].checked=!row.children[0].checked;
					lastSelected=row;
				}
				else
				{//select only this
					selectionType="single";
					Array.prototype.map.call(tableBody.children,r=>r.children[0]).forEach(i=>i.checked=false);
					row.children[0].checked=true;
					lastSelected=row;
				}
				table.dispatchEvent(new CustomEvent("select",{
					bubbles:false,
					cancelable:false,
					detail:{
						selectionType:selectionType,
						row:row
					}
				}));
			},false);
			return true;
		}
		else return false;
	};

	SMOD("gui.TableConfig.Select",TableConfig.Select);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
