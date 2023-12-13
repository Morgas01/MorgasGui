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
	 * @this {Any} (scope=element) - scope of actions
	 */

	/**
	 * @param {Element} element
	 * @param {Object.<String,ActionCallback>} actions
	 *
	 * @returns {Function} listener that is called for the provided dom events
	 */
	µ.gui.actionize=function({element,actions,scope=element,events=["click"]})
	{
		let listener=function(e)
		{
			let target=e.target;

			while(!target.dataset.action&&target!=element)
			{
				target=target.parentNode;
			}
			let action=target.dataset.action;
			if(!target||target===element||!(action in actions)) return;

			try
			{
				actions[action].call(scope,e,target,element);
			}
			catch (e)
			{
				µ.logger.error(e);
			}
		};
		for(let event of SC.encase(events))	element.addEventListener(event,listener);
		return listener;
	};
	SMOD("gui.actionize",µ.gui.actionize);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);
