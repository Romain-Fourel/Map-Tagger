
/**
 * If the confirmed password is the same as the password,
 * the user can be created. Otherwise, the creation is refused.
 * @param {the username of the new user} username 
 * @param {the password of the new password} password 
 * @param {the confirmed password} confirmedPassword 
 */
function createNewUser(username,password,confirmedPassword){
    if (password === confirmedPassword){
        //TODO: later, the message will be printed directly in the page
        console.log("creation can be done");
        
        var newUser = {name: username,password:password,mapList:"[]",location:""} 
        $.ajax({
            type: "POST",
            url: "ws/User/creation",
            data: newUser,
            contentType : "application/json; charSet=UTF-8",
            dataType: "json",
        }).success(console.log("user successfully created"));
    }
    else{
        console.log("Sorry the confirmed password doesn't match with the password");
    }
}


/**
 * Main
 */
$(document).ready(function () {
    //to ckeck if the file is correctly loaded
    console.log(Date());

    $("#registration").click(function () { 
        var username = $("#usernameId").val();
        var password = $("#passwordId").val(); 
        var confirmedPassword = $("#confirmPasswordId").val();
        
        createNewUser(username,password,confirmedPassword);
    });
    
});