class LeafletManager {
    static map;

    static lastPointClicked = { latitude: 0, longitude: 0 };

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
    $(id).css("right", -400)
}




class PlaceManager {

    /**
     * A dictionary which contains as key places id and as value placeManagers
     * The goal is to be able to get one placeManager only with a place id, no more
     */
    static dict = new Map();

    constructor(place,mapid) {
        this.place = place;
        this.marker = L.marker([place.latitude, place.longitude]);
        this.mapid = mapid; // the id of the map which contains this place
        PlaceManager.dict.set(place.id, this);

        this.marker.bindPopup("<b>" + this.place.name + "</b>");
        this.marker.on('mouseover', function (e) {
            this.openPopup();
        })
        this.marker.on('mouseout', function (e) {
            this.closePopup();
        })

        ClickManager.setClickMarker(this);

    }

    update(updatedPlace) {
        this.place = updatedPlace;
        this.marker._popup.setContent("<b>" + this.place.name + "</b>");
    }

    static placeToJSon(placeName,placeDescription,placeLatitude,placeLongitude,tags){
        var placeJSon = 
        {
            name:placeName,
            description:placeDescription,
            latitude:placeLatitude,
            longitude:placeLongitude,
            pictures:["webapp/style/images"],
            messages:["a pretty place!"],
            tags:tags
        }

        return JSON.stringify(placeJSon);
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

        //------------- To show places on the leaflet map and store them -----------
        if (this.map.places !== undefined) {
            for (const place of this.map.places) {
                var placeManager = new PlaceManager(place,mapid);
                placeManager.marker.addTo(this.layerGroup);
            }
        }

        if (this.map.visibility) {
            LeafletManager.addLayer(this.layerGroup);
        }
    }
    

    update(map) {
        this.map = map;
    }

    add(placeManager) {
        this.map.places.push(placeManager.place);
        placeManager.marker.addTo(this.layerGroup);
    }

    static mapToJson(userName, nameMap, descriptionMap, confidentialityMap){
        var mapJson = 
        {
            name:nameMap,
            description:descriptionMap,
            confidentiality:confidentialityMap,
            places:[],
            creator: userName,
            visibility:true
        }

        return JSON.stringify(mapJson);
    }

}


