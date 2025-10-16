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
    "dojo/text!emap/Measurement/templates/Measurement.html", // template html
    'dojo/i18n!../Measurement/nls/strings',
    "dojo/dom-class",
    "dojo/dom-style",
   "esri/dijit/Measurement",
    "esri/tasks/GeometryService",
     "esri/units",
     "esri/symbols/Font",
      "esri/symbols/TextSymbol",
       "esri/graphic",
   //'xstyle/css!../Measurement/css/Measurement.css'
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
    domClass,
    domStyle,
    Measurement, GeometryService, Units,Font,TextSymbol,Graphic
  
) {
    var Widget = declare("emap.Measurement", [_WidgetBase, _TemplatedMixin, Evented], {

        // template HTML
        templateString: dijitTemplate,
        theme: "HomeButton",
        map: null,
        visible: true,
        _i18n: i18n,
        title: i18n.title,
        measurementWidget: null,
        CurrentMapCommand: '',
        // lifecycle: 1
        constructor: function (options, srcRefNode) {

            // mix in settings and defaults           
            options = options || {};
            lang.mixin(this, options); //update the properties

            // widget node
            this.domNode = srcRefNode;

            // store localized strings
            this._i18n = i18n;

        },
        // bind listener for button to action
        postCreate: function () {
            try{
                this.inherited(arguments);
                var currentWidget = this;
                

                topic.subscribe('mapClickMode/ClearMeasureTools', lang.hitch(this, function (mode) {
                      topic.publish('mapClickMode/setCurrent', 'Basemap');
                }));
                currentWidget.createMeasureTools();
                currentWidget.measurementWidget.on("measure-start", function (evt) {
                    currentWidget.map.disableDoubleClickZoom();
                });

                currentWidget.measurementWidget.on("measure-end", function (evt) {
                    var currentWidget = this;
                    currentWidget.map.enableDoubleClickZoom();
                });
                currentWidget.measurementWidget.on("tool-change", function (evt) {
                    topic.publish('mapClickMode/setCurrent', 'measure');
                });
                topic.subscribe('mapClickMode/setCurrent', lang.hitch(this, function (mode) {
                    //if not draw deactivate the drawing tools
                    currentWidget.CurrentMapCommand = mode;
                    if (currentWidget.CurrentMapCommand != "measure") {
                    
                        currentWidget.measurementWidget.setTool("area", false);
                        currentWidget.measurementWidget.setTool("distance", false);
                        currentWidget.measurementWidget.setTool("location", false);
                    }
                }));
            }
            catch(e)
            {
                console.log(e);
            }

        },
        _btnClearClick:function()
        {
         
            var currentWidget = this;
            
            currentWidget.measurementWidget.setTool("area", false);
            currentWidget.measurementWidget.setTool("distance", false);
            currentWidget.measurementWidget.setTool("location", false);

            currentWidget.measurementWidget.clearResult();
            currentWidget.map.graphics.clear();
        },


        // start widget. called by user
        startup: function () {
            try {
                var currentWidget = this;

                // map not defined
                if (!currentWidget.map) {
                    currentWidget.destroy();
                    console.log('Measurement::map required');
                }
                // when map is loaded
                if (currentWidget.map.loaded) {
                    currentWidget._init();
                }
                else {
                    on.once(currentWidget.map, "load", lang.hitch(this, function () {
                        currentWidget._init();
                    }));
                }
                currentWidget.createMeasureTools();
              
            }
            catch (e) {
                console.log(e);
            }
        },
        btnMeasureToolsClose:function(e)
        {
            var currentWidget = this;
            $(currentWidget.domNode).animate({ "opacity": "hide", top: "-1000px" }, 500);
        },
        createMeasureTools: function () {
           
                var currentWidget = this;
                //This service is for development and testing purposes only. We recommend that you create your own geometry service for use within your applications
                esriConfig.defaults.geometryService = new GeometryService(configOptions.geometryService);
                currentWidget.measurementWidget = new Measurement({
                    map: currentWidget.map,
                    defaultAreaUnit: Units.SQUARE_METERS,
                    defaultLengthUnit: Units.METERS,

                }, this.measurementDiv);

                currentWidget.measurementWidget.startup();
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