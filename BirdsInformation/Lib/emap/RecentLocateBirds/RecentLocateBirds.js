define([
    "dojo/dom", "dojo/_base/Color", // feature detection

    'dojo/_base/declare','dijit/_WidgetBase','dijit/_TemplatedMixin','dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang', "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/layers/GraphicsLayer", "esri/symbols/PictureFillSymbol", "esri/symbols/SimpleLineSymbol",
    "dojo/text!emap/RecentLocateBirds/templates/RecentLocateBirds.html",
    "dojo/i18n!emap/RecentLocateBirds/nls/Resource",
    'xstyle/css!../RecentLocateBirds/css/RecentLocateBirds.css',
    ],
    function (dom,Color,declare,
        _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, SimpleMarkerSymbol, PictureMarkerSymbol,
        GraphicsLayer, PictureFillSymbol,SimpleLineSymbol,dijitTemplate, i18n) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: dijitTemplate,
        widgetsInTemplate: true,
        _i18n: i18n,
        map: null,
        title: i18n.title,
        domNode: null,
        currentwidget: null,
        sponsorassignedids:[],
        
        constructor: function (options, srcRefNode) {
            // mix in settings and defaults           
            options = options || {};
            lang.mixin(this, options); //update the properties
            // widget node
            this.domNode = srcRefNode;
            // store localized strings
            this._i18n = i18n;

        },
        postCreate: function () {
            this.inherited(arguments);
            currentwidget = this;

            var RecentbirdsLocLayer = new GraphicsLayer({ id: "Birds Layer" });
            configOptions.CurrentMap.addLayer(RecentbirdsLocLayer);
        },
        startup: function () {
            var currentWidget = this;
            try {
                var currentWidget = this;
                currentWidget.getsponsorids();
                currentWidget.getBirdsRecentLocation();

            }
            catch (e) {
                console.log(e);
            }

        },

        refreshAccessToken1: function (rtoken) {
            var currentWidget = this;
            console.log(currentWidget);

            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: currentWidget.ServiceUrl + "/refreshToken",  // Correct URL syntax
                    type: 'POST',  // HTTP method
                    contentType: 'application/json',  // Set content type to JSON
                    data: JSON.stringify({ rtoken }),  // Convert the data object to a JSON string
                    success: function (data) {
                        resolve(data);  // Resolve the promise with the new access token
                    },
                    error: function (xhr, status, error) {
                        console.error('Error refreshing token:', error);  // Log the error
                        reject(error);  // Reject the promise with the error
                    }
                });
            });
        },

    
        getBirdsRecentLocation: function () {
            var currentWidget = this;
            var url = currentWidget.ServiceUrl + 'JsonGetRecentLiveBirds/';

            var token = localStorage.getItem('token'); // Assuming 'token' is the key where your JWT is stored
            var refreshtoken = localStorage.getItem('refreshtoken');

            if (!token) {
                console.error("Token not found in localStorage!");
                return;
            }
            
            if (currentWidget.map.graphicsLayerIds.indexOf("Birds Layer") >= 0) {
                var birdsLayer = currentWidget.map.getLayer("Birds Layer");
            }
            else {
                var birdsLayer = new GraphicsLayer({ id: "Birds Layer" });
                currentWidget.map.addLayer(birdsLayer);
            }

            $.ajax({
                type: "GET",
                url: url,
                crossDomain: true,
                //headers: {
                //    'Authorization': `Bearer ${token}`,
                //},
                success: function (respnse) {
                    console.log(respnse)
                    var birdsLastTrackInfo = JSON.parse(respnse.JsonGetRecentLiveBirdsResult);
                    var resultExtent = null;
                    if (configOptions.UserInfo.UserRole == "Sponsor") {
                        for (var i = 0; i < birdsLastTrackInfo.Table.length; i++) {
                            if (currentWidget.sponsorassignedids.indexOf(birdsLastTrackInfo.Table[i].PLATFORM_ID) >= 0){
                                var latX = 0, longY = 0;
                                var point = [];
                                if (!currentWidget.CheckFloatValue(birdsLastTrackInfo.Table[i].lat.replace(/\s/g, '')) || !currentWidget.CheckFloatValue(birdsLastTrackInfo.Table[i].long.replace(/\s/g, ''))) {
                                    continue;
                                }
                                if (parseFloat(birdsLastTrackInfo.Table[i].lat) != latX && parseFloat(birdsLastTrackInfo.Table[i].long) != longY) {
                                    point.push(parseFloat(birdsLastTrackInfo.Table[i].long.replace(/\s/g, '')));
                                    point.push(parseFloat(birdsLastTrackInfo.Table[i].lat.replace(/\s/g, '')));
                                }
                                else
                                    continue;

                                var pt = new esri.geometry.Point(point, new esri.SpatialReference({ wkid: 4326 }));
                                
                                if (birdsLastTrackInfo.Table[i].CName == "Greater Flamingo" || birdsLastTrackInfo.Table[i].CName == "GREATER FLAMINGO") {
                                    var graphicColor = "red";
                                    var symbol = new PictureMarkerSymbol({
                                        //"url": "assets/img/gallery_images/7.png",
                                        "url": "Images/Flamingo.png",
                                        "height": 20,
                                        "width": 20,
                                        "type": "esriPMS",
                                        "angle": 5,
                                    });
                                }
                                else if (birdsLastTrackInfo.Table[i].CName == "Egyptian Vulture" || birdsLastTrackInfo.Table[i].CName == "Sparrowhawk" || birdsLastTrackInfo.Table[i].CName == "Great Crested Tern" || birdsLastTrackInfo.Table[i].CName == "Red Billed Tropicbird" || birdsLastTrackInfo.Table[i].CName == "Marsh Harrier" || birdsLastTrackInfo.Table[i].CName == "Arabian Partridge" || birdsLastTrackInfo.Table[i].CName == "Crab Plover" || birdsLastTrackInfo.Table[i].CName == "CRAB PLOVER" || birdsLastTrackInfo.Table[i].CName == "Sooty Gull" || birdsLastTrackInfo.Table[i].CName == "Sooty Falcon" || birdsLastTrackInfo.Table[i].CName == "Greater Spotted Eagle" || birdsLastTrackInfo.Table[i].CName == "OSPREY" || birdsLastTrackInfo.Table[i].CName == "Steppe Eagle") {
                                    var graphicColor = "green";
                                    var symbol = new PictureMarkerSymbol({
                                        //"url": "assets/img/gallery_images/10.png",
                                        "url": "Images/Eagle.png",
                                        "height": 20,
                                        "width": 20,
                                        "type": "esriPMS",
                                        "angle": 30,
                                    });
                                    
                                }

                                var graphic = new esri.Graphic(pt, symbol, birdsLastTrackInfo.Table[i].PLATFORM_ID);
                                birdsLayer.add(graphic);

                                var extent = new esri.geometry.Extent(pt.x - 1, pt.y - 1, pt.x + 1, pt.y + 1, pt.SpatialReference);

                                if (resultExtent == null)
                                    resultExtent = extent;
                                else
                                    resultExtent = resultExtent.union(extent);
                            }
                        }
                    } else {
                        for (var i = 0; i < birdsLastTrackInfo.Table.length; i++) {
                            var latX = 0, longY = 0;
                            var point = [];
                            if (!currentWidget.CheckFloatValue(birdsLastTrackInfo.Table[i].lat.replace(/\s/g, '')) || !currentWidget.CheckFloatValue(birdsLastTrackInfo.Table[i].long.replace(/\s/g, ''))) {
                                continue;
                            }
                            if (parseFloat(birdsLastTrackInfo.Table[i].lat) != latX && parseFloat(birdsLastTrackInfo.Table[i].long) != longY) {
                                point.push(parseFloat(birdsLastTrackInfo.Table[i].long.replace(/\s/g, '')));
                                point.push(parseFloat(birdsLastTrackInfo.Table[i].lat.replace(/\s/g, '')));
                            }
                            else
                                continue;

                            var pt = new esri.geometry.Point(point, new esri.SpatialReference({ wkid: 4326 }));
                            if (birdsLastTrackInfo.Table[i].CName == "Greater Flamingo" || birdsLastTrackInfo.Table[i].CName == "GREATER FLAMINGO") {
                                
                                var graphicColor = "red";
                                var symbol = new PictureMarkerSymbol({
                                    //"url": "assets/img/gallery_images/7.png",
                                    "url": "Images/Flamingo.png",
                                    "height": 20,
                                    "width": 20,
                                    "type": "esriPMS",
                                    "angle": 5,
                                });
                            }
                            else if (birdsLastTrackInfo.Table[i].CName == "Egyptian Vulture" || birdsLastTrackInfo.Table[i].CName == "Sparrowhawk" || birdsLastTrackInfo.Table[i].CName == "Great Crested Tern" || birdsLastTrackInfo.Table[i].CName == "Red Billed Tropicbird" || birdsLastTrackInfo.Table[i].CName == "Marsh Harrier" || birdsLastTrackInfo.Table[i].CName == "Arabian Partridge" || birdsLastTrackInfo.Table[i].CName == "Crab Plover" || birdsLastTrackInfo.Table[i].CName == "CRAB PLOVER" || birdsLastTrackInfo.Table[i].CName == "Sooty Gull" || birdsLastTrackInfo.Table[i].CName == "Sooty Falcon" || birdsLastTrackInfo.Table[i].CName == "Greater Spotted Eagle" || birdsLastTrackInfo.Table[i].CName == "OSPREY" || birdsLastTrackInfo.Table[i].CName == "Steppe Eagle") {
                                var graphicColor = "green";
                                var symbol = new PictureMarkerSymbol({
                                    //"url": "assets/img/gallery_images/10.png",
                                    "url": "Images/Eagle.png",
                                    "height": 20,
                                    "width": 20,
                                    "type": "esriPMS",
                                    "angle": 30,
                                });
                            
                            }

                            var graphic = new esri.Graphic(pt, symbol, birdsLastTrackInfo.Table[i].PLATFORM_ID);
                            birdsLayer.add(graphic);

                            var extent = new esri.geometry.Extent(pt.x - 1, pt.y - 1, pt.x + 1, pt.y + 1, pt.SpatialReference);

                            if (resultExtent == null)
                                resultExtent = extent;
                            else
                                resultExtent = resultExtent.union(extent);
                        }
                        if (resultExtent != null) {
                            currentWidget.map.setExtent(resultExtent);
                        }
                    }
                },
                error: function (error) {
                    //if (error.status === 401) {
                    //    return currentWidget.refreshAccessToken1(refreshtoken).then(newAccessToken => {
                    //        localStorage.setItem('token', newAccessToken);
                    //        currentWidget.getBirdsRecentLocation();  // Retry with the new token
                    //    });
                    //}
                    console.log(error)
                }
            })
        },
        
        CheckFloatValue: function (val) {

            if (parseFloat(val) == null) {
                return false;
            }
            else if (isNaN(parseFloat(val))) {
                return false;
            }
            else {
                return true;
            }
        },
        getsponsorids: function () {
            var currentWidget = this;
            if (configOptions.UserInfo.UserRole == "Sponsor") {
                var UserName = configOptions.UserInfo.UserName;
                var requestData = {
                    login: configOptions.UserInfo.UserName
                };
                var url = currentwidget.ServiceUrl + 'JsonGetUserAssinedBirdsDtls/';
                $.ajax({
                    url: url,
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                         var jsonObj = JSON.parse(result);
                        if (jsonObj != null) {
                            var strAssignBirds = jsonObj.AssignedBirds;
                            currentWidget.sponsorassignedids = jsonObj["AssignedBirds"];
                            //for (i = 0; i < publicuser.length; i++) {
                            //    sponsorassignedids.push(publicuser[i]);
                            //}
                        }
                    },
                    error: function (xhr, error) {
                        console.debug(xhr); console.debug(error);
                    },
                });

            }
        }
   });
});