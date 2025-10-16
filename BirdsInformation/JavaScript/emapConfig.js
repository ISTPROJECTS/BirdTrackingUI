var CurrentMapHostName = "//enviroportal.ead.ae/server/rest/services/"
/*//var CurrentRasterHostName = "https://gis5.smartgeoapps.com/server/rest/services/";*/
configOptions = {
    CurrentMap: null,
    mcpresults: [],
    CurrentMapDefaultCommand: 'nocommand',
    ServiceUrl: "//localhost:53925/Service1.svc/",

    geometryService: CurrentMapHostName + "/Utilities/Geometry/GeometryServer",
    basemapUrlSatelite: document.location.protocol + "//geoportal.abudhabi.ae/rest/services/BaseMapSatellite50cm/MapServer",
    basemapUrlNOC: document.location.protocol + "//services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
    basemapUrlArabic: document.location.protocol + "//geoportal.abudhabi.ae/rest/services/BaseMapArabic/MapServer",
    stopOverGpService: "https://azurestgenviroportal.ead.ae/server/rest/services/BirdTracking/StopOver/GPServer/StopOver",
    currentBasemap: [],
    mapCenter: [54.224812, 24.123512],
    Zoom: 8,
    CurrentYear: "2022",


    WorldBoundaryService: "https://enviroportal.ead.ae/server/rest/services/BirdTracking/WorldBoundaries/MapServer/0?token=E8iDqzSMoGmTZaud4xESCvwWhe6LtG30zZYd-BsRl4fNozRCW97i4eDaPzt-CEVL",
    operationalLayers: [
        {
            type: 'feature',
            url: "https://gis6.smartgeoapps.com/server/rest/services/BT/Bird_Boundary_Polygons/MapServer/0",
            title: 'BonellisEagle',
            slider: true,
            noLegend: false,
            collapsed: false,
            sublayerToggle: true,
            identify: true,
            layerDefs: false,
            options: {
                id: 'BonellisEagle',
                className: 'BonellisEagle',
                opacity: 1.0,
                visible: false,
                outfields: ["*"]

            },
            identifyLayerInfos: {
                layerIds: [0]
            },
            labelExpressionInfo:
            {
                labelvalue: { "value": "{CntryName}" },
                color: "#000000",
                fontSize: "10pt",
                fontFamily: "Arial",
                useCodedValues: false,
            }

        },
        {
            type: 'feature',
            url: "https://gis6.smartgeoapps.com/server/rest/services/BT/Bird_Boundary_Polygons/MapServer/2",
            title: 'Greater Spotted Eagle',
            slider: true,
            noLegend: false,
            collapsed: false,
            sublayerToggle: true,
            identify: true,
            layerDefs: false,
            options: {
                id: 'Greater Spotted Eagle',
                className: 'Greater Spotted Eagle',
                opacity: 1.0,
                visible: false,
                outfields: ["*"]

            },
            identifyLayerInfos: {
                layerIds: [0]
            },
            labelExpressionInfo:
            {
                labelvalue: { "value": "{CntryName}" },
                color: "#000000",
                fontSize: "10pt",
                fontFamily: "Arial",
                useCodedValues: false,
            }

        },
        {
            type: 'feature',
            url: "https://gis6.smartgeoapps.com/server/rest/services/BT/Bird_Boundary_Polygons/MapServer/6",
            title: 'Crab Plover',
            slider: true,
            noLegend: false,
            collapsed: false,
            sublayerToggle: true,
            identify: true,
            layerDefs: false,
            options: {
                id: 'Crab Plover',
                className: 'Crab Plover',
                opacity: 1.0,
                visible: false,
                outfields: ["*"]

            },
            identifyLayerInfos: {
                layerIds: [0]
            },
            labelExpressionInfo:
            {
                labelvalue: { "value": "{CntryName}" },
                color: "#000000",
                fontSize: "10pt",
                fontFamily: "Arial",
                useCodedValues: false,
            }

        },
        {
            type: 'feature',
            url: "https://gis6.smartgeoapps.com/server/rest/services/BT/Bird_Boundary_Polygons/MapServer/11",
            title: 'Greater Flamingo',
            slider: true,
            noLegend: false,
            collapsed: false,
            sublayerToggle: true,
            identify: true,
            layerDefs: false,
            options: {
                id: 'Greater Flamingo',
                className: 'Greater Flamingo',
                opacity: 1.0,
                visible: false,
                outfields: ["*"]

            },
            identifyLayerInfos: {
                layerIds: [0]
            },
            labelExpressionInfo:
            {
                labelvalue: { "value": "{CntryName}" },
                color: "#000000",
                fontSize: "10pt",
                fontFamily: "Arial",
                useCodedValues: false,
            }

        },
        {
            type: 'feature',
            url: "https://gis6.smartgeoapps.com/server/rest/services/BT/Bird_Boundary_Polygons/MapServer/12",
            title: 'Western Osprey',
            slider: true,
            noLegend: false,
            collapsed: false,
            sublayerToggle: true,
            identify: true,
            layerDefs: false,
            options: {
                id: 'Western Osprey',
                className: 'Western Osprey',
                opacity: 1.0,
                visible: false,
                outfields: ["*"]

            },
            identifyLayerInfos: {
                layerIds: [0]
            },
            labelExpressionInfo:
            {
                labelvalue: { "value": "{CntryName}" },
                color: "#000000",
                fontSize: "10pt",
                fontFamily: "Arial",
                useCodedValues: false,
            }

        },
        {
            type: 'feature',
            url: CurrentMapHostName + "BirdTracking/WorldBoundaries/MapServer/0?token=E8iDqzSMoGmTZaud4xESCvwWhe6LtG30zZYd-BsRl4fNozRCW97i4eDaPzt-CEVL",
            title: 'Country Boundries',
            slider: true,
            noLegend: false,
            collapsed: false,
            sublayerToggle: true,
            identify: true,
            layerDefs: false,
            options: {
                id: 'Country Boundaries',
                className: 'Country Boundaries',
                opacity: 1.0,
                visible: false,
                outfields: ["*"]

            },
            identifyLayerInfos: {
                layerIds: [0]
            },
            labelExpressionInfo:
            {
                labelvalue: { "value": "{CntryName}" },
                color: "#000000",
                fontSize: "10pt",
                fontFamily: "Arial",
                useCodedValues: false,
            }

        },
        {
            type: 'feature',
            url: CurrentMapHostName + "BirdTracking/WorldProtectedAreas/MapServer/0?token=E8iDqzSMoGmTZaud4xESCvwWhe6LtG30zZYd-BsRl4fNozRCW97i4eDaPzt-CEVL",
            title: 'World Protected Areas',
            slider: true,
            noLegend: false,
            collapsed: false,
            sublayerToggle: true,
            identify: true,
            layerDefs: false,
            options: {
                id: 'World Protected Areas',
                className: 'World Protected Areas',
                opacity: 1.0,
                visible: false,
                outfields: ["*"]

            },
            identifyLayerInfos: {
                layerIds: [0]
            },
            labelExpressionInfo:
            {
                labelvalue: { "value": "{NAME}" },
                color: "#000000",
                fontSize: "10pt",
                fontFamily: "Arial",
                useCodedValues: false,
                fieldInfos: '{fieldName: "{NAME }" }'
            }

        },

        {
            type: 'feature',
            url: CurrentMapHostName + "Enviroportal/ProtectedArea/MapServer/3",
            title: 'Forestry Area',
            slider: true,
            noLegend: false,
            collapsed: false,
            sublayerToggle: true,
            identify: false,
            layerDefs: false,
            options: {
                id: 'Forestry',
                className: 'Forestry',
                opacity: 1.0,
                visible: false,
                outfields: ["*"]

            },
        },
        {
            type: 'feature',
            url: CurrentMapHostName + "Enviroportal/ProtectedArea/MapServer/2",
            title: 'Protected Area',
            slider: true,
            noLegend: false,
            collapsed: false,
            sublayerToggle: true,
            identify: false,
            layerDefs: false,
            options: {
                id: 'Protected Area',
                className: 'ProtectedArea',
                opacity: 1.0,
                visible: false,
                outfields: ["*"]

            },
            identifyLayerInfos: {
                layerIds: [0]
            },
            labelExpressionInfo:
            {
                labelvalue: { "value": "{Name}" },
                color: "#fff",
                fontSize: "10pt",
                fontFamily: "Arial"
            }

        },
        {
            type: 'feature',
            url: CurrentMapHostName + "BirdTracking/WorldProtectedAreas/MapServer/1?token=E8iDqzSMoGmTZaud4xESCvwWhe6LtG30zZYd-BsRl4fNozRCW97i4eDaPzt-CEVL",
            title: 'Flyway Line',
            slider: true,
            noLegend: false,
            collapsed: false,
            sublayerToggle: true,
            identify: false,
            layerDefs: false,
            options: {
                id: 'Flyway Line',
                className: 'FlywayLine',
                opacity: 1.0,
                visible: false,
                outfields: ["*"]

            },
        }





    ],

    ///The layer names should be match with feature layer id
    TocLayerNames: [
        {
            "layername_En": "Protected Area",
            "layername_Ar": "المحميات الطبيعية",
        },
        {
            "layername_En": "Country Boundaries",
            "layername_Ar": "الحدود الدولية",
        },
        {
            "layername_En": "Forestry",
            "layername_Ar": "الغابات",
        },
        {
            "layername_En": "World Protected Areas",
            "layername_Ar": "المحميات الطبيعية العالمية",
        },
        {
            "layername_En": "Flyway Line",
            "layername_Ar": "خط الطيران",
        },
        {
            "layername_En": "Temperature",
            "layername_Ar": "درجة الحرارة",
        },
        {
            "layername_En": "U-Wind",
            "layername_Ar": "الرياح الأفقية",
        },
        {
            "layername_En": "V-Wind",
            "layername_Ar": "الرياح الرأسية",
        },
        {
            "layername_En": "Wind Direction",
            "layername_Ar": "اتجاه الرياح",
        }
    ],

    ///To display external dataset sub layer names in arabic
    TocSubLayerNames:[
        {
            "layername_En": "Noaa_WindDirection_2022",
            "layername_Ar": "Noaa_WindDirection_2022",
        },
        {
            "layername_En": "Noaa_WindDirection_2021",
            "layername_Ar": "Noaa_WindDirection_2021",
        },
        {
            "layername_En": "Noaa_WindDirection_2020",
            "layername_Ar": "Noaa_WindDirection_2020",
        },
        {
            "layername_En": "Noaa_WindDirection_2019",
            "layername_Ar": "Noaa_WindDirection_2019",
        },
        {
            "layername_En": "Noaa_WindDirection_2018",
            "layername_Ar": "Noaa_WindDirection_2018",
        },
        {
            "layername_En": "Noaa_WindDirection_2017",
            "layername_Ar": "Noaa_WindDirection_2017",
        },
        {
            "layername_En": "Noaa_WindDirection_2016",
            "layername_Ar": "Noaa_WindDirection_2016",
        },
        {
            "layername_En": "Noaa_WindDirection_2015",
            "layername_Ar": "Noaa_WindDirection_2015",
        },
        {
            "layername_En": "Noaa_WindDirection_2014",
            "layername_Ar": "Noaa_WindDirection_2014",
        },
        {
            "layername_En": "Noaa_WindDirection_2013",
            "layername_Ar": "Noaa_WindDirection_2013",
        },
        {
            "layername_En": "Noaa_WindDirection_2012",
            "layername_Ar": "Noaa_WindDirection_2012",
        },
        {
            "layername_En": "Noaa_WindDirection_2011",
            "layername_Ar": "Noaa_WindDirection_2011",
        },
        {
            "layername_En": "Noaa_WindDirection_2010",
            "layername_Ar": "Noaa_WindDirection_2010",
        },
        {
            "layername_En": "Noaa_WindDirection_2009",
            "layername_Ar": "Noaa_WindDirection_2009",
        },
        {
            "layername_En": "Noaa_WindDirection_2008",
            "layername_Ar": "Noaa_WindDirection_2008",
        },
        {
            "layername_En": "Noaa_WindDirection_2007",
            "layername_Ar": "Noaa_WindDirection_2007",
        },
        {
            "layername_En": "Noaa_WindDirection_2006",
            "layername_Ar": "Noaa_WindDirection_2006",
        },
        {
            "layername_En": "Noaa_WindDirection_2005",
            "layername_Ar": "Noaa_WindDirection_2005",
        },



        {
            "layername_En": "Noaa_Uwind_Layer_2022",
            "layername_Ar": "Noaa_Uwind_Layer_2022",
        },
        {
            "layername_En": "Noaa_Uwind_Layer_2021",
            "layername_Ar": "Noaa_Uwind_Layer_2021",
        },
        {
            "layername_En": "Noaa_Uwind_Layer_2020",
            "layername_Ar": "Noaa_Uwind_Layer_2020",
        },
        {
            "layername_En": "Noaa_Uwind_Layer_2019",
            "layername_Ar": "Noaa_Uwind_Layer_2019",
        },
        {
            "layername_En": "Noaa_Uwind_Layer_2018",
            "layername_Ar": "Noaa_Uwind_Layer_2018",
        },
        {
            "layername_En": "Noaa_Uwind_Layer_2017",
            "layername_Ar": "Noaa_Uwind_Layer_2017",
        },
        {
            "layername_En": "Noaa_Uwind_Layer_2016",
            "layername_Ar": "Noaa_Uwind_Layer_2016",
        },
        {
            "layername_En": "Noaa_Uwind_Layer_2015",
            "layername_Ar": "Noaa_Uwind_Layer_2015",
        },
        {
            "layername_En": "Noaa_Uwind_Layer_2014",
            "layername_Ar": "Noaa_Uwind_Layer_2014",
        },
        {
            "layername_En": "Noaa_Uwind_Layer_2013",
            "layername_Ar": "Noaa_Uwind_Layer_2013",
        },
        {
            "layername_En": "Noaa_Uwind_Layer_2012",
            "layername_Ar": "Noaa_Uwind_Layer_2012",
        },
        {
            "layername_En": "Noaa_Uwind_Layer_2011",
            "layername_Ar": "Noaa_Uwind_Layer_2011",
        },
        {
            "layername_En": "Noaa_Uwind_Layer_2010",
            "layername_Ar": "Noaa_Uwind_Layer_2010",
        },
        {
            "layername_En": "Noaa_Uwind_Layer_2009",
            "layername_Ar": "Noaa_Uwind_Layer_2009",
        },
        {
            "layername_En": "Noaa_Uwind_Layer_2008",
            "layername_Ar": "Noaa_Uwind_Layer_2008",
        },
        {
            "layername_En": "Noaa_Uwind_Layer_2007",
            "layername_Ar": "Noaa_Uwind_Layer_2007",
        },
        {
            "layername_En": "Noaa_Uwind_Layer_2006",
            "layername_Ar": "Noaa_Uwind_Layer_2006",
        },
        {
            "layername_En": "Noaa_Uwind_Layer_2005",
            "layername_Ar": "Noaa_Uwind_Layer_2005",
        },


        {
            "layername_En": "Noaa_Vwind_Layer_2022",
            "layername_Ar": "Noaa_Vwind_Layer_2022",
        },
        {
            "layername_En": "Noaa_Vwind_Layer_2021",
            "layername_Ar": "Noaa_Vwind_Layer_2021",
        },
        {
            "layername_En": "Noaa_Vwind_Layer_2020",
            "layername_Ar": "Noaa_Vwind_Layer_2020",
        },
        {
            "layername_En": "Noaa_Vwind_Layer_2019",
            "layername_Ar": "Noaa_Vwind_Layer_2019",
        },
        {
            "layername_En": "Noaa_Vwind_Layer_2018",
            "layername_Ar": "Noaa_Vwind_Layer_2018",
        },
        {
            "layername_En": "Noaa_Vwind_Layer_2017",
            "layername_Ar": "Noaa_Vwind_Layer_2017",
        },
        {
            "layername_En": "Noaa_Vwind_Layer_2016",
            "layername_Ar": "Noaa_Vwind_Layer_2016",
        },
        {
            "layername_En": "Noaa_Vwind_Layer_2015",
            "layername_Ar": "Noaa_Vwind_Layer_2015",
        },
        {
            "layername_En": "Noaa_Vwind_Layer_2014",
            "layername_Ar": "Noaa_Vwind_Layer_2014",
        },
        {
            "layername_En": "Noaa_Vwind_Layer_2013",
            "layername_Ar": "Noaa_Vwind_Layer_2013",
        },
        {
            "layername_En": "Noaa_Vwind_Layer_2012",
            "layername_Ar": "Noaa_Vwind_Layer_2012",
        },
        {
            "layername_En": "Noaa_Vwind_Layer_2011",
            "layername_Ar": "Noaa_Vwind_Layer_2011",
        },
        {
            "layername_En": "Noaa_Vwind_Layer_2010",
            "layername_Ar": "Noaa_Vwind_Layer_2010",
        },
        {
            "layername_En": "Noaa_Vwind_Layer_2009",
            "layername_Ar": "Noaa_Vwind_Layer_2009",
        },
        {
            "layername_En": "Noaa_Vwind_Layer_2008",
            "layername_Ar": "Noaa_Vwind_Layer_2008",
        },
        {
            "layername_En": "Noaa_Vwind_Layer_2007",
            "layername_Ar": "Noaa_Vwind_Layer_2007",
        },
        {
            "layername_En": "Noaa_Vwind_Layer_2006",
            "layername_Ar": "Noaa_Vwind_Layer_2006",
        },
        {
            "layername_En": "Noaa_Vwind_Layer_2005",
            "layername_Ar": "Noaa_Vwind_Layer_2005",
        },


        {
            "layername_En": "Noaa_Air_Temp_2022",
            "layername_Ar": "Noaa_Air_Temp_2022",
        },
        {
            "layername_En": "Noaa_Air_Temp_2021",
            "layername_Ar": "Noaa_Air_Temp_2021",
        },
        {
            "layername_En": "Noaa_Air_Temp_2020",
            "layername_Ar": "Noaa_Air_Temp_2020",
        },
        {
            "layername_En": "Noaa_Air_Temp_2019",
            "layername_Ar": "Noaa_Air_Temp_2019",
        },
        {
            "layername_En": "Noaa_Air_Temp_2018",
            "layername_Ar": "Noaa_Air_Temp_2018",
        },
        {
            "layername_En": "Noaa_Air_Temp_2017",
            "layername_Ar": "Noaa_Air_Temp_2017",
        },
        {
            "layername_En": "Noaa_Air_Temp_2016",
            "layername_Ar": "Noaa_Air_Temp_2016",
        },
        {
            "layername_En": "Noaa_Air_Temp_2015",
            "layername_Ar": "Noaa_Air_Temp_2015",
        },
        {
            "layername_En": "Noaa_Air_Temp_2014",
            "layername_Ar": "Noaa_Air_Temp_2014",
        },
        {
            "layername_En": "Noaa_Air_Temp_2013",
            "layername_Ar": "Noaa_Air_Temp_2013",
        },
        {
            "layername_En": "Noaa_Air_Temp_2012",
            "layername_Ar": "Noaa_Air_Temp_2012",
        },
        {
            "layername_En": "Noaa_Air_Temp_2011",
            "layername_Ar": "Noaa_Air_Temp_2011",
        },
        {
            "layername_En": "Noaa_Air_Temp_2010",
            "layername_Ar": "Noaa_Air_Temp_2010",
        },
        {
            "layername_En": "Noaa_Air_Temp_2009",
            "layername_Ar": "Noaa_Air_Temp_2009",
        },
        {
            "layername_En": "Noaa_Air_Temp_2008",
            "layername_Ar": "Noaa_Air_Temp_2008",
        },
        {
            "layername_En": "Noaa_Air_Temp_2007",
            "layername_Ar": "Noaa_Air_Temp_2007",
        },
        {
            "layername_En": "Noaa_Air_Temp_2006",
            "layername_Ar": "Noaa_Air_Temp_2006",
        },
        {
            "layername_En": "Noaa_Air_Temp_2005",
            "layername_Ar": "Noaa_Air_Temp_2005",
        }

    ],


    ExternalOperationalLayers1: [


        {
            type: 'dynamic',
            url: "https://enviroportal.ead.ae/arcgis/rest/services/Bird_Tracking/NOAA_AIRTEMPERATURE/MapServer",
           /* url: "https://gis5.smartgeoapps.com/server/rest/services/Noaa_Air_Temp_units/MapServer",*/
            title: 'Temperature',
            slider: true,
            noLegend: false,
            collapsed: false,
            sublayerToggle: true, //true to automatically turn on sublayers
            identify: false,
            layerDefs: false,
            options: {
                id: 'Temperature',
                className: 'Temperature',
                opacity: 1.0,
                visible: false

            },

        },

        {
            type: 'dynamic',
           /* url:"https://gis5.smartgeoapps.com/server/rest/services/Noaa_Uwind_Units/MapServer",*/
            url: "https://enviroportal.ead.ae/arcgis/rest/services/Bird_Tracking/Noaa_Uwind/MapServer",
            title: 'U-Wind',
            slider: true,
            noLegend: false,
            collapsed: false,
            sublayerToggle: true, //true to automatically turn on sublayers
            identify: true,
            layerDefs: false,
            options: {
                id: 'UWind',
                className: 'UWind',
                opacity: 1.0,
                visible: false

            },
            identifyLayerInfos: {
                layerIds: [0]
            },

        },
        {
            type: 'dynamic',
           /* url:"https://gis5.smartgeoapps.com/server/rest/services/Noaa_Vwind_Units/MapServer",*/
            url: "https://enviroportal.ead.ae/arcgis/rest/services/Bird_Tracking/NoaaVwind/MapServer",
            title: 'V-Wind',
            slider: true,
            noLegend: false,
            collapsed: false,
            sublayerToggle: true, //true to automatically turn on sublayers
            identify: true,
            layerDefs: false,
            options: {
                id: 'VWind',
                className: 'VWind',
                opacity: 1.0,
                visible: false

            },
            identifyLayerInfos: {
                layerIds: [0]
            },

        },
        {
            type: 'dynamic',
            /*url:"https://gis5.smartgeoapps.com/server/rest/services/Noaa_WindDirection_Units/MapServer",*/
            url: "https://enviroportal.ead.ae/arcgis/rest/services/Bird_Tracking/NoaaWindDirection/MapServer",
            title: 'Wind Direction',
            slider: true,
            noLegend: false,
            collapsed: false,
            sublayerToggle: true, //true to automatically turn on sublayers
            identify: true,
            layerDefs: false,
            options: {
                id: 'WindDirection',
                className: 'WindDirection',
                opacity: 1.0,
                visible: false

            },
            identifyLayerInfos: {
                layerIds: [0]
            },

        },
        

    ],

    SponsorandPublicID:[],

    BirdsData: {
        ArabianPartridge: {
            Desc: 'The Arabian Partridge Alectoris melanocephala is a Galliformes species which are ' +
                'also known as the game birds. As per IUCN the species is under Least Concern(LC) ' +
                'category. These are stout ground feeding birds that have been traditionally hunted ' +
                'for food. Arabian Partridge occurs naturally in Saudi Arabia, Yemen and Oman where ' +
                'it prefers stony and better vegetated ground in hills, mountains and plains from ' +
                'near sea- level to 3000m.',
        },
        CrabPlover: {
            img: '',
            Desc: 'Crab-plovers breed at two inaccessible island colonies in the UAE, but are common ' +
                   'passage migrants and winter visitors found regularly in a few locations, such as '+
                'Khor al- Beidah, Hulayla and the islands around Abu Dhabi City, including Futaisi '+
                'island. Occasionally, one or two birds are seen at Kalba or Dibba beach in spring.<br> ' +
                '<br>' +
                'The Crab-plover is unmistakable with its smart black and white plumage and the massive ' +
                'black bill. It is one of the birds most sought after by birdwatchers visiting the ' +
                'UAE and is quite easy to find in the right location. Flocks of Crab-plovers usually ' +
                'contain adult birds and juveniles begging for food. These young birds have the same ' +
                'plumage pattern as adults but with more grey on the crown and wings. The Crab-plover ' +
                'is a resident along the shores of Arabia and southern Iran; some wintering birds ' +
                'reach east Africa.'
        },
        EgyptianVulture: {
            Desc: 'Only one species of vulture, the Egyptian Vulture, is seen at all regularly in the ' +
                'UAE and then ordinarily only at Jebel Hafit, several often to be seen sitting on ' +
                'the mast near the summit. Their numbers have declined dramatically both here and ' +
                'in other parts of the world and the species is now considered endangered.<br> ' +
                '<br> ' +
                'The adult Egyptian Vulture is easy to identify on its creamy-white plumage with ' +
                'black flight feathers. Juvenile birds are all dark brown, immatures being somewhat ' +
                'mottled. In all ages, the small head and wedge-shaped tail are good field characters. ' +
                'Because of its large size, inexperienced birders sometimes mistake the Egyptian ' +
                'Vulture for an eagle.<br> ' +
                '<br> ' +
                'The Egyptian Vulture is distributed from southwest Europe and west Africa to central ' +
                'Asia and the Indian subcontinent.',
        },
        GreatCrestedTern: {
            Desc: 'Bill colour is one of the most important field characters of terns. These two species ' +
                'can be separated on bill colour and on their size. In the UAE Swift Tern breeds ' +
                'only on the island of Qarnein, a site now fully protected, but it is otherwise a ' +
                'common passage migrant and winter visitor. Most leave the Gulf in winter but it ' +
                'remains frequent along the East Coast.<br> ' +
                '<br> ' +
                'The Swift Tern is a large tern with a long, lemon to straw-coloured bill yearround. ' +
                'In a mixed flock of terns on the beach they stand out by their larger size, only ' +
                'Caspian Tern being bigger. In spring and summer the head is glossy black with a ' +
                'large crest; in winter the forehead turning whitish. This species may be seen both ' +
                'along sandy beaches and rocky coastlines.<br> ' +
                '<br> ' +
                'The Swift Tern is a resident and partial migrant from eastern Africa to Australia and Oceania.',
        },
        GoldenEagle: {
            Desc: 'The Golden Eagle is a very rare breeding resident restricted to the desert of the ' +
                'Empty Quarter near the border with Oman and Saudi Arabia. Less than five nesting ' +
                'pairs are known in the UAE.<br> ' +
                '<br> ' +
                'This is a powerful and majestic eagle. The name arises from the golden feathers ' +
                'on the back of the neck of the adults, this contrasting with the dark brown body ' +
                'and wings. Immature birds have a large, white patch in the wings and at the base ' +
                'of the tail. As the eagle grows older and attains adulthood, after six or seven ' +
                'years, these white patches gradually disappear. The female is larger than the male, ' +
                'as in many species of birds of prey. ' +
                '<br> ' +
                '<br> ' +
                'The Golden Eagle is widely distributed in North America, Eurasia and the Middle East.',
        },
        GreaterFlamingo: {
            Desc: 'The greater flamingo(Phoenicopterus roseus) is the most widespread species of the ' +
                'flamingo family. This is the largest species of flamingo, averaging 110–150 cm(43–59 ' +
                'in) tall and weighing 2–4 kg.Like all flamingos, this species lays a single chalky- white ' +
                'egg on a mud mound. Most of the plumage is pinkish white, but the wing coverts are ' +
                'red and the primary and secondary flight feathers are black. The bill is pink with ' +
                'a restricted black tip, and the legs are entirely pink. During the breeding season, ' +
                'greater flamingos increase the frequency of their spreading uropygial secretions ' +
                'over their feathers and thereby enhance their colour. The Greater Flamingo is a ' +
                'migratory bird, and its range stretches from the western Mediterranean Basin to ' +
                'Sri Lanka and South Africa. The UAE itself is not within its breeding route, but ' +
                'birds of the species have been settling in Al Wathba since 1998 to hatch and raise ' +
                'their young. The presence of flamingos on the site also contributed to Al Wathba’s ' +
                'recognition as a Ramsar site by intergovernmental sustainability organisation Ramsar ' +
                'Convention on Wetlands.',
        },
        GreaterSpottedEagle: {
            Desc: 'A globally threatened species, the Greater Spotted Eagle is a passage migrant and ' +
                'winter visitor. It is the commonest large eagle seen in the UAE, with up to five ' +
                'birds being seen in favoured sites, such as Ra’s al- Khor, Khor al- Beidah and Dhayah/ Rams. ' +
                'Coastal lagoons, extensive areas of mangrove and large wetlands, such as Al Wathba ' +
                'lake, are all suitable for wintering individuals.<br> ' +
                '<br> ' +
                'The majority of birds seen in the UAE are juveniles less than a year old. On perched ' +
                'birds the pale feather tips in the wings give a bold, chequer-spotted pattern. In ' +
                'flight, the leading half of the underwing is almost black and darker than the trailing ' +
                'half. A few Greater Spotted Eagles have pale creamy-rusty bodies and are referred ' +
                'to as the ‘fulvescens’ colour phase.<br> ' +
                '<br> ' +
                'The Greater Spotted Eagle breeds from eastern Europe to east Asia, wintering from ' +
                'Turkey and Arabia to southeast Asia.',
        },
        LevantSparrowhawk: {
            Desc: 'The sparrowhawk is a small bird of prey in the family Accipitridae. It is found ' +
                'throughout the temperate and subtropical parts of the Old World, it is a non- breeding ' +
                'winter visitor in the UAE. It has short, broad wings and a long tail, both adaptations ' +
                'to manoeuvring through trees. It can be found in any habitat and often hunts ' +
                'birds in towns and cities. It is a major predator of smaller woodland birds.',
        },
        MarshHarrier: {
            Desc: 'Although other birds of prey may visit farmlands, lakes and coastal wetlands the ' +
                'most typical and common is the Western Marsh Harrier. It is an abundant passage ' +
                'migrant and winter visitor to the UAE. This species is often common over farmlands ' +
                'and any lakeside reedbed, area of mangroves or wet grassland will usually support ' +
                'one or more Western Marsh Harriers patrolling for prey. ' +
                '<br> ' +
                '<br> ' +
                'The majority of Western Marsh Harriers seen in the UAE are immature and female birds. ' +
                'These are chocolate brown, variably pale, creamy-yellow on the crown, sometimes ' +
                'with cream also on the front of the wings. They can be told from other female harriers ' +
                'by the absence of white on the rump. Males are much greyer, with a tri-colour wing ' +
                'pattern. Birds fly low, gliding over reedbeds or farmland on wings held slightly ' +
                'up in a shallow V.<br> ' +
                '<br> ' +
                'The Western Marsh Harrier breeds from western Europe to central Asia and winters ' +
                'from western Africa to the Indian subcontinent.',
        },
        Osprey: {
            Desc: 'The osprey(Pandion haliaetus) is a large raptor, reaching more than 60 cm(24 in) ' +
                'in length and 180 cm(71 in) across the wings. It is brown on the upperparts and ' +
                'predominantly greyish on the head and underparts. The osprey' +"'"+'s diet consists almost ' +
                            'exclusively of fish. It possesses specialised physical characteristics and exhibits ' +
                'unique behaviour to assist in hunting and catching prey. The osprey is unusual in ' +
                'that it is a single living species that occurs nearly worldwide. Even the few subspecies ' +
                'are not unequivocally separable. It is a regional priority and a resident breeding ' +
                'species in the United Arab Emirates. Extensive surveys were conducted during the ' +
                '2007 breeding season to assess the current breeding status of Ospreys in the Abu ' +
                'Dhabi Emirate. A total of 61 sites were surveyed, which included 46 islands and ' +
                '15 coastal sites.Altogether 117 nests were recorded out of which 61 were active, ' +
                '47 inactive and nine were attended by birds that did not breed.Apart from the  ' +
                'nests, platforms erected to aid Osprey nesting at many sites have been successfully ' +
                'used. Out of almost 27 nests on platforms, 58% were active or attended.Despite ' +
                'increasing levels of disturbance on some of the key Osprey nesting sites, the  ' +
                            'number of Ospreys has remained stable, or possibly increased over the last decade.',
        },
        RedBilledTropicbird: {
            Desc: 'This magnificent seabird is a rare breeding visitor to a small number of offshore ' +
                'Gulf islands and is only very rarely seen from land. It is included here because ' +
                'of its rarity and beauty but you would be extraordinarily lucky to see one in the ' +
                'UAE. However, a boat trip to the Musandam, where several pairs breed(as with Sooty ' +
                'Falcons), would give you a reasonable chance.<br> ' +
                '<br> ' +
                'Red-billed Tropicbird is unmistakable if seen well – with black and white plumage, ' +
                'a bright red bill and inordinately long white tail streamers. It is an excellent ' +
                'flyer, spending most of its time at sea, coming ashore only to breed, with young ' +
                'leaving the nest in spring or early summer.<br> ' +
                '<br> ' +
                'The Red-billed Tropicbird is found mostly in tropical and sub-tropical waters in ' +
                'the Caribbean, Atlantic, the Arabian Gulf and northern Indian Ocean.',
        },
        SootyFalcon: {
            Desc: 'The Sooty Falcon is a summer visitor to islands off Abu Dhabi, with just five known ' +
                'pairs in the UAE in 2008. The population has now declined to the point where, unless ' +
                'protection is given to the last nesting sites, extinction is likely, if ' +
                'not certain. Very occasionally a migrant individual is noted onshore.<br> ' +
                '<br> ' +
                'Adult Sooty Falcons are easy to recognise by their uniformly dark, grey plumage, ' +
                'yellow bill and yellow eye ring. Immature birds have paler markings on the underside. ' +
                'Sooty Falcons are high speed flyers and catch migrant songbirds and other larger ' +
                'species in flight. Quails, nightjars, bee-eaters, hoopoes and shrikes have all been ' +
                'found at Sooty Falcon nests and larders. By late October most Sooty Falcons will ' +
                'have left the Gulf for their wintering grounds.<br ' +
                '<br> ' +
                'The Sooty Falcon breeds from northeast Africa to eastern Arabia and winters in Madagascar ' +
                'and southeast Africa.',
        },
        SootyGull: {
            Desc: 'The Sooty Gull is a breeding resident on just three or four of the UAE’s offshore ' +
                'islands. Outside the breeding season this species may gather in huge numbers on ' +
                'beaches all along the East Coast, as at Kalba and Fujairah.<br> ' +
                '<br> ' +
                'No other gull seen regularly in the UAE has an overall sooty-brown plumage. In breeding ' +
                'plumage the Sooty Gull has white markings on the neck and a colourful bill. Immature ' +
                'birds are dark grey-brown unlike immatures of other gulls that are brownish and ' +
                'scaly. The Sooty Gull is a familiar bird along the East Coast. gathering near fishing ' +
                'villages.<br> ' +
                '<br> ' +
                'The Sooty Gull is a resident in the Arabian Gulf region, Oman and the Red Sea.' 
        },
        Sparrowhawk: {
            Desc: 'Eurasian Sparrowhawk is a fairly common passage migrant and winter visitor. It is ' +
                'most common in large parks and on farmlands especially where trees or shelterbelts ' +
                'are present. It is normally found singly, often being most active toward dusk.<br> ' +
                '<br> ' +
                'The Eurasian Sparrowhawk is usually encountered by chance as the bird shoots at ' +
                'high speed over a field or through a plantation, in hot pursuit of a potential meal ' +
                '- birds up to the size of a dove. The upperparts are dark grey, underparts pale ' +
                'with numerous, horizontal dark bars. Females are larger than males. In flight the ' +
                'silhouette somewhat resembles that of a Common Cuckoo , but the head of the Eurasian ' +
                'Sparrowhawk is larger and the wings less pointed.<br> ' +
                '<br> ' +
                'The Eurasian Sparrowhawk breeds widely from western Europe to northeastern Asia. ' +
                'The Asian population is migratory wintering from northeastern Africa to southeastern Asia.'
        },
        SteppeEagle: {
            Desc: 'The Steppe Eagle is a rare passage migrant and winter visitor to the UAE. Identification ' +
                'of eagles can be difficult as the plumage varies with the age of the birds. Juvenile ' +
                'eagles have not moulted any flight or tail feathers and thus look immaculate. In ' +
                'Steppe Eagle at least four different age groups can be identified. Young birds, ' +
                'which are the most common in the UAE, can be recognised on the pale line down the ' +
                'centre of the wings and the pale, trailing edge of the wings and tail.<br> ' +
                '<br> ' +
                'The Steppe Eagle breeds in central Asia and winters in eastern Africa, Arabia and ' +
                'the Indian subcontinent.'
        },
        NorthernShoveler: {
            Desc: 'It has a large shovel- shaped bill, used to filter food. Both duck and drake(female and male) have this' +
                'outsized bill and the birds can be identified by this alone. The drake is colourful with his green head, white' +
                'neck and a large rusty- coloured patch on the side. The female ducks, are plain looking and brown. In ' +
                'flight, a pale blue wing- patch helps in the identification.'
        },
        NorthernPintail: {
            Desc: 'This is a fairly large duck with body size ~ 55cm. Its its name came from the male’s long, pointed' +
                'tail feathers. The neck is noticeably long and thin, and this, together with the long tail, gives the bird' +
                'a slim and elegant posture. It has a vertical white line on the brown neck and patterned flanks. The ' +
                'female is uniformly light brown, paler than other female ducks. In flight the long neck and pointed tail' +
                'are  excellent field marks."'
        },
        BartailedGodwit: {
            Desc: 'This large wader is easy to identify by its long legs and very long, slightly upturned bill. In ' +
                'autumn and winter it is uniformly grey, but by March the underparts change to a brick- red breeding plumage. The' +
                'tail has fine horizontal barring seen best when the bird is in flight.'
        },
        EurasianOystercatcher: {
            Desc: 'This large, black and white bird with bright red bill and legs is one of the most easily recognized waders seen on beaches. It' +
                ' is often found in small flocks feeding at the water’s edge. If disturbed, they fly off calling loudly to land further down ' +
                'the beach and resume feeding.'
        },

    },
    BirdsDataArabic: {
        ArabianPartridge: {
            BirdName:'دراج عربي',
            Desc: 'الدراج العربي Alectoris melanocephala هو نوع ينتمي لفصيلة الدجاجيات، وهي أيضاً من الطرائد المستخدمة في الصيد.' +
                'ووفقًا للاتحاد الدولي لحماية الطبيعة يعتبر هذا النوع من الأنواع غير المهددة(LC) ، وهي طيور أرضية شجاعة، ويتم اصطيادها تقليديًا للحصول على لحمها.' +
                'يتواجد الدراج بشكل طبيعي في المملكة العربية السعودية واليمن وسُلطنة عمان حيث يفضل الأرض الصخرية والمزروعة في التلال والجبال والسهول والواقعة في مستوى قريب من سطح البحر إلى 3000 متر.'
        },
        CrabPlover: {
            BirdName: 'الحنكور',
            Desc: ' يتكاثر الحنكور في مستعمرتين من الجزر يتعذر الوصول إليهما في دولة الإمارات العربية المتحدة، ولكنه مهاجر شائع وزائر شتوي يتواجد بانتظام في مواقع قليلة، مثل خور البيضاء والحُليلة والجزر المحيطة بمدينة أبوظبي، بما في ذلك جزيرة الفطيسي.في بعض الأحيان، يُشاهد طائر أو اثنان على شاطئ كلباء أو دبا في الربيع.'+
                'يمكن تمييز الحنكور من خلال ريشه الأسود والأبيض أو منقاره الأسود الضخم.وهو أحد الطيور الأكثر طلبًا من قبل مراقبي الطيور الذين يزورون دولة الإمارات العربية المتحدة ويسهل العثور عليه في مواقع تواجده.عادة ما تضم أسراب الحنكور طيور بالغة وصغار تبحث عن الطعام.هذه الطيور الصغيرة لديها نفس نمط ريش الكبار، ولكن مع مزيد من اللون الرمادي على الرأس والأجنحة.'+           
                'الحنكور هو طائر مقيم على طول شواطئ شبه الجزيرة العربية وجنوب إيران، وبعض الطيور تصل إلى شرق إفريقيا.'
        },
        EgyptianVulture: {
            BirdName: 'الرخمة أو النسر المصري',
            Desc: 'النسر المصري هو النوع الوحيد من النسور، الذي يُرى بشكل منتظم في دولة الإمارات العربية المتحدة، وفي جبل حفيت فقط، وغالبًا ما يُرى العديد منها على الصواري بالقرب من القمة. وقد انخفضت أعداده بشكل كبير هنا وفي أجزاء أخرى من العالم، حيث يعتبر الآن من الأنواع المهددة بالانقراض.'+
                'من السهل التعرف على النسر المصري البالغ من ريشه الأبيض الكريمي وريشه الأسود.الطيور اليافعة كلها بنية داكنة، وريشها مرقط بعض الشيء.في مختلف المراحل العمرية، يعتبر الرأس الصغير والذيل الوتدي الشكل من المميزات الواضحة التي تميزه.بسبب حجمه الكبير، يخطئ المهتمين بالطيور عديمي الخبرة أحيانًا في أن النسر المصري من أنواع النسور.' +
                'ينتشر النسر المصري من جنوب غرب أوروبا وغرب إفريقيا إلى آسيا الوسطى وشبه القارة الهندية.'
        },
        GreatCrestedTern: {
            BirdName: 'الخرشنة المتوجة الكبيرة',
            Desc:'يعتبر لون مقدمة الرأس في الخرشنة المتوجة الكبيرة من أهم المميزات الرئيسية لهذا النوع من الطيور.'+
                ' يمكن فصل هذين النوعين حسب لون المنقار وحسب حجمهما.في دولة الإمارات العربية المتحدة، تتكاثر الخرشنة المتوجة الكبيرة فقط في جزيرة جرنين، وهي من المواقع المحمية بالكامل.كما أن هذا الطائر من الطيور المهاجرة الشائعة وهو زائر شتوي إلا أنه يغادر الخليج في الشتاء، لكنه يظل يتردد على طول الساحل الشرقي.' +
                'الخرشنة المتوجة الكبيرة من طيور الخرشنة الكبيرة التي تتميز بمنقار أصفر طويل، وتتواجد في سرب مختلط من طيور الخرشنة على الشاطئ، ومن ضمنها خرشنة بحر قزوين بحجمها الكبير.وفي فصلي الربيع والصيف يكون الرأس أسود لامع وله قمة كبيرة؛ وفي الشتاء يتحول لون مقدمة الرأس إلى اللون الأبيض.يمكن رؤية هذا النوع على طول الشواطئ الرملية والسواحل الصخرية.' +
                'طائر الخرشنة طائر مقيم ومهاجر جزئيًا من شرق إفريقيا إلى أستراليا وأوقيانوسيا.'
        },
        GoldenEagle: {
            BirdName: 'العقاب الذهبي',
            Desc: 'يعد النسر الذهبي من النسور النادرة جدًا ويعيش فقط في صحراء الربع الخالي بالقرب من الحدود مع سلطنة عُمان والمملكة العربية السعودية، ويوجد أقل من خمسة أزواج متكاثرة في دولة الإمارات العربية المتحدة.'+
            'هو نسر قوي ومهيب.يعود لقبه إلى ريشه الذهبي على مؤخرة رأسه ومؤخرة عنقه، وهذا يتناقض مع جسمه الذي يتميز باللون البني الداكن ولون أجنحته.الطيور غير البالغة لها بقعة بيضاء كبيرة على أجنحتها وعلى قاعدة ذيلها.عندما يكبر النسر ويصبح طائر بالغ، بعد ست أو سبع سنوات، تختفي هذه البقع البيضاء تدريجياً.الأنثى أكبر من الذكر كما هو الحال في كثير من أنواع الطيور الجارحة.'+
                'ينتشر النسر الذهبي على نطاق واسع في أمريكا الشمالية وأوراسيا والشرق الأوسط.'
        },
        GreaterFlamingo: {
            BirdName: 'النحام الكبير الفلامنجو',
            Desc: 'طائر النحام الكبير - الفلامنجو (Phoenicopterus roseus) هو أكثر الأنواع انتشارًا من عائلة الفلامنجو، وهو أكبر أنواع طيور النحام، ويبلغ متوسط طوله 110-150 سم (43-59 بوصة) ويزن 2-4 كجم.' +
                ' يضع هذا النوع بيضة واحدة بيضاء على عشه المبني من الطين، ويتميز هذا الطائر البديع بلون ريشه الأبيض المائل للوردي، وبعض أجزاء الجناح يكسوها اللون الأحمر.أما صغاره، فيتميز ريشها باللون البني أو الرمادي، والذي يتحول للون الوردي عند بلوغها عمر السنتين، المنقار لونه وردي مع طرف أسود، والأرجل وردية بالكامل.خلال موسم التكاثر، يزيد تواتر انتشار الإفرازات الشمعية من الغدة البولية لطائر النحام الكبير البولية على ريشها مما يحسن لونها.' +
                'لا تعتبر دولة الإمارات العربية المتحدة نفسها ضمن مناطق انتشاره، ولكن هذا النوع استقر في محمية الوثبة منذ عام 1998 وبدأ يتكاثر بانتظام.ساهم وجود طيور النحام الكبير في الموقع أيضًا في انضمام محمية الوثبة لقائمة رامسار للأراضي الرطبة ذات الأهمية العالمية من قبل منظمة الاستدامة الحكومية الدولية.'
        },
        GreaterSpottedEagle: {
            BirdName: 'العقاب المرقط الكبير',
            Desc: 'يعتبر العقاب المرقط الكبير من الأنواع المهددة عالميًا، وهو طائر مهاجر وزائر شتوي. ومن أكثر النسور الكبيرة شيوعًا في دولة الإمارات العربية المتحدة، حيث يمكن رؤية ما يصل إلى خمسة طيور في مواقع تواجده، مثل رأس الخور، وخور البيضاء وضاية/الرمس. وتعتبر البحيرات الساحلية ومناطق شاسعة من غابات أشجار القرم والأراضي الرطبة الكبيرة مثل بحيرة الوثبة، مناسبة لقضاء فصل الشتاء.'+
                'غالبية الطيور التي شوهدت في الإمارات هي من الطيور الصغيرة التي يبلغ عمرها أقل من عام.عندما تكون الطيور جاثمة، تعطي أطراف الريش الباهت في الأجنحة نمطًا مرقطًا.أثناء الطيران، يكون النصف الأمامي من الجناح السفلي أسودًا تقريبًا وأغمق من النصف الخلفي.عدد قليل من النسور المرقطة الكبيرة لها أجسام شاحبة كريمية اللون، ويشار إليها بمرحلة اللون المصفر.'+
            'يتكاثر النسر المرقط الكبير من شرق أوروبا إلى شرق آسيا، في فصل الشتاء من تركيا والجزيرة العربية إلى جنوب شرق آسيا.'
    },
        LevantSparrowhawk: {
            BirdName: 'الباشق',
            Desc: 'الباشق هو طائر صغير من الطيور الجارحة ينتمي لفصلية البازية، يتواجد في جميع أنحاء المناطق المعتدلة وشبه الاستوائية من العالم القديم، وهو زائر شتوي غير متكاثر في الإمارات العربية المتحدة، وله أجنحة قصيرة وعريضة وذيل طويل، وكلاهما يتكيف مع لون الأشجار، ويمكن العثور عليه في أي موطن وغالبًا ما يصطاد الطيور في المدن، وهو مفترس رئيسي لطيور الغابات الصغيرة.',
        },
        MarshHarrier: {
            BirdName: 'مرزة البطائح ',
            Desc: 'مرزة البطائح - على الرغم من أن الطيور الجارحة الأخرى قد تزور الأراضي الزراعية والبحيرات والأراضي الرطبة الساحلية، فإن الأكثر شيوعًا هو مرزة البطائح، وهو من الطيور المهاجرة وزائر شتوي إلى دولة الإمارات العربية المتحدة، وغالبًا ما تكون هذه الأنواع شائعة في الأراضي الزراعية وعلى ضفاف البحيرات، أو منطقة أشجار القرم والأراضي العشبية الرطبة التي تدعم مزرة البطائح في سعيها بحثًا عن الفريسة.'+
                'أغلب طيور مرزة البطائح التي تمت مشاهدتها في دولة الإمارات العربية المتحدة هي طيور غير بالغة ومن الإناث.وتتميز هذه الطيور بلونها البني القريبة من لون الشوكولاتة، في حين يتميز الجزء العلوي من الرأس بلون أصفر، وأحيانًا تكون أيضًا مقدمة الأجنحة كريمية اللون.'+ 
            'يمكن تميز الإناث الأخريات بغياب اللون الأبيض على الخلف.يكون لون الذكور أكثر رمادية، مع نمط جناح ثلاثي الألوان.تطير الطيور على ارتفاع منخفض، وتحلق فوق الأراضي الزراعية مع أجنحة مرفوعة قليلاً في شكل حرف(V).'+
             'تتكاثر مرزة البطائح من أوروبا الغربية إلى آسيا الوسطى، وتقضى فصل الشتاء من غرب إفريقيا إلى شبه القارة الهندية.'
        },
        Osprey: {
            BirdName: 'العقاب النساري',
            Desc: 'العقاب النساري هو طائر جارح كبير يصل طوله إلى أكثر من 60 سم (24 بوصة) وطول الجناح 180 سم (71 بوصة)، ولونه بني في الأجزاء العلوية وغالبًا ما يكون رماديًا على الرأس والأجزاء السفلية.' +
                'يتكون النظام الغذائي للعقاب النساري من الأسماك بشكل حصري تقريبًا، فهو يمتلك خصائص فيزيائية متخصصة ويظهر سلوكًا فريدًا للمساعدة في الصيد واصطياد الفرائس.العقاب النساري من الأنواع الفريدة حيث يعتبر النوع الوحيد من الكائنات الحية الذي يتنشر تقريبًا في جميع أنحاء العالم.حتى الأنواع الفرعية القليلة لا يمكن فصلها بشكل مطلق.تعتبر حمايته من الأولويات على المستوى الإقليمي، ويعتبر من الأنواع المتكاثرة المقيمة في دولة الإمارات العربية المتحدة.'+
            'وقد تم إجراء مسوحات مكثفة خلال موسم التكاثر عام 2007 لتقييم حالة التكاثر الحالية للعقاب النساري في إمارة أبوظبي، حيث تم مسح 61 موقعًا، تضمنت 46 جزيرة و 15 موقعًا ساحليًا، وتم تسجيل 117 عشًا منها 61 عشًا نشطًا، و 47 غير نشط وتسعة تضم طيور غير متكاثرة.'+
            'بصرف النظر عن الأعشاش، فقد ساهمت الأعشاش الاصطناعية التي أقيمت في العديد من المواقع لمساعدة طيور العقاب النساري على التعشيش، وتم استخدامها بشكل كبير.من بين ما يقرب من 27 عشًا اصطناعياً، كان 58 ٪ عشاً نشطاً أو يضم طيور.على الرغم من زيادة مستويات الضغوط في بعض المواقع الرئيسية لتعشيش العقاب النساري، فقد ظل عددها مستقرًا، أو ربما زادت خلال العقد الماضي.'
        },
        RedBilledTropicbird: {
            BirdName: 'طائر الاستواء أحمر المنقار',
            Desc: 'هذا الطائر البحري الرائع هو زائر نادر متكاثر يزور عدد محدود من جزر الخليج البحرية، ونادرًا ما يتم رؤيته على اليابسة. أضفناه هنا بسبب ندرته وجماله، ولكنك ستكون محظوظًا للغاية لرؤية واحد من هذا النوع، ومع ذلك، فإن رحلة بالقارب إلى مسندم، حيث تتكاثر عدة أزواج (كما هو الحال مع الصقر الاسخم) ، ستمنحك فرصة معقولة لرؤيته.'+
            'من الواضح أن هذا الطائر يمكن تمييزه بسهولة إذا ما تم رؤيته جيدًا - فهو يتميز بريش أبيض وأسود، ومنقار أحمر ساطع وشرائط بيضاء طويلة الذيل بشكل غير عادي.كما أنه طائر جيد، يقضي معظم وقته في البحر، ويأتي إلى الشاطئ فقط للتكاثر، حيث يغادر الصغار العش في الربيع أو في أوائل الصيف.'+
            'توجد الطيور الاستوائية ذات المنقار الأحمر في الغالب في المياه الاستوائية وشبه الاستوائية في منطقة البحر الكاريبي والمحيط الأطلسي والخليج العربي وشمال المحيط الهندي.'
        },
        SootyFalcon: {
            BirdName: 'الصقر الأسخم',
            Desc: 'الصقر الأسخم هو زائر صيفي للجزر الواقعة قبالة أبوظبي، مع تسجيل مشاهدة خمسة أزواج فقط في دولة الإمارات العربية المتحدة في عام 2008. وقد انخفضت أعدادها بشكل كبير لدرجة أنه إذا لم يتم توفير الحماية لمواقع التعشيش الباقية، فإنه من المحتمل وربما من المؤكد أن ينقرض. كما أنه نادراً ما يُرى أحد أفراد هذا الطائر على الشاطئ.'+ 
            'من السهل التعرف على الصقور البالغة من خلال ريشها الغامق والرمادي الفاتح والمنقار الأصفر وحلقة العين الصفراء.الطيور غير الناضجة لها علامات شاحبة على الجانب السفلي.الصقر الأسخم هو طائر سريع الانقضاض يلتقط الطيور المغردة المهاجرة وغيرها من الأنواع الأكبر حجمًا أثناء الطيران.'+
           ' تم العثور على طيور السمان، والسبد، وآكلات النحل، والهدهد، والصرد في أعشاش الصقر الأسخم ومواقع تخزين الطعام.'+
           ' بحلول أواخر شهر أكتوبر، سيكون معظم طيور هذا النوع قد غادرت الخليج للإشتاء.'+
           'يتكاثر الصقر الأسخم من شمال شرق إفريقيا إلى شرق شبه الجزيرة العربية، ويقضي فصل الشتاء في مدغشقر وجنوب شرق إفريقيا.'
        },
        SootyGull: {
            BirdName: 'النورس الأسخم',
            Desc: 'يعيش النورس الأسخم ويتكاثر بأعداد كبيرة للغاية في ثلاث أو أربع جزر فقط من جزر دولة الإمارات العربية المتحدة. قد تتجمع هذه الأنواع بأعداد كبيرة خارج موسم التكاثر على الشواطئ على طول الساحل الشرقي، كما هو الحال في كلباء والفجيرة.'+
                'لا توجد طيور النورس الأخرى التي تُرى بانتظام في دولة الإمارات العربية المتحدة لديها ريش بني داكن بشكل عام.في موسم التكاثر، يكون للنورس الأسخم علامات بيضاء على الرقبة ومنقار ملون.الطيور غير البالغة لونها بني رمادي غامق على عكس النوارس الأخرى ذات اللون البني.النورس الأسخم طائر مألوف على طول الساحل الشرقي، حيث يتجمع بالقرب من مناطق صيد الأسماك.'+
            'النورس الأسخم هو طائر مقيم في منطقة الخليج العربي وسلطنة عُمان والبحر الأحمر.'
        },
        Sparrowhawk: {
            BirdName: 'الباشق الأوراسي',
            Desc: 'الباشق الأوراسي هو طائر مهاجر شائع إلى حد ما وزائر شتوي. وهو أكثر شيوعًا في المتنزهات الكبيرة والأراضي الزراعية خاصة، حيث توجد الأشجار أو أسوار الحماية. وعادة ما توجد بشكل فردي، وغالبًا ما تكون أكثر نشاطًا خلال وقت الغسق.'+
            'يمكن مشاهدة هذا الطائر بالصدفة حيث تحلق بسرعة عالية فوق حقل أو عبر  مزرعة، وذلك خلال سعيها للحصول على وجبة محتملة من الطيور التي في حجم حمامة.الأجزاء العلوية رمادية داكنة، والأجزاء السفلية شاحبة مع العديد من الأشرطة الأفقية الداكنة.الإناث أكبر حجماً من الذكور.أثناء الطيران، تشبه الصورة الظلية إلى حد ما صورة الوقواق الشائع، لكن رأس هذا الطائر أكبر وأجنحته أقل حدة.'+
           'يتكاثر الباشق على نطاق واسع من غرب أوروبا إلى شمال شرق آسيا.تهاجر الطيور الآسيوية في فصل الشتاء من شمال شرق إفريقيا إلى جنوب شرق آسيا.'
        },
        SteppeEagle: {
            BirdName: 'عقاب السهوب',
            Desc: 'هو طائر مهاجر نادر وزائر شتوي إلى دولة الإمارات العربية المتحدة. قد يكون التعرف على النسور أمرًا صعبًا حيث يختلف ريش الطيور حسب عمر الطائر. لا يتساقط ريش أو ذيل النسور الصغيرة وبالتالي تبدو مرتبة للغاية. يمكن التعرف على أربع فئات عمرية مختلفة على الأقل في نسر السهوب. يمكن التعرف على الطيور الصغيرة، وهي الأكثر شيوعًا في الإمارات العربية المتحدة، من خلال الخط الباهت أسفل مركز الأجنحة والحافة الخلفية الشاحبة للأجنحة والذيل.'+
                'يتكاثر عقاب السهوب في آسيا الوسطى، ويقضي فترة الشتاء في شرق إفريقيا والجزيرة العربية وشبه القارة الهندية.'
        },
        NorthernShoveler: {
            BirdName: 'أبو مجروف',
            Desc: 'لديه منقار كبير على شكل مجرفة، يُستخدم لتصفية المواد الغذائية. كل من ذكر وأنثى هذا النوع من البط لديه هذا المنقار الضخم، ويمكن التمييز بينهما من خلاله. الذكور لها منقار ملون مع رأس أخضر ورقبة بيضاء، ورقعة كبيرة بنية تميل للحُمرة. أما الإناث، فلا توجد ألوان كثيرة غير لونها الأصلي واللون البني. أثناء الطيران، تساعد رقعة الجناح الزرقاء الشاحبة في تحديد الهوية.'
        },
        NorthernPintail: {
            BirdName: 'بلبول',
            Desc: 'بطة كبيرة يبلغ حجمها ~ 55 سم.  حصلت على اسمها من ريش ذيل الذكر الطويل المدبب. الرقبة طويلة ورقيقة بشكل ملحوظ، وهذا، جنباً إلى جنب مع الذيل الطويل، يعطي الطائر شكل نحيف وأنيق. لديها خط أبيض عمودي على الرقبة البنية والأجنحة المزخرفة. الأنثى تتميز باللون البني الفاتح بشكل موحد، وهي أكثر شحوبا من إناث البط الأخرى. يمكن تمييزها أثناء الطيران من الرقبة الطويلة والذيل المدبب.'
        },
        BartailedGodwit: {
            BirdName: 'بوقويقة موشمة الذيل',
            Desc: 'هذا الطائر الخواض كبير الحجم من السهل تمييزه من ساقيه الطويلة جدا، ومنقاره الذي يبدو وكأنه مقلوب قليلا. في الخريف والشتاء هو رمادي بشكل موحد، ولكن بحلول شهر مارس تتغير الأجزاء السفلية إلى ريش لونه يشبه الطوب الأحمر. يتميز الذيل بشكل أفقي بديع يظهر بوضوح عندما يحلّق الطائر.'
        },
        EurasianOystercatcher: {
            BirdName: 'آكل المحار',
            Desc: 'هذا الطائر الكبير الذي يتميز باللونين الأسود والأبيض مع منقار وساقين يكسوهم اللون الأحمر، يعتبر من أكثر الطيور الخوّاضة التي يسهل التعرف عليها في الشواطئ. وغالبا ما يتواجد في أسراب صغيرة تتغذى على حافة الماء. إذا تم إزعاجها، فإنها تطير وتصرخ بصوت عال متجهة إلى أرض أبعد من الشاطئ لاستكمال التغذية.'
        },

    },
    UserInfo: {
        UserName: "",
        UserRole: "",
        Password:"",
    },
    widgets: {
        layerControl: {
            include: true,
            id: 'layerControl',
            title: 'Layers',
            options: {
                map: true,
                layerControlLayerInfos: true,
                separated: true,
                vectorReorder: true,
                overlayReorder: true
            }
        },
        showScale: {
            include: true
        },
        showCoordinates: {
            include: true
        },


        Measurement: {
            include: true
        },
        BirdInfo: {
            include: true
        },
        BirdTrackingPPTID: {

        },
       
        basemapGallery: {
            include: true,
            title:"BasemapGallery",
            options: {
                Landsat8: {
                    url: "https://landsat2.arcgis.com/arcgis/rest/services/Landsat8_Views/ImageServer",
                    title: "Landsat8",
                    thumbnailUrl: "Lib/emap/Basemaps/images/Landsat8.png"
                },
                Elevations: {
                    url: "https://sampleserver5.arcgisonline.com/arcgis/rest/services/Elevation/WorldElevations/MapServer",
                    title: "Elevations",
                    thumbnailUrl: "Lib/emap/Basemaps/images/WorldElevations.png"
                },
                ShdRelif: {
                    url: "https://services.arcgisonline.com/arcgis/rest/services/World_Shaded_Relief/MapServer",
                    title: "Shaded Relief",
                    thumbnailUrl: "Lib/emap/Basemaps/images/ShadedRelif.png"
                },
                WorldBoundries: {
                    url: "https://enviroportal.ead.ae/server/rest/services/BirdTracking/WorldBoundaries/MapServer?token=E8iDqzSMoGmTZaud4xESCvwWhe6LtG30zZYd-BsRl4fNozRCW97i4eDaPzt-CEVL",
                    title: "World Map",
                    thumbnailUrl: "Lib/emap/Basemaps/images/worldboundry.png"
                },
                AdsicBaseMap: {
                    url: "https://arcgis.sdi.abudhabi.ae/arcgis/rest/services/Pub/BaseMapEng_LightGray_WM/MapServer",
                    title: "Adsic Basemap",
                    thumbnailUrl: "Lib/emap/Basemaps/images/LightGrey.png"
                },
                googlestreets: {
                    url: "https://mts2.google.com/vt/lyrs=m&hl=en&gl=ae&x=${col}&y=${row}&z=${level}&s=png",
                    title: "Google Street",
                    thumbnailUrl: "Lib/emap/Basemaps/images/GoogleStreet.png"
                },
                NationalMap: {
                    url: "https://www.nationsonline.org/oneworld/arab_emirates.htm",
                    title: "National Map",
                    thumbnailUrl: "Lib/emap/Basemaps/images/natgeo.jpg"
                },
                OpenStreetMap: {
                    title: "Open Street Map",
                    thumbnailUrl: "Lib/emap/Basemaps/images/base64Img_widgets_BasemapGallery_Widget_21_1_1661452497004.png",
                },
                Imagery: {
                    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
                    thumbnailUrl: "Lib/emap/Basemaps/images/base64Img_widgets_BasemapGallery_Widget_21_2_1661452497006.png",
                    title: "Imagery",
                },
                LightGrayCanvas: {
                    thumbnailUrl: "Lib/emap/Basemaps/images/base64Img_widgets_BasemapGallery_Widget_21_3_1661452497007.png",
                    title: "Light Gray Canvas",
                    url: "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer",
                },
                Oceans: {
                    thumbnailUrl: "Lib/emap/Basemaps/images/base64Img_widgets_BasemapGallery_Widget_21_4_1661452497017.png",
                    title: "Oceans",
                    url: "https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer",
                },
                NationalGeographic: {
                    thumbnailUrl: "Lib/emap/Basemaps/images/base64Img_widgets_BasemapGallery_Widget_21_5_1661452497018.png",
                    title: "National Geographic",
                    url: "https://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer",
                },
                DarkGrayCanvas: {
                    thumbnailUrl: "Lib/emap/Basemaps/images/base64Img_widgets_BasemapGallery_Widget_21_6_1661452497020.png",
                    title: "Dark Gray Canvas",
                    url: "https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer",
                },
                Streets: {
                    thumbnailUrl: "Lib/emap/Basemaps/images/base64Img_widgets_BasemapGallery_Widget_21_7_1661452497022.png",
                    title: "Streets",
                    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
                },
                Topographic: {
                    thumbnailUrl: "Lib/emap/Basemaps/images/base64Img_widgets_BasemapGallery_Widget_21_8_1661452497025.png",
                    title: "Topographic",
                    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer",
                },
                ImagerywithLabels: {
                    thumbnailUrl: "Lib/emap/Basemaps/images/base64Img_widgets_BasemapGallery_Widget_21_9_1661452497027.png",
                    title: "Imagery with Labels",
                    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
                },
                TerrainwithLabels: {
                    thumbnailUrl: "Lib/emap/Basemaps/images/base64Img_widgets_BasemapGallery_Widget_21_10_1661452497029.png",
                    title: "Terrain with Labels",
                    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer",
                },
                
            }
            
        },
        navigation:
        {
            include: true,
            id: 'navigation',
            title: 'Navigation',
            options:
            {
                vectorBasemapUrl: "https://geoportal.abudhabi.ae/rest/services/BaseMapEnglish/MapServer",
                satelliteBasemapUrl: "https://geoportal.abudhabi.ae/rest/services/BaseMapSatellite50cm/MapServer"
            }

        },
        
        printWidget: {
            include: true,
            printTaskURL: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task/",
            //printTaskURL: "https://azurestgenviroportal.ead.ae/server/rest/services/BirdTracking/Bird/GPServer/Export%20Web%20Map",
            //printTaskURL: "https://enviroportal.ead.ae/server/rest/services/BirdTracking/Bird/GPServer/Export%20Web%20Map?token=E8iDqzSMoGmTZaud4xESCvwWhe6LtG30zZYd-BsRl4fNozRCW97i4eDaPzt-CEVL",
            copyrightText: 'Copyright 2014',
            authorText: 'eMap',
            defaultTitle: 'Viewer Map',
            defaultFormat: 'PDF',
            defaultLayout: 'Letter ANSI A Landscape'

        }
        
         

        

    },
    countryListAllIsoData : [
        { "code": "AF", "code3": "AFG", "name": "Afghanistan", "number": "004" },
        { "code": "AL", "code3": "ALB", "name": "Albania", "number": "008" },
        { "code": "DZ", "code3": "DZA", "name": "Algeria", "number": "012" },
        { "code": "AS", "code3": "ASM", "name": "American Samoa", "number": "016" },
        { "code": "AD", "code3": "AND", "name": "Andorra", "number": "020" },
        { "code": "AO", "code3": "AGO", "name": "Angola", "number": "024" },
        { "code": "AI", "code3": "AIA", "name": "Anguilla", "number": "660" },
        { "code": "AQ", "code3": "ATA", "name": "Antarctica", "number": "010" },
        { "code": "AG", "code3": "ATG", "name": "Antigua and Barbuda", "number": "028" },
        { "code": "AR", "code3": "ARG", "name": "Argentina", "number": "032" },
        { "code": "AM", "code3": "ARM", "name": "Armenia", "number": "051" },
        { "code": "AW", "code3": "ABW", "name": "Aruba", "number": "533" },
        { "code": "AU", "code3": "AUS", "name": "Australia", "number": "036" },
        { "code": "AT", "code3": "AUT", "name": "Austria", "number": "040" },
        { "code": "AZ", "code3": "AZE", "name": "Azerbaijan", "number": "031" },
        { "code": "BS", "code3": "BHS", "name": "Bahamas ", "number": "044" },
        { "code": "BH", "code3": "BHR", "name": "Bahrain", "number": "048" },
        { "code": "BD", "code3": "BGD", "name": "Bangladesh", "number": "050" },
        { "code": "BB", "code3": "BRB", "name": "Barbados", "number": "052" },
        { "code": "BY", "code3": "BLR", "name": "Belarus", "number": "112" },
        { "code": "BE", "code3": "BEL", "name": "Belgium", "number": "056" },
        { "code": "BZ", "code3": "BLZ", "name": "Belize", "number": "084" },
        { "code": "BJ", "code3": "BEN", "name": "Benin", "number": "204" },
        { "code": "BM", "code3": "BMU", "name": "Bermuda", "number": "060" },
        { "code": "BT", "code3": "BTN", "name": "Bhutan", "number": "064" },
        { "code": "BO", "code3": "BOL", "name": "Bolivia (Plurinational State of)", "number": "068" },
        { "code": "BQ", "code3": "BES", "name": "Bonaire, Sint Eustatius and Saba", "number": "535" },
        { "code": "BA", "code3": "BIH", "name": "Bosnia and Herzegovina", "number": "070" },
        { "code": "BW", "code3": "BWA", "name": "Botswana", "number": "072" },
        { "code": "BV", "code3": "BVT", "name": "Bouvet Island", "number": "074" },
        { "code": "BR", "code3": "BRA", "name": "Brazil", "number": "076" },
        { "code": "IO", "code3": "IOT", "name": "British Indian Ocean Territory ", "number": "086" },
        { "code": "BN", "code3": "BRN", "name": "Brunei Darussalam", "number": "096" },
        { "code": "BG", "code3": "BGR", "name": "Bulgaria", "number": "100" },
        { "code": "BF", "code3": "BFA", "name": "Burkina Faso", "number": "854" },
        { "code": "BI", "code3": "BDI", "name": "Burundi", "number": "108" },
        { "code": "CV", "code3": "CPV", "name": "Cabo Verde", "number": "132" },
        { "code": "KH", "code3": "KHM", "name": "Cambodia", "number": "116" },
        { "code": "CM", "code3": "CMR", "name": "Cameroon", "number": "120" },
        { "code": "CA", "code3": "CAN", "name": "Canada", "number": "124" },
        { "code": "KY", "code3": "CYM", "name": "Cayman Islands ", "number": "136" },
        { "code": "CF", "code3": "CAF", "name": "Central African Republic ", "number": "140" },
        { "code": "TD", "code3": "TCD", "name": "Chad", "number": "148" },
        { "code": "CL", "code3": "CHL", "name": "Chile", "number": "152" },
        { "code": "CN", "code3": "CHN", "name": "China", "number": "156" },
        { "code": "CX", "code3": "CXR", "name": "Christmas Island", "number": "162" },
        { "code": "CC", "code3": "CCK", "name": "Cocos (Keeling) Islands ", "number": "166" },
        { "code": "CO", "code3": "COL", "name": "Colombia", "number": "170" },
        { "code": "KM", "code3": "COM", "name": "Comoros ", "number": "174" },
        { "code": "CD", "code3": "COD", "name": "Congo (the Democratic Republic of the)", "number": "180" },
        { "code": "CG", "code3": "COG", "name": "Congo ", "number": "178" },
        { "code": "CK", "code3": "COK", "name": "Cook Islands ", "number": "184" },
        { "code": "CR", "code3": "CRI", "name": "Costa Rica", "number": "188" },
        { "code": "HR", "code3": "HRV", "name": "Croatia", "number": "191" },
        { "code": "CU", "code3": "CUB", "name": "Cuba", "number": "192" },
        { "code": "CW", "code3": "CUW", "name": "Curaçao", "number": "531" },
        { "code": "CY", "code3": "CYP", "name": "Cyprus", "number": "196" },
        { "code": "CZ", "code3": "CZE", "name": "Czechia", "number": "203" },
        { "code": "CI", "code3": "CIV", "name": "Côte d'Ivoire", "number": "384" },
        { "code": "DK", "code3": "DNK", "name": "Denmark", "number": "208" },
        { "code": "DJ", "code3": "DJI", "name": "Djibouti", "number": "262" },
        { "code": "DM", "code3": "DMA", "name": "Dominica", "number": "212" },
        { "code": "DO", "code3": "DOM", "name": "Dominican Republic ", "number": "214" },
        { "code": "EC", "code3": "ECU", "name": "Ecuador", "number": "218" },
        { "code": "EG", "code3": "EGY", "name": "Egypt", "number": "818" },
        { "code": "SV", "code3": "SLV", "name": "El Salvador", "number": "222" },
        { "code": "GQ", "code3": "GNQ", "name": "Equatorial Guinea", "number": "226" },
        { "code": "ER", "code3": "ERI", "name": "Eritrea", "number": "232" },
        { "code": "EE", "code3": "EST", "name": "Estonia", "number": "233" },
        { "code": "SZ", "code3": "SWZ", "name": "Eswatini", "number": "748" },
        { "code": "ET", "code3": "ETH", "name": "Ethiopia", "number": "231" },
        { "code": "FK", "code3": "FLK", "name": "Falkland Islands  [Malvinas]", "number": "238" },
        { "code": "FO", "code3": "FRO", "name": "Faroe Islands ", "number": "234" },
        { "code": "FJ", "code3": "FJI", "name": "Fiji", "number": "242" },
        { "code": "FI", "code3": "FIN", "name": "Finland", "number": "246" },
        { "code": "FR", "code3": "FRA", "name": "France", "number": "250" },
        { "code": "GF", "code3": "GUF", "name": "French Guiana", "number": "254" },
        { "code": "PF", "code3": "PYF", "name": "French Polynesia", "number": "258" },
        { "code": "TF", "code3": "ATF", "name": "French Southern Territories ", "number": "260" },
        { "code": "GA", "code3": "GAB", "name": "Gabon", "number": "266" },
        { "code": "GM", "code3": "GMB", "name": "Gambia ", "number": "270" },
        { "code": "GE", "code3": "GEO", "name": "Georgia", "number": "268" },
        { "code": "DE", "code3": "DEU", "name": "Germany", "number": "276" },
        { "code": "GH", "code3": "GHA", "name": "Ghana", "number": "288" },
        { "code": "GI", "code3": "GIB", "name": "Gibraltar", "number": "292" },
        { "code": "GR", "code3": "GRC", "name": "Greece", "number": "300" },
        { "code": "GL", "code3": "GRL", "name": "Greenland", "number": "304" },
        { "code": "GD", "code3": "GRD", "name": "Grenada", "number": "308" },
        { "code": "GP", "code3": "GLP", "name": "Guadeloupe", "number": "312" },
        { "code": "GU", "code3": "GUM", "name": "Guam", "number": "316" },
        { "code": "GT", "code3": "GTM", "name": "Guatemala", "number": "320" },
        { "code": "GG", "code3": "GGY", "name": "Guernsey", "number": "831" },
        { "code": "GN", "code3": "GIN", "name": "Guinea", "number": "324" },
        { "code": "GW", "code3": "GNB", "name": "Guinea-Bissau", "number": "624" },
        { "code": "GY", "code3": "GUY", "name": "Guyana", "number": "328" },
        { "code": "HT", "code3": "HTI", "name": "Haiti", "number": "332" },
        { "code": "HM", "code3": "HMD", "name": "Heard Island and McDonald Islands", "number": "334" },
        { "code": "VA", "code3": "VAT", "name": "Holy See ", "number": "336" },
        { "code": "HN", "code3": "HND", "name": "Honduras", "number": "340" },
        { "code": "HK", "code3": "HKG", "name": "Hong Kong", "number": "344" },
        { "code": "HU", "code3": "HUN", "name": "Hungary", "number": "348" },
        { "code": "IS", "code3": "ISL", "name": "Iceland", "number": "352" },
        { "code": "IN", "code3": "IND", "name": "India", "number": "356" },
        { "code": "ID", "code3": "IDN", "name": "Indonesia", "number": "360" },
        { "code": "IR", "code3": "IRN", "name": "Iran (Islamic Republic of)", "number": "364" },
        { "code": "IQ", "code3": "IRQ", "name": "Iraq", "number": "368" },
        { "code": "IE", "code3": "IRL", "name": "Ireland", "number": "372" },
        { "code": "IM", "code3": "IMN", "name": "Isle of Man", "number": "833" },
        { "code": "IL", "code3": "ISR", "name": "Israel", "number": "376" },
        { "code": "IT", "code3": "ITA", "name": "Italy", "number": "380" },
        { "code": "JM", "code3": "JAM", "name": "Jamaica", "number": "388" },
        { "code": "JP", "code3": "JPN", "name": "Japan", "number": "392" },
        { "code": "JE", "code3": "JEY", "name": "Jersey", "number": "832" },
        { "code": "JO", "code3": "JOR", "name": "Jordan", "number": "400" },
        { "code": "KZ", "code3": "KAZ", "name": "Kazakhstan", "number": "398" },
        { "code": "KE", "code3": "KEN", "name": "Kenya", "number": "404" },
        { "code": "KI", "code3": "KIR", "name": "Kiribati", "number": "296" },
        { "code": "KP", "code3": "PRK", "name": "Korea (the Democratic People's Republic of)", "number": "408" },
        { "code": "KR", "code3": "KOR", "name": "Korea (the Republic of)", "number": "410" },
        { "code": "KW", "code3": "KWT", "name": "Kuwait", "number": "414" },
        { "code": "KG", "code3": "KGZ", "name": "Kyrgyzstan", "number": "417" },
        { "code": "LA", "code3": "LAO", "name": "Lao People's Democratic Republic ", "number": "418" },
        { "code": "LV", "code3": "LVA", "name": "Latvia", "number": "428" },
        { "code": "LB", "code3": "LBN", "name": "Lebanon", "number": "422" },
        { "code": "LS", "code3": "LSO", "name": "Lesotho", "number": "426" },
        { "code": "LR", "code3": "LBR", "name": "Liberia", "number": "430" },
        { "code": "LY", "code3": "LBY", "name": "Libya", "number": "434" },
        { "code": "LI", "code3": "LIE", "name": "Liechtenstein", "number": "438" },
        { "code": "LT", "code3": "LTU", "name": "Lithuania", "number": "440" },
        { "code": "LU", "code3": "LUX", "name": "Luxembourg", "number": "442" },
        { "code": "MO", "code3": "MAC", "name": "Macao", "number": "446" },
        { "code": "MG", "code3": "MDG", "name": "Madagascar", "number": "450" },
        { "code": "MW", "code3": "MWI", "name": "Malawi", "number": "454" },
        { "code": "MY", "code3": "MYS", "name": "Malaysia", "number": "458" },
        { "code": "MV", "code3": "MDV", "name": "Maldives", "number": "462" },
        { "code": "ML", "code3": "MLI", "name": "Mali", "number": "466" },
        { "code": "MT", "code3": "MLT", "name": "Malta", "number": "470" },
        { "code": "MH", "code3": "MHL", "name": "Marshall Islands ", "number": "584" },
        { "code": "MQ", "code3": "MTQ", "name": "Martinique", "number": "474" },
        { "code": "MR", "code3": "MRT", "name": "Mauritania", "number": "478" },
        { "code": "MU", "code3": "MUS", "name": "Mauritius", "number": "480" },
        { "code": "YT", "code3": "MYT", "name": "Mayotte", "number": "175" },
        { "code": "MX", "code3": "MEX", "name": "Mexico", "number": "484" },
        { "code": "FM", "code3": "FSM", "name": "Micronesia (Federated States of)", "number": "583" },
        { "code": "MD", "code3": "MDA", "name": "Moldova (the Republic of)", "number": "498" },
        { "code": "MC", "code3": "MCO", "name": "Monaco", "number": "492" },
        { "code": "MN", "code3": "MNG", "name": "Mongolia", "number": "496" },
        { "code": "ME", "code3": "MNE", "name": "Montenegro", "number": "499" },
        { "code": "MS", "code3": "MSR", "name": "Montserrat", "number": "500" },
        { "code": "MA", "code3": "MAR", "name": "Morocco", "number": "504" },
        { "code": "MZ", "code3": "MOZ", "name": "Mozambique", "number": "508" },
        { "code": "MM", "code3": "MMR", "name": "Myanmar", "number": "104" },
        { "code": "NA", "code3": "NAM", "name": "Namibia", "number": "516" },
        { "code": "NR", "code3": "NRU", "name": "Nauru", "number": "520" },
        { "code": "NP", "code3": "NPL", "name": "Nepal", "number": "524" },
        { "code": "NL", "code3": "NLD", "name": "Netherlands ", "number": "528" },
        { "code": "NC", "code3": "NCL", "name": "New Caledonia", "number": "540" },
        { "code": "NZ", "code3": "NZL", "name": "New Zealand", "number": "554" },
        { "code": "NI", "code3": "NIC", "name": "Nicaragua", "number": "558" },
        { "code": "NE", "code3": "NER", "name": "Niger ", "number": "562" },
        { "code": "NG", "code3": "NGA", "name": "Nigeria", "number": "566" },
        { "code": "NU", "code3": "NIU", "name": "Niue", "number": "570" },
        { "code": "NF", "code3": "NFK", "name": "Norfolk Island", "number": "574" },
        { "code": "MP", "code3": "MNP", "name": "Northern Mariana Islands ", "number": "580" },
        { "code": "NO", "code3": "NOR", "name": "Norway", "number": "578" },
        { "code": "OM", "code3": "OMN", "name": "Oman", "number": "512" },
        { "code": "PK", "code3": "PAK", "name": "Pakistan", "number": "586" },
        { "code": "PW", "code3": "PLW", "name": "Palau", "number": "585" },
        { "code": "PS", "code3": "PSE", "name": "Palestine, State of", "number": "275" },
        { "code": "PA", "code3": "PAN", "name": "Panama", "number": "591" },
        { "code": "PG", "code3": "PNG", "name": "Papua New Guinea", "number": "598" },
        { "code": "PY", "code3": "PRY", "name": "Paraguay", "number": "600" },
        { "code": "PE", "code3": "PER", "name": "Peru", "number": "604" },
        { "code": "PH", "code3": "PHL", "name": "Philippines ", "number": "608" },
        { "code": "PN", "code3": "PCN", "name": "Pitcairn", "number": "612" },
        { "code": "PL", "code3": "POL", "name": "Poland", "number": "616" },
        { "code": "PT", "code3": "PRT", "name": "Portugal", "number": "620" },
        { "code": "PR", "code3": "PRI", "name": "Puerto Rico", "number": "630" },
        { "code": "QA", "code3": "QAT", "name": "Qatar", "number": "634" },
        { "code": "MK", "code3": "MKD", "name": "Republic of North Macedonia", "number": "807" },
        { "code": "RO", "code3": "ROU", "name": "Romania", "number": "642" },
        { "code": "RU", "code3": "RUS", "name": "Russian Federation ", "number": "643" },
        { "code": "RW", "code3": "RWA", "name": "Rwanda", "number": "646" },
        { "code": "RE", "code3": "REU", "name": "Réunion", "number": "638" },
        { "code": "BL", "code3": "BLM", "name": "Saint Barthélemy", "number": "652" },
        { "code": "SH", "code3": "SHN", "name": "Saint Helena, Ascension and Tristan da Cunha", "number": "654" },
        { "code": "KN", "code3": "KNA", "name": "Saint Kitts and Nevis", "number": "659" },
        { "code": "LC", "code3": "LCA", "name": "Saint Lucia", "number": "662" },
        { "code": "MF", "code3": "MAF", "name": "Saint Martin (French part)", "number": "663" },
        { "code": "PM", "code3": "SPM", "name": "Saint Pierre and Miquelon", "number": "666" },
        { "code": "VC", "code3": "VCT", "name": "Saint Vincent and the Grenadines", "number": "670" },
        { "code": "WS", "code3": "WSM", "name": "Samoa", "number": "882" },
        { "code": "SM", "code3": "SMR", "name": "San Marino", "number": "674" },
        { "code": "ST", "code3": "STP", "name": "Sao Tome and Principe", "number": "678" },
        { "code": "SA", "code3": "SAU", "name": "Saudi Arabia", "number": "682" },
        { "code": "SN", "code3": "SEN", "name": "Senegal", "number": "686" },
        { "code": "RS", "code3": "SRB", "name": "Serbia", "number": "688" },
        { "code": "SC", "code3": "SYC", "name": "Seychelles", "number": "690" },
        { "code": "SL", "code3": "SLE", "name": "Sierra Leone", "number": "694" },
        { "code": "SG", "code3": "SGP", "name": "Singapore", "number": "702" },
        { "code": "SX", "code3": "SXM", "name": "Sint Maarten (Dutch part)", "number": "534" },
        { "code": "SK", "code3": "SVK", "name": "Slovakia", "number": "703" },
        { "code": "SI", "code3": "SVN", "name": "Slovenia", "number": "705" },
        { "code": "SB", "code3": "SLB", "name": "Solomon Islands", "number": "090" },
        { "code": "SO", "code3": "SOM", "name": "Somalia", "number": "706" },
        { "code": "ZA", "code3": "ZAF", "name": "South Africa", "number": "710" },
        { "code": "GS", "code3": "SGS", "name": "South Georgia and the South Sandwich Islands", "number": "239" },
        { "code": "SS", "code3": "SSD", "name": "South Sudan", "number": "728" },
        { "code": "ES", "code3": "ESP", "name": "Spain", "number": "724" },
        { "code": "LK", "code3": "LKA", "name": "Sri Lanka", "number": "144" },
        { "code": "SD", "code3": "SDN", "name": "Sudan ", "number": "729" },
        { "code": "SR", "code3": "SUR", "name": "Suriname", "number": "740" },
        { "code": "SJ", "code3": "SJM", "name": "Svalbard and Jan Mayen", "number": "744" },
        { "code": "SE", "code3": "SWE", "name": "Sweden", "number": "752" },
        { "code": "CH", "code3": "CHE", "name": "Switzerland", "number": "756" },
        { "code": "SY", "code3": "SYR", "name": "Syrian Arab Republic", "number": "760" },
        { "code": "TW", "code3": "TWN", "name": "Taiwan", "number": "158" },
        { "code": "TJ", "code3": "TJK", "name": "Tajikistan", "number": "762" },
        { "code": "TZ", "code3": "TZA", "name": "Tanzania, United Republic of", "number": "834" },
        { "code": "TH", "code3": "THA", "name": "Thailand", "number": "764" },
        { "code": "TL", "code3": "TLS", "name": "Timor-Leste", "number": "626" },
        { "code": "TG", "code3": "TGO", "name": "Togo", "number": "768" },
        { "code": "TK", "code3": "TKL", "name": "Tokelau", "number": "772" },
        { "code": "TO", "code3": "TON", "name": "Tonga", "number": "776" },
        { "code": "TT", "code3": "TTO", "name": "Trinidad and Tobago", "number": "780" },
        { "code": "TN", "code3": "TUN", "name": "Tunisia", "number": "788" },
        { "code": "TR", "code3": "TUR", "name": "Turkey", "number": "792" },
        { "code": "TM", "code3": "TKM", "name": "Turkmenistan", "number": "795" },
        { "code": "TC", "code3": "TCA", "name": "Turks and Caicos Islands ", "number": "796" },
        { "code": "TV", "code3": "TUV", "name": "Tuvalu", "number": "798" },
        { "code": "UG", "code3": "UGA", "name": "Uganda", "number": "800" },
        { "code": "UA", "code3": "UKR", "name": "Ukraine", "number": "804" },
        { "code": "AE", "code3": "ARE", "name": "United Arab Emirates", "number": "784" },
        { "code": "GB", "code3": "GBR", "name": "United Kingdom of Great Britain and Northern Ireland", "number": "826" },
        { "code": "UM", "code3": "UMI", "name": "United States Minor Outlying Islands", "number": "581" },
        { "code": "US", "code3": "USA", "name": "United States of America", "number": "840" },
        { "code": "UY", "code3": "URY", "name": "Uruguay", "number": "858" },
        { "code": "UZ", "code3": "UZB", "name": "Uzbekistan", "number": "860" },
        { "code": "VU", "code3": "VUT", "name": "Vanuatu", "number": "548" },
        { "code": "VE", "code3": "VEN", "name": "Venezuela (Bolivarian Republic of)", "number": "862" },
        { "code": "VN", "code3": "VNM", "name": "Viet Nam", "number": "704" },
        { "code": "VG", "code3": "VGB", "name": "Virgin Islands (British)", "number": "092" },
        { "code": "VI", "code3": "VIR", "name": "Virgin Islands (U.S.)", "number": "850" },
        { "code": "WF", "code3": "WLF", "name": "Wallis and Futuna", "number": "876" },
        { "code": "EH", "code3": "ESH", "name": "Western Sahara", "number": "732" },
        { "code": "YE", "code3": "YEM", "name": "Yemen", "number": "887" },
        { "code": "ZM", "code3": "ZMB", "name": "Zambia", "number": "894" },
        { "code": "ZW", "code3": "ZWE", "name": "Zimbabwe", "number": "716" },
        { "code": "AX", "code3": "ALA", "name": "Åland Islands", "number": "248" }
    ],

    AnimationBirdIcons: [
        { name:"Greater Flamingo", icon: "assets/img/GreaterFlamingo.jpg" },
        { name: "Arabian Partridge", icon: "assets/img/ArabianPartridge.jpg" },
        { name: "Egyptian Vulture", icon: "assets/img/EgyptianVulture.jpg"},
        { name: "Greater Spotted Eagle", icon: "assets/img/GreaterSpottedEagle.jpg"},
        { name: "Osprey", icon: "assets/img/Osprey.jpg" },
        { name: "Western Osprey", icon: "assets/img/Osprey.jpg" },
        { name: "Great Crested Tern", icon: "assets/img/GreatCrestedTern.jpg"},
        { name: "Sooty Falcon", icon: "assets/img/SootyFalcon.jpg"},
        { name: "Marsh Harrier", icon: "assets/img/MarshHarrier.jpg" },
        { name: "Western Marsh Harrier", icon: "assets/img/MarshHarrier.jpg" },
        { name: "Red Billed Tropicbird", icon: "assets/img/Redbilledtropicbird.jpg" },
        { name: "Red-billed Tropicbird", icon: "assets/img/Redbilledtropicbird.jpg" },
        { name: "Steppe Eagle", icon: "assets/img/SteppeEagle.jpg"},
        { name: "Crab Plover", icon: "assets/img/CrabPlover.jpg" },
        { name: "Crab-plover", icon: "assets/img/CrabPlover.jpg" },
        { name: "Sparrowhawk", icon: "assets/img/LevantSparrowhawk.jpg" },
        { name: "Eurasian Sparrowhawk", icon: "assets/img/LevantSparrowhawk.jpg" },
        { name: "Sooty Gull", icon: "assets/img/SootyGull.jpg" },
        { name: "SootyGull", icon: "assets/img/SootyGull.jpg"},
        { name: "Golden Eagle", icon: "assets/img/GoldenEagle.jpg"},
        { name: "Bonellis Eagle", icon: "assets/img/BenolisEagle.png" },
        { name: "Bonelli's Eagle", icon: "assets/img/BenolisEagle.png" },
        { name: "Bar Tailed Godwit", icon: "assets/img/BartailedGodwit.jpg" },
        { name: "Bar-tailed Godwit", icon: "assets/img/BartailedGodwit.jpg" },
        { name: "Eurasian Oystercatcher", icon: "assets/img/EurasianOystercatcher.jpg" },
        { name: "Northern Pintail", icon: "assets/img/NorthernPintail.jpg" },
        { name: "Northern Shoveler", icon: "assets/img/NorthernShoveler.jpg" },


        
    ]



}