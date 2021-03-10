
/**
 * Initialization of the leaflet map
 * The map chosen is one from openstreetmap because it is open source
 */
function initMap(){
    var mymap = L.map('mapid').setView([48.858, 2.344], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        minZoom: 3,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZ2VvNzc4IiwiYSI6ImNrbHpiNm1kZjF5cjQzMW13eWJ4ZTJtZjQifQ.B90osSkX1G5azAlw6osvzQ'
    
    }).addTo(mymap);

    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(mymap);
    }
    mymap.on('click', onMapClick);

}

function showOverlay(){
    $(".overlay").css("visibility", function(){
        return "visible";
    });
}

function hideOverlay(){
    $(".overlay").css("visibility", function(){
        return "hidden";
    });
}

/**
 * This function loads all characteristics of the current user
 * (places and maps)
 */
function loadUser(){

    $.ajax({
        url: "ws/User/currentSession",
        dataType: "json",
    }).done(function(currentUser){
        console.log(currentUser);
        console.log("Welcome "+currentUser.name+" #"+currentUser.id);
        console.log("Your maps: "+currentUser.mapList);
        
        /**
         * TODO: here we will load all panels which need datas from the user
         */


    });
}


/**
 * Main
 */
$(document).ready(function () {
    console.log(Date());

    loadUser();
    initMap();
    $("#addAPlaceB").click(showOverlay);
    $("#closeButton").click(hideOverlay);
});