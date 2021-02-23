function getServerData(url,success){
    console.log("on part récupérer le user à l'url "+url);
    $.ajax({
        url: url,
        dataType: "json",
    }).done(success);
}

function callDone(result){
    var templateHtml = _.template($("#templateResult").html());

    var resInHtml = templateHtml({
        "attribute":JSON.stringify(result)
    });

    console.log("On a récupéré le user!");
    console.log("il ressemble à ça: ")
    console.log(JSON.stringify(result));

    $("#resUser").append(resInHtml);

}

/* This is like the main, is launched when the document is ready*/
$(document).ready(function () {
    
});