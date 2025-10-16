require(["esri/map",
    "esri/config",
    'dojo/_base/lang',
    "esri/arcgis/utils",
    "dojo/on",
    "dojo/dom",
    "esri/units",
    "emap/Basemaps/Basemaps",
    "emap/Measurement/Measurement",
    "emap/BirdTrackingPublicUser/BirdTrackingPublicUser",
    "emap/PublicUserGoogleAnimation/PublicUserGoogleAnimation",
    "emap/GoogleAnimateWidgetCopy/GoogleAnimateWidgetCopy",
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
    "esri/symbols/TextSymbol",
    "esri/layers/FeatureLayer",
    "esri/layers/LabelClass",
    "dojo/parser",
    "dojo/i18n!emap/nls/stringsroot",
    'dojo/topic',
    "emap/NavigationBar/NavigationBar",
    "emap/BTRouteWidget/BTRouteWidget",
    "dojo/store/Memory",
    "dijit/layout/BorderContainer",
    /*"dijit/layout/TabContainer",*/
    "dijit/layout/ContentPane",
    "dijit/layout/AccordionContainer",
    "dojo/domReady!"],
    function (Map, esriConfig, lang, arcgisUtils, on, dom, Units, Basemaps, MeasureWidget,
        BirdTrackingPublicUser, PublicUserGoogleAnimation, GoogleAnimateWidgetCopy,  Locator, InfoTemplate,
        webMercatorUtils, GraphicsLayer, Graphic, SimpleRenderer, Point, SimpleMarkerSymbol, SimpleLineSymbol, Color, 
        TextSymbol, FeatureLayer,
        LabelClass, parser, i18n, topic, NavigationBar, BTRouteWidget, Memory) {

        parser.parse();
        esriConfig.defaults.io.corsEnabledServers.push("coastmap.com");
        esriConfig.defaults.io.corsEnabledServers.push("fdc.ead.ae");
        esriConfig.defaults.io.corsEnabledServers.push("enviroportal.ead.ae");
        esriConfig.defaults.io.corsEnabledServers.push("tasks.arcgisonline.com");
        esriConfig.defaults.io.corsEnabledServers.push("sampleserver6.arcgisonline.com");
        esriConfig.defaults.io.corsEnabledServers.push("utility.arcgisonline.com");
        esriConfig.defaults.io.corsEnabledServers.push("cdnjs.cloudflare.com");
        esriConfig.defaults.io.corsEnabledServers.push("localhost:56757");
        esriConfig.defaults.io.alwaysUseProxy = false;
        esri.config.defaults.io.timeout = 1800000;
        counter = 0;


        dojo.requireLocalization("emap", "stringsroot");
        var
            CurrentExtent,
            isLoadmap;

        var i18n;


        if (typeof (localStorage.getItem('isUserLogged') != "undefined" && localStorage.getItem('isUserLogged') != null)) {
            if (localStorage.getItem('isUserLogged') == "True") {
                localStorage.removeItem('isUserLogged');
            }
            else {
                window.location = "Home.html";
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
            $("#lblHeaderUserNameMobile").text(username);
            $("#lblHeaderRoleName").text(localStorage.loggedInRole);
            $("#lblHeaderRoleNameMobile").text(localStorage.loggedInRole);
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
            //$("#hypHomepage").attr("href", "index.html");
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
            //$("#hypHomepage").attr("href", "index_arabic.html");
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
            // blindly doing this, does not support nested tags.
            // you could add conditional logic to check for children 
            // and if they exist separately process them, otherwise 
            // replace the html.
        });
        var initialExtent = new esri.geometry.Extent(46.02079, 21.6952, 58.1466, 27.6761, new esri.SpatialReference({ wkid: 4326 }));

        map = new Map("PublicmapDiv", {
            //basemap: "satellite",
            basemap: "satellite",
            center: configOptions.mapCenter,
            zoom: configOptions.Zoom,
            logo: false,
            smartNavigation: true
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

                initializeWidgets();

            });

        });

        //$("#logout").click(function () {
        //    window.location = "Home.html";
           
        //});
        //$(".publiclogoutevent").click(function () {
        //    if (localStorage.getItem('isArabicPage') == "True") {
        //        window.location = "Home_Ar.html";

        //    } else {
        //        window.location = "Home.html";
        //    }
        //    //window.location = "Home.html";
        //});

        $('.PanelToggle').click(function () {

            var pgDir = document.getElementsByTagName('html');

            if (pgDir[0].dir == 'rtl' || pgDir[0].style.direction == 'rtl') {
                var SlideDiv = $(".LeftPanelStatic").css("right");

                if (SlideDiv == "0px") {
                    $(".LeftPanelStatic").show().animate({
                        right: '-300px'
                    }, 200);
                    $('.PanelToggle').html('<i class="fas fa-angle-double-right"></i>');
                    /*$(".esriSimpleSliderTL").animate({ right: '20px !important' }, 200);*/
                    $("#PublicmapDiv_zoom_slider").css("right", '20px');
                } else {

                    $(".LeftPanelStatic").show().animate({
                        right: '0px'
                    }, 200);
                    $('.PanelToggle').html('<i class="fas fa-angle-double-left"></i>');
                    $("#PublicmapDiv_zoom_slider").css("right", '320px');
                    /*$(".esriSimpleSliderTL").animate({ right: '320px !important' }, 200);*/
                }
            }

            else {

                var SlideDiv = $(".LeftPanelStatic").css("left");
                //  alert(SlideDiv);
                if (SlideDiv == "0px") {
                    $(".LeftPanelStatic").show().animate({
                        left: '-300px'
                    }, 200);
                    /*$(".esriSimpleSliderTL").animate({ left: '20px !important' }, 200);*/
                    //$(".esriSimpleSliderTL").css("left", '20px !important');
                    $("#PublicmapDiv_zoom_slider").css("left", '20px');
                    $('.PanelToggle').html('<i class="fas fa-angle-double-right"></i>');


                } else {
                    $(".LeftPanelStatic").show().animate({
                        left: '0px'
                    }, 200);
                    /*$(".esriSimpleSliderTL").animate({ left: '320px !important' }, 200);*/
                    //$(".esriSimpleSliderTL").css("left", '320px !important');
                    $("#PublicmapDiv_zoom_slider").css("left", '320px');
                    $('.PanelToggle').html('<i class="fas fa-angle-double-left"></i>');


                }


            }


        });
        $(".publiclogoutevent").click(function () {

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
                    if (localStorage.getItem('isArabicPage') == "True") {
                        window.location = "Home_Ar.html";

                    } else {
                        window.location = "Home.html";
                    }
                },
                error: function (err) {

                }
            });


            //if (localStorage.getItem('isArabicPage') == "True") {
            //    window.location = "Home_Ar.html";

            //} else {
            //    window.location = "Home.html";
            //}

        });

        function initializeWidgets() {



            var NB = new NavigationBar({
                map: configOptions.CurrentMap,
                config: configOptions.widgets.navigation.options,
                layers: configOptions.operationalLayers
            }, "navToolbar");
            NB.startup();

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

            //var Publicanimate = new PublicUserGoogleAnimation({
            //    map: configOptions.CurrentMap,
            //    currentuser: "Admin",
            //}, "divPublicanimateWidget");

            

            var animate = new GoogleAnimateWidgetCopy({
                map: configOptions.CurrentMap,
                currentuser: configOptions.UserInfo.UserRole,
            }, "divanimateWidget1");



            if ((configOptions.UserInfo.UserRole).toUpperCase() == "PUBLIC") {
                var TrackingPublicUser = new BirdTrackingPublicUser({
                    ServiceUrl: configOptions.ServiceUrl,
                    queryResultsWidget: BTR,
                    animateResults: animate,
                    map: configOptions.CurrentMap,
                }, "Divpublicuser");
                TrackingPublicUser.startup();

            }

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
                        clearAll();
                        $(".icon-bar a").removeClass("active");
                        return true;
                    } else if (result.isDenied) {
                        $(".icon-bar a").removeClass("active");
                        return false;
                    }
                })






                //var choice = confirm($(this).attr('data-confirm'));
                //if (choice) {
                //    clearAll();
                //    $(".icon-bar a").removeClass("active");
                //    return true;

                //}
                //else {
                //    $(".icon-bar a").removeClass("active");
                //    return false;

                //}
            });

        }


        function clearAll() {
            var currentWidget = this;
            map.graphics.clear();
            var layersInfo = map.graphicsLayerIds;
            for (var i = layersInfo.length - 1; i >= 0; i--) {
                var layer = map.getLayer(layersInfo[i]);
                //console.log(layer);
                if (layer != null) {

                    if (layer.id.indexOf("_T") >= 0 || layer.id.indexOf("_L") >= 0 || layer.id.indexOf("_P") >= 0) {
                        map.removeLayer(layer);
                        var rowclass = "tr" + layer.id.split('(')[0];
                        $("." + rowclass).remove();
                    }
                }
            }
            topic.publish('mapClickMode/DeleteGraphics');

            if (map.getLayer("StopOver_Areas") != null) {
                map.removeLayer(map.getLayer("StopOver_Areas"));
                map.removeLayer(map.getLayer("SO_Symbols"));
            }

        };
        function CleanUpWidgets() {
            topic.publish('mapClickMode/ClearWidgets');
            topic.publish('mapClickMode/ClearStopOverControls');
        };


        function ClearMeasures() {
            topic.publish('mapClickMode/setCurrent', 'measure');
        };

        function ClearMeasureTools() {
            topic.publish('mapClickMode/ClearMeasureTools');
        };

        window.onload = function () {
            $(".OverlayHome").fadeOut();
        }
        




        $('.RightPanelSlide').click(function () {
            $("#divRightPanelWidget").empty();

            var pgDirR = document.getElementsByTagName('html');

            if (pgDirR[0].dir == 'rtl' || pgDirR[0].style.direction == 'rtl') {
             //   alert("0");
                

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
                
               // alert("1");

            }




           

            var name = $(this).prop("name");
            var div = document.createElement('div');

            div.id = name.split(' ').join('') + counter;
            counter++;
            $(".RightPanelSlide").removeClass("active");
            $("#divRightPanelWidget").append(div);
            if (name == "Measurement") {
                $(this).addClass("active");
                $(".RightPanel").find(".card-header").html(i18n.Measurement + '<a href="javascript:void()" data-bs-toggle="tooltip" title=' + i18n.Close + ' class="PUclose" onclick="closeRight()"><i class="fas fa-times"></i></a>');
                $("#divTOCSetting").css("display", "none");
                $("#divMeasureWidget").css("display", "block");
                $("#divTOCWidget").css("display", "none");
                $("#divBasemapWidget").css("display", "none");
                $("#divBirdInfoWidget").css("display", "none");
                $("#divExportVideo").css("display", "none");

                var pgDirR = document.getElementsByTagName('html');

                if (pgDirR[0].dir == 'rtl' || pgDirR[0].style.direction == 'rtl') {
                    $(".PUclose").css('float', 'left');
                }
                else {
                    $(".PUclose").css('float', 'right');
                }
            }
            else if (name == "Basemaps") {
                ClearMeasures();
                $(this).addClass("active");
                $(".RightPanel").find(".card-header").html(i18n.Basemaps + '<a href="javascript:void()" data-bs-toggle="tooltip" title=' + i18n.Close + ' class="PUclose" onclick="closeRight()"><i class="fas fa-times"></i></a>');
                $("#divTOCSetting").css("display", "none");
                $("#divBasemapWidget").css("display", "block");
                $("#divTOCWidget").css("display", "none");
                $("#divMeasureWidget").css("display", "none");
                $("#divBirdInfoWidget").css("display", "none");
                $("#divExportVideo").css("display", "none");
                ClearMeasureTools();

                var pgDirR = document.getElementsByTagName('html');

                if (pgDirR[0].dir == 'rtl' || pgDirR[0].style.direction == 'rtl') {
                    $(".PUclose").css('float', 'left');
                }
                else {
                    $(".PUclose").css('float', 'right');
                }
            }
          
        });

    });



