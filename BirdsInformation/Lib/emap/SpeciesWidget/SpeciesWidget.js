define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/topic',
    'esri/tasks/geometry',
    'esri/geometry/Point',
    'esri/graphic',
    "esri/toolbars/draw",
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleFillSymbol',
    "dojo/_base/Color",
    "esri/renderers/HeatmapRenderer",
    "esri/layers/FeatureLayer",
    "esri/InfoTemplate",
    "dojo/text!emap/SpeciesWidget/templates/SpeciesWidget.html",
    "dojo/i18n!emap/SpeciesWidget/nls/Resource",
    'xstyle/css!../SpeciesWidget/css/SpeciesWidget.css',
    /*"emap/GoogleAnimateWidget/GoogleAnimateWidget"*/


], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, topic, geometryService, Point,
    Graphic, draw, SimpleLineSymbol, SimpleFillSymbol, Color, HeatmapRenderer, FeatureLayer, InfoTemplate, dijitTemplate, i18n) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: dijitTemplate,
        widgetsInTemplate: true,
        i18n: i18n,
        map: null,
        title: i18n.title,
        domNode: null,
        configOptions: null,
        defaultSymbol: null,
        pointFeatures: null,
        geometryService: null,
        queryinfo: null,
        currentuser: null,
        ServiceUrl: null,
        currentWidget: null,
        queryResultsWidget: null,
        AnimateWidget: null,
        StopOverResults: null,
        result: null,
        features: null,
        TrackingData: null,
        swichwhole: true,
        checkConditions: false,
        ExistingColor: null,
        results1: [],
        polygonresults: [],
        MCPAttributes: null,
        GlobalCurrentWidget: null,
        PolygonID: 0,
        DrawToolBar: null,
        DrawToolBar: null,
        PlottedPTTIDsCnt: 0,
        DataCount: 0,
        TblColorHighlight:null,
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

            currentWidget = this;
            topic.subscribe('mapClickMode/HideButtons', lang.hitch(this, function () {

                currentWidget.HideControls();
            }));
            topic.subscribe('mapClickMode/ChangeRowColor', lang.hitch(this, function () {

                $(currentWidget.tblActiveBirds).find("tr").css("background-color", "");
                currentWidget.PlottedPTTIDsCnt = 0;
                currentWidget.DataCount = 0;

            }));


            $(".form-check-input").click(function () {
                var inputValue = $(this).attr("value");

                if (inputValue == "Within") {
                    $(".DateDisplay").fadeIn();
                }
                else {
                    $(".DateDisplay").fadeOut();
                }
            });

            $(".dateclass").datepicker();

            $('.IDBtisTable').on("click", ".btTxt", function (obj) {
                //clearPointDensityLayer();
                $(".Overlay").fadeIn();
                currentWidget.AddActiveBird(obj.target);
            });
            $('.IDBtisTable').on("click", ".btnanimate", function (obj) {
                $(".Overlay").fadeIn();
                obj.target.parentElement.parentElement.parentElement.style.backgroundColor = "rgba(255, 255, 255, 0.3)"
                var rowid = $(obj.target).attr("rowid");
                if (rowid == null || typeof (rowid) == "undefined")
                    return;
                currentWidget.animateResults.queryinfo = currentWidget.queryinfo;
                currentWidget.queryinfo.platformid = $("#lblPID" + rowid).text();
                currentWidget.queryinfo.platformidList = "";
                currentWidget.queryinfo.fromdate = $("#lblFromdate" + rowid).text();
                currentWidget.queryinfo.todate = $("#lblTodate" + rowid).text();
                currentWidget.queryinfo.seasonWise = $(currentWidget.chkSeasonWise).is(":checked");
                var LocationClass = $("#ddlLocation" + rowid).val();
                if (LocationClass == "" || typeof (LocationClass) == 'undefined' || LocationClass == null) {
                    LocationClass = "";
                }
                currentWidget.queryinfo.locclass = LocationClass;
                currentWidget.queryinfo.timeinterval = $("#txtTimeInterval" + rowid).val();
                currentWidget.queryinfo.settype($("#lblType" + rowid).text());

                var timeinterval = (currentWidget.queryinfo.timeinterval == "") ? "null" : currentWidget.queryinfo.timeinterval;
                var data = "";
                if (currentWidget.queryinfo.type == "Argos") {
                    data = currentWidget.queryinfo.platformid;
                    data += (currentWidget.queryinfo.locclass.trim() == "") ? "/null" : "/" + currentWidget.queryinfo.locclass.trim();
                    data += "/" + currentWidget.queryinfo.fromdate + "/" + currentWidget.queryinfo.todate + "/" + timeinterval;
                    data += currentWidget.adduserdetails();
                }
                else if (currentWidget.queryinfo.type == "GPS" || currentWidget.queryinfo.type == "GSM") {
                    data = currentWidget.queryinfo.platformid;
                    data += "/" + currentWidget.queryinfo.fromdate + "/" + currentWidget.queryinfo.todate + "/" + timeinterval;
                    data += currentWidget.adduserdetails();
                }
                currentWidget.queryinfo.data = data;
                currentWidget.animateResults.AddDataTogmapWithID();
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
            currentWidget.queryinfo = {
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
                platformidList: "",
                year: "",
                fromdate: $(this.fromdate).val(),
                todate: $(this.todate).val(),
                timeinterval: $(this.tentacles).val(),
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

            functions = {
                query: {
                    GSM: "jsonGSMData/",
                    GPS: "jsonGPSData/",
                    ARGOS: "jsonArgos/",
                    WHOLE: "jsonBirdsInfo"
                },

                stopover: {
                    GSM: "jsonStopOver/GSM/",
                    GPS: "jsonStopOver/GPS/",
                    ARGOS: "jsonStopOver/ARGOS/"
                },

                birdsinfo: {
                    birdData: "jsonBirdInfo/",
                    birdDataForForm: "jsonBirdInfoForForm/",
                    birdSex: "jsonBirdSex",
                    birdAge: "jsonBirdAge",
                    birdSite: "jsonBirdSite",
                    birdSpecies: "jsonBirdSpecies",
                    birddateupdate: "jsonUpdateBirdInfo/",
                    birdIds: "jsonBirdIds",
                    birdNames: "jsonCommonNames"
                }
            }

            $(currentWidget.btnstopover).click(function () {
                $(".StopOverdiv").css("display", "block");
                $(".LeftPanel .card-header a").css("display", "none");
                if ($(window).width() <= 480) {
                    $(".StopOverdiv").css("width", "300px");
                    $(".StopOverdiv").css("right", "-320px");
                }
                else {
                    $(".StopOverdiv").css("width", "600px");
                    $(".StopOverdiv").css("right", "-620px");
                }
                currentWidget.StopOverResults.queryinfo = currentWidget.queryinfo;
                $(".StopOverdiv").animate({
                    right: "0px"
                }, 200);
                $("#SlidePanel .card-body").css("overflow-y", "hidden");
                $("#LayersPanel .card-body").css("overflow-y", "scroll");
            });

            $(".closeStop").click(function () {
                $(".LeftPanel .card-header a").css("display", "block");
                if ($(window).width() <= 480) {
                    $(".StopOverdiv").animate({
                        right: "-320px"
                    }, 200);
                }
                else {
                    $(".StopOverdiv").animate({
                        right: "-620px"
                    }, 200);

                }
                $(".card-body").css("overflow-y", "scroll");
            });
            const toggle = document.querySelector('.toggle-theme input[type="checkbox"]');



            function toggleTheme(event) {
                if (event.target.checked) {

                    document.body.className = 'dark-theme';
                    //alert(this._i18n.checked);
                } else {
                    document.body.className = '';
                    //alert(this._i18n.unchecked);
                }
            }




        },




        startup: function () {
            var currentWidget = this;
            currentWidget.getSpecies();
            $(currentWidget.tblHeadings).hide();
            $(".divDateClass").hide();
            GlobalCurrentWidget = currentWidget;
        },
        switch_Onchange: function () {
            var currentWidget = this;
            if ($(currentWidget.switchbutton).is(":checked") == false) {
                currentWidget.swichwhole = true;
                $(".divDateClass").hide();
                $(".Table_Headings").hide();
                $(currentWidget.tblActiveBirds).html('');

            }
            else if ($(currentWidget.switchbutton).is(":checked") == true) {
                currentWidget.swichwhole = false;
                var pgDirR = document.getElementsByTagName('html');
                if (pgDirR[0].dir == 'rtl' || pgDirR[0].style.direction == 'rtl') {
                    $(".floatLeft").css("float","right");
                }
                else {
                    $(".floatLeft").css("float", "left");
                }


                $(".divDateClass").show();
                $(".Table_Headings").hide();
                $(currentWidget.tblActiveBirds).html('');
            }
        },
        HideControls: function () {
            var currentWidget = this;
            $(".stopoverclass").css("display", "none");
            $(".MCPResultBtn").css("display", "none");
            $(".PointDensitybtn").css("display", "none");
            $(".MCPFullResultBtn").css("display", "none");
        },
        ClearControls: function () {
            var currentWidget = this;
            $(currentWidget.fromdate).val("");
            $(currentWidget.todate).val("");
            $(currentWidget.tblActiveBirds).html('');
            $(currentWidget.whole).checked = true;
            $(".stopoverclass").css("display", "none");
            $(currentWidget.lblspeciesstatus).css("display", "none");
            $(currentWidget.lblfromdate).css("display", "none");
            $(currentWidget.lbltodate).css("display", "none");
            $(currentWidget.lblgreater).css("display", "none");
            $(currentWidget.chkSeasonWise).prop('checked', false);
            $(".MCPResultBtn").css("display", "none");
            $(".MCPFullResultBtn").css("display", "none");
            $(".PointDensitybtn").css("display", "none");
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
        getSpeciesNames: function () {
            var currentWidget = this;
            $(currentWidget.lblspeciesstatus).css("display", "none");
        },
        adduserdetails: function () {
            var retval = (configOptions.UserInfo.UserName == "") ? "/null" : "/" + configOptions.UserInfo.UserName;
            retval += (configOptions.UserInfo.Password == "") ? "/null" : "/" + configOptions.UserInfo.Password;
            return retval;
        },
        GetTableCellStyle: function (status) {
            if (status == "NA") {
                return "style='width: 50px; background:red; color:white; !important;'";
            }
            else if (status == "AC") {
                return "style='width: 50px; background:Green; color:white; !important;'";
            }
            else {
                return "style='width: 50px; background:#dfdfdf; color:white; !important;'";
            }

        },

        getSpecies: function () {
            $(currentWidget.ddlspecies).append('<option value="All" selected>' + currentWidget._i18n.all +'</option>');
            $(currentWidget.ddlspecies).prop('selected', true);
            $(currentWidget.ddlspecies).append('<option value="Active">' + encodeURIComponent(currentWidget._i18n.active) +'</option>');
            $(currentWidget.ddlspecies).append('<option value="Non Active">' + encodeURIComponent(currentWidget._i18n.nonactive) +'</option>');
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
        getPointDensity: function () {
            $(".Overlay").fadeIn();
            var currentWidget = this;
            currentwidget.map.graphics.clear();
            var layersInfo = currentwidget.map.graphicsLayerIds;
            for (var i = layersInfo.length - 1; i >= 0; i--) {
                var layer = currentwidget.map.getLayer(layersInfo[i]);
                if (layer != null) {
                    if (layer.id.indexOf("Feature") >= 0 || layer.id.indexOf("LabelFeature") >= 0) {
                        currentwidget.map.removeLayer(layer);
                    }
                }
            }
            var results = this.pointFeatures.Table1;
            var features = [];
            for (var i = 0; i < results.length; i++) {
                var feataure = {
                    "attributes": {
                        "OBJECTID": i + 1,
                    },
                    "geometry": {
                        "x": results[i].LONG,
                        "y": results[i].LAT
                    }
                }
                features.push(feataure);
                graphislables.push(feataure);
            }
            var jsonFS = {
                "displayFieldName": "OBJECTID",
                "fieldAliases": {
                    "OBJECTID": "OBJECTID"
                },
                "geometryType": "esriGeometryPoint",
                "spatialReference": {
                    "wkid": 4326
                },
                "fields": [
                    {
                        "name": "OBJECTID",
                        "type": "esriFieldTypeOID",
                        "alias": "OID"
                    },

                ],
                "features": features
            };
            var fs = new esri.tasks.FeatureSet(jsonFS);
            var featureCollection = {
                layerDefinition: {
                    "geometryType": "esriGeometryPoint",
                    "fields": [
                        {
                            "name": "OBJECTID",
                            "type": "esriFieldTypeOID"
                        },
                    ]
                },
                featureSet: fs
            };
            topic.publish('Density/LayerOff', results[0].PID + "_L_" + this.queryinfo.type, results[0].PID + "_P_" + this.queryinfo.type, results[0].PID + "_T_" + this.queryinfo.type);
            var heatmapFeatureLayerOptions = {
                mode: FeatureLayer.MODE_SNAPSHOT,
                id: 'pointDensityLayer',
                outFields: [
                    "OBJECTID",
                ]
            };
            var pointdensityLayer = currentWidget.map.getLayer("pointDensityLayer");
            if (pointdensityLayer != null)
                currentWidget.map.removeLayer(pointdensityLayer);
            var heatmapFeatureLayer = new FeatureLayer(featureCollection, heatmapFeatureLayerOptions);
            var heatmapRenderer = new HeatmapRenderer();
            heatmapFeatureLayer.setRenderer(heatmapRenderer);
            currentWidget.map.addLayer(heatmapFeatureLayer);
            $(currentWidget.PointDensity).css("display", "none");
            $(".Overlay").fadeOut();
        },
        getMCPresults: function (extent) {
            var currentWidget = this;
            if (currentWidget.PlottedPTTIDsCnt > 1) {
                AlertMessages("info", "", currentWidget._i18n.plotoneBirdonthemap);
                return;
            }
            currentWidget.DrawToolBar = new esri.toolbars.Draw(map);
            dojo.connect(currentWidget.DrawToolBar, "onDrawEnd", currentWidget.findPointsInExtent);
            currentWidget.DrawToolBar.activate(esri.toolbars.Draw.EXTENT);
        },
        getMCPresults1: function (extent) {
            var currentWidget = this;
            if (currentWidget.PlottedPTTIDsCnt > 1) {
                AlertMessages("info", "", currentWidget._i18n.plotoneBirdonthemap);
                return;
            }
            $(".Overlay").fadeIn();
            var color1 = GlobalCurrentWidget.getColorCode();
            var Outercolorobj = esri.Color.fromHex(color1);
            var Innercolorobj = esri.Color.fromHex(color1);
            Innercolorobj.a = 0.40;
            currentWidget.PolygonID++;
            var defaultSymbol = new esri.symbol.SimpleMarkerSymbol().setColor(new dojo.Color([0, 255, 0]));
            //initialize symbology
            highlightSymbol = new esri.symbol.SimpleMarkerSymbol().setColor(new dojo.Color([255, 0, 0]));
            var p = this.pointFeatures.Table1;
            currentWidget.results1 = [];
            currentWidget.polygonresults = []
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
                currentWidget.results1.push(graphic.geometry);
            }
            geometryService = new esri.tasks.GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
            geometryService.convexHull(currentWidget.results1, function (result) {
                var currentwidget = this;
                var symbol = null;
                switch (result.type) {
                    case "polygon":
                        currentWidget.polygonresults.push(result)
                        symbol = new esri.symbol.SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Outercolorobj, 2), Innercolorobj);
                        break;
                }
                currentwidget.tempsymbol = symbol;
                currentWidget.polygonresults[0]["attributes"] = currentWidget.MCPAttributes;
                var PolygonGraphic = new esri.Graphic(result, symbol);
                var MCPGraphicLayer = new esri.layers.GraphicsLayer({ id: 'MCPLayer' + currentWidget.PolygonID, className: color1 });
                MCPGraphicLayer.add(PolygonGraphic);
                currentWidget.map.addLayers([MCPGraphicLayer]);
                configOptions.mcpresults.push(currentWidget.polygonresults);
                $(".MCPFullResultBtn").css("display", "none");
                $(".Overlay").fadeOut();
            }, function (error) {
                $(".Overlay").fadeOut();
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
            $(".Overlay").fadeIn();
            $(this.stop).removeAttr("disabled");
            $(this.tblActiveBirds).html('');
            var sensorType = $(currentWidget.ddlspecies).val();
            var fromdate = $(currentWidget.fromdate).val();
            var todate = $(currentWidget.todate).val();
            $(currentWidget.lblspeciesstatus).css("display", "none");
            $(currentWidget.lblgreater).css("display", "none");
            $(currentWidget.lblfromdate).css("display", "none");
            $(currentWidget.lbltodate).css("display", "none");

            var formIsValid = true;
            if (sensorType == "") {
                $(currentWidget.lblspeciesstatus).css("display", "block");
                formIsValid = false;
            }
            if ($(currentWidget.whithin).is(":checked") == true && (Date.parse(currentWidget.todate) <= Date.parse(currentWidget.fromdate))) {
                $(currentWidget.lblgreater).css("display", "block");
                formIsValid = false;
            }
            if ((fromdate == "" || typeof (fromdate) == "undefined") && currentWidget.swichwhole == false) {
                $(currentWidget.lblfromdate).css("display", "block");
                formIsValid = false;
            }
            if ((todate == "" || typeof (todate) == "undefined") && currentWidget.swichwhole == false) {
                $(currentWidget.lbltodate).css("display", "block");
                formIsValid = false;
            }
            if (currentWidget.swichwhole == false) {
                var isvalid = CheckDatesCompare(fromdate, todate);
                if (isvalid == false) {
                    $(currentWidget.lblgreater).css("display", "block");
                    formIsValid = false;
                }
            }
            if (formIsValid == false) {
                $(".Overlay").fadeOut();
                return false;
            }
            if (currentWidget.swichwhole == true) {
                var requestdata = {
                    status: sensorType,
                    login: (configOptions.UserInfo.UserName == "") ? "null" : configOptions.UserInfo.UserName,
                    password: (configOptions.UserInfo.Password == "") ? "null" : configOptions.UserInfo.Password
                };
                currentWidget.GetData(functions.query.WHOLE, requestdata, currentWidget.ActiveBirds, "Collecting Active Birs Information ", "Process Failed", 5000);
            }
            else {
                var requestdata = {
                    status: sensorType,
                    fromdate: fromdate,
                    todate: todate,
                    login: (configOptions.UserInfo.UserName == "") ? "null" : configOptions.UserInfo.UserName,
                    password: (configOptions.UserInfo.Password == "") ? "null" : configOptions.UserInfo.Password
                };
                currentWidget.GetData(functions.query.WHOLE, requestdata, currentWidget.ActiveBirds, "Collecting Active Birs Information ", "Process Failed", 5000);
            }
        },
        GetLocationClass: function () {
            $.ajax({
                type: "GET",
                url: currentWidget.ServiceUrl + "JsonGetLocClass/",
                success: function (result) {
                    $(".LocDropDown").html("");
                    $(".LocDropDown").append('<option value=""></option>');
                    var jsonObj = JSON.parse(result.JsonGetLocClassResult);
                    if (jsonObj.Table != null) {
                        for (i = 0; i < jsonObj.Table.length; i++) {
                            if (jsonObj.Table[i].Type != "") {
                                var optionValue = $('<option>', {
                                    value: jsonObj.Table[i].LOC_CLASS,
                                    html: jsonObj.Table[i].LOC_CLASS
                                });
                                $(".LocDropDown").append(optionValue);
                                //$(".LocDropDown").append('<option>' + encodeURIComponent(jsonObj.Table[i].LOC_CLASS) + '</option>')
                            }
                        }
                    }
                    $(".LocDropDown").SumoSelect({ search: true, searchText: '', placeholder: '' });
                },
                error: function (err) {
                    callbackfuncFailed();
                }
            });
        },
        ConvertToTitleCase: function (SpeciesName) {
            if (SpeciesName != "" || typeof (SpeciesName) != "undefined") {
                return SpeciesName.replace(
                    /\w\S*/g,
                    function (txt) {
                        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                    }
                );
            }
        },
        ActiveBirds: function (result) {
            var tblhtml = '<tr><th style="width: 40px; text-align: left">' + currentWidget._i18n.PID + '</th><th style="width: 40px; text-align: left">' + currentWidget._i18n.Sensor + '</th><th style="width: 90px; text-align: left">' + currentWidget._i18n.Species + '</th><th style="width: 80px; text-align: left">' + currentWidget._i18n.FromDate + '</th><th style="width: 80px; text-align: left">' + currentWidget._i18n.ToDate + '</th><th style="width: 60px; text-align: left">' + currentWidget._i18n.Loc + '</th><th style="width: 55px; text-align: left">' + currentWidget._i18n.Interval + '</th><th style="width: 60px; text-align: left">' + currentWidget._i18n.Actions + '</th></tr >';
            $(this.tblActiveBirds).html('');
            currentWidget.result = result;
            var speciesname;
            for (var i = 0; i < result.length; i++) {
                speciesname = currentWidget.ConvertToTitleCase(result[i].CommonName);
                var backgroundcolor = '#71b871';
                if (result[i].Status == "NA") {
                    backgroundcolor = '#ff7070';
                }
                tblhtml += "<tr><td style = 'background:" + backgroundcolor + "; color:black; !important;'><label id='lblPID" + i + "' >" + result[i].PID + "</label></td>";
                tblhtml += "<td ><label id='lblType" + i + "' >" + result[i].Type + "</label> </td>";
                tblhtml += "<td  class='spname'><label id='lblSpecies" + i + "' >" + speciesname + " </label></td>";
                tblhtml += "<td ><label style='white-space:nowrap;' id='lblFromdate" + i + "' >" + result[i].Start_Date + "</label> </td>";
                tblhtml += "<td ><label style='white-space:nowrap;' id='lblTodate" + i + "' >" + result[i].End_Date + "</label> </td>";
                if (result[i].Type == "ARGOS") {
                    tblhtml += "<td ><select name='Loc' class='LocDropDown' id='ddlLocation" + i + "'></select></td>";
                }
                else {
                    tblhtml += "<td></td>"
                }
                tblhtml += "<td ><input type='number' style='text-align:center;' min='1' max='100' onkeydown='javascript: return event.keyCode == 69 ? false : true' value='4' id='txtTimeInterval" + i + "' placeholder='Time Span' /></td>";
                tblhtml += "<td ><a href='#' id='btnRun" + i + "' class='TableIcon btTxt' data-bs-toggle='tooltip' data-bs-placement='top' title=" + currentWidget._i18n.Run + " data-bs-original-title='Run' aria-label='Run'><i class='far fa-play-circle' rowid='" + i + "'></i></a>";
                tblhtml += "<a href='#' class='TableIcon btnanimate' data-bs-toggle='tooltip' data-bs-placement='top' title=" + currentWidget._i18n.Animate + " data-bs-original-title='Animate' aria-label='Animate'><i class='fas fa-radiation-alt'   rowid='" + i + "'></i></a>";
                tblhtml += "<a href='#' class='TableIcon' data-bs-toggle='tooltip' data-bs-placement='top' title='MCP' style='display:none' data-bs-original-title='MCP' aria-label='MCP'><i class='fas fa-draw-polygon'></i></a></td ></tr > ";
                $("#ddlLocation" + i + "").SumoSelect();
            }
            $(currentWidget.tblActiveBirds).append(tblhtml);
            currentWidget.GetLocationClass();
            if (currentWidget.currentuser == "Admin") {
                /*$(currentWidget.tblHeadings).show();*/
            }
            $(".Overlay").fadeOut();
        },
        GetData: function (func, requestdata, callbackfuncSuccess, callbackfuncFailed, msgSuccess, msgFailed, msgDelaytime) {
            $.ajax({
                type: "POST",
                url: currentWidget.ServiceUrl + func + "/",
                contentType: 'application/json',
                data: JSON.stringify(requestdata),
                success: function (val) {
                    var result = JSON.parse(val);
                    if (result.length == 0) {
                        AlertMessages("warning", "", currentWidget._i18n.NoResultFound)
                        $(".Overlay").fadeOut();
                        return;
                    }
                    callbackfuncSuccess(result, msgSuccess);
                    $(".Overlay").fadeOut();
                },
                error: function (err) {
                    callbackfuncFailed();
                    $(".Overlay").fadeOut();
                }
            });
        },
        PrepareArguments: function () {
            var data = "";
            if (typeof (this.queryinfo.timeinterval) == "undefined" || this.queryinfo.timeinterval == "undefined")
                timeinterval = "null";
            else if (this.queryinfo.timeinterval == null)
                timeinterval = "null";
            else if (this.queryinfo.timeinterval.trim() == "")
                timeinterval = "null";
            else
                timeinterval = this.queryinfo.timeinterval.trim();
            //var timeinterval = (this.queryinfo.timeinterval.trim() == "") ? "null" : this.queryinfo.timeinterval.trim();
            if (this.queryinfo.type == "Argos") {
                var data = {
                    id: this.queryinfo.platformid,
                    locCls: (this.queryinfo.locclass.trim() == "") ? null : this.queryinfo.locclass.trim(),
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
                    locCls: "null",
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
            if (typeof (this.queryinfo.timeinterval) == "undefined" || this.queryinfo.timeinterval == "undefined")
                timeinterval = "null";
            else if (this.queryinfo.timeinterval == null)
                timeinterval = "null";
            else if (this.queryinfo.timeinterval.trim() == "")
                timeinterval = "null";
            else
                timeinterval = this.queryinfo.timeinterval.trim();
            if (this.queryinfo.type == "Argos") {
                data = this.queryinfo.platformid;
                data += (this.queryinfo.locclass.trim() == "") ? "/null" : "/" + this.queryinfo.locclass.trim();
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
        AddActiveBird: function (resultValue) {
            var currentWidget = this;
            $("#ResultPagePanel").css('visibility', 'visible');
            $("#ResultPagePanel").css('bottom', '-265px');
            $("#ResultPagePanel").css('z-index', '9');

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

            configOptions.mcpresults = [];
            currentWidget.TblColorHighlight = resultValue;
            $(resultValue.parentElement.parentElement.parentElement).css("background-color", "rgba(255, 255, 255, 0.3)");
            var rowid = $(resultValue).attr("rowid");
            if (rowid == null || typeof (rowid) == "undefined") {
                return;
            }
            currentWidget.MCPAttributes = { "PID": $("#lblPID" + rowid).text(), "FromDate": $("#lblFromdate" + rowid).text(), "ToDate": $("#lblTodate" + rowid).text(), "SensorType": $("#lblType" + rowid).text() }
            currentWidget.queryinfo.platformid = $("#lblPID" + rowid).text();
            currentWidget.queryinfo.platformidList = "";
            currentWidget.queryinfo.fromdate = $("#lblFromdate" + rowid).text();
            currentWidget.queryinfo.todate = $("#lblTodate" + rowid).text();
            var LocationClass = $("#ddlLocation" + rowid).val();
            if (LocationClass == "" || typeof (LocationClass) == 'undefined' || LocationClass == null) {
                LocationClass = "";
            }
            currentWidget.queryinfo.locclass = LocationClass;
            currentWidget.queryinfo.timeinterval = $("#txtTimeInterval" + rowid).val();
            currentWidget.queryinfo.settype($("#lblType" + rowid).text());
            currentWidget.queryinfo.data = currentWidget.PrepareArguments1();

            if (currentWidget.queryinfo.type == "Argos") {
                var downloadurl = currentWidget.ServiceUrl + "JSONArgosDataDownload/" + currentWidget.queryinfo.data;
            }
            else if (currentWidget.queryinfo.type == "GPS") {
                var downloadurl = currentWidget.ServiceUrl + "JSONGPSDataDownload/" + currentWidget.queryinfo.data;
            }
            else if (currentWidget.queryinfo.type == "GSM") {
                var downloadurl = currentWidget.ServiceUrl + "JSONGSMDataDownload/" + currentWidget.queryinfo.data;
            }
            $("#ExportExcelMobile").attr("href", downloadurl);

            var requestdata = currentWidget.PrepareArguments();
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
                    //    jsonObj = JSON.parse(result.JSONGSMDataResult);
                    //if (currentWidget.queryinfo.type == "GPS")
                    //    jsonObj = JSON.parse(result.JSONGPSDataResult);
                    //if (currentWidget.queryinfo.type == "Argos")
                    //    jsonObj = JSON.parse(result.JSONArgosDataResult);
                    if (jsonObj != null) {
                        if (jsonObj.Table1.length == 0) {
                            AlertMessages("info", '', currentWidget._i18n.NoResultFound);
                            $(".Overlay").fadeOut();
                            return;
                        }
                    }
                    else {
                        $(currentWidget.lblerror).show();
                        $(".Overlay").fadeOut();
                        return;
                    }
                    var BirdTrackingData = [];
                    currentWidget.TrackingData = jsonObj.Table1;
                    if (jsonObj.Table1.length > 0) {
                        currentWidget.DataCount = currentWidget.DataCount + jsonObj.Table1.length;
                        //if (jsonObj.Table1.length > 30000) {
                        //    if (jsonObj.Table1.length == currentWidget.DataCount) {
                        //        currentWidget.DataCount = 0;
                        //    }
                        //    AlertMessages("warning", '', currentWidget._i18n.NoDatafound);
                        //    currentWidget.TblColorHighlight.parentElement.parentElement.parentElement.style.backgroundColor = "rgba(0,0,0,0.0)"
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
                                        topic.publish('RunBird/LayerOn', currentWidget.queryinfo.platformid + "_L_" + currentWidget.queryinfo.type + "_" + YearInfo, currentWidget.queryinfo.platformid + "_P_" + currentWidget.queryinfo.type + "_" + YearInfo, currentWidget.queryinfo.platformid + "_T_" + currentWidget.queryinfo.type + "_" + YearInfo);
                                    }
                                    
                                }
                            }
                        }
                        else {
                            currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObj.Table1, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), "");
                        }
                        currentWidget.checkConditions = true;
                        currentWidget.PlottedPTTIDsCnt++;
                    }
                    currentWidget.pointFeatures = jsonObj;
                    $(".MCPResultBtn").css("display", "block");
                    $(".PointDensitybtn").css("display", "block");
                    $(".MCPFullResultBtn").css("display", "block");
                    $(".Overlay").fadeOut();
                    if (((configOptions.UserInfo.UserRole).toUpperCase() == "STANDARD") || ((configOptions.UserInfo.UserRole).toUpperCase() == "SPONSOR")) {
                        $(".stopoverclass").css("display", "none");
                    }
                    else {
                        $(".stopoverclass").css("display", "block");
                    }
                }
            });
            ChangeElementUsability('#run', true);
            
        },
        getColorCode: function () {
            var makeColorCode = '0123456789ABCDEF';
            var code = '#';
            for (var count = 0; count < 6; count++) {
                code = code + makeColorCode[Math.floor(Math.random() * 16)];
            }
            return code;
        },
        findPointsInExtent: function (extent) {
            var currentWidget = this;
            $(".Overlay").fadeIn();
            var color1 = GlobalCurrentWidget.getColorCode();
            var Outercolorobj = esri.Color.fromHex(color1);
            var Innercolorobj = esri.Color.fromHex(color1);
            Innercolorobj.a = 0.40;
            GlobalCurrentWidget.PolygonID++;
            var defaultSymbol = new esri.symbol.SimpleMarkerSymbol().setColor(new dojo.Color([0, 0, 255]));
            var highlightSymbol = new esri.symbol.SimpleMarkerSymbol().setColor(new dojo.Color([255, 0, 0]));
            var results = [];
            var points = [];
            var selectedFeatureDates = [];
            var p = GlobalCurrentWidget.pointFeatures.Table1;
            GlobalCurrentWidget.results1 = [];
            GlobalCurrentWidget.polygonresults = []
            for (var i = 0; i < p.length; i++) {
                var latX = 0, longY = 0;
                var point = [];
                if (!GlobalCurrentWidget.CheckFloatValue(p[i].LAT.replace(/\s/g, '')) || !GlobalCurrentWidget.CheckFloatValue(p[i].LONG.replace(/\s/g, ''))) {
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
                if (extent.contains(graphic.geometry)) {
                    points.push(point);
                    GlobalCurrentWidget.results1.push(graphic.geometry);
                    selectedFeatureDates.push({ "Dates": p[i].DATE });
                    //selectedFeatureDates.push(p[i].DATE);
                }
            }
            var maDate = new Date(
                Math.max(
                    ...selectedFeatureDates.map(element => {
                        return new Date(element.Dates);
                    }),
                ),
            );
            var miDate = new Date(
                Math.min(
                    ...selectedFeatureDates.map(element => {
                        return new Date(element.Dates);
                    }),
                ),
            );
            var maxDate = maDate.getDate() + "-" + maDate.getMonth() + "-" + maDate.getFullYear();
            var minDate = miDate.getDate() + "-" + miDate.getMonth() + "-" + miDate.getFullYear();

            geometryService = new esri.tasks.GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
            GlobalCurrentWidget.DrawToolBar.deactivate();
            if (GlobalCurrentWidget.results1 == '' || GlobalCurrentWidget.results1 == null) {
                $(".Overlay").fadeOut();
                return;
            }
            geometryService.convexHull(GlobalCurrentWidget.results1, function (result) {
                var currentwidget = this;
                var symbol = null;

                switch (result.type) {

                    case "polygon":
                        GlobalCurrentWidget.polygonresults.push(result)
                        symbol = new esri.symbol.SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Outercolorobj, 2), Innercolorobj);
                        break;
                }
                GlobalCurrentWidget.tempsymbol = symbol;
                GlobalCurrentWidget.polygonresults[0]["attributes"] = GlobalCurrentWidget.MCPAttributes;
                GlobalCurrentWidget.polygonresults[0]["attributes"]['FromDate'] = minDate;
                GlobalCurrentWidget.polygonresults[0]["attributes"]['ToDate'] = maxDate;
                var PolygonGraphic = new esri.Graphic(result, symbol);
                var MCPGraphicLayer = new esri.layers.GraphicsLayer({ id: 'MCPLayer' + GlobalCurrentWidget.PolygonID, className: color1 });
                MCPGraphicLayer.add(PolygonGraphic);
                GlobalCurrentWidget.map.addLayers([MCPGraphicLayer]);
                configOptions.mcpresults.push(GlobalCurrentWidget.polygonresults);
                $(".Overlay").fadeOut();
            }, function (error) {
                console.log("An error occured during convex hull calculation");
                $(".Overlay").fadeOut();
            });
        }

    });
});



