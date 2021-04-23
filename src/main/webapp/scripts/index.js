function postServerData(url,data,callDone){
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: url,
        data: data,
        success: callDone
    });
}


/**
 * try to get the user who has the given name and test if he has
 * entered the right password
 */
function connection(username,password){

    var data = JSON.stringify([username,password]);

    postServerData("ws/User/connection",data,function(response){
        if (response){
            window.location.href="main.html";//here we go to the map tagger!
        }
        else{
            alert("Error: the username and the password doesn't match");
        }
    })
}



/**
 * Main
 */
$(document).ready(function () {

    /**
     * We load a fake user in the database:
     */
    $.getJSON("scripts/data.json",function (data) {
            for (const user of data) {
                postServerData("ws/User/add",JSON.stringify(user),function(newUser){
                    console.log(newUser);
                });                
            }
        }
    );


    $("#login-btn").click(function () { 
        var username = $("#login").val();
        var password = $("#password").val();

        connection(username,password);
    });
    
});