(function(µ,SMOD,GMOD,HMOD,SC){

	SC=SC({
		encase:"encase"
	});

	if(!µ.gui) µ.gui={};

	/**
	 * @callback ActionCallback
	 * @param {Event} event - click event
	 * @param {Element} target - Element with data-action attribute
	 * @param {Element} element - actionized element
	 * @param {Any} (scope=element) - scope of actions
	 */

	/**
	 * @param {Object.<String,ActionCallback>} fns
	 * @param {Element} element
	 */
	µ.gui.actionize=function(fns,element,scope=element,events=["click"])
	{
		let listener=function(e)
		{
			let target=e.target;
			let fn
			while(target&&target!=element)
			{
				let action=target.dataset.action;
				if( action in fns)
				{
					fns[action].call(scope,e,target,element);
					e.stopPropagation();
					return true;
				}
				target=target.parentNode;
			}
		}
		for(let event of SC.encase(events))	element.addEventListener(event,listener);
	};
	SMOD("gui.actionize",µ.gui.actionize);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
