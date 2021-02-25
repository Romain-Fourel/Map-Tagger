function getServerData(url,success){
    $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
    }).done(success);
}

function postServerData(url,data){
    console.log("data: '"+data+"'");
    $.ajax({
        method: "POST",
        data: data,
        url: url,
        dataType: "json",
    }).done(console.log("request done"))
      .success(console.log("request succeed"))
      .fail(console.log("request failed"));
}

function callDone(result){
    var templateHtml = _.template($("#templateResult").html());

    var resInHtml = templateHtml({
        "attribute":JSON.stringify(result)
    });
    $("#res"+res).append(resInHtml);

}

var res = "";

/* This is like the main, is launched when the document is ready*/
$(document).ready(function () {         

    $("#getUser").click(function () { 
        res = "User";
        getServerData("ws/user/fakeUser",callDone);
    });

    $("#getMap").click(function () { 
        res = "Map";
        getServerData("ws/map/fakeMap",callDone);
    });

    $("#getPlace").click(function () { 
        res = "Place";
        getServerData("ws/place/fakePlace",callDone);
    });

    $("#postUser").click(function () { 
        var userJson = JSON.stringify({name:"Bertrand",mapList:[],location:"London"});  
        var userJs = {id:2,mapList:[],location:"London"};
        console.log(userJson);        
        postServerData("ws/glproject/user",userJson);
    });
});