function postServerdata(url,data,callDone){
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: url,
        data: data,
        success: function (response) {
            callDone(response);
        }
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
 * Here are all function which fill panels by getting informations from the server
 */
class PanelManager {


    static setAddAPlaceMenu(){

        getServerData("ws/Map/fromUser/"+currentSession,function(mapList){
            $("#mapChoicePlace").text("");

            /**
             * TODO: generate this html text with underscore.js
             */
            $("#mapChoicePlace").append("<option value='CAMap'>--- Choose a map ---</option>");
            for (const map of mapList) {
                var mapChoice = "<option value=" + map.id + " id='optionMap" + map.id + "'>" + map.name + "</option>";
                $("#mapChoicePlace").append(mapChoice);            
            }
        })
        ClickManager.setClickCreatePlace();
    }

    static setUpdateAPlaceMenu(place){

        $("#addNamePlace").val(place.name);
        $("#addDescriptionPlace").val(place.description);

        var mapid = PlaceManager.dict.get(place.id).mapid;
        $("#mapChoicePlace").val(mapid);    

        getServerData("ws/Map/fromUser/"+currentSession,function(mapList){
            $("#mapChoicePlace").text("");
            
            var template = _.template($("#templateMapChoicePlace").html());

            $("#mapChoicePlace").append(template({nameMap:"--- Choose a map",valueMapChose:"CAMap"}));
            for (const map of mapList) {
                var mapChoiceHtml = template({
                    nameMap: map.name,
                    valueMapChose: map.id
                })
                $("#mapChoicePlace").append(mapChoiceHtml);            
            } 
        });
        ClickManager.setClickUpdatePlace();       
    }

    static setAddAMapMenu(){
        ClickManager.setClickCreateMap();
    }

    static setUpdateAMapMenu(map) {
        $("#addNameMap").val(map.name);
        $("#addDescriptionMap").val(map.description);
        $("#confidentialityChoiceMap").val(map.confidentiality);

        ClickManager.setClickUpdateMap(map);
    }

    static setSavedMapsMenu(){

        $("#savedMapsButtons").text("");

        getServerData("ws/Map/fromUser/"+currentSession,function (mapList){
            for (const map of mapList) {

                var mapManager = MapManager.dict.get(map.id);
    
                var isVisible = "";
                if (map.visibility) {
                    isVisible = "checked";
                }
                
                var template = _.template($("#templateSavedMapsButton").html());
    
                $("#savedMapsButtons").append(template({
                    oneMapDivId:'oneMapDiv' +  map.id,
                    checkBoxMapId: 'checkBoxMap' +  map.id,
                    checked: isVisible,
                    nameMap: map.name,
                    buttonOneMapMenuId: 'buttonOneMapMenu' +  map.id 
                }));
    
                ClickManager.setClickOneMapMenu(map);
    
                ClickManager.setClickCheckBox(mapManager);
            
            }
        })

    }

    static setCommunityMapsMenu(){
        $("#communityMapsButtons").text("");
        getServerData("ws/Map/allPublic",function(mapList){
            for (const map of mapList) {
                var template = _.template($("#templateOneCommunityMapButton").html());
                var divOneMapHtml = template({
                    "nameMap": map.name,
                    "oneCommunityMapButtonId":"buttonOneCommunityMapMenu"+map.id
                })
                $("#communityMapsButtons").append(divOneMapHtml);
                ClickManager.setClickOneMapMenu(map);
            }
        })
    }

    static setPlacesListMenu(){
        $("#placesListButtons").text("");

        getServerData("ws/Place/fromUser/"+currentSession,function(placeList){
            for (const place of placeList) {
                var template = _.template($("#templateOnePlaceButton").html());

                var divOnePlaceHtml = template({
                    "namePlace":place.name,
                    "onePlaceButtonId":"buttonOnePlaceMenu2"+place.id
                });
                $("#placesListButtons").append(divOnePlaceHtml);
                ClickManager.setClickOnePlaceMenu(place);
            }
        })

    }

    static setOneMapMenu(map){

        $("#nameOneMapMenu").text(map.name);
        $("#descriptionOneMapMenu").text(map.description);

        $("#oneMapPlaces").text("");

        var template = _.template($("#templateOneMapPlaces").html());

        for (const place of map.places) {
            
            $("#oneMapPlaces").append(template({
                oneMapPlaceId: "oneMapPlace"+place.id,
                namePlace: place.name,
                buttonOnePlaceMenuId: "buttonOnePlaceMenu"+place.id
            }));
            
            ClickManager.setClickOnePlaceMenu(place);
        }

        ClickManager.setClickModifyMap(map);

    }

    static setOnePlaceMenu(place){
        $("#onePlaceMenu h1").text(place.name);
        $("#onePlaceMenu textarea").text(place.description);
        
        ClickManager.setClickModifyPlace(place);
    }


}

/**
 * Here are all function which bind buttons to function
 * ==> static setClick{idOfButton}
 */
class ClickManager {

    static build(){
        ClickManager.setClickCommunityMapsB();
        ClickManager.setClickSavedMapsB();
        ClickManager.setClickPlacesListB();
        
        ClickManager.setClickResearcher();
        ClickManager.setClickParameters();

        ClickManager.setClickMenuQuit();
        
        ClickManager.setClickAddAPlaceB();     
        $(".CloseButton").click(hideOverlay); 

        ClickManager.setClickAddAMapB();

        ClickManager.setClickAddATagButton();
    }


    /**
     * TODO
     */
    static setClickParameters(){
        $("#parameters").click(function (e) { 
            console.log("parameting !");
            
        });
    }

    /**
     * TODO
     */
    static setClickResearcher(){
        $("#researcher").click(function (e) { 
            console.log("searching!");
            
        });
    }

    static setClickAddAPlaceB(){

        $("#addAPlaceB").click(function (event) { 

            hideButtons();
            ClickManager.setClickOnTheMap();   
        });
    }

    static setClickModifyPlace(place){
        $("#modifyPlace").unbind("click");
        $("#modifyPlace").click(function (e) { 
            showOverlay();

            PanelManager.setUpdateAPlaceMenu(place);

            ClickManager.setClickUpdatePlace(place);
    
            $("#addAPlaceMenu").css("visibility", "visible");   
            $("#mapChoicePlace").css("visibility", "hidden");    
        });
    }

    static setClickOnTheMap(){

        LeafletManager.map.on("click",function(event){
            LeafletManager.lastPointClicked.latitude = event.latlng.lat;
            LeafletManager.lastPointClicked.longitude = event.latlng.lng;
            $("#addAPlaceMenu").css("visibility", "visible");
            $("#mapChoicePlace").css("visibility", "inherit");
            showOverlay();
            PanelManager.setAddAPlaceMenu();
        })
    }

    static setClickCreatePlace(){
        $("#editPlace").unbind("click");//we unbind the button before assignment
        $("#editPlace").click(function () {

            var namePlace = $("#addNamePlace").val();
            var descriptionPlace = $("#addDescriptionPlace").val();
            var mapChose = $("#mapChoicePlace").val();

            var tags = $("#addAPlaceTags").val().split(" ");
        
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

            var placeToSend = PlaceManager.placeToJSon(namePlace,
                                                        descriptionPlace,
                                                        LeafletManager.lastPointClicked.latitude,
                                                        LeafletManager.lastPointClicked.longitude,
                                                        tags);

            var mapid = parseInt(mapChose);
        
            postServerdata("ws/Place/create/"+mapid,placeToSend,function (newPlace){
                var placeManager = new PlaceManager(newPlace,mapid);
                var mapManager = MapManager.dict.get(mapid);
    
                mapManager.add(placeManager);
                
                PanelManager.setOneMapMenu(mapManager.map);
                PanelManager.setPlacesListMenu();

            })
            hideOverlay();
        });


    }

    static setClickUpdatePlace(place){
        $("#editPlace").unbind("click");//we unbind the button before assignment
        $("#editPlace").click(function () {
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
        
            place.name = namePlace;
            place.description = descriptionPlace;
        
            postServerdata("ws/Place/update",JSON.stringify(place),function(updatedPlace){
                var placeManager = PlaceManager.dict.get(updatedPlace.id);
                placeManager.update(updatedPlace);
                PanelManager.setOnePlaceMenu(updatedPlace);  
            })
            hideOverlay();             
        });
    }

    static setClickAddAMapB(){

        $("#addAMapB").unbind("click");
        $("#addAMapB").click(function (e) { 

            PanelManager.setAddAMapMenu();

            $("#addAMapMenu").css("visibility", "visible");
            showOverlay();  
            
        });

    }

    static setClickModifyMap(map){

        $("#modifyMap").unbind("click");
        $("#modifyMap").click(function (e) {   
            
            $("#addAMapMenu").css("visibility", "visible");
            showOverlay();
            PanelManager.setUpdateAMapMenu(map);   
        });
    }


    static setClickCreateMap(){
        $("#editMap").unbind("click");
        $("#editMap").click(function (e) { 
            var nameMap = $("#addNameMap").val();
            var descriptionMap = $("#addDescriptionMap").val();
            var confidentiality = $("#confidentialityChoiceMap").val();
        
            if (nameMap === "") {
                alert("Please name this map");
                return false;
            }
        

            var mapToSend = MapManager.mapToJson(null,nameMap,descriptionMap,confidentiality);
            postServerdata("ws/Map/create/"+currentSession,mapToSend,function(newMap){
                new MapManager(newMap);
                PanelManager.setSavedMapsMenu();
            })
        
            hideOverlay();        
        });
    }

    static setClickUpdateMap(map){
        $("#editMap").unbind("click");
        $("#editMap").click(function (e) { 
            var nameMap = $("#addNameMap").val();
            var descriptionMap = $("#addDescriptionMap").val();
            var confidentiality = $("#confidentialityChoiceMap").val();
        
            if (nameMap === "") {
                alert("Please name this map");
                return false;
            }
        
            map.name = nameMap;
            map.description = descriptionMap;
            map.confidentiality = confidentiality;
        
            postServerdata("ws/Map/update",JSON.stringify(map),function(updatedMap){
                var mapManager = MapManager.dict.get(updatedMap.id);
                mapManager.update(updatedMap);
                PanelManager.setSavedMapsMenu();
                PanelManager.setOneMapMenu(updatedMap);
            })
        
            hideOverlay();            
            
        });
    }

    static setClickSavedMapsB(){
        $("#savedMapsB").click(function (e) { 

            openSlidingPanel("#savedMapsMenu");
            PanelManager.setSavedMapsMenu();
            
        });
    }

    static setClickCommunityMapsB(){
        $("#communityMapsB").click(function (e) { 

            openSlidingPanel("#communityMapsMenu");
            PanelManager.setCommunityMapsMenu();     
        });
    }

    static setClickPlacesListB(){
        $("#placesListB").unbind("click");
        $("#placesListB").click(function (e) { 
            openSlidingPanel("#placesListMenu");
            PanelManager.setPlacesListMenu();      
        });
    }

    /**
     * set the click to quit for all menu
     */
    static setClickMenuQuit(){
        $(".MenuQuit").click(function (e) { 
            closeSlidingPanel("#"+this.id.split("Quit")[0]);    
        });
    }

    static setClickAddATagButton(){
        $("#addATagButton").click(function (e) { 
            var newTag = $("#addATagInput").val();
            console.log(newTag);

            if (newTag.indexOf(" ")>=0){
                alert("A name tag has to be only one word");
            }
            else {
                /*var template = _.template($("#templateAddPlaceTags").html());
                $("#addAPlaceTags").append(template({
                    addOneTagName: newTag
                }));*/
                $("#addAPlaceTags").append(newTag+" ");
            }
        });
    }

    /**
     * ############# BELOW, setClick of dynamically generated buttons: ##########
     */

    /**
     * 
     * @param {the manager of the map we want to show/hide} mapManager 
     */
    static setClickCheckBox(mapManager){
        var map = mapManager.map;
        $("#checkBoxMap" +  map.id).unbind("click");
        $("#checkBoxMap" +  map.id).click(function () {

            var data;

            if ($("#checkBoxMap" + map.id).prop("checked")) {
                data = true;
                LeafletManager.addLayer(mapManager.layerGroup);
            }
            else {
                data = false;
                LeafletManager.removeLayer(mapManager.layerGroup);
            }

            postServerdata("ws/Map/update/"+map.id+"/visibility",JSON.stringify(data),function(mapResult){
                mapManager.update(mapResult);
            })

        });
    }

    static setClickOneMapMenu(map){

        $("#buttonOneCommunityMapMenu" +  map.id).unbind("click");
        $("#buttonOneCommunityMapMenu" +  map.id).click(function () {
            closeSlidingPanel("#onePlaceMenu");
            openSlidingPanel("#oneMapMenu");
            getServerData("ws/Map/"+map.id,function(mapGot){
                PanelManager.setOneMapMenu(mapGot);
            }) 
        });      


        $("#buttonOneMapMenu" +  map.id).unbind("click");
        $("#buttonOneMapMenu" +  map.id).click(function () {
            closeSlidingPanel("#onePlaceMenu");
            openSlidingPanel("#oneMapMenu");
            getServerData("ws/Map/"+map.id,function(mapGot){
                PanelManager.setOneMapMenu(mapGot);
            }) 
        });        
    }


    static setClickOnePlaceMenu(place){

        $("#buttonOnePlaceMenu2" +  place.id).unbind("click");
        $("#buttonOnePlaceMenu2" +  place.id).click(function () {
            openSlidingPanel("#onePlaceMenu");
            closeSlidingPanel("#oneMapMenu");  

            getServerData("ws/Place/"+place.id,function (result) {
                PanelManager.setOnePlaceMenu(result);
                ClickManager.setClickModifyPlace(result);  
            });    
        });  

        $("#buttonOnePlaceMenu" +  place.id).unbind("click");
        $("#buttonOnePlaceMenu" +  place.id).click(function () {
            openSlidingPanel("#onePlaceMenu");
            closeSlidingPanel("#oneMapMenu");  

            getServerData("ws/Place/"+place.id,function (result) {
                PanelManager.setOnePlaceMenu(result);
                ClickManager.setClickModifyPlace(result);  
            });    
        });        
    }

    static setClickMarker(placeManager){

        placeManager.marker.on("click",function(){
            openSlidingPanel("#onePlaceMenu");  
            closeSlidingPanel("#oneMapMenu");  

            var place = placeManager.place;
            getServerData("ws/Place/"+place.id,function (result) {
                PanelManager.setOnePlaceMenu(result);  
                ClickManager.setClickModifyPlace(result);             
            });
        })
    }

}



/**
 * This function loads all characteristics of the current user
 * (places and maps)
 */
function loadUser() {

    getServerData("ws/User/currentSession",function (user) {
        console.log("Welcome " + user.name + " #" + user.id);
        currentSession = user.id;

        for (const map of user.mapList) {
            mapManager = new MapManager(map);
        }
    })
}



var currentSession; // the current user

/**
 * Main
 */
$(document).ready(function () {
    console.log("Test 2.3");


    loadUser();
    LeafletManager.build();
    ClickManager.build();
});