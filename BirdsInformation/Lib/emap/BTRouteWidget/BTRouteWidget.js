define([

    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'esri/layers/LabelLayer',
    'dojo/topic',
    "emap/BTRouteWidget/DirectionalLineSymbol",
    "esri/geometry/geodesicUtils",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane",
    "dojo/text!emap/BTRouteWidget/templates/BTRouteWidget.html",
    "dojo/i18n!emap/BTRouteWidget/nls/Resource",
    "dojo/store/Memory",
    "dojo/Deferred",
    "dojo/_base/array",
    "esri/graphic",
    "esri/renderers/UniqueValueRenderer",
    "dojo/_base/Color",
    "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/tasks/FeatureSet",
    "esri/geometry/Geometry",
    "esri/geometry/Polygon",
    "dojo/data/ObjectStore",
    'dojo/data/ItemFileWriteStore',
    'dgrid/extensions/ColumnHider',
    'xstyle/css!../BTRouteWidget/css/BTRouteWidget.css',
    "dojo/domReady!"


], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, LabelLayer, topic,
    DirectionalLineSymbol1, geodesicUtils, TabContainer, ContentPane, dijitTemplate, i18n, Memory, Deferred, arrayUtils, Graphic, UniqueValueRenderer, Color,
    SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, SimpleRenderer, FeatureSet, Geometry, Polygon, ObjectStore, ItemFileWriteStore, ColumnHider) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

        templateString: dijitTemplate,
        widgetsInTemplate: true,
        _i18n: i18n,
        map: null,
        title: i18n.title,
        domNode: null,
        currentuser: null,
        graphicstyles: null,
        queryinfo: null,
        resultNode: null,
        zipfiles: [],
        table: null,
        layersInfo: [],
        counter: 0,
        LayerIDCounter: 0,
        Featureset: null,
        //currentWidget: null,
        tc: null,
        Migration1Color: null,
        Migration2Color: null,
        Migration3Color: null,
        Migration4Color: null,
        chkseason: false,
        SelectedSensorType: null,
        tempcurrentWidget: null,
        colorsArray: [],
        colorcnt: 0,
        shapefileOptions: {
            'types': {
                'point': 'points',
                'polygon': 'polygons',
                'polyline': 'polylines'
            }
        },
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
            tempcurrentWidget = this;
            var currentWidget = this;
            currentWidget.currentuser = configOptions.UserInfo.UserRole;
            currentWidget.colorcnt = 0;

            currentWidget.colorsArray = [
                "#63b598", "#4ca2f9", "#ce7d78", "#ea9e70", "#a48a9e", "#c6e1e8", "#648177",
                "#0d5ac1", "#f205e6", "#1c0365", "#14a9ad", "#a4e43f", "#d298e2", "#6119d0",
                "#d2737d", "#c0a43c", "#f2510e", "#651be6", "#79806e", "#61da5e", "#75d89e",
                "#9348af", "#01ac53", "#c5a4fb", "#996635", "#b11573", "#4bb473", "#cd2f00",
                "#2f3f94", "#2f7b99", "#da967d", "#34891f", "#b0d87b", "#ca4751", "#7e50a8",
                "#c4d647", "#e0eeb8", "#11dec1", "#289812", "#566ca0", "#ffdbe1", "#2f1179",
                "#935b6d", "#513d98", "#aead3a", "#4b5bdc", "#0cd36d", "#41d158", "#916988",
                "#250662", "#cb5bea", "#228916", "#ac3e1b", "#df514a", "#539397", "#880977",
                "#f697c1", "#ba96ce", "#679c9d", "#c6c42c", "#5d2c52", "#48b41b", "#e1cf3b",
                "#5be4f0", "#a4d17a", "#225b8", "#be608b", "#96b00c", "#088baf", "#57c4d8",
                "#f158bf", "#05d371", "#5426e0", "#802234", "#ee91e3", "#9ab9b7", "#6749e8",
                "#8fb413", "#9e6d71", "#b2b4f0", "#c3c89d", "#c9a941", "#4834d0", "#d36647",
                "#fb21a3", "#51aed9", "#5bb32d", "#807fb", "#21538e", "#89d534", "#0971f0",
                "#7fb411", "#0023b8", "#3b8c2a", "#986b53", "#f50422", "#983f7a", "#ea24a3",
                "#79352c", "#521250", "#c79ed2", "#d6dd92", "#e33e52", "#b2be57", "#fa06ec",
                "#1bb699", "#6b2e5f", "#64820f", "#1c271", "#21538e", "#89d534", "#d36647",
                "#7fb411", "#0023b8", "#3b8c2a", "#986b53", "#f50422", "#983f7a", "#ea24a3",
                "#79352c", "#521250", "#c79ed2", "#d6dd92", "#e33e52", "#b2be57", "#fa06ec",
                "#1bb699", "#6b2e5f", "#64820f", "#e145ba", "#1c271", "#9cb64a", "#996c48",
                "#06e052", "#e3a481", "#0eb621", "#fc458e", "#b2db15", "#aa226d", "#792ed8",
                "#73872a", "#520d3a", "#cefcb8", "#a5b3d9", "#7d1d85", "#c4fd57", "#f1ae16",
                "#8fe22a", "#ef6e3c", "#243eeb", "#1dc18", "#dd93fd", "#3f8473", "#e7dbce",
                "#421f79", "#7a3d93", "#93f2d7", "#9b5c2a", "#15b9ee", "#0f5997", "#635f6d",
                "#cb2582", "#409188", "#911e20", "#1350ce", "#10e5b1", "#fff4d7", "#ce00be",
                "#32d5d6", "#17232", "#608572", "#c79bc2", "#00f87c", "#77772a", "#6995ba",
                "#fc6b57", "#f07815", "#8fd883", "#060e27", "#96e591", "#21d52e", "#d00043",
                "#b47162", "#1ec227", "#4f0f6f", "#947002", "#bde052", "#e08c56", "#1d1d58",
                "#28fcfd", "#bb09b", "#36486a", "#d02e29", "#1ae6db", "#3e464c", "#406df9",
                "#911e7e", "#3f16d9", "#0f525f", "#ac7c0a", "#b4c086", "#c9d730", "#30cc49",
                "#3d6751", "#fb4c03", "#640fc1", "#62c03e", "#d3493a", "#88aa0b", "#a84a8f",
                "#4be47", "#4a543f", "#79bca0", "#a8b8d4", "#00efd4", "#615af0", "#2a3434",
                "#7ad236", "#7260d8", "#1deaa7", "#06f43a", "#823c59", "#e3d94c", "#dc1c06",
                "#b46238", "#2dfff6", "#a82b89", "#1a8011", "#1a806a", "#f53b2a", "#436a9f",
                "#4cf09d", "#c188a2", "#67eb4b", "#b308d3", "#fc7e41", "#af3101", "#ff065",
                "#71b1f4", "#a2f8a5", "#e23dd0", "#d3486d", "#00f7f9", "#474893", "#3cec35",
                "#1c65cb", "#5d1d0c", "#2d7d2a", "#ff3420", "#5cdd87", "#a259a4", "#e4ac44",
                "#de73c2", "#1bede6", "#8798a4", "#d7790f", "#b2c24f", "#d70a9c", "#25b67",
                "#88e9b8", "#c2b0e2", "#86e98f", "#ae90e2", "#1a806b", "#436a9e", "#0ec0ff",
                "#f812b3", "#b17fc9", "#8d6c2f", "#d3277a", "#2ca1ae", "#9685eb", "#8a96c6",
                "#20f6ba", "#dba2e6", "#76fc1b", "#608fa4", "#07d7f6", "#dce77a", "#77ecca"];


            

            topic.subscribe('mapClickMode/DeleteGraphics', lang.hitch(this, function () {

                var tabContainer = this.tc;
                for (var i = tabContainer.getChildren().length; i > 0; i--) {
                    tabContainer.removeChild(tabContainer.getChildren()[0]);
                }
                this.layersInfo = [];
            }));
            $("#QueryResultsTabContainer").empty();
            var div = document.createElement('div');
            div.id = "QueryResultsTabContainer" + counter;
            div.height = "100%";
            div.width = "100%";
            this.counter++;
            $("#QueryResultsTabContainer").append(div);
            $('.dijitTab .tabLabel').eq(1).addClass('active');
            this.tc = new TabContainer({
                style: "height: 100%; width: 100%;"
            }, div.id);
            this.tc.startup();

            //added this code for resize the tabcontainer after click on export excel
            $('#home-tab').on('shown.bs.tab', function (event) {
                var x = $(event.target).text();         // active tab
                var y = $(event.relatedTarget).text();  // previous tab
                currentWidget.tc.resize();
            });

            this.graphicstyles = {
                grlinestyle: null,
                grpointstyle: null,
                grpointrender: null,
                arrowcolor: "#ff0000",
                linecolor: "#ff0000",
                linewidth: "2",
                pointcolor: "#ff0000",
                pointsize: "7",
                labelcolor: "#ff0000",
                fontsize: "10",
                fontname: "Courier"
            }

            $(".esriPopup").on("click", ".deleteFromMap", function () {
                currentWidget.deletePointFromMap();

            });
            $(".esriPopup").on("click", ".deleteFromDatabase", function () {
                currentWidget.deletePoint();
            });




        },

        _onDblClick: function (event) {
            var currentWidget = this;
            console.log(event);
            AlertMessages("success", '', currentWidget._i18n.hello);
        },

        layerInfo: function (id, obj, status, result) {
            this.id = id;
            this.obj = obj;
            this.status = status;
            this.result = result;
        },

        startup: function () {
            var currentWidget = this;

        },

        getColorCode: function () {
            var makeColorCode = '0123456789ABCDEF';
            var code = '#';
            for (var count = 0; count < 6; count++) {
                code = code + makeColorCode[Math.floor(Math.random() * 16)];
            }
            return code;
        },
        roundMe: function (n, sig) {
            if (n === 0) return 0;
            var mult = Math.pow(10, sig - Math.floor(Math.log(n < 0 ? -n : n) / Math.LN10) - 1);
            return Math.round(n * mult) / mult;
        },
        AddFeaturesToMap: function (result, msg, delFeature, queryinfo, BirdTrackingData, type) {

            /*navToolbar.deactivate();*/
            var globalcurrentWidget = this;
            this.queryinfo = queryinfo;
            var points = [];
            var color1 = this.getColorCode();
            var colorobj = esri.Color.fromHex(color1);

            if (typeof (type) != 'undefined') {
                this.queryinfo.type = type;
            }


            if (delFeature != null) {
                this.graphicstyles.grlinestyle = {
                    style: esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                    color: new dojo.Color(delFeatureColors[1]),

                    width: 2,
                    directionStyle: "arrow2",
                    directionPixelBuffer: 200,
                    directionColor: new dojo.Color(delFeatureColors[1]),
                    directionScale: 0.9
                }

                this.graphicstyles.grpointstyle = new SimpleMarkerSymbol({
                    "color": esri.Color.fromHex(delFeatureColors[1]),
                    "size": this.graphicstyles.pointsize,
                    "angle": -30,
                    "xoffset": 0,
                    "yoffset": 0,
                    "type": "esriSMS",
                    "style": "esriSMSCircle"
                });
            }
            else {
                this.graphicstyles.grlinestyle = {
                    style: esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                    color: colorobj,
                    width: 2,
                    directionStyle: "arrow2",
                    directionPixelBuffer: 200,
                    directionColor: colorobj,
                    directionScale: 0.9
                }

                this.graphicstyles.grpointstyle = new SimpleMarkerSymbol({
                    "color": colorobj,
                    "size": this.graphicstyles.pointsize,
                    "angle": -30,
                    "xoffset": 0,
                    "yoffset": 0,
                    "type": "esriSMS",
                    "style": "esriSMSCircle"
                });
            }

            var MigrationType;
            if (result[0].Migration == 1) {
                MigrationType = "WA";
            }
            else if (result[0].Migration == 2) {
                MigrationType = "SM";
            }
            else if (result[0].Migration == 3) {
                MigrationType = "BA";
            }
            else if (result[0].Migration == 4) {
                MigrationType = "AM";
            }
            else {
                MigrationType = "";
            }
            var _lyrline, _lyrpnt, _lyrlbl, _lyranim;
            var layerexists = false;
            var LinelayerId = result[0].PID + "_L_" + MigrationType + "_" + this.queryinfo.type;
            var PointlayerId = result[0].PID + "_P_" + MigrationType + "_" + this.queryinfo.type;
            var TextlayerId = result[0].PID + "_T_" + MigrationType + "_" + this.queryinfo.type;
            var AnImlayerId = result[0].PID + "_A_" + MigrationType + "_" + this.queryinfo.type;

            if (this.map.getLayer(LinelayerId) != null) {
                _lyrline = this.map.getLayer(LinelayerId);
                _lyrpnt = this.map.getLayer(PointlayerId);
                _lyrpnt.setRenderer(this.graphicstyles.grpointstyle);

                _lyrlbl = this.map.getLayer(TextlayerId);
                _lyranim = this.map.getLayer(AnImlayerId);

                _lyrline.clear();
                _lyrpnt.clear();
                _lyrlbl.clear();
                if (this.map.getLayer(_lyrlbl.id).featureLayers[0] != null) {
                    this.map.getLayer(_lyrlbl.id).featureLayers[0].clear();
                }

                layerexists = true;
            }
            else {
                _lyrline = new esri.layers.GraphicsLayer({ id: LinelayerId, className: color1 });
                _lyrpnt = new esri.layers.GraphicsLayer({ id: PointlayerId, className: color1 });
                var renderer = new esri.renderer.UniqueValueRenderer(this.graphicstyles.grpointstyle, "type");
                renderer.addValue("point", this.graphicstyles.grpointstyle);
                _lyrpnt.setRenderer(renderer);
                _lyrlbl = new LabelLayer({ id: TextlayerId, className: color1 });
                _lyranim = new esri.layers.GraphicsLayer({ id: AnImlayerId, className: color1 });


                this.map.addLayers([_lyrline, _lyrpnt, _lyrlbl]);



                dojo.connect(_lyrline, "onClick", function (evt) {
                    var g = evt.graphic;
                    var length = geodesicUtils.geodesicLengths([g.geometry], esri.Units.KILOMETERS);
                    this.map.infoWindow.setContent(currentWidget._i18n.TotalLength + this.roundMe(length, 4) + globalcurrentWidget._i18n.Kilometers);
                    this.map.infoWindow.setTitle(g.getTitle());
                    this.map.infoWindow.show(evt.screenPoint, this.map.getInfoWindowAnchor(evt.screenPoint));
                });
            }
            if (globalcurrentWidget.currentuser == "Admin") {
                dojo.connect(_lyrpnt, "onClick", function (evt) { $(".actionList").html("<a title='Delete From Map' to='' class='action deleteFromMap'  ><span>" + currentWidget._i18n.DeleteFromMap + "</span></a>   <a title='Delete' to='' class='action deleteFromDatabase'  ><span>" + currentWidget._i18n.DeleteFromDatabase + "</span></a>"); });
            }
            else {
                dojo.connect(_lyrpnt, "onClick", function (evt) { $(".actionList").html("<a title='Delete From Map' to='' class='action deleteFromMap'  ></a>  "); });
            }




            var finalresults = [];

            var excecptionX = 0, excecptionY = 0;

            if (delFeature != null) {
                excecptionX = delFeature.geometry.x;
                excecptionY = delFeature.geometry.y;
            }

            for (var i = 0; i < result.length; i++) {

                var point = [];

                if (!this.CheckFloatValue(result[i][this.queryinfo.latfield].replace(/\s/g, '')) || !this.CheckFloatValue(result[i][this.queryinfo.longfield].replace(/\s/g, ''))) {
                    continue;
                }

                if (parseFloat(result[i][this.queryinfo.longfield]) != excecptionX && parseFloat(result[i][this.queryinfo.latfield]) != excecptionY) {
                    point.push(parseFloat(result[i][this.queryinfo.longfield].replace(/\s/g, '')));
                    point.push(parseFloat(result[i][this.queryinfo.latfield].replace(/\s/g, '')));
                    points.push(point);
                    finalresults.push(result[i]);
                    BirdTrackingData.push(result[i]);
                }
            }

            if (!layerexists) {
                var linelayer = new this.layerInfo(_lyrline.id, _lyrline, true, null);
                var pointlayer = new this.layerInfo(_lyrpnt.id, _lyrpnt, true, finalresults);
                var labellayer = new this.layerInfo(_lyrlbl.id, _lyrlbl, true, null);
                var animlayer = new this.layerInfo(_lyrlbl.id, _lyranim, true, null);

                this.layersInfo.push(linelayer);
                this.layersInfo.push(pointlayer);
                this.layersInfo.push(labellayer);
            }
            else {
                if (delFeature != null) {
                    for (var i = 0; i < this.layersInfo.length; i++) {
                        if (this.layersInfo[i].id == delFeature.getLayer().id) {
                            this.layersInfo[i].result = finalresults;
                        }
                    }
                }
                else {
                    for (var i = 0; i < this.layersInfo.length; i++) {
                        if (this.layersInfo[i].id == this.map.getLayer(result[0].PID + "_P_" + MigrationType + "_" + this.queryinfo.type).id) {
                            this.layersInfo[i].result = finalresults;
                        }
                    }
                }

            }

            jsonPoly = {
                "paths": [points],
                "spatialReference": { "wkid": 4326 }
            };

            var drawLineSymbol = new DirectionalLineSymbol1(this.graphicstyles.grlinestyle);

            var polyline = new esri.geometry.Polyline(jsonPoly);
            var defaultrenderer = new esri.renderer.SimpleRenderer(drawLineSymbol);
            var graphic = new esri.Graphic(polyline, drawLineSymbol, {}, null);
            _lyrline.add(graphic);
            _lyrline.setRenderer(defaultrenderer);
            this.CreatePoints(_lyrpnt, finalresults, points, (delFeature == null) ? false : true, colorobj);

            this.CreateLablesForPoints(_lyrlbl, points, finalresults, this.queryinfo.datefield, (delFeature == null) ? false : true, colorobj);
            var globalcurrentWidget = this;
            if (msg != "") {
                /* UpdateToolProgress(msg, true, 5000);*/

            }
            else {
                if (delFeature != null) {
                    /* UpdateToolProgress("Feature Deleted...", true, 5000);*/
                }
                else {
                    /*UpdateToolProgress(points.length + " (" + this.queryinfo.platformid + ") Points Added", true, 5000);*/
                }
            }

            var myFeatureExtent = esri.graphicsExtent(_lyrpnt.graphics);
            this.map.setExtent(myFeatureExtent);
            setTimeout(function () {
                var level = this.map.getLevel();
                this.map.setLevel(level - 1);
            }, 1000);


        },
        AddFeaturesToMapAfterDeletePoint: function (result, delFeature, queryinfo, BirdTrackingData, chkSeasonWise) {
            var globalcurrentWidget = this;
            globalcurrentWidget.chkseason = chkSeasonWise;
            this.queryinfo = queryinfo;
            var points = [];
            // clearPointDensityLayer();
            var className;
            var M1Color = "";
            var M2Color = "";
            var M3Color = "";
            var M4Color = "";
            var finalresults = [];

            var excecptionX = delFeature.geometry.x;
            var excecptionY = delFeature.geometry.y;
            for (var i = 0; i < result.length; i++) {
                var point = [];
                if (!this.CheckFloatValue(result[i][this.queryinfo.latfield].replace(/\s/g, '')) || !this.CheckFloatValue(result[i][this.queryinfo.longfield].replace(/\s/g, ''))) {
                    continue;
                }
                if (parseFloat(result[i][this.queryinfo.longfield]) != excecptionX && parseFloat(result[i][this.queryinfo.latfield]) != excecptionY) {
                    point.push(parseFloat(result[i][this.queryinfo.longfield].replace(/\s/g, '')));
                    point.push(parseFloat(result[i][this.queryinfo.latfield].replace(/\s/g, '')));

                    points.push(point);

                    M1Color = globalcurrentWidget.Migration1Color;
                    M2Color = globalcurrentWidget.Migration2Color;
                    M3Color = globalcurrentWidget.Migration3Color;
                    M4Color = globalcurrentWidget.Migration4Color;


                    finalresults.push(result[i]);
                    BirdTrackingData.push(result[i]);
                }
            }
            if (chkSeasonWise == true) {
                if (M1Color != "") {
                    className = M1Color + "_";
                }
                if (M2Color != "") {
                    className += M2Color + "_";
                }
                if (M3Color != "") {
                    className += M3Color + "_";
                }
                if (M4Color != "") {
                    className += M4Color + "_";
                }
            }
            else {
                className = globalcurrentWidget.Migration1Color;
            }


            if (typeof (type) != 'undefined') {
                this.queryinfo.type = type;
            }

            var _lyrline, _lyrpnt, _lyrlbl, _lyranim;
            var layerexists = false;

            var LinelayerId = result[0].PID + "_L_" + this.queryinfo.type;
            var PointlayerId = result[0].PID + "_P_" + this.queryinfo.type;
            var TextlayerId = result[0].PID + "_T_" + this.queryinfo.type;
            var AnImlayerId = result[0].PID + "_A_" + this.queryinfo.type;

            if (this.map.getLayer(LinelayerId) != null) {
                _lyrline = this.map.getLayer(LinelayerId);
                _lyrpnt = this.map.getLayer(PointlayerId);
                _lyrlbl = this.map.getLayer(TextlayerId);
                _lyranim = this.map.getLayer(AnImlayerId);

                _lyrline.clear();
                _lyrpnt.clear();
                _lyrlbl.clear();
                for (var k = 0; k < this.map.getLayer(_lyrlbl.id).featureLayers.length; k++) {
                    if (this.map.getLayer(_lyrlbl.id).featureLayers[k] != null) {
                        this.map.getLayer(_lyrlbl.id).featureLayers[k].clear();
                    }
                }
                _lyrline.className = className;
                _lyrpnt.className = className;
                _lyrlbl.className = className;
                topic.publish('routing/LayerUpdate', LinelayerId, PointlayerId, TextlayerId, className);

                layerexists = true;


                // to remove the feature layers of Point layer and text layer if exists
                var layersInfo = this.map.graphicsLayerIds;
                for (var i = layersInfo.length - 1; i >= 0; i--) {
                    var layer = map.getLayer(layersInfo[i]);
                    if (layer != null) {
                        if (typeof (layer.id) != "undefined") {
                            if (layer.id == "Feature_" + PointlayerId || layer.id == "LabelFeature_" + TextlayerId || layer.id == PointlayerId) {
                                this.map.removeLayer(layer);
                            }
                        }
                    }
                }
            }

            _lyrpnt = new esri.layers.GraphicsLayer({ id: PointlayerId, className: className });

            dojo.connect(_lyrline, "onClick", function (evt) { $(".actionList").html("") });
            if (globalcurrentWidget.currentuser == "Admin") {
                dojo.connect(_lyrpnt, "onClick", function (evt) { $(".actionList").html("<a title='Delete From Map' to='' class='action deleteFromMap'  ><span>" + currentWidget._i18n.DeleteFromMap + "</span></a>   <a title='Delete' to='' class='action deleteFromDatabase'  ><span>" + currentWidget._i18n.DeleteFromDatabase + "</span></a>"); });
            }
            else {
                dojo.connect(_lyrpnt, "onClick", function (evt) { $(".actionList").html("<a title='Delete From Map' to='' class='action deleteFromMap'  ></a>  "); });
            }


            for (var i = 0; i < this.layersInfo.length; i++) {
                if (this.layersInfo[i].id == delFeature.getLayer().id) {
                    this.layersInfo[i].result = finalresults;
                }
            }


            this.AddDataToTable(this.queryinfo.type, finalresults);
            if (finalresults.length == 0) {
                return;
            }
            this.CreatePoints1(_lyrpnt, points, finalresults, (delFeature == null) ? false : true, chkSeasonWise, PointlayerId, className);
            this.CreateLablesForPoints1(_lyrlbl, points, finalresults, this.queryinfo.datefield, (delFeature == null) ? false : true, TextlayerId, chkSeasonWise);

            this.CreateLines(_lyrline, points, finalresults, this.queryinfo.datefield, (delFeature == null) ? false : true);

            this.map.addLayers([_lyrpnt]);

            var myFeatureExtent = esri.graphicsExtent(_lyrpnt.graphics);
            this.map.setExtent(myFeatureExtent);
            setTimeout(function () {
                var level = this.map.getLevel();
                this.map.setLevel(level - 1);
            }, 1000);
        },
        AddFeaturesToMap1: function (result, msg, delFeature, queryinfo, BirdTrackingData, chkSeasonWise, YearInfo) {
            var globalcurrentWidget = this;
            globalcurrentWidget.chkseason = chkSeasonWise;
            this.queryinfo = queryinfo;
            var points = [];
            // clearPointDensityLayer();
            var className = "";
            var M1Color = "";
            var M2Color = "";
            var M3Color = "";
            var M4Color = "";
            var finalresults = [];
            if (delFeature == null) {
                if (chkSeasonWise == true) {
                    globalcurrentWidget.Migration1Color = this.getColorCode();
                    globalcurrentWidget.Migration2Color = this.getColorCode();
                    globalcurrentWidget.Migration3Color = this.getColorCode();
                    globalcurrentWidget.Migration4Color = this.getColorCode();
                }
                else {
                    var color1 = this.getColorCode();
                    globalcurrentWidget.Migration1Color = color1;
                    globalcurrentWidget.Migration2Color = color1;
                    globalcurrentWidget.Migration3Color = color1;
                    globalcurrentWidget.Migration4Color = color1;
                }
            }

            var excecptionX = 0, excecptionY = 0;

            if (delFeature != null) {
                excecptionX = delFeature.geometry.x;
                excecptionY = delFeature.geometry.y;
            }
            for (var i = 0; i < result.length; i++) {
                var point = [];
                if (!this.CheckFloatValue(result[i][this.queryinfo.latfield].replace(/\s/g, '')) || !this.CheckFloatValue(result[i][this.queryinfo.longfield].replace(/\s/g, ''))) {
                    continue;
                }
                if (parseFloat(result[i][this.queryinfo.longfield]) != excecptionX && parseFloat(result[i][this.queryinfo.latfield]) != excecptionY) {
                    point.push(parseFloat(result[i][this.queryinfo.longfield].replace(/\s/g, '')));
                    point.push(parseFloat(result[i][this.queryinfo.latfield].replace(/\s/g, '')));

                    points.push(point);
                    if (delFeature == null) {
                        if (result[i].Migration == "1" || result[i].Migration == null) {
                            result[i]["ColorObj"] = new Color(globalcurrentWidget.Migration1Color);
                            M1Color = globalcurrentWidget.Migration1Color;
                        }
                        else if (result[i].Migration == "2") {
                            result[i]["ColorObj"] = new Color(globalcurrentWidget.Migration2Color);
                            M2Color = globalcurrentWidget.Migration2Color;
                        }
                        else if (result[i].Migration == "3") {
                            result[i]["ColorObj"] = new Color(globalcurrentWidget.Migration3Color);
                            M3Color = globalcurrentWidget.Migration3Color;
                        }
                        else if (result[i].Migration == "4") {
                            result[i]["ColorObj"] = new Color(globalcurrentWidget.Migration4Color);
                            M4Color = globalcurrentWidget.Migration4Color;
                        }
                    }
                    else {
                        M1Color = globalcurrentWidget.Migration1Color;
                        M2Color = globalcurrentWidget.Migration2Color;
                        M3Color = globalcurrentWidget.Migration3Color;
                        M4Color = globalcurrentWidget.Migration4Color;
                    }

                    finalresults.push(result[i]);
                    BirdTrackingData.push(result[i]);
                }
            }
            if (chkSeasonWise == true) {
                if (M1Color != "") {
                    className = M1Color + "_";
                }
                if (M2Color != "") {
                    className += M2Color + "_";
                }
                if (M3Color != "") {
                    className += M3Color + "_";
                }
                if (M4Color != "") {
                    className += M4Color + "_";
                }
            }
            else {
                className = globalcurrentWidget.Migration1Color;
            }


            if (typeof (type) != 'undefined') {
                this.queryinfo.type = type;
            }

            var _lyrline, _lyrpnt, _lyrlbl, _lyranim;
            var layerexists = false;
            if (YearInfo != "") {
                var LinelayerId = result[0].PID + "_L_" + this.queryinfo.type + "_" + YearInfo;
                var PointlayerId = result[0].PID + "_P_" + this.queryinfo.type + "_" + YearInfo;
                var TextlayerId = result[0].PID + "_T_" + this.queryinfo.type + "_" + YearInfo;
                var AnImlayerId = result[0].PID + "_A_" + this.queryinfo.type + "_" + YearInfo;
            }
            else {
                var LinelayerId = result[0].PID + "_L_" + this.queryinfo.type;
                var PointlayerId = result[0].PID + "_P_" + this.queryinfo.type;
                var TextlayerId = result[0].PID + "_T_" + this.queryinfo.type;
                var AnImlayerId = result[0].PID + "_A_" + this.queryinfo.type;
            }

            if (this.map.getLayer(LinelayerId) != null) {
                _lyrline = this.map.getLayer(LinelayerId);
                _lyrpnt = this.map.getLayer(PointlayerId);
                _lyrlbl = this.map.getLayer(TextlayerId);
                _lyranim = this.map.getLayer(AnImlayerId);

                _lyrline.clear();
                _lyrpnt.clear();
                _lyrlbl.clear();
                for (var k = 0; k < this.map.getLayer(_lyrlbl.id).featureLayers.length; k++) {
                    if (this.map.getLayer(_lyrlbl.id).featureLayers[k] != null) {
                        this.map.getLayer(_lyrlbl.id).featureLayers[k].clear();
                    }
                }
                _lyrline.className = className;
                _lyrpnt.className = className;
                _lyrlbl.className = className;
                topic.publish('routing/LayerUpdate', LinelayerId, PointlayerId, TextlayerId, className);

                layerexists = true;


                // to remove the feature layers of Point layer and text layer if exists
                var lyrInfo = this.map.graphicsLayerIds;
                for (var i = lyrInfo.length - 1; i >= 0; i--) {
                    var layer = map.getLayer(lyrInfo[i]);
                    if (layer != null) {
                        if (typeof (layer.id) != "undefined") {
                            if (layer.id == "Feature_" + PointlayerId || layer.id == "LabelFeature_" + TextlayerId || layer.id == PointlayerId) {
                                this.map.removeLayer(layer);
                            }
                        }
                    }
                }
            }
            else {
                _lyrline = new esri.layers.GraphicsLayer({ id: LinelayerId, className: className });
                _lyrlbl = new LabelLayer({ id: TextlayerId, className: className });
                _lyranim = new esri.layers.GraphicsLayer({ id: AnImlayerId, className: className });

                this.map.addLayers([_lyrline, _lyrlbl]);
                dojo.connect(_lyrline, "onClick", function (evt) {
                    var g = evt.graphic;
                    var length = geodesicUtils.geodesicLengths([g.geometry], esri.Units.KILOMETERS);
                    globalcurrentWidget.map.infoWindow.setContent(globalcurrentWidget._i18n.TotalLength + globalcurrentWidget.roundMe(length, 4) + " " + globalcurrentWidget._i18n.Kilometers);
                    globalcurrentWidget.map.infoWindow.setTitle(g.getTitle());
                    globalcurrentWidget.map.infoWindow.show(evt.screenPoint, globalcurrentWidget.map.getInfoWindowAnchor(evt.screenPoint));
                });
            }
            _lyrpnt = new esri.layers.GraphicsLayer({ id: PointlayerId, className: className });

            dojo.connect(_lyrline, "onClick", function (evt) { $(".actionList").html("") });
            if (globalcurrentWidget.currentuser == "Admin") {
                dojo.connect(_lyrpnt, "onClick", function (evt) { $(".actionList").html("<a title='Delete From Map' to='' class='action deleteFromMap'  ><span>" + currentWidget._i18n.DeleteFromMap + "</span></a>   <a title='Delete' to='' class='action deleteFromDatabase'  ><span>" + currentWidget._i18n.DeleteFromDatabase + "</span></a>"); });
            }
            else {
                dojo.connect(_lyrpnt, "onClick", function (evt) { $(".actionList").html("<a title='Delete From Map' to='' class='action deleteFromMap'  ></a>  "); });
            }
            if (!layerexists) {
                var linelayer = new this.layerInfo(_lyrline.id, _lyrline, true, null);
                var pointlayer = new this.layerInfo(_lyrpnt.id, _lyrpnt, true, finalresults);
                var labellayer = new this.layerInfo(_lyrlbl.id, _lyrlbl, true, null);
                var animlayer = new this.layerInfo(_lyrlbl.id, _lyranim, true, null);

                this.layersInfo.push(linelayer);
                this.layersInfo.push(pointlayer);
                this.layersInfo.push(labellayer);
            }
            else {
                if (delFeature != null) {
                    for (var i = 0; i < this.layersInfo.length; i++) {
                        if (this.layersInfo[i].id == delFeature.getLayer().id) {
                            this.layersInfo[i].result = finalresults;
                        }
                    }
                }
                else {
                }

            }
            if (YearInfo != "") {
                var PTTIDType = this.queryinfo.type + "_" + YearInfo;
            }
            else {
                var PTTIDType = this.queryinfo.type;
            }
            this.AddDataToTable(PTTIDType, finalresults);
            if (finalresults.length == 0) {
                return;
            }
            this.CreatePoints1(_lyrpnt, points, finalresults, (delFeature == null) ? false : true, chkSeasonWise, PointlayerId, "");
            this.CreateLablesForPoints1(_lyrlbl, points, finalresults, this.queryinfo.datefield, (delFeature == null) ? false : true, TextlayerId, chkSeasonWise);

            this.CreateLines(_lyrline, points, finalresults, this.queryinfo.datefield, (delFeature == null) ? false : true);

            this.map.addLayers([_lyrpnt]);
            if (delFeature == null) {
                if (YearInfo != "") {
                    for (var i = 0; i < this.layersInfo.length; i++) {
                        if (this.layersInfo[i].id == this.map.getLayer(result[0].PID + "_P_" + this.queryinfo.type + "_" + YearInfo).id) {
                            this.layersInfo[i].result = finalresults;
                            this.layersInfo[i].obj = _lyrpnt;
                        }
                    }
                }
                else {
                    for (var i = 0; i < this.layersInfo.length; i++) {
                        if (this.layersInfo[i].id == this.map.getLayer(result[0].PID + "_P_" + this.queryinfo.type).id) {
                            this.layersInfo[i].result = finalresults;
                            this.layersInfo[i].obj = _lyrpnt;
                        }
                    }
                }
            }
            var myFeatureExtent = esri.graphicsExtent(_lyrpnt.graphics).expand(1.5);
            this.map.setExtent(myFeatureExtent);
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
        CreatePoints: function (layer, results, points, delfeaures, colorobj) {
            var testgrpointstyle;
            if (delfeaures == true) {
                testgrpointstyle = new SimpleMarkerSymbol({
                    "color": esri.Color.fromHex(delFeatureColors[1]),
                    "size": 7,
                    "angle": -30,
                    "xoffset": 0,
                    "yoffset": 0,
                    "type": "esriSMS",
                    "style": "esriSMSCircle"
                });

            }
            else {
                testgrpointstyle = new SimpleMarkerSymbol({
                    /* "color": esri.Color.fromHex(colorslist[colorIndex]),*/
                    "color": colorobj,
                    "size": 7,
                    "angle": -30,
                    "xoffset": 0,
                    "yoffset": 0,
                    "type": "esriSMS",
                    "style": "esriSMSCircle"
                });
            }

            for (var i = 0; i < points.length; i++) {
                var pt = new esri.geometry.Point(points[i], new esri.SpatialReference({ wkid: 4326 }));
                var newObject = jQuery.extend(true, {}, results[i]);
                delete newObject.gap;
                var template = this.CreateTemplate(newObject);
                var infoTemplate = new esri.InfoTemplate(template);
                var graphic = new esri.Graphic(pt, testgrpointstyle, newObject, infoTemplate);
                graphic.attributes.DATE = this.GetFormatedDate(graphic.attributes.DATE.split("T")[0]);
                graphic.attributes.TIME = graphic.attributes.TIME.split("T")[1];

                layer.add(graphic);
            }

        },
        createPointGraphic: function (ColorObj) {
            var testgrpointstyle = new SimpleMarkerSymbol({
                "color": ColorObj,
                "size": 7,
                "angle": -30,
                "xoffset": 0,
                "yoffset": 0,
                "type": "esriSMS",
                "style": "esriSMSCircle"
            });
            return testgrpointstyle;
        },
        CreatePoints1: function (layer, results, attribs, delfeaures, chkSeasonWise, PointlayerId, className) {
            var currentWidget = this;
            if (attribs.length == 0) {
                return;
            }
            var testgrpointstyle;
            testgrpointstyle = currentWidget.createPointGraphic(attribs[0].ColorObj);
            //if (delfeaures == true) {
            //    testgrpointstyle = currentWidget.createPointGraphic(esri.Color.fromHex(delFeatureColors[1]));
            //}
            //else {
            //    testgrpointstyle = currentWidget.createPointGraphic(attribs[0].ColorObj);
            //}
            var features = [];
            var items = [
                [1, null],
                [2, null],
                [3, null],
                [4, null]
            ];
            for (var i = 0; i < results.length; i++) {
                var feature = {
                    "attributes": {
                        "OBJECTID": i + 1,
                        "Migration": attribs[i].Migration,
                    },
                    "geometry": {
                        "x": results[i][0],
                        "y": results[i][1]
                    }
                }
                features.push(feature);
                if (attribs[i].Migration == "1" || attribs[i].Migration == null) {
                    items[0][1] = attribs[i].ColorObj;
                }
                else if (attribs[i].Migration == "2")
                    items[1][1] = attribs[i].ColorObj;
                else if (attribs[i].Migration == "3")
                    items[2][1] = attribs[i].ColorObj;
                else if (attribs[i].Migration == "4")
                    items[3][1] = attribs[i].ColorObj;
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
                    {
                        "name": "Migration",
                        "type": "esriFieldTypeString",
                        "alias": "Migration",
                        "length": 255
                    }
                ],
                "features": features
            };

            var fs = new esri.tasks.FeatureSet(jsonFS);

            var featureCollection = {
                layerDefinition: {
                    "name": "PointLayer" + attribs[0].PID,
                    "geometryType": "esriGeometryPoint",
                    "fields": [
                        {
                            "name": "OBJECTID",
                            "type": "esriFieldTypeOID"
                        },
                        {
                            "name": "Migration",
                            "type": "esriFieldTypeString"
                        }
                    ]
                },
                featureSet: fs
            };

            PointfeatureLayer = new esri.layers.FeatureLayer(featureCollection, {
                id: "Feature_" + PointlayerId,
                mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
            });

            if (chkSeasonWise == true) {
                var renderer = new UniqueValueRenderer(testgrpointstyle, "Migration");
                renderer.addValue({
                    value: "NULL",
                    symbol: currentWidget.createPointGraphic(items[0][1]),
                    label: currentWidget._i18n.NoMigration,
                });
                renderer.addValue({
                    value: "1",
                    symbol: currentWidget.createPointGraphic(items[0][1]),
                    label: currentWidget._i18n.WinterDuration,
                });
                renderer.addValue({
                    value: "2",
                    symbol: currentWidget.createPointGraphic(items[1][1]),
                    label: currentWidget._i18n.SpringMigration,
                });
                renderer.addValue({
                    value: "3",
                    symbol: currentWidget.createPointGraphic(items[2][1]),
                    label: currentWidget._i18n.BreedingDuration,
                });
                renderer.addValue({
                    value: "4",
                    symbol: currentWidget.createPointGraphic(items[3][1]),
                    label: currentWidget._i18n.AutumnMigration,
                });
            }
            else {
                var renderer = new esri.renderer.SimpleRenderer(testgrpointstyle);
            }

            PointfeatureLayer.setRenderer(renderer);

            var Birdid = attribs[0].PID;
            var TLayer = currentWidget.map.addLayer(PointfeatureLayer);
            TLayer.arcgisProps = { title: Birdid };
            for (var i = 0; i < results.length; i++) {
                var testgrpointstyle1;
                testgrpointstyle1 = currentWidget.createPointGraphic(attribs[i].ColorObj);
                //if (delfeaures == true) {
                //    testgrpointstyle1 = currentWidget.createPointGraphic(esri.Color.fromHex(delFeatureColors[1]));
                //}
                //else {
                //    testgrpointstyle1 = currentWidget.createPointGraphic(attribs[i].ColorObj);
                //}
                var pt = new esri.geometry.Point(results[i], new esri.SpatialReference({ wkid: 4326 }));
                var newObject = jQuery.extend(true, {}, attribs[i]);
                delete newObject.gap;
                var template = this.CreateTemplate(newObject);
                var infoTemplate = new esri.InfoTemplate(template);
                var graphic = new esri.Graphic(pt, testgrpointstyle1, newObject, infoTemplate);
                graphic.attributes.DATE = this.GetFormatedDate(graphic.attributes.DATE.split("T")[0]);
                graphic.attributes.TIME = graphic.attributes.TIME.split("T")[1];

                layer.add(graphic);
            }

        },
        CreatePoints2: function (layer, results, points, delfeaures) {

            var currentWidget = this;
            var testgrpointstyle;

            for (var i = 0; i < points.length; i++) {
                testgrpointstyle = currentWidget.createPointGraphic(results[i].ColorObj);
                var pt = new esri.geometry.Point(points[i], new esri.SpatialReference({ wkid: 4326 }));
                var newObject = jQuery.extend(true, {}, results[i]);
                delete newObject.gap;
                var template = this.CreateTemplate(newObject);
                var infoTemplate = new esri.InfoTemplate(template);
                var graphic = new esri.Graphic(pt, testgrpointstyle, newObject, infoTemplate);
                graphic.attributes.DATE = this.GetFormatedDate(graphic.attributes.DATE.split("T")[0]);
                graphic.attributes.TIME = graphic.attributes.TIME.split("T")[1];

                layer.add(graphic);

            }

        },
        CreateTemplate: function (results) {

            var table = "<table style='font-size:12px;'>";

            $.each(results, function (key, value) {
                if (configOptions.UserInfo.UserRole == "Admin") {
                    if (key != "ColorObj") {
                        if (key == "Migration") {
                            if (value == null) {
                                table += "<tr><td>" + key + "</td> <td><b>:</b></td><td><bdi> NA</bdi></td><tr>";
                            }
                            if (value == 1) {
                                table += "<tr><td>" + key + "</td> <td><b>:</b></td><td><bdi> Wintering Duration</bdi></td><tr>";
                            }
                            else if (value == 2) {
                                table += "<tr><td>" + key + "</td> <td><b>:</b></td><td><bdi> Spring Migration </bdi></td><tr>";
                            }
                            else if (value == 3) {
                                table += "<tr><td>" + key + "</td> <td><b>:</b></td><td><bdi> Summering Duration </bdi></td><tr>";
                            }
                            else if (value == 4) {
                                table += "<tr><td>" + key + "</td> <td><b>:</b></td><td><bdi> Autumn Migration </bdi></td><tr>";
                            }

                        }
                        else {
                            table += "<tr><td>" + key + "</td> <td><b>:</b></td><td><bdi> ${" + key + "}</bdi></td><tr>";
                        }
                    }
                }
                else {
                    if (key == "PID" || key == "DATE" || key == "TIME" || key == "LAT" || key == "LONG" || key == "CLASS" || key == "Migration") {
                        if (key == "Migration") {
                            if (value == null) {
                                table += "<tr><td>" + key + "</td> <td><b>:</b></td><td><bdi> NA</bdi></td><tr>";
                            }
                            else if (value == 1) {
                                table += "<tr><td>" + key + "</td> <td><b>:</b></td><td><bdi> Wintering Duration</bdi></td><tr>";
                            }
                            else if (value == 2) {
                                table += "<tr><td>" + key + "</td> <td><b>:</b></td><td><bdi> Spring Migration </bdi></td><tr>";
                            }
                            else if (value == 3) {
                                table += "<tr><td>" + key + "</td> <td><b>:</b></td><td><bdi> Summering Duration </bdi></td><tr>";
                            }
                            else if (value == 4) {
                                table += "<tr><td>" + key + "</td> <td><b>:</b></td><td><bdi> Autumn Migration </bdi></td><tr>";
                            }

                        }
                        else {
                            table += "<tr><td>" + key + "</td> <td><b>:</b></td><td><bdi> ${" + key + "}</bdi></td><tr>";
                        }
                    }
                }
            });
            table += "</table>"

            return { title: "${PLATFORMID}", content: table };
        },
        GetFormatedDate: function (val) {
            var spltvals = val.split("-");
            return spltvals[2] + "-" + spltvals[1] + "-" + spltvals[0];
        },
        GetFormatedDateForLabel: function (val) {
            var spltvals = val.split("-");
            return spltvals[2] + "/" + spltvals[1] + "/" + spltvals[0].substring(2, 4);
        },
        CreateLablesForPoints: function (layer, results, attribs, type, delFeaures, colorobj) {
            var globalcurrentWidget = this;
            var geometrys = [];
            graphislables = [];


            var font = new esri.symbol.Font();
            font.setSize("10pt");
            font.setWeight(esri.symbol.Font.WEIGHT_BOLDER);
            font.setFamily("Verdana");
            var textSymbol = new esri.symbol.TextSymbol();
            textSymbol.setFont(font);
            if (delFeaures == true) {
                textSymbol.setColor(esri.Color.fromHex(delFeatureColors[1]));
            }
            else {
                textSymbol.setColor(colorobj);
            }
            textSymbol.setAlign(esri.symbol.Font.ALIGN_MIDDLE);
            var labelRenderer = new esri.renderer.SimpleRenderer(textSymbol);
            var features = [];
            for (var i = 0; i < results.length; i++) {
                var feataure = {
                    "attributes": {
                        "OBJECTID": i + 1,
                        "Date": this.GetFormatedDateForLabel(attribs[i][type].split("T")[0])
                    },
                    "geometry": {
                        "x": results[i][0],
                        "y": results[i][1]
                    }
                }

                features.push(feataure);
                graphislables.push(feataure);
            }
            var jsonFS = {
                "displayFieldName": "Date",
                "fieldAliases": {
                    "Date": "Date"
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

                    {
                        "name": "Date",
                        "type": "esriFieldTypeString",
                        "alias": "Date",
                        "length": 255
                    }],
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
                        {
                            "name": "Date",
                            "type": "esriFieldTypeString"
                        }
                    ]
                },
                featureSet: fs
            };

            featureLayerLables = new esri.layers.FeatureLayer(featureCollection, {
                mode: esri.layers.FeatureLayer.MODE_ONDEMAND
            });

            layer.addFeatureLayer(featureLayerLables, labelRenderer, '{Date}');
            var TLayer = globalcurrentWidget.map.addLayer(featureLayerLables, 0);

            featureLayerLables.setOpacity(0.01);

        },
        CreateLablesForPoints1: function (layer, results, attribs, type, delFeaures, TextlayerId, chkSeasonWise) {
            var globalcurrentWidget = this;

            graphislables = [];
            if (attribs.length == 0) {
                return;
            }
            var textSymbol;
            textSymbol = globalcurrentWidget.createTextSymbol(attribs[0].ColorObj);
            //if (delFeaures == true) {
            //    textSymbol = globalcurrentWidget.createTextSymbol(esri.Color.fromHex(delFeatureColors[2]))
            //}
            //else {
            //    textSymbol = globalcurrentWidget.createTextSymbol(attribs[0].ColorObj);
            //}

            var features = [];
            var items = [
                [1, null],
                [2, null],
                [3, null],
                [4, null]
            ];
            for (var i = 0; i < results.length; i++) {

                var feataure = {
                    "attributes": {
                        "OBJECTID": i + 1,
                        "Date": this.GetFormatedDateForLabel(attribs[i][type].split("T")[0]),
                        "Migration": attribs[i].Migration,

                    },
                    "geometry": {
                        "x": results[i][0],
                        "y": results[i][1]
                    }
                }

                features.push(feataure);
                graphislables.push(feataure);
                if (attribs[i].Migration == "1" || attribs[i].Migration == null) {
                    items[0][1] = attribs[i].ColorObj;
                }
                else if (attribs[i].Migration == "2")
                    items[1][1] = attribs[i].ColorObj;
                else if (attribs[i].Migration == "3")
                    items[2][1] = attribs[i].ColorObj;
                else if (attribs[i].Migration == "4")
                    items[3][1] = attribs[i].ColorObj;
            }


            var jsonFS = {
                "displayFieldName": "Date",
                "fieldAliases": {
                    "Date": "Date"
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

                    {
                        "name": "Date",
                        "type": "esriFieldTypeString",
                        "alias": "Date",
                        "length": 255
                    },
                    {
                        "name": "Migration",
                        "type": "esriFieldTypeString",
                        "alias": "Migration",
                        "length": 255
                    }
                ],
                "features": features
            };

            var fs = new esri.tasks.FeatureSet(jsonFS);

            var featureCollection = {
                layerDefinition: {
                    "name": "Text Layer",
                    "geometryType": "esriGeometryPoint",
                    "fields": [
                        {
                            "name": "OBJECTID",
                            "type": "esriFieldTypeOID"
                        },
                        {
                            "name": "Date",
                            "type": "esriFieldTypeString"
                        },
                        {
                            "name": "Migration",
                            "type": "esriFieldTypeString"
                        }
                    ]
                },
                featureSet: fs
            };

            featureLayerLables = new esri.layers.FeatureLayer(featureCollection, {
                id: "LabelFeature_" + TextlayerId,
                mode: esri.layers.FeatureLayer.MODE_ONDEMAND
            });


            if (chkSeasonWise == true) {
                var renderer = new UniqueValueRenderer(textSymbol, "Migration");
                renderer.addValue({
                    value: "NULL",
                    symbol: globalcurrentWidget.createTextSymbol(items[0][1]),
                });
                renderer.addValue({
                    value: "1",
                    symbol: globalcurrentWidget.createTextSymbol(items[0][1]),
                });
                renderer.addValue({
                    value: "2",
                    symbol: globalcurrentWidget.createTextSymbol(items[1][1]),
                });
                renderer.addValue({
                    value: "3",
                    symbol: globalcurrentWidget.createTextSymbol(items[2][1]),
                });
                renderer.addValue({
                    value: "4",
                    symbol: globalcurrentWidget.createTextSymbol(items[3][1]),
                });
            }
            else {
                var renderer = new esri.renderer.SimpleRenderer(textSymbol);
            }

            featureLayerLables.setRenderer(renderer);
            layer.addFeatureLayer(featureLayerLables, renderer, '{Date}');
            globalcurrentWidget.map.addLayer(featureLayerLables, 0);
            featureLayerLables.setOpacity(0.01);

        },
        createTextSymbol: function (ColorObj) {
            var font = new esri.symbol.Font();
            font.setSize("9pt");
            font.setWeight(esri.symbol.Font.WEIGHT_BOLDER);
            font.setFamily("Open Sans");
            var textSymbol = new esri.symbol.TextSymbol();
            textSymbol.setFont(font);
            textSymbol.setColor(ColorObj);
            textSymbol.setAlign(esri.symbol.Font.ALIGN_MIDDLE);
            return textSymbol;
        },
        createLineSymbol: function (ColorObj) {
            var linesymbol = new esri.symbol.SimpleLineSymbol();
            linesymbol.setColor(ColorObj);
            return linesymbol;
        },
        CreateLines: function (layer, results, attribs, type, delFeaures) {
            var globalcurrentWidget = this;
            var geometries = [];
            var migrationcolor;
            //graphislables = [];
            var migrationvalue = 1;
            var features = [];
            var StageCounter = 1;
            var laststageLat = "";
            var laststageLong = "";
            for (var i = 0; i < results.length; i++) {

                if (i == 0) migrationvalue = attribs[i].Migration;
                //if (i == 490) {
                //    console.log(attribs[i].Migration);
                //}
                var geom = [];
                if (attribs[i].Migration == migrationvalue) {
                    geom.push(results[i][0]);
                    geom.push(results[i][1]);
                    geometries.push(geom);
                    migrationcolor = attribs[i].ColorObj;
                }
                else {
                    laststageLat = results[i - 1][0];
                    laststageLong = results[i - 1][1];
                    //geometries.pop();
                    geom.push(results[i][0]);
                    geom.push(results[i][1]);
                    if (attribs[i].Migration == 1 || attribs[i].Migration == 3) {
                        geometries.push(geom);
                    }
                    var PathsData = [];
                    PathsData.push(geometries);
                    var feataure = {
                        "attributes": {
                            "OBJECTID": StageCounter++,
                            "migration": migrationvalue,
                            "Colorobj": migrationcolor,
                        },
                        "geometry": {
                            "paths": PathsData,

                        }
                    }
                    features.push(feataure);

                    migrationvalue = attribs[i].Migration; // update migration value on change
                    geometries = [];
                    if (attribs[i].Migration == 2 || attribs[i].Migration == 4) {
                        var geomtemp = [];
                        geomtemp.push(laststageLat);
                        geomtemp.push(laststageLong);
                        geometries.push(geomtemp);
                    }
                    geometries.push(geom); // in the new array first point after stage change
                }

            }

            // logic for the last stage
            if (geometries.length > 0) {
                var PathsData = [];
                PathsData.push(geometries);

                migrationvalue = migrationvalue;
                var feataure = {
                    "attributes": {
                        "OBJECTID": StageCounter++,
                        "migration": migrationvalue,
                        "Colorobj": migrationcolor,
                    },
                    "geometry": {
                        "paths": PathsData,
                    }
                }
                features.push(feataure);
            }

            var migrationvaluetemp = features[0].attributes.migration;
            for (var i = 0; i < features.length; i++) {

                jsonPoly = {
                    "paths": features[i].geometry.paths,
                    "spatialReference": { "wkid": 4326 },
                    "attributes": {
                        "OBJECTID": StageCounter++,
                        "migration": features[i].attributes.migration,
                    },
                };
                var drawLineSymbol;

                var drawLineSymbol = new DirectionalLineSymbol1(globalcurrentWidget.createDirectionSymbol(features[i].attributes.Colorobj));

                var polyline = new esri.geometry.Polyline(jsonPoly);
                var defaultrenderer = new esri.renderer.SimpleRenderer(drawLineSymbol);
                var graphic = new esri.Graphic(polyline, drawLineSymbol, {}, null);
                layer.add(graphic);
                layer.setRenderer(defaultrenderer);
            }

        },
        createDirectionSymbol: function (ColorObj) {
            this.graphicstyles.grlinestyle = {
                style: esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                color: ColorObj,
                width: 2,
                directionStyle: "arrow2",
                directionPixelBuffer: 200,
                directionColor: ColorObj,
                directionScale: 0.9
            }
            return this.graphicstyles.grlinestyle;
        },

        adduserdetails: function () {
            var retval = (configOptions.UserInfo.UserName == "") ? "/null" : "/" + configOptions.UserInfo.UserName;
            retval += (configOptions.UserInfo.Password == "") ? "/null" : "/" + configOptions.UserInfo.Password;
            return retval;
        },
        deletePoint: function () {
            var currentWidget = this;
            var feature = this.map.infoWindow.getSelectedFeature();
            var pointx = feature.geometry.x;
            var pointy = feature.geometry.y;
            var sensorType = "";
            if (feature.getLayer().id.toLowerCase().indexOf("argos") >= 0) {
                sensorType = "ARGOS";
            }
            else if (feature.getLayer().id.toLowerCase().indexOf("gps") >= 0) {
                sensorType = "GPS";
            }
            else if (feature.getLayer().id.toLowerCase().indexOf("gsm") >= 0) {
                sensorType = "GSM";
            }
            var Deletedata = feature.attributes.PID + "/" + sensorType + "/" + feature.attributes.LAT + "/" + feature.attributes.LONG;

            Deletedata = Deletedata.replace(".", "DECIMAL").replace(".", "DECIMAL");
            var requestdata = {
                id: feature.attributes.PID,
                type: sensorType,
                lat: feature.attributes.LAT,
                lng: feature.attributes.LONG,
                login: (configOptions.UserInfo.UserName == "") ? "null" : configOptions.UserInfo.UserName,
                password: (configOptions.UserInfo.Password == "") ? "null" : configOptions.UserInfo.Password
            };
            if (Deletedata == "") {
                return;
            }

            $.ajax({
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify(requestdata),
                url: configOptions.ServiceUrl + "jsonDeletePoint/",
                success: function (val) {
                    report = val;
                    if (report.indexOf("Success") != -1) {
                        currentWidget.deletePointFromMap();
                    }
                    else {
                    }
                },
                error: function (err) {
                    AlertMessages("error", '', currentWidget._i18n.Unabletodeletethepoint);
                }

            });
        },
        deletePointFromMap: function () {
            var globalcurrentWidget = this;
            var currentWidget = this;
            var feature = this.map.infoWindow.getSelectedFeature();
            var delfeatureMigration;
            delfeatureMigration = feature.attributes.Migration;
            var currentFeatureColorObj = feature.attributes.ColorObj;
            var pointx = feature.geometry.x;
            var pointy = feature.geometry.y;
            var type = feature.getLayer().id.substring(feature.getLayer().id.length, 9);

            var delPointLayer = this.map.getLayer(feature.getLayer().id);
            var delLineLayer = this.map.getLayer(feature.getLayer().id.replace("_P", "_L"));
            var delTextLayer = this.map.getLayer(feature.getLayer().id.replace("_P", "_T"));

            delFeatureColors = [];
            //var pntColor, LneColor, TxtColor, pnt1Color, pnt2Color, pnt3Color, pnt4Color;
            //var prevclassnames = delPointLayer.className.split("_");
            //if (globalcurrentWidget.chkseason == true) {
            //    if (prevclassnames.length > 0) {
            //        pntColor = prevclassnames[0];
            //        globalcurrentWidget.Migration1Color = prevclassnames[0];
            //        pnt1Color = prevclassnames[0];
            //        LneColor = prevclassnames[0];
            //        TxtColor = prevclassnames[0];
            //    }
            //    else {
            //        globalcurrentWidget.Migration1Color = "";
            //        pnt1Color = "";
            //    }
            //    if (prevclassnames.length > 1) {
            //        globalcurrentWidget.Migration2Color = pnt2Color = prevclassnames[1];
            //    }
            //    else {
            //        globalcurrentWidget.Migration2Color = "";
            //        pnt2Color = "";
            //    }
            //    if (prevclassnames.length > 2) {
            //        globalcurrentWidget.Migration3Color = pnt3Color = prevclassnames[2];
            //    }
            //    else {
            //        globalcurrentWidget.Migration3Color = "";
            //        pnt3Color = "";
            //    }
            //    if (prevclassnames.length > 3) {
            //        globalcurrentWidget.Migration4Color = pnt4Color = prevclassnames[3];
            //    }
            //    else {
            //        globalcurrentWidget.Migration4Color = "";
            //        pnt4Color = "";
            //    }
            //}
            //else {
            //    if (prevclassnames.length >= 0) {
            //        globalcurrentWidget.Migration1Color = prevclassnames[0];
            //        pntColor = prevclassnames[0];
            //        LneColor = prevclassnames[0];
            //        TxtColor = prevclassnames[0];
            //    }
            //}

            //delFeatureColors.push(pntColor);
            //delFeatureColors.push(LneColor);
            //delFeatureColors.push(TxtColor);

            delPointLayer.clear();
            delLineLayer.clear();
            delTextLayer.featureLayers[delTextLayer.featureLayers.length - 1].clear();
            delTextLayer.clear();

            var result;
            for (var i = 0; i < this.layersInfo.length; i++) {
                if (this.layersInfo[i].id == feature.getLayer().id) {
                    result = this.layersInfo[i].result;
                }
            }
            for (var i = 0; i < result.length; i++) {
                if (globalcurrentWidget.chkseason == true) {
                    if (result[i].Migration == 1 || result[i] == null) {
                        if (delfeatureMigration == 1) {
                            result[i].ColorObj = currentFeatureColorObj;
                        }
                        /*result[i].ColorObj = esri.Color.fromHex(pnt1Color);*/
                    }
                    else if (result[i].Migration == 2) {
                        if (delfeatureMigration == 2) {
                            result[i].ColorObj = currentFeatureColorObj;
                        }
                        //result[i].ColorObj = esri.Color.fromHex(pnt2Color);
                    }
                    else if (result[i].Migration == 3) {
                        if (delfeatureMigration == 3) {
                            result[i].ColorObj = currentFeatureColorObj;
                        }
                        //result[i].ColorObj = esri.Color.fromHex(pnt3Color);
                    }
                    else if (result[i].Migration == 4) {
                        if (delfeatureMigration == 4) {
                            result[i].ColorObj = currentFeatureColorObj;
                        }
                        //result[i].ColorObj = esri.Color.fromHex(pnt4Color);
                    }
                }
                else {
                    //result[i].ColorObj = esri.Color.fromHex(pntColor);
                    result[i].ColorObj = currentFeatureColorObj;
                }

            }
            var BirdTrackingData = [];
            this.queryinfo.type = type;
            this.AddFeaturesToMapAfterDeletePoint(result, feature, this.queryinfo, BirdTrackingData, globalcurrentWidget.chkseason);
            AlertMessages("success", '', globalcurrentWidget._i18n.Pointdeletedsuccessfully);
            this.map.infoWindow.hide();

        },
        componentToHex: function (c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        },

        rgbToHex: function (r, g, b) {
            return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);

        },
        AddDataToTable: function (type, result, WidgetName) {
            var currentWidget = this;
            var data = [];
            var aColumns = [];
            var grid = null;
            var cp1 = null;

            currentWidget.SelectedSensorType = type;

            for (var obj in result[0]) {

                var colName = obj.toUpperCase();
                if ($(window).width() < 500) {

                    if (currentWidget.currentuser == "Admin") {
                        if (colName == "MIGRATION" || colName == "GAP" || colName == "COLOROBJ" || colName == "YEARDATA") {
                            continue;
                        }
                        if (colName == "SPEED") {
                            var item = [
                                { 'name': "SPEED(Kts)", 'field': "SPEED(Kts)", 'width': '80px' },
                            ];
                        }
                        else if (colName == "ALTITUDE") {
                            var item = [
                                { 'name': "ALTITUDE(Meters)", 'field': "ALTITUDE(Meters)", 'width': '80px' },
                            ];
                        }
                        else {
                            var item = [
                                { 'name': colName, 'field': obj, 'width': '80px' },
                            ];
                        }
                        aColumns.push(item[0]);
                    }
                    else {
                        if (colName == "PID" || colName == "DATE" || colName == "TIME" || colName == "LAT" || colName == "LONG" || colName == "CLASS") {

                            var item = [
                                { 'name': colName, 'field': obj, 'width': '80px' },
                            ];

                            aColumns.push(item[0]);
                        }
                    }
                } else {
                    if (currentWidget.currentuser == "Admin") {
                        if (colName == "MIGRATION" || colName == "GAP" || colName == "COLOROBJ" || colName == "YEARDATA") {
                            continue;
                        }
                        if (colName == "SPEED") {
                            var item = [
                                { 'name': "SPEED(Kts)", 'field': "SPEED(Kts)", 'width': 'auto' },
                            ];
                        }
                        else if (colName == "ALTITUDE") {
                            var item = [
                                { 'name': "ALTITUDE(Meters)", 'field': "ALTITUDE(Meters)", 'width': 'auto' },
                            ];
                        }
                        else {
                            var item = [
                                { 'name': colName, 'field': obj, 'width': 'auto' },
                            ];
                        }
                        aColumns.push(item[0]);
                    }
                    else {
                        if (colName == "PID" || colName == "DATE" || colName == "TIME" || colName == "LAT" || colName == "LONG" || colName == "CLASS") {

                            var item = [
                                { 'name': colName, 'field': obj, 'width': 'auto' },
                            ];

                            aColumns.push(item[0]);
                        }
                    }
                }

            }
            require(['dojo/_base/declare', 'dojox/grid/EnhancedGrid', 'dojox/grid/enhanced/plugins/Pagination',
                'dojo/domReady!'],
                function (declare, EnhancedGrid, Pagination) {
                    var tabs = currentWidget.tc.getChildren();
                    for (var i = tabs.length - 1; i >= 0; i--) {
                        if (result.length != 0) {
                            var Platformid = result[0].PID + '_' + type;
                            if (tabs[i].title == Platformid) {
                                var existingtab = tabs[i];
                                currentWidget.tc.removeChild(existingtab);
                            }
                        }
                        else {
                            var existingtab = tabs[i];
                            currentWidget.tc.removeChild(existingtab);
                            return;
                        }
                    }
                    var dataForGrid = [];
                    var data = {
                        identifier: 'id',
                        items: []
                    };
                    for (var j = 0; j < result.length; j++) {
                        var obj = {};
                        if (type.indexOf("Argos") != -1) {
                            if (currentWidget.currentuser == "Admin") {
                                obj["PID"] = result[j].PID;
                                obj["LAT"] = result[j].LAT;
                                obj["LONG"] = result[j].LONG;
                                obj["DATE"] = result[j].DATE.split("T")[0];
                                obj["TIME"] = result[j].TIME.split("T")[1];
                                obj["IQ"] = result[j].IQ;
                                obj["BEST_LEVEL"] = result[j].BEST_LEVEL;
                                obj["ALTITUDE(Meters)"] = result[j].ALTITUDE;
                                obj["NB_MESS"] = result[j].NB_MESS;
                                obj["PASS_DURATION"] = result[j].PASS_DURATION;
                                obj["LOC_CLASS"] = result[j].LOC_CLASS;
                                obj["SPEED(Kts)"] = result[j].SPEED;
                            }
                            else {
                                obj["PID"] = result[j].PID;
                                obj["LAT"] = result[j].LAT;
                                obj["LONG"] = result[j].LONG;
                                obj["DATE"] = result[j].DATE.split("T")[0];
                                obj["TIME"] = result[j].TIME.split("T")[1];
                                obj["LOC_CLASS"] = result[j].LOC_CLASS;
                            }
                        }
                        else if (type.indexOf("GSM") != -1) {
                            if (currentWidget.currentuser == "Admin") {
                                obj["PID"] = result[j].PID;
                                obj["LAT"] = result[j].LAT;
                                obj["LONG"] = result[j].LONG;
                                obj["DATE"] = result[j].DATE.split("T")[0];
                                obj["TIME"] = result[j].TIME.split("T")[1];
                                obj["SPEED(Kts)"] = result[j].SPEED;
                                obj["COURSE"] = result[j].COURSE;
                                obj["ALTITUDE(Meters)"] = result[j].ALTITUDE;
                                obj["HDOP"] = result[j].HDOP;
                                obj["VDOP"] = result[j].VDOP;
                            }
                            else {
                                obj["PID"] = result[j].PID;
                                obj["LAT"] = result[j].LAT;
                                obj["LONG"] = result[j].LONG;
                                obj["DATE"] = result[j].DATE.split("T")[0];
                                obj["TIME"] = result[j].TIME.split("T")[1];
                            }
                        }
                        else if (type.indexOf("GPS") != -1) {
                            if (currentWidget.currentuser == "Admin") {
                                obj["PID"] = result[j].PID;
                                obj["LAT"] = result[j].LAT;
                                obj["LONG"] = result[j].LONG;
                                obj["DATE"] = result[j].DATE.split("T")[0];
                                obj["TIME"] = result[j].TIME.split("T")[1];
                                obj["SPEED(Kts)"] = result[j].SPEED;
                                obj["COURSE"] = result[j].COURSE;
                                obj["ALTITUDE(Meters)"] = result[j].ALTITUDE;
                            }
                            else {
                                obj["PID"] = result[j].PID;
                                obj["LAT"] = result[j].LAT;
                                obj["LONG"] = result[j].LONG;
                                obj["DATE"] = result[j].DATE.split("T")[0];
                                obj["TIME"] = result[j].TIME.split("T")[1];
                            }
                        }
                        dataForGrid.push(obj);
                    }
                    for (var i = 0; i < dataForGrid.length; i++) {
                        data.items.push(lang.mixin({ id: i + 1 }, dataForGrid[i]));
                    }
                    var store = new dojo.data.ItemFileWriteStore({ data: data });
                    var layout = [];
                    for (var i = 0; i < aColumns.length; i++) {
                        layout.push(aColumns[i]);
                    }
                    var grid = new dojox.grid.EnhancedGrid({
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
                    grid.on("CellClick", function (e) {
                        var rowid = e.rowIndex;
                        var lat = grid.getItem(rowid).LAT;
                        var long = grid.getItem(rowid).LONG;
                        currentWidget.ZoomAndHighlight(parseFloat(lat), parseFloat(long));
                    });
                    if (result.length != 0) {
                        cp1 = new ContentPane({
                            title: result[0].PID + '_' + type,
                            content: grid.domNode,
                            style: "width:100%;height:100%;",
                        });
                        currentWidget.tc.addChild(cp1);
                    }
                    if (configOptions.UserInfo.UserRole == "Admin" || configOptions.UserInfo.UserRole == "Advanced") {
                        $(".rightdiv").css("display", "block");
                    }
                    else {
                        $(".rightdiv").css("display", "none");
                    }
                    $("#ResultPagePanel").css("visibility", "visible");
                });
            return;
        },

        ZoomAndHighlight: function (lat, long) {
            var currentWidget = this;
            currentWidget.map.graphics.clear();
            var pt = new esri.geometry.Point(long, lat, new esri.SpatialReference({ 'wkid': 4326 }));
            var highlightSymbol =
                new esri.symbol.PictureMarkerSymbol('Images/Pointer.gif', 24, 24,
                    new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                        new dojo.Color([255, 0, 0]), 1), new dojo.Color([0, 255, 0, 0.25]));
            currentWidget.map.graphics.add(new Graphic(pt, highlightSymbol));
            setTimeout(function () { currentWidget.map.graphics.clear(); }, 5000);
            var newExtent = new esri.geometry.Extent(long - 0.0005, lat - 0.0005, long + 0.0005, lat + 0.0005, new esri.SpatialReference({ 'wkid': 4326 }));
            currentWidget.map.setExtent(newExtent);
        },
        exportToExcelAll: function () {
            var layersinfosarray = [];
            var resultobject = {}
            var birdPIDs = [];
            var SensorTypes = [];
            var birdidwithtypes = [];
            for (var i = 0; i < this.layersInfo.length; i++) {

                if (this.layersInfo[i].id.indexOf("_P") >= 0) {
                    layersinfosarray.push(this.layersInfo[i]);
                }
            }
            for (var j = 0; j < layersinfosarray.length; j++) {
                var birdid = layersinfosarray[j].id.split("_")[0];
                var sensortype = layersinfosarray[j].id.split("_")[2];

                if ((parseInt(birdid) + "_" + sensortype) in resultobject) {
                    if (resultobject[parseInt(birdid) + "_" + sensortype].id.includes(sensortype)) {
                        resultobject[parseInt(birdid) + "_" + sensortype].result.push(...layersinfosarray[j].result);
                    }
                    else {
                        birdPIDs.push(birdid);
                        SensorTypes.push(sensortype);
                        birdidwithtypes.push(parseInt(birdid) + "_" + sensortype);
                        resultobject[parseInt(birdid) + "_" + sensortype] = layersinfosarray[j];
                    }
                } else {
                    birdPIDs.push(birdid);
                    SensorTypes.push(sensortype);
                    birdidwithtypes.push(parseInt(birdid) + "_" + sensortype);
                    resultobject[parseInt(birdid) + "_" + sensortype] = layersinfosarray[j];
                }
            }
            var k = 0;
            for (val in resultobject) {
                var results = resultobject[birdidwithtypes[k]].result
                this.JSONToCSVConvertor(results, birdPIDs[k], true, SensorTypes[k]);
                k++;
            }
        },
        JSONToCSVConvertor: function (JSONData, ReportTitle, ShowLabel, type) {
            var currentWidget = this;
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

            var CSV = '';
            //Set Report title in first row or line

            //CSV += ReportTitle + '\r\n\n';

            //This condition will generate the Label/Header
            if (ShowLabel) {
                var row = "";

                //This loop will extract the label from 1st index of on array
                for (var index in arrData[0]) {
                    /*if (index == "Migration" || index == "ColorObj" || index == "gap") {*/
                    if (index == "ColorObj" || index == "gap") {
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
                    /*if (index == "Migration" || index == "ColorObj" || index == "gap") {*/
                    if (index == "ColorObj" || index == "gap") {
                        continue;
                    }
                    if (currentWidget.currentuser == "Admin") {
                        if (index == "Migration") {
                            if (arrData[i][index] == 1) {
                                arrData[i][index] = "Wintering"
                            }
                            else if (arrData[i][index] == 2) {
                                arrData[i][index] = "Spring"
                            }
                            else if (arrData[i][index] == 3) {
                                arrData[i][index] = "Summering"
                            }
                            else if (arrData[i][index] == 4) {
                                arrData[i][index] = "Autumn"
                            }
                            else if (arrData[i][index] == null) {
                                arrData[i][index] = "No Migration"
                            }
                        }
                        if (index == "DATE") {
                            row += '"' + arrData[i][index].split("T")[0] + '",'
                        }
                        else if (index == "TIME") {
                            row += '"' + arrData[i][index].split("T")[1] + '",'
                        }
                        else {
                            row += '"' + arrData[i][index] + '",';
                        }

                    }
                    else {
                        
                        if (index == "PID" || index == "DATE" || index == "TIME" || index == "LAT" || index == "LONG" || index == "CLASS") {

                            if (index == "DATE") {
                                row += '"' + arrData[i][index].split("T")[0] + '",'
                            }
                            else if (index == "TIME") {
                                row += '"' + arrData[i][index].split("T")[1] + '",'
                            }
                            else {
                                row += '"' + arrData[i][index] + '",';
                            }
                            /* row += '"' + arrData[i][index] + '",';*/
                        }
                    }
                }
                row.slice(0, row.length - 1);

                //add a line break after each row
                CSV += row + '\r\n';
            }

            if (CSV == '') {
                UpdateLable('#FilterProgress', "No Results Found.")
                return;
            }


            //Generate a file name
            /* var fileName = "MyReport_" + ReportTitle + "_" + currentWidget.SelectedSensorType;*/
            var fileName = "MyReport_" + ReportTitle + "_" + type;
            //this will remove the blank-spaces from the title and replace it with an underscore
            //fileName += ReportTitle.replace(/ /g, "_");
            //fileName += fileName + "_" + currentWidget.SelectedSensorType;
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
        exportToKML: function () {
            var zipnameindex = 0;
            var currentWidget = this;
            var layersinfosarray = [];
            var resulsobject = {}
            currentWidget.strs = []
            var mainobject = {}

            for (var i = 0; i < this.layersInfo.length; i++) {
                if (this.layersInfo[i].id.indexOf("_P") >= 0 || this.layersInfo[i].id.indexOf("_L") >= 0) {
                    layersinfosarray.push(this.layersInfo[i])
                }
            }
            for (var j = 0; j < layersinfosarray.length; j++) {
                var birdid = layersinfosarray[j].id.split("_")[0] + "_" + layersinfosarray[j].id.split("_")[1]
                if (birdid in resulsobject) {
                    if (resulsobject[birdid].result != null) {
                        resulsobject[birdid].result.push(...layersinfosarray[j].result)
                    }

                    resulsobject[birdid].obj.graphics.push(...layersinfosarray[j].obj.graphics)
                } else {
                    resulsobject[birdid] = layersinfosarray[j];
                }
            }
            var graphics = []
            var features = []
            var spatial = ""
            var haspolygon = true
            for (val in resulsobject) {
                var bird = val.split("_")[0]
                if (resulsobject[val].result == null) {
                    if (bird in mainobject) {
                        for (var i = 0; i < resulsobject[val].obj.graphics.length; i++) {
                            mainobject[bird].graphics.push(resulsobject[val].obj.graphics[i])
                            mainobject[bird].spatial = resulsobject[val].obj.spatialReference
                        }
                        if (configOptions.mcpresults.length > 0) {
                            for (var k = 0; k < configOptions.mcpresults.length; k++) {
                                var polygonJson = {
                                    "rings": configOptions.mcpresults[k][0].rings,
                                    "spatialReference": configOptions.mcpresults[k][0].spatialReference
                                };
                                var polygon = new Polygon(polygonJson);
                                var grapic = new Graphic(polygon, configOptions.mcpresults[k][0].symbol, configOptions.mcpresults[k][0].attributes)
                                mainobject[bird].graphics.push(grapic)
                                mainobject[bird].features.push(configOptions.mcpresults[k][0].attributes);
                            }

                        }

                    }
                    else {
                        mainobject[bird] = {}
                        mainobject[bird].graphics = resulsobject[val].obj.graphics
                        mainobject[bird].spatial = null
                        mainobject[bird].features = []
                        if (configOptions.mcpresults.length > 0) {
                            for (var z = 0; z < configOptions.mcpresults.length; z++) {
                                var polygonJson = {
                                    "rings": configOptions.mcpresults[z][0].rings,
                                    "spatialReference": configOptions.mcpresults[z][0].spatialReference
                                };
                                var polygon = new Polygon(polygonJson);
                                var grapic = new Graphic(polygon, configOptions.mcpresults[z][0].symbol, configOptions.mcpresults[z][0].attributes)
                                mainobject[bird].graphics.push(grapic)
                                mainobject[bird].features.push(configOptions.mcpresults[z][0].attributes);
                            }
                        }
                    }
                }
                else {
                    if (bird in mainobject) {
                        mainobject[bird].features.push(...resulsobject[val].result)
                        mainobject[bird].graphics.push(...resulsobject[val].obj.graphics)
                        mainobject[bird].spatial = resulsobject[val].obj.spatialReference
                        if (configOptions.mcpresults.length > 0) {
                            for (var z = 0; z < configOptions.mcpresults.length; z++) {
                                var polygonJson = {
                                    "rings": configOptions.mcpresults[z][0].rings,
                                    "spatialReference": configOptions.mcpresults[z][0].spatialReference
                                };
                                var polygon = new Polygon(polygonJson);
                                var grapic = new Graphic(polygon, configOptions.mcpresults[z][0].symbol, configOptions.mcpresults[z][0].attributes)
                                mainobject[bird].graphics.push(grapic)
                                mainobject[bird].features.push(configOptions.mcpresults[z][0].attributes);
                            }
                        }

                    }
                    else {
                        mainobject[bird] = {}
                        mainobject[bird].graphics = resulsobject[val].obj.graphics
                        mainobject[bird].spatial = null
                        mainobject[bird].features = []
                        if (configOptions.mcpresults.length > 0) {
                            for (var a = 0; a < configOptions.mcpresults.length; a++) {
                                var polygonJson = {
                                    "rings": configOptions.mcpresults[a][0].rings,
                                    "spatialReference": configOptions.mcpresults[a][0].spatialReference
                                };
                                var polygon = new Polygon(polygonJson);
                                var grapic = new Graphic(polygon, configOptions.mcpresults[a][0].symbol, configOptions.mcpresults[a][0].attributes)
                                mainobject[bird].graphics.push(grapic)
                                mainobject[bird].features.push(configOptions.mcpresults[a][0].attributes)

                            }
                        }
                    }
                }
            }
            for (id in mainobject) {
                currentWidget.Featureset = new FeatureSet();
                currentWidget.Featureset.graphics = mainobject[id].graphics;
                for (var j = 0; j < mainobject[id].features.length; j++) {
                    if (mainobject[id].features[j].Migration == 1 || mainobject[id].features[j].Migration == 0) {
                        mainobject[id].features[j].Migration = "Winter";
                    }
                    else if (mainobject[id].features[j].Migration == 2) {
                        mainobject[id].features[j].Migration = "Spring";
                    }
                    else if (mainobject[id].features[j].Migration == 3) {
                        mainobject[id].features[j].Migration = "Breeding";
                    }
                    else if (mainobject[id].features[j].Migration == 4) {
                        mainobject[id].features[j].Migration = "Autumn";
                    }
                }

                currentWidget.Featureset.features = mainobject[id].features;
                currentWidget.Featureset.spatialReference = mainobject[id].spatial;
                this.createGeoJSON(".shapefile", id);
            }


        },
        exportToKML1: function () {
            var zipnameindex = 0;
            var currentWidget = this;
            var layersinfosarray = [];
            var resulsobject = {}
            currentWidget.strs = []
            var mainobject = {}

            for (var i = 0; i < this.layersInfo.length; i++) {
                if (this.layersInfo[i].id.indexOf("_P") >= 0 || this.layersInfo[i].id.indexOf("_L") >= 0) {
                    layersinfosarray.push(this.layersInfo[i])
                }
            }
            for (var j = 0; j < layersinfosarray.length; j++) {
                var birdid = layersinfosarray[j].id.split("_")[0] + "_" + layersinfosarray[j].id.split("_")[1]
                if (birdid in resulsobject) {
                    if (resulsobject[birdid].result != null) {
                        resulsobject[birdid].result.push(...layersinfosarray[j].result)
                    }

                    resulsobject[birdid].obj.graphics.push(...layersinfosarray[j].obj.graphics)
                } else {
                    resulsobject[birdid] = layersinfosarray[j];
                }
            }
            var graphics = []
            var features = []
            var spatial = ""
            var haspolygon = true
            for (val in resulsobject) {
                var bird = val.split("_")[0]
                if (resulsobject[val].result == null) {
                    if (bird in mainobject) {
                        for (var i = 0; i < resulsobject[val].obj.graphics.length; i++) {
                            mainobject[bird].graphics.push(resulsobject[val].obj.graphics[i])
                            mainobject[bird].spatial = resulsobject[val].obj.spatialReference
                        }
                        if (configOptions.mcpresults != null) {
                            for (var j = 0; j < mainobject[bird].graphics.length; j++) {
                                if (mainobject[bird].graphics[j].geometry.rings) {
                                    haspolygon = false
                                    break
                                }
                            }
                            if (haspolygon) {
                                var polygonJson = {
                                    "rings": configOptions.mcpresults[0].rings,
                                    "spatialReference": configOptions.mcpresults[0].spatialReference
                                };
                                var polygon = new Polygon(polygonJson);
                                var grapic = new Graphic(polygon, configOptions.mcpresults[0].symbol, configOptions.mcpresults[0].attributes)
                                mainobject[bird].graphics.push(grapic)
                                mainobject[bird].features.push(configOptions.mcpresults[0].attributes)
                            }

                        }

                    }
                    else {
                        mainobject[bird] = {}
                        mainobject[bird].graphics = resulsobject[val].obj.graphics
                        mainobject[bird].spatial = null
                        mainobject[bird].features = []
                        if (configOptions.mcpresults != null) {
                            for (var j = 0; j < mainobject[bird].graphics.length; j++) {
                                if (mainobject[bird].graphics[j].geometry.rings) {
                                    haspolygon = false
                                    break
                                }
                            }
                            if (haspolygon) {
                                var polygonJson = {
                                    "rings": configOptions.mcpresults[0].rings,
                                    "spatialReference": configOptions.mcpresults[0].spatialReference
                                };
                                var polygon = new Polygon(polygonJson);
                                var grapic = new Graphic(polygon, configOptions.mcpresults[0].symbol, configOptions.mcpresults[0].attributes)
                                mainobject[bird].graphics.push(grapic)
                                mainobject[bird].features.push(configOptions.mcpresults[0].attributes)
                            }
                        }
                    }
                }
                else {
                    if (bird in mainobject) {
                        mainobject[bird].features.push(...resulsobject[val].result)
                        mainobject[bird].graphics.push(...resulsobject[val].obj.graphics)
                        mainobject[bird].spatial = resulsobject[val].obj.spatialReference
                        if (configOptions.mcpresults != null) {
                            for (var j = 0; j < mainobject[bird].graphics.length; j++) {
                                if (mainobject[bird].graphics[j].geometry.rings) {
                                    haspolygon = false
                                    break
                                }
                            }
                            if (haspolygon) {
                                var polygonJson = {
                                    "rings": configOptions.mcpresults[0].rings,
                                    "spatialReference": configOptions.mcpresults[0].spatialReference
                                };
                                var polygon = new Polygon(polygonJson);
                                var grapic = new Graphic(polygon, configOptions.mcpresults[0].symbol, configOptions.mcpresults[0].attributes)
                                mainobject[bird].graphics.push(grapic)
                                mainobject[bird].features.push(configOptions.mcpresults[0].attributes)
                            }
                        }

                    }
                    else {
                        mainobject[bird] = {}
                        mainobject[bird].graphics = resulsobject[val].obj.graphics
                        mainobject[bird].spatial = null
                        mainobject[bird].features = []
                        if (configOptions.mcpresults != null) {
                            for (var j = 0; j < mainobject[bird].graphics.length; j++) {
                                if (mainobject[bird].graphics[j].geometry.rings) {
                                    haspolygon = false
                                    break
                                }
                            }
                            if (haspolygon) {
                                var polygonJson = {
                                    "rings": configOptions.mcpresults[0].rings,
                                    "spatialReference": configOptions.mcpresults[0].spatialReference
                                };
                                var polygon = new Polygon(polygonJson);
                                var grapic = new Graphic(polygon, configOptions.mcpresults[0].symbol, configOptions.mcpresults[0].attributes)
                                mainobject[bird].graphics.push(grapic)
                                mainobject[bird].features.push(configOptions.mcpresults[0].attributes)
                            }
                        }
                    }
                }
            }
            for (id in mainobject) {
                currentWidget.Featureset = new FeatureSet();
                currentWidget.Featureset.graphics = mainobject[id].graphics;
                for (var j = 0; j < mainobject[id].features.length; j++) {
                    if (mainobject[id].features[j].Migration == 1 || mainobject[id].features[j].Migration == 0) {
                        mainobject[id].features[j].Migration = "Winter";
                    }
                    else if (mainobject[id].features[j].Migration == 2) {
                        mainobject[id].features[j].Migration = "Spring";
                    }
                    else if (mainobject[id].features[j].Migration == 3) {
                        mainobject[id].features[j].Migration = "Breeding";
                    }
                    else if (mainobject[id].features[j].Migration == 4) {
                        mainobject[id].features[j].Migration = "Autumn";
                    }
                }

                currentWidget.Featureset.features = mainobject[id].features;
                currentWidget.Featureset.spatialReference = mainobject[id].spatial;
                this.createGeoJSON(".shapefile", id);
            }


        },
        createGeoJSON: function (type, layerName) {
            var currentWidget = this;
            this.getExportString().then(lang.hitch(function (str) {
                currentWidget.strs.push(str)
                currentWidget.download(layerName + type, str)
            }));


        },
        download: function (filename, text) {
            var currentWidget = this;
            require(['Lib/emap/BTRouteWidget/Ist_Shpwrite.js'], lang.hitch(this, function (shpWrite) {
                var options = lang.clone(currentWidget.shapefileOptions);
                var name = filename.split(".");
                var geometries = []
                currentWidget.shps = []
                var geojson = JSON.parse(text);
                var zipFile = shpWrite.zip(geojson, options, name[0].trim());
                if (!zipFile) {
                    return;
                }
                currentWidget.downloadFile(zipFile, 'application/zip;', name[0] + '.zip', true, 0);
            }));
        },
        getExportString: function () {
            return this._getAsGeoJsonString()
        },
        _getAsGeoJsonString: function _getAsGeoJsonString() {
            var currentWidget = this;
            return this._getFeatureSet().then(lang.hitch(this, function (fs) {
                return this._projectToWGS84(fs);
            })).then(lang.hitch(function (fs) {
                var str = '';
                if (fs && fs.graphics && fs.graphics.length > 0) {
                    var jsonObj = {
                        type: 'FeatureCollection',
                        features: []
                    };
                    arrayUtils.forEach(fs.graphics, function (feature) {
                        jsonObj.features.push(currentWidget.arcgisToGeoJSON(feature));
                    });
                    for (var j = 0; j < jsonObj.features.length; j++) {
                        if (typeof (jsonObj.features[j].properties.Migration) != "undefined") {
                            if (jsonObj.features[j].properties.Migration == 1 || jsonObj.features[j].properties.Migration == 0) {
                                jsonObj.features[j].properties.Migration = "Winter";
                            }
                            else if (jsonObj.features[j].properties.Migration == 2) {
                                jsonObj.features[j].properties.Migration = "Spring";
                            }
                            else if (jsonObj.features[j].properties.Migration == 3) {
                                jsonObj.features[j].properties.Migration = "Breeding";
                            }
                            else if (jsonObj.features[j].properties.Migration == 4) {
                                jsonObj.features[j].properties.Migration = "Autumn";
                            }
                        }
                    }
                    str = JSON.stringify(jsonObj);
                }
                return str;
            }));
        },
        _projectToWGS84: function (featureset) {
            var ret = new Deferred();
            var sf = this._getSpatialReference(featureset);
            if (!sf) {
                ret.resolve([]);
            } else {
                var wkid = parseInt(sf.wkid, 10);

                if (wkid === 4326) {
                    ret.resolve(featureset);
                } else if (sf.isWebMercator) {
                    var outFeatureset = new FeatureSet();
                    var features = [];
                    arrayUtils.forEach(featureset.features, function (feature) {
                        var g = new Graphic();
                        g.attributes = feature.attributes;
                        g.geometry = webMercatorUtils.webMercatorToGeographic(feature.geometry);
                        features.push(g);
                    });
                    outFeatureset.features = features;
                    ret.resolve(outFeatureset);
                } else {
                    var params = new ProjectParameters();
                    params.geometries = arrayUtils.map(featureset.features, function (feature) {
                        return feature.geometry;
                    });
                    params.outSR = new SpatialReference(4326);

                    var gs = esriConfig && esriConfig.defaults && esriConfig.defaults.geometryService;
                    var existGS = gs && gs.declaredClass === "esri.tasks.GeometryService";
                    if (!existGS) {
                        gs = jimuUtils.getArcGISDefaultGeometryService();
                    }

                    gs.project(params).then(function (geometries) {
                        var outFeatureset = new FeatureSet();
                        var features = [];
                        arrayUtils.forEach(featureset.features, function (feature, i) {
                            var g = new Graphic();
                            g.attributes = feature.attributes;
                            g.geometry = geometries[i];
                            features.push(g);
                        });
                        outFeatureset.features = features;
                        ret.resolve(outFeatureset);
                    }, function (err) {
                        console.error(err);
                        ret.resolve([]);
                    });
                }
            }
            return ret;
        },
        _getSpatialReference: function (featureset) {
            if (featureset.spatialReference) {
                return featureset.spatialReference;
            }
            // Get spatial refrence from graphics
            var sf;
            arrayUtils.forEach(featureset.features, function (feature) {
                if (feature.geometry && feature.geometry.spatialReference) {
                    sf = feature.geometry.spatialReference;
                    return true;
                }
            });
            return sf;
        },
        _getFeatureSet: function () {
            var ret = new Deferred();

            if (this.Featureset) {
                ret.resolve(this.Featureset);
            } else if (url) {
                var query = new Query();
                query.returnGeometry = true;
                query.outFields = ['*'];

                queryTask = new QueryTask(url);
                queryTask.execute(query, lang.hitch(function (fs) {
                    ret.resolve(fs);
                }), lang.hitch(function () {
                    ret.resolve(null);
                }));
            } else {
                ret.resolve(null);
            }

            return ret;
        },
        arcgisToGeoJSON: function (arcgis, idAttribute) {
            var geojson = {};

            if (typeof arcgis.x === 'number' && typeof arcgis.y === 'number') {
                geojson.type = 'Point';
                geojson.coordinates = [arcgis.x, arcgis.y];
            }

            if (arcgis.points) {
                geojson.type = 'MultiPoint';
                geojson.coordinates = arcgis.points.slice(0);
            }

            if (arcgis.paths) {
                if (arcgis.paths.length === 1) {
                    geojson.type = 'LineString';
                    geojson.coordinates = arcgis.paths[0].slice(0);
                } else {
                    geojson.type = 'MultiLineString';
                    geojson.coordinates = arcgis.paths.slice(0);
                }
            }

            if (arcgis.rings) {
                geojson = this.convertRingsToGeoJSON(arcgis.rings.slice(0));
            }

            if (arcgis.geometry) {
                geojson.type = 'Feature';
                geojson.geometry = (arcgis.geometry) ? this.arcgisToGeoJSON(arcgis.geometry) : null;
                geojson.properties = (arcgis.attributes) ? this.shallowClone(arcgis.attributes) : null;
                if (arcgis.attributes) {
                    geojson.id = arcgis.attributes[idAttribute] || arcgis.attributes.OBJECTID || arcgis.attributes.FID;
                }
            }

            return geojson;
        },
        shallowClone: function (obj) {
            var target = {};
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    target[i] = obj[i];
                }
            }
            return target;
        },
        convertRingsToGeoJSON: function (rings) {
            var outerRings = [];
            var holes = [];
            var x; // iterator
            var outerRing; // current outer ring being evaluated
            var hole; // current hole being evaluated

            // for each ring
            for (var r = 0; r < rings.length; r++) {
                var ring = this.closeRing(rings[r].slice(0));
                if (ring.length < 4) {
                    continue;
                }
                // is this ring an outer ring? is it clockwise?
                if (this.ringIsClockwise(ring)) {
                    var polygon = [ring];
                    outerRings.push(polygon); // push to outer rings
                } else {
                    holes.push(ring); // counterclockwise push to holes
                }
            }

            var uncontainedHoles = [];

            // while there are holes left...
            while (holes.length) {
                // pop a hole off out stack
                hole = holes.pop();

                // loop over all outer rings and see if they contain our hole.
                var contained = false;
                for (x = outerRings.length - 1; x >= 0; x--) {
                    outerRing = outerRings[x][0];
                    if (coordinatesContainCoordinates(outerRing, hole)) {
                        // the hole is contained push it into our polygon
                        outerRings[x].push(hole);
                        contained = true;
                        break;
                    }
                }

                // ring is not contained in any outer ring
                // sometimes this happens https://github.com/Esri/esri-leaflet/issues/320
                if (!contained) {
                    uncontainedHoles.push(hole);
                }
            }

            // if we couldn't match any holes using contains we can try intersects...
            while (uncontainedHoles.length) {
                // pop a hole off out stack
                hole = uncontainedHoles.pop();

                // loop over all outer rings and see if any intersect our hole.
                var intersects = false;

                for (x = outerRings.length - 1; x >= 0; x--) {
                    outerRing = outerRings[x][0];
                    if (arrayIntersectsArray(outerRing, hole)) {
                        // the hole is contained push it into our polygon
                        outerRings[x].push(hole);
                        intersects = true;
                        break;
                    }
                }

                if (!intersects) {
                    outerRings.push([hole.reverse()]);
                }
            }

            if (outerRings.length === 1) {
                return {
                    type: 'Polygon',
                    coordinates: outerRings[0]
                };
            } else {
                return {
                    type: 'MultiPolygon',
                    coordinates: outerRings
                };
            }
        },
        pointsEqual: function (a, b) {
            for (var i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) {
                    return false;
                }
            }
            return true;
        },
        closeRing: function (coordinates) {
            if (!this.pointsEqual(coordinates[0], coordinates[coordinates.length - 1])) {
                coordinates.push(coordinates[0]);
            }
            return coordinates;
        },
        ringIsClockwise: function (ringToTest) {
            var total = 0;
            var i = 0;
            var rLength = ringToTest.length;
            var pt1 = ringToTest[i];
            var pt2;
            for (i; i < rLength - 1; i++) {
                pt2 = ringToTest[i + 1];
                total += (pt2[0] - pt1[0]) * (pt2[1] + pt1[1]);
                pt1 = pt2;
            }
            return (total >= 0);
        },
        coordinatesContainCoordinates: function (outer, inner) {
            var intersects = this.arrayIntersectsArray(outer, inner);
            var contains = this.coordinatesContainPoint(outer, inner[0]);
            if (!intersects && contains) {
                return true;
            }
            return false;
        },
        coordinatesContainPoint: function (coordinates, point) {
            var contains = false;
            for (var i = -1, l = coordinates.length, j = l - 1; ++i < l; j = i) {
                if (((coordinates[i][1] <= point[1] && point[1] < coordinates[j][1]) ||
                    (coordinates[j][1] <= point[1] && point[1] < coordinates[i][1])) &&
                    (point[0] < (((coordinates[j][0] - coordinates[i][0]) * (point[1] - coordinates[i][1])) /
                        (coordinates[j][1] - coordinates[i][1])) + coordinates[i][0])) {
                    contains = !contains;
                }
            }
            return contains;
        },
        arrayIntersectsArray: function (a, b) {
            for (var i = 0; i < a.length - 1; i++) {
                for (var j = 0; j < b.length - 1; j++) {
                    if (this.vertexIntersectsVertex(a[i], a[i + 1], b[j], b[j + 1])) {
                        return true;
                    }
                }
            }

            return false;
        },
        vertexIntersectsVertex: function (a1, a2, b1, b2) {
            var uaT = ((b2[0] - b1[0]) * (a1[1] - b1[1])) - ((b2[1] - b1[1]) * (a1[0] - b1[0]));
            var ubT = ((a2[0] - a1[0]) * (a1[1] - b1[1])) - ((a2[1] - a1[1]) * (a1[0] - b1[0]));
            var uB = ((b2[1] - b1[1]) * (a2[0] - a1[0])) - ((b2[0] - b1[0]) * (a2[1] - a1[1]));

            if (uB !== 0) {
                var ua = uaT / uB;
                var ub = ubT / uB;

                if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
                    return true;
                }
            }

            return false;
        },
        downloadFile: function (content, mimeType, fileName, useBlob) {

            mimeType = mimeType || 'application/octet-stream';
            var url;
            var dataURI = 'data:' + mimeType + ',' + content;
            var link = document.createElement('a');
            var blob = new Blob([content], {
                'type': mimeType
            });

            // feature detection
            if (typeof (link.download) !== 'undefined') {
                // Browsers that support HTML5 download attribute
                if (useBlob) {
                    url = window.URL.createObjectURL(blob);
                } else {
                    url = dataURI;
                }
                link.setAttribute('href', url);
                link.setAttribute('download', fileName);
                link.style = 'visibility:hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return null;

                //feature detection using IE10+ routine
            } else if (navigator.msSaveOrOpenBlob) {
                return navigator.msSaveOrOpenBlob(blob, fileName);
            }

            // catch all. for which browsers?
            window.open(dataURI);
            window.focus();
            return null;
        }
    });
});