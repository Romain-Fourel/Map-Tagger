class LeafletManager {
    static map;

    constructor(){}

    static build(){
        console.log("built!!! ")
        LeafletManager.map = L.map('mapid').setView([48.858, 2.344], 13);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            minZoom: 3,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiZ2VvNzc4IiwiYSI6ImNrbHpiNm1kZjF5cjQzMW13eWJ4ZTJtZjQifQ.B90osSkX1G5azAlw6osvzQ'
        
        }).addTo(LeafletManager.map);     
        
    }

    static addLayer(layer){
        LeafletManager.map.addLayer(layer);
    }

    static removeLayer(layer){
        LeafletManager.map.removeLayer(layer);
    }

}


class PlaceManager {

    /**
     * A dictionary which contains as key places id and as value placeManagers
     * The goal is to be able to get one placeManager only with a place id, no more
     */
    static dict = new Map();

    static lastPointClicked = {latitude:0,longitude:0};

    constructor(place){
        this.place=place;
        this.marker=L.marker([place.latitude,place.longitude]);
        PlaceManager.dict.set(place.id,this);
    }

    /**
     * Create all buttons and text needed in the app
     */
    createInterface(){
        this.marker.bindPopup("<b>"+this.place.name+"</b>");
        this.marker.on('mouseover',function(e){
            this.openPopup();
        })
        this.marker.on('mouseout',function(e){
            this.closePopup();
        })

        var name = this.place.name;
        var description = this.place.description;
        this.marker.on('click',function(e){
    
            $("#onePlaceMenu h1").text(name);
            $("#onePlaceMenu p").text(description);
    
            closeSlidingPanel("#oneMapMenu");
            openSlidingPanel("#onePlaceMenu");
        })
    }

    update(updatedPlace) {
        this.place=updatedPlace;

        this.marker._popup.setContent("<b>"+this.place.name+"</b>");

        this.marker.unbind("click");
        var name = this.place.name;
        var description = this.place.description;
        this.marker.on('click',function(e){
    
            $("#onePlaceMenu h1").text(name);
            $("#onePlaceMenu p").text(description);
    
            closeSlidingPanel("#oneMapMenu");
            openSlidingPanel("#onePlaceMenu");
        })

    }

    static addAPlaceMode(){
        hideButtons();
        LeafletManager.map.on('click',showAddAPlaceMenu);
    }


    static showAddAPlaceMenu(event){
        PlaceManager.lastPointClicked.latitude = event.latlng.lat;
        PlaceManager.lastPointClicked.longitude = event.latlng.lng;
    
        showOverlay();
    
        $("#addAPlaceMenu").css("visibility", "visible");
    }



}


class MapManager {

    /**
     * A dictionary which contains as key maps id and as value mapManagers
     * The goal is to be able to get one mapManager only with a map id, no more
     */
    static dict = new Map();
    
    constructor(map,layerGroup){
        this.map=map;
        this.layerGroup=layerGroup;

        MapManager.dict.set(map.id,this);
    }

