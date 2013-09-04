
function Nova()
{
//Server Configuration
this.settings = {}
this.settings.url = "http://localhost:5000/v2.0/tokens"
this.settings.username = "admin"
this.settings.password = "admin"
this.settings.tenantId = "45ab8b75ab3e4d3b9ec34d37886e6ba8"
this.settings.access_token =""


//Intialize the connection parameters
this.Init =function(url,username,password,tenantId,success)
{

	this.settings.url = url+"v2.0/tokens";
	this.settings.username = username;
	this.settings.password = password;
	this.settings.tenantId = tenantId;
	this.fetch_access_token();
    this.success = success;

}

//Utility function to fetch access token id and nova endpoint
this.fetch_access_token =  function()
{
var xhr = new XMLHttpRequest();
xhr.open('POST', this.settings.url, true);
var parent = this;
xhr.setRequestHeader('Content-type', 'application/json');
xhr.onload = function () {
    // do something to response
    console.log(this.responseText);

    var response = JSON.parse(this.responseText);
    try{
    parent.access_token = response.access.token.id;
    }
    catch(err){
        console.log("Error in json");
        parent.success('error');
        return;
    }
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
    		parent.nova_url = service.endpoints[0].publicURL;
    		console.log("Found Nova endpoint at "+parent.nova_url);
            parent.success('ok');

    	}
    }




};
xhr.onerror = function(){this.success('error')};
xhr.onabort = function(){this.success('error')};
xhr.send('{"auth":{"passwordCredentials":{"username": "'+this.settings.username+'", "password":"'+this.settings.password+'"}, "tenantId":"'+this.settings.tenantId+'"}}');
console.log('sent request');
}


this.list_images = function()
{
	//request we need to make
	request_service = "/images/detail";
	var xhr = new XMLHttpRequest();
xhr.open('GET', this.settings.nova_url+request_service, true);
xhr.setRequestHeader('Content-type', 'application/json');
xhr.setRequestHeader('X-Auth-Token', this.settings.access_token);
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



this.list_servers=function()
{
	//request we need to make
	request_service = "/servers/detail";
	var xhr = new XMLHttpRequest();
xhr.open('GET', this.settings.nova_url+request_service, true);
xhr.setRequestHeader('Content-type', 'application/json');
xhr.setRequestHeader('X-Auth-Token', this.settings.access_token);
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






};