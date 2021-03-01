function getServerData(url, success) {
    $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
    }).done(success);
}

function postServerData(url, data) {
    console.log("data: '" + data + "'");
    $.ajax({
        method: "POST",
        data: data,
        url: url,
        dataType: "json",
    }).done(console.log("request done"))
        .success(console.log("request succeed"))
        .fail(console.log("request failed"));
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
        var userJson = JSON.stringify({ name: "Bertrand",password:"789456", mapList: [], location: "London" });
        console.log(userJson);
        postServerData("ws/user/fakeUser", userJson);
    });
});