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

function getServerData(url,callDone){
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function (response) {
            callDone(response);
        }
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

function addImageTo(fileName, place){

    var GetFileBlobUsingURL = function (url, convertBlob) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.addEventListener('load', function() {
            convertBlob(xhr.response);
        });
        xhr.send();
    };

    var blobToFile = function (blob, name) {
            blob.lastModifiedDate = new Date();
            blob.name = name;
            return blob;
    };

    var GetFileObjectFromURL = function(filePathOrUrl, convertBlob) {
        GetFileBlobUsingURL(filePathOrUrl, function (blob) {
            convertBlob(blobToFile(blob, 'testFile.jpg'));
        });
    };

    GetFileObjectFromURL("styles/images/"+fileName, function (file) {
        var fileReader = new FileReader(); 

        fileReader.onload = function(fileLoadedEvent){
            var image = fileLoadedEvent.target.result;
            postServerData("ws/Place/"+place.id+"/add/image",image,()=>{
                console.log("IMAGE LOADED SUCCESSFULLY");
            });
        }
        fileReader.readAsDataURL(file);        
    });
}

function addImagesToRomain(){
    // First, we add images of Kintaro and L'as du falafel:
    postServerData("ws/Place/name","L'as du Falafel",function(places){
        var imgFalafel = ["falafel3.png","falafel.jpg","falafel2.jpg"];
        var place = places[0];
        for (const imgName of imgFalafel) {
            addImageTo(imgName,place);
        }
    });
    postServerData("ws/Place/name","Kintaro",function(places){
        var imgKintaro = ["kintaro1.jpg","kintaro2.jpg","kintaro3.jpg"];
        var place = places[0];
        for (const imgName of imgKintaro) {
            addImageTo(imgName,place);
        }
    })
}

function addImagesBoulangerie(user){
    for(let i=0; i<user.places.length; i++){
        addImageTo("boulangerie"+(i+1)+".jpg",user.places[i]);
    }
}

function addImageRestaurant(user){
    for (let i = 0; i < user.places.length; i++) {
        addImageTo("restaurant"+i+".jpg",user.places[i]);
        
    }
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
                    if(newUser.name==="Romain"){
                        addImagesToRomain();
                    }
                    if(newUser.name==="MrBoulanger"){
                        addImagesBoulangerie(newUser);
                    }
                    if(newUser.name==="Alfredo"){
                        addImageRestaurant(newUser);
                    }
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