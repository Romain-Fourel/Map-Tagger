
/**
 * try to get the user who has the given name and test if he has
 * entered the right password
 */
function connection(username,password){

    console.log("connection...");
    var data = username+"\n"+password;

    $.ajax({
        type: "POST",
        url: "ws/User/connection",
        data: data,
        contentType : "text/plain; charSet=UTF-8",
        dataType: "text",
        success: function (response) { 
            if (response !== "failed"){
                window.location.href="main.html";//here we go to the map tagger!
            }
            else{
                console.log("Error: the username and the password doesn't match");
            }
         }
    });
}

/**
 * Main
 */
$(document).ready(function () {
    //to ckeck if the file is correctly loaded
    console.log(Date());

    $("#login").click(function () { 
        var username = $("#usernameId").val();
        var password = $("#passwordId").val();

        connection(username,password);
    });
    
});