    createInterface(){
        //------"add a place" panel--------:
        var mapChoice = "<option value="+this.map.id+" id='optionMap"+this.map.id+"'>"+this.map.name+"</option>";
        $("#mapChoicePlace").append(mapChoice);

        //-------savedMaps panel-------:
        var isVisible="";
        if (this.map.visibility) {
            isVisible="checked";
        }

        var beginDiv="<div id='oneMapDiv"+this.map.id+"'>";
        var checkBoxMap = "<input type='checkbox' name='"+this.map.name+"' id='checkBoxMap"+this.map.id+"' "+isVisible+">";
        var labelMap= "<label for='"+this.map.name+"'>"+this.map.name+"</label>";
        var buttonOneMapMenu= "<button id='buttonOneMapMenu"+this.map.id+"'> > </button> </br>";
       
        $("#savedMapsButtons").append(beginDiv+checkBoxMap+labelMap+buttonOneMapMenu+"</div>");

        var map = this.map;
        $("#buttonOneMapMenu"+this.map.id).click(function(){
            console.log("clicked on "+map.name);
            MapManager.setOneMapMenu(map);
        });

        var layerGroup=this.layerGroup;
        var mapid = this.map.id;
        $("#checkBoxMap"+this.map.id).click(function(){
            var data = mapid+"\n";
            if($("#checkBoxMap"+mapid).prop("checked")){
                LeafletManager.addLayer(layerGroup);
                data = data+"True";
            }
            else{
                LeafletManager.removeLayer(layerGroup);
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

        if(this.map.places!==undefined){
            for (const place of this.map.places) {
                var placeManager = new PlaceManager(place);
                placeManager.createInterface();
                this.add(placeManager);
            }   
        }
        
        if(this.map.visibility){
            LeafletManager.addLayer(this.layerGroup);
        }
           
    }

    update(map){
        console.log("updating...");
        this.map = map;

        //--------update "add a place" panel-------- 
        $("#optionMap"+map.id).text(map.name);

        //--------update "saved map list" panel--------
        $("#oneMapDiv"+map.id+" label").text(map.name);

        //---update "one map menu" panel which is currently open---
        setOneMapMenu(map);

        $("#buttonOneMapMenu"+map.id).unbind("click");

        $("#buttonOneMapMenu"+map.id).click(function(){
            MapManager.setOneMapMenu(map);
        });

    }

    add(placeManager){
        this.map.places.push(placeManager.place);
        placeManager.marker.addTo(this.layerGroup);
    }

    static setOneMapMenu(map){
        console.log("setting up the menu...");
        closeSlidingPanel("#onePlaceMenu");
        openSlidingPanel("#oneMapMenu");

        $("#nameOneMapMenu").text(map.name);
        $("#descriptionOneMapMenu").text(map.description);
        

        console.log(map.places);

        $("#oneMapPlaces").text("");
       for (const place of map.places) {
            $("#oneMapPlaces").append("<label>"+place.name+"</label> </br>");
        }

    
        $("#modifyMap").unbind("click");
        $("#modifyMap").click(function (e) { 
    
            fillAddAMapMenu(map);
            showOverlay();
            $("#addAMapMenu").css("visibility", "visible");   
    
            $("#editMap").unbind("click");
            $("#editMap").click(function(){
                console.log("to update");       
                updateMap(map);
            });
    
        });
    }
    
}




/***
 *  ################ A NEW CODE BETTER AND CLEANER IS IN CONSTRUCTION ABOVE #######################
 */

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

    LeafletManager.map.off('click');
}

function showOverlay(){
    
    $(".overlay").css("visibility", function(){
        return "visible";
    });
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
/*
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
*/

/**
 * Create all buttons needed to handle the map in the whole application
 * @param {the map we want to add in the app} map 
 */
/*
function createMapButtons(map){

    //------"add a place" panel--------:
    var mapChoice = "<option value="+map.id+" id='optionMap"+map.id+"'>"+map.name+"</option>";
    $("#mapChoicePlace").append(mapChoice);

    //-------savedMaps panel-------:
    isVisible="";
    if (map.visibility) {
        isVisible="checked";
    }

    beginDiv="<div id='oneMapDiv"+map.id+"'>";
    checkBoxMap = "<input type='checkbox' name='"+map.name+"' id='checkBoxMap"+map.id+"' "+isVisible+">";
    labelMap= "<label for='"+map.name+"'>"+map.name+"</label>";
    buttonOneMapMenu= "<button id='buttonOneMapMenu"+map.id+"'> > </button> </br>";
    $("#savedMapsButtons").append(beginDiv+checkBoxMap+labelMap+buttonOneMapMenu+"</div>");

    $("#buttonOneMapMenu"+map.id).click(function (e) { 
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
*/

/*
function updateMapButtons(map){
    //--------update "add a place" panel-------- 
    $("#optionMap"+map.id).text(map.name);

    //--------update "saved map list" panel--------
    $("#oneMapDiv"+map.id+" label").text(map.name);

    //---update "one map menu" panel which is currently open---
    setOneMapMenu(map);

    $("#buttonOneMapMenu"+map.id).unbind("click");
    $("#buttonOneMapMenu"+map.id).click(function (e) { 
        oneMapMenuMode(map);
    });

}

function setOneMapMenu(map){
    $("#nameOneMapMenu").text(map.name);
    $("#descriptionOneMapMenu").text(map.description);
    

    $("#oneMapPlaces").text("");
   for (const place of map.places) {
        $("#oneMapPlaces").append("<label id='oneMapPlace"+place.id+"'>"+place.name+"</label> </br>");
    }

    $("#modifyMap").unbind("click");
    $("#modifyMap").click(function (e) { 

        fillAddAMapMenu(map);
        showOverlay();
        $("#addAMapMenu").css("visibility", "visible");   

        $("#editMap").unbind("click");
        $("#editMap").click(function(){
            console.log("to update");       
            updateMap(map);
        });

    });
}
*/


/*
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

        closeSlidingPanel("#oneMapMenu");
        openSlidingPanel("#onePlaceMenu");
    })

    myMarker.addTo(myLayerGroup);  
    
}
*/

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
            mapManager = new MapManager(map,L.layerGroup());
            mapManager.createInterface();
        }

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
    $("#editMap").unbind("click");//we unbind the button before assignment
    $("#editMap").click(function(){
        console.log("to create");
        createMap()
    });
    showOverlay();
    $("#addAMapMenu").css("visibility", "visible");
}

/*
function showAddAPlaceMenu(event){
    pointClicked.latitude = event.latlng.lat;
    pointClicked.longitude = event.latlng.lng;

    showOverlay();

    $("#addAPlaceMenu").css("visibility", "visible");
}
*/

function addAPlaceMode(){
    hideButtons();
    LeafletManager.map.on('click',PlaceManager.showAddAPlaceMenu);
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

            placeManager = new PlaceManager(newPlace);
            mapManager = MapManager.dict.get(mapid);
            placeManager.createInterface();

            mapManager.add(placeManager);
        }
    });

    hideOverlay();
    return true;
}

