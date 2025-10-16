define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'esri/toolbars/draw',
    'esri/tasks/geometry',
    'esri/tasks/query',
    'esri/geometry/Point',
    'esri/graphic',
    'dojo/topic',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleFillSymbol',
    "dojo/_base/Color",
    "esri/layers/GraphicsLayer",
    "esri/renderers/DotDensityRenderer",

    "dojo/text!emap/BirdTrackingPPTID/template/BirdTrackingPPTID.html",

    "dojo/i18n!emap/BirdTrackingPPTID/nls/resource",

], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, Draw, geometryService, Query, Point,
    Graphic, topic, SimpleLineSymbol, SimpleFillSymbol, Color, GraphicsLayer, DotDensityRenderer, dijitTemplate,
    i18n) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: dijitTemplate,
        widgetsInTemplate: true,
        i18n: i18n,
        map: null,
        title: i18n.title,
        domNode: null,
        toolbar: null,
        defaultSymbol: null,
        pointFeatures: null,
        geometryService: null,
        queryinfo: null,
        currentuser: null,
        configOptions: null,
        tempsymbol: null,
        ServiceUrl: null,
        queryResultsWidget: null,
        StopOverResults: null,
        jsonObj: null,
        animateResults: null,
        checkConditions: false,
        globalCurrentWidget: null,
        DataCount: 0,
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
            var currentwidget = this;
            globalCurrentWidget = this;

            topic.subscribe('mapClickMode/ClearWidgets1', lang.hitch(this, function () {
                currentwidget.DataCount = 0;
            }));
            this.inherited(arguments);
            $(".dateclass").datepicker();
            this.queryinfo = {
                type: $(this.ddlsensor).val(),
                settype: function (sensortype) {
                    if (sensortype == "Argos") {
                        this.type = "Argos";
                        this.funcname = "jsonArgos";
                    }
                    else if (sensortype == "GPS") {
                        this.type = "GPS";
                        this.funcname = "jsonGPSData";
                    }
                    else if (sensortype == "GSM") {
                        this.type = "GSM";
                        this.funcname = "jsonGSMData";
                    }
                },
                datefield: "DATE",
                latfield: "LAT",
                longfield: "LONG",
                platformid: $(this.ddlplatformid).val(),
                locclass: $(this.divlocationclasses).val(),
                platformidList: "",
                year: "",
                fromdate: $(this.fromdate).val(),
                todate: $(this.todate).val(),
                timeinterval: $(this.timeinterval).val(),
                seasonWise: $(this.chkSeasonWise).is(":checked"),
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
            $(currentwidget.btnstopover).click(function () {
                $(".StopOverdiv").css("display", "block");
                $(".LeftPanel .card-header a").css("display", "none");
                currentwidget.StopOverResults.queryinfo = currentwidget.queryinfo;
                $(".StopOverdiv").animate({
                    right: "0px"
                }, 200);
                $("#SlidePanel .card-body").css("overflow-y", "hidden");
                $("#LayersPanel .card-body").css("overflow-y", "scroll");
            });

            $(".closeStop").click(function () {
                $(".StopOverdiv").css("display", "none");
                $(".LeftPanel .card-header a").css("display", "block");
                $(".StopOverdiv").animate({
                    right: "-300px"
                }, 200);
                $(".card-body").css("overflow-y", "scroll");
            });

            $(currentwidget.animate).click(function () {
                $(".Overlay").fadeIn();
                currentwidget.queryinfo.type = $(currentwidget.ddlsensor).val();
                currentwidget.queryinfo.platformid = $(currentwidget.ddlplatformid).val();
                currentwidget.queryinfo.platformidList = "";
                currentwidget.queryinfo.fromdate = $(currentwidget.fromdate).val();
                currentwidget.queryinfo.todate = $(currentwidget.todate).val();
                currentwidget.queryinfo.locclass = $(currentwidget.divlocationclasses).val();
                currentwidget.queryinfo.settype = $(currentwidget.ddlsensor).val();
                currentwidget.queryinfo.seasonWise = $(currentwidget.chkSeasonWise).is(":checked");
                $(currentwidget.lblSensortype).css("display", "none");
                $(currentwidget.lblplatformid).css("display", "none");
                $(currentwidget.lblfromdate).css("display", "none");
                $(currentwidget.lbltodate).css("display", "none");
                $(currentwidget.lblgreater).css("display", "none");

                var formIsValid = true;
                if (currentwidget.queryinfo.type == "") {
                    $(currentwidget.lblSensortype).css("display", "block");
                    formIsValid = false;
                }
                if (currentwidget.queryinfo.platformid == "") {
                    $(currentwidget.lblplatformid).css("display", "block");
                    formIsValid = false;
                }
                if (currentwidget.queryinfo.fromdate == "") {
                    $(currentwidget.lblfromdate).css("display", "block");
                    formIsValid = false;
                }
                if (currentwidget.queryinfo.todate == "") {
                    $(currentwidget.lbltodate).css("display", "block");
                    formIsValid = false;
                }
                var isvalid = CheckDatesCompare(currentwidget.queryinfo.fromdate, currentwidget.queryinfo.todate);
                if (isvalid == false) {
                    $(currentwidget.lblgreater).css("display", "block");
                    formIsValid = false;
                }
                if (formIsValid == false) {
                    $(".Overlay").fadeOut();
                    return;
                }
                currentwidget.animateResults.queryinfo = currentwidget.queryinfo;
                if (currentwidget.checkConditions == true) {
                    currentwidget.animateResults.AddDataTogmapWithID();
                }
                else {
                    currentwidget.queryinfo.type = $(currentwidget.ddlsensor).val();
                    currentwidget.queryinfo.platformid = $(currentwidget.ddlplatformid).val();
                    currentwidget.queryinfo.platformidList = "";
                    currentwidget.queryinfo.fromdate = $(currentwidget.fromdate).val();
                    currentwidget.queryinfo.todate = $(currentwidget.todate).val();
                    currentwidget.queryinfo.timeinterval = $(currentwidget.timeinterval).val();
                    currentwidget.queryinfo.locclass = $(currentwidget.divlocationclasses).val();
                    currentwidget.queryinfo.settype = $(currentwidget.ddlsensor).val();
                    currentwidget.queryinfo.seasonWise = $(currentwidget.chkSeasonWise).is(":checked");
                    var timeinterval = (currentwidget.queryinfo.timeinterval.trim() == "") ? "null" : currentwidget.queryinfo.timeinterval.trim();
                    var data = "";
                    if (currentwidget.queryinfo.type == "Argos") {
                        data = currentwidget.queryinfo.platformid;
                        data += (currentwidget.queryinfo.locclass.trim() == "") ? "/null" : "/" + currentwidget.queryinfo.locclass.trim();
                        data += "/" + currentwidget.queryinfo.fromdate + "/" + currentwidget.queryinfo.todate + "/" + timeinterval;
                        data += currentwidget.adduserdetails();
                    }
                    else if (currentwidget.queryinfo.type == "GPS" || currentwidget.queryinfo.type == "GSM") {
                        data = currentwidget.queryinfo.platformid;
                        data += "/" + currentwidget.queryinfo.fromdate + "/" + currentwidget.queryinfo.todate + "/" + timeinterval;
                        data += currentwidget.adduserdetails();
                    }
                    currentwidget.queryinfo.data = data;

                    currentwidget.animateResults.AddDataTogmapWithID();

                }
                $(".ManageContainer").show().animate({
                    bottom: '-100%'
                }, 200);

                $("#divanimateWidget").show().animate({
                    bottom: '0px'
                }, 500);
                $("#divAnimation").show().animate({
                    bottom: '0px'
                }, 500);

            });


        },


        startup: function () {
            var currentWidget = this;
            $(currentWidget.locationclasses).hide();
            $(currentWidget.location).hide();
            currentWidget.getsensortype();
        },

        ClearControls: function () {
            var currentWidget = this;
            $(currentWidget.ddlsensor).val("");
            $(currentWidget.ddlplatformid).val("");
            $(currentWidget.ddlsensor)[0].sumo.reload();
            $(currentWidget.ddlplatformid).html("");
            $(currentWidget.ddlplatformid)[0].sumo.reload();
            $(currentWidget.divlocationclasses).val("");
            $(currentWidget.fromdate).val("");
            $(currentWidget.todate).val("");
            $(currentWidget.timeinterval).val("");
            $(".stopoverbtn").css("display", "none");
            $(currentWidget.lblSensortype).css("display", "none");
            $(currentWidget.lblplatformid).css("display", "none");
            $(currentWidget.lblfromdate).css("display", "none");
            $(currentWidget.lbltodate).css("display", "none");
            $(currentWidget.lblgreater).css("display", "none");
            $(currentWidget.chkSeasonWise).prop('checked', false);

        },
        ClearRecords: function () {
            var currentWidget = this;
            $(".stopoverbtn").css("display", "none");
            $(currentWidget.lblplatformid).css("display", "none");
        },
        ClearLabelfromdate: function () {
            var currentWidget = this;
            $(currentWidget.lblfromdate).css("display", "none");
        },
        ClearLabeltodate: function () {
            var currentWidget = this;
            $(currentWidget.lbltodate).css("display", "none");
            $(currentWidget.lblgreater).css("display", "none");
        },

        getsensortype: function () {
            var currentWidget = this;
            $(currentWidget.ddlsensor).empty();
            $(currentWidget.ddlsensor).append('<option value=""></option>');
            $(currentWidget.ddlsensor).append('<option value="Argos">Argos</option>');
            $(currentWidget.ddlsensor).append('<option value="GPS">GPS</option>');
            $(currentWidget.ddlsensor).append('<option value="GSM">GSM</option>');
            $(currentWidget.ddlsensor).SumoSelect({ placeholder: currentWidget._i18n.placeholderSensorType });
            $(currentWidget.ddlplatformid).SumoSelect({ search: true, searchText: 'Enter here.', placeholder: currentWidget._i18n.placeholderPTTID, captionFormat: ' {0} ' + currentWidget._i18n.SelectedItems, });
        },
        getStartEndDates: function () {
            var currentWidget = this;
            currentWidget.getLocClassesList();
            $(currentWidget.lblfromdate).css("display", "none");
            $(currentWidget.lbltodate).css("display", "none");
            $(".stopoverbtn").css("display", "none");
            $(currentWidget.lblplatformid).css("display", "none");
            var sensorType = $(currentWidget.ddlsensor).val();
            var platformid = $(currentWidget.ddlplatformid).val();
            var requestData = {
                id: platformid,
                type: sensorType
            };
            $.ajax({
                url: currentWidget.ServiceUrl + "JSONStartDateEndDate/",
                type: 'POST',  // http method
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {
                    var jsonObj = JSON.parse(result);
                    if (jsonObj != null) {
                        if (jsonObj[0].StartDate != null || jsonObj[0].EndDate != null) {
                            var start = jsonObj[0].StartDate.split('T');
                            var end = jsonObj[0].EndDate.split('T');
                            var startdate = start[0].split("-").reverse().join("-");
                            var enddate = end[0].split("-").reverse().join("-");
                            $(currentWidget.fromdate).val(startdate);
                            $(currentWidget.todate).val(enddate);
                        }
                        else {
                            $(currentWidget.fromdate).val('');
                            $(currentWidget.todate).val('');
                        }

                    }
                },
                error: function (xhr, error) {
                    AlertMessages("error", '', currentWidget._i18n.Unabletofetchplatformids);
                    console.debug(xhr); console.debug(error);
                },
            });

        },

        getLocClassesList: function () {
            var currentWidget = this;
            var sensorType = $(currentWidget.ddlsensor).val();

            if (sensorType == "" || sensorType == "GPS" || sensorType == "GSM") {
                return;
            }
            else {
                var pttid = $(currentWidget.ddlplatformid).val();
            }

            $(currentWidget.divlocationclasses).SumoSelect({ search: true, selectAll: true, okCancelInMulti: true, forceCustomRendering: true, locale: [currentWidget._i18n.OK, currentWidget._i18n.Cancel, currentWidget._i18n.SelectAll] });
            $(currentWidget.divlocationclasses).empty();
            $(currentWidget.divlocationclasses).html("");
            $(currentWidget.divlocationclasses).val("");
            var requestData = {
                id: pttid
            };
            $.ajax({
                url: currentWidget.ServiceUrl + "jsonGetLocClassListOfPTTID/",
                type: 'POST',  // http method
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {
                    //$(currentWidget.divlocationclasses).html("");
                    //$(currentWidget.divlocationclasses)[0].sumo.reload();
                    var jsonObj = JSON.parse(result);
                    if (jsonObj != null) {
                        for (i = 0; i < jsonObj.length; i++) {
                            $(currentWidget.divlocationclasses).append("<option>" + jsonObj[i].LOC_CLASS.trim() + "</option>");
                        }
                    }
                    $(currentWidget.divlocationclasses)[0].sumo.reload();
                },
                error: function (xhr, error) {
                    var currentWidget = this;
                    AlertMessages('error', '', currentWidget._i18n.UnabletofetchLocClasses);
                },
            });

        },
        getplatformid: function () {
            var currentWidget = this;
            $(".stopoverbtn").css("display", "none");
            $(".Densityclass").css("display", "none");
            $(currentWidget.lblSensortype).css("display", "none");
            var sensorType = $(currentWidget.ddlsensor).val();
            if (sensorType == "") {
                return;
            }
            if (sensorType == "Argos") {
                $(currentWidget.locationclasses).css("display", "block");
                $(currentWidget.location).css("display", "block");
            }
            if (sensorType == "GPS") {
                $(currentWidget.locationclasses).hide();
                $(currentWidget.location).hide();
            }
            if (sensorType == "GSM") {
                $(currentWidget.locationclasses).hide();
                $(currentWidget.location).hide();
            }
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
                        $(currentWidget.ddlplatformid).html("");
                        $(currentWidget.ddlplatformid)[0].sumo.reload();
                        var jsonObj = JSON.parse(result);
                        if (jsonObj != null) {
                            var strAssignBirds = jsonObj.AssignedBirds;
                            var publicuser = jsonObj["AssignedBirds"].split(' ');
                            var publicsensortype = jsonObj.Sensortype;
                            var splitvalues = jsonObj.Sensortype.split(" ");
                            var sensorbasedtypes = [];
                            $(currentWidget.ddlplatformid).append('<option value=""></option>');
                            for (i = 0; i < publicuser.length; i++) {
                                var publicusersensortype = splitvalues[i].split("-");
                                if (sensorType == publicusersensortype[1]) {
                                    $(currentWidget.ddlplatformid).append('<option>' + encodeURIComponent(publicuser[i]) + '</option>')
                                }

                            }
                            $(currentWidget.ddlplatformid)[0].sumo.reload();
                        }

                    },
                    error: function (xhr, error) {
                        var currentWidget = this;
                        AlertMessages('error', '', currentWidget._i18n.Unabletofetchbirdplatformids);
                    },
                });

            }
            else {
                var requestData = {
                    type: sensorType
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "jsonPlotformIDs/",
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        $(currentWidget.ddlplatformid).html("");
                        $(currentWidget.ddlplatformid)[0].sumo.reload();
                        $(currentWidget.fromdate).val("");
                        $(currentWidget.todate).val("");
                        $(currentWidget.timeinterval).val("");
                        var jsonObj = JSON.parse(result);
                        if (jsonObj != null) {
                            $(currentWidget.ddlplatformid).append('<option value=""></option>');
                            for (i = 0; i < jsonObj.length; i++) {
                                //$(currentWidget.ddlplatformid).append('<option>' + jsonObj[i].PID + '</option>');
                                $(currentWidget.ddlplatformid).append("<option>" + encodeURIComponent(jsonObj[i].PID) + "</option>");
                            }
                        }
                        $(currentWidget.ddlplatformid)[0].sumo.reload();
                    },
                    error: function (xhr, error) {
                        var currentWidget = this;
                        AlertMessages('error', '', currentWidget._i18n.Unabletofetchbirdplatformids);
                    },
                });
            }
        },
        adduserdetails: function () {
            var retval = (configOptions.UserInfo.UserName == "") ? "/null" : "/" + configOptions.UserInfo.UserName;
            retval += (configOptions.UserInfo.Password == "") ? "/null" : "/" + configOptions.UserInfo.Password;
            return retval;
        },

        PrepareArguments: function () {
            var data = "";

            var timeinterval = (this.queryinfo.timeinterval.trim() == "") ? "null" : this.queryinfo.timeinterval.trim();
            if (this.queryinfo.type == "Argos") {
                var locClass = null;
                if (this.queryinfo.locclass.length == 1) {
                    locClass = this.queryinfo.locclass[0];
                }
                else if (this.queryinfo.locclass.length > 1) {
                    locClass = "";
                    for (var i = 0; i < this.queryinfo.locclass.length; i++) {
                        locClass += this.queryinfo.locclass[i] + ","
                    }
                }
                var data = {
                    id: this.queryinfo.platformid,
                    locCls: locClass,
                    //locCls: (this.queryinfo.locclass.length == 0) ? null : this.queryinfo.locclass,
                    fromdate: this.queryinfo.fromdate,
                    todate: this.queryinfo.todate,
                    filter: timeinterval,
                    login: (configOptions.UserInfo.UserName == "") ? null : configOptions.UserInfo.UserName,
                    password: (configOptions.UserInfo.Password == "") ? null : configOptions.UserInfo.Password
                };
            }
            else if (this.queryinfo.type == "GPS" || this.queryinfo.type == "GSM") {
                var data = {
                    id: this.queryinfo.platformid,
                    locCls: null,
                    fromdate: this.queryinfo.fromdate,
                    todate: this.queryinfo.todate,
                    filter: timeinterval,
                    login: (configOptions.UserInfo.UserName == "") ? null : configOptions.UserInfo.UserName,
                    password: (configOptions.UserInfo.Password == "") ? null : configOptions.UserInfo.Password
                };
            }
            return data;
        },
        PrepareArguments1: function () {
            var data = "";
            var timeinterval = (this.queryinfo.timeinterval.trim() == "") ? "null" : this.queryinfo.timeinterval.trim();
            if (this.queryinfo.type == "Argos") {
                var locClass = null;
                if (this.queryinfo.locclass.length == 1) {
                    locClass = this.queryinfo.locclass[0];
                }
                else if (this.queryinfo.locclass.length > 1) {
                    locClass = "";
                    for (var i = 0; i < this.queryinfo.locclass.length; i++) {
                        locClass += this.queryinfo.locclass[i] + ","
                    }
                }

                data = this.queryinfo.platformid;
                data += "/" +locClass;
                /*data += (this.queryinfo.locclass.length == 0) ? "/null" : "/" + this.queryinfo.locclass;*/
                data += "/" + this.queryinfo.fromdate + "/" + this.queryinfo.todate + "/" + timeinterval;
                data += this.adduserdetails();
            }
            else if (this.queryinfo.type == "GPS" || this.queryinfo.type == "GSM") {
                data = this.queryinfo.platformid;
                data += "/" + this.queryinfo.fromdate + "/" + this.queryinfo.todate + "/" + timeinterval;
                data += this.adduserdetails();
            }
            return data;
        },
        Drawpolygon: function () {
            var currentwidget = this;
            currentwidget.toolbar.activate(Draw.EXTENT);
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
        findPointsInExtent: function (extent) {
            var currentWidget = this;
            this.StopOverResults.getresults(this.queryinfo);
            currentWidget.toolbar.deactivate();
            var defaultSymbol = new esri.symbol.SimpleMarkerSymbol().setColor(new dojo.Color([0, 255, 0]));
            highlightSymbol = new esri.symbol.SimpleMarkerSymbol().setColor(new dojo.Color([255, 0, 0]));
            var p = this.pointFeatures;
            for (var i = 0; i < p.length; i++) {
                var latX = 0, longY = 0;
                var point = [];
                if (!currentWidget.CheckFloatValue(p[i].LAT.replace(/\s/g, '')) || !currentWidget.CheckFloatValue(p[i].LONG.replace(/\s/g, ''))) {
                    continue;
                }
                if (parseFloat(p[i].LAT) != latX && parseFloat(p[i].LONG) != longY) {
                    point.push(parseFloat(p[i].LONG.replace(/\s/g, '')));
                    point.push(parseFloat(p[i].LAT.replace(/\s/g, '')));
                }
                else
                    continue;

                var pt = new esri.geometry.Point(point, new esri.SpatialReference({ wkid: 4326 }));
                var graphic = new esri.Graphic(pt, defaultSymbol, p[i].PID);
                currentWidget.map.graphics.add(graphic);
            }
            var results1 = [];
            for (var j = 0; j < currentWidget.map.graphics.graphics.length; j++) {
                if (extent.geometry.contains(currentWidget.map.graphics.graphics[j].geometry)) {
                    currentWidget.map.graphics.graphics[j].setSymbol(highlightSymbol);
                    results1.push(currentWidget.map.graphics.graphics[j].geometry);
                }
                else if (currentWidget.map.graphics.graphics[j].symbol == highlightSymbol) {
                    currentWidget.map.graphics.graphics[j].setSymbol(defaultSymbol);
                }
                else if (currentWidget.map.graphics.graphics[j].symbol != undefined) {
                    if (currentWidget.map.graphics.graphics[j].symbol.style == 'solid') {
                        currentWidget.map.graphics.remove(currentWidget.map.graphics.graphics[j]);
                    }
                }

            }
            geometryService = new esri.tasks.GeometryService(configOptions.geometryService);

            geometryService.convexHull(results1, function (result) {
                var currentwidget = this;
                var symbol = null;

                switch (result.type) {
                    case "point":
                        symbol = new esri.symbol.SimpleMarkerSymbol();
                        break;
                    case "polyline":
                        symbol = new esri.symbol.SimpleLineSymbol();
                        break;
                    case "polygon":
                        symbol = new esri.symbol.SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([204, 0, 0]), 2), new Color([204, 0, 0, 0.40]));
                        break;
                }
                currentwidget.tempsymbol = symbol;
                currentwidget.map.graphics.add(new esri.Graphic(result, symbol));
            }, function (error) {
                console.log("An error occured during convex hull calculation");
            });

        },
        getColorCode: function () {
            var makeColorCode = '0123456789ABCDEF';
            var code = '#';
            for (var count = 0; count < 6; count++) {
                code = code + makeColorCode[Math.floor(Math.random() * 16)];
            }
            return code;
        },
        getresults: function () {
            var currentWidget = this;
            clearPointDensityLayer();
            $(currentWidget.lblSensortype).css("display", "none");
            $(currentWidget.lblplatformid).css("display", "none");
            $(currentWidget.lblfromdate).css("display", "none");
            $(currentWidget.lbltodate).css("display", "none");
            $(currentWidget.lblgreater).css("display", "none");

            $(".Densityclass").css("display", "block");

            var ua = navigator.userAgent;
            var checker = {
                iphone: ua.match(/BirdTracking_Ios/),
                blackberry: ua.match(/BlackBerry/),
                android: ua.match(/BirdTracking_Android/)
            };
            if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android") || checker.android || checker.iphone) {
                $("#ExportExcelMobileNames").css("display", "none");
                $("#ExportExcelMobile").css("display", "inline-block");
            }

            var sensor = $(currentWidget.ddlsensor).val();
            currentWidget.queryinfo.type = $(currentWidget.ddlsensor).val();
            currentWidget.queryinfo.platformid = $(currentWidget.ddlplatformid).val();
            currentWidget.queryinfo.platformidList = "";
            currentWidget.queryinfo.fromdate = $(currentWidget.fromdate).val();
            currentWidget.queryinfo.todate = $(currentWidget.todate).val();
            currentWidget.queryinfo.timeinterval = $(currentWidget.timeinterval).val();
            currentWidget.queryinfo.locclass = $(currentWidget.divlocationclasses).val();
            currentWidget.queryinfo.settype = $(currentWidget.ddlsensor).val();

            if (sensor == "Argos") {
                currentWidget.queryinfo.type = "Argos";
                currentWidget.queryinfo.funcname = "jsonArgos";
            }
            else if (sensor == "GPS") {
                currentWidget.queryinfo.type = "GPS";
                currentWidget.queryinfo.funcname = "jsonGPSData";
            }
            else if (sensor == "GSM") {
                currentWidget.queryinfo.type = "GSM";
                currentWidget.queryinfo.funcname = "jsonGSMData";
            }
            var formIsValid = true;
            if (currentWidget.queryinfo.type == "") {
                $(currentWidget.lblSensortype).css("display", "block");
                formIsValid = false;
            }
            if (currentWidget.queryinfo.platformid == "" || currentWidget.queryinfo.platformid == null) {
                $(currentWidget.lblplatformid).css("display", "block");
                formIsValid = false;
            }
            if (currentWidget.queryinfo.fromdate == "") {
                $(currentWidget.lblfromdate).css("display", "block");

                formIsValid = false;
            }
            if (currentWidget.queryinfo.todate == "") {
                $(currentWidget.lbltodate).css("display", "block");
                formIsValid = false;
            }
            var isvalid = CheckDatesCompare(currentWidget.queryinfo.fromdate, currentWidget.queryinfo.todate);
            if (isvalid == false) {
                $(currentWidget.lblgreater).css("display", "block");
                formIsValid = false;
            }
            if (formIsValid == false) {
                $(".Overlay").fadeOut();
                return;
            }
            var data = currentWidget.PrepareArguments1();
            var requestdata = currentWidget.PrepareArguments();

            var downloadfunc;
            if (currentWidget.queryinfo.type == "GSM")
                downloadfunc = "JSONGSMDataDownload";
            if (currentWidget.queryinfo.type == "GPS")
                downloadfunc = "JSONGPSDataDownload";
            if (currentWidget.queryinfo.type == "Argos")
                downloadfunc = "JSONArgosDataDownload";

            $("#ExportExcelMobile").attr("href", currentWidget.ServiceUrl + downloadfunc + "/" + data);

            $(".Overlay").fadeIn();
            $.ajax({
                url: currentWidget.ServiceUrl + currentWidget.queryinfo.funcname + "/",
                type: 'POST',  // http method
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestdata),
                success: function (result) {
                    var jsonObj = null;
                    jsonObj = JSON.parse(result);
                    //if (currentWidget.queryinfo.type == "GSM")
                    //    jsonObj = JSON.parse(result);
                    //if (currentWidget.queryinfo.type == "GPS")
                    //    jsonObj = JSON.parse(result);
                    //if (currentWidget.queryinfo.type == "Argos")
                    //    jsonObj = JSON.parse(result);
                    currentWidget.jsonObj = jsonObj;
                    if (jsonObj != null) {
                        if (jsonObj.Table1.length == 0) {
                            AlertMessages("warning", '', currentWidget._i18n.NoResultFound);
                            $(".Overlay").fadeOut();
                            return;
                        }
                        currentWidget.pointFeatures = jsonObj;
                    }
                    else {
                        $(currentWidget.lblerror).show();
                        $(".Overlay").fadeOut();
                        return;
                    }
                    var BirdTrackingData = [];
                    if (jsonObj.Table1.length > 0) {
                        currentWidget.DataCount = currentWidget.DataCount + jsonObj.Table1.length;
                        //if (jsonObj.Table1.length > 30000) {
                        //    AlertMessages("warning", '', currentWidget._i18n.NoDataFound);
                        //    if (jsonObj.Table1.length == currentWidget.DataCount) {
                        //        currentWidget.DataCount = 0;
                        //    }
                        //    $(".Overlay").fadeOut();
                        //    return;
                        //}
                        //if (currentWidget.DataCount > 30000) {
                        //    currentWidget.DataCount = currentWidget.DataCount - jsonObj.Table1.length;
                        //    AlertMessages("warning", '', currentWidget._i18n.ClearData);
                        //    $(".Overlay").fadeOut();
                        //    return;
                        //}
                        if ($(currentWidget.chkSeasonWise).is(":checked") == true) {
                            if (jsonObj.Table2.length > 0) {
                                for (var k = 0; k < jsonObj.Table2.length; k++) {
                                    var jsonObjYearWise = jsonObj.Table1.filter(function (jsonYearinfo) {
                                        return jsonYearinfo.YearData == jsonObj.Table2[k].YearData;
                                    });
                                    var YearInfo = jsonObj.Table2[k].YearData;
                                    if (jsonObjYearWise.length > 0) {
                                        currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObjYearWise, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), YearInfo);
                                    }
                                }
                            }
                        }
                        else {
                            currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObj.Table1, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), "");
                        }
                        currentWidget.checkConditions = true;
                    }
                    if (((configOptions.UserInfo.UserRole).toUpperCase() == "STANDARD") || ((configOptions.UserInfo.UserRole).toUpperCase() == "SPONSOR")) {
                        $(".stopoverbtn").css("display", "none");
                    }
                    else {
                        $(".stopoverbtn").css("display", "block");
                    }
                    $("#ResultPagePanel").css('visibility', 'visible');
                    $("#ResultPagePanel").css('bottom', '-265px');
                    $("#ResultPagePanel").css('z-index', '9');
                    $(".Overlay").fadeOut();
                },

                error: function (xhr, error) {
                    $(".Overlay").fadeOut();
                    AlertMessages('error', '', currentWidget._i18n.UnabletofetchbirdPTTIDdetails);
                },

            });
        },


    });

});










