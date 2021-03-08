

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
    
    //TODO: will return true only if the user has been found in the database
    return true;
}


/**
 * Main
 */
$(document).ready(function () {
    console.log("javascript file operational");

    $("#login").click(function () { 
        var username = $("#usernameId").val();
        var password = $("#passwordId").val(); 

        var connected = connection(username,password);

        if (connected){
            //TODO load the informations of the user connecte
            
            window.location.href="main.html";//here we go to the map tagger!
        }
        
    });
    
});