
/**
 * If the confirmed password is the same as the password,
 * the user can be created. Otherwise, the creation is refused.
 * @param {the username of the new user} username 
 * @param {the password of the new password} password 
 * @param {the confirmed password} confirmedPassword 
 */
function createNewUser(username,password,confirmedPassword){
    if (password === confirmedPassword){
        console.log("creation...");
        
        var newUser = [username,password];
        $.ajax({
            type: "POST",
            url: "ws/User/create",
            data: JSON.stringify(newUser),
            contentType : "application/json; charSet=UTF-8",
            dataType: "json",
            success: function(res){
                console.log("succeed!!! "+res);
                window.location.href="main.html";//here we go to the map tagger!
            }
        }).done(function(res){
            console.log("done "+res);
            window.location.href="main.html";//here we go to the map tagger!            
        });
    }
    else{
        alert("Sorry the confirmed password doesn't match with the password");
    }
}


/**
 * Main
 */
$(document).ready(function () {
    console.log("test 1.0");

    $("#register-btn ").click(function () { 
        var username = $("#login").val();
        var password = $("#password").val(); 
        var confirmedPassword = $("#confirm-password").val();
        
        createNewUser(username,password,confirmedPassword);
    });
    
});