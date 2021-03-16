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

function openSlidingPanel(id){
    $(id).css("right", -50);
}

function closeSlidingPanel(id){
    $(id).css("right", -370)
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

    //------"add a place" panel--------:
    var mapChoice = "<option value="+map.id+">"+map.name+"</option>";
    $("#mapChoicePlace").append(mapChoice);

    //-------savedMaps panel-------:
    isVisible="";
    if (map.visibility) {
        isVisible="checked";
    }

    checkBoxMap = "<input type='checkbox' name='"+map.name+"' id='checkBoxMap"+map.id+"' "+isVisible+">";
    labelMap= "<label for='"+map.name+"'>"+map.name+"</label>"
    buttonModifyMap= "<button id='buttonModifyMap"+map.id+"'> > </button> </br>";
    $("#savedMapsButtons").append(checkBoxMap+labelMap+buttonModifyMap);

    $("#buttonModifyMap"+map.id).click(function (e) { 
        console.log("clicked on map#"+map.id);
        oneMapMenuMode(map);
    });

    $("#checkBoxMap"+map.id).click(function(){
        var data = map.id+"\n";
        if($("#checkBoxMap"+map.id).prop("checked")){
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
            addPlaceToApp(place,myLayerGroup);
        }   
    }
    
    if(map.visibility){
        mymap.addLayer(myLayerGroup);
        myLayerGroup.addTo(mymap);
    }
    
    dict.set(map.id,myLayerGroup);
    
}

function oneMapMenuMode(map){
    $("#oneMapMenu h1").text(map.name);
    $("#oneMapMenu p").text(map.description);
    openSlidingPanel("#oneMapMenu");

    $("#oneMapPlaces").text("");
    for (const place of map.places) {
        $("#oneMapPlaces").append("<label id='oneMapPlace"+place.id+"'>"+place.name+"</label> </br>");
    }

    $("#modifyMap").click(function (e) { 
        fillAddAMapMenu(map);
        showAddAMapMenu();       
    });

}


function addPlaceToApp(place,myLayerGroup){
    var myMarker = L.marker([place.latitude,place.longitude]);
    myMarker.bindPopup("<b>"+place.name+"</b>");
    myMarker.on('mouseover',function(e){
        this.openPopup();
    })
    myMarker.on('mouseout',function(e){
        this.closePopup();
    })
    myMarker.on('click',function(e){

        $("#onePlaceMenu h1").text(place.name);
        $("#onePlaceMenu p").text(place.description);

        openSlidingPanel("#onePlaceMenu");
    })

    myMarker.addTo(myLayerGroup);  
}

/**
 * Create buttons of all public maps in the community maps sliding panel
 */
function loadCommunityMapsButtons(){

    $.ajax({
        type: "GET",
        url: "ws/Map/allPublic",
        dataType: "json",
        success: function (mapList) {
            $("#communityMapsButtons").text("");
            for (const map of mapList) {
                var mapButtonHtml = "<button id='communityMap"+map.id+"'>"+map.name+"</button></br>";
                $("#communityMapsButtons").append(mapButtonHtml);
            }
        }
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

/**
 * When the user want to modify a map, we want to show the map creation panel. But not empty!
 * We want to put in the data already put by ther user! So He can CHANGE the map, and not CREATE it
 * @param {the map we want to show informations} map 
 */
function fillAddAMapMenu(map){
    $("#addNameMap").val(map.name);
    $("#addDescriptionMap").val(map.description);
    $("#confidentialityChoiceMap").val(map.confidentiality);
}

function showAddAMapMenu(){
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
            addPlaceToApp(newPlace,dict.get(mapid));
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
    console.log("Test 1.2");

    loadUser();
    initMap();
    
    /**
     * all "clicks" features
     */

    listMenus = ["savedMaps","communityMaps","placesList"];

    for (const menu of listMenus) {
        $("#"+menu+"MenuQuit").click(function(){
            closeSlidingPanel("#"+menu+"Menu");
        });

        $("#"+menu+"B").click(function (){
            openSlidingPanel("#"+menu+"Menu");
        });
    
    }

    $("#onePlaceMenuQuit").click(function (e) { 
        closeSlidingPanel("#onePlaceMenu");     
    });
    $("#oneMapMenuQuit").click(function (e) { 
        closeSlidingPanel("#oneMapMenu"); 
    });

    $("#communityMapsB").click(loadCommunityMapsButtons);
    

    $("#addAPlaceB").click(addAPlaceMode);
    $(".CloseButton").click(hideOverlay);
    $("#createPlace").click(createPlace);
    $("#createMap").click(createMap);
    
    $("#addAMapB").click(showAddAMapMenu);
    $("#addAMapMenuCloseB").click(hideOverlay);

});