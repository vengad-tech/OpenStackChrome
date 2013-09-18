
function Nova()
{
//Server Configuration
this.settings = {}
this.settings.url = "http://localhost:5000/v2.0/tokens"
this.settings.username = "admin"
this.settings.password = "admin"
this.settings.tenantId = "45ab8b75ab3e4d3b9ec34d37886e6ba8"
this.settings.access_token =""
this.settings.hosts = []





//Intialize the connection parameters
this.Init =function(url,username,password,tenantId,success)
{

	this.settings.url = url+"v2.0/tokens";
	this.settings.username = username;
	this.settings.password = password;
	this.settings.tenantId = tenantId;
	this.fetch_access_token();
    this.success = success;
    localStorage.url = url;



}


//Intialize to call when we are already authorized , i.e load  credentials from an already logged in session
this.Load =function()
{

  this.settings.url =  localStorage.url;
  console.log("Loaded url "+this.settings.url);
   this.settings.access_token =  localStorage.access_token;
   console.log("Loaded access_token"+this.settings.access_token);
    this.settings.nova_url = localStorage.nova_url;
    console.log("Loaded nova url "+this.settings.nova_url);

   

};




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
    localStorage.access_token = response.access.token.id;
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
            localStorage.nova_url = service.endpoints[0].publicURL;
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



this.list_servers=function(servers_success)
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
     servers_success(response);
     for(i=0;i<response.servers.length;i++)
     {

     	server = response.servers[i];
     	console.log(server.name+" "+server.status);
     }

   




};


xhr.send();
console.log('sent request for listing images');

}

//get list of hosts available
this.list_hosts=function(host_success)
{
    //request we need to make
    this.settings.hosts = [];
    request_service = "/os-hosts";
    hosts = [];
   var  parent = this;
    var xhr = new XMLHttpRequest();
xhr.open('GET', this.settings.nova_url+request_service, true);
xhr.setRequestHeader('Content-type', 'application/json');
xhr.setRequestHeader('X-Auth-Token', this.settings.access_token);
xhr.onload = function () {
    // do something to response
    console.log(this.responseText);
     var response = JSON.parse(this.responseText);
    
     for(i=0;i<response.hosts.length;i++)
     {

        host = response.hosts[i];
        hosts.push(host.host_name);
        console.log(host.host_name);
        
        //we are sending the required callback to the last hostname describe that inimates our function
        //caller regarding the completion of function
       

     }
     hosts = $.unique(hosts);
     for(i = 0 ; i < hosts.length ; i++)
     {
         if(i == (hosts.length-1))
        parent.list_host_detail(hosts[i], host_success);
    else
        parent.list_host_detail(hosts[i], function(){});

     }

console.dir(hosts);

   




};
xhr.send();
}
//get list of hosts available
this.list_host_detail=function(hostname,host_success)
{
    //request we need to make
    console.log("Fetching details of host"+hostname);
    request_service = "/os-hosts/"+hostname;
    var parent = this;
    var xhr = new XMLHttpRequest();
xhr.open('GET', this.settings.nova_url+request_service, true);
xhr.setRequestHeader('Content-type', 'application/json');
xhr.setRequestHeader('X-Auth-Token', this.settings.access_token);
xhr.onload = function () {
    // do something to response
    console.log(this.responseText);
     var response = JSON.parse(this.responseText);

    resource = "";
    usage= {}
     for(i=0;i<response.host.length;i++)
     {

        resource = response.host[i];

        console.log(resource.resource.project);
        usage[resource.resource.project] = [resource.resource.memory_mb,resource.resource.cpu,resource.resource.disk_gb]
       
        

     }
     //caculating the percentage of usage of resources
     parent.settings.hosts.push({"name":hostname ,  "memory": Math.round((usage['(used_now)'][0] / usage['(total)'][0])*100) , 

     "cpu":  Math.round((usage['(used_now)'][1] / usage['(total)'][1])*100) , 

     "disk":  Math.round((usage['(used_now)'][2] / usage['(total)'][2])*100)  

 });
  




console.dir(parent.settings.hosts[hostname]);
host_success(parent.settings.hosts);

   




};

xhr.send();
console.log('sent request for listing images');

}






};