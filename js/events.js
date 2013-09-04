$(document).ready(function(){
	console.log("Extension loaded");
$("#loginBtn").click(function(){
console.log("Handling Login event");
//instantiate nova object
var nova = new Nova();
//fetch the credentials from the form
var url = $("#url").val();
var username = $("#username").val();
var password = $("#password").val();
var tentantId = $("#tentantid").val();
//lets try to log in
try{
nova.Init(url,username,password,tentantId,function(status){
if(status=="ok")
	console.log("Logged in successfully accesstoken"+nova.settings.access_token);
else
{
	console.log("Unable to log you you in check credentials and connection");
	$(".error").show();
}

});
}
catch(err)
{
	console.log("Error Occured while loggin in");
	$(".error").show();
}




});


});