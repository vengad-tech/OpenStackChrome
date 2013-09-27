$(document).ready(function() {
	$("#logoff").click(function() {
		localStorage.isLogin = false;
		window.location.assign("./index.html");
	});


});