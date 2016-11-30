(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		TableData:"gui.TableData"
	});

	if(!µ.gui) µ.gui={};
	/**
	 * @param {gui.TableData} tableData
	 * @param {string} (radioName=undefined) if radioName is provided selectionTable will use radio inputs instead of checkboxes
	 */
	µ.gui.selectionTable=function(tableData,radioName)
	{
		var table=document.createElement("div");
		table.classList.add("selectionTable");
		var tableBody=document.createElement("div");
		if(tableData.hasHeader())
		{
			var header=document.createElement("header");
			var headerRow=document.createElement("div");
			headerRow.appendChild(document.createElement("div")); //input column
			for(var h of tableData.getHeaders("div")) headerRow.appendChild(h);
			header.appendChild(headerRow);
			table.appendChild(header);
		}
		for(var r of tableData.getRows("label","div"))
		{
			var input=document.createElement("input");
			input.value=r.dataset.index;
			if(radioName)
			{
				input.type="radio";
				input.name=radioName;
			}
			else input.type="checkbox";
			r.insertBefore(input,r.firstChild);
			tableBody.appendChild(r);
		}
		table.appendChild(tableBody);


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
		table.getSelectedRows=function()
		{
			return Array.from(tableBody.querySelectorAll(":scope>label>input:checked"))
			.map(c=>c.parentNode);
		};
		table.getSelected=function()
		{
			return table.getSelectedRows()
			.map(table.getData);
		};
		table.getData=function(row)
		{
			return tableData.data[row.dataset.index];
		};

		return table;
	};

	µ.gui.selectionTable.selectionControl=function(table)
	{
		var tableBody=Array.from(table.children).filter(e=>e.tagName=="DIV")[0];
		if(tableBody)
		{
			var lastSelected=null;
			tableBody.addEventListener("click",function(e)
			{
				e.preventDefault();
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
					Array.map(tableBody.children,r=>r.children[0]).forEach(i=>i.checked=false);
					row.children[0].checked=true;
					lastSelected=row;
				}
				table.dispatchEvent(new CustomEvent("select",{
					bubbles:false,
					cancelable:false,
					detail:{
						selectionType:selectionType
					}
				}));
			});
			return true;
		}
		else return false;
	};

	SMOD("gui.selectionTable",µ.gui.selectionTable);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
