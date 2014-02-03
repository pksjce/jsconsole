
var s = 2;
$(document).ready(function(){
	var consoley = $('#console');
	var historyStack = [];
	var uparrowhit = 0;
	consoley.keypress(function(evt){
		if(evt.keyCode === 13){
			uparrowhit = 0;
			var js = consoley.val();
			var x;
			var type = 'result';
            var mockConsole = document.getElementById('myframe').contentWindow;
			try{
				x = mockConsole.eval(js);
			}catch(e){
				x = e.message;
				type= 'error';
			}
			$('#userjs').html(js);
			historyStack.push(js);
			consoley.val('');
			var ans = make_nice(x, type);
			$('#answer').html(ans);
		}
	});
	consoley.keydown(function(evt){
		var len = historyStack.length;
		if(evt.keyCode === 38 && len > 0){
			uparrowhit +=1;
			if(len >= uparrowhit){
				consoley.val(historyStack[len - uparrowhit]);
			}
			evt.preventDefault();
		} else if(evt.keyCode === 40 && len > 0 && uparrowhit > 0){
			if(len >= uparrowhit && !evt.programmatic){
				uparrowhit -=1;
				consoley.val(historyStack[len - uparrowhit]);
			} else {
				return;
			}
		}
	});
});


function make_nice(x, type){
	if(type == "result"){
		if(x === undefined){
			return "undefined";
		}	
	} else{
		return "Error: " + x;
	}
    return x;
	
}