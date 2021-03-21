function getServerData(url, success) {
    $.ajax({
        url: url,
        dataType: "json",
    }).done(success);
}

function callDone(result) {
    var templateHtml = _.template($("#templateResult").html());

    var resInHtml = templateHtml({
        "attribute": JSON.stringify(result)
    });
    $("#res" + objectUsed).append(resInHtml);

}

function postServerData(url, data) {
    $.ajax({
        type: 'POST',
        data: data,
        contentType :"application/json; charSet=UTF-8",
        url: url,
        dataType: "json",
    }).done(console.log("data "+JSON.stringify(data)+" sent"));
}


var objectUsed = "";

/**
 * This is like the main, it is launched as soon as the document is ready
 */
$(document).ready(function () {

    var objList = ["User", "Map", "Place"];

    //Initialization of all get buttons
    for (const obj of objList) {

        $("#get" + obj).click(function () {
            objectUsed = obj
            getServerData("ws/" + obj + "/fake" + obj, callDone);
        });
    }

    //Initialization of all post buttons
    $("#postUser").click(function () {
        var user = {name: "Bertrand", password: "789456", mapList: []};
        postServerData("ws/User/fakeUser", user);
    }); 
    
    $("#postMap").click(function () {
        var map = {name: "A Map"};
        postServerData("ws/User/fakeUser", map);
    });

    $("#postPlace").click(function () {
        var place = {name: "A Place"};
        postServerData("ws/User/fakeUser", place);
    });

    $("#buttonTest").click(function (e) { 
        $("h1").text("changed dynamically!");
        
    });

});