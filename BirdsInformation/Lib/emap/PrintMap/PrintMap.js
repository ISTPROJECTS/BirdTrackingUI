define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'esri/tasks/PrintTask',
    "esri/tasks/LegendLayer",
    "esri/layers/FeatureLayer",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    'dojo/store/Memory',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/topic',
    'dojo/dom-style',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dojo/text!emap/PrintMap/templates/PrintMap.html',
    'dojo/text!emap/PrintMap/templates/PrintResult.html',
    "dojo/i18n!emap/PrintMap/nls/strings", // localization
    'esri/tasks/PrintTemplate',
    'esri/tasks/PrintParameters',
    "esri/renderers/SimpleRenderer",
    'esri/request',
    "esri/renderers/UniqueValueRenderer",
    'dijit/form/Form',
    'dijit/form/FilteringSelect',
    'dijit/form/ValidationTextBox',
    'dijit/form/NumberTextBox',
    'dijit/form/Button',
    'dijit/form/CheckBox',
    'dijit/ProgressBar',
    'dijit/form/DropDownButton',
    'dijit/TooltipDialog',
    'dijit/form/RadioButton',
    "dijit/Dialog",
    'xstyle/css!../PrintMap/css/PrintMap.css',
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
    PrintTask, LegendLayer, FeatureLayer, ArcGISDynamicMapServiceLayer,
    Memory, lang, array, topic, Style, domConstruct, domClass, printTemplate, printResultTemplate,
    i18n, PrintTemplate, PrintParameters, SimpleRenderer, esriRequest, UniqueValueRenderer) {
    //
    // Main print dijit
    var PrintDijit = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

        widgetsInTemplate: true,

        templateString: printTemplate,
        map: null,
        count: 1,
        results: [],
        authorText: null,
        copyrightText: null,
        defaultTitle: null,
        defaultFormat: null,
        defaultLayout: null,
        pdfIcon: require.toUrl('emap/PrintMap/images/pdf.png'),
        imageIcon: require.toUrl('emap/PrintMap/images/image.png'),
        printTaskURL: null,
        printTask: null,
        config: null,
        layoutoptions: null,

        constructor: function (options, srcRefNode) {
            // mix in settings and defaults     

            options = options || {};
            lang.mixin(this, options); //update the properties

            // widget node
            this.domNode = srcRefNode;

            // store localized strings
            this._i18n = i18n;

        },

        startup: function () {
            var currentWidget = this;
            this.inherited(arguments);

            currentWidget.getformat();

        },
        postCreate: function () {
            var currentwidget = this;
            globalCurrentWidget = this;
            topic.subscribe('mapClickMode/ClearWidgets', lang.hitch(this, function () {
                currentwidget.ClearControls();
            }));

            $(currentwidget.format).append('<option value=""> </option>');
            $(currentwidget.format).append('<option value="PDF">PDF</option>');
            $(currentwidget.format).append('<option value="JPG">JPG</option>');

            try {
                var currentWidget = this;
                this.inherited(arguments);
                this.printTask = new PrintTask(configOptions.widgets.printWidget.printTaskURL);
                this.printparams = new PrintParameters();
                this.printparams.map = this.map;
                this.printparams.outSpatialReference = currentWidget.map.spatialReference; //new esri.SpatialReference({ wkid: 4326 });//this.map.spatialReference;

                esriRequest({
                    url: configOptions.widgets.printWidget.printTaskURL,
                    content: {
                        f: 'json'
                    },
                    handleAs: 'json',
                    callbackParamName: 'callback',
                    load: lang.hitch(this, '_handlePrintInfo'),
                    error: lang.hitch(this, '_handleError')
                });

            }
            catch (e) {
                /*console.log(e);*/
            }

        },

        _handleError: function (err) {
            topic.publish('viewer/handleError', {
                source: 'Print',
                error: err
            });
            console.log(err)
        },
        _handlePrintInfo: function (data) {
            try {
                var currentWidget = this;
                var Layout_Template = array.filter(data.parameters, function (param) {
                    return param.name === 'Layout_Template';
                });
                if (Layout_Template.length === 0) {
                    topic.publish('viewer/handleError', {
                        source: 'Print',
                        error: 'Print service parameters name for templates must be \'Layout_Template\''
                    });
                    return;
                }

                var layoutItems = array.map(Layout_Template[0].choiceList, function (item) {
                    return {
                        name: item,
                        id: item
                    };
                });
                layoutItems.sort(function (a, b) {
                    return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
                });
                optn = document.createElement("OPTION");
                optn.text = optn.value = "";
                $(currentWidget.layout).append(optn);
                currentWidget.layoutoptions = layoutItems
                array.map(layoutItems, function (item) {

                    optn = document.createElement("OPTION");
                    //optn.text = optn.value = item.name;
                    if (item.name != "MAP_ONLY") {
                        optn.text = optn.value = item.name.split("_")[1];
                    }
                    else {
                        optn.text = optn.value = item.name;
                    }

                    $(currentWidget.layout).append(optn);
                });

                $(currentWidget.layout)[0].sumo.reload();
            }
            catch (e) {
                console.log(e);

            }

        },
        ClearControls: function () {
            var currentWidget = this;
            $(currentWidget.title).val("");
            $(currentWidget.format).val("");
            $(currentWidget.layout).val("");
            $(currentWidget.format)[0].sumo.reload();
            $(currentWidget.layout)[0].sumo.reload();
            $(currentWidget.lblprintformat).css("display", "none");
            $(currentWidget.lblprint).css("display", "none");
            $(currentWidget.lblprintlayout).css("display", "none");
            topic.publish('mapClickMode/setCurrent', 'print');
            domConstruct.empty(this.printResultsNode);
        },
        ClearLabelFormat: function () {
            var currentWidget = this;
            $(currentWidget.lblprintformat).css("display", "none");
        },
        ClearLabelTitle: function () {
            var currentWidget = this;
            $(currentWidget.lblprint).css("display", "none");
        },
        ClearLabelLayout: function () {
            var currentWidget = this;
            $(currentWidget.lblprintlayout).css("display", "none");
        },

        getformat: function () {
            var currentWidget = this;
            
            $(currentWidget.format).SumoSelect({ search: true, placeholder: currentWidget._i18n.SelectFormat });
            $(currentWidget.layout).SumoSelect({ search: true, placeholder: currentWidget._i18n.SelectLayout });
        },


        print: function () {
            try {
                var currentWidget = this;
                $(currentWidget.lblprint).css("display", "none");
                $(currentWidget.lblprintformat).css("display", "none");
                $(currentWidget.lblprintlayout).css("display", "none");
                topic.publish('mapClickMode/setCurrent', 'print');

                var title = $(currentWidget.title).val();
                var format = $(currentWidget.format).val();
                var layout = $(currentWidget.layout).val();

                var formIsValid = true;
                if (title == "") {
                    $(currentWidget.lblprint).css("display", "block");
                    formIsValid = false;
                }
                if (layout == 'EAD A4 Ar Portrait' || 'EAD A4 En Portrait') {
                    var titlelength = 30;
                    if (title.length > titlelength) {
                        var splitString = [];
                        for (var i = 0; i < title.length; i = i + titlelength) {
                            splitString.push(title.slice(i, i + titlelength));
                        }
                        if (splitString.length > 0) {
                            for (var j = 0; j < splitString.length; j++) {
                                if (j == 0) {
                                    title = splitString[j] + "\n";
                                }
                                else {
                                    title += splitString[j] + "\n";
                                }

                            }
                        }
                    }
                }

                if (format == "") {
                    $(currentWidget.lblprintformat).css("display", "block");
                    formIsValid = false;
                }
                if (layout == "" || layout == null) {
                    $(currentWidget.lblprintlayout).css("display", "block");
                    formIsValid = false;
                }
                if (formIsValid == false) {
                    return;
                }

                for (var i = 0; i < currentWidget.layoutoptions.length; i++) {
                    if (currentWidget.layoutoptions[i].name.includes(layout)) {
                        layout = currentWidget.layoutoptions[i].name;
                    }
                }

                var LegendLayers = [];
                var legendLayer;

                dojo.map(currentWidget.map.graphicsLayerIds, function (layerId) {
                    
                    var templayer = currentWidget.map.getLayer(layerId)
                    if (typeof (templayer._name) != "undefined") {
                        if (templayer._name.startsWith("PointLayer") == true) {
                            legendLayer = new LegendLayer();
                            legendLayer.layerId = templayer.id;
                            //legendLayer.subLayerIds = [templayer.id]
                            LegendLayers.push(legendLayer);
                        }
                    }

                });
                
                var template = new PrintTemplate();
                template.format = format;
                template.layout = layout;
                template.preserveScale = true;
                template.label = title + "     ";
                template.outScale = currentWidget.map.getScale();
                template.showLabels = true;
                template.layoutOptions = {
                    authorText: configOptions.widgets.printWidget.authorText,  //this.authorText,
                    copyrightText: configOptions.widgets.printWidget.copyrightText, //this.copyrightText,
                    legendLayers: LegendLayers,
                    titleText: title,
                    scalebarUnit: "Kilometers", //layoutForm.scalebarUnit
                    customTextElements: [{ CreatedBy: configOptions.UserInfo.UserName }],
                    legendOptions: {
                        "operationalLayers": LegendLayers
                    }
                };
                this.printparams.template = template;
                var fileHandel = this.printTask.execute(this.printparams);
                var result = new PrintResultDijit({

                    count: this.count.toString(),

                    icon: (format === 'PDF') ? this.pdfIcon : this.imageIcon,
                    docName: title,
                    title: format + ', ' + layout,
                    fileHandle: fileHandel
                }).placeAt(this.printResultsNode, 'last');

                result.startup();
                this.count++;

            }
            catch (e) {
                console.log(e);
            }
        },
        _getLegendLayers: function () {
            var hasLegend = lang.getObject('layoutOptions.hasLegend', false, null);
            var enabledLegend = this.layoutForm.legend.length > 0 && this.layoutForm.legend[0];
            if (this.printTask && !this.printTask._createOperationalLayers) {
                // if don't have _createOptionalLayers function
                var legendLayers = [];
                if (hasLegend && enabledLegend) {
                    var legends = arcgisUtils.getLegendLayers({ map: this.map, itemInfo: this.map.itemInfo });
                    legendLayers = array.map(legends, function (legend) {
                        return {
                            layerId: legend.layer.id
                        };
                    });
                }

                return legendLayers;
            } else {
                return (hasLegend && enabledLegend) ? null : [];
            }
        },
        clearResults: function () {
            var currentWidget = this;
            topic.publish('mapClickMode/setCurrent', 'print');
            domConstruct.empty(this.printResultsNode);

            this.count = 1;

            //clearing values
            $(currentWidget.title).val("");
            $(currentWidget.format).val("");
            $(currentWidget.layout).val("")
            $(currentWidget.format)[0].sumo.reload();
            $(currentWidget.layout)[0].sumo.reload();

        },

    });

    // Print result dijit
    var PrintResultDijit = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

        widgetsInTemplate: true,
        templateString: printResultTemplate,
        url: null,
        startup: function () {
            this.inherited(arguments);
        },
        postCreate: function () {

            this.inherited(arguments);
            this.fileHandle.then(lang.hitch(this, '_onPrintComplete'), lang.hitch(this, '_onPrintError'));
        },
        _onPrintComplete: function (data) {

            if (data.url) {
                this.url = data.url;
                this.nameNode.innerHTML = '<span class="bold">' + this.docName + '</span>';
                domClass.add(this.resultNode, 'printResultHover');
            } else {
                this._onPrintError('Error, try again');
            }
        },
        _onPrintError: function (err) {
            console.log(err)
            topic.publish('viewer/handleError', {
                source: 'Print',
                error: err
            });
            this.nameNode.innerHTML = '<span class="bold">Error, try again</span>';
            domClass.add(this.resultNode, 'printResultError');
        },
        _openPrint: function (evt) {
            if (evt.target.className != 'fas fa-times') {
                if (this.url !== null) {
                    window.open(this.url);
                }
            }

        },
        Clearprint: function (event) {
            event.target.closest("tr").remove()
        }
    });
    return PrintDijit;
});