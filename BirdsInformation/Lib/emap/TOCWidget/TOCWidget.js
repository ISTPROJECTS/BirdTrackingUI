define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    "esri/layers/FeatureLayer",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/RasterLayer",
    "esri/layers/ArcGISImageServiceLayer",
    "esri/layers/MapImageLayer",
    "esri/layers/ImageParameters",
    "esri/layers/GraphicsLayer",
    "esri/symbols/TextSymbol",
    "esri/layers/LabelClass",
    'dojo/_base/lang',
    'dojo/topic',
    "esri/Color",
    "dojo/text!emap/TOCWidget/templates/TOCWidget.html",

    "dojo/i18n!emap/TOCWidget/nls/Resource"

], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, FeatureLayer, ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer,
    RasterLayer, ArcGISImageServiceLayer, MapImageLayer, ImageParameters, GraphicsLayer, TextSymbol, LabelClass, lang, topic, Color, dijitTemplate, i18n) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: dijitTemplate,
        widgetsInTemplate: true,
        i18n: i18n,
        map: null,
        operationalLayers: null,
        globalcurrentwidget: null,
        graphicstyles: null,
        title: i18n.title,
        domNode: null,
        ServiceUrl: null,
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

            $(document).on('click', '.PopUpCard', function (event) {
                event.stopPropagation();
            });

            $(document).on('click', '.SettingsDiv', function (e) {

                $(".TOCLineColor").colorpicker({
                    displayIndicator: false
                });
                $(".TOCPointColor").colorpicker({
                    displayIndicator: false
                });
                $(".TOCTextColor").colorpicker({
                    displayIndicator: false
                });
                $(".TOCArrowColor").colorpicker({
                    displayIndicator: false
                });
                $(".TOCMCPColor").colorpicker({
                    displayIndicator: false
                });
                var h;
                $(".PopUpCard").fadeOut();

                if ((e.pageY + $('.PopUpCard').height()) < ($(window).height() + window.pageYOffset)) h = e.pageY;
                else h = e.pageY - $('.PopUpCard').height();
                $(this).find('.PopUpCard').offset({ top: h }).fadeIn();
                //e.stopImmediatePropagation();
                //event.stopPropagation();
            });

            topic.subscribe('routing/LayerUpdate', lang.hitch(this, function (LinelayerId, PointlayerId, TextlayerId, className) {
                var LineLayerRow = $(currentWidget.DataLayerList).find('tr.tr' + LinelayerId);
                LineLayerRow.children()[2].innerHTML = '';
                var layerhtml = currentWidget.GetLinePopUpHtml(LinelayerId, className);
                LineLayerRow.children()[2].innerHTML = layerhtml;

                var PointLayerRow = $(currentWidget.DataLayerList).find('tr.tr' + PointlayerId);
                PointLayerRow.children()[2].innerHTML = '';
                var rowclass = "tr" + PointlayerId.split('(')[0];
                $("." + rowclass).remove();
                var TextLayerRow = $(currentWidget.DataLayerList).find('tr.tr' + TextlayerId);
                TextLayerRow.children()[2].innerHTML = '';
                var layerhtml = currentWidget.GetTextPopUpHtml(TextlayerId, className);
                TextLayerRow.children()[2].innerHTML = layerhtml;
            }));
            topic.subscribe('Density/LayerOff', lang.hitch(this, function (DensitylayerId, PointDensitylayerId, TextDensitylayerId) {
                globalcurrentWidget.map.getLayer(DensitylayerId).setVisibility(false);
                globalcurrentWidget.map.getLayer(PointDensitylayerId).setVisibility(false);
                globalcurrentWidget.map.getLayer(TextDensitylayerId).setVisibility(false);
                $("#" + DensitylayerId).prop('checked', false);
                $("#" + PointDensitylayerId).prop('checked', false);
                $("#" + TextDensitylayerId).prop('checked', false);
            }));
            topic.subscribe('RunBird/LayerOn', lang.hitch(this, function (AddBirdlayerId, AddBirdPointlayerId, TextAddBirdlayerId) {
                globalcurrentWidget.map.getLayer(AddBirdlayerId).setVisibility(true);
                globalcurrentWidget.map.getLayer(AddBirdPointlayerId).setVisibility(true);
                globalcurrentWidget.map.getLayer(TextAddBirdlayerId).setVisibility(true);
                $("#" + AddBirdlayerId).prop('checked', true);
                $("#" + AddBirdPointlayerId).prop('checked', true);
                $("#" + TextAddBirdlayerId).prop('checked', true);
            }));
            globalcurrentwidget = this;
            var colorIndex = 0;
            var colorslist = ["#ff0000", "#ffff00", "#00ff00", "#0000ff", "#ff0066", "#ffffff", "#000000", "#9900cc", "#00ffcc", "#cc33ff", " #ccff66", "#339966", '#FFA07A', '#FF7F50', '#7CFC00', '#E0FFFF', '#B0E0E6', '#E6E6FA', '#FFC0CB', '#FFFFFF', '#DCDCDC', '#FFF8DC', '#FA8072', '#FF6347', '#7FFF00', '#00FFFF', '#ADD8E6', '#D8BFD8', '#FFB6C1', '#FFFAFA', '#D3D3D3', '#FFEBCD', '#E9967A', '#FF4500', '#32CD32', '#00FFFF', '#87CEFA', '#DDA0DD', '#FF69B4', '#F0FFF0', '#C0C0C0', '#FFE4C4', '#F08080', '#FFD700', '#00FF00', '#7FFFD4', '#87CEEB', '#EE82EE', '#FF1493', '#F5FFFA', '#A9A9A9', '#FFDEAD', '#CD5C5C', '#FFA500', '#228B22', '#66CDAA', '#00BFFF', '#DA70D6', '#DB7093', '#F0FFFF', '#808080', '#F5DEB3', '#DC143C', '#FF8C00', '#008000', '#AFEEEE', '#B0C4DE', '#FF00FF', '#C71585', '#F0F8FF', '#696969', '#DEB887', '#B22222', '#A52A2A', '#006400', '#40E0D0', '#1E90FF', '#FF00FF', '#800000', '#F8F8FF', '#778899', '#D2B48C', '#FF0000', '#A0522D', '#ADFF2F', '#48D1CC', '#6495ED', '#BA55D3', '#D2691E', '#F5F5F5', '#708090', '#BC8F8F', '#8B0000', '#483D8B', '#9ACD32', '#00CED1', '#4682B4', '#9370DB', '#FFE4E1', '#FFF5EE', '#2F4F4F', '#F4A460', '#FFF0F5', '#6B8E23', '#00FF7F', '#20B2AA', '#4169E1', '#8A2BE2', '#6A5ACD', '#F5F5DC', '#000000', '#DAA520', '#191970', '#4B0082', '#00FA9A', '#5F9EA0', '#0000FF', '#9400D3', '#556B2F', '#FDF5E6', '#7B68EE', '#CD853F', '#3CB371', '#000080', '#90EE90', '#008B8B', '#0000CD', '#9932CC', '#808000', '#FFFAF0', '#8FBC8F', '#FAF0E6', '#000080', '#800080', '#98FB98', '#008080', '#00008B', '#8B008B', '#2E8B57', '#FFFFF0', '#000080', '#3CB371'];
            graphicstyles = {
                grlinestyle: null,
                grpointstyle: null,
                grpointrender: null,
                arrowcolor: colorslist[colorIndex],
                linecolor: colorslist[colorIndex],
                linewidth: "2",
                pointcolor: colorslist[colorIndex],
                pointsize: "7",
                labelcolor: colorslist[colorIndex],
                fontsize: "10",
                fontname: "Courier"
            }
            $(document).on('click', '.closePop', function (e) {
                $(this).closest(".PopUpCard").hide();
                e.stopImmediatePropagation();
            });
            currentWidget.map.on("layer-add-result", function (evt) {
                var layerid = evt.layer.id;
                var LayerName;
                if (layerid.indexOf("Birds Layer") >= 0) {
                    var trClassName = "tr" + layerid.split('(')[0];

                    var pgDir = document.getElementsByTagName('html');
                    if (pgDir[0].dir == 'rtl' || pgDir[0].style.direction == 'rtl') {
                        LayerName = "طبقة الطيور";
                    }
                    else {
                        LayerName = "Birds Layer";
                    }

                    var layerHtml = "<tr class='" + trClassName + "' > <td width='90%'>" + LayerName + "</td>";
                    if (layerid.indexOf("Birds Layer") >= 0) {
                        layerHtml += "<td class='AlignRight'><div class='form-check form-switch'><input type='checkbox' id='" + layerid + "'";
                    }
                    else {
                        layerHtml += "<td class='AlignRight'><div class='form-check form-switch'><input type='checkbox'  id='" + layerid + "'";
                    }
                    layerHtml += " class='layerdisplaystatus form-check-input'  /></div></td>";

                    $(currentWidget.layerlist).find('tbody:last-child').append(layerHtml + "</tr>");

                    evt.layer.setVisibility(layerid.indexOf("Birds Layer") > 0 ? true : false);
                    if (evt.layer.length > 0) {
                        if (evt.layer.id.indexOf("Birds Layer") == -1) {
                            evt.layer.setVisibility(true);
                        }
                    }
                }
            });
            currentWidget.map.on("layers-add-result", function (evt) {
                var layerHtml;
                var LayerName;
                for (var i = 0; i < evt.layers.length; i++) {
                    var layerid = evt.layers[i].layer.id;
                    LayerName = layerid;
                    var pgDir = document.getElementsByTagName('html');
                    
                        for (var l = 0; l < configOptions.TocLayerNames.length; l++) {
                            if (layerid == configOptions.TocLayerNames[l].layername_En) {
                                if (pgDir[0].dir == 'rtl' || pgDir[0].style.direction == 'rtl') {
                                    LayerName = configOptions.TocLayerNames[l].layername_Ar;

                                }
                                else {
                                    LayerName = configOptions.TocLayerNames[l].layername_En;
                                }
                                break;
                            }
                        }
                        
                    
                    var className = evt.layers[i].layer.className;
                    var trClassName = "tr" + layerid.split('(')[0];
                    layerHtml = "<tr class='" + trClassName + "' > <td width='90%'>" + LayerName + "</td>";
                    
                    

                    if (evt.layers[i].layer.id.indexOf("_L") >= 0 || evt.layers[i].layer.id.indexOf("_P") >= 0 || evt.layers[i].layer.id.indexOf("_T") >= 0 || evt.layers[i].layer.id.indexOf("StopOverArea_") >= 0 || evt.layers[i].layer.id.indexOf("SO_Symbols") >= 0 || evt.layers[i].layer.id.indexOf('MCPLayer') >= 0) {
                        layerHtml += "<td class='AlignRight'><div class='form-check form-switch'><input type='checkbox'  id='" + layerid + "' checked";
                    }
                    else {
                        layerHtml += "<td class='AlignRight'><div class='form-check form-switch'><input type='checkbox'  id='" + layerid + "'";
                    }
                    layerHtml += " class='layerdisplaystatus form-check-input'  /></div></td>";
                    if (evt.layers[i].layer.id.indexOf("_L") >= 0) {
                        $(".dataLayersSubHeading").css("display", "block");
                        $(globalcurrentwidget.DataLayerList).css("display", "block");
                        layerHtml += "<td>";
                        layerHtml += globalcurrentwidget.GetLinePopUpHtml(layerid, className);
                        layerHtml += "</td>";
                        $(currentWidget.DataLayerList).find('tbody:last-child').append(layerHtml + "</tr>");
                    }
                    else if (evt.layers[i].layer.id.indexOf("_P") >= 0) {
                        layerHtml += "<td>";
                        layerHtml += globalcurrentwidget.GetPointPopUpHtml(layerid, className);
                        layerHtml += "</td>";
                        $(currentWidget.DataLayerList).find('tbody:last-child').append(layerHtml + "</tr>");
                    }
                    else if (evt.layers[i].layer.id.indexOf("_T") >= 0) {
                        layerHtml += "<td>";
                        layerHtml += globalcurrentwidget.GetTextPopUpHtml(layerid, className);
                        layerHtml += "</td>";
                        $(currentWidget.DataLayerList).find('tbody:last-child').append(layerHtml + "</tr>");
                    }
                    else if (evt.layers[i].layer.id.indexOf('MCPLayer') >= 0) {
                        layerHtml += "<td>";
                        layerHtml += globalcurrentwidget.GetMCPPopUpHtml(layerid, className);
                        layerHtml += "</td>";
                        $(currentWidget.DataLayerList).find('tbody:last-child').append(layerHtml + "</tr>");
                    }
                    else {
                        $(currentWidget.layerlist).find('tbody:last-child').append(layerHtml + "</tr>");
                    }
                    $("#layerlist > tbody:last-child").append(layerHtml + "</tr>");
                }
            });

            function changeLayerDisplayStatus(id) {
                if (id.indexOf("_P") >= 0) {
                    var layersInfo = globalcurrentwidget.map.graphicsLayerIds;
                    for (var i = layersInfo.length - 1; i >= 0; i--) {
                        var layer = map.getLayer(layersInfo[i]);
                        if (layer != null) {
                            if (layer.id == "Feature_" + id) {
                                layer.setVisibility(!globalcurrentwidget.map.getLayer(id).visible);
                            }
                        }
                    }
                }
                if (typeof (globalcurrentwidget.map.getLayer(id)) != 'undefined') {
                    globalcurrentwidget.map.getLayer(id).setVisibility(!globalcurrentwidget.map.getLayer(id).visible);
                }
            }
            $(currentWidget.layerlist).on('click', ".layerdisplaystatus", function (obj) {
                var layerid = obj.target.id;
                changeLayerDisplayStatus(layerid);
            });
            $(currentWidget.DataLayerList).on('click', ".layerdisplaystatus", function (obj) {
                var layerid = obj.target.id;
                changeLayerDisplayStatus(layerid);
            });
        },
        CreateFontsDropdown: function (id) {
            var result = "<select id='" + id + "font' onchange='changeFont(this.value,\"" + id + "\")'>";
            result += "<option value='Courier'>Courier</option>";
            result += "<option value='Comic Sans'>Comic Sans</option>";
            result += "<option value='Times New Roman'>Times New Roman</option>";
            result += "<option value='Helvetica'>Helvetica</option>";
            result += "<option selected value='Verdana'>Verdana</option>";
            result += "<option  value='Gill Sans'>Gill Sans</option>";
            result += "<option value='sans-serif'>sans-serif</option>";
            result += "</select>";
            return result;
        },

        GetLinePopUpHtml: function (layerid, className) {
            var colors = className.split("_");
            var ArrowColor = className.split("_");
            var layerHtml = '<div class="SettingsDiv" id="' + layerid + '"> <i class="fas fa-cog pl-2 gear"></i>';
            layerHtml += '<div class="PopUpCard">';
            layerHtml += '<div class="demoPanel ui-widget ui-widget-content ui-corner-all">';
            layerHtml += '<div class="SubHeading">Select Attributes<span class="closePop"><i class="fas fa-times"></i></span> </div>';
            layerHtml += '<div class="form-group ">';
            layerHtml += '<label style="width:30%; float:left;">Line Color</label>';
            if (colors.length > 0) {
                for (var i = 0; i < colors.length; i++) {
                    if (colors[i] != "") {
                        layerHtml += "<input current-color='" + colors[i] + "' id='" + layerid + "color" + i + "' value='" + colors[i] + "' onchange='changeColor(this,this.value,\"" + layerid + "\")' class='form-control TOCLineColor' style='float:left' />";
                    }
                }
            }
            layerHtml += '</div>';
            layerHtml += '<div class="form-group">';
            layerHtml += '<label style="width:30%; float:left">Arrow Color</label>';
            if (ArrowColor.length > 0) {
                for (var i = 0; i < ArrowColor.length; i++) {
                    if (ArrowColor[i] != "") {
                        layerHtml += "<input current-Arrowcolor='" + ArrowColor[i] + "' id='" + layerid + "Arrow" + i + "' value='" + ArrowColor[i] + "' onchange='changeArrowColor(this,this.value,\"" + layerid + "\")' class='form-control TOCArrowColor' style='float:left' />";
                    }
                }
            }
            layerHtml += '</div>';
            layerHtml += '<div class="form-group d-flex">  <label style="width:30%; float:left">Line Width</label>'
            layerHtml += "<input id='" + layerid + "size' class='form-control' onchange = 'changeLineWidth(this.value,\"" + layerid + "\")' value = '" + graphicstyles.linewidth + "' type='number' style='float:left' />";
            layerHtml += '</div>';
            layerHtml += '</div> </div> </div>';
            return layerHtml;
        },
        GetPointPopUpHtml: function (layerid, className) {
            var colors = className.split("_");
            var layerHtml = '<div class="SettingsDiv" id="' + layerid + '"> <i class="fas fa-cog pl-2 gear"></i>';
            layerHtml += '<div class="PopUpCard">';
            layerHtml += '<div class="demoPanel ui-widget ui-widget-content ui-corner-all">';
            layerHtml += '<div class="SubHeading">Select Attributes<span class="closePop"><i class="fas fa-times"></i></span> </div>';
            layerHtml += '<div class="form-group">';
            layerHtml += '<label style="width:30%; float:left">Point Color</label>';
            if (colors.length > 0) {
                for (var i = 0; i < colors.length; i++) {
                    if (colors[i] != "") {
                        layerHtml += "<input current-color='" + colors[i] + "' id='" + layerid + "color" + i + "' value='" + colors[i] + "' onchange='changeColor(this,this.value,\"" + layerid + "\")' class='form-control TOCPointColor' style='float:left' />";
                    }
                }
            }
            layerHtml += '</div>';
            layerHtml += '<div class="form-group d-flex">  <label style="width:30%; float:left">Point Width</label>'
            layerHtml += "<input id='" + layerid + "size' class='form-control' onchange = 'changePointSize(this.value,\"" + layerid + "\")' value = '" + graphicstyles.pointsize + "' type='number' style='float:left' />";
            layerHtml += '</div>';
            layerHtml += '</div> </div> </div>';
            return layerHtml;
        },
        GetTextPopUpHtml: function (layerid, className) {
            var Textcolors = className.split("_");
            var layerHtml = '<div class="SettingsDiv"  id="' + layerid + '"> <i class="fas fa-cog pl-2 gear"></i>';
            layerHtml += '<div class="PopUpCard">';
            layerHtml += '<div class="demoPanel ui-widget ui-widget-content ui-corner-all">';
            layerHtml += '<div class="SubHeading">Select Attributes<span class="closePop"><i class="fas fa-times"></i></span> </div>';
            layerHtml += '<div class="form-group">';
            layerHtml += '<label style="width:30%; float:left">Color</label>';
            if (Textcolors.length > 0) {
                for (var i = 0; i < Textcolors.length; i++) {
                    if (Textcolors[i] != "") {
                        layerHtml += "<input current-color='" + Textcolors[i] + "' id='" + layerid + "color" + i + "' value='" + Textcolors[i] + "' onchange='changeColor(this,this.value,\"" + layerid + "\")' class='form-control TOCTextColor' style='float:left' />";
                    }
                }
            }
            layerHtml += '</div>';
            layerHtml += '<div class="form-group d-flex">  <label style="width:30%; float:left">Font</label>'
            layerHtml += "<select id='" + layerid + "font' style='width:140px !important' class='form-control' onchange='changeFont(this.value,\"" + layerid + "\")'>";
            layerHtml += "<option value='Courier'>Courier</option>";
            layerHtml += "<option value='Comic Sans'>Comic Sans</option>";
            layerHtml += "<option value='Times New Roman'>Times New Roman</option>";
            layerHtml += "<option value='Helvetica'>Helvetica</option>";
            layerHtml += "<option selected value='Verdana'>Verdana</option>";
            layerHtml += "<option  value='Gill Sans'>Gill Sans</option>";
            layerHtml += "<option value='sans-serif'>sans-serif</option>";
            layerHtml += "</select>";

            layerHtml += '</div>';
            layerHtml += '<div class="form-group d-flex">  <label style="width:30%; float:left">Size</label>'
            layerHtml += "<input id='" + layerid + "size' class='form-control' onchange = 'changeLableSize(this.value,\"" + layerid + "\")' value = '" + graphicstyles.fontsize + "' type='number' style='float:left' />";
            layerHtml += '</div>';
            layerHtml += '</div> </div> </div>';
            return layerHtml;

        },


        GetMCPPopUpHtml: function (layerid, className) {
            var layerHtml = '<div class="SettingsDiv"  id="' + layerid + '"> <i class="fas fa-cog pl-2 gear"></i>';
            layerHtml += '<div class="PopUpCard">';
            layerHtml += '<div class="demoPanel ui-widget ui-widget-content ui-corner-all">';
            layerHtml += '<div class="SubHeading">Select Attributes<span class="closePop"><i class="fas fa-times"></i></span> </div>';
            layerHtml += '<div class="form-group">';
            layerHtml += '<label style="width:30%; float:left">Color</label>';
            if (className != "") {
                layerHtml += "<input current-color='" + className + "' id='" + layerid + "color" + i + "' value='" + className + "' onchange='changeColor(this,this.value,\"" + layerid + "\")' class='form-control TOCMCPColor' style='float:left' />";
            }
            layerHtml += '</div>';
            layerHtml += '</div> </div> </div>';
            return layerHtml;
        },

        startup: function () {
            var currentWidget = this;
            currentWidget.createTOC(currentWidget.map, currentWidget.operationalLayers);
        },

        createTOC: function (CurrentMap, operationalLayers) {
            var currentwidget = this;
            try {
                var layerControlLayerInfos = [];
                var layer;
                for (var i = 0; i < operationalLayers.length; i++) {
                    if (operationalLayers[i].type == 'dynamic') {
                        layer = new ArcGISDynamicMapServiceLayer(operationalLayers[i].url, operationalLayers[i].options, operationalLayers[i].options.visible);
                        
                    }
                    else if (operationalLayers[i].type == 'tiled') {
                        layer = new ArcGISTiledMapServiceLayer(operationalLayers[i].url, operationalLayers[i].options, operationalLayers[i].options.visible);
                        
                    }
                    else if (operationalLayers[i].type == 'feature') {
                        var url = operationalLayers[i].url;
                        if (url.includes("{token}"))
                            url = url.replace("{token}", currentwidget.Token);

                        layer = new FeatureLayer(url, {
                            id: operationalLayers[i].options.id,
                            mode: FeatureLayer.MODE_ONDEMAND,
                            outFields: operationalLayers[i].options.outFields,
                            visible: operationalLayers[i].options.visible,
                        });

                        if (typeof (operationalLayers[i].labelExpressionInfo) != "undefined") {
                            var label = new TextSymbol().setColor(esri.Color.fromHex(operationalLayers[i].labelExpressionInfo.color));
                            label.font.setSize(operationalLayers[i].labelExpressionInfo.fontSize);
                            label.font.setFamily(operationalLayers[i].labelExpressionInfo.fontFamily);

                            var json = {
                                "labelExpressionInfo": operationalLayers[i].labelExpressionInfo.labelvalue,
                            };

                            var labelClass = new LabelClass(json);
                            labelClass.symbol = label; // symbol also can be set in LabelClass' json
                            layer.setLabelingInfo([labelClass]);
                        }
                    }
                    else if (operationalLayers[i].type == 'image') {
                        var imageParameters = new ImageParameters();
                        imageParameters.format = "jpeg"; //set the image type to PNG24, note default is PNG8.
                        //Takes a URL to a non cached map service.
                        layer = new ArcGISDynamicMapServiceLayer(
                            operationalLayers[i].url,
                            {
                                id: operationalLayers[i].options.id,
                                opacity: 0.5,
                                imageParameters: imageParameters,
                                visible: operationalLayers[i].options.visible,

                            }
                        );
                    }
                    layerControlLayerInfos.push(layer);
                }
                CurrentMap.addLayers(layerControlLayerInfos);
            }
            catch (e) {
                console.log("Error while creating TOC:" + e);
            }
        }




    });
});