define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/topic',
    'dojo/dom-attr',
    'dojo/dom-construct',
    'dijit/_WidgetBase',
    "dijit/_TemplatedMixin",
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_Container',
    'dijit/layout/ContentPane',
    'dijit/form/Button',
    'esri/tasks/ProjectParameters',
    'esri/config',
    'esri/tasks/GeometryService',
    "dojo/text!emap/LayerControl/templates/layercontrol.html",
    "dojo/i18n!emap/LayerControl/nls/strings", // localization
    'xstyle/css!../LayerControl/css/LayerControl.css',
    "../LayerControl/controls/Dynamic",
    "../LayerControl/controls/Tiled",
    "../LayerControl/controls/Feature",

], function (
    declare,
    array,
    lang,
    topic,
    domAttr,
    domConst,
    WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    Container,
    ContentPane,
    Button,
    ProjectParameters,
    esriConfig,
    GeometryService,
    dijitTemplate, i18n
) {
    return declare([WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

        widgetsInTemplate: true, //tells the template system that your template has other widgets in it and to instantiate them when your widget is instantiated.
        // template HTML
        templateString: dijitTemplate,
        map: null,
        layerInfos: [],
        separated: false,
        overlayReorder: false,
        overlayLabel: false,
        vectorReorder: false,
        vectorLabel: false,
        noLegend: null,
        noZoom: null,
        noTransparency: null,
        swipe: null,
        fontAwesome: true,
        fontAwesomeUrl: '//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css', // 4.2.0 looks funny @ 16px?
        swiperButtonStyle: 'position:absolute;top:20px;left:120px;z-index:50;',
        // ^args
        baseClass: 'layerControlDijit',
        _vectorContainer: null,
        _overlayContainer: null,
        _swiper: null,
        _swipeLayerToggleHandle: null,
        _controls: {
            dynamic: 'emap/LayerControl/controls/Dynamic',
            feature: 'emap/LayerControl/controls/Feature',
            image: 'emap/LayerControl/controls/Image',
            tiled: 'emap/LayerControl/controls/Tiled'
        },
        constructor: function (options, srcRefNode) {

            options = options || {};
            lang.mixin(this, options); //update the properties
            this.layerInfos = options.layerControlLayerInfos;

            this.domNode = srcRefNode;
            // store localized strings
            this._i18n = i18n;
            //alert(this.templateString);

            if (!options.map) {
                topic.publish('viewer/handleError', {
                    source: 'LayerControl',
                    error: 'map option is required'
                });
                return;
            }
        },
        postCreate: function () {
            try {
                var currentWidget = this;
                this.inherited(arguments);


                topic.subscribe('LayerControl/layer-add', lang.hitch(this, function (layer) {
                    currentWidget.layerInfos.unshift(layer);
                    currentWidget.addNewLayertoMap(layer);
                }));


                // url to your geometry server.          
                esriConfig.defaults.geometryService = new GeometryService(configOptions.geometryService);

                if (this.separated) {

                    var ControlContainer = declare([WidgetBase, Container]);
                    // vector layer label
                    if (this.vectorLabel !== false) {
                        this.tocParentContainer.addChild(new ContentPane({
                            className: 'vectorLabelContainer',
                            content: this.vectorLabel
                        }, domConst.create('div')), 'first');
                    }
                    // vector layer control container
                    this._vectorContainer = new ControlContainer({
                        className: 'vectorLayerContainer'
                    }, domConst.create('div'));

                    this.tocParentContainer.addChild(this._vectorContainer, 'last');
                    // overlay layer label
                    if (this.overlayLabel !== false) {
                        this.tocParentContainer.addChild(new ContentPane({
                            className: 'overlayLabelContainer',
                            content: this.overlayLabel
                        }, domConst.create('div')), 'last');
                    }
                    // overlay layer control container
                    this._overlayContainer = new ControlContainer({
                        className: 'overlayLayerContainer'
                    }, domConst.create('div'));
                    this.tocParentContainer.addChild(this._overlayContainer, 'last');
                } else {
                    this.overlayReorder = false;
                    this.vectorReorder = false;
                }

                //currentWidget.tocParentContainer.addChild(currentWidget.tocDummyBaseMapLayer, 'last');
                dojo.place(currentWidget.tocDummyBaseMapLayer, currentWidget.tocParentContainer.domNode, "last");


                // load only the modules we need
                var modules = [];
                // load font awesome
                if (this.fontAwesome) {
                    modules.push('xstyle/css!' + this.fontAwesomeUrl);
                }
                // push layer control mods
                array.forEach(this.layerInfos, function (layerInfo) {
                    // check if control is excluded
                    var controlOptions = layerInfo.controlOptions;
                    if (controlOptions && controlOptions.exclude === true) {
                        return;
                    }
                    var mod = this._controls[layerInfo.type];
                    if (mod) {
                        modules.push(mod);
                    } else {
                        topic.publish('viewer/handleError', {
                            source: 'LayerControl',
                            error: 'the layer type "' + layerInfo.type + '" is not supported'
                        });
                    }
                }, this);
                // load and go
                require(modules, lang.hitch(this, function () {
                    array.forEach(this.layerInfos, function (layerInfo) {
                        // exclude from widget
                        var controlOptions = layerInfo.controlOptions;
                        if (controlOptions && controlOptions.exclude === true) {
                            return;
                        }
                        var control = this._controls[layerInfo.type];
                        if (control) {
                            require([control], lang.hitch(this, '_addControl', layerInfo));
                        }
                    }, this);
                    this._checkReorder();
                }));






            }
            catch (e) {
                console.log(e);
            }
        },

        addNewLayertoMap: function (layerInfoObj) {
            var currentWidget = this;

            var LayerControl = currentWidget._controls[layerInfoObj.type];
            require([LayerControl], lang.hitch(currentWidget, '_addControl', layerInfoObj));

        },
        // create layer control and add to appropriate _container
        _addControl: function (layerInfo, LayerControl) {
            try {

                var layertitle;
                var pgDir = document.getElementsByTagName('html');
                if (layerInfo.title == "") {
                    layertitle = layerInfo.layer.id;
                }
                else {
                    //layertitle = layerInfo.title;

                    for (var l = 0; l < configOptions.TocLayerNames.length; l++) {
                        if (layerInfo.title == configOptions.TocLayerNames[l].layername_En) {
                            if (pgDir[0].dir == 'rtl' || pgDir[0].style.direction == 'rtl') {
                                layertitle = configOptions.TocLayerNames[l].layername_Ar;

                            }
                            else {
                                layertitle = configOptions.TocLayerNames[l].layername_En;
                            }
                            break;
                        }
                    }
                }
                    


                var layerControl = new LayerControl({
                    controller: this,
                    layer: layerInfo.layer,
                    layerTitle: layertitle,
                    controlOptions: lang.mixin({
                        noLegend: null,
                        noZoom: null,
                        noTransparency: null,
                        swipe: null,
                        expanded: false,
                        sublayers: true
                    }, layerInfo.controlOptions)
                });
                layerControl.startup();
                if (this.separated) {
                    if (layerControl._layerType === 'overlay') {
                        this._overlayContainer.addChild(layerControl, 'first');

                    } else {
                        this._vectorContainer.addChild(layerControl, 'first');
                    }
                } else {
                    //alert(this.tocParentContainer);
                    this.tocParentContainer.addChild(layerControl, 'first');
                }
            }
            catch (e) {
                console.log(e);
            }
        },

        _removeLayer: function (control) {

            //console.log(control);
            var currentWidget = this;
            var lyr2Remove = control.layer;
            //var node = control.domNode;
            this.map.removeLayer(lyr2Remove);
            control.layer = null; //to remove the events attached
            control.destroy();

            topic.publish('LayerControl/RemoveLayer', lyr2Remove);
            alert(currentWidget._i18n.removeLayerSucMsg, currentWidget._i18n.ModuleNameLabel);

        },
        // move control up in controller and layer up in map
        _moveUp: function (control) {
            try {
                var id = control.layer.id,
                    node = control.domNode,
                    index;
                if (control._layerType === 'overlay') {
                    if (control.getPreviousSibling()) {
                        index = array.indexOf(this.map.layerIds, id);
                        this.map.reorderLayer(id, index + 1);
                        this._overlayContainer.containerNode.insertBefore(node, node.previousSibling);
                        this._checkReorder();
                    }
                } else if (control._layerType === 'vector') {
                    if (control.getPreviousSibling()) {
                        index = array.indexOf(this.map.graphicsLayerIds, id);
                        this.map.reorderLayer(id, index + 1);
                        this._vectorContainer.containerNode.insertBefore(node, node.previousSibling);
                        this._checkReorder();
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        },
        // move control down in controller and layer down in map
        _moveDown: function (control) {
            try {
                var id = control.layer.id,
                    node = control.domNode,
                    index;
                if (control._layerType === 'overlay') {
                    if (control.getNextSibling()) {
                        index = array.indexOf(this.map.layerIds, id);
                        this.map.reorderLayer(id, index - 1);
                        this._overlayContainer.containerNode.insertBefore(node, node.nextSibling.nextSibling);
                        this._checkReorder();
                    }
                } else if (control._layerType === 'vector') {
                    if (control.getNextSibling()) {
                        index = array.indexOf(this.map.graphicsLayerIds, id);
                        this.map.reorderLayer(id, index - 1);
                        this._vectorContainer.containerNode.insertBefore(node, node.nextSibling.nextSibling);
                        this._checkReorder();
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        },
        // enable/disable move up/down menu items when the last or first child respectively
        _checkReorder: function () {
            try {
                if (this.separated) {
                    if (this.vectorReorder) {
                        array.forEach(this._vectorContainer.getChildren(), function (child) {

                            if (!child.getPreviousSibling()) {
                                if (child._reorderUp) child._reorderUp.set('disabled', true);
                            } else {
                                if (child._reorderUp) child._reorderUp.set('disabled', false);
                            }
                            if (!child.getNextSibling()) {
                                if (child._reorderDown) child._reorderDown.set('disabled', true);
                            } else {
                                if (child._reorderDown) child._reorderDown.set('disabled', false);
                            }
                        }, this);
                    }
                    if (this.overlayReorder) {
                        array.forEach(this._overlayContainer.getChildren(), function (child) {

                            if (!child.getPreviousSibling()) {
                                if (child._reorderUp) child._reorderUp.set('disabled', true);

                            } else {

                                if (child._reorderUp) child._reorderUp.set('disabled', false);

                            }
                            if (!child.getNextSibling()) {
                                if (child._reorderDown) child._reorderDown.set('disabled', true);
                            } else {
                                if (child._reorderDown) child._reorderDown.set('disabled', false);

                            }
                        }, this);
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        },
        // zoom to layer
        _zoomToLayer: function (layer) {
            try {
                var map = this.map;
                if (layer.spatialReference === map.spatialReference) {
                    map.setExtent(layer.fullExtent, true);
                } else {
                    if (esriConfig.defaults.geometryService) {
                        esriConfig.defaults.geometryService.project(lang.mixin(new ProjectParameters(), {
                            geometries: [layer.fullExtent],
                            outSR: map.spatialReference
                        }), function (r) {
                            map.setExtent(r[0], true);
                        }, function (e) {
                            topic.publish('viewer/handleError', {
                                source: 'LayerControl._zoomToLayer',
                                error: e
                            });
                        });
                    } else {
                        topic.publish('viewer/handleError', {
                            source: 'LayerControl._zoomToLayer',
                            error: 'esriConfig.defaults.geometryService is not set'
                        });
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        },
        // layer swiper
        _swipeLayer: function (layer, type) {
            try {
                if (!layer || !layer.visible) {
                    return;
                }
                if (!this._swiper) {
                    require(['esri/dijit/LayerSwipe'], lang.hitch(this, function (LayerSwipe) {
                        this._swiper = new LayerSwipe({
                            type: type || 'vertical',
                            map: this.map,
                            layers: [layer]
                        }, domConst.create('div', {}, this.map.id, 'first'));
                        this._swiper.startup();
                        this._swiper.disableBtn = new Button({
                            label: 'Exit Layer Swipe',
                            onClick: lang.hitch(this, '_swipeDisable')
                        }, domConst.create('div', {}, this.map.id));
                        domAttr.set(this._swiper.disableBtn.domNode, 'style', this.swiperButtonStyle);
                    }));
                } else {
                    this._swiper.disable();
                    if (this._swipeLayerToggleHandle) {
                        this._swipeLayerToggleHandle.remove();
                    }
                    this._swiper.set('layers', [layer]);
                    this._swiper.set('type', type);
                    this._swiper.enable();
                    domAttr.set(this._swiper.disableBtn.domNode, 'style', this.swiperButtonStyle);
                }
                this._swipeLayerToggleHandle = topic.subscribe('layerControl/layerToggle', lang.hitch(this, function (d) {
                    if (d.id === layer.id && !d.visible) {
                        this._swipeDisable();
                    }
                }));
            }
            catch (e) {
                console.log(e);
            }
        },
        _swipeDisable: function () {
            try {
                this._swiper.disable();
                if (this._swipeLayerToggleHandle) {
                    this._swipeLayerToggleHandle.remove();
                }
                domAttr.set(this._swiper.disableBtn.domNode, 'style', 'display:none;');
            }
            catch (e) {
                console.log(e);
            }
        },
        destroy: function () {
            this.inherited(arguments);
        },
    });
});