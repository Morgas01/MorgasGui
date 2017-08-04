(function(µ,SMOD,GMOD,HMOD,SC){

	var TreeTableConfig=GMOD("gui.TreeTableConfig");

	SC=SC({
		Node:"NodePatch"
	});

	/**
	 * @param {gui.TableData} tableData
	 * @param {string} (radioName=undefined) if radioName is provided selectionTable will use radio inputs instead of checkboxes
	 */
	TreeTableConfig.Select=µ.Class(TreeTableConfig,{
		init:function(columns,options)
		{
			this.mega(columns);
			this.options=Object.create(TreeTableConfig.Select.options);
			this.options.radioName=null;
			this.options.noInput=true;
			this.options.control=false;
			this.setOptions(options);
		},
		setOptions:function(options)
		{
			if(options)
			{
				if("childrenGetter" in options) this.options.childrenGetter=options.childrenGetter;

				if("radioName" in options) this.options.radioName=options.radioName;
				if("noInput" in options) this.options.noInput=!!options.noInput;
				if("control" in options) this.options.control=!!options.control;
			}
			return this;
		},
		getHeader:function(callback)
		{
			var row=this.mega();
			var inputCol=document.createElement("div");
			row.insertBefore(inputCol,row.firstChild);

			if(callback)callback.call(row,row,this);
			return row;
		},
		getRow:function(data,depth)
		{
			var row=this.mega(data,depth)

			var input=document.createElement("input");
			if(this.options.radioName)
			{
				input.type="radio";
				input.name=this.options.radioName;
			}
			else input.type="checkbox";
			row.insertBefore(input,row.firstChild);
			return row;
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
			if(this.options.control) TreeTableConfig.Select.control(table);

			if(this.options.radioName)
			{
				table.addEventListener("change",event=>
				{
					if(event.target.tagName=="INPUT"&&event.target.type=="radio"&&event.target.name==this.options.radioName)
					{
						for(var row of table.querySelectorAll(this.options.body.rowTag+".collapsed"))
						{
							SC.Node.traverse(row,(node,parent,parentResult,entry)=>{
								if(entry.depth>0) node.firstElementChild.checked=false;
							},"treeChildren");
						}
					}
				})
			}

			return table;
		}
	});
	TreeTableConfig.Select.options={
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

	TreeTableConfig.Select.control=function(table)
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
					Array.forEach(tableBody.children,row=>{
						row.children[0].checked=false;
						SC.Node.traverse(row,subRow=>
							subRow.children[0].checked=false,
						"treeChildren")
					});
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

	SMOD("gui.TreeTableConfig.Select",TreeTableConfig.Select);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
