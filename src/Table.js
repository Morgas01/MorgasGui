(function(µ,SMOD,GMOD,HMOD,SC){

	let Element=GMOD("gui.Element");

	SC=SC({
		Column:"gui.Table.Column",
		Organizer:"Organizer",
	});

	µ.gui.Table=µ.Class(Element,{
		styleClass:"gui-table",
		constructor:function({
			data=[],
			columns=[]

		}={})
		{
			Element.call(this,{tagName:"table"});

			this.organizer=new SC.Organizer(data);

			this.data=data;
			this.columns=columns.map(SC.Column.parse);

			this.head=document.createElement("THEAD");
			this.el.appendChild(this.head);
			this.body=document.createElement("TBODY");
			this.el.appendChild(this.body);

			this.dataToDomMap=new WeakMap();
			this.domToDataMap=new WeakMap();
			this.dataToRowInfoMap=new WeakMap();
			this.selected=new Set();

		},
		async update()
		{
			let headPromise=this.updateHeader();
			let bodyPromise=this.updateBody();

			await Promise.allSettled([headPromise,bodyPromise]);

			this.updateOrder();
		},
		async updateHeader()
		{
			let headRow=this.head.firstElementChild;
			if(!headRow)
			{
				headRow=document.createElement("TR");
				this.head.appendChild(headRow);
			}
			let headPromises=[];
			for (let column of this.columns)
			{
				headPromises.push(this.updateHeaderCell(column));
			}

			return Promise.allSettled(headPromises);
		},
		async updateHeaderCell(column)
		{
			if(!this.columns.includes(column)) return;

			let cell=this.dataToDomMap.get(column);
			if(!cell)
			{
				cell=document.createElement("TH");
				this.dataToDomMap.set(column,cell);
				this.domToDataMap.set(cell,column);
			}
			return column.updateHeader(cell);
		},
		async updateBody()
		{
			for(let rowData of data)
			{
				this.updateRow(rowData);
			}
		},
		async updateRow(rowData)
		{
			let row=this.dataToDomMap.get(rowData);
			if(!row)
			{
				row=document.createElement("TR");
				this.dataToDomMap.set(rowData,row);
				this.domToDataMap.set(row,rowData);
			}
			let cellPromises=[];
			for(let column of this.columns)
			{
				cellPromises.push(this.updateCell(column,rowData));
			}
			return Promise.allSettled(cellPromises);
		},
		getRowInfo(row)
		{
			let rowInfo=this.dataToRowInfoMap.get(row);
			if(!rowInfo)
			{
				rowInfo={
					columnToDomMap:new WeakMap(),
					domToColumnMap:new WeakMap()
				};
				this.dataToRowInfoMap.set(rowInfo);
			}
			return rowInfo;
		},
		async updateCell(column,row)
		{
			let rowInfo=this.getRowInfo(row);
			let columnToDomMap=rowInfo.columnToDomMap;

			let cell=columnToDomMap.get(column);
			if(!cell)
			{
				cell=document.createElement("TD");
				columnToDomMap.set(column,cell);
				rowInfo.domToColumnMap.set(cell,column);
			}
			return column.updateCell(cell,row);
		},
		updateOrder()
		{
			this.updateColumnOrder();
			this.updateRowOrder();
		},
		updateColumnOrder()
		{
			this.updateHeaderColumnOrder();
			for(let rowData of this.data)
			{
				this.updateRowColumnOrder(row);
			}
		},
		updateHeaderColumnOrder()
		{
			let headRow=this.head.firstElementChild;
			if(!headRow) return;

			let cells=[];

			for(let column of this.columns)
			{
				let cell=this.dataToDomMap.get(column);
				if(!cell) continue;
				cells.push(cell);
			}
			headRow.replaceChildren(...cells);
		},
		updateRowOrder()
		{
			let rows=[];

			for(let rowData of this.data)
			{
				let row=this.dataToDomMap.get(row);
				if(!row) continue;
				this.updateRowColumnOrder(row);
				rows.push(row);
			}
			this.body.replaceChildren(...rows);
		},
		updateRowColumnOrder(row)
		{
			let rowInfo=this.getRowInfo(row);
			let columnToDomMap=rowInfo.columnToDomMap;

			let cells=[];

			for(let column of this.columns)
			{
				let cell=columnToDomMap.get(column);
				if(!cell) continue;
				cells.push(cell);
			}
			row.replaceChildren(...cells);
		},
		async addRow(rowData,index=this.data.length)
		{
			let nextRow=this.dataToDomMap.get(this.data[index]);

			this.data.splice(index,0,rowData);
			await this.updateRow(rowData);

			let row=this.dataToDomMap(rowData);
			this.body.insertBefore(row,nextRow);
		},
		removeRow(rowData)
		{
			let index=this.data.indexOf(rowData);
			if(index===-1) return;
			
			this.data.splice(index,1);
			let row=this.dataToDomMap.get(rowData);
			if(row)
			{
				row.remove();
				this.domToDataMap.delete(row);
			}
			
			this.dataToDomMap.delete(rowData);
			this.dataToRowInfoMap.delete(rowData);
		}
	});

	SMOD("gui.Table",µ.gui.Table);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut)