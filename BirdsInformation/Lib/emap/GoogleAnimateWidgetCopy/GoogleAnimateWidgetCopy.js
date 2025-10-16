define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/topic',
    "esri/TimeExtent",
    "esri/dijit/TimeSlider",
    "dojo/dom",
    "dojo/_base/array",
    "dojo/text!emap/GoogleAnimateWidgetCopy/templates/GoogleAnimateWidgetCopy.html",

    "dojo/i18n!emap/GoogleAnimateWidgetCopy/nls/Resource",
    'xstyle/css!../GoogleAnimateWidgetCopy/css/GoogleAnimateWidgetCopy.css',

], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, topic, TimeExtent, TimeSlider, dom, arrayUtils, dijitTemplate, i18n) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: dijitTemplate,
        widgetsInTemplate: true,
        _i18n: i18n,
        gmap: null,
        title: i18n.title,
        domNode: null,
        ServiceUrl: null,
        queryResultsWidget: null,
        speciescolors: null,
        gmap: null,
        queryinfo: null,
        heatmap: null,
        globalcurrentWidget: null,
        lineSymbolAnimate: null,
        TempSymbolAnimate: null,
        onUpdate: false,
        plines: null,
        TempCords: null,
        TempLat: null,
        TempLong: null,
        GMapAnimateWidget: null,
        animationStatus: true,
        chkSeasonWise: false,
        markerBirdId: null,
        previousMarkersIDs: [],
        previousMarkers: [],
        Animatepolyline: null,
        markerForPublic: null,
        AnimateMarkers: [],
        MultiPolyline: [],
        Multiroute: [],
        TotalStartflags: [],
        TotalEndflags:[],
        NoDataVariable: null,


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
            globalcurrentWidget = this;
            GMapAnimateWidget = this;
            speciescolors = ['#0000cc', '#ffff00', '#ff0066', '#003366', '#6699ff', '#66ff33'];

            if (window.location.hostname == "localhost") {
                GMapAnimateWidget.animateIcon = "../../../../Images/birdiconRed.png";
            }
            else {
                GMapAnimateWidget.animateIcon = "Images/birdiconRed.png";
            }


            $(GMapAnimateWidget.Animationrecord).click(function () {
                topic.publish('Animation/AnimationRecordVideo');
            });

            $('.PanelToggleAnim').click(function () {
                var pgDir = document.getElementsByTagName('html');
                if (pgDir[0].dir == 'rtl' || pgDir[0].style.direction == 'rtl') {
                    var SlideDiv = $(".AnimationSideDiv").css("right");
                    if (SlideDiv == "0px") {
                        $(this).closest(".ManageContainer").find(".AnimationSideDiv").show().animate({
                            right: '-280px'
                        }, 200);
                        $('.PanelToggleAnim').html('<i class="fas fa-angle-double-right"></i>');
                        $('.PanelToggleAnim').show().animate({ right: '0px' }, 200);
                    } else {
                        $(this).closest(".ManageContainer").find(".AnimationSideDiv").show().animate({
                            right: '0px'
                        }, 200);
                        $('.PanelToggleAnim').html('<i class="fas fa-angle-double-left"></i>');
                        $('.PanelToggleAnim').show().animate({ right: '250px' }, 200);
                    }

                }
                else {
                    var SlideDiv = $(".AnimationSideDiv").css("left");
                    if (SlideDiv == "0px") {
                        $(this).closest(".ManageContainer").find(".AnimationSideDiv").show().animate({
                            left: '-280px'
                        }, 200);

                        $('.PanelToggleAnim').html('<i class="fas fa-angle-double-right"></i>');
                        $('.PanelToggleAnim').show().animate({ left: '0px' }, 200);
                    } else {
                        $(this).closest(".ManageContainer").find(".AnimationSideDiv").show().animate({
                            left: '0px'
                        }, 200);
                        $('.PanelToggleAnim').html('<i class="fas fa-angle-double-left"></i>');
                        $('.PanelToggleAnim').show().animate({ left: '250px' }, 200);

                    }
                }
            });

            this.queryinfo = {
                type: $(this.ddlsensor).val(),
                settype: function (sensortype) {
                    if (sensortype.toLowerCase() == "argos") {
                        currentWidget.queryinfo.type = "Argos";
                        currentWidget.queryinfo.funcname = "jsonArgos";
                    }
                    else if (sensortype == "GPS") {
                        currentWidget.queryinfo.type = "GPS";
                        currentWidget.queryinfo.funcname = "jsonGPSData";
                    }
                    else {
                        currentWidget.queryinfo.type = "GSM";
                        currentWidget.queryinfo.funcname = "jsonGSMData";
                    }
                },
                datefield: "DATE",
                latfield: "LAT",
                longfield: "LONG",
                platformid: $(this.ddlplatformid).val(),
                locclass: $(this.locationclasses).val(),
                platformidList: $(this.divPlatFormIds).val(),
                year: "",
                fromdate: $(this.fromdate).val(),
                todate: $(this.todate).val(),
                timeinterval: $(this.tentacles).val(),
                seasonWise: "",
                funcname: "",
                commonname: "",
                commonptts: [],
                commontype: "",
                results: {
                    data: [],
                    savelayerinfo: function (id, obj, status, result) {
                        this.id = id;
                        this.obj = obj;
                        this.status = status;
                        this.result = result;
                    }
                }
            }

            GMapAnimateWidget.timeSlider = new TimeSlider({
                style: "width: 100%;"
            }, dom.byId("timeSliderDiv"));
            map.setTimeSlider(GMapAnimateWidget.timeSlider);

            $(".CloseContainerG").click(function () {
                $(".ManageContainer").animate({
                    bottom: '-100%'
                }, 200);

                $('.PanelToggleAnim').hide();

                $(".navbar").css("visibility", "visible");
                $(".ManageContainer").css("height", "calc(100vh - 60px)");
                $(".Animationdiv").css("height", "calc(100vh - 62px)");

                if (GMapAnimateWidget.markerForPublic != null) {
                    GMapAnimateWidget.markerForPublic.setMap(null);
                    GMapAnimateWidget.markerForPublic = null;
                    GMapAnimateWidget.markerForPublic = [];
                }
                if (GMapAnimateWidget.lineSymbolAnimate != null) {
                    GMapAnimateWidget.lineSymbolAnimate.setMap(null);
                    GMapAnimateWidget.lineSymbolAnimate = null;
                }

                if (GMapAnimateWidget.heatmap != null) {
                    GMapAnimateWidget.heatmap.setMap(null);
                    GMapAnimateWidget.heatmap = null;
                }
                $(GMapAnimateWidget.animControl).text("Stop");
                GMapAnimateWidget.animationStatus = false;
                GMapAnimateWidget.previousMarkersIDs = [];
            });


            $(currentWidget.animControl).click(function () {
                var pgDirR = document.getElementsByTagName('html');
                //user toggles the status, if the current label is start, it means user want to stop
                if ($(GMapAnimateWidget.animControl).text() == 'Start' || $(GMapAnimateWidget.animControl).text() == "بداية") {
                    if (pgDirR[0].dir == 'rtl' || pgDirR[0].style.direction == 'rtl')
                        $(GMapAnimateWidget.animControl).text("قف");
                    else
                        $(GMapAnimateWidget.animControl).text("Stop");

                    GMapAnimateWidget.animationStatus = true;

                    topic.publish('mapClickMode/StartAnimation');
                }
                else if ($(GMapAnimateWidget.animControl).text() == 'Stop' || $(GMapAnimateWidget.animControl).text() == "قف") {
                    if (pgDirR[0].dir == 'rtl' || pgDirR[0].style.direction == 'rtl')
                        $(GMapAnimateWidget.animControl).text("بداية");
                    else
                        $(GMapAnimateWidget.animControl).text("Start");

                    GMapAnimateWidget.animationStatus = false;
                }



            });

            var rad = function (x) {
                return x * Math.PI / 180;
            };
            google.maps.LatLng.prototype.kmTo = function (a) {
                var e = Math, ra = e.PI / 180;
                var b = this.lat() * ra, c = a.lat() * ra, d = b - c;
                var g = this.lng() * ra - a.lng() * ra;
                var f = 2 * e.asin(e.sqrt(e.pow(e.sin(d / 2), 2) + e.cos(b) * e.cos
                    (c) * e.pow(e.sin(g / 2), 2)));
                return f * 6378.137;
            };
            google.maps.Polyline.prototype.inKm = function (n) {
                var a = this.getPath(n), len = a.getLength(), dist = 0;
                for (var i = 0; i < len - 1; i++) {
                    dist += a.getAt(i).kmTo(a.getAt(i + 1));
                }
                return dist;
            };









        },

        startup: function (queryinforesult) {
            var currentWidget = this;

        },

        initSlider: function (startDate, EndDate) {

            
            var myTimeStepIntervals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

            GMapAnimateWidget.timeSlider.startup();

            
            var labels = {}
            GMapAnimateWidget.timeSlider.setLabels(labels);

        },

        GoogleAnimate: function () {
            var currentWidget = this;
            var pgDir = document.getElementsByTagName('html');

            if (pgDir[0].dir == 'rtl' || pgDir[0].style.direction == 'rtl') {

                // Styles a map in night mode.
                gmap = new google.maps.Map(document.getElementById("map"), {
                    center: new google.maps.LatLng(24.123512, 54.224812),
                    zoom: 4,
                    fullscreenControl: true,
                    fullscreenControlOptions: {
                        position: google.maps.ControlPosition.TOP_LEFT,
                    },
                    streetViewControl: true,
                    streetViewControlOptions: {
                        position: google.maps.ControlPosition.BOTTOM_LEFT,
                    },
                    mapTypeControl: true,
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                        position: google.maps.ControlPosition.TOP_LEFT,
                    },
                    zoomControl: true,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.BOTTOM_LEFT,
                    },
                    styles: [
                        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                        {
                            featureType: "administrative.locality",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }],
                        },
                        {
                            featureType: "poi",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }],
                        },
                        {
                            featureType: "poi.park",
                            elementType: "geometry",
                            stylers: [{ color: "#263c3f" }],
                        },
                        {
                            featureType: "poi.park",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#6b9a76" }],
                        },
                        {
                            featureType: "road",
                            elementType: "geometry",
                            stylers: [{ color: "#38414e" }],
                        },
                        {
                            featureType: "road",
                            elementType: "geometry.stroke",
                            stylers: [{ color: "#212a37" }],
                        },
                        {
                            featureType: "road",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#9ca5b3" }],
                        },
                        {
                            featureType: "road.highway",
                            elementType: "geometry",
                            stylers: [{ color: "#746855" }],
                        },
                        {
                            featureType: "road.highway",
                            elementType: "geometry.stroke",
                            stylers: [{ color: "#1f2835" }],
                        },
                        {
                            featureType: "road.highway",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#f3d19c" }],
                        },
                        {
                            featureType: "transit",
                            elementType: "geometry",
                            stylers: [{ color: "#2f3948" }],
                        },
                        {
                            featureType: "transit.station",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }],
                        },
                        {
                            featureType: "water",
                            elementType: "geometry",
                            stylers: [{ color: "#17263c" }],
                        },
                        {
                            featureType: "water",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#515c6d" }],
                        },
                        {
                            featureType: "water",
                            elementType: "labels.text.stroke",
                            stylers: [{ color: "#17263c" }],
                        },
                    ],
                });
            }
            else {

                // Styles a map in night mode.
                gmap = new google.maps.Map(document.getElementById("map"), {
                    center: new google.maps.LatLng(24.123512, 54.224812),
                    zoom: 4,
                    mapTypeControl: true,
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                        position: google.maps.ControlPosition.TOP_RIGHT,
                    },
                    zoomControl: true,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.BOTTOM_RIGHT,
                    },
                    fullscreenControl: true,
                    fullscreenControlOptions: {
                        position: google.maps.ControlPosition.TOP_RIGHT,
                    },
                    streetViewControl: true,
                    streetViewControlOptions: {
                        position: google.maps.ControlPosition.BOTTOM_RIGHT,
                    },
                    styles: [
                        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                        {
                            featureType: "administrative.locality",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }],
                        },
                        {
                            featureType: "poi",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }],
                        },
                        {
                            featureType: "poi.park",
                            elementType: "geometry",
                            stylers: [{ color: "#263c3f" }],
                        },
                        {
                            featureType: "poi.park",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#6b9a76" }],
                        },
                        {
                            featureType: "road",
                            elementType: "geometry",
                            stylers: [{ color: "#38414e" }],
                        },
                        {
                            featureType: "road",
                            elementType: "geometry.stroke",
                            stylers: [{ color: "#212a37" }],
                        },
                        {
                            featureType: "road",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#9ca5b3" }],
                        },
                        {
                            featureType: "road.highway",
                            elementType: "geometry",
                            stylers: [{ color: "#746855" }],
                        },
                        {
                            featureType: "road.highway",
                            elementType: "geometry.stroke",
                            stylers: [{ color: "#1f2835" }],
                        },
                        {
                            featureType: "road.highway",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#f3d19c" }],
                        },
                        {
                            featureType: "transit",
                            elementType: "geometry",
                            stylers: [{ color: "#2f3948" }],
                        },
                        {
                            featureType: "transit.station",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }],
                        },
                        {
                            featureType: "water",
                            elementType: "geometry",
                            stylers: [{ color: "#17263c" }],
                        },
                        {
                            featureType: "water",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#515c6d" }],
                        },
                        {
                            featureType: "water",
                            elementType: "labels.text.stroke",
                            stylers: [{ color: "#17263c" }],
                        },
                    ],
                });
            }

        },

        SponserAnimation: function (birdid, birdtype) {
            var currentWidget = this;

            $(".AnimationSideDiv").css("display", "block");
            $(".BirdImagePannel").css("display", "none");
            $(".BirdTitlePannel").css("display", "none");
            $(currentWidget.divDateTimeSlider).css("display", "none");
            $(".bottompanelIWForPublic").css("display", "none");

            $(".SlideDateDIv").addClass("SlideDateDIvMultiple");

            currentWidget.GoogleAnimate();

            GMapAnimateWidget.ResetAnimationInfo();

            $("#hide-poi").prop('checked', true);

            var legnedcolor = 0;
            var ddlYears = currentWidget.queryinfo.year;
            if (currentWidget.queryinfo.year === "" || currentWidget.queryinfo.year === null) {
                ddlYears = "9999";

            }
            var ctimeInterval = currentWidget.queryinfo.timeinterval;
            if (currentWidget.queryinfo.timeinterval === "" || currentWidget.queryinfo.timeinterval === null) {
                ctimeInterval = "null";
            }
            var fromdate = currentWidget.queryinfo.fromdate;
            var todate = currentWidget.queryinfo.todate;
            $(currentWidget.gmapbirdDetails).empty();
            currentWidget.NoDataVariable = "";

            for (var i = 0; i < birdid.length; i++) {
                currentWidget.queryinfo.platformid = birdid[i];
                currentWidget.queryinfo.type = birdtype[i];
                //currentWidget.AddDataTogmapWithID();
                currentWidget.NoDataVariable += currentWidget.queryinfo.platformid + ",";
                currentWidget.GetCommonName(currentWidget.queryinfo.platformid);
                var requestData = {
                    id: currentWidget.queryinfo.platformid,
                    type: currentWidget.queryinfo.type,
                    fromdate: fromdate,
                    todate: todate,
                    timeinterval: ctimeInterval
                };
                currentWidget.GetData("JsonDatagmapondateWithInterval", requestData, currentWidget.PopulateBirdNames, currentWidget.Empty, "Plotting Data ", "Process Failed", 5000);
                var birdsclf = "<div class='item open'><div class='header'><div id='symbol_" + currentWidget.queryinfo.platformid + "' class='birdIndetity' style='background:" + speciescolors[legnedcolor++] + "'></div>&nbsp;&nbsp;&nbsp" + currentWidget.queryinfo.platformid + "(" + currentWidget.queryinfo.commonname +")" + "</div>";
                birdsclf += "<div id='" + currentWidget.queryinfo.platformid + "'></div>";
                birdsclf += "<div id='gmap_message_" + currentWidget.queryinfo.platformid + "'></div></div > ";

                $(currentWidget.gmapbirdDetails).append(birdsclf);

                $(currentWidget.fromdate).val(fromdate);
                $(currentWidget.todate).val(todate);
                $(currentWidget.gmapBirdImage).attr("src", currentWidget.GetBirdImage(currentWidget.queryinfo.commonname));
                $(currentWidget.gmapBirdName).html(currentWidget.queryinfo.commonname);
            }
            $('.PanelToggleAnim').show();
            $(".Overlay").fadeOut();
        },




        AddDataTogmapWithNames: function () {
            var currentWidget = this;

            $(".AnimationSideDiv").css("display", "block");
            $(currentWidget.divDateTimeSlider).css("display", "none");
            $(".bottompanelIWForPublic").css("display", "none");
            $(".SlideDateDIv").removeClass("SlideDateDIvMultiple");
            currentWidget.GoogleAnimate();

            GMapAnimateWidget.ResetAnimationInfo();

            $("#hide-poi").prop('checked', true);

            var legnedcolor = 0;
            var ddlYears = currentWidget.queryinfo.year;
            if (currentWidget.queryinfo.year === "" || currentWidget.queryinfo.year === null) {
                ddlYears = "9999";

            }
            var ctimeInterval = currentWidget.queryinfo.timeinterval;
            if (currentWidget.queryinfo.timeinterval === "" || currentWidget.queryinfo.timeinterval === null) {
                ctimeInterval = "null";
            }
            var fromdate = currentWidget.queryinfo.fromdate;
            var todate = currentWidget.queryinfo.todate;
            $(currentWidget.gmapbirdDetails).empty();

            var platFormID = [];
            platFormID = currentWidget.queryinfo.platformidList.split(",");

            currentWidget.chkSeasonWise = currentWidget.queryinfo.seasonWise;

            for (var k = 0; k < platFormID.length; k++) {
                var requestData = {
                    id: platFormID[k],
                    type: currentWidget.queryinfo.type,
                    yeardata: ddlYears,
                    timeinterval: ctimeInterval
                };
                currentWidget.GetData("jsonPttsYear", requestData, currentWidget.PopulateBirdNames, currentWidget.Empty, "Plotting Data ", "Process Failed", 5000);
                var birdsclf = "<div class='IDDateLoop'><div class='item open'><div class='header'><div id='symbol_" + platFormID[k] + "' class='birdIndetity' style='background:" + speciescolors[legnedcolor++] + "'></div>" + platFormID[k] + "</div></div>";
                birdsclf += "<div id='" + platFormID[k] + "' ></div>";
                birdsclf += "<div id='gmap_message_" + platFormID[k] + "'></div></div > ";
                $(currentWidget.gmapbirdDetails).append(birdsclf);
                $(currentWidget.fromdate).append(fromdate);
                $(currentWidget.todate).append(todate);
                $(currentWidget.gmapBirdImage).attr("src", currentWidget.GetBirdImage(currentWidget.queryinfo.commonname));
                $(currentWidget.gmapBirdName).html(currentWidget.queryinfo.commonname);
            }
            $('.PanelToggleAnim').show();
            $(".Overlay").fadeOut();
        },

        AddDataTogmapWithID: function () {
            var currentWidget = this;
            $(".AnimationSideDiv").css("display", "block");
            $(currentWidget.divDateTimeSlider).css("display", "none");
            $(".bottompanelIWForPublic").css("display", "none");
            $(".SlideDateDIv").removeClass("SlideDateDIvMultiple");
            currentWidget.GoogleAnimate();

            currentWidget.chkSeasonWise = currentWidget.queryinfo.seasonWise;

            GMapAnimateWidget.ResetAnimationInfo();
            $("#hide-poi").prop('checked', true);

            var legnedcolor = 0;
            var fromdate = currentWidget.queryinfo.fromdate;
            var todate = currentWidget.queryinfo.todate;

            currentWidget.GetCommonName(currentWidget.queryinfo.platformid);

            $(currentWidget.gmapbirdDetails).empty();
            var ctimeInterval = currentWidget.queryinfo.timeinterval;
            if (currentWidget.queryinfo.timeinterval === "" || currentWidget.queryinfo.timeinterval === null) {
                ctimeInterval = "null";
            }
            var requestData = {
                id: currentWidget.queryinfo.platformid,
                type: currentWidget.queryinfo.type,
                fromdate: fromdate,
                todate: todate,
                timeinterval: ctimeInterval
            };
            currentWidget.GetData("JsonDatagmapondateWithInterval", requestData, currentWidget.PopulateBirdNames, currentWidget.Empty, "Plotting Data ", "Process Failed", 5000);
            var birdsclf = "<div class='item open'><div class='header'><div id='symbol_" + currentWidget.queryinfo.platformid + "' class='birdIndetity' style='background:" + speciescolors[legnedcolor++] + "'></div>&nbsp;&nbsp;&nbsp" + currentWidget.queryinfo.platformid + "</div>";
            birdsclf += "<div id='" + currentWidget.queryinfo.platformid + "'></div>";
            birdsclf += "<div id='gmap_message_" + currentWidget.queryinfo.platformid + "'></div></div > ";


            $(currentWidget.gmapbirdDetails).append(birdsclf);

            $(currentWidget.fromdate).val(fromdate);
            $(currentWidget.todate).val(todate);
            $(currentWidget.gmapBirdImage).attr("src", currentWidget.GetBirdImage(currentWidget.queryinfo.commonname));
            $(currentWidget.gmapBirdName).html(currentWidget.queryinfo.commonname);

            $('.PanelToggleAnim').show();
            $(".Overlay").fadeOut();
        },

        GetData: function (func, requestData, callbackfuncSuccess, callbackfuncFailed, msgSuccess, msgFailed, msgDelaytime) {
            var currentWidget = this;
            $.ajax({
                type: "POST",
                url: configOptions.ServiceUrl + func + "/",
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (val) {
                    var result = [];
                    //result = currentWidget.ParseResult(func, val);
                    result = jQuery.parseJSON(val);
                    callbackfuncSuccess(result, msgSuccess);
                    $(".Overlay").fadeOut();
                },
                error: function (err) {
                    callbackfuncFailed();
                    $(".Overlay").fadeOut();
                    /*UpdateToolProgress(msgFailed, true, msgDelaytime);*/
                }
            });
        },

        GetCommonName: function (val) {
            var currentWidget = this;
            var requestData = {
                id: currentWidget.queryinfo.platformid
            };
            $.ajax({
                type: "POST",
                async: false,
                url: configOptions.ServiceUrl + "JSONBirdInfoForForm/"  ,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (val) {
                    var birdinfo = jQuery.parseJSON(val);
                    var str = birdinfo[0].CommonName.toLowerCase();
                    currentWidget.queryinfo.commonname = str.split(" ").map(item => item.substring(0, 1).toUpperCase() + item.substring(1)).join(" ");

                },
                error: function (err) {

                }

            });


        },
        validateDates: function (fromdate, todate) {
            var d1 = new Date(fromdate);
            var d2 = new Date(todate);
            if (d1 > d2) {
                return false;
            }
            return true;
        },

        ResetAnimationInfo: function () {

            GMapAnimateWidget.previousMarkersIDs = [];
            GMapAnimateWidget.animationStatus = false;
            //GMapAnimateWidget.AnimationCoords = null;

            if (GMapAnimateWidget.lineSymbolAnimate != null) {
                GMapAnimateWidget.lineSymbolAnimate.setMap(null);
                GMapAnimateWidget.lineSymbolAnimate = null;
            }

            if (GMapAnimateWidget.MultiPolyline != null) {
                for (i = 0; i < GMapAnimateWidget.MultiPolyline.length; i++) {
                    for (var j = 0; j < GMapAnimateWidget.MultiPolyline[i].length; j++) {
                        GMapAnimateWidget.MultiPolyline[i][j].setMap(null);
                    }                   
                }
            }

            if (GMapAnimateWidget.Multiroute != null) {
                for (i = 0; i < GMapAnimateWidget.Multiroute.length; i++) {
                    GMapAnimateWidget.Multiroute[i].setMap(null);
                }
            }

            if (GMapAnimateWidget.TotalStartflags != null) {
                for (i = 0; i < GMapAnimateWidget.TotalStartflags.length; i++) {
                    GMapAnimateWidget.TotalStartflags[i].setMap(null);
                }
            }
            if (GMapAnimateWidget.TotalEndflags != null) {
                for (i = 0; i < GMapAnimateWidget.TotalEndflags.length; i++) {
                    GMapAnimateWidget.TotalEndflags[i].setMap(null);
                }
            }
            if (GMapAnimateWidget.heatmap != null) {
                GMapAnimateWidget.heatmap.setMap(null);
                GMapAnimateWidget.heatmap = null;
            }

        },
        AddDataTogmapOnDate: function () {
            var currentWidget = this;
            $(currentWidget.divDateTimeSlider).css("display", "none");
            $(".bottompanelIWForPublic").css("display", "none");
            $(currentWidget.gmap_message).empty();

            currentWidget.chkSeasonWise = currentWidget.queryinfo.seasonWise;
            currentWidget.onUpdate = true;


            if (GMapAnimateWidget.lineSymbolAnimate != null) {
                if (GMapAnimateWidget.AnimateMarkers.length > 0) {
                    for (var i = 0; i < GMapAnimateWidget.AnimateMarkers.length; i++) {
                        GMapAnimateWidget.AnimateMarkers[i].setMap(null);
                    }
                    GMapAnimateWidget.AnimateMarkers = [];                 
                    
                }
            }
            GMapAnimateWidget.ResetAnimationInfo();

            var legnedcolor = 0;
            var id;

            id = currentWidget.queryinfo.platformid;

            if (id != null || id == 'undefined') {

                var d1 = $("#" + id + "_fromdate").val();
                var d2 = $("#" + id + "_todate").val();
                if (d1 > d2) {
                    $(currentWidget.gmap_message).html(currentWidget.queryinfo.platformid + " Dates are Invalid..");
                }
                else {
                    var requestData = {
                        id: id,
                        type: currentWidget.queryinfo.type,
                        fromdate: $("#" + id + "_fromdate").val(),
                        todate: $("#" + id + "_todate").val()
                    };
                    currentWidget.GetData("jsonDatagmapondate", requestData , currentWidget.PopulateBirdNames, currentWidget.Empty, "Plotting Data ", "Process Failed", 5000);

                }
            }
            else {
                var platFormID = [];
                platFormID = currentWidget.queryinfo.platformidList.split(",")

                for (var k = 0; k < platFormID.length; k++) {

                    var d1 = $("#" + platFormID[k] + "_fromdate").val();
                    var d2 = $("#" + platFormID[k] + "_todate").val();
                    if (d1 > d2) {
                        $(currentWidget.gmap_message).html(currentWidget.queryinfo.platformid + " Dates are Invalid..");
                    }
                    else {
                        var requestData = {
                            id: platFormID[k],
                            type: currentWidget.queryinfo.type,
                            fromdate: $("#" + platFormID[k] + "_fromdate").val(),
                            todate: $("#" + platFormID[k] + "_todate").val()
                        };
                        currentWidget.GetData("jsonDatagmapondate", requestData, currentWidget.PopulateBirdNames, currentWidget.Empty, "Plotting Data ", "Process Failed", 5000);

                    }
                }
            }



        },

        GetBirdImage: function (name) {

            for (var z = 0; z <= configOptions.AnimationBirdIcons.length; z++) {
                if (name == configOptions.AnimationBirdIcons[z].name) {
                    return configOptions.AnimationBirdIcons[z].icon;
                    break;
                }
            }


            //if (name == "Egyptian Vulture") {
            //    return "assets/img/EgyptianVulture.jpg"
            //    configOptions.AnimationBirdIcons.

            //}
            //else if (name == "Greater Spotted Eagle") {
            //    return "assets/img/GreaterSpottedEagle.jpg"
            //}
            //else if (name == "Greater Flamingo") {
            //    return "assets/img/GreaterFlamingo.jpg"
            //}

            //else if (name == "Osprey" || name =="Western Osprey") {
            //    return "assets/img/Osprey.jpg"
            //}
            //else if (name == "Great Crested Tern") {
            //    return "assets/img/GreatCrestedTern.jpg"
            //}
            //else if (name == "Sooty Falcon") {
            //    return "assets/img/SootyFalcon.jpg"
            //}
            //else if (name == "Marsh Harrier") {
            //    return "assets/img/MarshHarrier.jpg"
            //}
            //else if (name == "Red Billed Tropicbird" || name == "Red-billed Tropicbird") {
            //    return "assets/img/Redbilledtropicbird.jpg"
            //}
            //else if (name == "Steppe Eagle") {
            //    return "assets/img/SteppeEagle.jpg"
            //}
            //else if (name == "Crab Plover" || name == "Crab-plover") {
            //    return "assets/img/CrabPlover.jpg"
            //}
            //else if (name == "Arabian Partridge") {
            //    return "assets/img/ArabianPartridge.jpg"
            //}
            //else if (name == "Sparrowhawk") {
            //    return "assets/img/LevantSparrowhawk.jpg"
            //}
            //else if (name == "SootyGull" || name =="Sooty Gull") {
            //    return "assets/img/SootyGull.jpg"
            //}
            //else if (name == "Golden Eagle") {
            //    return "assets/img/GoldenEagle.jpg"
            //}
            //else if (name == "Bonellis Eagle") {
            //    return "assets/img/BenolisEagle.png"
            //}
            
            //else {
            //    return "";
            //}
        },

        GetDatesInformation: function (result) {
            var currentWidget = this;
            var fromdate = result[0][currentWidget.queryinfo.datefield].split("T")[0];
            var todate = result[result.length - 1][currentWidget.queryinfo.datefield].split("T")[0];
            return "<div classd='form-group'><input class='form-control gmap_inputs m-1' id='" + result[0].PID + "_fromdate' type='date' value ='" + fromdate + "' /></div><div class='form-group'> <input class='form-control gmap_inputs m-1' id='" + result[0].PID + "_todate' type='date' value ='" + todate + "'  /></div> ";
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

     

        PopulateBirdNamesForPublic: function (report, startDate, EndDate) {
            var currentWidget = this;
            $(".Animationdiv").css("display", "block");
            $(".AnimationSideDiv").css("display", "none");
            $(".SlideToggle").css("display", "none");
            $(".bottompanelIWForPublic").css("display", "block");
            $(currentWidget.divDateTimeSlider).css("display", "none");
            currentWidget.GoogleAnimate();

            var result = report.Table1;
            if (result.length == 0) {
                AlertMessages("Info", '', GMapAnimateWidget._i18n.NoResultFound);
                return;
            }

            var bounds = new google.maps.LatLngBounds();
            var routePoints = [];

            var points = [], dates = [], gap = [], speed = [], altitude = [], positionvalues = [];
            for (var i = 0; i < result.length; i++) {

                GMapAnimateWidget.markerBirdId = result[i].PID;

                if (!GMapAnimateWidget.CheckFloatValue(result[i].LAT.replace(/\s/g, '')) || !GMapAnimateWidget.CheckFloatValue(result[i].LONG.replace(/\s/g, ''))) {
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
                            var myLatLng = new google.maps.LatLng(latval, longval);
                            bounds.extend(myLatLng);
                        }
                    }
                }
            }
            if (positionvalues.length <= 1 && result.length > 4) {
                var cnt = 0;
                for (var j = 0; j <= result.length; j++) {

                    if (cnt >= result.length) {
                        break;
                    }
                    var latval = parseFloat(result[cnt].LAT.replace(/\s/g, ''));
                    var longval = parseFloat(result[cnt].LONG.replace(/\s/g, ''));

                    var pos = new google.maps.LatLng(latval, longval);
                    points.push(pos);
                    routePoints.push(pos);
                    positionvalues.push({ LAT: latval, LONG: longval, date: GetFormatedDate(result[cnt].DATE.split("T")[0]) + "   " + result[cnt].DATE.split("T")[1], speed: result[cnt].SPEED, altitude: result[cnt].ALTITUDE, Pid: result[cnt].PID, Migration: result[cnt].Migration });
                    dates.push(result[cnt].DATE);
                    var myLatLng = new google.maps.LatLng(latval, longval);
                    bounds.extend(myLatLng);
                    cnt = cnt + 3;

                }
            }

            var coords = positionvalues;

            var milliseconds = new Date().getTime();

            GMapAnimateWidget.markerForPublic = new google.maps.Marker({
                icon: {
                    url: GMapAnimateWidget.animateIcon,
                },
                position: new google.maps.LatLng(positionvalues[0].LAT, positionvalues[0].LONG),
                map: gmap,
                store_id: GMapAnimateWidget.markerBirdId + "-" + milliseconds,
            });

            GMapAnimateWidget.previousMarkersIDs.push(GMapAnimateWidget.markerBirdId + "-" + milliseconds);

            //to set google map extent to the received lat and long
            gmap.fitBounds(bounds);

            // this is for temporary marker( we hide this marker) to show fixed infowindow with changed content
            var TempSymbolAnimate = new google.maps.Marker({
                position: new google.maps.LatLng(positionvalues[0].LAT, positionvalues[0].LONG),
                map: gmap,
                icon: {
                    path: 'M-10,0a10,10 0 1,0 20,0a10,10 0 1,0 -20,0 z',
                    fillColor: '#cccccc',
                    fillOpacity: 1,
                    scale: 0.4,
                    strokeColor: 'blue',
                    rotation: 0
                }
            });

            //this is for line createtion of bird tracking
            var Animatepolyline = new google.maps.Polyline({
                map: gmap,
                icons: [{
                    fixedRotation: true,
                    icon: GMapAnimateWidget.markerForPublic,
                    offset: '100%'
                }],
                path: [routePoints[0], routePoints[0]],
                strokeColor: '#0096FF',
                strokeWeight: 3
            });

            var count = 0;
            var target = 1;
            var delay = 1;
            var latlongarr = [];

            var numStep = 80;
            var contentstring = currentWidget.getContentStringForPublic(coords, target);

           

            var infowindow = new google.maps.InfoWindow({
                pixelOffset: new google.maps.Size(0, 250),
                content: contentstring
            });

            function goToPoint() {
                var lat = GMapAnimateWidget.markerForPublic.position.lat();
                var lng = GMapAnimateWidget.markerForPublic.position.lng();
                if (coords.length == 0)
                    return;
                var dest = new google.maps.LatLng(
                    coords[target].LAT, coords[target].LONG);

                numStep = 80;

                var i = 0;

                var deltaLat = (coords[target].LAT - lat) / numStep;
                var deltaLng = (coords[target].LONG - lng) / numStep;

                latlongarr.push(new google.maps.LatLng(lat, lng));

                
                var contentstring = currentWidget.getContentStringForPublic(coords, target);
                infowindow.setContent(contentstring);

                infowindow.addListener('position_changed', () => {
                    var infowindowContent = infowindow.getContent();
                    $("#infowin").html(infowindowContent);
                    infowindow.close();
                });

                function moveMarker() {

                    lat += deltaLat;
                    lng += deltaLng;

                    count = count + 1;

                    if (i != numStep) {
                        i++;

                        GMapAnimateWidget.markerForPublic.setPosition(new google.maps.LatLng(lat, lng));
                        //to move the map along with the bird tracking
                        gmap.panTo(new google.maps.LatLng(lat, lng));
                        var pos = new google.maps.LatLng(lat, lng);
                        if (i > 1) {
                            Animatepolyline.setPath(latlongarr);
                        }

                        latlongarr.push(pos);

                        if (infowindow != null || typeof (infowindow) != 'undefined') {
                            infowindow.close();
                        }
                        infowindow.open({ anchor: TempSymbolAnimate, gmap, shouldFocus: false, });
                        setTimeout(moveMarker, delay);
                    }
                    else {
                        GMapAnimateWidget.markerForPublic.setPosition(dest);

                        target++;
                        if (target == coords.length) {
                            target = 0;
                            coords = [];  // to stop the bird movement loop 
                        }
                        else {
                            GMapAnimateWidget.markerForPublic.setMap(gmap);
                            if (infowindow != null || typeof (infowindow) != 'undefined') {
                                infowindow.close();
                            }
                        }
                        setTimeout(goToPoint, delay);
                    }
                }
                moveMarker();
            }
            goToPoint();

        },

        PopulateBirdNames: function (report, msg) {
            var currentWidget = this;
            var result = report.Table1;
            if (result.length == 0) {
                AlertMessages("Info", '', GMapAnimateWidget._i18n.NoResultFound);
                return;
            }
            
            
            var routePoints = [];
            var width = 5;
            var bounds = new google.maps.LatLngBounds();

            var points = [], dates = [], gap = [], speed = [], altitude = [], positionvalues = [];
            GMapAnimateWidget.plines = [];
            var flightPlanCoordinates = [];
            for (var i = 0; i < result.length; i++) {

                GMapAnimateWidget.markerBirdId = result[i].PID;

                if (!GMapAnimateWidget.CheckFloatValue(result[i].LAT.replace(/\s/g, '')) || !GMapAnimateWidget.CheckFloatValue(result[i].LONG.replace(/\s/g, ''))) {
                    continue;
                }

                var latval = parseFloat(result[i].LAT.replace(/\s/g, ''));
                var longval = parseFloat(result[i].LONG.replace(/\s/g, ''));

                if (latval == 0 && longval == 0) {
                    continue;
                }
                flightPlanCoordinates.push([parseFloat(result[i].LAT), parseFloat(result[i].LONG)]);

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
                            var myLatLng = new google.maps.LatLng(latval, longval);
                            bounds.extend(myLatLng);
                        }
                    }
                }
            }
            if (positionvalues.length <= 1 && result.length > 4) {
                var cnt = 0;
                for (var j = 0; j <= result.length; j++) {

                    if (cnt >= result.length) {
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
                    var myLatLng = new google.maps.LatLng(latval, longval);
                    bounds.extend(myLatLng);
                    cnt = cnt + 3;

                }
                
            }

            hullPoints = [];

            var speed = 1000;
            var coords = positionvalues;

            var milliseconds = new Date().getTime();

            GMapAnimateWidget.lineSymbolAnimate = new google.maps.Marker({
                icon: {
                    url: GMapAnimateWidget.animateIcon,
                },
                position: new google.maps.LatLng(positionvalues[0].LAT, positionvalues[0].LONG),
                map: gmap,
                store_id: GMapAnimateWidget.markerBirdId + "-" + milliseconds,
            });

            GMapAnimateWidget.previousMarkersIDs.push(GMapAnimateWidget.markerBirdId + "-" + milliseconds);

            GMapAnimateWidget.AnimateMarkers.push(GMapAnimateWidget.lineSymbolAnimate);

            //to set google map extent to the received lat and long
            gmap.fitBounds(bounds);

            if ($(window).width() <= 480) {
                var newpoly = new google.maps.Polyline({
                    map: gmap,
                    icons: [{
                        fixedRotation: true,
                        icon: GMapAnimateWidget.lineSymbolAnimate,
                        offset: '100%'
                    }],
                    path: routePoints,
                    strokeWeight: 3,
                    strokeColor: "#4287f5",
                    strokeOpacity: 0.5
                });
            }
            else {
                var newpoly = new google.maps.Polyline({
                    map: gmap,
                    icons: [{
                        fixedRotation: true,
                        icon: GMapAnimateWidget.lineSymbolAnimate,
                        offset: '100%'
                    }],
                    path: routePoints,
                    strokeWeight: 5,
                    strokeColor: "#4287f5",
                    strokeOpacity: 0.5
                });
            }


            GMapAnimateWidget.plines.push(newpoly);

            GMapAnimateWidget.MultiPolyline.push(GMapAnimateWidget.plines);

            $("#" + result[0].PID).html(GMapAnimateWidget._i18n.DataAvaiableBetween + "<div style='color:black; font-size:12px; font-weight:600'> <br/>" + GMapAnimateWidget.GetDatesInformation(result) + "</ div> ");
            //$(GMapAnimateWidget.gmap_message).html(GMapAnimateWidget._i18n.Distancetravelled + " " + Math.round(newpoly.inKm()));
            $("#gmap_message_" + result[0].PID).html(GMapAnimateWidget._i18n.Distancetravelled + " " + Math.round(newpoly.inKm()));
            

            var heatMapData = [];
            //var heatmap;
            for (var f = 0; f < points.length; f++) {
                heatMapData.push({ location: points[f], weight: 10 });
            }

            if (GMapAnimateWidget.heatmap != null) {
                GMapAnimateWidget.heatmap.setMap(null);
                GMapAnimateWidget.heatmap = null;
            }
            GMapAnimateWidget.heatmap = new google.maps.visualization.HeatmapLayer({
                data: heatMapData,
                map: gmap
            });

            GMapAnimateWidget.heatmap.set('radius', 20);
            GMapAnimateWidget.heatmap.set('opacity', 0.8);


            GMapAnimateWidget.animationStatus = true;
            GMapAnimateWidget.animateMarker(GMapAnimateWidget.lineSymbolAnimate, coords);
            
        },

        getContentStringForPublic: function (coords, target) {

            var pgDir = document.getElementsByTagName('html');

            return contentstring = "<div id='content' style='padding:5px' dir='" + pgDir[0].dir + "'><div><span style='font-weight:bold'>" + GMapAnimateWidget._i18n.PID + ": </span>" + coords[target].Pid + "</div><div><span style='font-weight:bold'>" + GMapAnimateWidget._i18n.Date + ": </span>" + coords[target].date.split(" ")[0] + "</div><div><span style='font-weight:bold'>" + GMapAnimateWidget._i18n.Lat + ": </span>" + coords[target].LAT + "</div><div><span style='font-weight:bold'>" + GMapAnimateWidget._i18n.Long + ": </span>" + coords[target].LONG + "</div></div>"
        },
        getContentString: function (coords, target) {

            var pgDir = document.getElementsByTagName('html');

            return contentstring = "<div id='content' style='padding:5px' dir='" + pgDir[0].dir + "'><br><div><span style='font-weight:bold'>" + GMapAnimateWidget._i18n.PID + ": </span>" + coords[target].Pid + "</div><div><span style='font-weight:bold'>" + GMapAnimateWidget._i18n.Date + ": </span>" + coords[target].date.split(" ")[0] + "</div><div><span style='font-weight:bold'>" + GMapAnimateWidget._i18n.Speed + ": </span>" + coords[target].speed + "</div><div><span style='font-weight:bold'>" + GMapAnimateWidget._i18n.Altitude + ": </span>" + coords[target].altitude + "</div></div>"
        },

        animateMarker: function (marker, coords) {
            var currentWidget = this;
            var count = 0;
            var target = 1;
            var delay = 1;

            var flightPlanCoordinates = [];
            for (var i = 0; i < coords.length; i++) {
                flightPlanCoordinates.push({ lat: parseFloat(coords[i].LAT), lng: parseFloat(coords[i].LONG) });
            }

            var StartFlag = "Images/gflag.png";
            var EndFlag = "Images/Rflag.png";
            var StartPoint = new google.maps.Marker({
                position: flightPlanCoordinates[0],
                map: gmap,
                title: 'Start Point',
                icon: StartFlag
            });
            var EndPoint = new google.maps.Marker({
                position: flightPlanCoordinates[flightPlanCoordinates.length - 1],
                map: gmap,
                title: 'End Point',
                icon: EndFlag
            });

            GMapAnimateWidget.TotalStartflags.push(StartPoint);
            GMapAnimateWidget.TotalEndflags.push(EndPoint);

            var route = new google.maps.Polyline({
                /*path: [],*/
                geodesic: true,
                /*strokeColor: "#006c4e",*/
                strokeColor: "#00008B",
                strokeOpacity: 0.1,
                strokeWeight: 2,
                editable: false,
                map: gmap
            });
            GMapAnimateWidget.Multiroute.push(route);

            var ishide = false;
            var ischeckedornot = false;

            var numStep = $(currentWidget.speedval).val();
            var contentstring = "";
            var infowindow = new google.maps.InfoWindow({
                content: contentstring,
            });
            infowindow.template = '<div class="iw-container"><div style = "width:100%;" > </div > '
                + '<div style="width:100%;">name and info</div></div>';
            infowindow.open({ anchor: marker, gmap, shouldFocus: false, });


            document.getElementById("hide-poi").addEventListener("click", () => {

                if ($("#hide-poi").is(":checked") == false) {
                    infowindow.close();
                    /*$("#Infoid").text("Show InfoWindow");*/
                    $("#Infoid").text(currentWidget._i18n.ShowInfoWindow);
                }
                else {
                    infowindow.open({ anchor: marker, gmap, shouldFocus: false, });
                    //$("#Infoid").text("Hide InfoWindow");
                    $("#Infoid").text(currentWidget._i18n.HideInfoWindow);
                }
            });
            marker.addListener('click', function () {
                infowindow.open({ anchor: marker, gmap, shouldFocus: false, });
            });
            function goToPoint() {
                var lat = marker.position.lat();
                var lng = marker.position.lng();


                var dest = new google.maps.LatLng(
                    coords[target].LAT, coords[target].LONG);

                numStep = $(currentWidget.speedval).val();

                var i = 0;
                var deltaLat = (coords[target].LAT - lat) / numStep;
                var deltaLng = (coords[target].LONG - lng) / numStep;


                const styleControl = document.getElementById("style-selector-control");

                var contentstring = currentWidget.getContentString(coords, target);
                //var contentstring = "<div id='content'><div><b>PID: </b>" + coords[target].Pid + "</div><div><b>Date: </b>" + coords[target].date + "</div><div><b>Speed: </b>" + coords[target].speed + "</div><div><b>Altitude: </b>" + coords[target].altitude + "</div></div>"

                infowindow.setContent(contentstring);





                if (GMapAnimateWidget.chkSeasonWise == true) {
                    
                    if (coords[target].Migration == 1 || coords[target].Migration == 4) {
                        marker.setIcon('Images/birdiconBlue.png');
                    }
                    else if (coords[target].Migration == 2) {
                        marker.setIcon('Images/birdiconGreen.png');
                    }
                    else if (coords[target].Migration == 3) {
                        marker.setIcon('Images/birdiconPink.png');
                    }
                }

                function moveMarker() {

                    if (GMapAnimateWidget.animationStatus == true) {

                        lat += deltaLat;
                        lng += deltaLng;

                        //Raj
                        count = count + 1;

                        if (count != -1 && GMapAnimateWidget.animationStatus == true) {

                            if (i != numStep) {

                                i++;
                                marker.setPosition(new google.maps.LatLng(lat, lng));
                                route.getPath().push(new google.maps.LatLng(lat, lng));

                                setTimeout(moveMarker, delay);
                            }
                            else {
                                marker.setPosition(dest);
                                route.getPath().push(dest);


                                target++;
                                if (target == coords.length) {
                                    marker.setMap(null);
                                    route.setMap(null);
                                    target = 0;
                                }
                                else {
                                    marker.setMap(gmap);
                                    route.setMap(gmap);
                                }
                                setTimeout(goToPoint, delay);
                            }
                        }
                    }
                    else {
                        topic.subscribe('mapClickMode/StartAnimation', lang.hitch(this, function () {

                            route.setPath(null);
                            if (marker != null) {
                                if (GMapAnimateWidget.previousMarkersIDs.length > 0) {
                                    var markerId = marker.get('store_id');
                                    if (GMapAnimateWidget.previousMarkersIDs.indexOf(markerId) == -1) {
                                        marker.setMap(null);
                                        route.setMap(null);
                                        marker = null;
                                    }
                                    else {
                                        setTimeout(moveMarker, delay);
                                    }
                                }
                            }
                        }));
                    }
                }
                moveMarker();
            }
            goToPoint();
        },



        calculateDistance: function (lat1, lat2, long1, long2) {

            var d = Math.sqrt((long1 - long2) * (long1 - long2) + (lat1 - lat2) * (lat1 - lat2));
            return d;

        },

        sortPointX: function (a, b) { return a.lng() - b.lng(); },

        sortPointY: function (a, b) { return a.lat() - b.lat(); },

        geocodeLatLng: function (geocoder, lat, lng, curdate) {

            var latlng = { lat: lat, lng: lng };
            geocoder.geocode({ 'location': latlng }, function (results, status) {
                if (status === 'OK') {
                    if (results[1]) {
                        $("#gmapBirdPosition").text(GetFormatedDate(curdate.split("T")[0]) + ": " + results[1].formatted_address);
                        $("#gmapBirdPosition").hide().fadeIn('fast');
                        $("#gmapBirdPosition").show().fadeIn('fast');

                    }
                    else {

                    }
                } else {

                }
            });
        },

        Empty: function () {

        },
        ParseResult: function (func, result) {

            if (func == "checkuser") {
                return jQuery.parseJSON(result.CheckUserResult);
            }
            else if (func == "jsonBirdsInfo") {
                return jQuery.parseJSON(result.JsonBirdsInfoResult);
            }
            else if (func == "jsonArgos") {
                return jQuery.parseJSON(result.JSONArgosDataResult);
            }
            else if (func == "jsonPtts") {
                return jQuery.parseJSON(result.JSONPttsResult);
            }
            else if (func == "jsonPttsYear") {
                return jQuery.parseJSON(result.JSONPttsYearResult);
            }
            else if (func == "jsonPlotformIDs") {
                return jQuery.parseJSON(result.JSONPlatFormIdsResult);
            }
            else if (func == "jsonCommonNames") {
                return jQuery.parseJSON(result.JSONCommonNamesResult);
            }
            else if (func == "jsonNamesbasePtts") {
                return jQuery.parseJSON(result.JsonNamesbasePttsResult);
            }
            else if (func == "jsonNamesbasePttsYear") {
                return jQuery.parseJSON(result.JsonNamesbasePttsYearResult);
            }
            else if (func == "jsonDatagmapondate") {
                return jQuery.parseJSON(result.JsonDatagmapondateResult);
            }
            else if (func == "JsonDatagmapondateWithInterval") {
                return jQuery.parseJSON(result.JsonDatagmapondateWithIntervalResult);
            }

            else if (func == "jsonYearsOnCommonName") {
                return jQuery.parseJSON(result.JsonYearsOnCommonNameResult);
            }
            else if (func == "jsonSensors") {
                return jQuery.parseJSON(result.JsonSensorsResult);
            }
            else if (func == "jsonGSMData") {
                return jQuery.parseJSON(result.JSONGSMDataResult);
            }
            else if (func == "jsonGPSData") {
                return jQuery.parseJSON(result.JSONGPSDataResult);
            }
            else if (func == "jsonStopOver") {
                return jQuery.parseJSON(result.JSONStopOverResult);
            }
            else if (func == "jsonBirdInfo") {
                return jQuery.parseJSON(result.JSONBirdInfoResult);
            }
            else if (func == "jsonBirdInfoForForm") {
                return jQuery.parseJSON(result.JSONBirdInfoForFormResult);
            }
            else if (func == "jsonBirdIds") {
                return jQuery.parseJSON(result.JSONBirdIDsResult);
            }
            else if (func == "jsonBirdAge") {
                return jQuery.parseJSON(result.JSONBirdAgeResult);
            }
            else if (func == "jsonBirdSex") {
                return jQuery.parseJSON(result.JSONBirdSexResult);
            }
            else if (func == "jsonBirdSpecies") {
                return jQuery.parseJSON(result.JSONBirdSpeciesResult);
            }
            else if (func == "jsonBirdSite") {
                return jQuery.parseJSON(result.JSONBirdSiteResult);
            }
            else if (func == "jsonUpdateBirdInfo") {
                return jQuery.parseJSON(result.JsonUpdateBirdInfoResult);
            }
            else if (func == "JSONStopOverMinMaxDate") {
                return jQuery.parseJSON(result.JSONStopOverMinMaxDateResult);
            }
            else if (func == "jsonReports") {
                return jQuery.parseJSON(result.JsonReportsResult);
            }
            else if (func == "jsonDeletePoint") {
                return jQuery.parseJSON(result.JsonDeletePointResult);
            }
            else {
                return null;
            }
        },
        moveMarker: function (googlemap, marker, lat, lon) {
            marker.setPosition(new google.maps.LatLng(lat, lon));
        },
        InfoTemplateContentString: function (coords) {

            var pgDir = document.getElementsByTagName('html');

            return contentstring = "<div id='content' style='padding:5px' dir='" + pgDir[0].dir + "'><div><span style='font-weight:bold'>" + GMapAnimateWidget._i18n.PID + ": </span>" + coords.Pid + "</div><div><span style='font-weight:bold'>" + GMapAnimateWidget._i18n.Date + ": </span>" + coords.date + "</div><div><span style='font-weight:bold'>" + GMapAnimateWidget._i18n.Speed + ": </span>" + coords.speed + "</div><div><span style='font-weight:bold'>" + GMapAnimateWidget._i18n.Altitude + ": </span>" + coords.altitude + "</div></div>"
        },
    });
});