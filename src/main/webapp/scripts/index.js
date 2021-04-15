
/**
 * try to get the user who has the given name and test if he has
 * entered the right password
 */
function connection(username,password){

    var data = [username,password];

    $.ajax({
        type: "POST",
        url: "ws/User/connection",
        data: JSON.stringify(data),
        contentType : "application/json; charSet=UTF-8",
        dataType: "json",
        success: function (response) { 
            //TODO: failed option in success response is not vrey good
            if (response){
                window.location.href="main.html";//here we go to the map tagger!
            }
            else{
                alert("Error: the username and the password doesn't match");
            }
         }
    });
}

/**
 * Main
 */
$(document).ready(function () {

    $("#login-btn").click(function () { 
        var username = $("#login").val();
        var password = $("#password").val();

        connection(username,password);
    });
    
});