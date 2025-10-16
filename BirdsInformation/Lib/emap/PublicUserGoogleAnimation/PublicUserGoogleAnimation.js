define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/topic',
    "dojo/text!emap/PublicUserGoogleAnimation/templates/PublicUserGoogleAnimation.html",

    "dojo/i18n!emap/PublicUserGoogleAnimation/nls/Resource",
    'xstyle/css!../PublicUserGoogleAnimation/css/PublicUserGoogleAnimation.css',

], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, topic, dijitTemplate, i18n) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: dijitTemplate,
        widgetsInTemplate: true,
        _i18n: i18n,
        gmap1: null,
        title: i18n.title,
        domNode: null,
        ServiceUrl: null,
        queryResultsWidget: null,
        speciescolors: null,
        queryinfo: null,
        heatmap: null,
        globalcurrentWidget: null,
        lineSymbolAnimate: null,
        onUpdate: false,
        plines: null,
        TempCords: null,
        TempLat: null,
        TempLong: null,
        GMapAnimateWidget: null,
        animationStatus: true,
        chkSeasonWise: false,

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
            var currentWidget = this;

            speciescolors = ['#0000cc', '#ffff00', '#ff0066', '#003366', '#6699ff', '#66ff33'];

            if (window.location.hostname == "localhost") {
                currentWidget.animateIcon = "../../../../Images/bird-icon.gif";
            }
            else {
                currentWidget.animateIcon = "Images/bird-icon.gif";

            }

            $(".CloseContainerG").click(function () {
                $(".ManageContainer").animate({
                    bottom: '-100%'
                }, 200);

                if (currentWidget.lineSymbolAnimate != null) {
                    currentWidget.lineSymbolAnimate.setMap(null);
                }



            });



        },

        startup: function (queryinforesult) {
            var currentWidget = this;
        },




        GoogleAnimate: function () {
            var currentWidget = this;
            gmap1 = new google.maps.Map(document.getElementById("map"), {
                center: new google.maps.LatLng(24.123512, 54.224812),
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: [
                    {
                        "featureType": "landscape",
                        "stylers": [
                            { "lightness": "49" }, { "gamma": "1.53" }, { "weight": "1.00" }, { "visibility": "on" }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "stylers": [
                            {
                                "hue": "#FFC200"
                            },
                            {
                                "saturation": -61.8
                            },
                            {
                                "lightness": 45.599999999999994
                            },
                            {
                                "gamma": 1
                            }
                        ]
                    },
                    {
                        "featureType": "road.arterial",
                        "stylers": [
                            {
                                "hue": "#FF0300"
                            },
                            {
                                "saturation": -100
                            },
                            {
                                "lightness": 51.19999999999999
                            },
                            {
                                "gamma": 1
                            }
                        ]
                    },
                    {
                        "featureType": "road.local",
                        "stylers": [
                            {
                                "hue": "#FF0300"
                            },
                            {
                                "saturation": -100
                            },
                            {
                                "lightness": 52
                            },
                            {
                                "gamma": 1
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "stylers": [
                            { "color": "#99bbff" }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "stylers": [
                            {
                                "hue": "#00FF6A"
                            },
                            {
                                "saturation": -1.0989010989011234
                            },
                            {
                                "lightness": 11.200000000000017
                            },
                            {
                                "gamma": 1
                            }
                        ]
                    }
                ]
            });
        },


        CheckFloatValue: function (val) {
            var currentWidget = this;
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

        PopulateBirdNames: function (result) {
            var currentWidget = this;

            currentWidget.GoogleAnimate();
            if (result.length == 0) {
                return;
            }

            var routePoints = [];
            var width = 5;

            var points = [], dates = [], gap = [], speed = [], altitude = [], positionvalues = [];
            currentWidget.plines = [];
            for (var i = 0; i < result.length; i++) {


                if (!currentWidget.CheckFloatValue(result[i].LAT.replace(/\s/g, '')) || !currentWidget.CheckFloatValue(result[i].LONG.replace(/\s/g, ''))) {
                    continue;
                }

                var latval = parseFloat(result[i].LAT.replace(/\s/g, ''));
                var longval = parseFloat(result[i].LONG.replace(/\s/g, ''));

                if (latval == 0 && longval == 0) {
                    continue;
                }

                var pos = new google.maps.LatLng(latval, longval);
                points.push(pos);

                if (i > 0) {
                    var latval1 = parseFloat(result[i - 1].LAT.replace(/\s/g, ''));
                    var longval1 = parseFloat(result[i - 1].LONG.replace(/\s/g, ''));

                    if (latval != latval1 || longval != longval1) {
                        var dist = Math.sqrt(((longval - longval1) * (longval - longval)) + ((latval - latval1) * (latval - latval1)));
                        if (dist > 0.1) {
                            routePoints.push(pos);
                            positionvalues.push({ LAT: latval, LONG: longval, date: GetFormatedDate(result[i].DATE.split("T")[0]) + "   " + result[i].DATE.split("T")[1], speed: result[i].SPEED, altitude: result[i].ALTITUDE, Pid: result[i].PID, Migration: result[i].Migration });
                            dates.push(result[i].DATE);
                            speed.push(result[i].SPEED);
                            altitude.push(result[i].ALTITUDE);
                            //pid.push(result[i].platFormID);
                        }
                    }
                }
            }
            if (positionvalues.length == 0 && result.length > 3) {
                var cnt = 0;
                for (var j = 0; j <= result.length; j++) {

                    if (cnt == result.length) {
                        break;
                    }
                    var latval = parseFloat(result[cnt].LAT.replace(/\s/g, ''));
                    var longval = parseFloat(result[cnt].LONG.replace(/\s/g, ''));

                    var pos = new google.maps.LatLng(latval, longval);
                    points.push(pos);
                    routePoints.push(pos);
                    positionvalues.push({ LAT: latval, LONG: longval, date: GetFormatedDate(result[cnt].DATE.split("T")[0]) + "   " + result[cnt].DATE.split("T")[1], speed: result[cnt].SPEED, altitude: result[cnt].ALTITUDE, Pid: result[cnt].PID, Migration: result[cnt].Migration });
                    dates.push(result[cnt].DATE);
                    speed.push(result[cnt].SPEED);
                    altitude.push(result[cnt].ALTITUDE);
                    cnt = cnt + 3;
                }
            }

            hullPoints = [];
            var speed = 1000;
            var coords = positionvalues;

            currentWidget.lineSymbolAnimate = new google.maps.Marker({
                icon: {
                    url: currentWidget.animateIcon,
                },
                position: new google.maps.LatLng(positionvalues[0].LAT, positionvalues[0].LONG),
                map: gmap1
            });

            var newpoly = new google.maps.Polyline({
                map: gmap1,
                icons: [{
                    fixedRotation: true,
                    icon: currentWidget.lineSymbolAnimate,
                    offset: '100%'
                }],
                path: routePoints,
                strokeWeight: 15,
                strokeColor: "#006c4e",
                strokeOpacity: 0.2
            });

            currentWidget.plines.push(newpoly);

            if (routePoints.length > 1) {
                for (var s = 1; s < routePoints.length; s++) {
                    var tempPoints = [];
                    tempPoints.push(routePoints[s - 1]);
                    tempPoints.push(routePoints[s]);

                    var tempmonth = dates[s - 1].split("-")[1];
                    tempmonth = parseInt(tempmonth);
                    var tempcolor = "#006c4e";

                    if (tempmonth == 1) {
                        tempcolor = "#00ffbf";
                    }
                    else if (tempmonth == 2) {
                        tempcolor = "#00ff80";
                    }
                    else if (tempmonth == 3) {
                        tempcolor = "#00ff40";
                    }
                    else if (tempmonth == 4) {
                        tempcolor = "#00ff00";
                    }
                    else if (tempmonth == 5) {
                        tempcolor = "#40ff00";
                    }
                    else if (tempmonth == 6) {
                        tempcolor = "#80ff00";
                    }
                    else if (tempmonth == 7) {
                        tempcolor = "#bfff00";
                    }
                    else if (tempmonth == 8) {
                        tempcolor = "#ffff00";
                    }
                    else if (tempmonth == 9) {
                        tempcolor = "#ffbf00";
                    }
                    else if (tempmonth == 10) {
                        tempcolor = "#ff8000";
                    }
                    else if (tempmonth == 11) {
                        tempcolor = "#ff4000";
                    }
                    else if (tempmonth == 12) {
                        tempcolor = "#ff0000";
                    }

                    var temppoly = new google.maps.Polyline({
                        map: gmap1,
                        path: tempPoints,
                        strokeWeight: 15,
                        strokeColor: tempcolor,
                        strokeOpacity: 0.010
                    })
                    currentWidget.plines.push(temppoly);
                }
            }

            var heatMapData = [];
            var heatmap;
            for (var f = 0; f < points.length; f++) {
                heatMapData.push({ location: points[f], weight: 10 });
            }

            if (heatmap != null) {
                heatmap.setMap(null);
            }
            heatmap = new google.maps.visualization.HeatmapLayer({
                data: heatMapData,
                map: gmap1
            });

            heatmap.set('radius', 20);
            heatmap.set('opacity', 0.8);

            //var AnimationCoords = [];
            //AnimationCoords = coords;
            currentWidget.animationStatus = true;
            currentWidget.animateMarker(currentWidget.lineSymbolAnimate, coords);
        },


        animateMarker: function (marker, coords) {
            var currentWidget = this;
            var count = 0;
            var target = 1;
            var delay = 1;

            //marker.setMap(null);
            var numStep = $(currentWidget.speedval).val();

            function goToPoint() {
                var lat = marker.position.lat();
                var lng = marker.position.lng();

                var dest = new google.maps.LatLng(
                    coords[target].LAT, coords[target].LONG);

                numStep = $(currentWidget.speedval).val();

                var i = 0;
                var deltaLat = (coords[target].LAT - lat) / numStep;
                var deltaLng = (coords[target].LONG - lng) / numStep;

                function moveMarker() {
                    lat += deltaLat;
                    lng += deltaLng;

                    //Raj
                    count = count + 1;

                    if (i != numStep) {

                        i++;
                        marker.setPosition(new google.maps.LatLng(lat, lng));
                        setTimeout(moveMarker, delay);

                    }
                    else {
                        marker.setPosition(dest);
                        target++;
                        if (target == coords.length) {
                            marker.setMap(null);
                            target = 0;
                        }
                        else {
                            marker.setMap(gmap1);
                        }
                        setTimeout(goToPoint, delay);
                    }
                }
                moveMarker();
            }
            goToPoint();
        },
    });
});