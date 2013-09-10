if(!localStorage.isLogin)
{
window.location.assign("./index.html");
}


//when the page gets completely loaded
$(document).ready(function(){
//check for login status



//configuring nova with access token , obtained by login
var nova = new Nova();
nova.Load();
console.log("Using Access token "+nova.settings.access_token);
nova.list_servers(function(servers){

console.log("List of running servers are ");
console.dir(servers);

$.Mustache.load('./templates/instances.temp')
    .done(function () {
    	  $('#showinstances').html("");
        $('#showinstances').mustache('instances', servers);
    });

});


});