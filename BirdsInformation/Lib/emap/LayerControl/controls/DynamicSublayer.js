define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/topic',
    'dojo/on',
    'dojo/dom-class',
    'dojo/dom-style',
    'dojo/dom-attr',
    'dojo/html',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/Sublayer.html'
], function (
    declare,
    lang,
    array,
    topic,
    on,
    domClass,
    domStyle,
    domAttr,
    html,
    WidgetBase,
    TemplatedMixin,
    sublayerTemplate
) {
    return declare([WidgetBase, TemplatedMixin], {
        control: null,
        sublayerInfo: null,
        // ^args
        templateString: sublayerTemplate,
        _expandClickHandler: null,
        postCreate: function () {
            this.inherited(arguments);
            if (array.indexOf(this.control.layer.visibleLayers, this.sublayerInfo.id) !== -1) {
                if (this.control.layer.layerInfos[this.sublayerInfo.id].name.indexOf(configOptions.CurrentYear) != -1) {
                    domClass.remove(this.checkNode, 'fa-square-o');
                    domClass.add(this.checkNode, 'fa fa-check-square-o');
                    domAttr.set(this.checkNode, 'data-checked', 'checked');
                }
                else {
                    domAttr.set(this.checkNode, 'data-checked', 'unchecked');
                }
                
            }
            else {
                domClass.remove(this.checkNode, 'fa-square-o');
                domClass.add(this.checkNode, 'fa fa-check-square-o');
                domAttr.set(this.checkNode, 'data-checked', 'checked');
            }
            domAttr.set(this.checkNode, 'data-sublayer-id', this.sublayerInfo.id);
            domClass.add(this.checkNode, this.control.layer.id + '-layerControlSublayerCheck');
            on(this.checkNode, 'click', lang.hitch(this, function () {
                if (domAttr.get(this.checkNode, 'data-checked') === 'unchecked') {
                    domAttr.set(this.checkNode, 'data-checked', 'checked');
                    domClass.remove(this.checkNode, 'fa-square-o');
                    domClass.add(this.checkNode, 'fa-check-square-o');
                    topic.publish('LayerControl/sublayerToggle',
                        {
                            toclayer: this.control.layer, subLayerId: this.control.layer.id, visible: true
                        });

                } else {
                    domAttr.set(this.checkNode, 'data-checked', 'unchecked');
                    domClass.remove(this.checkNode, 'fa-check-square-o');
                    domClass.add(this.checkNode, 'fa-square-o');
                  
                    topic.publish('LayerControl/sublayerToggle',
                        {
                            toclayer: this.control.layer, subLayerId: this.control.layer.id, visible: false
                        });
                }
                this.control._setVisibleLayers();
                this._checkboxScaleRange();
            }));

            //
            //sublayerInfo= 
            //{
            //  parentLayerId: "foodinspectionCategories",
            //  visibleLayers:[],    
            //}
            //

            topic.subscribe('LayerControl/setSubLayerVisiblity', lang.hitch(this, function (visibleSublayerInfo) {
               // alert(visibleSublayerInfo);

                //"foodinspectionCategories"
                if (visibleSublayerInfo) {
                    if (currentWidget.control.layer.id == visibleSublayerInfo.parentLayerId) {

                        var idx = array.indexOf(visibleSublayerInfo.visibleLayers, currentWidget.sublayerInfo.id);
                        if (idx == -1 && domAttr.get(this.checkNode, 'data-checked') === 'checked') { //if not found and visible then turn off

                            // Send event
                            on.emit(currentWidget.checkNode, "click", {
                                src: currentWidget.checkNode,
                            });
                        }
                        else if (idx >= 0 && domAttr.get(this.checkNode, 'data-checked') === 'unchecked') { //if found and off then turn on the layer

                            // Send event
                            on.emit(currentWidget.checkNode, "click", {
                                src: currentWidget.checkNode,
                            });
                        }

                    }

                }

            }));

            var currentWidget = this;

            //to display external dataset sublayer names in arabic //as per client requirement no need to display in arabic 

            //var LayerName;
            //var pgDir = document.getElementsByTagName('html');
            //for (var z = 0; z <= configOptions.TocSubLayerNames.length; z++) {
            //    if (this.sublayerInfo.name == configOptions.TocSubLayerNames[z].layername_En) {
            //        if (pgDir[0].dir == 'rtl' || pgDir[0].style.direction == 'rtl') {

            //            LayerName = configOptions.TocSubLayerNames[z].layername_Ar;
            //        }
            //        else {
            //            LayerName = configOptions.TocSubLayerNames[z].layername_En;
            //        }
            //        break;
            //    }
            //}
            //html.set(this.labelNode, LayerName);

            html.set(this.labelNode, this.sublayerInfo.name);

            this._expandClick();
            if (this.sublayerInfo.minScale !== 0 || this.sublayerInfo.maxScale !== 0) {
                this._checkboxScaleRange();
                if (this.control.layer.getMap())
                    this.control.layer.getMap().on('zoom-end', lang.hitch(this, '_checkboxScaleRange'));
            }
        },
        // add on event to expandClickNode
        _expandClick: function () {
            this._expandClickHandler = on(this.expandClickNode, 'click', lang.hitch(this, function () {
                var expandNode = this.expandNode,
                    iconNode = this.expandIconNode;
                if (domStyle.get(expandNode, 'display') === 'none') {
                    domStyle.set(expandNode, 'display', 'block');
                    domClass.replace(iconNode, 'fa-minus-square-o', 'fa-plus-square-o');
                } else {
                    domStyle.set(expandNode, 'display', 'none');
                    domClass.replace(iconNode, 'fa-plus-square-o', 'fa-minus-square-o');
                }
            }));
        },
        // check scales and add/remove disabled classes from checkbox
        _checkboxScaleRange: function () {

            if (this.control.layer == null) { //added by raj to avoid errors
                return;
            }

            if (this.control.layer.getMap()==null) { //added by raj to avoid errors
                return;
            }
                var node = this.checkNode;
                var scale = this.control.layer.getMap() ? this.control.layer.getMap().getScale():0,
                min = this.sublayerInfo.minScale,
                max = this.sublayerInfo.maxScale;
            domClass.remove(node, 'layerControlCheckIconOutScale');
            if ((min !== 0 && scale > min) || (max !== 0 && scale < max)) {
                domClass.add(node, 'layerControlCheckIconOutScale');
            }
        },
        destroy: function () {
            this.inherited(arguments);
            if (this._scaleRangeHandler) {
                this._scaleRangeHandler.remove();
                this._scaleRangeHandler = null;
            }
        }
    });
});