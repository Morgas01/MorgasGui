(function(µ,SMOD,GMOD,HMOD,SC){

	let Dialog=GMOD("gui.Dialog");

	SC=SC({
		get:"getInputValues",
		Promise:"Promise"
	});

	/**
	 * Dialog specialized for inputs
	 *
	 * Use: new Dialog.Input(content,param).then(values=>{...});
	 *
	 * For additional checks supply a "OK" action which returns a Boolean or a thenable
	 * to indicate check success or failure.
	 * The "OK" action will be called with the input values as the only parameter.
	 *
	 * @see getInputValues
	 *
	 * @param {String|Element|Function} content
	 * @param {gui.Dialog~param} (param)
	 * @param {Boolean} (param.modal=true)
	 */
	Dialog.Input=µ.Class(Dialog,{
		constructor:function(content,param={})
		{
			param.modal=param.modal!==false;
			this.then=null;

			this._signal=null;
			param.actions=param.actions||{};
			let oldOK=param.actions["OK"];
			param.actions["OK"]=function()
			{
				let isValid=Array.from(this.content.elements).reduce((b,e)=>e.checkValidity()&&b,true);
				if(isValid)
				{
					let values=SC.get(this.content.querySelectorAll("[name]"));
					let result=values;
					if(oldOK)
					{
						result=oldOK.call(this,values);
					}
					if(result===false) result=Promise.reject();
					Promise.resolve(result)
					.then(this._signal.resolve,this._signal.reject);
				}
			};
			param.dialogTagName="FIELDSET";
			if(content instanceof HTMLElement&&content.tagName!="FIELDSET")
			{
				element=document.createElement("FIELDSET");
				element.appendChild(param);
				content=element;
			}


			this.mega(content,param);

			let actions=document.createElement("div");

			let okBtn=document.createElement("button");
			okBtn.textContent=okBtn.dataset.action="OK";
			actions.appendChild(okBtn);

			let cancelBtn=document.createElement("button");
			cancelBtn.textContent="Cancel"
			cancelBtn.dataset.action="close";
			actions.appendChild(cancelBtn);

			this.content.appendChild(actions);
		},
		appendTo(element)
		{
			if(this.then==null)
			{
				let promise=new SC.Promise((signal)=>
				{
					this._signal=signal;
				},{scope:this});

				this.then=promise.then.bind(promise);
				this.catch=promise.catch.bind(promise);
				this.always=promise.always.bind(promise);

				promise.always(()=>this.close());
			}
			this.mega(element);
		},
		close()
		{
			this.then=null;
			if(this._signal)
			{
				let sig=this._signal;
				this._signal=null;
				sig.reject();
			}
			this.mega();
		}
	});

	SMOD("gui.Dialog.Input",Dialog.Input);
	SMOD("gui.InputDialog",Dialog.Input);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);