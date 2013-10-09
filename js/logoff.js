$(document).ready(function() {
	$("#logoff").click(function() {
		localStorage.isLogin = false;
		localStorage.alert= false;
		window.location.assign("./index.html");
	});


});