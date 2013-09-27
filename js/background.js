/*
Periodically checing usage and alerting user about host
*/
var REFRESH_INTERVAL = 20000
//periodically this function checks for usage
setInterval(function() {
	var nova = new Nova();
	nova.Load();
	console.log("Using Access token " + nova.settings.access_token);
	if (len(nova.settings.access_token) > 1) {


	}


}, REFRESH_INTERVAL)