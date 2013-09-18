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
nova.list_hosts(function(hosts){

console.log("List of running hosts are ");
console.dir(hosts);

$.Mustache.load('./templates/hosts.temp')
    .done(function () {
    	  $('#showhosts').html("");
        $('#showhosts').mustache('hosts', {"hosts":hosts});
    });

});


});