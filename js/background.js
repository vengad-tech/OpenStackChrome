/*
Periodically checing usage and alerting user about host
*/
var REFRESH_INTERVAL = 2000;
//periodically this function checks for usage
console.log("background started");
history = {}
setInterval(function() {
	console.log("Periodic background check started");
	var nova = new Nova();
	nova.Load();
	console.log("Using Access token " + nova.settings.access_token);
	if (nova.settings.access_token.length > 1) {

		nova.list_hosts(function(hosts) {
			for (i = 0; i < hosts.length; i++) {

				host = hosts[i];
				if ((localStorage.alert=="true") && ( host['cpu'] >= localStorage.cpu || host['disk'] >= localStorage.disk || host['memory'] >= localStorage.memory)) {

					var notif_text = "";
					if(host['cpu'] >= localStorage.cpu )
					{
						notif_text = notif_text + " cpu exceed "+host['cpu']+" ";

					}
					if(host['disk'] >= localStorage.disk )
					{
						notif_text = notif_text + " disk exceed "+host['disk']+" ";

					}
					if(host['memory'] >= localStorage.memory )
					{
						notif_text = notif_text + " memory exceed "+host['memory']+" ";

					}


					var notification = webkitNotifications.createNotification(
						'', // icon url - can be relative
						'Resource Alert', // notification title
						'The Host ' + host['name'] + ' has exceeded the threshold limit '+notif_text // notification body text
					);

					if (history[host['name']]) {

						if (history[host['name']]['cpu'] == host['cpu'] && history[host['name']]['memory'] == host['memory'] && history[host['name']]['disk'] == host['disk']) {
							console.log("already notified");


						} else {

							notification.show();
							history[host['name']] = host;
						}
					}
					else{

					notification.show();
					history[host['name']] = host;
				}



				}


			}



		});



	}


}, REFRESH_INTERVAL);