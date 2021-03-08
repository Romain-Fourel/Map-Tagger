
/**
 * Send to the server a json data
 * @param {the path to the server} url 
 * @param {the data which is sent} data 
 * */
function postServerJsonData(url, data) {
    $.ajax({
        type: 'POST',
        data: data,
        contentType :"application/json; charSet=UTF-8",
        url: url,
        dataType: "json",
    }).done(console.log("data "+JSON.stringify(data)+" sent"));
}


/**
 * try to get the user who has the given name and test if he has
 * entered the right password
 */
function connection(username,password){

    data = username+"\n"+password;

    $.ajax({
        type: "POST",
        url: "ws/User/connection",
        data: data,
        contentType : "text/plain; charSet=UTF-8",
        dataType: "text",
    }).success(console.log("data: "+data+"\nHas been successfully sent to the server"));


}


//main:
$(document).ready(function () {
    console.log("javascript file operational");

    $("#login").click(function () { 
        var username = $("#usernameId").val();
        var password = $("#passwordId").val(); 
        console.log(password.type);     
        connection(username,password);
    });
    
});