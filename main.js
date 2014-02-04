var pkConsole = function(elem){
	return {
		_init:function(){
			this._historyStack = [];
			this._uparrowhit = 0;
			this._keyHash = {
				'enter':13,
				'up': 38,
				'left':37,
				'right':39,
				'down':40,
				'tab':9
			};
			//to get proper key regardless of browser
			this._whichKey = function(event){
				return event.keyCode? event.keyCode:event.which;
			};
			this._consoley = $("<input type = 'textarea' id='console'>");
			this._autocomplete = $("<div id='autocomplete'></div>");
			this._result = $("<ul id=results></ul>");
			this._iframe = $("<iframe id='myframe'></iframe>");
			elem.append(this._consoley).append(this._autocomplete).append(this._result).append(this._iframe);
			this._mockConsole = this._iframe[0].contentWindow;
			this._offset = this._autocomplete.position().left;
			this._windowProps = function(){
				var props = [];
				for(key in this._mockConsole){
					props.push(key);
				}
				return props;
			}();
			this._write = function(inputStr, result){
				var li = $('<li></li>');
				this._result.prepend(li);
				var consolestr = $('<div></div>').html(inputStr);
				var resultStr = $('<div></div>').html(result);
				li.append(consolestr).append(resultStr);
			};
			this.make_nice = function(x, type){
				if(type == "result"){
					if(x === undefined){
						return "undefined";
					}	
				} else{
					return "Error: " + x;
				}
			    return x.toString();	
			};
			this._setKeyPress = function(){
				var consoley = this._consoley;
				var mockConsole = this._mockConsole;
				var self = this;
				consoley.keypress(function(evt){
					var js = consoley.val();
					var key = self._whichKey(evt);
					if(key === 13){
						self._uparrowhit = 0;
						var x;
						var type = 'result';
			            
						try{
							x = mockConsole.eval(js);
						}catch(e){
							x = e.message;
							type= 'error';
						}
						self._historyStack.push(js);
						consoley.val('');
						self._autocomplete.html('');
						var ans = self.make_nice(x, type);
						self._write(js, ans);
					}
				});
			};
			this._setKeyDown = function(){
				var consoley = this._consoley;
				var mockConsole = this._mockConsole;
				var self = this;
				consoley.keydown(function(evt){
					var len = self._historyStack.length;
					var key = self._whichKey(evt);
					if(key === 38 && len > 0){
						self._uparrowhit +=1;
						if(len >= self._uparrowhit){
							consoley.val(self._historyStack[len - self._uparrowhit]);
						}
						evt.preventDefault();
					} else if(key === 40 && len > 0 && self._uparrowhit > 0){
						if(len >= self._uparrowhit){
							self._uparrowhit -=1;
							consoley.val(self._historyStack[len - self._uparrowhit]);
						} else {
							return;
						}
					} else if(key === 39 && !!self._autocompleteStr){
						self._consoley.val(self._consoley.val() + self._autocompleteStr);
						var myevent = $.Event('keyPress');
						myevent.keyCode = 13;
						self._consoley.trigger(myevent);
					}else if(key === 9) {
						return false;
					} else if(evt.ctrlKey && key == 13){

					}	
					return true;
				});
			};
			this._setKeyUp = function(){
				var consoley = this._consoley;
				var self = this;
				consoley.keyup(function(evt){
					self._removeAutocomplete();
					var js = consoley.val();
					var key = self._whichKey(evt);
					if(key !== 13 && js !== ""){
						self._addAutocomplete(consoley, js, self._offset);
					} 
				});
			};
			this._removeAutocomplete = function(){
				var autocompleteElem = elem.find('#autocomplete');
				autocompleteElem.html("");
			};
			this._addAutocomplete = function(consoley, js, offset){
				var inputSplit = js.split('.');
				var len = inputSplit.length;
				var autocompletelist = this._windowProps;
				var filter = js;
				if(inputSplit.length > 1 && inputSplit[0] !== 'window'){
					filter = inputSplit[len -1];
					var evalStr = inputSplit.slice(0, len-1).join('.');
					var evaled = eval(evalStr);
					autocompletelist = [];
					for(key in evaled){
						autocompletelist.push(key);
					}
				}
				this._autocompleteStr = this._getAutocompleteStr(autocompletelist, filter);
				var autocompleteElem = elem.find('#autocomplete');
				if(this._autocompleteStr !== null){
					var filterLen = filter.length;
					var autodistance = (filterLen)*7;
					autocompleteElem.css('left',  this._offset + autodistance);
					this._autocompleteStr = this._autocompleteStr.substr(filterLen, this._autocompleteStr.length);
					autocompleteElem.html(this._autocompleteStr);
				} else {
					autocompleteElem.html("");
				}
				
			};
			this._getAutocompleteStr = function(list, filter){
				var filterList = list.filter(function(item){
					if(item.indexOf(filter) === 0){
						return item;
					}
				})
				filterList.sort(function(a,b){
					if(a>b){
						return 1;
					} else if(a<b){
						return -1;
					} else {
						return 1;
					}
				})
				if(filterList.length){
					return filterList[0];
				} else if(filter.indexOf('fun') === 0){
					return "function";
				} 
				return null;
			}
			this._setKeyPress();
			this._setKeyUp();
			this._setKeyDown();
		}()
		
	}
};

window.PkConsole = pkConsole;



