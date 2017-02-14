(function(µ,SMOD,GMOD,HMOD,SC){

	//SC=SC({});

	if(!µ.gui) µ.gui={};


	var dragBox=µ.gui.dragBox=function(element,options)
	{
		options=options||{};

		element.addEventListener("mousedown",function startDragbox(downEvent)
		{
			downEvent.preventDefault();
			var rect=element.getBoundingClientRect();
			var point1={
				x:downEvent.clientX-rect.x,
				y:downEvent.clientY-rect.y
			}
			var box=null;
			var lastMove=null;
			var dimension={
				top:null,
				left:null,
				width:null,
				height:null,
				pointerX:null,
				pointerY:null,
			};
			var onmove=function(moveEvent)
			{
				if(!box)
				{
					box=document.createElement("div");
					box.classList.add("dragbox");
					element.appendChild(box);
					element.classList.add("dragbox-area");

					if(options.start) options.start.call(element,box,point1,element)
				}
				lastMove=moveEvent.type==="mousemove"?moveEvent:lastMove;
				var rect=element.getBoundingClientRect();
				var movement={
					x:lastMove.clientX-rect.x-point1.x,
					y:lastMove.clientY-rect.y-point1.y
				};

				dimension.pointerX=movement.x>0;
				if(!dimension.pointerX)
				{
					dimension.left=point1.x+movement.x;
					dimension.width=-movement.x;
				}
				else
				{
					dimension.left=point1.x;
					dimension.width=movement.x;
				}

				dimension.pointerY=movement.y>0;
				if(!dimension.pointerY)
				{
					dimension.top=point1.y+movement.y;
					dimension.height=-movement.y;
				}
				else
				{
					dimension.top=point1.y;
					dimension.height=movement.y;
				}

				if(options.clip) clip(dimension,rect);
				if(options.move) options.move.call(element,dimension,element);

				box.style.top=dimension.top;
				box.style.left=dimension.left;
				box.style.width=dimension.width;
				box.style.height=dimension.height;
			};
			var onup=function (moveup)
			{
				element.removeEventListener("mousemove",onmove,false);
				window.removeEventListener('scroll', onmove,true);
				element.removeEventListener("mouseup",onup,false);
				element.classList.remove("dragbox-area");
				element.removeChild(box);
				box=null;

				if(options.stop) options.stop.call(element,dimension);
			};
			element.addEventListener("mousemove",onmove,false);
			window.addEventListener('scroll',onmove,true);
			element.addEventListener("mouseup",onup,false);
			element.setCapture();
		});
	};
	var clip=function(dimension,rect)
	{
		if(dimension.top<0){
			dimension.height+=dimension.top;
			dimension.top=0;
		}
		if(dimension.left<0){
			dimension.width+=dimension.left;
			dimension.left=0;
		}

		dimension.width=Math.min(rect.width-dimension.left,dimension.width);
		dimension.height=Math.min(rect.height-dimension.top,dimension.height);

	}

	SMOD("gui.dragBox",dragBox);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);