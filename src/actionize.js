(function(µ,SMOD,GMOD,HMOD,SC){

	//SC=SC({});

	if(!µ.gui) µ.gui={};

	/**
	 * @callback ActionCallback
	 * @param {Event} event - click event
	 * @param {Element} target - Element with data-action attribute
	 * @param {Element} element - actionized element
	 * @this {Element} element - actionized element
	 */

	/**
	 * @param {Object.<String,ActionCallback>} fns
	 * @param {Element} element
	 */
	µ.gui.actionize=function(fns,element)
	{
		element.addEventListener("click",function(e)
		{
			var target=e.target;
			var fn
			while(target&&target!=element)
			{
				var action=target.dataset.action;
				if( action in fns)
				{
					fns[action].call(element,e,target,element);
					e.stopPropagation();
					return true;
				}
				target=target.parentNode;
			}
		})
	};
	SMOD("gui.actionize",µ.gui.actionize);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
