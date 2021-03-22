class LeafletManager {
    static map;

    constructor() { }

    static build() {
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

    static addLayer(layer) {
        LeafletManager.map.addLayer(layer);
    }

    static removeLayer(layer) {
        LeafletManager.map.removeLayer(layer);
    }

}



function hideButtons() {
    $("#buttons button").css("visibility", function () {
        return "hidden";
    });
}

function showButtons() {
    $("#buttons button").css("visibility", function () {
        return "visible";
    });
}



function hideOverlay() {
    $(".overlay").css("visibility", "hidden");
    $(".overlay .PopupMenu").css("visibility", "hidden");
    showButtons();

    LeafletManager.map.off('click');
}

function showOverlay() {

    $(".overlay").css("visibility", function () {
        return "visible";
    });
}



function openSlidingPanel(id) {
    $(id).css("right", -50);
}

function closeSlidingPanel(id) {
    $(id).css("right", -370)
}




class PlaceManager {

    /**
     * A dictionary which contains as key places id and as value placeManagers
     * The goal is to be able to get one placeManager only with a place id, no more
     */
    static dict = new Map();

    static lastPointClicked = { latitude: 0, longitude: 0 };

    constructor(place,mapid) {
        this.place = place;
        this.marker = L.marker([place.latitude, place.longitude]);
        this.mapid = mapid; // the id of the map which contains this place
        PlaceManager.dict.set(place.id, this);
    }

    /**
     * Create all buttons and text needed in the app
     */
    createInterface() {
        this.marker.bindPopup("<b>" + this.place.name + "</b>");
        this.marker.on('mouseover', function (e) {
            this.openPopup();
        })
        this.marker.on('mouseout', function (e) {
            this.closePopup();
        })

        var place = this.place;
        this.marker.on('click', function (e) {

            PlaceManager.setOnePlaceMenu(place);
        })
    }

    update(updatedPlace) {
        this.place = updatedPlace;

        this.marker._popup.setContent("<b>" + this.place.name + "</b>");

        PlaceManager.setOnePlaceMenu(updatedPlace);

        this.marker.off("click");
        this.marker.on('click', function (e) {

            PlaceManager.setOnePlaceMenu(updatedPlace);
        })
    }

    static setOnePlaceMenu(place){
        
        $("#onePlaceMenu h1").text(place.name);
        $("#onePlaceMenu p").text(place.description);

        closeSlidingPanel("#oneMapMenu");
        openSlidingPanel("#onePlaceMenu");    
        
        $("#modifyPlace").click(function (e) { 
            PlaceManager.showUpdateAPlaceMenu(place);
        });
    }
    
    static createPlace() {
    
        var namePlace = $("#addNamePlace").val();
        var descriptionPlace = $("#addDescriptionPlace").val();
        var mapChose = $("#mapChoicePlace").val();
    
        if (namePlace === "" && mapChose === "CAMap") {
            alert("Please name this place and choose a map to put it in");
            return false;
        }
        else if (namePlace === "") {
            alert("Please name this place");
            return false;
        }
        else if (mapChose === "CAMap") {
            alert("Please choose a map to put your place in");
            return false;
        }
    
        var dataToSend = namePlace + "\n"
            + descriptionPlace + "\n"
            + mapChose + "\n"
            + PlaceManager.lastPointClicked.latitude + "\n"
            + PlaceManager.lastPointClicked.longitude;
    
        $.ajax({
            type: "POST",
            contentType: "text/plain; charset=utf-8",
            dataType: "text",
            url: "ws/Place/create",
            data: dataToSend,
            success: function (newPlace) {
                newPlace = JSON.parse(newPlace);
                var mapid = parseInt(mapChose);
    
                var placeManager = new PlaceManager(newPlace,mapid);
                var mapManager = MapManager.dict.get(mapid);
                placeManager.createInterface();
    
                mapManager.add(placeManager);
            }
        });
    
        hideOverlay();
        return true;
    }
    
    static updatePlace(place) {
        var namePlace = $("#addNamePlace").val();
        var descriptionPlace = $("#addDescriptionPlace").val();
        //var mapChose = $("#mapChoicePlace").val();
    
        if (namePlace === "" && mapChose === "CAMap") {
            alert("Please name this place and choose a map to put it in");
            return false;
        }
        else if (namePlace === "") {
            alert("Please name this place");
            return false;
        }
        /*TODO: maybe later the user will be able to change the map which contains his place */
        /*else if (mapChose === "CAMap") {
            alert("Please choose a map to put your place in");
            return false;
        }*/
    
        var dataToSend = place.id + "\n"
            + namePlace + "\n"
            + descriptionPlace + "\n";
    
        $.ajax({
            type: "POST",
            contentType: "text/plain; charset=utf-8",
            dataType: "text",
            url: "ws/Place/update",
            data: dataToSend,
            success: function (updatedPlace) {
                updatedPlace = JSON.parse(updatedPlace);
                var placeManager = PlaceManager.dict.get(updatedPlace.id);
                placeManager.update(updatedPlace);
            }
        });
    
        hideOverlay();
        return true;
    }
    

    static addAPlaceMode() {
        hideButtons();
        LeafletManager.map.on('click', PlaceManager.showAddAPlaceMenu);
    }


    static showAddAPlaceMenu(event) {
        PlaceManager.lastPointClicked.latitude = event.latlng.lat;
        PlaceManager.lastPointClicked.longitude = event.latlng.lng;

        $("#editPlace").unbind("click");//we unbind the button before assignment
        $("#editPlace").click(function () {
            PlaceManager.createPlace()
        });

        showOverlay();

        $("#addAPlaceMenu").css("visibility", "visible");
        $("#mapChoicePlace").css("visibility", "inherited");
    }

    static fillAddAPlaceMenu(place){
        $("#addNamePlace").val(place.name);
        $("#addDescriptionPlace").val(place.description);
        $("#mapChoicePlace").val(place.confidentiality);        
    }

    static showUpdateAPlaceMenu(place){

        PlaceManager.fillAddAPlaceMenu(place);

        $("#editPlace").unbind("click");//we unbind the button before assignment
        $("#editPlace").click(function () {
            PlaceManager.updatePlace(place);
        });

        showOverlay();

        $("#addAPlaceMenu").css("visibility", "visible");   
        $("#mapChoicePlace").css("visibility", "hidden");    
    }

}


class MapManager {

    /**
     * A dictionary which contains as key maps id and as value mapManagers
     * The goal is to be able to get one mapManager only with a map id, no more
     */
    static dict = new Map();

    constructor(map) {
        this.map = map;
        this.layerGroup = L.layerGroup();

        MapManager.dict.set(map.id, this);
    }

    createInterface() {
        //------"add a place" panel--------:
        var mapChoice = "<option value=" + this.map.id + " id='optionMap" + this.map.id + "'>" + this.map.name + "</option>";
        $("#mapChoicePlace").append(mapChoice);

        //-------savedMaps panel-------:
        var isVisible = "";
        if (this.map.visibility) {
            isVisible = "checked";
        }

        var beginDiv = "<div id='oneMapDiv" + this.map.id + "'>";
        var checkBoxMap = "<input type='checkbox' name='" + this.map.name + "' id='checkBoxMap" + this.map.id + "' " + isVisible + ">";
        var labelMap = "<label for='" + this.map.name + "'>" + this.map.name + "</label>";
        var buttonOneMapMenu = "<button id='buttonOneMapMenu" + this.map.id + "'> > </button> </br>";

        $("#savedMapsButtons").append(beginDiv + checkBoxMap + labelMap + buttonOneMapMenu + "</div>");

        var map = this.map;
        $("#buttonOneMapMenu" + this.map.id).click(function () {
            console.log("clicked on " + map.name);
            MapManager.setOneMapMenu(map);
        });

        var layerGroup = this.layerGroup;
        var mapid = this.map.id;
        $("#checkBoxMap" + this.map.id).click(function () {
            var data = mapid + "\n";
            if ($("#checkBoxMap" + mapid).prop("checked")) {
                LeafletManager.addLayer(layerGroup);
                data = data + "True";
            }
            else {
                LeafletManager.removeLayer(layerGroup);
                data = data + "False";
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

        if (this.map.places !== undefined) {
            for (const place of this.map.places) {
                var placeManager = new PlaceManager(place,mapid);
                placeManager.createInterface();
                placeManager.marker.addTo(this.layerGroup);
            }
        }


        if (this.map.visibility) {
            LeafletManager.addLayer(this.layerGroup);
        }

    }

    update(map) {
        console.log("updating...");
        this.map = map;

        //--------update "add a place" panel-------- 
        $("#optionMap" + map.id).text(map.name);

        //--------update "saved map list" panel--------
        $("#oneMapDiv" + map.id + " label").text(map.name);

        //---update "one map menu" panel which is currently open---
        MapManager.setOneMapMenu(map);

        $("#buttonOneMapMenu" + map.id).unbind("click");

        $("#buttonOneMapMenu" + map.id).click(function () {
            MapManager.setOneMapMenu(map);
        });

    }

    add(placeManager) {
        this.map.places.push(placeManager.place);
        placeManager.marker.addTo(this.layerGroup);
    }


    static createMap() {
        var nameMap = $("#addNameMap").val();
        var descriptionMap = $("#addDescriptionMap").val();
        var confidentiality = $("#confidentialityChoiceMap").val();
    
        if (nameMap === "") {
            alert("Please name this map");
            return false;
        }
    
        var dataToSend = nameMap + "\n"
            + descriptionMap + "\n"
            + confidentiality + "\n";
    
        $.ajax({
            type: "POST",
            contentType: "text/plain; charset=utf-8",
            dataType: "text",
            url: "ws/Map/create",
            data: dataToSend,
            success: function (newMap) {
                newMap = JSON.parse(newMap);
                console.log(newMap);
                mapManager = new MapManager(newMap, L.layerGroup());
                mapManager.createInterface();
    
            }
        });
    
        hideOverlay();
    
    }

    static updateMap(map) {
        var nameMap = $("#addNameMap").val();
        var descriptionMap = $("#addDescriptionMap").val();
        var confidentiality = $("#confidentialityChoiceMap").val();
    
        if (nameMap === "") {
            alert("Please name this map");
            return false;
        }
    
        var dataToSend = map.id + "\n"
            + nameMap + "\n"
            + descriptionMap + "\n"
            + confidentiality + "\n";
    
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

    static setOneMapMenu(map) {
        closeSlidingPanel("#onePlaceMenu");
        openSlidingPanel("#oneMapMenu");

        $("#nameOneMapMenu").text(map.name);
        $("#descriptionOneMapMenu").text(map.description);

        $("#oneMapPlaces").text("");
        for (const place of map.places) {
            var div = "<div id='oneMapPlace"+place.id+"'>"
        
            var label = " <label>" + place.name + "</label>";
            $("#oneMapPlaces").append(div+label+" </div></br>");
        }


        $("#modifyMap").unbind("click");
        $("#modifyMap").click(function (e) {
            MapManager.showUpdateAMapMenu(map);
        });
    }

    static loadCommunityMapsButtons() {

        $.ajax({
            type: "GET",
            url: "ws/Map/allPublic",
            dataType: "json",
            success: function (mapList) {
                $("#communityMapsButtons").text("");
                for (const map of mapList) {
                    var mapButtonHtml = "<button id='communityMap" + map.id + "'>" + map.name + "</button></br>";
                    $("#communityMapsButtons").append(mapButtonHtml);
                }
            }
        });
    }

    /**
     * When the user want to modify a map, we want to show the map creation panel. But not empty!
     * We want to put in the data already put by ther user! So He can CHANGE the map, and not CREATE it
     * @param {the map we want to show informations} map 
     */
    static fillAddAMapMenu(map) {
        $("#addNameMap").val(map.name);
        $("#addDescriptionMap").val(map.description);
        $("#confidentialityChoiceMap").val(map.confidentiality);
    }

    static showAddAMapMenu() {
        $("#editMap").unbind("click");//we unbind the button before assignment
        $("#editMap").click(function () {
            MapManager.createMap()
        });
        showOverlay();
        $("#addAMapMenu").css("visibility", "visible");
    }

    static showUpdateAMapMenu(map){
        MapManager.fillAddAMapMenu(map);
        showOverlay();
        $("#addAMapMenu").css("visibility", "visible");

        $("#editMap").unbind("click");
        $("#editMap").click(function () {
            MapManager.updateMap(map);
        });
    }

}



/**
 * This function loads all characteristics of the current user
 * (places and maps)
 */
function loadUser() {

    $.ajax({
        url: "ws/User/currentSession",
        dataType: "json",
    }).done(function (user) {
        console.log("Welcome " + user.name + " #" + user.id);
        currentUser = user;

        for (const map of currentUser.mapList) {
            mapManager = new MapManager(map);
            mapManager.createInterface();
        }

    });
}





var currentUser; // the current user

/**
 * Main
 */
$(document).ready(function () {
<<<<<<< HEAD
    console.log("Test 1.13");


    loadUser();
    LeafletManager.build();


    /**
     * all "clicks" features
     */


    listMenus = ["savedMaps", "communityMaps", "placesList"];

    for (const menu of listMenus) {
        $("#" + menu + "MenuQuit").click(function () {
            closeSlidingPanel("#" + menu + "Menu");
        });

        $("#" + menu + "B").click(function () {
            openSlidingPanel("#" + menu + "Menu");
        });

    }

    $("#onePlaceMenuQuit").click(function (e) {
        closeSlidingPanel("#onePlaceMenu");
    });
    $("#oneMapMenuQuit").click(function (e) {
        closeSlidingPanel("#oneMapMenu");
    });

    $("#communityMapsB").click(MapManager.loadCommunityMapsButtons);


    $("#addAPlaceB").click(PlaceManager.addAPlaceMode);
    $(".CloseButton").click(hideOverlay);

    $("#addAMapB").click(MapManager.showAddAMapMenu);
    $("#addAMapMenuCloseB").click(hideOverlay);


});