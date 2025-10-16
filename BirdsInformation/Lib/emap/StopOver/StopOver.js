define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/topic',
    "dojo/store/Memory",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane",
    'dgrid/extensions/ColumnHider',
    "esri/graphic",
    'esri/request',
    "esri/tasks/QueryTask",
    "esri/tasks/query",
    "esri/tasks/Geoprocessor",
    "dojo/text!emap/StopOver/templates/StopOver.html",
    "dojo/i18n!emap/StopOver/nls/Resource",


], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, topic, Memory, TabContainer, ContentPane, ColumnHider, Graphic, esriRequest, QueryTask, Query, Geoprocessor, dijitTemplate, i18n) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: dijitTemplate,
        widgetsInTemplate: true,
        i18n: i18n,
        map: null,
        title: i18n.title,
        domNode: null,
        queryinfo: null,
        currentuser: null,
        configOptions: null,
        ServiceUrl: null,
        endpotint: null,
        stopOverReport: null,
        birdid: null,
        stopOverGraphics: [],
        _lyrstopOverArea: null,
        layerinfo: [],
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
            topic.subscribe('mapClickMode/ClearStopOverControls', lang.hitch(this, function () {
                currentWidget.CleanStopOver();
            }));

            topic.subscribe('mapClickMode/DeleteGraphics', lang.hitch(this, function () {

                var QueryResults = this.tc;
                for (var i = QueryResults.getChildren().length; i > 0; i--) {
                    QueryResults.removeChild(QueryResults.getChildren()[0]);
                }
                if (currentWidget.queryinfo != null) {
                    currentWidget.queryinfo.platformidList = "";
                    currentWidget.queryinfo.year = "";
                    currentWidget.queryinfo.fromdate = "";
                    currentWidget.queryinfo.todate = "";
                }

            }));
            $("#StopOverResultsTabContainer").empty();

            var div = document.createElement('div');
            div.id = "StopOverResultsTabContainer" + counter;
            this.counter++;
            $("#StopOverResultsTabContainer").append(div);


            this.tc = new TabContainer({
                style: "height: 100%; width: 100%;"
            }, div.id);
            this.tc.startup();

            //added this code for resize the tabcontainer after click on export excel
            $('#profile-tab').on('shown.bs.tab', function (event) {
                var x = $(event.target).text();         // active tab
                var y = $(event.relatedTarget).text();  // previous tab
                currentWidget.tc.resize();
            });
        },
        startup: function (queryinforesults) {
            var currentWidget = this;
        },

        CleanStopOver: function () {
            var currentWidget = this;
            $(currentWidget.distance).val("");
            $(currentWidget.timeperiod).val("")
        },

        getresults: function () {
            var currentWidget = this;
            var distance = $(currentWidget.distance).val();
            var timeperiod = $(currentWidget.timeperiod).val();

            $(currentWidget.lbldistance).css("display", "none");
            $(currentWidget.lbltime).css("display", "none");

            $(".Overlay").fadeIn();

            var formIsValid = true;
            if (distance == "") {
                $(currentWidget.lbldistance).css("display", "block");
                formIsValid = false;

            }
            if (timeperiod == "") {
                $(currentWidget.lbltime).css("display", "block");
                formIsValid = false;

            }

            if (formIsValid == false) {
                $(".Overlay").fadeOut();
                return;
            }
            if (currentWidget.queryinfo.fromdate == "" || currentWidget.queryinfo.todate == "") {

                if (currentWidget.queryinfo.platformidList == "") {
                    $(".Overlay").fadeOut();
                    return;
                }
            }
            var endpotint;
            if (currentWidget.queryinfo.type == "GSM") {
                endpotint = "jsonStopOver/GSM/";
            }
            else if (currentWidget.queryinfo.type == "GPS") {
                endpotint = "jsonStopOver/GPS/";
            }
            else if (currentWidget.queryinfo.type == "Argos") {
                endpotint = "jsonStopOver/ARGOS/";
            }
            if (currentWidget.queryinfo.fromdate == "" && currentWidget.queryinfo.todate == "" && currentWidget.queryinfo.platformidList != "" || typeof (currentWidget.queryinfo.platformidList) != 'undefined') {
                
                var platformids = currentWidget.queryinfo.platformidList.split(',');
                var counter = 0;

                for (var i = 0; i < platformids.length; i++) {

                    var data = platformids[i].trim() + "/";

                    $.ajax({

                        url: currentWidget.ServiceUrl + "JSONStopOverMinMaxDate/" + currentWidget.queryinfo.type + "/" + platformids[i] + "/" + currentWidget.queryinfo.year,
                        async: false,
                        type: "GET",
                        beforeSend: function () { $(".Overlay").fadeIn(); },
                        success: function (val1) {
                            report = jQuery.parseJSON(val1.JSONStopOverMinMaxDateResult);
                            var fromdate = currentWidget.formatDate(report[0].fromdate);
                            var todate = currentWidget.formatDate(report[0].todate);
                            if (currentWidget.queryinfo.locclass == "" || typeof (currentWidget.queryinfo.locclass) == 'undefined') {
                                data += "null/";
                            }
                            else {
                                data += currentWidget.queryinfo.locclass + "/";
                            }
                            data += distance + "/" + timeperiod;

                            data += "/" + fromdate + "/" + todate;

                            $.ajax({
                                type: "GET",
                                url: currentWidget.ServiceUrl + endpotint + data + "/" + timeperiod,
                                async: false,
                                beforeSend: function () { $(".Overlay").fadeIn(); },
                                success: function (val) {
                                    report = jQuery.parseJSON(val.JSONStopOverResult);
                                    currentWidget.Createpolygon(report);
                                    counter++;
                                    if (counter == platformids.length) {
                                        $(".Overlay").fadeOut();
                                    }
                                },
                                error: function (err) {
                                    $(".Overlay").fadeOut();
                                }

                            });



                        },
                        error: function (err) {
                            $(".Overlay").fadeOut();
                        }

                    });



                }

            }
            else {

                var data = currentWidget.queryinfo.platformid + "/";
                if (currentWidget.queryinfo.locclass == "") {
                    data += "null/";
                }
                else {
                    data += currentWidget.queryinfo.locclass + "/";
                }

                data += distance + "/" + timeperiod;

                data += "/" + currentWidget.queryinfo.fromdate + "/" + currentWidget.queryinfo.todate;

                $.ajax({
                    type: "GET",
                    url: currentWidget.ServiceUrl + endpotint + data + "/" + (currentWidget.queryinfo.timeinterval.length === 0 ? null : currentWidget.queryinfo.timeinterval),
                    
                    success: function (val) {
                        report = jQuery.parseJSON(val.JSONStopOverResult);
                        currentWidget.Createpolygon(report);
                        $(".Overlay").fadeOut();

                    },
                    error: function (err) {
                        $(".Overlay").fadeOut();
                    }

                });
            }
        },
        getresultsstop: function () {
            var currentWidget = this;
            var distance = $(currentWidget.distance).val();
            var timeperiod = $(currentWidget.timeperiod).val();
            $(currentWidget.lbldistance).css("display", "none");
            $(currentWidget.lbltime).css("display", "none");
            $(".Overlay").fadeIn();
            var formIsValid = true;
            if (distance == "") {
                $(currentWidget.lbldistance).css("display", "block");
                formIsValid = false;
            }
            if (timeperiod == "") {
                $(currentWidget.lbltime).css("display", "block");
                formIsValid = false;
            }
            if (formIsValid == false) {
                $(".Overlay").fadeOut();
                return;
            }
            if (currentWidget.queryinfo.fromdate == "" || currentWidget.queryinfo.todate == "") {
                if (currentWidget.queryinfo.platformidList == "") {
                    $(".Overlay").fadeOut();
                    AlertMessages("error", '', currentWidget._i18n.PleasePerformtheQueryFilter);
                    return;
                }
            }
            var endpotint;
            if (currentWidget.queryinfo.type == "GSM") {
                endpotint = "jsonStopOver/GSM/";
            }
            else if (currentWidget.queryinfo.type == "GPS") {
                endpotint = "jsonStopOver/GPS/";
            }
            else if (currentWidget.queryinfo.type == "Argos") {
                endpotint = "jsonStopOver/ARGOS/";
            }
            var locationClass = null;

            //if (currentWidget.queryinfo.fromdate == "" && currentWidget.queryinfo.todate == "" && currentWidget.queryinfo.platformidList != "" || typeof (currentWidget.queryinfo.platformidList) != 'undefined') {            
            if (typeof (currentWidget.queryinfo.platformidList) != 'undefined' && currentWidget.queryinfo.platformidList!="") {
                var platformids = currentWidget.queryinfo.platformidList.split(',');
                var counter = 0;
                if (currentWidget.queryinfo.year == "") {
                    currentWidget.queryinfo.year = "9999";
                }
                for (var i = 0; i < platformids.length; i++) {
                    currentWidget.queryinfo.platformid = platformids[i];
                    var data = platformids[i].trim() + "/";

                    $.ajax({

                        url: currentWidget.ServiceUrl + "JSONStopOverMinMaxDate/" + currentWidget.queryinfo.type + "/" + platformids[i] + "/" + currentWidget.queryinfo.year,
                        async: false,
                        type: "GET",
                        beforeSend: function () { $(".Overlay").fadeIn(); },
                        success: function (val1) {
                            report = jQuery.parseJSON(val1.JSONStopOverMinMaxDateResult);
                            var fromdate = currentWidget.formatDate(report[0].fromdate);
                            var todate = currentWidget.formatDate(report[0].todate);

                            if (currentWidget.queryinfo.locclass == "" || typeof (currentWidget.queryinfo.locclass) == 'undefined') {
                                locationClass = null;
                            }
                            else {
                                locationClass = currentWidget.queryinfo.locclass;
                            }


                            var gp = new Geoprocessor(configOptions.stopOverGpService);

                            gp.setOutputSpatialReference({ wkid: currentWidget.map.spatialReference });

                            var params = {
                                SensorType: currentWidget.queryinfo.type,
                                BirdID: platformids[i].trim(),
                                Distance: distance,
                                TimeInterval: timeperiod,
                                FromDate: fromdate,
                                ToDate: todate,
                                LocClass: locationClass,
                            };

                            gp.submitJob(params, completeCallback, statusCallback);


                            function statusCallback(jobInfo) {
                                console.log(jobInfo.jobStatus);
                            }

                            function completeCallback(jobInfo) {
                                var isstopoverresultdata = false;
                                gp.getResultData(jobInfo.jobId, "StopOverResults", function (result) {
                                    if (result.value == null) {
                                        AlertMessages("error", '', currentWidget._i18n.NoStopOverresultsfound);
                                        $(".Overlay").fadeOut();
                                    }
                                    else if (result.value.length == 0) {
                                        //isstopoverresultdata = false;
                                        AlertMessages("error", '', currentWidget._i18n.NoStopOverresultsfound);
                                        $(".Overlay").fadeOut();
                                    }
                                    else {
                                        isstopoverresultdata = true;
                                        var resultdata = result.value;
                                        currentWidget.Createpolygon(resultdata);
                                        counter++;
                                        if (counter == platformids.length) {
                                            if (isstopoverresultdata == false) {
                                                AlertMessages("error", '', currentWidget._i18n.NoStopOverresultsfound);
                                            }
                                            $(".Overlay").fadeOut();
                                        }
                                    }
                                });
                            }
                        },
                        error: function (err) {
                            $(".Overlay").fadeOut();
                        }

                    });

                }
            }
            else {

                if (currentWidget.queryinfo.locclass == "" || typeof (currentWidget.queryinfo.locclass) == 'undefined') {
                    locationClass = null;
                }
                else {
                    locationClass = currentWidget.queryinfo.locclass;
                }

                var gp = new Geoprocessor(configOptions.stopOverGpService);

                gp.setOutputSpatialReference({ wkid: currentWidget.map.spatialReference });

                if (currentWidget.queryinfo.fromdate != null || typeof (currentWidget.queryinfo.fromdate) != 'undefined') {
                    var fromdatesplit = currentWidget.queryinfo.fromdate.split('-');
                    var fromdate = fromdatesplit[2] + '-' + fromdatesplit[1] + '-' + fromdatesplit[0];
                }
                else {
                    var fromdate = currentWidget.queryinfo.fromdate
                }
                if (currentWidget.queryinfo.todate != null || typeof (currentWidget.queryinfo.todate) != 'undefined') {
                    var todatesplit = currentWidget.queryinfo.todate.split('-');
                    var todate = todatesplit[2] + '-' + todatesplit[1] + '-' + todatesplit[0];
                }
                else {
                    var todate = currentWidget.queryinfo.todate;
                }


                var params = {
                    SensorType: currentWidget.queryinfo.type,
                    BirdID: currentWidget.queryinfo.platformid,
                    Distance: distance,
                    TimeInterval: timeperiod,
                    FromDate: fromdate,
                    ToDate: todate,
                    LocClass: locationClass,
                };
                gp.submitJob(params, completeCallback, statusCallback);

                
                function statusCallback(jobInfo) {
                    console.log(jobInfo.jobStatus);
                }

                function completeCallback(jobInfo) {                   
                    gp.getResultData(jobInfo.jobId, "StopOverResults", function (result) {
                        if (result.value == null) {
                            AlertMessages("error", '', currentWidget._i18n.NoStopOverresultsfound);
                            $(".Overlay").fadeOut();
                        }
                        else if (result.value.length == 0) {
                            AlertMessages("error", '', currentWidget._i18n.NoStopOverresultsfound);
                            $(".Overlay").fadeOut();
                        }
                        else {

                            var resultdata = result.value;
                            currentWidget.Createpolygon(resultdata);
                            $(".Overlay").fadeOut();
                        }
                    });
                }
            }
        },

        formatDate: function (date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
            $(".Overlay").fadeOut();
        },
        getAddress: function (lat, lon, Resultgrid) {

            return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest();
                var method = 'GET';

                var url = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&&langCode=En&featureTypes=&location=' + lat + ',' + lon + '';
                var async = false;
                request.open(method, url, async);
                request.onreadystatechange = function () {
                    if (request.readyState == 4) {
                        if (request.status == 200) {
                            var data = JSON.parse(request.response);
                            // console.log("request data",request);
                            if (data.address.CountryCode != "") {
                                var country = configOptions.countryListAllIsoData.filter(x => x.code3 == data.address.CountryCode || x.code == data.address.CountryCode);
                                Resultgrid["Country"] = country[0].name;
                            }
                            Resultgrid["Region"] = data.address.Region;
                            resolve(data);

                        }
                        else {
                            reject(request.status);
                        }
                    }
                };
                request.send();
            });
        },
      
        Createpolygon: function (result) {
            var currentWidget = this;
            //stopOverGraphics = [];
            var countAttr = 0;
            currentWidget.stopOverReport = [];

            var highlightSymbol =
                new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                    new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                        new dojo.Color([255, 0, 0]), 3), new dojo.Color([125, 125, 125, 0.35]));



            currentWidget.queryinfo.platformid = result[0].PID;
            var itemIndex = 0;
            var points = [];
            var resultdatagrid = [];
            var resultwindow = "<table id='soResults'><tr><th>ID</th><th>Platform ID</th><th>From Date</th><th>To Date</th><th>Hrs</th><th><var>Area KM<sup>2</sup></var></th></tr><tbody>";
            var hours = [];
            var icon = 0;
            for (var j = 0; j < result.length; j++) {
                var hrs;
                if (icon.toString() === result[j].ID) {
                    hrs = currentWidget.roundMe(parseFloat(result[j].HOURS) / 3600, 4);
                }
                else if (icon.toString() !== result[j].ID) {
                    icon = result[j].ID;
                    hrs = currentWidget.roundMe(parseFloat(result[j].HOURS) / 3600, 4);
                }
                hours.push({ "HOURS": hrs });

            }

            var maxhours = Math.max.apply(Math, hours.map(function (o) { return o.HOURS; }));
            var minhours = Math.min.apply(Math, hours.map(function (o) { return o.HOURS; }));

            var hrsdiff = parseInt((maxhours - minhours) / 3);
            var range1 = minhours + (1 * hrsdiff);
            var range2 = minhours + (2 * hrsdiff);
            var range3 = minhours + (3 * hrsdiff);



            var iCurrent = 0;
            var TempHours;
            var tempcnt = 0;
            for (var i = 0; i < result.length; i++) {

                if (iCurrent.toString() === result[i].ID) {
                    currentWidget.birdid = result[0].PID
                    var point = [];
                    point.push(parseFloat(result[i].LONG));
                    point.push(parseFloat(result[i].LAT));
                    points.push(point);
                    TempHours = result[i].HOURS;
                    tempcnt = i;


                    if (i == (result.length - 1)) {
                        points.splice(points.length - 1, 1);
                        var polygonJson = {
                            "rings": [points], "spatialReference": { "wkid": 4326 }
                        };


                        var polygon = new esri.geometry.Polygon(polygonJson);
                        var pt = polygon.getCentroid();
                        var hrs = currentWidget.roundMe(parseFloat(TempHours) / 3600, 4);
                        var areas = currentWidget.roundMe(esri.geometry.geodesicAreas([polygon], esri.Units.SQUARE_KILOMETERS), 4);

                        var Resultgrid = {};
                        Resultgrid["ID"] = result[tempcnt].ID;
                        Resultgrid["Platform ID"] = result[tempcnt].PID
                        Resultgrid["From Date"] = result[tempcnt].FROM;
                        Resultgrid["To Date"] = result[tempcnt].TO;
                        Resultgrid["Hours"] = hrs.toString();
                        Resultgrid["Area KM²"] = areas.toString();
                        Resultgrid["Long"] = pt.x;  //result[tempcnt].LONG;
                        Resultgrid["Lat"] = pt.y;  //result[tempcnt].LAT;
                        Resultgrid["Country"] = null;
                        Resultgrid["Region"] = null;
                        resultdatagrid.push(Resultgrid);

                        currentWidget.layerinfo.push({ id: result[tempcnt].PID, result: Resultgrid });

                        //here lat long values are reversed
                        currentWidget.getAddress(pt.x, pt.y, Resultgrid).then
                            (console.log)
                            .catch(console.error);

                        if (hrs <= range1) {
                            var sfs1 = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new esri.Color([0, 255, 0]), 2), new esri.Color([0, 255, 0, 0.25]));

                            var attr = {
                                "Platform ID": currentWidget.queryinfo.platformid, "From Date": result[tempcnt].FROM, "To Date": result[tempcnt].TO, "Hours": hrs.toString(),
                                "Area": areas.toString(), "Lat": pt.y, "Long": pt.x, "Country": resultdatagrid[countAttr].Country, "Region": resultdatagrid[countAttr].Region
                            };
                            countAttr++;
                            var infoTemplate = new esri.InfoTemplate("Stop Over Information", "<table><tr><td>Platform ID:</td><td>" + result[tempcnt].PID + "</td></tr><tr><td>Start time:</td><td>" + result[tempcnt].FROM + "</td></tr><tr><td>End Time:</td><td>" + result[tempcnt].TO + "</td></tr><tr><td>Total Hours:</td><td>" + hrs.toString() + "</td></tr><tr><td>Total Area:</td><td>" + areas + " Area KM²</td></tr><tr><td>Long:</td><td>" + pt.x + "</td></tr><tr><td>Lat:</td><td>" + pt.y + "</td></tr></table>");

                            var graphic = new esri.Graphic(polygon, sfs1, attr, infoTemplate);
                            currentWidget.stopOverGraphics.push(graphic);
                            currentWidget.stopOverReport.push(attr);

                            var _lyrstopOverPicure;

                            if (currentWidget.map.getLayer("StopOverArea_" + currentWidget.queryinfo.platformid) == null) {
                                currentWidget._lyrstopOverArea = new esri.layers.GraphicsLayer({ id: "StopOverArea_" + currentWidget.queryinfo.platformid });
                                _lyrstopOverPicure = new esri.layers.GraphicsLayer({ id: "SO_Symbols_" + currentWidget.queryinfo.platformid });
                                currentWidget.map.addLayers([currentWidget._lyrstopOverArea, _lyrstopOverPicure]);
                            }
                            else {
                                currentWidget._lyrstopOverArea = currentWidget.map.getLayer("StopOverArea_" + currentWidget.queryinfo.platformid);
                                _lyrstopOverPicure = currentWidget.map.getLayer("SO_Symbols_" + currentWidget.queryinfo.platformid);

                            }

                            currentWidget._lyrstopOverArea.add(graphic);
                            currentWidget.PlacePictureAtCenter(polygon, _lyrstopOverPicure);

                        }
                        else if (hrs > range1 || hrs <= range2) {
                            var sfs2 = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new esri.Color([255, 255, 0]), 2), new esri.Color([255, 255, 0, 0.25]));

                            var attr = {
                                "Platform ID": currentWidget.queryinfo.platformid, "From Date": result[tempcnt].FROM, "To Date": result[tempcnt].TO, "Hours": hrs.toString(),
                                "Area": areas.toString(), "Lat": pt.y, "Long": pt.x, "Country": resultdatagrid[countAttr].Country, "Region": resultdatagrid[countAttr].Region
                            };
                            countAttr++;
                            var infoTemplate = new esri.InfoTemplate(currentWidget._i18n.StopOverInformation, "<table><tr><td>Platform ID:</td><td>" + result[tempcnt].PID + "</td></tr><tr><td>Start time:</td><td>" + result[tempcnt].FROM + "</td></tr><tr><td>End Time:</td><td>" + result[tempcnt].TO + "</td></tr><tr><td>Total Hours:</td><td>" + hrs.toString() + "</td></tr><tr><td>Total Area:</td><td>" + areas + " Area KM²</td></tr><tr><td>Long:</td><td>" + pt.x + "</td></tr><tr><td>Lat:</td><td>" + pt.y + "</td></tr></table>");

                            var graphic = new esri.Graphic(polygon, sfs2, attr, infoTemplate);
                            currentWidget.stopOverGraphics.push(graphic);
                            currentWidget.stopOverReport.push(attr);
                            var _lyrstopOverPicure;

                            if (currentWidget.map.getLayer("StopOverArea_" + currentWidget.queryinfo.platformid) == null) {
                                currentWidget._lyrstopOverArea = new esri.layers.GraphicsLayer({ id: "StopOverArea_" + currentWidget.queryinfo.platformid });
                                _lyrstopOverPicure = new esri.layers.GraphicsLayer({ id: "SO_Symbols_" + currentWidget.queryinfo.platformid });
                                currentWidget.map.addLayers([currentWidget._lyrstopOverArea, _lyrstopOverPicure]);
                            }
                            else {
                                currentWidget._lyrstopOverArea = currentWidget.map.getLayer("StopOverArea_" + currentWidget.queryinfo.platformid);
                                _lyrstopOverPicure = currentWidget.map.getLayer("SO_Symbols_" + currentWidget.queryinfo.platformid);

                            }

                            currentWidget._lyrstopOverArea.add(graphic);
                            currentWidget.PlacePictureAtCenter(polygon, _lyrstopOverPicure);

                        }
                        else if (hrs > range2 || hrs <= range3) {
                            var sfs3 = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new esri.Color([255, 0, 0]), 2), new esri.Color([255, 0, 0, 0.25]));

                            var attr = {
                                "Platform ID": currentWidget.queryinfo.platformid, "From Date": result[tempcnt].FROM, "To Date": result[tempcnt].TO, "Hours": hrs.toString(),
                                "Area": areas.toString(), "Lat": pt.y, "Long": pt.x, "Country": resultdatagrid[countAttr].Country, "Region": resultdatagrid[countAttr].Region
                            };
                            countAttr++;
                            var infoTemplate = new esri.InfoTemplate(currentWidget._i18n.StopOverInformation, "<table><tr><td>Platform ID:</td><td>" + result[tempcnt].PID + "</td></tr><tr><td>Start time:</td><td>" + result[tempcnt].FROM + "</td></tr><tr><td>End Time:</td><td>" + result[tempcnt].TO + "</td></tr><tr><td>Total Hours:</td><td>" + hrs.toString() + "</td></tr><tr><td>Total Area:</td><td>" + areas + " Area KM²</td></tr><tr><td>Long:</td><td>" + pt.x + "</td></tr><tr><td>Lat:</td><td>" + pt.y + "</td></tr></table>");

                            var graphic = new esri.Graphic(polygon, sfs3, attr, infoTemplate);
                            currentWidget.stopOverGraphics.push(graphic);
                            currentWidget.stopOverReport.push(attr);

                            var _lyrstopOverPicure;

                            if (currentWidget.map.getLayer("StopOverArea_" + currentWidget.queryinfo.platformid) == null) {
                                currentWidget._lyrstopOverArea = new esri.layers.GraphicsLayer({ id: "StopOverArea_" + currentWidget.queryinfo.platformid });
                                _lyrstopOverPicure = new esri.layers.GraphicsLayer({ id: "SO_Symbols_" + currentWidget.queryinfo.platformid });
                                currentWidget.map.addLayers([currentWidget._lyrstopOverArea, _lyrstopOverPicure]);
                            }
                            else {
                                currentWidget._lyrstopOverArea = currentWidget.map.getLayer("StopOverArea_" + currentWidget.queryinfo.platformid);
                                _lyrstopOverPicure = currentWidget.map.getLayer("SO_Symbols_" + currentWidget.queryinfo.platformid);

                            }
                            currentWidget._lyrstopOverArea.add(graphic);
                            currentWidget.PlacePictureAtCenter(polygon, _lyrstopOverPicure);

                        }


                        itemIndex++;
                        points = [];


                    }
                }

                else if (iCurrent.toString() !== result[i].ID) {
                    iCurrent = result[i].ID;

                    //points.push(points[0]);
                    points.splice(points.length - 1, 1);
                    var polygonJson = {
                        "rings": [points], "spatialReference": { "wkid": 4326 }
                    };


                    var polygon = new esri.geometry.Polygon(polygonJson);
                    var pt = polygon.getCentroid();
                    var hrs = currentWidget.roundMe(parseFloat(TempHours) / 3600, 4);
                    var areas = currentWidget.roundMe(esri.geometry.geodesicAreas([polygon], esri.Units.SQUARE_KILOMETERS), 4);

                    var Resultgrid = {};
                    Resultgrid["ID"] = result[tempcnt].ID;
                    Resultgrid["Platform ID"] = result[tempcnt].PID;
                    Resultgrid["From Date"] = result[tempcnt].FROM;
                    Resultgrid["To Date"] = result[tempcnt].TO;
                    Resultgrid["Hours"] = hrs.toString();
                    Resultgrid["Area KM²"] = areas.toString();
                    Resultgrid["Long"] = pt.x;   //result[tempcnt].LONG;
                    Resultgrid["Lat"] = pt.y;    //result[tempcnt].LAT;
                    Resultgrid["Country"] = null;
                    Resultgrid["Region"] = null;
                    resultdatagrid.push(Resultgrid);

                    currentWidget.layerinfo.push({ id: result[tempcnt].PID, result: Resultgrid });

                    currentWidget.getAddress(pt.x, pt.y, Resultgrid).then
                        (console.log)
                        .catch(console.error);

                    if (hrs <= range1) {
                        //console.log("range1", hrs);
                        var sfs1 = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new esri.Color([0, 255, 0]), 2), new esri.Color([0, 255, 0, 0.25]));

                        var attr = {
                            "Platform ID": currentWidget.queryinfo.platformid, "From Date": result[tempcnt].FROM, "To Date": result[tempcnt].TO, "Hours": hrs.toString(),
                            "Area": areas.toString(), "Lat": pt.y, "Long": pt.x, "Country": resultdatagrid[countAttr].Country, "Region": resultdatagrid[countAttr].Region
                        };
                        countAttr++;
                        
                        var infoTemplate = new esri.InfoTemplate(currentWidget._i18n.StopOverInformation, "<table><tr><td>Platform ID:</td><td>" + result[tempcnt].PID + "</td></tr><tr><td>Start time:</td><td>" + result[tempcnt].FROM + "</td></tr><tr><td>End Time:</td><td>" + result[tempcnt].TO + "</td></tr><tr><td>Total Hours:</td><td>" + hrs.toString() + "</td></tr><tr><td>Total Area:</td><td>" + areas + " Area KM²</td></tr><tr><td>Long:</td><td>" + pt.x + "</td></tr><tr><td>Lat:</td><td>" + pt.y + "</td></tr></table>");

                        var graphic = new esri.Graphic(polygon, sfs1, attr, infoTemplate);
                        currentWidget.stopOverGraphics.push(graphic);
                        currentWidget.stopOverReport.push(attr);
                        var _lyrstopOverPicure;

                        if (currentWidget.map.getLayer("StopOverArea_" + currentWidget.queryinfo.platformid) == null) {
                            currentWidget._lyrstopOverArea = new esri.layers.GraphicsLayer({ id: "StopOverArea_" + currentWidget.queryinfo.platformid });
                            _lyrstopOverPicure = new esri.layers.GraphicsLayer({ id: "SO_Symbols_" + currentWidget.queryinfo.platformid });
                            currentWidget.map.addLayers([currentWidget._lyrstopOverArea, _lyrstopOverPicure]);
                        }
                        else {
                            currentWidget._lyrstopOverArea = currentWidget.map.getLayer("StopOverArea_" + currentWidget.queryinfo.platformid);
                            _lyrstopOverPicure = currentWidget.map.getLayer("SO_Symbols_" + currentWidget.queryinfo.platformid);

                        }
                        currentWidget._lyrstopOverArea.add(graphic);
                        currentWidget.PlacePictureAtCenter(polygon, _lyrstopOverPicure);

                    }
                    else if (hrs > range1 || hrs <= range2) {
                        var sfs2 = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new esri.Color([255, 255, 0]), 2), new esri.Color([255, 255, 0, 0.25]));

                        var attr = {
                            "Platform ID": currentWidget.queryinfo.platformid, "From Date": result[tempcnt].FROM, "To Date": result[tempcnt].TO, "Hours": hrs.toString(),
                            "Area": areas.toString(), "Lat": pt.y, "Long": pt.x, "Country": resultdatagrid[countAttr].Country, "Region": resultdatagrid[countAttr].Region
                        };
                        countAttr++;
                        
                        var infoTemplate = new esri.InfoTemplate(currentWidget._i18nStopOverInformation, "<table><tr><td>Platform ID:</td><td>" + result[tempcnt].PID + "</td></tr><tr><td>Start time:</td><td>" + result[tempcnt].FROM + "</td></tr><tr><td>End Time:</td><td>" + result[tempcnt].TO + "</td></tr><tr><td>Total Hours:</td><td>" + hrs.toString() + "</td></tr><tr><td>Total Area:</td><td>" + areas + " Area KM²</td></tr><tr><td>Long:</td><td>" + pt.x + "</td></tr><tr><td>Lat:</td><td>" + pt.y + "</td></tr></table>");

                        var graphic = new esri.Graphic(polygon, sfs2, attr, infoTemplate);
                        currentWidget.stopOverGraphics.push(graphic);
                        currentWidget.stopOverReport.push(attr);

                        var _lyrstopOverPicure;

                        if (currentWidget.map.getLayer("StopOverArea_" + currentWidget.queryinfo.platformid) == null) {
                            currentWidget._lyrstopOverArea = new esri.layers.GraphicsLayer({ id: "StopOverArea_" + currentWidget.queryinfo.platformid });
                            _lyrstopOverPicure = new esri.layers.GraphicsLayer({ id: "SO_Symbols_" + currentWidget.queryinfo.platformid });
                            currentWidget.map.addLayers([currentWidget._lyrstopOverArea, _lyrstopOverPicure]);
                        }
                        else {
                            currentWidget._lyrstopOverArea = currentWidget.map.getLayer("StopOverArea_" + currentWidget.queryinfo.platformid);
                            _lyrstopOverPicure = currentWidget.map.getLayer("SO_Symbols_" + currentWidget.queryinfo.platformid);
                        }
                        currentWidget._lyrstopOverArea.add(graphic);
                        currentWidget.PlacePictureAtCenter(polygon, _lyrstopOverPicure);
                    }
                    else if (hrs > range2 || hrs <= range3) {
                        var sfs3 = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new esri.Color([255, 0, 0]), 2), new esri.Color([255, 0, 0, 0.25]));

                        var attr = {
                            "Platform ID": currentWidget.queryinfo.platformid, "From Date": result[tempcnt].FROM, "To Date": result[tempcnt].TO, "Hours": hrs.toString(),
                            "Area": areas.toString(), "Lat": pt.y, "Long": pt.x, "Country": resultdatagrid[countAttr].Country, "Region": resultdatagrid[countAttr].Region
                        };
                        countAttr++;
                        
                        var infoTemplate = new esri.InfoTemplate(currentWidget._i18n.StopOverInformation, "<table><tr><td>Platform ID:</td><td>" + result[tempcnt].PID + "</td></tr><tr><td>Start time:</td><td>" + result[tempcnt].FROM + "</td></tr><tr><td>End Time:</td><td>" + result[tempcnt].TO + "</td></tr><tr><td>Total Hours:</td><td>" + hrs.toString() + "</td></tr><tr><td>Total Area:</td><td>" + areas + " Area KM²</td></tr><tr><td>Long:</td><td>" + pt.x + "</td></tr><tr><td>Lat:</td><td>" + pt.y + "</td></tr></table>");

                        var graphic = new esri.Graphic(polygon, sfs3, attr, infoTemplate);
                        currentWidget.stopOverGraphics.push(graphic);
                        currentWidget.stopOverReport.push(attr);

                        var _lyrstopOverPicure;

                        if (currentWidget.map.getLayer("StopOverArea_" + currentWidget.queryinfo.platformid) == null) {
                            currentWidget._lyrstopOverArea = new esri.layers.GraphicsLayer({ id: "StopOverArea_" + currentWidget.queryinfo.platformid });
                            _lyrstopOverPicure = new esri.layers.GraphicsLayer({ id: "SO_Symbols_" + currentWidget.queryinfo.platformid });
                            currentWidget.map.addLayers([currentWidget._lyrstopOverArea, _lyrstopOverPicure]);
                        }
                        else {
                            currentWidget._lyrstopOverArea = currentWidget.map.getLayer("StopOverArea_" + currentWidget.queryinfo.platformid);
                            _lyrstopOverPicure = currentWidget.map.getLayer("SO_Symbols_" + currentWidget.queryinfo.platformid);

                        }
                        currentWidget._lyrstopOverArea.add(graphic);
                        currentWidget.PlacePictureAtCenter(polygon, _lyrstopOverPicure);

                    }

                    itemIndex++;
                    points = [];
                }

            }
            if (resultdatagrid.length != 0) {
                currentWidget.AddDataToTable(currentWidget.queryinfo.type, resultdatagrid);
                $(".stopoverclassResult").css("display", "block");
            }
            else {
                AlertMessages("error", '', this._i18n.NoStopOverresultsfound);
                $(".Overlay").fadeOut();
            }
        },
        AddDataToTable: function (type, result) {
            var currentWidget = this;
            if (result.length == 0) {
                return;
            }
            var data = [];
            var aColumns = [];

            var grid = null;
            var cp1 = null;

            for (var obj in result[0]) {
                //var colName = obj.toUpperCase();
                var colName = obj;
                var item = [
                    { 'name': colName, 'field': obj, 'width': 'auto' },
                ];
                aColumns.push(item[0]);
            };



            require(['dgrid/OnDemandGrid', 'dgrid/extensions/Pagination', "dgrid/extensions/ColumnHider",
                'dojo/_base/declare', 'dojox/grid/EnhancedGrid', 'dojox/grid/enhanced/plugins/Pagination',
                "dojox/grid/enhanced/plugins/Menu",
                "dijit/Menu",
                'dojo/domReady!'],
                function (Grid, Pagination, ColumnHider, declare, EnhancedGrid, Pagination, Menus, Menu) {

                    var tabs = currentWidget.tc.getChildren();
                    for (var i = tabs.length - 1; i >= 0; i--) {
                        if (tabs[i].title == result[0].PID) {
                            var existingtab = tabs[i];
                            currentWidget.tc.removeChild(existingtab);
                        }
                    }

                    var dataForGrid = [];

                    var data = {
                        identifier: 'id',
                        items: []
                    };

                    dataForGrid = result;
                    for (var i = 0; i < dataForGrid.length; i++) {
                        data.items.push(lang.mixin({ id: i + 1 }, dataForGrid[i]));
                    }
                    var store = new dojo.data.ItemFileWriteStore({ data: data });

                    var layout = [];
                    for (var i = 0; i < aColumns.length; i++) {
                        layout.push(aColumns[i]);
                    }
                    var grid = new EnhancedGrid({
                        store: store,
                        structure: layout,
                        plugins: {
                            pagination: {
                                pageSizes: ["10", "25", "50", "100", "All"],
                                description: true,
                                sizeSwitch: true,
                                pageStepper: true,
                                gotoButton: true,
                                /*page step to be displayed*/
                                maxPageStep: 4,
                                /*position of the pagination bar*/
                                position: "bottom"
                            }
                        }
                    }, document.createElement('div'));
                    cp1 = new ContentPane({
                        title: currentWidget.birdid, //result[0].PLATFORM_ID,
                        content: grid.domNode,
                        style: "width:100%;height:100%;",
                    });
                    currentWidget.tc.addChild(cp1);

                    grid.on("CellClick", function (e) {

                        var rowid = e.rowIndex;
                        var lat = grid.getItem(rowid).Lat;
                        var long = grid.getItem(rowid).Long;
                        currentWidget.ZoomAndHighlight(parseFloat(lat), parseFloat(long));

                    });

                    $(".stopoverclass").css("display", "block");
                });
            return;
        },

        ZoomAndHighlight: function (lat, long) {
            var currentWidget = this;
            var pt = new esri.geometry.Point(long, lat, new esri.SpatialReference({ 'wkid': 4326 }));
            var highlightSymbol =
                new esri.symbol.PictureMarkerSymbol('Images/Pointer.gif', 24, 24,
                    new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                        new dojo.Color([255, 0, 0]), 1), new dojo.Color([0, 255, 0, 0.25]));

            var Pointer = new Graphic(pt, highlightSymbol)
            currentWidget.map.graphics.add(Pointer);
            setTimeout(function () { currentWidget.map.graphics.remove(Pointer); }, 5000);

            var Pointer = new Graphic(pt, highlightSymbol)
            currentWidget.map.graphics.add(Pointer);
            setTimeout(function () {
                currentWidget.map.graphics.remove(Pointer);
            }, 5000);
            var newExtent = new esri.geometry.Extent(long - 0.0005, lat - 0.0005, long + 0.0005, lat + 0.0005, new esri.SpatialReference({ 'wkid': 4326 }));
            currentWidget.map.setExtent(newExtent);
        },
        exportToExcelAll: function () {
            var platformid = this.layerinfo[0].id;
            var results = [];
            for (var i = 0; i < this.layerinfo.length; i++) {
                if (this.layerinfo[i].id.indexOf(platformid) >= 0) {
                    results.push(this.layerinfo[i].result);
                }
                else {
                    this.JSONToCSVConvertor(results, platformid, true);
                    platformid = this.layerinfo[i].id;
                    results = [];
                }
                if (i == this.layerinfo.length - 1) {
                    this.JSONToCSVConvertor(results, platformid, true);
                }
            }
        },
        exportToExcelAll_1: function () {

            var layersinfosarray = [];
            var resultobject = {}
            var birdPIDs = [];
            for (var i = 0; i < this.layerinfo.length; i++) {
                if (this.layerinfo[i] == null) {
                    continue;
                }
                if (this.layerinfo[i].id.indexOf("StopOverArea") >= 0) {
                    layersinfosarray.push(this.layerinfo[i]);
                }
            }
            var birdid = layersinfosarray[0].id.split("_")[1];
            var results = [];
            for (var j = 0; j < layersinfosarray.length; j++) {
                if (layersinfosarray[j].id.indexOf(birdid) >= 0) {
                    results.push(layersinfosarray[j].result[0]);
                }
                else {
                    this.JSONToCSVConvertor(results, birdid, true);
                    birdid = layersinfosarray[j].id.split("_")[1];
                    results = [];
                }
                if (j == layersinfosarray.length) {
                    this.JSONToCSVConvertor(results, birdid, true);
                }
            }
        },


        JSONToCSVConvertor: function (JSONData, ReportTitle, ShowLabel) {
            var currentWidget = this;
            //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

            var CSV = '';
            //Set Report title in first row or line

            //CSV += ReportTitle + '\r\n\n';

            //This condition will generate the Label/Header
            if (ShowLabel) {
                var row = "";

                //This loop will extract the label from 1st index of on array
                for (var index in arrData[0]) {

                    //if (index == "<var>Area KM<sup>2</sup></var>") {
                    //    //index = "Area KM<sup>2</sup>";
                    //    index ="Area KM²"
                    //}
                    if (index == "MIGRATION" || index == "ColorObj") {
                        continue;
                    }
                    if (currentWidget.currentuser == "Admin") {
                        row += index + ',';
                    }
                    else {
                        if (index == "PID" || index == "DATE" || index == "TIME" || index == "LAT" || index == "LONG" || index == "CLASS") {
                            row += index + ',';
                        }
                    }
                    //Now convert each value to string and comma-seprated
                }

                row = row.slice(0, -1);

                //append Label row with line break
                CSV += row + '\r\n';
            }

            //1st loop is to extract each row
            for (var i = 0; i < arrData.length; i++) {
                var row = "";

                //2nd loop will extract each column and convert it in string comma-seprated
                for (var index in arrData[i]) {
                    if (index == "MIGRATION" || index == "ColorObj") {
                        continue;
                    }
                    if (currentWidget.currentuser == "Admin") {
                        if (arrData[i][index] == null) {
                            arrData[i][index] = "";
                        }
                        row += '"' + arrData[i][index] + '",';
                    }
                    else {
                        if (index == "PID" || index == "DATE" || index == "TIME" || index == "LAT" || index == "LONG" || index == "CLASS") {
                            row += '"' + arrData[i][index] + '",';
                        }
                    }
                }
                //for (var index in arrData[i]) {
                //    row += '"' + arrData[i][index] + '",';
                //}

                row.slice(0, row.length - 1);

                //add a line break after each row
                CSV += row + '\r\n';
            }

            if (CSV == '') {
                UpdateLable('#FilterProgress', "No Results Found.")
                return;
            }

            //Generate a file name
            var fileName = "MyReport_";
            //this will remove the blank-spaces from the title and replace it with an underscore
            fileName += ReportTitle.replace(/ /g, "_");

            //Initialize file format you want csv or xls
            var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

            // Now the little tricky part.
            // you can use either>> window.open(uri);
            // but this will not work in some browsers
            // or you will not get the correct file extension    

            //this trick will generate a temp <a /> tag
            var link = document.createElement("a");
            link.href = uri;

            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";

            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        roundMe: function (n, sig) {
            if (n <= 0) return 0;
            var mult = Math.pow(10, sig - Math.floor(Math.log(n < 0 ? -n : n) / Math.LN10) - 1);
            return Math.round(n * mult) / mult;
        },
        PlacePictureAtCenter: function (polygon, stopoverArea) {
            var pictureMarkerSymbol = new esri.symbol.PictureMarkerSymbol('Images/spot2.gif', 24, 24);
            var pt = polygon.getCentroid();
            var graphic = new esri.Graphic(pt, pictureMarkerSymbol);
            stopoverArea.add(graphic);
            function _callback(responce) {
                //console.log(responce.features)
                var highlightSymbol =
                    new esri.symbol.SimpleLineSymbol(
                        esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                        new esri.Color([255, 0, 0]), 3
                    );

                if (responce.features.length > 0) {
                    var highlightGraphic = new Graphic(responce.features[0].geometry, highlightSymbol);
                    map.graphics.add(highlightGraphic);
                }

            }
            function promiseRejected(error) {
                console.log("Promise rejected: ", error.message);
            }
        },


    });
});



