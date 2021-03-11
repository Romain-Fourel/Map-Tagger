function hideRightButtons(){
    $("#right button").css("visibility", function(){
        return "hidden";
    });
}

function showRightButtons(){
    $("#right button").css("visibility", function(){
        return "visible";
    });
}


function hideButtons(){
    $("#buttons button").css("visibility", function(){
        return "hidden";
    });
}

function showButtons(){
    $("#buttons button").css("visibility", function(){
        return "visible";
    }); 
}


function showOverlay(){
    $(".overlay").css("visibility", function(){
        return "visible";
    });
    console.log(currentUser);
    for (const map of currentUser.mapList) {
        var mapChoice = "<option value="+map.id+">"+map.name+"</option>";
        $("#mapChoicePlace").append(mapChoice);
    }
}

function hideOverlay(){
    $(".overlay").css("visibility", function(){
        return "hidden";
    });
    showButtons();
    mymap.off('click');
}


/**
 * Initialization of the leaflet map
 * The map chosen is one from openstreetmap because it is open source
 */
function initMap(){
    mymap = L.map('mapid').setView([48.858, 2.344], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        minZoom: 3,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZ2VvNzc4IiwiYSI6ImNrbHpiNm1kZjF5cjQzMW13eWJ4ZTJtZjQifQ.B90osSkX1G5azAlw6osvzQ'
    
    }).addTo(mymap);
}

/**
 * This function loads all characteristics of the current user
 * (places and maps)
 */
function loadUser(){

    $.ajax({
        url: "ws/User/currentSession",
        dataType: "json",
    }).done(function(user){
        console.log("Welcome "+user.name+" #"+user.id);

        showUserPlaces(user);

        currentUser = user;
        
        /**
         * TODO: here we will load all panels which need datas from the user
         */
        return user;
    });
}

/**
 * Shows on the map all places of a specific user
 * @param {the user who we want to show his places} user 
 */
function showUserPlaces(user){
    for (const map of user.mapList) {
        if (map.isVisible) {
            for (const place of map.places) {
                showPlace(place);
            }
        }
    }
}

/**
 * TODO, we have to show also other data of the place
 * @param {the place we want to show} place 
 */
function showPlace(place) {
    L.marker([place.latitude,place.longitude]).addTo(mymap);
}



function addAPlaceMode(){
    hideButtons();
    mymap.on('click',showOverlay);
}


function createPlace(){

    var namePlace = $("#namePlace").val();
    var descriptionPlace = $("#descriptionPlace").val();
    var mapChose = $("#mapChoicePlace").val();

    console.log(namePlace);
    console.log(descriptionPlace);
    console.log(mapChose);

    var dataToSend = namePlace+"\n"+descriptionPlace+"\n"+mapChose;

    $.ajax({
        type: "POST",
        contentType: "text/plain; charset=utf-8",
        dataType: "text",
        url: "ws/Place/create",
        data: dataToSend,
        success: function (newPlace) {
            console.log(newPlace);
            L.marker([newPlace.latitude,newPlace.longitude]).addTo(mymap);
        }
    });
}



var mymap;
var currentUser;

/**
 * Main
 */
$(document).ready(function () {
    console.log(Date());
    console.log("test 3");
      
    loadUser();
    initMap();

    /**
     * all "clicks" features
     */
    $("#createPlace").click(createPlace);
    $("#closeButton").click(hideOverlay);
    $("#addAPlaceB").click(addAPlaceMode);
});