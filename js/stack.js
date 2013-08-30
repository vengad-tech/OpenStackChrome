
//Server Configuration
settings = {}
settings.url = "http://localhost:5000/v2.0/tokens"
settings.username = "admin"
settings.password = "admin"
settings.tenantId = "45ab8b75ab3e4d3b9ec34d37886e6ba8"
settings.access_token=""


//Intialize the connection parameters
function Init(url,username,password,tenantId)
{

	settings.url = url;
	settings.username = username;
	settings.password = password;
	settings.tenantId = tenantId;
	fetch_access_token();

}

//Utility function to fetch access token id and nova endpoint
function fetch_access_token()
{
var xhr = new XMLHttpRequest();
xhr.open('POST', settings.url, true);
xhr.setRequestHeader('Content-type', 'application/json');
xhr.onload = function () {
    // do something to response
    console.log(this.responseText);
    var response = JSON.parse(this.responseText);
    settings.access_token = response.access.token.id;
    console.log("Obtained Token id"+response.access.token.id);
    //Fetching Nova Endpoint URL
    //console.log(response.access.serviceCatalog);
    for(i = 0 ; i < response.access.serviceCatalog.length ; i++)
    {
    	service = response.access.serviceCatalog[i];
    	console.log('Inside service loop');
    	//console.log(JSON.stringify(service));
    	if(service.name=='nova')
    	{
    		settings.nova_url = service.endpoints[0].publicURL;
    		console.log("Found Nova endpoint at "+settings.nova_url);
    	}
    }




};
xhr.send('{"auth":{"passwordCredentials":{"username": "'+settings.username+'", "password":"'+settings.password+'"}, "tenantId":"'+settings.tenantId+'"}}');
console.log('sent request');
}


function list_images()
{
	//request we need to make
	request_service = "/images/detail";
	var xhr = new XMLHttpRequest();
xhr.open('GET', settings.nova_url+request_service, true);
xhr.setRequestHeader('Content-type', 'application/json');
xhr.setRequestHeader('X-Auth-Token', settings.access_token);
xhr.onload = function () {
    // do something to response
    //console.log(this.responseText);
     var response = JSON.parse(this.responseText);
     for(i=0;i<response.images.length;i++)
     {

     	image = response.images[i];
     	console.log(image.name+" "+image.status);
     }

   




};
xhr.send();
console.log('sent request for listing images');

}



function list_servers()
{
	//request we need to make
	request_service = "/servers/detail";
	var xhr = new XMLHttpRequest();
xhr.open('GET', settings.nova_url+request_service, true);
xhr.setRequestHeader('Content-type', 'application/json');
xhr.setRequestHeader('X-Auth-Token', settings.access_token);
xhr.onload = function () {
    // do something to response
    //console.log(this.responseText);
     var response = JSON.parse(this.responseText);
     for(i=0;i<response.servers.length;i++)
     {

     	server = response.servers[i];
     	console.log(server.name+" "+server.status);
     }

   




};


xhr.send();
console.log('sent request for listing images');

}




$(document).ready(function(){


$( "#perform" ).click(function() {
	fetch_access_token();
  
});

});