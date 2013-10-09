$(document).ready(function() {

	if (localStorage.alert) {

		$("#cpu").val(localStorage.cpu);
		$("#disk").val(localStorage.disk);
		$("#memory").val(localStorage.memory);
	}

	$("#save").click(function() {



		var intRegex = /^\d+$/;

		if (intRegex.test($("#cpu").val()) && intRegex.test($("#memory").val()) && intRegex.test($("#disk").val())) {
			localStorage.alert = true
			localStorage.cpu = $("#cpu").val();
			localStorage.memory = $("#memory").val();
			localStorage.disk = $("#disk").val();



			$("#message").html('<br/>Settings saved');
			$("#message").show();
			$("#message").fadeOut(7000);
		}
		else
		{
			$("#message").html('<br/><font color="red">Error , Check values entered</font>');
			$("#message").show();
			$("#message").fadeOut(7000);
		}



	});


});