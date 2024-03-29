class LeafletManager {
    static map;

    static lastPointClicked = { latitude: 0, longitude: 0 };

    static searchingPlacesLayerGroup;

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
    $("#buttons button").css("visibility", "hidden");
    /*Opacity for a smoother transition */
    $("#buttons button").css("opacity", "0");
    /*$(".hide").css("z-index", "600");*/
}

function showButtons() {
    $("#buttons button").css("visibility", "visible");
    /*Opacity for a smoother transition */
    $("#buttons button").css("opacity", "1");
    /*$(".hide").css("z-index","0");*/
}



function hideOverlay() {
    $(".overlay").css("visibility", "hidden");
    $(".overlay .PopupMenu").css("visibility", "hidden");
    $(".overlay .small-modal").css("visibility", "hidden");
    $(".overlay").css("opacity", "0");
    $(".overlay .PopupMenu").css("opacity", "0");
    $(".overlay .PopupMenu").css("top", "-50%");
    $(".overlay .small-modal").css("opacity", "0");
    $(".overlay .small-modal").css("top", "-50%");
    $("#user-list").text("");
    showButtons();

    LeafletManager.map.off('click');
}

function showOverlay() {

    $(".overlay").css("visibility", "visible");
    $(".overlay").css("opacity", "1");
    $(".overlay .PopupMenu").css("opacity", "1");
    $(".overlay .PopupMenu").css("top", "10%");
}

function showSmallModal(){
    $(".overlay .small-modal").css("opacity", "1");
    $(".overlay .small-modal").css("top", "20%");   
    $(".small-modal").css("visibility", "visible"); 
}



function openSlidingPanel(direction,id) {
    $(id).css(direction, -50);
}

function closeSlidingPanel(direction,id) {
    $(id).css(direction, -400)
}




class PlaceManager {

    /**
     * A dictionary which contains as key places id and as value placeManagers
     * The goal is to be able to get one placeManager only with a place id, no more
     */
    static dict = new Map();

    constructor(place) {
        this.place = place;
        this.marker = L.marker([place.latitude, place.longitude]);
        PlaceManager.dict.set(place.id, this);

        if(place.pictures.length>0){
            var template = _.template($("#templatePopup").html());
            this.marker.bindPopup(template({
                namePlace:place.name,
                imgSrc:place.pictures[0]
            }));
        }
        else{
            this.marker.bindPopup("<b>" + this.place.name + "</b>");
        }
        
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
        if(updatedPlace.pictures.length>0){
            var template = _.template($("#templatePopup").html());
            this.marker._popup.setContent(template({
                namePlace:updatedPlace.name,
                imgSrc:updatedPlace.pictures[0]
            }));
        }
        else{
            this.marker._popup.setContent("<b>" + this.place.name + "</b>");
        }
        
    }

