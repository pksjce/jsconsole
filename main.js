$(document).ready(function(){
	var console = $('#console');
	console.keypress(function(evt){
		if(evt.keyCode === 13){
			var js = console.val();
			var x = eval(js);
			$('#userjs').html(js);
			var ans = make_nice(x);
			$('#answer').html(ans);
		}
	});
});

function make_nice(x){
	if(x == undefined){
		return "undefined";
	}
}