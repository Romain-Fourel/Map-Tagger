

/**
 * try to get the user who has the given name and test if he has
 * entered the right password
 */
function connection(username,password){

    console.log("connection");
    data = username+"\n"+password;

    $.ajax({
        type: "POST",
        url: "ws/User/connection",
        data: data,
        contentType : "text/plain; charSet=UTF-8",
        dataType: "text",
    });
}


//main:
$(document).ready(function () {
    console.log("javascript file operational");

    $("#login").click(function () { 
        var username = $("#usernameId").val();
        var password = $("#passwordId").val(); 
        connection(username,password);
    });
    
});