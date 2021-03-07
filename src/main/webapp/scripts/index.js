
/**
 * try to get the user who has the given name and test if he has
 * entered the right password
 */
function connexion(){
    console.log("connexion!");
}


//main:
$(document).ready(function () {
    console.log("javascript file operational");

    $("#login").click(function () { 
        var username = $("#usernameId").val();
        var password = $("#passwordId").val();
        console.log("username: "+username+"\nPassword: "+password);
        connexion();
    });
    
});