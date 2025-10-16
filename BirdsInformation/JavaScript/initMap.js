require(["esri/map",
    "esri/dijit/Scalebar",
    "esri/config",
    'dojo/_base/lang',
    "esri/arcgis/utils",
    "dojo/on",
    "dojo/dom",
    "esri/units",
    "emap/Basemaps/Basemaps",
    "emap/AuditLogs/AuditLogs",
    "emap/BirdInfoSponcer/BirdInfoSponcer",
    "emap/Measurement/Measurement",
    "emap/BirdInfo/BirdInfo",
    "emap/AssignIdsToGroup/AssignIdsToGroup",
    "emap/BirdTrackingPPTID/BirdTrackingPPTID",
    "emap/SponsorBirdTrackingPPTID/SponsorBirdTrackingPPTID",
    "emap/SpeciesWidget/SpeciesWidget",
    "emap/TOCWidget/TOCWidget",
    "emap/BirdInformationForm/BirdInformationForm",
    "emap/BirdTrackingPublicUser/BirdTrackingPublicUser",
    "emap/ReportsWidget/ReportsWidget",
    "emap/ModifiedReportsWidget/ModifiedReportsWidget",
    "emap/DurationTypeReport/DurationTypeReport",
    "emap/DataSummaryPieReport/DataSummaryPieReport",
    "emap/DataSummaryBarReport/DataSummaryBarReport",
    "emap/UpdateMigration/UpdateMigration",
    "esri/tasks/locator",
    "esri/InfoTemplate",
    "esri/geometry/webMercatorUtils",
    "esri/layers/GraphicsLayer",
    "esri/graphic",
    "esri/renderers/SimpleRenderer",
    "esri/geometry/Point",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color",
    "emap/StopOver/StopOver",
    "emap/AdminDetails/AdminDetails",
    "emap/MMCWidget/MMCWidget",
    "emap/PrintMap/PrintMap",
    "emap/GoogleAnimateWidgetCopy/GoogleAnimateWidgetCopy",
    "esri/symbols/TextSymbol",
    "esri/layers/FeatureLayer",
    "esri/layers/LabelClass",
    "dojo/parser",
    "dojo/i18n!emap/nls/stringsroot",
    'dojo/topic',
    "emap/NavigationBar/NavigationBar",
    "emap/BTRouteWidget/BTRouteWidget",
    "emap/RecentLocateBirds/RecentLocateBirds",
    "dojo/store/Memory",
    "emap/BirdTrackingByNamesNew/BirdTrackingByNamesNew",
    "emap/LayerControl/LayerControl",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "dijit/layout/BorderContainer",
    /*"dijit/layout/TabContainer",*/
    "dijit/layout/ContentPane",
    "dijit/layout/AccordionContainer",
    "dojo/domReady!"],
    function (Map, ScaleBar,esriConfig, lang, arcgisUtils, on, dom, Units, Basemaps, AuditLogs, BirdInfoSponcer, MeasureWidget, BirdInfo, AssignIdsToGroup,
        BirdTrackingPPTID, SponsorBirdTrackingPPTID, SpeciesWidget, TOCWidget, BirdInformationForm, BirdTrackingPublicUser, ReportsWidget,
        ModifiedReportsWidget, DurationTypeReport, DataSummaryPieReport, DataSummaryBarReport, UpdateMigration,
        Locator, InfoTemplate,
        webMercatorUtils, GraphicsLayer, Graphic, SimpleRenderer, Point, SimpleMarkerSymbol, SimpleLineSymbol, Color, StopOver, AdminDetails, MMCWidget, PrintMap,
        GoogleAnimateWidgetCopy, TextSymbol, FeatureLayer,
        LabelClass, parser, i18n, topic, NavigationBar, BTRouteWidget, RecentLocateBirds, Memory, BirdTrackingByNamesNew, LayerControl, ArcGISDynamicMapServiceLayer) {

        parser.parse();
        //esriConfig.defaults.io.corsEnabledServers.push("coastmap.com");
        //esriConfig.defaults.io.corsEnabledServers.push("fdc.ead.ae");
        esriConfig.defaults.io.corsEnabledServers.push("enviroportal.ead.ae");
        esriConfig.defaults.io.corsEnabledServers.push("tasks.arcgisonline.com");
        esriConfig.defaults.io.corsEnabledServers.push("sampleserver6.arcgisonline.com");
        esriConfig.defaults.io.corsEnabledServers.push("utility.arcgisonline.com");
        esriConfig.defaults.io.corsEnabledServers.push("cdnjs.cloudflare.com");
        //esriConfig.defaults.io.corsEnabledServers.push("localhost:56757");
        esriConfig.defaults.io.corsEnabledServers.push("ead-birdtracking-uat.azurewebsites.net");
        esriConfig.defaults.io.alwaysUseProxy = false;
        esri.config.defaults.io.timeout = 1800000;
        counter = 0;


        dojo.requireLocalization("emap", "stringsroot");
        var
            CurrentExtent,
            isLoadmap;




        if (typeof (localStorage.getItem('isUserLogged') != "undefined" && localStorage.getItem('isUserLogged') != null)) {
            if (localStorage.getItem('RedirectHomepage') == 'True') {

            }
            else {
                if (localStorage.getItem('isUserLogged') == "True") {
                    localStorage.removeItem('isUserLogged');
                }
                else {
                    window.location = "Home.html";
                }
            }
        }
        else {
            window.location = "Home.html";
        }

        if (typeof (localStorage.loggedInUserName) != "undefined") {
            var username = localStorage.loggedInUserName.substr(0, localStorage.loggedInUserName.length);
            var password = localStorage.Password.substr(0, localStorage.Password.length);
            configOptions.UserInfo.UserName = username;
            configOptions.UserInfo.Password = password;
            configOptions.UserInfo.UserRole = localStorage.loggedInRole;

            $("#lblHeaderUserName").text(username);
            $("#lblHeaderRoleName").text(localStorage.loggedInRole);
                $("#lblHeaderUserName1").text(username);
            $("#lblHeaderRoleName1").text(localStorage.loggedInRole);

        }

        if (location.search.substring(1) == "") {
            i18n = dojo.i18n.getLocalization("emap", "stringsroot", "en");
            $("body").removeClass("arabic");
            $(".langBtn.arBtn").removeClass("active");
            $(".langBtn.enBtn").addClass("active");
            $("html").removeAttr("dir", "rtl");
            $("html").attr("dir", "ltr");
            $('.logo').attr({

                'src': 'assets/img/logo.png'
            })
            isArabic = false;
        }
        else {
            i18n = dojo.i18n.getLocalization("emap", "stringsroot", "ar");
            isArabic = true;
            $("body").addClass("arabic");
            $("html").attr("dir", "rtl");
            $(".langBtn.enBtn").removeClass("active");
            $(".langBtn.arBtn").addClass("active");
            $('.logo').attr({
                'src': 'images/logoAr.png'
            });
        }

        dojo.query(".i18nReplace").forEach(function (node, index, arr) {
            node.innerHTML = dojo.replace(node.innerHTML, {
                i18n: i18n
            });
            if (typeof (node.title) != 'undefined' || node.title != "") {
                node.title = dojo.replace(node.title, {
                    i18n: i18n
                });
            }
        });
        var initialExtent = new esri.geometry.Extent(46.02079, 21.6952, 58.1466, 27.6761, new esri.SpatialReference({ wkid: 4326 }));

        map = new Map("mapDiv", {
            basemap: "satellite",
            //basemap: "topo-vector",
            center: configOptions.mapCenter,
            zoom: configOptions.Zoom,
            logo: false,
            smartNavigation: false,
            showLabels: true
        });
        var scalebar = new esri.dijit.Scalebar({
            map: map,
            scalebarUnit: 'metric'
        });


        var avatarElement = $('.avatar-initials');
        avatarElement.attr('data-name', username);
        var avatarWidth = avatarElement.attr('width');
        var avatarHeight = avatarElement.attr('height');
        var name = avatarElement.attr('data-name');

        if (typeof (name) != "undefined") {
            var namesArray = name.split(' ');
            var initials;
            if (namesArray.length > 1) {
                initials = name.split(' ')[0].charAt(0).toUpperCase() + name.split(" ")[1].charAt(0).toUpperCase(), charIndex = initials.charCodeAt(0) - 65;
            }
            else {
                namesArray = name.split('.');
                if (namesArray.length > 1) {
                    initials = name.split('.')[0].charAt(0).toUpperCase() + name.split(".")[1].charAt(0).toUpperCase(), charIndex = initials.charCodeAt(0) - 65;
                }
                else
                    initials = namesArray[0].charAt(0).toUpperCase();
            }
            avatarElement.css({
                'background-color': '#F46239',
                'width': avatarWidth,
                'height': avatarHeight,
                'font': avatarWidth / 2 + "px Open Sans",
                'color': '#FFF',
                'textAlign': 'center',
                'lineHeight': avatarHeight + 'px',
                'borderRadius': '50%'
            }).html(initials);
        }
        configOptions.CurrentMap = map;

        require(["dojo/ready", "esri/map", "dojo/on"], function (ready, Map, on) {

            topic.subscribe('mapClickMode/ZoomtoFullExtent', lang.hitch(this, function (mode) {
                configOptions.CurrentMap.centerAndZoom(configOptions.mapCenter, configOptions.Zoom);
            }));

            // set the current mapClickMode
            topic.subscribe('mapClickMode/setCurrent', lang.hitch(this, function (mode) {
                configOptions.CurrentMapCommand = mode;
            }));

            // set the current mapClickMode to the default mode
            topic.subscribe('mapClickMode/setDefault', lang.hitch(this, function () {
                topic.publish('mapClickMode/setCurrent', configOptions.CurrentMapDefaultCommand);
            }));

            // This function won't run until the DOM has loaded and other modules that register have run.

            on(configOptions.CurrentMap, "load", function (evt) {
                ExternalLayers(configOptions.CurrentMap, configOptions.ExternalOperationalLayers1);
                initializeWidgets();

            });

            topic.subscribe('LayerControl/ReLoad', lang.hitch(this, function (LayerControlData) {

                var widget = registry.byId("tocWidget");
                widget.destroy(true); //distroy the widget preserve nodes
                domConstruct.empty("tocWidget"); //remove all the inner node

                //console.log("Create TOC");
                ExternalLayers(LayerControlData.CurrentMap, LayerControlData.ExternalOperationalLayers1);
            }));


            topic.subscribe('Animation/AnimationRecordVideo', lang.hitch(this, function () {
                $(".navbar").css("visibility", "hidden");
                $(".ManageContainer").css("height", "calc(100vh - 0px)");
                $(".Animationdiv").css("height", "calc(100vh - 3px)");
                document.getElementById('startVideoRecording').click();
            }));

           

        });

        function ExternalLayers(CurrentMap, operationalLayers) {
            try {
                var layerControlLayerInfos = [];
                var layer;
                for (var i = 0; i < operationalLayers.length; i++) {
                    if (operationalLayers[i].type == 'dynamic') {
                        layer = new ArcGISDynamicMapServiceLayer(operationalLayers[i].url, operationalLayers[i].options);
                        CurrentMap.addLayer(layer);
                    }
                    else if (operationalLayers[i].type == 'tiled') {
                        layer = new ArcGISTiledMapServiceLayer(operationalLayers[i].url, operationalLayers[i].options);
                        CurrentMap.addLayer(layer);
                    }
                    else if (operationalLayers[i].type == 'feature') {
                        layer = new FeatureLayer(operationalLayers[i].url, operationalLayers[i].options, {
                            mode: esri.layers.FeatureLayer.MODE_SELECTION,
                            outFields: operationalLayers[i].options.outFields
                        });

                        CurrentMap.addLayer(layer);
                    }
                    else if (operationalLayers[i].type == 'image') {
                        layer = new ArcGISImageServiceLayer(operationalLayers[i].url, operationalLayers[i].options);
                        CurrentMap.addLayer(layer);
                    }
                    //LayerControl LayerInfos array
                    layerControlLayerInfos.unshift({ //unshift instead of push to keep layer ordering in LayerControl intact
                        layer: layer,
                        type: operationalLayers[i].type,
                        title: operationalLayers[i].title,
                        controlOptions: operationalLayers[i].layerControlLayerInfos
                    });
                }
                configOptions.widgets.layerControl.options.map = CurrentMap;
                configOptions.widgets.layerControl.options.layerControlLayerInfos = null;
                configOptions.widgets.layerControl.options.layerControlLayerInfos = layerControlLayerInfos;
                //create the widget
                var tocWidget = new LayerControl(configOptions.widgets.layerControl.options, "tocWidget");
                tocWidget.startup();

            }
            catch (e) {
                console.log("Error while creating TOC:" + e);
            }
        }

        $(".HomePageEvent").click(function () {
            localStorage.setItem('RedirectHomepage', 'True');
            if (localStorage.getItem('isArabicPage') == "True") {
                window.location = "Home_Ar.html";

            } else {
                window.location = "Home.html";
            }
        });

       

        $("#ArgosDashBtn").click(function () {
            var ReportsExploreData = "Argos";
            topic.publish('Reports/ExploreData', ReportsExploreData);
            $(".ReportsDisable").css("display", "none");
            $("#divSensorReportWidget").css("display", "block");
            $("#NewReportWid").css("display", "none");
            $(".CloseContainer").css("display", "none");
            $(".PullRightBut").css("display", "none");
        });
        $("#GPSDashBtn").click(function () {
            var ReportsExploreData = "GPS";
            topic.publish('Reports/ExploreData', ReportsExploreData);
            $(".ReportsDisable").css("display", "none");
            $("#divSensorReportWidget").css("display", "block");
            $("#NewReportWid").css("display", "none");
            $(".CloseContainer").css("display", "none");
            $(".PullRightBut").css("display", "none");
        });
        $("#GSMDashBtn").click(function () {
            var ReportsExploreData = "GSM";
            topic.publish('Reports/ExploreData', ReportsExploreData);
            $(".ReportsDisable").css("display", "none");
            $("#divSensorReportWidget").css("display", "block");
            $("#NewReportWid").css("display", "none");
            $(".CloseContainer").css("display", "none");
            $(".PullRightBut").css("display", "none");
        });

        $('#TrackingBtn').click(function () {
            topic.publish('Reports/TrackingData');
            $(".ReportsDisable").css("display", "none");
            //$(".ReportsHideShow").css("display", "none");
            $("#divReportsWidget").css("display", "block");
            $(".CloseContainer").css("display", "none");
            $(".PullRightBut").css("display", "none");
            $(".bgcolorcollapse").css("display", "none");
            $(".colorlabel").css("display", "none");
            $(".lblfromdate").css("display", "none");
            $(".lbltodate").css("display", "none");
            $(".lblgreater").css("display", "none");
            $("#NewReportWid").css("display", "none");



            $("#container1").html("");
        });
        $('#DurationBtn').click(function () {
            topic.publish('Reports/PlatformRecordCountData');
            $(".ReportsDisable").css("display", "none");
            //$(".ReportsHideShow").css("display", "none");
            $("#divDurationTypeReport").css("display", "block");
            $(".CloseContainer").css("display", "none");
            $(".PullRightBut").css("display", "none");
            $("#NewReportWid").css("display", "none");
        });


        $("#MMCBtn").click(function () {

            topic.publish('Reports/MMCData');
            $('html,body').animate({
                scrollTop: $(".ManageContainer").offset().top
            },
                'fast');
            $(".ReportsDisable").css("display", "none");
            $("#divMMCWidget").css("display", "block");
            $(".CloseContainer").css("display", "none");
            $(".lblSpeciesName").css("display", "none");
            $(".lblSensortName").css("display", "none");
            $(".lblfromdate").css("display", "none");
            $(".lbltodate").css("display", "none");
            $(".lblgreater").css("display", "none");
            $("#NewReportWid").css("display", "none");
            $(".lblPlatformId").css("display", "none");
        });

        $(".logoutevent").click(function () {
            var UserName = configOptions.UserInfo.UserName;
            var requestData = {
                login: UserName
            };
            $.ajax({
                type: "POST",
                url: configOptions.ServiceUrl + "JsonLogoutStatus/" ,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (val) {
                    localStorage.removeItem('RedirectHomepage');
                    if (localStorage.getItem('isArabicPage') == "True") {
                        window.location = "Home_Ar.html";

                    } else {
                        window.location = "Home.html";
                    }
                },
                error: function (err) {
                    
                }
            });
        });


        if ((configOptions.UserInfo.UserRole).toUpperCase() == "ADMIN") {
            $("#SummaryDiv").css("display", "block");
            $("#Manage").css("display", "block");
            $("#ExportExcel").css("display", "inline-block");
            $(".stopoverclass").css("display", "block");
            $("#ExportShape").css("display", "inline-block");
        }
        else if ((configOptions.UserInfo.UserRole).toUpperCase() == "ADVANCED") {
            $("#SummaryDiv").css("display", "block");
            $("#Manage").css("display", "none");
            $("#managedropdown").css("display", "none");
            $("#ExportExcel").css("display", "inline-block");
            $(".stopoverclass").css("display", "block");
            $("#ExportShape").css("display", "inline-block");
        }
        else if ((configOptions.UserInfo.UserRole).toUpperCase() == "STANDARD") {
            $("#Manage").css("display", "none");
            $("#managedropdown").css("display", "none");
            $("#toolsDropdown").css("display", "none");
            $("#Tools").css("display", "none");
            $("#StopOverExportExcel").css("display", "none !important");
            $(".stopoverclass").css("display", "none");
            $(".StopOverResultBtn1").css("display", "none");
            $("#ExportShape").css("display", "none");
            $("#PrintTab").css("display", "none");
            $("#startVideoRecording1").css("display", "none");
        }
        else if ((configOptions.UserInfo.UserRole).toUpperCase() == "SPONSOR") {
            $(".DataSummary").css("display", "none");
            $(".MMCReport").css("display", "none");
            $("#Manage").css("display", "none");
            $("#managedropdown").css("display", "none");
            $("#ExportExcel").css("display", "none !important");
            $(".stopoverclass").css("display", "none");
            $("#ExportShape").css("display", "none !important");
            $("#PrintTab").css("display", "block");
        }
        function initializeWidgets() {
            var toc = new TOCWidget({
                map: configOptions.CurrentMap,
                operationalLayers: configOptions.operationalLayers,
                Token: configOptions.Token
            }, "divTOCWidget");
            toc.startup();

            var NB = new NavigationBar({
                map: configOptions.CurrentMap,
                config: configOptions.widgets.navigation.options,
                layers: configOptions.operationalLayers
            }, "navToolbar");
            NB.startup();


            var RecentLocWdg = new RecentLocateBirds({
                map: configOptions.CurrentMap,
                ServiceUrl: configOptions.ServiceUrl,
            }, "RecentBirdsSec");
            RecentLocWdg.startup();

            var bg = new Basemaps({
                map: configOptions.CurrentMap,
                configOptions: configOptions.widgets.basemapGallery.options,
            }, "divBasemapWidget");
            bg.startup();

            var meaWidget = new MeasureWidget({
                map: configOptions.CurrentMap,
                defaultAreaUnit: Units.SQUARE_METERS,
                defaultLengthUnit: Units.METERS,
            }, "divMeasureWidget");
            meaWidget.startup();

            var BTR = new BTRouteWidget({
                map: configOptions.CurrentMap,
                currentuser: configOptions.UserInfo.UserRole,
            });

            var stopOverWidget = new StopOver({
                map: configOptions.CurrentMap,
                ServiceUrl: configOptions.ServiceUrl,
                currentuser: configOptions.UserInfo.UserRole,
            }, "stopoverPopupdiv");
            stopOverWidget.startup();

            
            var animate = new GoogleAnimateWidgetCopy({
                map: configOptions.CurrentMap,
                currentuser: configOptions.UserInfo.UserRole,
            }, "divanimateWidget");


            if (configOptions.UserInfo.UserRole == "Sponsor") {
                var sponcerBirdPPTID = new SponsorBirdTrackingPPTID({
                    map: configOptions.CurrentMap,
                    ServiceUrl: configOptions.ServiceUrl,
                    currentuser: configOptions.UserInfo.UserRole,
                    queryResultsWidget: BTR,
                    StopOverResults: stopOverWidget,
                    animateResults: animate,
                }, "divPTTIDWidget");
                sponcerBirdPPTID.startup();
            }
            else {
                var BirdPPTID = new BirdTrackingPPTID({
                    map: configOptions.CurrentMap,
                    ServiceUrl: configOptions.ServiceUrl,
                    currentuser: configOptions.UserInfo.UserRole,
                    queryResultsWidget: BTR,
                    StopOverResults: stopOverWidget,
                    animateResults: animate,
                }, "divPTTIDWidget");
                BirdPPTID.startup();
            }

            if (configOptions.UserInfo.UserRole == "Sponsor") {
                var sponcerbirds = new BirdInfoSponcer({
                    map: configOptions.CurrentMap,
                    ServiceUrl: configOptions.ServiceUrl,
                }, "divBirdInfoWidget");
                sponcerbirds.startup();
            }
            else {
                var birdinfo = new BirdInfo({
                    map: configOptions.CurrentMap,
                    ServiceUrl: configOptions.ServiceUrl,
                }, "divBirdInfoWidget");
                birdinfo.startup();
            }

            if (configOptions.UserInfo.UserRole != "Sponsor") {
                var CSI = new SpeciesWidget({
                    map: configOptions.CurrentMap,
                    ServiceUrl: configOptions.ServiceUrl,
                    currentuser: configOptions.UserInfo.UserRole,
                    queryResultsWidget: BTR,
                    StopOverResults: stopOverWidget,
                    animateResults: animate,
                }, "divSpeciesWidget");
                CSI.startup();

                $(".Speciesids").css("display", "block");



                var Nameswidget = new BirdTrackingByNamesNew({
                    map: configOptions.CurrentMap,
                    ServiceUrl: configOptions.ServiceUrl,
                    queryResultsWidget: BTR,
                    StopOverResults: stopOverWidget,
                    animateResults: animate,
                    currentuser: configOptions.UserInfo.UserRole,
                }, "divPTTDNameWidget");
                Nameswidget.startup();

                $(".namesWidget").css("display", "block");

            }
            else {
                $(".Speciesids").css("display", "none");
                $(".namesWidget").css("display", "none");
            }

            var MMCwgt = new MMCWidget({
                map: configOptions.CurrentMap,
                ServiceUrl: configOptions.ServiceUrl,
                currentuser: configOptions.UserInfo.UserRole,
            }, "divMMCWidget");
            MMCwgt.startup();

            var logs = new AuditLogs({
                map: configOptions.CurrentMap,
                ServiceUrl: configOptions.ServiceUrl,
                currentuser: configOptions.UserInfo.UserRole,
            }, "divAuditLogs");
            logs.startup();


            var pgDir = document.getElementsByTagName('html');

            if (pgDir[0].dir == 'rtl' || pgDir[0].style.direction == 'rtl') {
                $(".ReportsDiv").css('left', '20px');
                $(".ReportsDiv").css('right', 'auto');
                $(".PullRightBut").css('left', '20px');
                $(".PullRightBut").css('right', 'auto');
            }

            else {

                $(".ReportsDiv").css('right', '20px');
                $(".ReportsDiv").css('left', 'auto');
                $(".PullRightBut").css('left', 'auto');
                $(".PullRightBut").css('right', '0px');

            }

            var Print = new PrintMap({
                map: configOptions.CurrentMap,
                ServiceUrl: configOptions.ServiceUrl,
                currentuser: configOptions.UserInfo.UserRole,
            }, "divPrintWidget");
            Print.startup();


            if (configOptions.UserInfo.UserRole == "Admin") {
                var Migration = new UpdateMigration({
                    map: configOptions.CurrentMap,
                    ServiceUrl: configOptions.ServiceUrl,
                    currentuser: configOptions.UserInfo.UserRole,
                }, "divMigrationWidget");
                Migration.startup();

                $(".updatemigration").css("display", "block");

                var AssignIdGroup = new AssignIdsToGroup({
                    map: configOptions.CurrentMap,
                    ServiceUrl: configOptions.ServiceUrl,
                }, "divAssignIDstopublic");
                AssignIdGroup.startup();

                $(".assignidstopublic").css("display", "block");
            }
            else {
                $(".updatemigration").css("display", "none");
                $(".assignidstopublic").css("display", "none");
            }

            var BIF = new BirdInformationForm({
                map: configOptions.CurrentMap,
                ServiceUrl: configOptions.ServiceUrl,
            }, "divBirdinformation");
            BIF.startup();


            var pgDir = document.getElementsByTagName('html');

            if (pgDir[0].dir == 'rtl' || pgDir[0].style.direction == 'rtl') {
                $(".ReportsDiv").css('left', '20px');
                $(".ReportsDiv").css('right', 'auto');
                $(".PullRightBut").css('left', '10px');
                $(".PullRightBut").css('right', 'auto');
                $(".CloseContainer, .CloseContainer1").css('right', 'auto');
                $(".CloseContainer, .CloseContainer1").css('left', '10px');
                $(".lt2rt").removeClass('text-right');
                $(".lt2rt").addClass('text-left');

            }

            else {

                $(".ReportsDiv").css('right', '20px');
                $(".ReportsDiv").css('left', 'auto');
                $(".PullRightBut").css('left', 'auto');
                $(".PullRightBut").css('right', '0px');
                $(".CloseContainer, .CloseContainer1").css('right', '15px');
                $(".CloseContainer, .CloseContainer1").css('left', 'auto');
                $(".lt2rt").removeClass('text-left');
                $(".lt2rt").addClass('text-right');

            }

            if ((configOptions.UserInfo.UserRole).toUpperCase() == "PUBLIC") {
                var TrackingPublicUser = new BirdTrackingPublicUser({
                    ServiceUrl: configOptions.ServiceUrl,
                    queryResultsWidget: BTR,
                    map: configOptions.CurrentMap,
                }, "Divpublicuser");
                TrackingPublicUser.startup();

            }

            var adminwidget = new AdminDetails({
                map: configOptions.CurrentMap,
                ServiceUrl: configOptions.ServiceUrl
            }, "divAdminUsers");
            adminwidget.startup();

            

            

            var ModifiedreportsWidget = new ModifiedReportsWidget({
                map: configOptions.CurrentMap,
                ServiceUrl: configOptions.ServiceUrl
            }, "divSensorReportWidget");
            ModifiedreportsWidget.startup();

            var reportsWidget = new ReportsWidget({
                map: configOptions.CurrentMap,
                ServiceUrl: configOptions.ServiceUrl
            }, "divReportsWidget");
            reportsWidget.startup();

            var DurationWidget = new DurationTypeReport({
                map: configOptions.CurrentMap,
                ServiceUrl: configOptions.ServiceUrl
            }, "divDurationTypeReport");
            DurationWidget.startup();

            var DataSummaryChart = new DataSummaryPieReport({
                map: configOptions.CurrentMap,
                ServiceUrl: configOptions.ServiceUrl
            }, "divDataSummaryPieChart");
            DataSummaryChart.startup();

            var DataSummaryBarChart = new DataSummaryBarReport({
                map: configOptions.CurrentMap,
                ServiceUrl: configOptions.ServiceUrl
            }, "divDataSummaryBarChart");
            DataSummaryBarChart.startup();




            var pgDir = document.getElementsByTagName('html');

            if (pgDir[0].dir == 'rtl' || pgDir[0].style.direction == 'rtl') {
                $(".ReportsDiv").css('left', '20px');
                $(".ReportsDiv").css('right', 'auto');
                $(".PullRightBut").css('left', '10px');
                $(".PullRightBut").css('right', 'auto');
                $(".CloseContainer, .CloseContainer1").css('right', 'auto');
                $(".CloseContainer, .CloseContainer1").css('left', '10px');
                $(".lt2rt").removeClass('text-right');
                $(".lt2rt").addClass('text-left');

            }

            else {

                $(".ReportsDiv").css('right', '20px');
                $(".ReportsDiv").css('left', 'auto');
                $(".PullRightBut").css('left', 'auto');
                $(".PullRightBut").css('right', '0px');
                $(".CloseContainer, .CloseContainer1").css('right', '15px');
                $(".CloseContainer, .CloseContainer1").css('left', 'auto');
                $(".lt2rt").removeClass('text-left');
                $(".lt2rt").addClass('text-right');
            }

            
            

            $("#ExportExcel").click(function () {
                BTR.exportToExcelAll();
            });

            $("#StopOverExportExcel, #StopOverExportExcelMobile").click(function () {
                stopOverWidget.exportToExcelAll();
            });
            $("#ExportShape, #ExportShapeMobile").click(function () {
                BTR.exportToKML();
            });
            $("#exportReports").click(function () {
                BTR.JSONToCSVConvertor(reportLocs, "Location Classes Information", true);
                BTR.JSONToCSVConvertor(reportResults, "Argos GPS Count Comparision", true);
            });


            $('.delete').on("click", function (e) {
                e.preventDefault();

                Swal.fire({
                    title: i18n.Areyousuretoclearthegraphics,
                    showDenyButton: true,
                    confirmButtonText: i18n.Yes,
                    denyButtonText: i18n.No,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $(".Overlay").fadeIn();
                        $(".icon-bar a").removeClass("active");
                        clearAll();
                        $(".Overlay").fadeOut();
                        return true;
                    } else if (result.isDenied) {
                        $(".icon-bar a").removeClass("active");
                        return false;
                    }
                })
            });

        }


        function clearAll() {
            var currentWidget = this;
            
            map.graphics.clear();
            clearPointDensityLayer();
            map.infoWindow.hide();

            var layersInfo = map.graphicsLayerIds;
            for (var i = layersInfo.length - 1; i >= 0; i--) {
                var layer = map.getLayer(layersInfo[i]);

                if (layer != null) {

                    if (layer.id.indexOf("_L") >= 0 || layer.id.indexOf("_P") >= 0 || layer.id.indexOf("StopOverArea_") >= 0 || layer.id.indexOf("SO_Symbols") >= 0 || layer.id.indexOf("MCPLayer") >= 0 ) {
                        layer.clear();
                        map.removeLayer(layer);
                        var rowclass = "tr" + layer.id.split('(')[0];
                        $("." + rowclass).remove();
                    }
                    else if (layer.id.indexOf("_T") >= 0 ) {
                        map.removeLayer(layer);
                        var rowclass = "tr" + layer.id.split('(')[0];
                        $("." + rowclass).remove();
                    }
                    else if (layer.id.indexOf("graphic") >= 0) {
                        layer.clear();
                        layer.graphics.clearAll();
                        map.removeLayer(layer);
                    }
                }
            }
            $(".dataLayersSubHeading").css("display", "none");
            $(".stopoverclassResult").css("display", "none");
            //$("#ResultPagePanel").show().animate({ bottom: '0px' }, 200);
            $("#ResultPagePanel").css("visibility", "hidden");
            topic.publish('mapClickMode/ChangeRowColor');
            topic.publish('mapClickMode/DeleteGraphics');
            topic.publish('mapClickMode/HideButtons');
       
            topic.publish('mapClickMode/ClearWidgets1');

            //topic.publish('mapClickMode/ClearWidgets');

            if (map.getLayer("StopOverArea_") != null) {
                map.removeLayer(map.getLayer("StopOverArea_"));
                map.removeLayer(map.getLayer("SO_Symbols"));
            }
            $(".icon-bar a").removeClass("active");
            
        };

        function CleanBirdInfoWidgets() {
            topic.publish('mapClickMode/BirdInfoClearWidgets');
        };
        function ClearMeasures() {
            topic.publish('mapClickMode/setCurrent', 'measure');
        };

        function ClearMeasureTools() {
            topic.publish('mapClickMode/ClearMeasureTools');
        };

        window.onload = function () {

            $(".OverlayHome").fadeOut();
            var recordstart;
            if ($(window).width() <= 480) {
                recordstart = document.getElementById('startVideoRecordingMobile');
            }
            else {
                recordstart = document.getElementById('startVideoRecording');
            }

            if (typeof (recordstart) == "undefined" || recordstart == null) {
                return;
            }
           
            recordstart.addEventListener('click', async function () {
                let stream = await recordScreen();
                let mimeType = 'video/mp4';
                /*let mimeType = 'video';*/
                mediaRecorder = createRecorder(stream, mimeType);
            });
        }
        async function recordScreen() {
            return await navigator.mediaDevices.getDisplayMedia({
                video: true,
            });
        }
        function createRecorder(stream, mimeType) {
            // the stream data is stored in this array
            let recordedChunks = [];

            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = function (e) {
                if (e.data.size > 0) {
                    recordedChunks.push(e.data);
                }
            };
            mediaRecorder.onstop = function () {
                saveFile(recordedChunks);
                $(".navbar").css("visibility", "visible");
                $(".ManageContainer").css("height", "calc(100vh - 60px)");
                $(".Animationdiv").css("height", "calc(100vh - 62px)");
                recordedChunks = [];
            };
            mediaRecorder.start(200); // For every 200ms the stream data will be stored in a separate chunk.
            $(".icon-bar a").removeClass("active");
           
            return mediaRecorder;
        }

        function saveFile(recordedChunks) {
            const blob = new Blob(recordedChunks, {
                type: 'video/mp4'
            });

            Swal.fire({
                html:
                    '<div style="padding:10px;padding-top:30px">' +
                    '<span style="text-align:left;font-family:\'Open Sans\';font-size:13px">' + i18n.EnterFileName + '</span><br/> ' +
                    '<input type="text" id="txtFileName" class="form-control" style="padding:10px"></div>',

                showCloseButton: true,
                showCancelButton: true,
                cancelButtonText: i18n.Cancel,
                focusConfirm: true,
                confirmButtonText: i18n.OK,
            }).then((result) => {
                if (result.isConfirmed) {

                    var filename = $("#txtFileName").val();

                    downloadLink = document.createElement('a');
                    if (filename != null) {
                        downloadLink.href = URL.createObjectURL(blob);
                        downloadLink.download = `${filename}.mp4`;

                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        URL.revokeObjectURL(blob); // clear from memory
                        document.body.removeChild(downloadLink);
                        $(".icon-bar a").removeClass("active");
                    }
                    else {
                        URL.revokeObjectURL(blob);
                        $(".icon-bar a").removeClass("active");
                    }

                }
            })
        }

        $('.RightPanelSlide').click(function () {
            $("#divRightPanelWidget").empty();


            var pgDirR = document.getElementsByTagName('html');

            if (pgDirR[0].dir == 'rtl' || pgDirR[0].style.direction == 'rtl') {



                $(".RightPanel").animate({
                    left: '-350px'
                }, 200);
                $("#LayersPanel").animate({
                    left: '40px'
                }, 300);

            }
            else {
                $(".RightPanel").animate({
                    right: '-350px'
                }, 200);
                $("#LayersPanel").animate({
                    right: '40px'
                }, 300);


            }

            var name = $(this).prop("name");
            var div = document.createElement('div');

            div.id = name.split(' ').join('') + counter;
            counter++;
            $(".RightPanelSlide").removeClass("active");
            $("#divRightPanelWidget").append(div);
            if (name == "Layers" || name == "طبقات") {
                $(this).addClass("active");
                $(".RightPanel").find(".card-header").html(i18n.Layers + '<a href="javascript:void()" data-bs-toggle="tooltip" title=' + i18n.Close + ' onclick="closeRight()"><i class="fas fa-times"></i></a>');
                $("#divTOCWidget").css("display", "block");
                $("#tocWidget").css("display", "none");
                $("#divBasemapWidget").css("display", "none");
                $("#divMeasureWidget").css("display", "none");
                $("#divBirdInfoWidget").css("display", "none");
                $("#divTOCSetting").css("display", "flex");
                $("#divExportVideo").css("display", "none");
            }
            else if (name == "External Dataset") {
                $(this).addClass("active");
                $(".RightPanel").find(".card-header").html(i18n.ExternalDataset + '<a href="javascript:void()" data-bs-toggle="tooltip" title=' + i18n.Close + ' onclick="closeRight()"><i class="fas fa-times"></i></a>');
                $("#divTOCWidget").css("display", "none");
                $("#tocWidget").css("display", "block");
                $("#divBasemapWidget").css("display", "none");
                $("#divMeasureWidget").css("display", "none");
                $("#divBirdInfoWidget").css("display", "none");
            }


            else if (name == "Measurement") {
                $(this).addClass("active");
                $(".RightPanel").find(".card-header").html(i18n.Measurement + '<a href="javascript:void()" data-bs-toggle="tooltip" title=' + i18n.Close + ' onclick="closeRight()"><i class="fas fa-times"></i></a>');
                $("#divTOCSetting").css("display", "none");
                $("#tocWidget").css("display", "none");
                $("#divMeasureWidget").css("display", "block");
                $("#divTOCWidget").css("display", "none");
                $("#divBasemapWidget").css("display", "none");
                $("#divBirdInfoWidget").css("display", "none");
                $("#divExportVideo").css("display", "none");
            }
            else if (name == "Basemaps") {
                ClearMeasures();
                $(this).addClass("active");
                $(".RightPanel").find(".card-header").html(i18n.Basemaps + '<a href="javascript:void()" data-bs-toggle="tooltip" title=' + i18n.Close + ' onclick="closeRight()"><i class="fas fa-times"></i></a>');
                $("#divTOCSetting").css("display", "none");
                $("#tocWidget").css("display", "none");
                $("#divBasemapWidget").css("display", "block");
                $("#divTOCWidget").css("display", "none");
                $("#divMeasureWidget").css("display", "none");
                $("#divBirdInfoWidget").css("display", "none");
                $("#divExportVideo").css("display", "none");
                ClearMeasureTools();
            }
            else if (name == "Bird Info") {
                $(this).addClass("active");
                $(".RightPanel").find(".card-header").html(i18n.BirdInfo + '<a href="javascript:void()" data-bs-toggle="tooltip" title=' + i18n.Close + ' onclick="closeRight()"><i class="fas fa-times"></i></a>');
                if (configOptions.UserInfo.UserRole == "Sponsor") {
                    topic.publish('Reports/BirdsInfoData');
                }
                $("#divTOCSetting").css("display", "none");
                $("#tocWidget").css("display", "none");
                $("#divBirdInfoWidget").css("display", "block");
                $("#divTOCWidget").css("display", "none");
                $("#divBasemapWidget").css("display", "none");
                $("#divMeasureWidget").css("display", "none");
                $("#divExportVideo").css("display", "none");
                CleanBirdInfoWidgets();               
            }
            else if (name == "publicTracking") {
                $(this).addClass("active");
                $(".RightPanel").find(".card-header").html(i18n.publicTracking + '<a href="javascript:void()" data-bs-toggle="tooltip" title=' + i18n.Close + ' onclick="closeRight()"><i class="fas fa-times"></i></a>');
                $("#Divpublicuser").css("display", "block");
            }
            var pgDir = document.getElementsByTagName('html');

            if (pgDir[0].dir == 'rtl' || pgDir[0].style.direction == 'rtl')
                $(".RightPanel .card-header a").css('float', 'left');
            else
                $(".RightPanel .card-header a").css('float', 'right');
        });

        $('.ManageUsers').click(function () {
           // ClearManageUsersControls();
            $('.PanelToggleAnim').hide();
            $(".ManageContainer").show().animate({
                bottom: '-100%'
            }, 200);

            $("#ManageUsers").show().animate({
                bottom: '0px'
            }, 500);

            var panwid = $('#SlidePanel').width();
            var pgDirR = document.getElementsByTagName('html');

            if (pgDirR[0].dir == 'rtl' || pgDirR[0].style.direction == 'rtl') {                
                $("#SlidePanel").css("width", panwid);
                $(".StopOverdiv").css("width", panwid);
                $("#SlidePanel").animate({ right: -panwid }, 200);
            }
            else {              
                $("#SlidePanel").css("width", panwid);
                $(".StopOverdiv").css("width", panwid);
                $("#SlidePanel").animate({ left: -panwid }, 200);
            }
        });
        $('.ManageGroupIds').click(function () {
            $('.PanelToggleAnim').hide();
            $(".ManageContainer").show().animate({
                bottom: '-100%'
            }, 200);

            $("#ManageGroupIds").show().animate({
                bottom: '0px'
            }, 500);
            var panwid = $('#SlidePanel').width();

          
            var pgDirR = document.getElementsByTagName('html');

            if (pgDirR[0].dir == 'rtl' || pgDirR[0].style.direction == 'rtl') {

                $("#SlidePanel").animate({ right: -panwid }, 200);
                $("#SlidePanel").css("width", panwid);
                $(".StopOverdiv").css("width", panwid);
            }
            else {

                $("#SlidePanel").animate({ left: -panwid}, 200);
                $("#SlidePanel").css("width", panwid);
                $(".StopOverdiv").css("width", panwid);

            }
        });





        $('.ManageAuditLogs').click(function () {
            $('.PanelToggleAnim').hide();
            $(".ManageContainer").show().animate({
                bottom: '-100%'
            }, 200);

            $("#ManageAuditLogs").show().animate({
                bottom: '0px'
            }, 500);
            var panwid = $('#SlidePanel').width();


            var pgDirR = document.getElementsByTagName('html');

            if (pgDirR[0].dir == 'rtl' || pgDirR[0].style.direction == 'rtl') {


                $("#SlidePanel").animate({ right: -panwid }, 200);
                $("#SlidePanel").css("width", panwid);
                $(".StopOverdiv").css("width", panwid);
            }
            else {


                $("#SlidePanel").animate({ left: -panwid }, 200);
                $("#SlidePanel").css("width", panwid);
                $(".StopOverdiv").css("width", panwid);

            }
        });
        $('.ManageBirds').click(function () {
           // ClearManageBirdControls();
            $('.PanelToggleAnim').hide();
            $(".ManageContainer").show().animate({
                bottom: '-100%'
            }, 200);

            $("#ManageBirds").show().animate({
                bottom: '0px'
            }, 500);
                       
            var panwid = $('#SlidePanel').width();
            var pgDirB = document.getElementsByTagName('html');
            if (pgDirB[0].dir == 'rtl' || pgDirB[0].style.direction == 'rtl') {

                $("#SlidePanel").animate({ right: -panwid }, 200);
                $("#SlidePanel").css("width", panwid);
                $(".StopOverdiv").css("width", panwid);
                $(".esriSimpleSliderTL").animate({ right: "20px !important" }, 200);

            }
            else {
                $("#SlidePanel").animate({ left: -panwid }, 200);
                $("#SlidePanel").css("width", panwid);
                $(".StopOverdiv").css("width", panwid);
                $(".esriSimpleSliderTL").animate({ left: "20px !important" }, 200);

            }

           
        });

        $(".ToolsAnchor").click(function () {
            $(".ToolsAnchor").removeClass("active");
            $(this).addClass("active");

        });


        $('.PanelTrigger').click(function () {
            $('.PanelToggle').show();
            $('.PanelToggleAnim').hide();
            $("#divWidget").empty();
            var pgDirL = document.getElementsByTagName('html');
            if (pgDirL[0].dir == 'rtl' || pgDirL[0].style.direction == 'rtl')

                $("#SlidePanel").animate({ right: '-300px' }, 200);

            else

                $("#SlidePanel").animate({ left: '-300px' }, 200);

            $(".StopOverdiv").css("width", "300px");
            $(".StopOverdiv").animate({
                right: "-320px"
            }, 200);

            $(".ManageContainer").animate({
                bottom: '-100%'
            }, 200);

            var name = $(this).prop("name");
            var div = document.createElement('div');

            div.id = name.split(' ').join('') + counter;
            counter++;
            /*div.className = 'block';*/
            $("#divWidget").append(div);

          


            if (name == "Data Browse by PTT IDs") {
                $("#SlidePanel").css("width", "300px");
                
                var pgDirL = document.getElementsByTagName('html');
                if (pgDirL[0].dir == 'rtl' || pgDirL[0].style.direction == 'rtl') {
                    $("#SlidePanel").animate({ right: '0px' }, 200);
                    $(".esriSimpleSliderTL").animate({ right: '320px' }, 200);
                    $(".esriSimpleSliderTL").animate({ right: "320px !important" }, 0);

                }

                else {
                    $("#SlidePanel").animate({ left: '0px' }, 200);
                    $(".esriSimpleSliderTL").animate({ left: '320px' }, 200);
                    $(".esriSimpleSliderTL").animate({ left: "320px !important" }, 0);

                }
                $("#SlidePanel").find(".card-header").html(i18n.DataBrowsebyPTTIDs + '<a href="javascript:void()" data-bs-toggle="tooltip" title=' + i18n.Close + ' onclick="closeNav()"><i class="fas fa-times"></i></a>');
                $('.PanelToggleAnim').hide();
                $(this).addClass("active");
                $("#divPTTIDWidget").css("display", "block");
                $("#divPTTDNameWidget").css("display", "none");
                $("#divSpeciesWidget").css("display", "none");
                $("#divPrintWidget").css("display", "none");
                $("#divMigrationWidget").css("display", "none");
            }
            else if (name == "Data Browse by Names") {
                var pgDir2 = document.getElementsByTagName('html');

                if (pgDir2[0].dir == 'rtl' || pgDir2[0].style.direction == 'rtl') {
                    $("#SlidePanel").css("width", "300px");
                    $("#SlidePanel").animate({ right: '0px' }, 200);
                    $(".esriSimpleSliderTL").animate({ right: '320px' }, 200);

                }
                else {
                    $(".optWrapper").find("label").css('margin-right', '0px');
                    $("#SlidePanel").css("width", "300px");
                    $("#SlidePanel").animate({ left: '0px' }, 200);
                    $(".esriSimpleSliderTL").animate({ left: '320px' }, 200);
                }

                $("#SlidePanel").find(".card-header").html(i18n.DataBrowsebyNames + '<a href="javascript:void()" data-bs-toggle="tooltip" title=' + i18n.Close + ' onclick="closeNav()"><i class="fas fa-times"></i></a>');
                $('.PanelToggleAnim').hide();
                $(this).addClass("active");
                $("#divPTTIDWidget").css("display", "none");
                $("#divPTTDNameWidget").css("display", "block");
                $("#divSpeciesWidget").css("display", "none");
                //$("#divDataSummaryWidget").css("display", "none");
                $("#divPrintWidget").css("display", "none");
                $("#divMigrationWidget").css("display", "none");
            }
            else if (name == "Data Browse by IDs") {
                if ($(window).width() <= 480) {
                    var pgDir2 = document.getElementsByTagName('html');

                    if (pgDir2[0].dir == 'rtl' || pgDir2[0].style.direction == 'rtl') {
                        $("#SlidePanel").css("width", "300px");
                        $("#SlidePanel").animate({ right: '0px' }, 200);
                        $(".esriSimpleSliderTL").animate({ right: '320px' }, 300);

                    }
                    else {
                        $("#SlidePanel").css("width", "300px");
                        $("#SlidePanel").animate({ left: '0px' }, 200);
                        $(".esriSimpleSliderTL").animate({ left: '320px' }, 300);

                    }

                }
                else {
                var pgDir2 = document.getElementsByTagName('html');

                if (pgDir2[0].dir == 'rtl' || pgDir2[0].style.direction == 'rtl') {
                    $("#SlidePanel").css("width", "600px");
                    $("#SlidePanel").animate({ right: '0px' }, 200);
                    $(".esriSimpleSliderTL").animate({ right: '620px' }, 300);

                }
                else {
                    $("#SlidePanel").css("width", "600px");
                    $("#SlidePanel").animate({ left: '0px' }, 200);
                    $(".esriSimpleSliderTL").animate({ left: '620px' }, 300);

                }
                }



                $("#SlidePanel").find(".card-header").html(i18n.DataBrowsebyIDs + '<a href="javascript:void()" data-bs-toggle="tooltip" title=' + i18n.Close + ' onclick="closeNav()"><i class="fas fa-times"></i></a>');
                $('.PanelToggleAnim').hide();
                $(this).addClass("active");

                $("#divPTTIDWidget").css("display", "none");
                $("#divPTTDNameWidget").css("display", "none");
                $("#divSpeciesWidget").css("display", "block");
                $("#divPrintWidget").css("display", "none");
                $("#divMigrationWidget").css("display", "none");
            }
            else if (name == "Print") {
                var pgDir2 = document.getElementsByTagName('html');

                if (pgDir2[0].dir == 'rtl' || pgDir2[0].style.direction == 'rtl') {
                    $("#SlidePanel").css("width", "300px");
                    $("#SlidePanel").animate({ right: '0px' }, 200);
                    $(".esriSimpleSliderTL").animate({ right: '320px' }, 200);

                }

                else {
                    $("#SlidePanel").css("width", "300px");
                    $("#SlidePanel").animate({ left: '0px' }, 200);
                    $(".esriSimpleSliderTL").animate({ left: '320px' }, 200);

                }
                $("#SlidePanel").find(".card-header").html(i18n.Print + '<a href="javascript:void()" data-bs-toggle="tooltip" title=' + i18n.Close + ' onclick="closeNav()"><i class="fas fa-times"></i></a>');
                    $(this).addClass("active");
                    $("#divPTTIDWidget").css("display", "none");
                    $("#divPTTDNameWidget").css("display", "none");
                    $("#divSpeciesWidget").css("display", "none");
                    //$("#divDataSummaryWidget").css("display", "none");
                $("#divPrintWidget").css("display", "block");
                $("#divMigrationWidget").css("display", "none");
            }

            else if (name == "Season Correction") {

                var pgDir2 = document.getElementsByTagName('html');

                if (pgDir2[0].dir == 'rtl' || pgDir2[0].style.direction == 'rtl') {
                    $("#SlidePanel").css("width", "300px");
                    $("#SlidePanel").animate({ right: '0px' }, 200);
                    $(".esriSimpleSliderTL").animate({ right: '320px' }, 200);

                }

                else {
                    $("#SlidePanel").css("width", "300px");
                    $("#SlidePanel").animate({ left: '0px' }, 200);
                    $(".esriSimpleSliderTL").animate({ left: '320px' }, 200);

                }
                
                $("#SlidePanel").find(".card-header").html(i18n.UpdateMigration + '<a href="javascript:void()" data-bs-toggle="tooltip" title=' + i18n.Close + ' onclick="closeNav()"><i class="fas fa-times"></i></a>');
                $(this).addClass("active");
                $("#divPTTIDWidget").css("display", "none");
                $("#divPTTDNameWidget").css("display", "none");
                $("#divSpeciesWidget").css("display", "none");
                $("#divPrintWidget").css("display", "none");
                $("#divMigrationWidget").css("display", "block");
            }

            var pgDir = document.getElementsByTagName('html');

            if (pgDir[0].dir == 'rtl' || pgDir[0].style.direction == 'rtl')
                $(".LeftPanel .card-header a").css('float', 'left');
            else
                $(".LeftPanel .card-header a").css('float', 'right');



            $("#SlidePanel").animate({ left: '0px' }, 300);
        });




        


    });



