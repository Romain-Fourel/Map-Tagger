function getServerData(url, success) {
    $.ajax({
        url: url,
        dataType: "json",
    }).done(success);
}

    function postServerData(url, data) {
        console.log("data: '" + data + "'");
        $.ajax({
            type: 'POST',
            data: data,
            contentType :"application/json; charSet=UTF-8",
            url: url,
            dataType: "json",
        }).done(console.log("data sent"));
    }

function callDone(result) {
    var templateHtml = _.template($("#templateResult").html());

    var resInHtml = templateHtml({
        "attribute": JSON.stringify(result)
    });
    $("#res" + objectUsed).append(resInHtml);

}

var objectUsed = "";

/* This is like the main, is launched when the document is ready*/
$(document).ready(function () {

    var objList = ["User", "Map", "Place"];

    //Initialization of all get buttons
    for (const obj of objList) {

        $("#get" + obj).click(function () {
            objectUsed = obj
            getServerData("ws/" + obj + "/fake" + obj, callDone);
        });
    }

    $("#postUser").click(function () {
        var user = {name: "Bertrand", password: "789456", mapList: [], location: "London" };
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
});