function updatePlace(place){
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

    var dataToSend = placeid+"\n"
                    +namePlace+"\n"
                    +descriptionPlace+"\n";

    $.ajax({
        type: "POST",
        contentType: "text/plain; charset=utf-8",
        dataType: "text",
        url: "ws/Place/update",
        data: dataToSend,
        success: function (updatedPlace) {
            updatedPlace = JSON.parse(updatedPlace);         
            updatePlaceInApp(updatedPlace);
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
                    +confidentiality+"\n";

    $.ajax({
        type: "POST",
        contentType: "text/plain; charset=utf-8",
        dataType: "text",
        url: "ws/Map/create",
        data: dataToSend,
        success: function (newMap) {
            newMap = JSON.parse(newMap);
            console.log(newMap);
            mapManager = new MapManager(newMap,L.layerGroup());
            mapManager.createInterface();

        }
    });

    hideOverlay();

}

function updateMap(map){
    var nameMap = $("#addNameMap").val();
    var descriptionMap = $("#addDescriptionMap").val();
    var confidentiality = $("#confidentialityChoiceMap").val();

    if(nameMap===""){
        alert("Please name this map");
        return false;           
    }
    
    var dataToSend = map.id+"\n"                
                    +nameMap+"\n"
                    +descriptionMap+"\n"
                    +confidentiality+"\n";

    $.ajax({
        type: "POST",
        contentType: "text/plain; charset=utf-8",
        dataType: "text",
        url: "ws/Map/update",
        data: dataToSend,
        success: function (updatedMap) {
            updatedMap = JSON.parse(updatedMap);
            var mapManager = MapManager.dict.get(updatedMap.id);
            mapManager.update(updatedMap);
        }
    });

    hideOverlay();   
}


/*
var mymap; // the map shown on the screen
var pointClicked = {latitude:0,longitude:0}; // the last point where the user has clicked
const dict = new Map();
*/

var currentUser; // the current user

/**
 * Main
 */
$(document).ready(function () {
    console.log(Date());
    console.log("Test 1.8");

    loadUser();
    LeafletManager.build();
    //initMap();
    
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
    
    $("#addAMapB").click(showAddAMapMenu);
    $("#addAMapMenuCloseB").click(hideOverlay);

});