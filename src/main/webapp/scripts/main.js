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

function hideOverlay(){
    $(".overlay").css("visibility", "hidden");
    $(".overlay .PopupMenu").css("visibility", "hidden");
    showButtons();

    mymap.off('click');
}

function rightMenuMode(id){
    $("#"+id).css("right", -50);
}

function rightMenuQuit(id){
    $("#"+id).css("right", -370)
}


function savedMapsMode(){
    $("#savedMapsMenu").css("right", -50);
}

function savedMapsQuit(){
    $("#savedMapsMenu").css("right", -370);
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
 * Create all buttons needed to handle the map in the whole application
 * @param {the map we want to add in the app} map 
 */
function createMapButtons(map){

    console.log(map);

    //------"add a place" panel--------:
    var mapChoice = "<option value="+map.id+">"+map.name+"</option>";
    $("#mapChoicePlace").append(mapChoice);

    //-------savedMaps panel-------:
    isVisible="";
    if (map.visibility) {
        isVisible="checked";
    }

    buttonMap = "<input type='checkbox' name='"+map.name+"' id='map"+map.id+"' "+isVisible+"> <label for='"+map.name+"'>"+map.name+"</label><br />"
    $("#savedMapsButtons").append(buttonMap);

    $("#map"+map.id).click(function(){
        var data = map.id+"\n";
        if($("#map"+map.id).prop("checked")){
            mymap.addLayer(dict.get(map.id));
            data = data+"True";
        }
        else{
            mymap.removeLayer(dict.get(map.id));
            data = data+"False";
        }

        $.ajax({
            type: "POST",
            contentType: "text/plain; charset=utf-8",
            dataType: "text",
            url: "ws/Map/update/visibility",
            data: data,
        });

    });  

    //------------- To show places on the leaflet map and store them -----------
    var myLayerGroup = L.layerGroup();
    if(map.places!==undefined){
        for (const place of map.places) {
            L.marker([place.latitude,place.longitude]).addTo(myLayerGroup);  
        }   
    }
    
    if(map.visibility){
        mymap.addLayer(myLayerGroup);
        myLayerGroup.addTo(mymap);
    }
    
    dict.set(map.id,myLayerGroup);
    
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
        currentUser = user;
        
        for (const map of currentUser.mapList) {
            createMapButtons(map);
        }

    });
}


function showOverlay(){
    
    $(".overlay").css("visibility", function(){
        return "visible";
    });
}



function showAddAMapMenu(){
    console.log("show add a map menu!!");
    showOverlay();
    $("#addAMapMenu").css("visibility", "visible");
}

function showAddAPlaceMenu(event){
    pointClicked.latitude = event.latlng.lat;
    pointClicked.longitude = event.latlng.lng;

    showOverlay();

    $("#addAPlaceMenu").css("visibility", "visible");
}

function addAPlaceMode(){
    hideButtons();
    mymap.on('click',showAddAPlaceMenu);
}


function createPlace(){

    var namePlace = $("#addNamePlace").val();
    var descriptionPlace = $("#addDescriptionPlace").val();
    var mapChose = $("#mapChoicePlace").val();

    if (namePlace==="" && mapChose==="CAMap"){
        alert("Please name this place and choose a map to put it in");
        return false;
    }
    else if(namePlace==="" ){
        alert("Please name this place");
        return false;       
    }
    else if(mapChose==="CAMap"){
        alert("Please choose a map to put your place in");
        return false;       
    }

    var dataToSend = namePlace+"\n"
                    +descriptionPlace+"\n"
                    +mapChose+"\n"
                    +pointClicked.latitude+"\n"
                    +pointClicked.longitude;

    $.ajax({
        type: "POST",
        contentType: "text/plain; charset=utf-8",
        dataType: "text",
        url: "ws/Place/create",
        data: dataToSend,
        success: function (newPlace) {
            newPlace = JSON.parse(newPlace);         
            var mapid= parseInt(mapChose);
            L.marker([newPlace.latitude,newPlace.longitude]).addTo(dict.get(mapid));
        }
    });

    hideOverlay();
    return true;
}


function createMap(){
    var nameMap = $("#addNameMap").val();
    var descriptionMap = $("#addDescriptionMap").val();
    var confidentiality = $("#confidentialityChoiceMap").val();

    if(nameMap===""){
        alert("Please name this map");
        return false;           
    }
    
    var dataToSend = nameMap+"\n"
                    +descriptionMap+"\n"
                    +confidentiality+"\n"
                    +currentUser.name;

    $.ajax({
        type: "POST",
        contentType: "text/plain; charset=utf-8",
        dataType: "text",
        url: "ws/Map/create",
        data: dataToSend,
        success: function (newMap) {
            newMap = JSON.parse(newMap);
            createMapButtons(newMap);
        }
    });

    hideOverlay();

}


var mymap; // the map shown on the screen
var currentUser; // the current user
var pointClicked = {latitude:0,longitude:0}; // the last point where the user has clicked

/**
 * The dictionnary (map) has map.id for its keys and a LayerGroup for its values
 */
const dict = new Map();

/**
 * Main
 */
$(document).ready(function () {
    console.log(Date());
    console.log("test 21");

    loadUser();
    initMap();
    
    /**
     * all "clicks" features
     */

    listMenus = ["savedMaps","communityMaps","placesList"];

    for (const menu of listMenus) {
        $("#"+menu+"MenuQuit").click(function(){
            rightMenuQuit(menu+"Menu");
        });

        $("#"+menu+"B").click(function (){
            rightMenuMode(menu+"Menu");
        });
    
    }

    $("#addAPlaceB").click(addAPlaceMode);
    $(".CloseButton").click(hideOverlay);
    $("#createPlace").click(createPlace);
    $("#createMap").click(createMap);
    
    $("#addAMapB").click(showAddAMapMenu);
    $("#addAMapMenuCloseB").click(hideOverlay);

});