    static placeToJSon(placeName,placeDescription,placeLatitude,placeLongitude,tags,pictures){
        var placeJSon = 
        {
            name:placeName,
            description:placeDescription,
            latitude:placeLatitude,
            longitude:placeLongitude,
            pictures:pictures,
            messages:[],
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
                var placeManager = new PlaceManager(place);
                placeManager.marker.addTo(this.layerGroup);
            }
        }

    }
    

    update(map) {
        this.map = map;
    }

    add(placeManager) {
        this.map.places.push(placeManager.place);
        placeManager.marker.addTo(this.layerGroup);
    }

    static mapToJson(userId, nameMap, descriptionMap, confidentialityMap){
        var mapJson = 
        {
            name:nameMap,
            description:descriptionMap,
            confidentiality:confidentialityMap,
            places:[],
            creatorId: userId,
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

function deleteServerData(url,data,callDone){
    $.ajax({
        type: "DELETE",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: url,
        data: data,
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

        getServerData("ws/User/"+UserManager.currentSession,function(user){
            $("#mapChoicePlace").text("");

            setTagsOf("#addAPlaceTags",[]);

            var template = _.template($("#templateMapChoicePlace").html());

            $("#mapChoicePlace").append(template({nameMap:"--- Choose a map ---",valueMapChose:"CAMap"}));
            for (const map of user.mapList) {
                if (map.creatorId === UserManager.currentSession){
                    var mapChoiceHtml = template({
                        nameMap: map.name,
                        valueMapChose: map.id
                    })
                    $("#mapChoicePlace").append(mapChoiceHtml);     
                }
            }
        })
        ClickManager.setClickCreatePlace();
    }

    static setUpdateAPlaceMenu(place){

        $("#addNamePlace").val(place.name);
        $("#addDescriptionPlace").val(place.description);

        var mapid = place.mapId;
        $("#mapChoicePlace").val(mapid);    

        setTagsOf("#addAPlaceTags",place.tags);

        getServerData("ws/User/"+UserManager.currentSession,function(user){
            $("#mapChoicePlace").text("");
            
            
            var template = _.template($("#templateMapChoicePlace").html());

            $("#mapChoicePlace").append(template({nameMap:"--- Choose a map ---",valueMapChose:"CAMap"}));
            for (const map of user.mapList) {
                if (map.creatorId === UserManager.currentSession) {
                    var mapChoiceHtml = template({
                        nameMap: map.name,
                        valueMapChose: map.id
                    })
                    $("#mapChoicePlace").append(mapChoiceHtml);    
                }
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

        getServerData("ws/User/"+UserManager.currentSession,function (user){
            for (const map of user.mapList) {

                var mapManager = MapManager.dict.get(map.id);
    
                var isVisible = "";
                if (UserManager.isMapVisibleFor(user,map)) {
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
        $("#searchMapInput").val("");  
        getServerData("ws/Map/allPublic",function(mapList){
            for (const map of mapList) {
                if(MapManager.dict.get(map.id)===undefined){
                    new MapManager(map);
                } 
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

        getServerData("ws/Place/fromUser/"+UserManager.currentSession,function(placeList){
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
        $("#oneMapConfidentiality").text(map.confidentiality);

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

        ClickManager.setClickOneMapMenuShareButton(map);

        /**
         * We get the entire user in order to have his map list and his id
         */
        getServerData("ws/User/"+UserManager.currentSession,function(user){
            if (map.creatorId === user.id){ // this is thus the owner of the map, he can therefore modify it
                ClickManager.setClickModifyMap(map);
                ClickManager.setClickRemoveMap(map);
                $("#modifyMap").css("visibility", "visible");
                $("#followMap").css("visibility", "hidden");
                $("#removeMap").css("visibility", "visible");
            }
            else {
                $("#modifyMap").css("visibility", "hidden");
                $("#followMap").css("visibility", "visible");
                $("#removeMap").css("visibility", "hidden");

                var hasThisMap = false;

                /**
                 * TODO: CHANGE  THE CSS WHEN THE MAP IS FOLLOWED OR NOT FOR THE FOLLOW BUTTON
                 */
                for (const userMap of user.mapList) {
                    if (map.id === userMap.id){ // if the user already has the map into his map list
                        $("#followMap").text("");
                        $("#followMap").append("<i class='fa fa-close' aria-hidden='true'></i>");

                        hasThisMap = true;
                        ClickManager.setClickFollowMap(map,true);
                    }
                }
                if (!hasThisMap){
                    $("#followMap").text("");
                    $("#followMap").append("<i class='fa fa-share' aria-hidden='true'></i>");
                    ClickManager.setClickFollowMap(map,false);
                }
            }
        });

    }

    static setOnePlaceMenu(place){
        $("#nameOnePlaceMenu").text(place.name);
        $("#onePlaceMenu .descriptionArea").text(place.description);

        setTagsOf("#onePlaceTags",place.tags);

        var template = _.template($("#templateOnePlaceMessages").html());

        $("#onePlaceMessages").text("");
        for (let i = 0; i<place.messages.length; i++) {
            $("#onePlaceMessages").append(template({
                oneMessageTextareaId:"oneMessageTextarea"+i
            }));
            $("#oneMessageTextarea"+i).val(place.messages[i]);
        }

        $("#onePlaceImages").text("");
        var template = _.template($("#templateOnePlaceImages").html());

        for (let i = 0; i<place.pictures.length; i++){   
            $("#onePlaceImages").append(template({
                onePlaceImageSrc:place.pictures[i],
                onePlaceImageId: "onePlaceImage"+place.id,
            }));
        }

        ClickManager.setClickAddAMessageButton(place);
        ClickManager.setClickCenterToMarkerPlaceButton(place);
        ClickManager.setClickOnGoToGoogleMapButton(place);

        var map = MapManager.dict.get(place.mapId).map;

        if (map.creatorId === UserManager.currentSession){
            $("#modifyPlace").css("visibility", "visible");
            $("#removePlace").css("visibility", "visible");
            ClickManager.setClickModifyPlace(place);
            ClickManager.setClickRemovePlace(place);
        }
        else{
            $("#modifyPlace").css("visibility", "hidden");
            $("#removePlace").css("visibility", "hidden");
        }     
        
    }


    static setSearchingPlacesMenu(){
        setTagsOf("#searchingPlacesTags",[]);

    }

    static setParametersMenu(){
        $("#mapsSharedDiv").text("");
        getServerData("ws/User/"+UserManager.currentSession,function(user){

            $("#userIdendityDiv").text(user.name+" #"+user.id);

            for (const map of user.mapsShared) {
                var template = _.template($("#templateMapsSharedDiv").html());

                $("#mapsSharedDiv").append(template({
                    oneMapSharedId:"oneMapShared"+map.id,
                    nameMap:map.name,
                    oneMapSharedFollowButtonId: "oneMapSharedFollowButton"+map.id,
                    oneMapSharedIgnoreButtonId: "oneMapSharedIgnoreButton"+map.id
                }));
                ClickManager.setClickOneMapSharedFollowButton(map);
                ClickManager.setClickOneMapSharedIgnoreButton(map);
            }
        })
    }


}

/**
 * Here are all function which bind buttons to function
 * ==> static setClick{idOfButton}
 */
class ClickManager {

    static build(){
        ClickManager.setClickCommunityMapsB();
        ClickManager.setclickSearchMapButton();
        
        ClickManager.setClickSavedMapsB();
        ClickManager.setClickAddAMapB();
        
        ClickManager.setClickPlacesListB();

        ClickManager.setClickUserLocation();
        
        ClickManager.setClickResearcher();
        ClickManager.setClickParameters();
        ClickManager.setClickDisconnectButton();

        ClickManager.setClickMenuQuit();
        
        ClickManager.setClickAddAPlaceB();  
        $(".CloseButton").click(hideOverlay);    
  
        ClickManager.setClickSearchByTagsButton();
        ClickManager.setClickSearchingPlacesMenuQuit();

        $("#small-modal-done").click(hideOverlay);
    }


    static setClickUserLocation(){
        $("#userLocation").click(function (e) { 
            if ("geolocation" in navigator){
                navigator.geolocation.getCurrentPosition(function(position){
                    var center = {lat:position.coords.latitude,lng:position.coords.longitude};
                    LeafletManager.map.flyTo(center,17);
                });

            }
            else{
                alert("The geolocation is not actived on your navigator")
            }
            
        });
    }

    static setClickSearchUserButton(map){
        $("#searchUsersButton").unbind("click");
        $("#searchUsersButton").click(function (e) { 
            $("#user-list").text("");
            var username = $("#share-map-user-name").val();
            $.ajax({
                type: "POST",
                contentType: "text/plain; charset=utf-8",
                dataType: "text",
                url: "ws/User/name",
                data: username,
                success: function (result) {
                    var users = JSON.parse(result);
                    var template = _.template($("#templateUserList").html());
                    for (const user of users) {
                        $("#user-list").append(template({
                            nameUser:user.name,
                            oneUserButtonId:"oneUserButton"+user.id
                        }));
                        ClickManager.setClickOnUserButtonShare(user,map);
                    }
                }
            });
            
        });
    }

    static setClickParameters(){
        $("#parameters").click(function (e) { 
            openSlidingPanel("left","#parametersMenu");
            PanelManager.setParametersMenu();
        });
    }

    static setClickDisconnectButton(){

        $("#disconnectButton").click(function (e) { 
            if(confirm("Do you really want to disconnect ?")){
                window.location.href="index.html";
            }      
        });
    }

    static setClickResearcher(){
        $("#researcher").click(function (e) { 
            openSlidingPanel("left","#searchingPlacesMenu");  
            PanelManager.setSearchingPlacesMenu();   
        });
    }

    static setClickSearchByTagsButton(){
        $("#searchByTagsButton").click(function (e) { 
            
            var tags = getTagsOf("#searchingPlacesTags");

            if (LeafletManager.searchingPlacesLayerGroup !== undefined){
                LeafletManager.removeLayer(LeafletManager.searchingPlacesLayerGroup);
            }
            
            LeafletManager.searchingPlacesLayerGroup = L.layerGroup();
            var pointUpLeft = LeafletManager.map.unproject(LeafletManager.map.getPixelOrigin());
            
            var radius = LeafletManager.map.getCenter().distanceTo(pointUpLeft);
            
            postServerdata("ws/Place/byTags",JSON.stringify(tags),function(places){

                var placesNear = []; // all places witch are into the visible part of the map

                for (const place of places) {
                    var pointPlace = {lat:place.latitude,lng:place.longitude};
                    if(LeafletManager.map.getCenter().distanceTo(pointPlace)<radius){
                        placesNear.push(place);
                    }
                }

                $("#placesFound").text("");
                for (const place of placesNear) {

                    getServerData("ws/Map/"+place.mapId,function(map){
                        if(MapManager.dict.get(map.id)===undefined){
                            new MapManager(map);
                        } 
                    });

                    var template = _.template($("#templateOnePlaceButton").html());
         
                    $("#placesFound").append(template({
                        namePlace:place.name,
                        onePlaceButtonId: "onePlaceButton"+place.id
                    }));

                    ClickManager.setClickOnePlaceMenu(place);

                    var placeManager = new PlaceManager(place);
                    placeManager.marker.addTo(LeafletManager.searchingPlacesLayerGroup);
                    
                }
                LeafletManager.addLayer(LeafletManager.searchingPlacesLayerGroup);
            });         
            
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

    static setClickRemovePlace(place){
        $("#removePlace").unbind("click");
        $("#removePlace").click(function (e) { 
            if (confirm("Do you really want to remove this place ?")){
                deleteServerData("ws/Place/"+place.mapId,JSON.stringify(place),function(map){
                    closeSlidingPanel("right","#onePlaceMenu");
                    PanelManager.setOneMapMenu(map);
                    openSlidingPanel("right","#oneMapMenu");
                    LeafletManager.removeLayer(PlaceManager.dict.get(place.id).marker);
                });
            }
            
        });
    }

    static setClickRemoveMap(map){
        $("#removeMap").unbind("click");
        $("#removeMap").click(function (e) { 
            if(confirm("Do you really want to remove this map and all of its places ?\n It is irreversible")){
                deleteServerData("ws/Map/"+UserManager.currentSession,JSON.stringify(map),function(){
                    PanelManager.setSavedMapsMenu();
                    closeSlidingPanel("right","#oneMapMenu");
                    LeafletManager.removeLayer(MapManager.dict.get(map.id).layerGroup);                 
                })
            }
            
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

            var pictures = [];

            var tags = getTagsOf("#addAPlaceTags");
        
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

            var mapid = parseInt(mapChose);

            var placeToSend = PlaceManager.placeToJSon(namePlace,
                                                        descriptionPlace,
                                                        LeafletManager.lastPointClicked.latitude,
                                                        LeafletManager.lastPointClicked.longitude,
                                                        tags,
                                                        pictures);
        
            postServerdata("ws/Place/create/"+mapid,placeToSend,function (newPlace){
                var placeManager = new PlaceManager(newPlace);
                var mapManager = MapManager.dict.get(mapid);
    
                mapManager.add(placeManager);
                
                PanelManager.setOneMapMenu(mapManager.map);
                PanelManager.setPlacesListMenu();

            })
            hideOverlay();
        });


    }

    static setClickUpdatePlace(place){
        $("#editPlace").unbind("click");
        $("#editPlace").click(function () {
            var namePlace = $("#addNamePlace").val();
            var descriptionPlace = $("#addDescriptionPlace").val();

            var tags = getTagsOf("#addAPlaceTags");
        
            if (namePlace === "" && mapChose === "CAMap") {
                alert("Please name this place and choose a map to put it in");
                return false;
            }
            else if (namePlace === "") {
                alert("Please name this place");
                return false;
            }

            var files = document.getElementById("searchImages").files;
            var fileReader = new FileReader();
                
            fileReader.onload = function(fileLoadedEvent){
                var image = fileLoadedEvent.target.result;

                postServerdata("ws/Place/"+place.id+"/add/image",image,function(updatedPlace1){

                    updatedPlace1.name = namePlace;
                    updatedPlace1.description = descriptionPlace;
                    updatedPlace1.tags= tags;

                    postServerdata("ws/Place/update",JSON.stringify(updatedPlace1),function(updatedPlace2){              
                        var placeManager = PlaceManager.dict.get(updatedPlace2.id);
                        placeManager.update(updatedPlace2);
                        PanelManager.setOnePlaceMenu(updatedPlace2);
                    });
                });
            }

            if(files.length>0){
                fileReader.readAsDataURL(Object.values(files)[0]);
            }else{
                place.name = namePlace;
                place.description = descriptionPlace;
                place.tags= tags;

                postServerdata("ws/Place/update",JSON.stringify(place),function(updatedPlace){              
                    var placeManager = PlaceManager.dict.get(updatedPlace.id);
                    placeManager.update(updatedPlace);
                    PanelManager.setOnePlaceMenu(updatedPlace);
                });
            }
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
        

            var mapToSend = MapManager.mapToJson(UserManager.currentSession,nameMap,descriptionMap,confidentiality);
            postServerdata("ws/Map/addMap/"+UserManager.currentSession,mapToSend,function(newMap){
                var mapManager = new MapManager(newMap);
                LeafletManager.addLayer(mapManager.layerGroup);
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
                PanelManager.setCommunityMapsMenu();
            })
        
            hideOverlay();            
            
        });
    }

    static setClickSavedMapsB(){
        $("#savedMapsB").click(function (e) { 

            openSlidingPanel("right","#savedMapsMenu");
            PanelManager.setSavedMapsMenu();
            
        });
    }

    static setClickCommunityMapsB(){
        $("#communityMapsB").click(function (e) { 

            openSlidingPanel("right","#communityMapsMenu");
            PanelManager.setCommunityMapsMenu();     
        });
    }

    static setclickSearchMapButton(){
        $("#searchMapButton").click(function (e) { 
            var mapName = $("#searchMapInput").val();
            if(mapName!==""){
                $("#communityMapsButtons").text("");
                $.ajax({
                    type: "POST",
                    contentType: "text/plain; charset=utf-8",
                    dataType: "text",
                    url: "ws/Map/public/name",
                    data: mapName,
                    success: function (result) {
                        var maps = JSON.parse(result);
                        var template = _.template($("#templateOneCommunityMapButton").html());
                        for (const map of maps) {
                            $("#communityMapsButtons").append(template({
                                nameMap:map.name,
                                oneCommunityMapButtonId:"buttonOneCommunityMapMenu"+map.id
                            }));
                            ClickManager.setClickOneMapMenu(map);                           
                        }
                    }
                });
            }
            else{
                PanelManager.setCommunityMapsMenu();
            }       
        });
    }

    static setClickPlacesListB(){
        $("#placesListB").unbind("click");
        $("#placesListB").click(function (e) { 
            openSlidingPanel("right","#placesListMenu");
            PanelManager.setPlacesListMenu();      
        });
    }

    /**
     * set the click to quit for all menu
     */
    static setClickMenuQuit(){

        $(".LeftSlidingPanelQuit").click(function (e) { 
            closeSlidingPanel("left","#"+this.id.split("Quit")[0]);   
        });

        $(".RightSlidingPanelQuit").click(function (e) { 
            closeSlidingPanel("right","#"+this.id.split("Quit")[0]);    
        });
    }

    static setClickSearchingPlacesMenuQuit(){
        $("#searchingPlacesMenuQuit").click(function (e) { 
            closeSlidingPanel("left","#searchingPlacesMenu");
            if (LeafletManager.searchingPlacesLayerGroup!==undefined)
                LeafletManager.removeLayer(LeafletManager.searchingPlacesLayerGroup);  
                $("#placesFound").text("");     
        });
    }


    static setClickAddAMessageButton(place){
        $("#addAMessageButton").unbind("click");
        $("#addAMessageButton").click(function (e) { 
            var template = _.template($("#templateOnePlaceAddAMessage").html());

            $("#addAMessageDiv").append(template());

            ClickManager.setClickOnePlaceSendMessage(place);
            
        });
    }

    static setClickOnePlaceSendMessage(place){
        $("#onePlaceSendMessage").unbind("click");
        $("#onePlaceSendMessage").click(function (e) { 

            place.messages.push($("#addAMessageTextarea").val());
            $("#addAMessageDiv").text("");
            postServerdata("ws/Place/update",JSON.stringify(place),function(updatedPlace){
                PanelManager.setOnePlaceMenu(updatedPlace);
            });                 
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

            var data = $("#checkBoxMap" + map.id).prop("checked") ? true : false;

            postServerdata("ws/User/update/"+UserManager.currentSession+"/visibility/"+map.id,JSON.stringify(data),function(user){
                if (UserManager.isMapVisibleFor(user,map)){
                    LeafletManager.addLayer(mapManager.layerGroup);
                }
                else{
                    LeafletManager.removeLayer(mapManager.layerGroup);
                }
            })

        });
    }

    static setClickOneMapMenu(map){

        $("#buttonOneCommunityMapMenu" +  map.id).unbind("click");
        $("#buttonOneCommunityMapMenu" +  map.id).click(function () {
            closeSlidingPanel("right","#onePlaceMenu");
            openSlidingPanel("right","#oneMapMenu");
            getServerData("ws/Map/"+map.id,function(mapGot){
                PanelManager.setOneMapMenu(mapGot);
            }) 
        });      


        $("#buttonOneMapMenu" +  map.id).unbind("click");
        $("#buttonOneMapMenu" +  map.id).click(function () {
            closeSlidingPanel("right","#onePlaceMenu");
            openSlidingPanel("right","#oneMapMenu");
            getServerData("ws/Map/"+map.id,function(mapGot){
                PanelManager.setOneMapMenu(mapGot);
            }) 
        });        
    }


    static setClickOneMapMenuShareButton(map){
        $("#oneMapMenuShareButton").unbind("click");
        $("#oneMapMenuShareButton").click(function (e) { 
            showOverlay();
            showSmallModal();
            ClickManager.setClickSearchUserButton(map);
            
        });
    }

    static setClickFollowMap(map,isAlreadyFollowed){

        $("#followMap").unbind("click");

        if(isAlreadyFollowed){
            $("#followMap").click(function (e) { 
                if(confirm("Do you really want to remove this map from yours ?")){
                    postServerdata("ws/User/remove/map/"+UserManager.currentSession,JSON.stringify(map),function(user){
                        PanelManager.setOneMapMenu(map);
                        PanelManager.setSavedMapsMenu();
                        var mapManager = MapManager.dict.get(map.id);
                        LeafletManager.removeLayer(mapManager.layerGroup);
                    });
                }         
            });
        }
        else{
            $("#followMap").click(function (e) { 
                postServerdata("ws/Map/addMap/"+UserManager.currentSession,JSON.stringify(map),function(){
                    PanelManager.setOneMapMenu(map);    
                    var mapManager = new MapManager(map);
                    LeafletManager.addLayer(mapManager.layerGroup);
                })
                
            });
        }

    }


    static setClickOnePlaceMenu(place){

        $("#buttonOnePlaceMenu2" +  place.id).unbind("click");
        $("#buttonOnePlaceMenu2" +  place.id).click(function () {
            openSlidingPanel("right","#onePlaceMenu");
            closeSlidingPanel("right","#oneMapMenu");  

            getServerData("ws/Place/"+place.id,function (result) {
                PanelManager.setOnePlaceMenu(result);
                ClickManager.setClickModifyPlace(result);  
            });    
        });  

        $("#buttonOnePlaceMenu" +  place.id).unbind("click");
        $("#buttonOnePlaceMenu" +  place.id).click(function () {
            openSlidingPanel("right","#onePlaceMenu");
            closeSlidingPanel("right","#oneMapMenu");  

            getServerData("ws/Place/"+place.id,function (result) {
                PanelManager.setOnePlaceMenu(result);
                ClickManager.setClickModifyPlace(result);  
            });    
        });  
        
        $("#onePlaceButton"+place.id).unbind("click");
        $("#onePlaceButton"+place.id).click(function () {
            openSlidingPanel("right","#onePlaceMenu");
            closeSlidingPanel("right","#oneMapMenu");  

            getServerData("ws/Place/"+place.id,function (result) {
                PanelManager.setOnePlaceMenu(result);
                ClickManager.setClickModifyPlace(result);  
            });    
        });  
    }

    static setClickMarker(placeManager){
        placeManager.marker.off("click");
        placeManager.marker.on("click",function(){
            openSlidingPanel("right","#onePlaceMenu");  
            closeSlidingPanel("right","#oneMapMenu");  

            var place = placeManager.place;
            getServerData("ws/Place/"+place.id,function (result) {
                PanelManager.setOnePlaceMenu(result);  
                ClickManager.setClickModifyPlace(result);             
            });
        })
    }

    static setClickCenterToMarkerPlaceButton(place){
        $("#centerToMarkerPlaceButton").unbind("click");
        $("#centerToMarkerPlaceButton").click(function (e) { 
            var center = {lat:place.latitude,lng:place.longitude};
            LeafletManager.map.flyTo(center,17);
        });
    }

    static setClickOnGoToGoogleMapButton(place){
        $("#goToGoogleMapButton").unbind("click");
        $("#goToGoogleMapButton").click(function (e) { 
            var center = {lat:place.latitude,lng:place.longitude};
            if ("geolocation" in navigator){
                navigator.geolocation.getCurrentPosition(function(position){
                    var currentPos = {lat:position.coords.latitude,lng:position.coords.longitude};
                    window.open("https://www.google.fr/maps/dir/"+currentPos.lat+","+currentPos.lng+"/"+center.lat+","+center.lng,"_blank");
                });
            }
            else {
                alert("Your navigator doesn't allows the locatiob feature");
            }
            
        });
    }


    static setClickOneMapSharedFollowButton(map){
        $("#oneMapSharedFollowButton"+map.id).unbind("click");
        $("#oneMapSharedFollowButton"+map.id).click(function (e) { 
            $("#oneMapShared"+map.id).text("");
            postServerdata("ws/User/getSharedMap/"+UserManager.currentSession,JSON.stringify(map),function(){
                PanelManager.setParametersMenu();    
                var mapManager = new MapManager(map);
                LeafletManager.addLayer(mapManager.layerGroup);
                PanelManager.setSavedMapsMenu();
            });
        });
    }

    static setClickOneMapSharedIgnoreButton(map){
        $("#oneMapSharedIgnoreButton"+map.id).unbind("click");
        $("#oneMapSharedIgnoreButton"+map.id).click(function (e) { 
            $("#oneMapShared"+map.id).text("");
            
            postServerdata("ws/User/remove/sharedMap/"+UserManager.currentSession,JSON.stringify(map),function(user){
                PanelManager.setParametersMenu();
            })
            
        });
    }

    static setClickOnUserButtonShare(user,map){
        $("#oneUserButton"+user.id).unbind("click");
        $("#oneUserButton"+user.id).click(function (e) { 
            postServerdata("ws/Map/addSharedMap/"+user.id,JSON.stringify(map),function (response) { 
                if(response){
                    alert("Your map has been successfully sent to "+user.name+" !");
                }
                else {
                    alert("This user already has this map!");
                }
                
             })
            
        });
    }

}

class UserManager{
    static currentSession;

    static loadUser(){
        getServerData("ws/User/currentSession",function (user) {
            console.log("Welcome " + user.name + " #" + user.id);
            UserManager.currentSession = user.id;
    
            for (const map of user.mapList) {
                var mapManager = new MapManager(map);
                
     
                if(UserManager.isMapVisibleFor(user,map)){
                    LeafletManager.addLayer(mapManager.layerGroup);
                }
            }
        });
    }


    static isMapVisibleFor(user,map){
        var mapsVisibility = new Map(Object.entries(user.mapsVisibility));
        return mapsVisibility.get(""+map.id);
    }
}

var tagifies = new Map();
tagifies.set("#addAPlaceTags", new Tagify(document.getElementById("addAPlaceTags")));
tagifies.set("#onePlaceTags", new Tagify(document.getElementById("onePlaceTags")));
tagifies.set("#searchingPlacesTags",new Tagify(document.getElementById('searchingPlacesTags')));

function setTagsOf(inputId,tags){
    tagifies.get(inputId).removeAllTags();
    tagifies.get(inputId).addTags(tags);
}

function getTagsOf(inputId){

    var tags = [];
    if($(inputId).val()!==""){
        for (const tag of JSON.parse($(inputId).val())) {
            tags.push(tag.value);
        }
    }

    return tags;
}


/**
 * Main
 */
$(document).ready(function () {
    console.log("Test 2.14");

    UserManager.loadUser();
    LeafletManager.build();
    ClickManager.build();
});