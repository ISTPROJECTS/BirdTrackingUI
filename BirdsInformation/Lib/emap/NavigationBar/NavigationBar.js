define([
    "dojo/dom",
     "dojo/_base/Color",
    "dojo/Evented",
    "dojo/_base/declare",
    "dojo/_base/lang",
    'dojo/topic',
    "dojo/has", // feature detection
    "esri/kernel", // esri namespace
    "dijit/_WidgetBase",
    "dijit/a11yclick", // Custom press, release, and click synthetic events which trigger on a left mouse click, touch, or space/enter keyup.
    "dijit/_TemplatedMixin",
    'dijit/_WidgetsInTemplateMixin',
    "dojo/on",
    "dojo/Deferred",
    "dojo/text!emap/NavigationBar/templates/NavigationBar.html", // template html
    "dojo/i18n!emap/NavigationBar/nls/strings", // localization
    "dojo/dom-class",
    "dojo/dom-style",
    "esri/toolbars/navigation",
    "esri/tasks/IdentifyTask",
    "esri/tasks/IdentifyParameters",

    "esri/dijit/PopupTemplate",
    "esri/symbols/SimpleMarkerSymbol",
    "dojo/dom-construct",
    'dojo/_base/array',
     "esri/layers/ArcGISTiledMapServiceLayer",
   'xstyle/css!../NavigationBar/css/NavigationBar.css'
],
function (
    dom,
    Color,
    Evented,
    declare,
    lang,
    topic,
    has, esriNS,
    _WidgetBase, a11yclick, _TemplatedMixin, _WidgetsInTemplateMixin,
    on,
    Deferred,
    dijitTemplate, i18n,
    domClass, domStyle,
    Navigation, IdentifyTask, IdentifyParameters,
    PopupTemplate, SimpleMarkerSymbol, domConstruct, array, ArcGISTiledMapServiceLayer
) {
    var Widget = declare("emap.NavigationBar", [_WidgetBase, _TemplatedMixin, Evented], {

        // template HTML
        templateString: dijitTemplate,
        theme: "HomeButton",
        map: null,
        visible: true,
        navToolbar: null,
        identifyLayerUrl: null,
        layerIds: null,
        CurrentMapCommand: '',
        idParams: null,

        // lifecycle: 1
        constructor: function (options, srcRefNode) {

            // mix in settings and defaults           
            options = options || {};
            lang.mixin(this, options); //update the properties

            // widget node
            this.domNode = srcRefNode;

            // store localized strings
            this._i18n = i18n;
            idParams = new esri.tasks.IdentifyParameters();

        },
        // bind listener for button to action
        postCreate: function () {
            try {
                this.inherited(arguments);
                var currentWidget = this;
                topic.subscribe('mapClickMode/setCurrent', lang.hitch(this, function (mode) {
                    
                    currentWidget.CurrentMapCommand = mode;
                    if (currentWidget.CurrentMapCommand != "zoom") {
                        console.log("disable Zoom");
                        currentWidget.navToolbar.deactivate();
                    }
                }));


            }
            catch (e) {
                console.log(e);
            }

        },
        // start widget. called by user
        startup: function () {
            try {
                var currentWidget = this;

                // map not defined
                if (!currentWidget.map) {
                    currentWidget.destroy();
                    console.log('Navigation::map required');
                }
                // when map is loaded
                if (currentWidget.map.loaded) {
                    currentWidget._init();
                } else {
                    on.once(currentWidget.map, "load", lang.hitch(this, function () {
                        currentWidget._init();
                    }));
                }
                currentWidget.createNavigationalTools();
               
            }
            catch (e) {
                console.log(e);
            }
        },
        createNavigationalTools: function () {
            try {
                //navigation tools
                var currentWidget = this;
                currentWidget.navToolbar = new Navigation(currentWidget.map);
                currentWidget.navToolbar.on("extent-history-change", function () {
                    currentWidget.extentHistoryChangeHandler();
                });

                $(currentWidget.btnZoomIn).click(function () {
                    topic.publish('mapClickMode/setCurrent', 'zoom');
                    currentWidget.navToolbar.activate(Navigation.ZOOM_IN);
                });


                $(currentWidget.btnZoomOut).click(function () {
                    topic.publish('mapClickMode/setCurrent', 'zoom');
                    currentWidget.navToolbar.activate(Navigation.ZOOM_OUT);
                });

                $(currentWidget.btnZoomFull).click(function () {
                    topic.publish('mapClickMode/setCurrent', 'zoom');
                    currentWidget.navToolbar.zoomToFullExtent();
                   // currentWidget.map.centerAndZoom(configOptions.mapCenter, configOptions.Zoom);

                });
                $(currentWidget.btnhome).click(function () {
                    topic.publish('mapClickMode/setCurrent', 'zoom');
                    currentWidget.navToolbar.zoomToFullExtent();
                });

                $(currentWidget.btnZoomPrev).click(function () {
                    topic.publish('mapClickMode/setCurrent', 'zoom');
                    currentWidget.navToolbar.zoomToPrevExtent();
                });

                $(currentWidget.btnZoomNext).click(function () {
                    //topic.publish('mapClickMode/setCurrent', 'zoom');
                    currentWidget.navToolbar.zoomToNextExtent();
                    //currentWidget.map.resize();
                });

                $(currentWidget.btnPan).click(function () {
                    currentWidget.navToolbar.activate(Navigation.PAN);
                });

                $(currentWidget.btnZoomDisable).click(function () {
                    topic.publish('mapClickMode/setCurrent', 'nocommand');
                    currentWidget.navToolbar.deactivate();
                });


                $(currentWidget.btnIdentify).click(function () {
                    topic.publish('mapClickMode/setCurrent', 'identify');
                    currentWidget.navToolbar.deactivate();
                    currentWidget.InitializeIdentify();

                });

                $(currentWidget.btnToogleBaseMap).click(function () {
                  
                    if (currentWidget.map.getBasemap() == "streets" ){//|| currentWidget.map.getBasemap() == "eMapArabicBaseMap") {                      
                        currentWidget.map.setBasemap("satellite");
                        $(currentWidget.btnToogleBaseMap).attr('class', 'satellitemap');
                        $(currentWidget.btnToogleBaseMap).attr("title", currentWidget._i18n.BasemapLabel);
                    }
                    else if (currentWidget.map.getBasemap() == "satellite")// && location.search.substring(1) == "ar")
                    {
                        currentWidget.map.setBasemap("streets");
                        $(currentWidget.btnToogleBaseMap).attr('class', 'basemap');
                        $(currentWidget.btnToogleBaseMap).attr("title", currentWidget._i18n.SatilliteMapLabel);
                    }
                    //else {
                    //    currentWidget.map.setBasemap("eMapVectorBaseMap");
                    //    $(currentWidget.btnToogleBaseMap).attr('class', 'basemap');
                    //    $(currentWidget.btnToogleBaseMap).attr("title", currentWidget._i18n.SatilliteMapLabel);
                    //}
                    topic.publish('NavigationBar/toggleBasemap', currentWidget.map.getBasemap());
                    
                });




                $(currentWidget.btnclearGraphics).click(function () {

                    currentWidget.map.graphics.clear();

                });




                $(currentWidget.btnZoomPrev).addClass("disabled");
                $(currentWidget.btnZoomNext).addClass("disabled")

            }
            catch (e) {
                console.log(e);
            }
        },

        extentHistoryChangeHandler: function () {
            var currentWidget = this;
            if (currentWidget.navToolbar.isFirstExtent() == true)
                $(currentWidget.btnZoomPrev).addClass("disabled");
            else
                $(currentWidget.btnZoomPrev).removeClass("disabled");

            if (currentWidget.navToolbar.isLastExtent() == true)
                $(currentWidget.btnZoomNext).addClass("disabled");
            else
                $(currentWidget.btnZoomNext).removeClass("disabled");
        },



        deActivateZoomTools: function () {
            try {
                var currentWidget = this;
                currentWidget.map.disablePan();
                currentWidget.navToolbar.deactivate();
            }
            catch (e) {
                console.log(e);
            }
        },
        runIdentifies: function (evt) {

            var currentWidget = this;

            var layerInfos = currentWidget.layers;
            var layers = [];

            array.forEach(layerInfos, function (layerInfo) {

                var lyrId = layerInfo.options.id;
                var layer = currentWidget.map.getLayer(lyrId);
                if (layer) {
                    var url = layer.url;

                    if (typeof (layerInfo.identify) != 'undefined' && layerInfo.identify == true) {

                        if (layer.declaredClass === 'esri.layers.FeatureLayer') {
                            return;
                        }
                        layers.push({
                            ref: layer,
                            layerInfo: layerInfo
                        });
                    }
                }

            });


            layers = dojo.filter(layers, function (layer) {
                return layer.ref.getImageUrl //&& layer.visible;
            }); //Only dynamic layers have the getImageUrl function. Filter so you only query visible dynamic layers


            var tasks = dojo.map(layers, function (layer) {

                return new esri.tasks.IdentifyTask(layer.layerInfo.url);
            }); //map each visible dynamic layer to a new identify task, using the layer url
            var defTasks = dojo.map(tasks, function (task) {
                return new dojo.Deferred();
            }); //map each identify task to a new dojo.Deferred
            var dlTasks = new dojo.DeferredList(defTasks); //And use all of these Deferreds in a DeferredList3
            //dlTasks.then(currentWidget.showResults); //chain showResults onto your DeferredList
            dlTasks.then(function (r) {
                currentWidget.showResults(r)
            });

            var params = currentWidget.createIdentifyParams(layers, evt);


            idParams.width = currentWidget.map.width;
            idParams.height = currentWidget.map.height;
            idParams.geometry = evt.mapPoint;
            idParams.mapExtent = currentWidget.map.extent;

            for (i = 0; i < tasks.length; i++) { //Use 'for' instead of 'for...in' so you can sync tasks with defTasks
                try {

                    if (params[i].layerIds != null)
                        idParams.layerIds = params[i].layerIds;
                    else
                        idParams.layerIds = null;

                    tasks[i].execute(idParams, defTasks[i].callback, defTasks[i].errback); //Execute each task
                } catch (e) {
                    console.log("Error caught");
                    console.log(e);
                    defTasks[i].errback(e); //If you get an error for any task, execute the errback
                }
            }

            //currentWidget.map.infoWindow.show(evt.mapPoint, currentWidget.map.getInfoWindowAnchor(evt.screenPoint));
        },

        createIdentifyParams: function (layers, evt) {
            var currentWidget = this;
            var identifyParamsList = [];
            identifyParamsList.length = 0;
            dojo.forEach(layers, function (layer) {
                var idParams1 = new esri.tasks.IdentifyParameters();
                idParams1.width = currentWidget.map.width;
                idParams1.height = currentWidget.map.height;
                idParams1.geometry = evt.mapPoint;
                idParams1.mapExtent = currentWidget.map.extent;
                idParams1.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_VISIBLE;

                idParams1.layerIds = null;
                if (typeof (layer.layerInfo.identifyLayerInfos) != 'undefined')
                    idParams1.layerIds = layer.layerInfo.identifyLayerInfos.layerIds;

                idParams1.tolerance = 3;
                idParams1.returnGeometry = true;
                identifyParamsList.push(idParams1);
            });
            return identifyParamsList;
        },


        showResults: function (r) {

            try {
                var currentWidget = this;

                var results = [];
                r = dojo.filter(r, function (result) {
                    return r[0];
                }); //filter out any failed tasks
                for (i = 0; i < r.length; i++) {
                    results = results.concat(r[i][1]);
                }
                results = dojo.map(results, function (result) {

                    var feature = result.feature;
                    feature.attributes.layerName = result.layerName;
                    var template = currentWidget.formatInfowindowContent(result)
                    feature.setInfoTemplate(template);
                    return feature;
                });
                if (results.length === 0) {
                    currentWidget.map.infoWindow.clearFeatures();
                } else {
                    currentWidget.map.infoWindow.setFeatures(results);
                }

                currentWidget.map.infoWindow.show(idParams.geometry);
                return results;
            }
            catch (e) {
                console.log(e);
            }
        },
        InitializeIdentify: function () {
            try {
                var currentWidget = this;
                currentWidget.deActivateZoomTools();
                currentWidget.map.infoWindow.hide();
                currentWidget.map.infoWindow.clearFeatures();
                currentWidget.map.infoWindow.setTitle(currentWidget._i18n.IdentifyingLabel);
                currentWidget.map.infoWindow.setContent('<div class="loading"></div>');
                currentWidget.map.infoWindow.resize(350, 240);
                idParams.tolerance = 12;
                idParams.returnGeometry = true;
                idParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_VISIBLE;
                currentWidget.map.infoWindow.setTitle(currentWidget._i18n.IdentifyResultsLabel);
                //identify task
                currentWidget.map.on("click",
                           function (evt) {
                               if (currentWidget.CurrentMapCommand == "identify") {
                                   currentWidget.runIdentifies(evt);
                               }
                           }
                  );
            }
            catch (e) {
                console.log(e);
            }

        },


        createInfoWindow: function (layer) {
            var popup = null;
            var currentWidget = this;
            var layerName = "";
            var fieldInfos = [];

            layerName = layer.name;
            if (layer._outFields && (layer._outFields.length) && (layer._outFields[0] !== '*')) {
                var fields = layer.fields;
                array.forEach(layer._outFields, function (fieldName) {
                    var foundField = array.filter(fields, function (field) {
                        return (field.name === fieldName);
                    });
                    if (foundField.length > 0) {
                        fieldInfos.push({
                            fieldName: foundField[0].name,
                            label: foundField[0].alias,
                            visible: true
                        });
                    }
                });
                // from the fields layer
            } else if (layer.fields) {

                array.forEach(layer.fields, function (field) {
                    fieldInfos.push({
                        fieldName: field.name,
                        label: field.alias,
                        visible: true
                    });
                });
            }


            if (fieldInfos.length > 0) {
                popup = new PopupTemplate({
                    title: layerName,
                    fieldInfos: fieldInfos,
                    showAttachments: (layer.hasAttachments)
                });
            }
            return popup;
        },

        formatInfowindowContent: function (result, layer) {
            var popup = null;

            try {

                var isCustomizedInfoWindow;
                var identifyLayer;
                var currentWidget = this;

                var layerInfos = currentWidget.layers;
                var layers = [];

                //var layerName = "";
                var displayFieldName = "";
                var fieldInfos = [];
                var layreid;

                array.forEach(layerInfos, function (layerInfo) {
                    if (layerInfo.hasOwnProperty("infoWindowParameters"))
                    {
                        layreid = "layer" + result.layerId;
                        if (result.layerName == layerInfo.infoWindowParameters[eval('layreid')].name) {
                            if (layerInfo.infoWindowParameters.hasOwnProperty(layreid)) {
                                isCustomizedInfoWindow = true;
                                identifyLayer = layerInfo;
                            }
                        }
                    }

                });


                if (isCustomizedInfoWindow)
                {
                    if (result && result.feature) {
                        var attributes = identifyLayer.infoWindowParameters[eval('layreid')].infoFields;
                        //layerName = result.layerName;
                        displayFieldName = result.feature.attributes[result.displayFieldName];
                        if (attributes) {

                            for (var i = 0; i < attributes.length; i++) {
                                fieldInfos.push({
                                    fieldName: attributes[i],
                                    visible: true
                                });
                            }

                        }
                    }

                }
                else
                    {

                    if (result && result.feature) {
                        var attributes = result.feature.attributes;
                        //layerName = result.layerName;
                        displayFieldName = result.feature.attributes[result.displayFieldName];
                        if (attributes) {
                            for (var prop in attributes) {
                                if (attributes.hasOwnProperty(prop)) {
                                    fieldInfos.push({
                                        fieldName: prop,
                                        visible: true
                                    });
                                }
                            }
                        }
                    }// from the outFields of the layer
                }
                if (fieldInfos.length > 0) {
                    popup = new PopupTemplate({
                        //title: layerName,
                        title: displayFieldName,
                        fieldInfos: fieldInfos,
                        // showAttachments: (layer.hasAttachments)
                    });
                }
            }
            catch (e) {
                console.log(e);
            }
            return popup;

        },
        // connections/subscriptions will be cleaned up during the destroy() lifecycle phase
        destroy: function () {
            this.inherited(arguments);
        },

        // show widget
        show: function () {
            this.set("visible", true);
        },
        // hide widget
        hide: function () {
            this.set("visible", false);
        },
        /* ---------------- */
        /* Private Functions */
        /* ---------------- */
        _init: function () {
            var currentWidget = this;

        },
    });
    return Widget;
});