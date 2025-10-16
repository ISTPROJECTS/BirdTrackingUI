define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/text!../Basemaps/templates/Basemaps.html',
    'esri/dijit/BasemapGallery',
    'esri/dijit/BasemapLayer',
    'esri/dijit/Basemap',
    'dojo/i18n!emap/Basemaps/nls/resource',
    'xstyle/css!../Basemaps/css/Basemaps.css'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, template, BasemapGallery, BasemapLayer, Basemap, i18n) {

    
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        widgetsInTemplate: true,
        i18n: i18n,
        map:null,
        title: i18n.title,
        domNode:null,
        configOptions:null,
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
        },
        startup: function () {
            var currentWidget = this;
            var basemapLayer, basemap;
            var basemapGalleryOptions = currentWidget.configOptions;
            basemapGallery = new BasemapGallery({
                showArcGISBasemaps: false,
                map: map

            }, this.basemapGalleryNode);
            var Landsat8_Layer = new esri.dijit.BasemapLayer({
                url: this.configOptions.Landsat8.url

            });
            var Landsat8 = new esri.dijit.Basemap({
                layers: [Landsat8_Layer],
                title: this.i18n.Landsat8,
                thumbnailUrl: this.configOptions.Landsat8.thumbnailUrl
            });           

            var wordlElevations_Layer = new esri.dijit.BasemapLayer({
                url: this.configOptions.Elevations.url
            });

            var wordlElevations = new esri.dijit.Basemap({
                layers: [wordlElevations_Layer],
                title: this.i18n.Elevations,
                thumbnailUrl: this.configOptions.Elevations.thumbnailUrl
            });

            var shadedRelief_Layer = new esri.dijit.BasemapLayer({
                url: this.configOptions.ShdRelif.url
            });

            var shadedRelif = new esri.dijit.Basemap({
                layers: [shadedRelief_Layer],
                title: this.i18n.ShadedRelief,
                thumbnailUrl: this.configOptions.ShdRelif.thumbnailUrl
            });

            var worldBoundries_Layer = new esri.dijit.BasemapLayer({
                /*url: "https://enviroportal.ead.ae/server/rest/services/BirdTracking/WorldBoundaries/MapServer?token=9-rpczzWMhCrGVPvVFSXCgyxH4x_0uLBRSzYAkZ0th-fowAwOU4G9Qmkppg9xTHA"*/
                url: this.configOptions.WorldBoundries.url
            });

            var worldBoundries = new esri.dijit.Basemap({
                layers: [worldBoundries_Layer],
                title: this.i18n.WorldBoundries,
                thumbnailUrl: this.configOptions.WorldBoundries.thumbnailUrl
            });

            var adsicBasemap_Layer = new esri.dijit.BasemapLayer({
                url: this.configOptions.AdsicBaseMap.url
            });

            var adsicBasemap = new esri.dijit.Basemap({
                layers: [adsicBasemap_Layer],
                title: this.i18n.AdsicBaseMap,
                thumbnailUrl: this.configOptions.AdsicBaseMap.thumbnailUrl
            });           

            var googleStreets = new esri.dijit.Basemap({
                layers: [new esri.dijit.BasemapLayer({
                    type: "WebTiledLayer",
                    url: this.configOptions.googlestreets.url,
                    copyright: "Google Maps"
                })],
                id: "gmapstreets",
                thumbnailUrl: this.configOptions.googlestreets.thumbnailUrl,
                title: this.i18n.googlestreets,
            });
            var Imagery_Layer = new esri.dijit.BasemapLayer({
                url: this.configOptions.Imagery.url
            });

            var imagery = new esri.dijit.Basemap({
                layers: [Imagery_Layer],
                title: this.i18n.Imagery,
                thumbnailUrl: this.configOptions.Imagery.thumbnailUrl
            });

            var openStreetMap = new esri.dijit.Basemap({
                layers: [new esri.dijit.BasemapLayer({
                    opacity: 1,
                    title: "OpenStreetMap",
                    visibility: true,
                    layerType: "OpenStreetMap",
                    type: "OpenStreetMap",
                    //id: "OpenStreetMap"
                })],
                id: "OpenStreetMap",
                thumbnailUrl: this.configOptions.OpenStreetMap.thumbnailUrl,
                title: this.i18n.OpenStreetMap,
            });

            var LightGrayCanvas_Layer = new esri.dijit.BasemapLayer({
                url: this.configOptions.LightGrayCanvas.url
            });

            var lightgreycanvas = new esri.dijit.Basemap({
                layers: [LightGrayCanvas_Layer],
                title: this.i18n.LightGrayCanvas,
                thumbnailUrl: this.configOptions.LightGrayCanvas.thumbnailUrl
            });

            var Oceans_Layer = new esri.dijit.BasemapLayer({
                url: this.configOptions.Oceans.url
            });

            var Oceans = new esri.dijit.Basemap({
                layers: [Oceans_Layer],
                title: this.i18n.Oceans,
                thumbnailUrl: this.configOptions.Oceans.thumbnailUrl
            });

            var NationalGeographic_Layer = new esri.dijit.BasemapLayer({
                url: this.configOptions.NationalGeographic.url
            });

            var GeograhicLayer = new esri.dijit.Basemap({
                layers: [NationalGeographic_Layer],
                title: this.i18n.NationalGeographic,
                thumbnailUrl: this.configOptions.NationalGeographic.thumbnailUrl
            });

            var DarkGrayCanvas_Layer = new esri.dijit.BasemapLayer({
                url: this.configOptions.DarkGrayCanvas.url
            });

            var darkgreycanvas = new esri.dijit.Basemap({
                layers: [DarkGrayCanvas_Layer],
                title: this.i18n.DarkGrayCanvas,
                thumbnailUrl: this.configOptions.DarkGrayCanvas.thumbnailUrl
            });

            var Streets_Layer = new esri.dijit.BasemapLayer({
                url: this.configOptions.Streets.url
            });

            var Streets = new esri.dijit.Basemap({
                layers: [Streets_Layer],
                title: this.i18n.Streets,
                thumbnailUrl: this.configOptions.Streets.thumbnailUrl
            });

            var Topographic_Layer = new esri.dijit.BasemapLayer({
                url: this.configOptions.Topographic.url
            });

            var topographic = new esri.dijit.Basemap({
                layers: [Topographic_Layer],
                title: this.i18n.Topographic,
                thumbnailUrl: this.configOptions.Topographic.thumbnailUrl
            });

            var ImagerywithLabels_Layer = new esri.dijit.BasemapLayer({
                url: this.configOptions.ImagerywithLabels.url
            });

            var imageryLabels = new esri.dijit.Basemap({
                layers: [
                    {
                        "opacity": 1,
                        "title": "World Imagery",
                        "url": "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
                        "visibility": true,
                        "layerType": "ArcGISTiledMapServiceLayer",
                        "id": "World_Imagery_6611",
                        "serviceInfoResponse": {
                            "currentVersion": 10.91,
                            "serviceDescription": "World Imagery provides one meter or better satellite and aerial imagery in many parts of the world and lower resolution satellite imagery worldwide. The map includes 15m TerraColor imagery at small and mid-scales (~1:591M down to ~1:288k) for the world. The map features Maxar imagery at 0.3m resolution for select metropolitan areas around the world, 0.5m resolution across the United States and parts of Western Europe, and 1m resolution imagery across the rest of the world. In addition to commercial sources, the World Imagery map features high-resolution aerial photography contributed by the GIS User Community. This imagery ranges from 0.3m to 0.03m resolution (down to ~1:280 in select communities). For more information on this map, including the terms of use, visit us <a href=\"http://goto.arcgisonline.com/maps/World_Imagery \" target=\"_new\" >online</a>.",
                            "mapName": "Layers",
                            "description": "World Imagery provides one meter or better satellite and aerial imagery in many parts of the world and lower resolution satellite imagery worldwide. The map includes 15m TerraColor imagery at small and mid-scales (~1:591M down to ~1:288k) for the world. The map features Maxar imagery at 0.3m resolution for select metropolitan areas around the world, 0.5m resolution across the United States and parts of Western Europe, and 1m resolution imagery across the rest of the world. In addition to commercial sources, the World Imagery map features high-resolution aerial photography contributed by the GIS User Community. This imagery ranges from 0.3m to 0.03m resolution (down to ~1:280 in select communities). For more information on this map, including the terms of use, visit us online at http://goto.arcgisonline.com/maps/World_Imagery",
                            "copyrightText": "Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
                            "supportsDynamicLayers": false,
                            "layers": [
                                {
                                    "id": 0,
                                    "name": "World Imagery",
                                    "parentLayerId": -1,
                                    "defaultVisibility": true,
                                    "subLayerIds": null,
                                    "minScale": 0,
                                    "maxScale": 0,
                                    "type": "Feature Layer",
                                    "geometryType": "esriGeometryPolygon"
                                },
                                {
                                    "id": 1,
                                    "name": "Low Resolution 15m Imagery",
                                    "parentLayerId": -1,
                                    "defaultVisibility": true,
                                    "subLayerIds": null,
                                    "minScale": 0,
                                    "maxScale": 0,
                                    "type": "Feature Layer",
                                    "geometryType": "esriGeometryPolygon"
                                },
                                {
                                    "id": 2,
                                    "name": "High Resolution 60cm Imagery",
                                    "parentLayerId": -1,
                                    "defaultVisibility": true,
                                    "subLayerIds": null,
                                    "minScale": 0,
                                    "maxScale": 0,
                                    "type": "Feature Layer",
                                    "geometryType": "esriGeometryPolygon"
                                },
                                {
                                    "id": 3,
                                    "name": "High Resolution 30cm Imagery",
                                    "parentLayerId": -1,
                                    "defaultVisibility": true,
                                    "subLayerIds": null,
                                    "minScale": 0,
                                    "maxScale": 0,
                                    "type": "Feature Layer",
                                    "geometryType": "esriGeometryPolygon"
                                },
                                {
                                    "id": 4,
                                    "name": "Citations",
                                    "parentLayerId": -1,
                                    "defaultVisibility": true,
                                    "subLayerIds": null,
                                    "minScale": 0,
                                    "maxScale": 0,
                                    "type": "Feature Layer",
                                    "geometryType": "esriGeometryPolygon"
                                },
                                {
                                    "id": 5,
                                    "name": "1.9cm Resolution Metadata",
                                    "parentLayerId": -1,
                                    "defaultVisibility": true,
                                    "subLayerIds": null,
                                    "minScale": 106,
                                    "maxScale": 0,
                                    "type": "Feature Layer",
                                    "geometryType": "esriGeometryPolygon"
                                },
                                {
                                    "id": 6,
                                    "name": "3.7cm Resolution Metadata",
                                    "parentLayerId": -1,
                                    "defaultVisibility": true,
                                    "subLayerIds": null,
                                    "minScale": 212,
                                    "maxScale": 106,
                                    "type": "Feature Layer",
                                    "geometryType": "esriGeometryPolygon"
                                },
                                {
                                    "id": 7,
                                    "name": "7.5cm Resolution Metadata",
                                    "parentLayerId": -1,
                                    "defaultVisibility": true,
                                    "subLayerIds": null,
                                    "minScale": 425,
                                    "maxScale": 212,
                                    "type": "Feature Layer",
                                    "geometryType": "esriGeometryPolygon"
                                },
                                {
                                    "id": 8,
                                    "name": "15cm Resolution Metadata",
                                    "parentLayerId": -1,
                                    "defaultVisibility": true,
                                    "subLayerIds": null,
                                    "minScale": 850,
                                    "maxScale": 425,
                                    "type": "Feature Layer",
                                    "geometryType": "esriGeometryPolygon"
                                },
                                {
                                    "id": 9,
                                    "name": "30cm Resolution Metadata",
                                    "parentLayerId": -1,
                                    "defaultVisibility": true,
                                    "subLayerIds": null,
                                    "minScale": 1700,
                                    "maxScale": 850,
                                    "type": "Feature Layer",
                                    "geometryType": "esriGeometryPolygon"
                                },
                                {
                                    "id": 10,
                                    "name": "60cm Resolution Metadata",
                                    "parentLayerId": -1,
                                    "defaultVisibility": true,
                                    "subLayerIds": null,
                                    "minScale": 3400,
                                    "maxScale": 1700,
                                    "type": "Feature Layer",
                                    "geometryType": "esriGeometryPolygon"
                                },
                                {
                                    "id": 11,
                                    "name": "1.2m Resolution Metadata",
                                    "parentLayerId": -1,
                                    "defaultVisibility": true,
                                    "subLayerIds": null,
                                    "minScale": 6800,
                                    "maxScale": 3400,
                                    "type": "Feature Layer",
                                    "geometryType": "esriGeometryPolygon"
                                },
                                {
                                    "id": 12,
                                    "name": "2.4m Resolution Metadata",
                                    "parentLayerId": -1,
                                    "defaultVisibility": true,
                                    "subLayerIds": null,
                                    "minScale": 13500,
                                    "maxScale": 6800,
                                    "type": "Feature Layer",
                                    "geometryType": "esriGeometryPolygon"
                                },
                                {
                                    "id": 13,
                                    "name": "4.8m Resolution Metadata",
                                    "parentLayerId": -1,
                                    "defaultVisibility": true,
                                    "subLayerIds": null,
                                    "minScale": 27000,
                                    "maxScale": 13500,
                                    "type": "Feature Layer",
                                    "geometryType": "esriGeometryPolygon"
                                },
                                {
                                    "id": 14,
                                    "name": "9.6m Resolution Metadata",
                                    "parentLayerId": -1,
                                    "defaultVisibility": true,
                                    "subLayerIds": null,
                                    "minScale": 54000,
                                    "maxScale": 27000,
                                    "type": "Feature Layer",
                                    "geometryType": "esriGeometryPolygon"
                                },
                                {
                                    "id": 15,
                                    "name": "19m Resolution Metadata",
                                    "parentLayerId": -1,
                                    "defaultVisibility": true,
                                    "subLayerIds": null,
                                    "minScale": 108000,
                                    "maxScale": 54000,
                                    "type": "Feature Layer",
                                    "geometryType": "esriGeometryPolygon"
                                },
                                {
                                    "id": 16,
                                    "name": "38m Resolution Metadata",
                                    "parentLayerId": -1,
                                    "defaultVisibility": true,
                                    "subLayerIds": null,
                                    "minScale": 216000,
                                    "maxScale": 108000,
                                    "type": "Feature Layer",
                                    "geometryType": "esriGeometryPolygon"
                                },
                                {
                                    "id": 17,
                                    "name": "75m Resolution Metadata",
                                    "parentLayerId": -1,
                                    "defaultVisibility": true,
                                    "subLayerIds": null,
                                    "minScale": 432000,
                                    "maxScale": 216000,
                                    "type": "Feature Layer",
                                    "geometryType": "esriGeometryPolygon"
                                },
                                {
                                    "id": 18,
                                    "name": "150m Resolution Metadata",
                                    "parentLayerId": -1,
                                    "defaultVisibility": true,
                                    "subLayerIds": null,
                                    "minScale": 0,
                                    "maxScale": 432000,
                                    "type": "Feature Layer",
                                    "geometryType": "esriGeometryPolygon"
                                }
                            ],
                            "tables": [],
                            "spatialReference": {
                                "wkid": 102100,
                                "latestWkid": 3857
                            },
                            "singleFusedMapCache": true,
                            "tileInfo": {
                                "rows": 256,
                                "cols": 256,
                                "dpi": 96,
                                "format": "JPEG",
                                "compressionQuality": 90,
                                "origin": {
                                    "x": -20037508.342787,
                                    "y": 20037508.342787
                                },
                                "spatialReference": {
                                    "wkid": 102100,
                                    "latestWkid": 3857
                                },
                                "lods": [
                                    {
                                        "level": 0,
                                        "resolution": 156543.03392800014,
                                        "scale": 591657527.591555
                                    },
                                    {
                                        "level": 1,
                                        "resolution": 78271.51696399994,
                                        "scale": 295828763.795777
                                    },
                                    {
                                        "level": 2,
                                        "resolution": 39135.75848200009,
                                        "scale": 147914381.897889
                                    },
                                    {
                                        "level": 3,
                                        "resolution": 19567.87924099992,
                                        "scale": 73957190.948944
                                    },
                                    {
                                        "level": 4,
                                        "resolution": 9783.93962049996,
                                        "scale": 36978595.474472
                                    },
                                    {
                                        "level": 5,
                                        "resolution": 4891.96981024998,
                                        "scale": 18489297.737236
                                    },
                                    {
                                        "level": 6,
                                        "resolution": 2445.98490512499,
                                        "scale": 9244648.868618
                                    },
                                    {
                                        "level": 7,
                                        "resolution": 1222.992452562495,
                                        "scale": 4622324.434309
                                    },
                                    {
                                        "level": 8,
                                        "resolution": 611.4962262813797,
                                        "scale": 2311162.217155
                                    },
                                    {
                                        "level": 9,
                                        "resolution": 305.74811314055756,
                                        "scale": 1155581.108577
                                    },
                                    {
                                        "level": 10,
                                        "resolution": 152.87405657041106,
                                        "scale": 577790.554289
                                    },
                                    {
                                        "level": 11,
                                        "resolution": 76.43702828507324,
                                        "scale": 288895.277144
                                    },
                                    {
                                        "level": 12,
                                        "resolution": 38.21851414253662,
                                        "scale": 144447.638572
                                    },
                                    {
                                        "level": 13,
                                        "resolution": 19.10925707126831,
                                        "scale": 72223.819286
                                    },
                                    {
                                        "level": 14,
                                        "resolution": 9.554628535634155,
                                        "scale": 36111.909643
                                    },
                                    {
                                        "level": 15,
                                        "resolution": 4.77731426794937,
                                        "scale": 18055.954822
                                    },
                                    {
                                        "level": 16,
                                        "resolution": 2.388657133974685,
                                        "scale": 9027.977411
                                    },
                                    {
                                        "level": 17,
                                        "resolution": 1.1943285668550503,
                                        "scale": 4513.988705
                                    },
                                    {
                                        "level": 18,
                                        "resolution": 0.5971642835598172,
                                        "scale": 2256.994353
                                    },
                                    {
                                        "level": 19,
                                        "resolution": 0.29858214164761665,
                                        "scale": 1128.497176
                                    },
                                    {
                                        "level": 20,
                                        "resolution": 0.14929107082380833,
                                        "scale": 564.248588
                                    },
                                    {
                                        "level": 21,
                                        "resolution": 0.07464553541190416,
                                        "scale": 282.124294
                                    },
                                    {
                                        "level": 22,
                                        "resolution": 0.03732276770595208,
                                        "scale": 141.062147
                                    },
                                    {
                                        "level": 23,
                                        "resolution": 0.01866138385297604,
                                        "scale": 70.5310735
                                    }
                                ]
                            },
                            "initialExtent": {
                                "xmin": -27465501.425151497,
                                "ymin": -19971868.88040859,
                                "xmax": 27465501.425151497,
                                "ymax": 19971868.880408563,
                                "spatialReference": {
                                    "cs": "pcs",
                                    "wkid": 102100
                                }
                            },
                            "fullExtent": {
                                "xmin": -20037507.22959434,
                                "ymin": -19971868.88040859,
                                "xmax": 20037507.22959434,
                                "ymax": 19971868.880408563,
                                "spatialReference": {
                                    "cs": "pcs",
                                    "wkid": 102100
                                }
                            },
                            "minScale": 0,
                            "maxScale": 0,
                            "units": "esriMeters",
                            "supportedImageFormatTypes": "PNG32,PNG24,PNG,JPG,DIB,TIFF,EMF,PS,PDF,GIF,SVG,SVGZ,BMP",
                            "documentInfo": {
                                "Title": "World Imagery",
                                "Author": "Esri",
                                "Comments": "",
                                "Subject": "imagery, satellite, aerial, 500m (World), 15m (World)",
                                "Category": "imageryBaseMapsEarthCover (Imagery, basemaps, and land cover)",
                                "AntialiasingMode": "None",
                                "TextAntialiasingMode": "Force",
                                "Keywords": "World,Global,United States"
                            },
                            "capabilities": "Map,Tilemap,Query,Data",
                            "supportedQueryFormats": "JSON, geoJSON",
                            "exportTilesAllowed": false,
                            "referenceScale": 0,
                            "datumTransformations": [
                                {
                                    "geoTransforms": [
                                        {
                                            "wkid": 108001,
                                            "latestWkid": 1241,
                                            "transformForward": true,
                                            "name": "NAD_1927_To_NAD_1983_NADCON"
                                        }
                                    ]
                                },
                                {
                                    "geoTransforms": [
                                        {
                                            "wkid": 108001,
                                            "latestWkid": 1241,
                                            "transformForward": false,
                                            "name": "NAD_1927_To_NAD_1983_NADCON"
                                        }
                                    ]
                                }
                            ],
                            "supportsDatumTransformation": true,
                            "maxRecordCount": 100,
                            "maxImageHeight": 4096,
                            "maxImageWidth": 4096,
                            "supportedExtensions": "KmlServer"
                        }
                    },
                    {
                        "opacity": 1,
                        "title": "World Boundaries and Places",
                        "url": "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer",
                        "visibility": true,
                        "layerType": "ArcGISTiledMapServiceLayer",
                        "isReference": true,
                        "id": "World_Boundaries_and_Places_1145"
                    }
                ],
                title: this.i18n.ImagerywithLabels,
                thumbnailUrl: this.configOptions.ImagerywithLabels.thumbnailUrl
            });

            var TerrainwithLabels_Layer = new esri.dijit.BasemapLayer({
                url: this.configOptions.TerrainwithLabels.url
            });

            var terrainLabels = new esri.dijit.Basemap({
                layers: [
                    {
                        "opacity": 1,
                        "title": "World Terrain Base",
                        "url": "https://services.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer",
                        "visibility": true,
                        "layerType": "ArcGISTiledMapServiceLayer",
                        "id": "World_Terrain_Base_3",
                        "serviceInfoResponse": {
                            "currentVersion": 10.91,
                            "serviceDescription": "This map is designed to be used as a base map by GIS professionals to overlay other thematic layers such as demographics or land cover. The base map features shaded relief imagery, bathymetry, and coastal water features designed to provide a neutral background for other data layers. The map was compiled from a variety of sources from several data providers, including the U.S. Geological Survey, NOAA, and Esri. The base map currently provides coverage for the world down to a scale of ~1:1m and coverage for the continental United States and Hawaii to a scale of ~1:70k. For more information on this map, including the terms of use, visit us <a href=\"http://goto.arcgisonline.com/maps/World_Terrain_Base \" target=\"_new\" >online</a>.",
                            "mapName": "Layers",
                            "description": "This map is designed to be used as a base map by GIS professionals to overlay other thematic layers such as demographics or land cover. The base map features shaded relief imagery, bathymetry, and coastal water features designed to provide a neutral background for other data layers. The map was compiled from a variety of sources from several data providers, including the U.S. Geological Survey, NOAA, and Esri. The base map currently provides coverage for the world down to a scale of ~1:1m and coverage for the continental United States and Hawaii to a scale of ~1:70k. For more information on this map, including our terms of use, visit us online at http://goto.arcgisonline.com/maps/World_Terrain_Base",
                            "copyrightText": "Sources: Esri, USGS, NOAA",
                            "supportsDynamicLayers": false,
                            "layers": [
                                {
                                    "id": 0,
                                    "name": "World Terrain Base",
                                    "parentLayerId": -1,
                                    "defaultVisibility": true,
                                    "subLayerIds": null,
                                    "minScale": 0,
                                    "maxScale": 0,
                                    "type": "Feature Layer",
                                    "geometryType": "esriGeometryPolygon"
                                }
                            ],
                            "tables": [],
                            "spatialReference": {
                                "wkid": 102100,
                                "latestWkid": 3857
                            },
                            "singleFusedMapCache": true,
                            "tileInfo": {
                                "rows": 256,
                                "cols": 256,
                                "dpi": 96,
                                "format": "JPEG",
                                "compressionQuality": 90,
                                "origin": {
                                    "x": -20037508.342787,
                                    "y": 20037508.342787
                                },
                                "spatialReference": {
                                    "wkid": 102100,
                                    "latestWkid": 3857
                                },
                                "lods": [
                                    {
                                        "level": 0,
                                        "resolution": 156543.03392800014,
                                        "scale": 591657527.591555
                                    },
                                    {
                                        "level": 1,
                                        "resolution": 78271.51696399994,
                                        "scale": 295828763.795777
                                    },
                                    {
                                        "level": 2,
                                        "resolution": 39135.75848200009,
                                        "scale": 147914381.897889
                                    },
                                    {
                                        "level": 3,
                                        "resolution": 19567.87924099992,
                                        "scale": 73957190.948944
                                    },
                                    {
                                        "level": 4,
                                        "resolution": 9783.93962049996,
                                        "scale": 36978595.474472
                                    },
                                    {
                                        "level": 5,
                                        "resolution": 4891.96981024998,
                                        "scale": 18489297.737236
                                    },
                                    {
                                        "level": 6,
                                        "resolution": 2445.98490512499,
                                        "scale": 9244648.868618
                                    },
                                    {
                                        "level": 7,
                                        "resolution": 1222.992452562495,
                                        "scale": 4622324.434309
                                    },
                                    {
                                        "level": 8,
                                        "resolution": 611.4962262813797,
                                        "scale": 2311162.217155
                                    },
                                    {
                                        "level": 9,
                                        "resolution": 305.74811314055756,
                                        "scale": 1155581.108577
                                    },
                                    {
                                        "level": 10,
                                        "resolution": 152.87405657041106,
                                        "scale": 577790.554289
                                    },
                                    {
                                        "level": 11,
                                        "resolution": 76.43702828507324,
                                        "scale": 288895.277144
                                    },
                                    {
                                        "level": 12,
                                        "resolution": 38.21851414253662,
                                        "scale": 144447.638572
                                    },
                                    {
                                        "level": 13,
                                        "resolution": 19.10925707126831,
                                        "scale": 72223.819286
                                    }
                                ]
                            },
                            "initialExtent": {
                                "xmin": -22616419.79422824,
                                "ymin": -16445800.995315773,
                                "xmax": 22616419.79422824,
                                "ymax": 16445800.995315796,
                                "spatialReference": {
                                    "cs": "pcs",
                                    "wkid": 102100
                                }
                            },
                            "fullExtent": {
                                "xmin": -20037507.067161843,
                                "ymin": -19971868.8804086,
                                "xmax": 20037507.067161843,
                                "ymax": 19971868.88040863,
                                "spatialReference": {
                                    "cs": "pcs",
                                    "wkid": 102100
                                }
                            },
                            "minScale": 0,
                            "maxScale": 0,
                            "units": "esriMeters",
                            "supportedImageFormatTypes": "PNG32,PNG24,PNG,JPG,DIB,TIFF,EMF,PS,PDF,GIF,SVG,SVGZ,BMP",
                            "documentInfo": {
                                "Title": "World Terrain Base",
                                "Author": "Esri",
                                "Comments": "",
                                "Subject": "",
                                "Category": "",
                                "AntialiasingMode": "None",
                                "TextAntialiasingMode": "Force",
                                "Keywords": "World,Global,Europe,Japan,Hong Kong,North America,United States,Canada,Mexico,Southern Africa,Asia,South America,Australia,New Zealand,India,Argentina,Brazil,Chile,Venezuela,Andorra,Austria,Belgium,Czech Republic,Denmark,France,Germany,Great Britain,Greece,Hungary,Ireland,Italy,Luxembourg,Netherlands,Norway,Poland,Portugal,San Marino,Slovakia,Spain,Sweden,Switzerland,Russia,Thailand,Turkey"
                            },
                            "capabilities": "Map,Tilemap",
                            "supportedQueryFormats": "JSON, geoJSON",
                            "exportTilesAllowed": false,
                            "referenceScale": 0,
                            "datumTransformations": [
                                {
                                    "geoTransforms": [
                                        {
                                            "wkid": 108001,
                                            "latestWkid": 1241,
                                            "transformForward": true,
                                            "name": "NAD_1927_To_NAD_1983_NADCON"
                                        }
                                    ]
                                },
                                {
                                    "geoTransforms": [
                                        {
                                            "wkid": 108001,
                                            "latestWkid": 1241,
                                            "transformForward": false,
                                            "name": "NAD_1927_To_NAD_1983_NADCON"
                                        }
                                    ]
                                }
                            ],
                            "supportsDatumTransformation": true,
                            "maxRecordCount": 1000,
                            "maxImageHeight": 4096,
                            "maxImageWidth": 4096,
                            "supportedExtensions": "KmlServer"
                        }
                    },
                    {
                        "opacity": 1,
                        "title": "World Terrain Reference",
                        "url": "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer",
                        "visibility": true,
                        "layerType": "ArcGISTiledMapServiceLayer",
                        "isReference": true,
                        "id": "World_Reference_Overlay_5790"
                    }
                ],
                title: this.i18n.TerrainwithLabels,
                thumbnailUrl: this.configOptions.TerrainwithLabels.thumbnailUrl
            });
            basemapGallery.add(Landsat8);
            basemapGallery.add(wordlElevations);
            basemapGallery.add(shadedRelif);
            basemapGallery.add(worldBoundries);
            basemapGallery.add(adsicBasemap);
            basemapGallery.add(googleStreets);


            //basemapGallery.add(adsic);
            basemapGallery.add(terrainLabels);
            basemapGallery.add(imageryLabels);
            basemapGallery.add(topographic);
            basemapGallery.add(Streets);
            basemapGallery.add(darkgreycanvas);
            basemapGallery.add(GeograhicLayer);
            basemapGallery.add(lightgreycanvas);
            basemapGallery.add(Oceans);
            basemapGallery.add(openStreetMap);
            basemapGallery.add(imagery);

            
            basemapGallery.startup();
            

        }
    });
});