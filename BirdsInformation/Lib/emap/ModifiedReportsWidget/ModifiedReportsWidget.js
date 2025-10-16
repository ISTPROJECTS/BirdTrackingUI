define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/topic',
    "dojo/text!emap/ModifiedReportsWidget/templates/ModifiedReportsWidget.html",
    "dojo/i18n!emap/ModifiedReportsWidget/nls/Resource",
    /* 'xstyle/css!../ReportsWidget/css/ModifiedReportsWidget.css',*/
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, topic, dijitTemplate, i18n) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: dijitTemplate,
        widgetsInTemplate: true,
        _i18n: i18n,
        map: null,
        title: i18n.title,
        domNode: null,
        ServiceUrl: null,
        queryResultsWidget: null,
        currentuser: null,
        reportLocs: null,
        reportResults: [],
        globalcurrentWidget: null,
        GlobalSensorTypevalue: null,
        chkpttids: [],
        backgroundColorCode: null,
        TotalLocationCountTable: [],
        PlatformIDList: [],
        YearsList: [],
        LocationCountPlatformIDList: [],
        LocationCount: [],
        SpeedPlatformID: [],
        AvgSpeedCount: [],
        TotalSpeedCountValue: [],
        AltitudePlatformID: [],
        AvgAltitudeCount: [],
        TotalAltitudeCountValue: [],
        AltitudeData: [],
        SpeedData: [],
        ExcelDownloadUrls: [],

        ArgosTotalLocationCountTable: [],
        ArgosPlatformIDList: [],
        ArgosYearsList: [],
        ArgosLocationCountPlatformIDList: [],
        ArgosLocationCount: [],
        ArgosSpeedPlatformID: [],
        ArgosAvgSpeedCount: [],
        ArgosTotalSpeedCountValue: [],
        ArgosAltitudePlatformID: [],
        ArgosAvgAltitudeCount: [],
        ArgosTotalAltitudeCountValue: [],
        ArgosAltitudeData: [],

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
            var currentWidget = this;
            this.inherited(arguments);
            globalcurrentWidget = this;


            topic.subscribe('Reports/ExploreData', lang.hitch(this, function (ReportsExploreData) {

                if (ReportsExploreData == "Argos") {
                    $("#ReportHeadingLabel").text("Argos Report");
                    $("#TableReportHeading").text("Argos Report");
                    currentWidget.GlobalSensorTypevalue = "Argos";
                }
                else if (ReportsExploreData == "GPS") {
                    $("#ReportHeadingLabel").text("GPS Report");
                    $("#TableReportHeading").text("GPS Report");
                    currentWidget.GlobalSensorTypevalue = "GPS";
                }
                else if (ReportsExploreData == "GSM") {
                    $("#ReportHeadingLabel").text("GSM Report");
                    $("#TableReportHeading").text("GSM Report")
                    currentWidget.GlobalSensorTypevalue = "GSM";
                }
                currentWidget.getsensortype();
                currentWidget.GetPlatformidsbasedonSensortype();
                currentWidget.getnoofLocations();
                currentWidget.getnoofBirds();
                currentWidget.getnoofSpecies();
                currentWidget.getavgSpeed();
                currentWidget.getavgAltitude();
                if (configOptions.UserInfo.UserRole == "Admin") {
                    $(currentWidget.getRawData).css("display", "block");
                }
                else {
                    $(currentWidget.getRawData).css("display", "none");
                }
                $(".BacktoDash").css("display", "block");
            }));
            $('.SlideToggle').click(function () {

                var pgDir = document.getElementsByTagName('html');

                if (pgDir[0].dir == 'rtl' || pgDir[0].style.direction == 'rtl') {
                    var SlideDiv = $(".AnimationSideDiv").css("right");

                    if (SlideDiv == "0px") {
                        $(this).closest(".ReportsHideShow").find(".AnimationSideDiv").show().animate({
                            right: '-280px'
                        }, 200);
                    } else {

                        $(this).closest(".ReportsHideShow").find(".AnimationSideDiv").show().animate({
                            right: '0px'
                        }, 200);
                    }
                }

                else {

                    var SlideDiv = $(".AnimationSideDiv").css("left");
                    //  alert(SlideDiv);
                    if (SlideDiv == "0px") {
                        $(this).closest(".ManageContainer").find(".AnimationSideDiv").show().animate({
                            left: '-280px'
                        }, 200);
                    } else {
                        $(this).closest(".ManageContainer").find(".AnimationSideDiv").show().animate({
                            left: '0px'
                        }, 200);
                    }


                }


            });


            $(currentWidget.Reporttodate).on("change", function () {
                //currentWidget.getPTTDS();
                currentWidget.getnoofLocations();
                currentWidget.getnoofBirds();
                currentWidget.getnoofSpecies();
                currentWidget.getavgSpeed();
                currentWidget.getavgAltitude();
            });

            $("#ExportReportMobile").click(function () {
                var filesForDownload = [];
                filesForDownload.push({ path: $("#Report1").val(), name: "file1.txt" });
                filesForDownload.push({ path: $("#Report2").val(), name: "file2.txt" });
                filesForDownload.push({ path: $("#Report3").val(), name: "file3.txt" });
                filesForDownload.push({ path: $("#Report4").val(), name: "file4.txt" });
                filesForDownload.push({ path: $("#Report5").val(), name: "file5.txt" });
                filesForDownload.push({ path: $("#Report6").val(), name: "file6.txt" });
                filesForDownload.push({ path: $("#Report7").val(), name: "file7.txt" });
                filesForDownload.push({ path: $("#Report8").val(), name: "file8.txt" });

                download_files(filesForDownload);
                function download_files(files) {
                    function download_next(i) {
                        if (i >= files.length) {
                            return;
                        }
                        if (files[i].path != "") {
                            var a = document.createElement('a');
                            a.href = files[i].path;
                            a.target = '_blank';

                            if ('download' in a) {
                                a.download = files[i].name;
                            }

                            (document.body || document.documentElement).appendChild(a);
                            if (a.click) {
                                a.click(); // The click method is supported by most browsers.
                            }
                            else {
                                window.open(files[i].path);
                            }
                            //console.log('1');
                            a.parentNode.removeChild(a);
                        }
                        setTimeout(function () {
                            download_next(i + 1);
                        }, 5000);
                    }
                    // Initiate the first download.
                    download_next(0);
                }
            });


            //$("#ExportReportMobile").click(function () {
            //    alert($("#Report1").val());

            //    var filesForDownload = [];
            //    filesForDownload.push({ path: $("#Report1").val(), name: "file1.txt" });
            //    filesForDownload.push({ path: $("#Report2").val(), name: "file2.txt" });
            //    filesForDownload.push({ path: $("#Report3").val(), name: "file3.txt" });
            //    filesForDownload.push({ path: $("#Report4").val(), name: "file4.txt" });
            //    filesForDownload.push({ path: $("#Report5").val(), name: "file1.txt" });
            //    filesForDownload.push({ path: $("#Report6").val(), name: "file2.txt" });
            //    filesForDownload.push({ path: $("#Report7").val(), name: "file3.txt" });
            //    filesForDownload.push({ path: $("#Report8").val(), name: "file4.txt" });

            //    var temporaryDownloadLink = document.createElement("a");
            //    temporaryDownloadLink.style.display = 'none';

            //    document.body.appendChild(temporaryDownloadLink);

            //    for (var n = 0; n < filesForDownload.length; n++) {
            //        if (filesForDownload[n].path != "") {
            //            var download = filesForDownload[n];
            //            temporaryDownloadLink.setAttribute('href', download.path);
            //            temporaryDownloadLink.setAttribute('download', download.name);

            //            temporaryDownloadLink.click();
            //        }
            //    }

            //    document.body.removeChild(temporaryDownloadLink);


            //    //const a = document.createElement('a');
            //    //a.setAttribute('href', $("#Report1").val());
            //    //a.setAttribute('download', 'download.csv');
            //    //a.setAttribute('class', 'downloadAll');
            //    ////a.click();

            //    //const a1 = document.createElement('a');
            //    //a1.setAttribute('href', $("#Report2").val());
            //    //a1.setAttribute('download', 'download.csv');
            //    //a1.setAttribute('class', 'downloadAll');
            //    ////a1.click();

            //    //document.body.appendChild(a);
            //    //document.body.appendChild(a1);

            //    //a.click() + a1.click();

            //    //document.body.removeChild(temporaryDownloadLink);




            //    //$(".downloadAll").click();

            //    //$("#ExportReportMobile1").attr("href", 'https://www.google.com/');
            //    //$("#ExportReportMobile2").attr("href", 'https://www.google.com/');

            //    //$("#ExportReportMobile1").trigger('click');
            //    //$("#ExportReportMobile2").click();



            //});




            $("#ExportReport").click(function () {
                var Sensortype = $(currentWidget.ddlsensor).val();

                if (configOptions.UserInfo.UserRole == "Sponsor") {
                    var sensortype = [];
                    var PID = [];
                    var IDwithSensor = configOptions.SponsorandPublicID;
                    for (var i = 0; i < IDwithSensor.length; i++) {
                        var splitData = IDwithSensor[i].split("-");
                        sensortype.push(splitData[1]);
                        PID.push(splitData[0]);
                    }
                    if (Sensortype == "GPS") {
                        if (sensortype.includes("Argos") == false) {

                            currentWidget.JSONToCSVConvertorYearWiseLocations("Total Locations", currentWidget.TotalLocationCountTable, currentWidget.PlatformIDList);
                            currentWidget.JSONToCSVConvertorLocationCount("Location Count", currentWidget.LocationCount, currentWidget.LocationCountPlatformIDList);
                            currentWidget.JSONToCSVConvertorFlightSpeed("Flight Speed", currentWidget.SpeedData, currentWidget.SpeedPlatformID, currentWidget.TotalSpeedCountValue, Sensortype);
                            currentWidget.JSONToCSVConvertorAltitude("Altitude", currentWidget.TotalAltitudeCountValue, currentWidget.AltitudeData);
                        }
                        else {
                            currentWidget.JSONToCSVConvertorYearWiseLocations("Total Locations", currentWidget.TotalLocationCountTable, currentWidget.PlatformIDList);
                            currentWidget.JSONToCSVConvertorLocationCount("Location Count", currentWidget.LocationCount, currentWidget.LocationCountPlatformIDList);
                            currentWidget.JSONToCSVConvertorFlightSpeed("Flight Speed", currentWidget.SpeedData, currentWidget.SpeedPlatformID, currentWidget.TotalSpeedCountValue, Sensortype);
                            currentWidget.JSONToCSVConvertorAltitude("Altitude", currentWidget.TotalAltitudeCountValue, currentWidget.AltitudeData);
                            currentWidget.JSONToCSVConvertorYearWiseLocations("Argos Total Locations", currentWidget.ArgosTotalLocationCountTable, currentWidget.ArgosPlatformIDList);
                            currentWidget.JSONToCSVConvertorLocationCount("Argos Location Count", currentWidget.ArgosLocationCount, currentWidget.ArgosLocationCountPlatformIDList);
                            currentWidget.JSONToCSVConvertorFlightSpeed("Argos Location Classes", currentWidget.ArgosAvgSpeedCount, currentWidget.ArgosSpeedPlatformID, "", "Argos");
                            currentWidget.JSONToCSVConvertorAltitude("Argos Altitude", currentWidget.ArgosTotalAltitudeCountValue, currentWidget.ArgosAltitudeData);
                        }
                    }
                    else if (Sensortype == "Argos") {
                        currentWidget.JSONToCSVConvertorYearWiseLocations("Total Locations", currentWidget.TotalLocationCountTable, currentWidget.PlatformIDList);
                        currentWidget.JSONToCSVConvertorLocationCount("Location Count", currentWidget.LocationCount, currentWidget.LocationCountPlatformIDList);
                        currentWidget.JSONToCSVConvertorFlightSpeed("Location Classes", currentWidget.AvgSpeedCount, currentWidget.SpeedPlatformID, currentWidget.AvgSpeedCount, Sensortype);
                        currentWidget.JSONToCSVConvertorAltitude("Altitude", currentWidget.TotalAltitudeCountValue, currentWidget.AltitudeData);
                    }
                    else {
                        currentWidget.JSONToCSVConvertorYearWiseLocations("Total Locations", currentWidget.TotalLocationCountTable, currentWidget.PlatformIDList);
                        currentWidget.JSONToCSVConvertorLocationCount("Location Count", currentWidget.LocationCount, currentWidget.LocationCountPlatformIDList);
                        currentWidget.JSONToCSVConvertorFlightSpeed("Flight Speed", currentWidget.SpeedData, currentWidget.SpeedPlatformID, currentWidget.AvgSpeedCount, Sensortype);
                        currentWidget.JSONToCSVConvertorAltitude("Altitude", currentWidget.TotalAltitudeCountValue, currentWidget.AltitudeData);
                    }
                }
                else {

                    if (Sensortype == "GPS") {
                        currentWidget.JSONToCSVConvertorYearWiseLocations("Total Locations", currentWidget.TotalLocationCountTable, currentWidget.PlatformIDList);
                        currentWidget.JSONToCSVConvertorLocationCount("Location Count", currentWidget.LocationCount, currentWidget.LocationCountPlatformIDList);
                        currentWidget.JSONToCSVConvertorFlightSpeed("Flight Speed", currentWidget.SpeedData, currentWidget.SpeedPlatformID, currentWidget.TotalSpeedCountValue, Sensortype);
                        currentWidget.JSONToCSVConvertorAltitude("Altitude", currentWidget.TotalAltitudeCountValue, currentWidget.AltitudeData);
                        currentWidget.JSONToCSVConvertorYearWiseLocations("Argos Total Locations", currentWidget.ArgosTotalLocationCountTable, currentWidget.ArgosPlatformIDList);
                        currentWidget.JSONToCSVConvertorLocationCount("Argos Location Count", currentWidget.ArgosLocationCount, currentWidget.ArgosLocationCountPlatformIDList);
                        currentWidget.JSONToCSVConvertorFlightSpeed("Argos Location Classes", currentWidget.ArgosAvgSpeedCount, currentWidget.ArgosSpeedPlatformID, "", "Argos");
                        currentWidget.JSONToCSVConvertorAltitude("Argos Altitude", currentWidget.ArgosTotalAltitudeCountValue, currentWidget.ArgosAltitudeData);

                    }
                    else if (Sensortype == "Argos") {
                        currentWidget.JSONToCSVConvertorYearWiseLocations("Total Locations", currentWidget.TotalLocationCountTable, currentWidget.PlatformIDList);
                        currentWidget.JSONToCSVConvertorLocationCount("Location Count", currentWidget.LocationCount, currentWidget.LocationCountPlatformIDList);
                        currentWidget.JSONToCSVConvertorFlightSpeed("Location Classes", currentWidget.AvgSpeedCount, currentWidget.SpeedPlatformID, currentWidget.AvgSpeedCount, Sensortype);
                        currentWidget.JSONToCSVConvertorAltitude("Altitude", currentWidget.TotalAltitudeCountValue, currentWidget.AltitudeData);
                    }
                    else {
                        currentWidget.JSONToCSVConvertorYearWiseLocations("Total Locations", currentWidget.TotalLocationCountTable, currentWidget.PlatformIDList);
                        currentWidget.JSONToCSVConvertorLocationCount("Location Count", currentWidget.LocationCount, currentWidget.LocationCountPlatformIDList);
                        currentWidget.JSONToCSVConvertorFlightSpeed("Flight Speed", currentWidget.SpeedData, currentWidget.SpeedPlatformID, currentWidget.AvgSpeedCount, Sensortype);
                        currentWidget.JSONToCSVConvertorAltitude("Altitude", currentWidget.TotalAltitudeCountValue, currentWidget.AltitudeData);
                    }
                }
            });
            $(".dateclass").datepicker();
            $(".CloseContainer1").click(function () {
                $(this).closest(".ManageContainer").show().animate({
                    bottom: '-100%'
                }, 20);

                $("#SlidePanel").animate({ left: '-300px' }, 200);
                $(".esriSimpleSliderTL").animate({ left: '20px' }, 200);

            });
            $(".ReportTabs .nav-link").click(function () {
                $(".ReportTabs .nav-link").removeClass("active");
                $(this).addClass("active");
            });
            $('.ReportsDashLink').click(function () {

                $(".ReportsHideShow").hide();
                $("#ReportMainSec").show();
                $(".CloseContainer").css("display", "block");
                $("#container1").html("");
                $("#container2").html("");
                $("#container3").html("");
                $("#container4").html("");
                $(".ViewTables").css("display", "none");
                currentWidget.ClearControls();


            });
            $('.BacktoDash').click(function () {
                $(this).closest('.ReportsHideShow').hide();
                $("#NewReportWid").fadeIn();
                $(".ReportsHideShow").hide();


                $("#Reportcontainer1").html("");
                $("#Reportcontainer2").html("");
                $("#container3").html("");
                $("#container4").html("");
                $("#chart1").html("");
                $("#chart2").html("");
                $("#chart3").html("");
                $("#chart4").html("");
                $(".ChartsforSensor").css("display", "none");
                $(".ChartsSecondrow").css("display", "none");
                $(".ArgosBasedCharts").css("display", "none");
                $(".SpeedCountBox").css("display", "none");
                $(".AltitudeCountBox").css("display", "none");
                currentWidget.ClearControls();
                $(".CloseContainer").css("display", "block");
            });
            $('.BacktoRep').click(function () {

                $(this).closest('.TableSec').hide();
                $("#ArgosDash").fadeIn();
                $(".BacktoDash").show();
                $(".BacktoRep").hide();
            });
            $("html").on('click', '.select-all', function () {
                var myObj = $(this).closest('.SumoSelect.open').children()[0];
                if ($(this).hasClass("selected")) {
                    if (currentWidget.GlobalSensorTypevalue == "Argos") {
                        if (myObj.length == 1) {
                            currentWidget.GetDetailsofBird();
                            currentWidget.getavgAltitude();
                        }
                    }
                    if (currentWidget.GlobalSensorTypevalue == "GPS") {
                        if (myObj.length == 1) {
                            currentWidget.GetDetailsofBird();
                            currentWidget.getavgSpeed();
                            currentWidget.getavgAltitude();
                        }
                    }
                    if (currentWidget.GlobalSensorTypevalue == "GSM") {
                        if (myObj.length == 1) {
                            currentWidget.GetDetailsofBird();
                            currentWidget.getavgSpeed();
                            currentWidget.getavgAltitude();
                        }
                    }
                }
                else {
                    currentWidget.GetDetailsofBird();
                }
            });






        },

        startup: function () {
            var currentWidget = this;
        },
        ClearControls: function () {
            var currentWidget = this;
            $(currentWidget.Reportfromdate).val("");
            $(currentWidget.Reporttodate).val("");
            $(currentWidget.PttsTable).html('');
            $(currentWidget.getReports).css("display", "block");
            $(currentWidget.lblfromdate).css("display", "none");
            $(currentWidget.lbltodate).css("display", "none");
            $(currentWidget.lblgreater).css("display", "none");
            $(currentWidget.lblSensortype).css("display", "none");
            $(currentWidget.ddlSpeciesName).val("");
            $(currentWidget.ddlSpeciesName).html('');
            $(currentWidget.ddlplatformid).val("");
            $(currentWidget.ddlplatformid).html('');
            $(currentWidget.ddlDurationtype).val("");
            $(currentWidget.lblSpeciesName).css("display", "none");
            $(currentWidget.lblplatformid).css("display", "none");
        },
        getsensortype: function () {
            var currentWidget = this;
            $(currentWidget.ddlsensor).html("");
            $(currentWidget.ddlsensor).val("");
            if (configOptions.UserInfo.UserRole == "Sponsor") {
                var sensortype = [];
                var PID = [];
                $(currentWidget.ddlsensor).html("");
                $(currentWidget.ddlsensor).val("");
                var IDwithSensor = configOptions.SponsorandPublicID;
                for (var i = 0; i < IDwithSensor.length; i++) {
                    var splitData = IDwithSensor[i].split("-");

                    sensortype.push(splitData[1]);
                    PID.push(splitData[0]);
                }
                $(currentWidget.ddlsensor).append('<option value=""></option>');
                if (sensortype.includes("Argos") == true) {
                    if (currentWidget.GlobalSensorTypevalue == "Argos") {
                        $(currentWidget.ddlsensor).append('<option value="Argos" Selected>Argos</option>');
                    }
                }
                if (sensortype.includes("GPS") == true) {
                    if (currentWidget.GlobalSensorTypevalue == "GPS") {
                        $(currentWidget.ddlsensor).append('<option value="GPS" Selected>GPS</option>');
                    }
                }
                if (sensortype.includes("GSM") == true) {
                    if (currentWidget.GlobalSensorTypevalue == "GSM") {
                        $(currentWidget.ddlsensor).append('<option value="GSM" Selected>GSM</option>');
                    }
                }
            }
            else {
                if (currentWidget.GlobalSensorTypevalue == "Argos") {
                    $(currentWidget.ddlsensor).append('<option value=""></option>');
                    $(currentWidget.ddlsensor).append('<option value="Argos" Selected>Argos</option>');
                    $(currentWidget.ddlsensor).append('<option value="GPS">GPS</option>');
                    $(currentWidget.ddlsensor).append('<option value="GSM">GSM</option>');
                }
                else if (currentWidget.GlobalSensorTypevalue == "GPS") {
                    $(currentWidget.ddlsensor).append('<option value=""></option>');
                    $(currentWidget.ddlsensor).append('<option value="Argos">Argos</option>');
                    $(currentWidget.ddlsensor).append('<option value="GPS" Selected>GPS</option>');
                    $(currentWidget.ddlsensor).append('<option value="GSM">GSM</option>');
                }
                else if (currentWidget.GlobalSensorTypevalue == "GSM") {
                    $(currentWidget.ddlsensor).append('<option value=""></option>');
                    $(currentWidget.ddlsensor).append('<option value="Argos">Argos</option>');
                    $(currentWidget.ddlsensor).append('<option value="GPS">GPS</option>');
                    $(currentWidget.ddlsensor).append('<option value="GSM" Selected>GSM</option>');
                }
                else {
                    $(currentWidget.ddlsensor).append('<option value=""></option>');
                    $(currentWidget.ddlsensor).append('<option value="Argos" Selected>Argos</option>');
                    $(currentWidget.ddlsensor).append('<option value="GPS">GPS</option>');
                    $(currentWidget.ddlsensor).append('<option value="GSM">GSM</option>');
                }
            }
            $(currentWidget.ddlsensor).SumoSelect({ search: true, searchText: 'Enter here.', placeholder: currentWidget._i18n.placeholderSensorType, forceCustomRendering: true, forceCustomRendering: true });
            $(currentWidget.ddlsensor)[0].sumo.reload();
            $(currentWidget.ddlSpeciesName).SumoSelect({ search: true, searchText: 'Enter here.', placeholder: currentWidget._i18n.placeholderSpeciesName });
            $(currentWidget.ddlplatformid).SumoSelect({
                closeAfterClearAll: true, clearAll: true,
                placeholder: currentWidget._i18n.placeholderPlatFormId, selectAll: true, okCancelInMulti: true, captionFormatAllSelected: ' {0} ' + currentWidget._i18n.SelectedAllItems, captionFormat: ' {0} ' + currentWidget._i18n.SelectedItems, forceCustomRendering: true, locale: [currentWidget._i18n.OK, currentWidget._i18n.Cancel, currentWidget._i18n.SelectAll],
                renderLi: (li, originalOption) => {
                    // Edit your li here
                    if (li[0].innerText.indexOf("AC") != -1) {
                        $(li).find("label").css("color", "#228B22");
                        $(li).find("label").text(li[0].innerText.substr(0, li[0].innerText.indexOf("(AC)")));
                    }
                    else {
                        $(li).find("label").css("color", "red");
                        $(li).find("label").text(li[0].innerText.substr(0, li[0].innerText.indexOf("(NA)")));
                    }
                    return li;
                }
            });
        },
        
        GetPlatformidsbasedonSensortype: function () {
            var currentWidget = this;
            $(currentWidget.ddlSpeciesName).val("");
            $(currentWidget.ddlSpeciesName)[0].sumo.reload();
            $(currentWidget.Reportfromdate).val("");
            $(currentWidget.Reporttodate).val("");
            $(currentWidget.ddlplatformid).val("");
            $(currentWidget.ddlplatformid)[0].sumo.reload();
            $("#Reportcontainer1").html("");
            $("#Reportcontainer2").html("");
            $("#container3").html("");
            $("#container4").html("");
            $("#chart1").html("");
            $("#chart2").html("");
            $("#chart3").html("");
            $("#chart4").html("");
            $(".ViewTables").css("display", "none");
            $(".ArgosViewTables").css("display", "none");
            $(".ArgosReportDetails").css("display", "none");
            $(".ChartsforSensor").css("display", "none");
            $(".ArgosBasedCharts").css("display", "none");
            $(".SpeedCountBox").css("display", "none");
            $(".AltitudeCountBox").css("display", "none");
            $(currentWidget.lblSensortype).css("display", "none");

            var sensorType = $(currentWidget.ddlsensor).val();
            currentWidget.GetRawDataDownloadExcel();
            if (sensorType == "") {
                return;
            }
            else if (sensorType == "Argos") {
                $("#ReportHeadingLabel").text(currentWidget._i18n.ArgosReport);
                $("#TableReportHeading").text(currentWidget._i18n.ArgosReport);
                $("#SubHeadingReports").text(currentWidget._i18n.ArgosReport);
            }
            else if (sensorType == "GPS") {
                $("#ReportHeadingLabel").text(currentWidget._i18n.GPSReport);
                $("#TableReportHeading").text(currentWidget._i18n.GPSReport);
                $("#SubHeadingReports").text(currentWidget._i18n.GPSReport);
            }
            else if (sensorType == "GSM") {
                $("#ReportHeadingLabel").text(currentWidget._i18n.GSMReport);
                $("#TableReportHeading").text(currentWidget._i18n.GSMReport);
                $("#SubHeadingReports").text(currentWidget._i18n.GSMReport);
            }



            if (configOptions.UserInfo.UserRole == "Sponsor") {
                var IDwithSensor = configOptions.SponsorandPublicID;
                var url;
                var pidurl;
                var Sensortype = [];
                var PID = [];
                for (var i = 0; i < IDwithSensor.length; i++) {
                    var splitData = IDwithSensor[i].split("-");
                    Sensortype.push(splitData[1]);
                    PID.push(splitData[0]);
                }

                var requestData = {
                    id: PID.toString(),
                    type: sensorType.toString()
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JSONDistinctSponsorCommonNames/",
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        $(currentWidget.ddlSpeciesName).html("");
                        $(currentWidget.ddlSpeciesName)[0].sumo.reload();

                        var jsonObj = JSON.parse(result);
                        var speciesname;
                        if (jsonObj != null) {
                            $(currentWidget.ddlSpeciesName).append('<option value=""></option>');
                            for (i = 0; i < jsonObj.length; i++) {
                                speciesname = currentWidget.ConvertToTitleCase(jsonObj[i].CommonName);
                                var optionValue = $('<option>', {
                                    value: speciesname,
                                    text: speciesname
                                });
                                $(currentWidget.ddlSpeciesName).append(optionValue);
                                
                            }
                        }
                        $(currentWidget.ddlSpeciesName)[0].sumo.reload();
                        currentWidget.getnoofLocations();
                        currentWidget.getnoofBirds();
                        currentWidget.getnoofSpecies();
                        currentWidget.getavgSpeed();
                        currentWidget.getavgAltitude();
                    },
                    error: function (xhr, error) {
                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchSpeciesNames);
                    },
                });
                var requestData = {
                    id: PID.toString(),
                    type: sensorType.toString()
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JSONDistinctSponsorPlatformIds/",
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        $(currentWidget.ddlplatformid).html("");
                        $(currentWidget.ddlplatformid)[0].sumo.reload();

                        var jsonObj = JSON.parse(result);
                        if (jsonObj != null) {
                            for (i = 0; i < jsonObj.length; i++) {
                                if (jsonObj[i].Status == "AC") {
                                    var optionValue = $('<option>', {
                                        value: jsonObj[i].PID,
                                        html: jsonObj[i].PID + " (AC)"
                                        //text: jsonObj[i].PID + " (" + "AC" + ")"
                                    });
                                    $(currentWidget.ddlplatformid).append(optionValue);
                                    
                                }
                                else {
                                    var optionValue1 = $('<option>', {
                                        value: jsonObj[i].PID,
                                        html: jsonObj[i].PID + " (NA)"
                                        //text: jsonObj[i].PID + " (" + "NA" + ")"
                                    });
                                    $(currentWidget.ddlplatformid).append(optionValue1);
                                    
                                }

                            }
                        }

                        $(currentWidget.ddlplatformid)[0].sumo.reload();
                    },
                    error: function (xhr, error) {
                        AlertMessages('error', '', currentWidget._i18n.Unabletofetchbirdplatformids);
                    },
                });



            }
            else {
                var requestData = {
                    type: sensorType.toString()
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JSONDistinctCommonNames/",
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        $(currentWidget.ddlSpeciesName).html("");
                        $(currentWidget.ddlSpeciesName)[0].sumo.reload();

                        var jsonObj = JSON.parse(result);
                        var speciesname;
                        if (jsonObj != null) {
                            $(currentWidget.ddlSpeciesName).append('<option value=""></option>');
                            for (i = 0; i < jsonObj.length; i++) {
                                speciesname = currentWidget.ConvertToTitleCase(jsonObj[i].CommonName);
                                var optionValue = $('<option>', {
                                    value: speciesname,
                                    text: speciesname
                                });
                                $(currentWidget.ddlSpeciesName).append(optionValue);
                                
                            }
                        }
                        $(currentWidget.ddlSpeciesName)[0].sumo.reload();
                        currentWidget.getnoofLocations();
                        currentWidget.getnoofBirds();
                        currentWidget.getnoofSpecies();
                        currentWidget.getavgSpeed();
                        currentWidget.getavgAltitude();

                    },
                    error: function (xhr, error) {
                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchSpeciesNames);
                    },
                });

                var requestData = {
                    type: sensorType.toString()
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JSONDistinctPlatformIds/" ,
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        $(currentWidget.ddlplatformid).html("");
                        $(currentWidget.ddlplatformid)[0].sumo.reload();

                        var jsonObj = JSON.parse(result);
                        if (jsonObj != null) {
                            for (i = 0; i < jsonObj.length; i++) {
                                if (jsonObj[i].Status == "AC") {
                                    var optionValue = $('<option>', {
                                        value: jsonObj[i].PID,
                                        html: jsonObj[i].PID + " (AC)"
                                        //text: jsonObj[i].PID + " (" + "AC" + ")"
                                    });
                                    $(currentWidget.ddlplatformid).append(optionValue);
                                    
                                }
                                else {
                                    var optionValue1 = $('<option>', {
                                        value: jsonObj[i].PID,
                                        html: jsonObj[i].PID + " (NA)"
                                        //text: jsonObj[i].PID + " (" + "NA" + ")"
                                    });
                                    $(currentWidget.ddlplatformid).append(optionValue1);
                                    
                                }

                            }
                        }

                        $(currentWidget.ddlplatformid)[0].sumo.reload();
                    },
                    error: function (xhr, error) {
                        AlertMessages('error', '', currentWidget._i18n.Unabletofetchbirdplatformids);
                    },
                });

            }



        },
        ConvertToTitleCase: function (SpeciesName) {
            if (SpeciesName != "" || typeof (SpeciesName) != "undefined") {
                return SpeciesName.replace(
                    /\w\S*/g,
                    function (txt) {
                        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                    }
                );
            }
        },
        GetDetailsofBird: function () {
            var currentWidget = this;
            var Platformid = $(currentWidget.ddlplatformid).val();
            var sensorType = $(currentWidget.ddlsensor).val();
            currentWidget.GetRawDataDownloadExcel();
            $("#Reportcontainer1").html("");
            $("#Reportcontainer2").html("");
            $("#container3").html("");
            $("#container4").html("");
            $("#chart1").html("");
            $("#chart2").html("");
            $("#chart3").html("");
            $("#chart4").html("");
            $(".ViewTables").css("display", "none");
            $(".ArgosViewTables").css("display", "none");
            $(".ChartsforSensor").css("display", "none");
            $(".ArgosBasedCharts").css("display", "none");
            if ($(currentWidget.ddlplatformid).val() == "") {
                $(".SpeedCountBox").css("display", "none");
                $(".AltitudeCountBox").css("display", "none");
                $("#lbllocationheading").text(currentWidget._i18n.NumberofLocations);
                $("#lblSpeciesheading").text(currentWidget._i18n.NumberofSpecies);
                $("#lblBirdsheading").text(currentWidget._i18n.NumberofBirds);
            }
            else if (Platformid.length != 1) {
                $(".SpeedCountBox").css("display", "none");
                $(".AltitudeCountBox").css("display", "none");
            }
            else if (Platformid.length == 1) {
                if (Platformid != null) {
                    Platformid = Platformid.toString();
                }
                if (sensorType != null) {
                    sensorType = sensorType.toString();
                }
                var requestData = {
                    id: Platformid,
                    type: sensorType
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JSONStartDateEndDate/",
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        var jsonObj = JSON.parse(result);
                        if (jsonObj != null) {
                            var start = jsonObj[0].StartDate.split('T');
                            var end = jsonObj[0].EndDate.split('T');
                            var startdate = start[0].split("-").reverse().join("-");
                            var enddate = end[0].split("-").reverse().join("-");
                            $(currentWidget.Reportfromdate).val(startdate);
                            $(currentWidget.Reporttodate).val(enddate);


                            if (sensorType == "Argos") {
                                $(".SpeedCountBox").css("display", "none");
                                $(".AltitudeCountBox").css("display", "block");
                                $("#lbllocationheading").text(currentWidget._i18n.NoofLocations);
                                $("#lblSpeciesheading").text(currentWidget._i18n.NoofSpecies);
                                $("#lblBirdsheading").text(currentWidget._i18n.NoofBirds);
                            }
                            else {
                                $(".SpeedCountBox").css("display", "block");
                                $(".AltitudeCountBox").css("display", "block");
                                $("#lbllocationheading").text(currentWidget._i18n.NoofLocations);
                                $("#lblSpeciesheading").text(currentWidget._i18n.NoofSpecies);
                                $("#lblBirdsheading").text(currentWidget._i18n.NoofBirds);
                            }

                        }
                    },
                    error: function (xhr, error) {
                        AlertMessages("error", '', currentWidget._i18n.Unabletofetchplatformids);
                        console.debug(xhr); console.debug(error);
                    },
                });
            }
            else {
                var sensorType = $(currentWidget.ddlsensor).val();
                if (sensorType == "Argos") {
                    $(".SpeedCountBox").css("display", "none");
                    $(".AltitudeCountBox").css("display", "block");
                    $("#lbllocationheading").text(currentWidget._i18n.NoofLocations);
                    $("#lblSpeciesheading").text(currentWidget._i18n.NoofSpecies);
                    $("#lblBirdsheading").text(currentWidget._i18n.NoofBirds);
                }
                else {
                    $(".SpeedCountBox").css("display", "block");
                    $(".AltitudeCountBox").css("display", "block");
                    $("#lbllocationheading").text(currentWidget._i18n.NoofLocations);
                    $("#lblSpeciesheading").text(currentWidget._i18n.NoofSpecies);
                    $("#lblBirdsheading").text(currentWidget._i18n.NoofBirds);
                }
            }
        },


        

        getPTTDS: function () {
            var currentWidget = this;
            $(currentWidget.ddlplatformid).val("");
            $(currentWidget.ddlplatformid)[0].sumo.reload();
            var BirdName = $(currentWidget.ddlSpeciesName).val();
            var sensorType = $(currentWidget.ddlsensor).val();
            var fromdate = $(currentWidget.Reportfromdate).val();
            var todate = $(currentWidget.Reporttodate).val();
            $(".ChartsforSensor").css("display", "none");
            $(".ArgosBasedCharts").css("display", "none");
            $(".ViewTables").css("display", "none");
            $(".ArgosViewTables").css("display", "none");
            currentWidget.GetRawDataDownloadExcel();
            var formIsValid = true;
            if (BirdName == "") {
                $(currentWidget.lblSpeciesName).css("display", "block");
                formIsValid = false;
            }
            if (sensorType == "") {
                $(currentWidget.lblSensortype).css("display", "none");
                formIsValid = false;
            }
            if (formIsValid == false) {

                return;
            }

            if (fromdate == "") {
                fromdate = null;
            }
            if (todate == "") {
                todate = null;
            }
            var sensortype = [];
            var PID = [];

            if (configOptions.UserInfo.UserRole == "Sponsor") {
                var pids;
                var IDwithSensor = configOptions.SponsorandPublicID;
                for (var i = 0; i < IDwithSensor.length; i++) {
                    var splitData = IDwithSensor[i].split("-");

                    sensortype.push(splitData[1]);
                    PID.push(splitData[0]);
                }
                var requestData = {
                    id: PID.toString(),
                    type: sensorType,
                    fromdate: fromdate,
                    todate: todate,
                    speciesname: BirdName
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonGetSponsorDistinctIdsbyName/",
                    type: 'POST',
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        $(currentWidget.ddlplatformid).html("");
                        $(currentWidget.ddlplatformid)[0].sumo.reload();
                        var jsonObj = JSON.parse(result);
                        if (jsonObj != null) {
                            for (i = 0; i < jsonObj.length; i++) {
                                if (jsonObj[i].Status == "AC") {
                                    var optionValue = $('<option>', {
                                        value: jsonObj[i].PID,
                                        html: jsonObj[i].PID + " (AC)"
                                        //text: jsonObj[i].PID + " (" + "AC" + ")"
                                    });
                                    $(currentWidget.ddlplatformid).append(optionValue);
                                    
                                }
                                else {
                                    var optionValue1 = $('<option>', {
                                        value: jsonObj[i].PID,
                                        html: jsonObj[i].PID + " (NA)"
                                        //text: jsonObj[i].PID + " (" + "NA" + ")"
                                    });
                                    $(currentWidget.ddlplatformid).append(optionValue1);
                                    
                                }
                            }
                        }
                        $(currentWidget.ddlplatformid)[0].sumo.reload();
                    },
                    error: function (xhr, error) {

                        AlertMessages("error", '', currentWidget._i18n.Unabletofetchbirdplatformids);

                        console.debug(xhr); console.debug(error);
                    },
                });

            }
            else {
                var requestData = {
                    type: sensorType,
                    fromdate: fromdate,
                    todate: todate,
                    speciesname: BirdName
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonGetDistinctIdsbyName/",
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        $(currentWidget.ddlplatformid).html("");
                        $(currentWidget.ddlplatformid)[0].sumo.reload();
                        var jsonObj = JSON.parse(result);
                        if (jsonObj != null) {
                            for (i = 0; i < jsonObj.length; i++) {
                                if (jsonObj[i].Status == "AC") {
                                    var optionValue = $('<option>', {
                                        value: jsonObj[i].PID,
                                        html: jsonObj[i].PID + " (AC)"
                                        //text: jsonObj[i].PID + " (" + "AC" + ")"
                                    });
                                    $(currentWidget.ddlplatformid).append(optionValue);
                                    
                                }
                                else {
                                    var optionValue1 = $('<option>', {
                                        value: jsonObj[i].PID,
                                        html: jsonObj[i].PID + " (NA)"
                                        //text: jsonObj[i].PID + " (" + "NA" + ")"
                                    });
                                    $(currentWidget.ddlplatformid).append(optionValue1);
                                    
                                }

                            }
                        }
                        $(currentWidget.ddlplatformid)[0].sumo.reload();
                        currentWidget.getnoofLocations();
                        currentWidget.getnoofBirds();
                        currentWidget.getnoofSpecies();
                        currentWidget.getavgSpeed();
                        currentWidget.getavgAltitude();
                    },
                    error: function (xhr, error) {

                        AlertMessages("error", '', currentWidget._i18n.Unabletofetchbirdplatformids);

                        console.debug(xhr); console.debug(error);
                    },
                });
            }
        },

        getnoofLocations: function () {
            var currentWidget = this;
            //$(".Overlay").fadeIn();
            var Sensortype = $(currentWidget.ddlsensor).val();
            var SpeciesName = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val().trim();
            var todate = $(currentWidget.Reporttodate).val().trim();
            var Platformid = $(currentWidget.ddlplatformid).val();
            var sensortype = [];
            var PID = [];
            if (fromdate == "") {
                fromdate = null;
            }
            if (todate == "") {
                todate = null;
            }
            if (Platformid == 0) {
                Platformid = null;
            }
            if (SpeciesName == "") {
                SpeciesName = null;
            }

            if (configOptions.UserInfo.UserRole == "Sponsor") {
                var pids;
                var IDwithSensor = configOptions.SponsorandPublicID;
                for (var i = 0; i < IDwithSensor.length; i++) {
                    var splitData = IDwithSensor[i].split("-");

                    sensortype.push(splitData[1]);
                    PID.push(splitData[0]);
                }
                if (Platformid == null) {
                    pids = PID;
                }
                else {
                    pids = Platformid;
                }
                var requestData = {
                    id: pids.toString(),
                    type: Sensortype,
                    fromdate: fromdate,
                    todate: todate,
                    speciesname: SpeciesName
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonGetSponsorNumberofLocations/",
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        $(currentWidget.LocationData).html("");
                        var jsonObj = JSON.parse(result);

                        if (jsonObj != null) {
                            currentWidget.birdInfo = jsonObj;
                            for (i = 0; i < jsonObj.length; i++) {
                                var Locations = jsonObj[i].Column1;
                                var LocationFormat = Locations.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                $(currentWidget.LocationData).text(LocationFormat);
                            }
                        }
                    },
                    error: function (xhr, error) {
                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdsLocation);
                        console.debug(xhr); console.debug(error);
                    },
                });

            }
            else {
                if (Platformid != null) {
                    Platformid = Platformid.toString();
                }
                var requestData = {
                    id: Platformid,
                    type: Sensortype,
                    speciesname: SpeciesName,
                    fromdate: fromdate,
                    todate: todate
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonGetNumberofLocations/",
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        /*$(currentWidget.divPlatFormIds).empty();*/
                        $(currentWidget.LocationData).html("");
                        var jsonObj = JSON.parse(result);

                        if (jsonObj != null) {
                            currentWidget.birdInfo = jsonObj;
                            for (i = 0; i < jsonObj.length; i++) {
                                var Locations = jsonObj[i].Column1;
                                var LocationFormat = Locations.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                $(currentWidget.LocationData).text(LocationFormat);
                            }
                        }
                    },
                    error: function (xhr, error) {
                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdsLocation);
                        console.debug(xhr); console.debug(error);
                    },
                });
            }
        },

        getnoofBirds: function () {
            var currentWidget = this;
            //$(".Overlay").fadeIn();
            var Sensortype = $(currentWidget.ddlsensor).val();
            var SpeciesName = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val().trim();
            var todate = $(currentWidget.Reporttodate).val().trim();
            var Platformid = $(currentWidget.ddlplatformid).val();
            if (fromdate == "") {
                fromdate = null;
            }
            if (todate == "") {
                todate = null;
            }
            if (Platformid == 0) {
                Platformid = null;
            }
            if (SpeciesName == "") {
                SpeciesName = null;
            }
            var sensortype = [];
            var PID = [];

            if (configOptions.UserInfo.UserRole == "Sponsor") {
                var pids;
                var IDwithSensor = configOptions.SponsorandPublicID;
                for (var i = 0; i < IDwithSensor.length; i++) {
                    var splitData = IDwithSensor[i].split("-");

                    sensortype.push(splitData[1]);
                    PID.push(splitData[0]);
                }

                if (Platformid == null) {
                    pids = PID;
                }
                else {
                    pids = Platformid;
                }
                var requestData = {
                    id: pids.toString(),
                    type: Sensortype,
                    fromdate: fromdate,
                    todate: todate,
                    speciesname: SpeciesName
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonGetSponsorNumberofBirds/",
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        $(currentWidget.BirdsData).html("");
                        var jsonObj = JSON.parse(result);

                        if (jsonObj != null) {
                            currentWidget.birdInfo = jsonObj;
                            for (i = 0; i < jsonObj.length; i++) {
                                var Birds = jsonObj[i].Column1;
                                $(currentWidget.BirdsData).text(Birds);


                            }
                        }
                    },
                    error: function (xhr, error) {


                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchTotalBirds);
                        console.debug(xhr); console.debug(error);
                    },
                });

            }
            else {
                if (Platformid != null) {
                    Platformid = Platformid.toString();
                }
                var requestData = {
                    id: Platformid,
                    type: Sensortype,
                    speciesname: SpeciesName,
                    fromdate: fromdate,
                    todate: todate
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonGetNumberofBirds/",
                    type: 'POST',
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        $(currentWidget.BirdsData).html("");
                        var jsonObj = JSON.parse(result);

                        if (jsonObj != null) {
                            currentWidget.birdInfo = jsonObj;
                            for (i = 0; i < jsonObj.length; i++) {
                                var Birds = jsonObj[i].Column1;
                                $(currentWidget.BirdsData).text(Birds);


                            }
                        }
                    },
                    error: function (xhr, error) {


                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchTotalBirds);
                        console.debug(xhr); console.debug(error);
                    },
                });
            }
        },

        getnoofSpecies: function () {
            var currentWidget = this;
            var Sensortype = $(currentWidget.ddlsensor).val();
            var SpeciesName = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val().trim();
            var todate = $(currentWidget.Reporttodate).val().trim();
            var Platformid = $(currentWidget.ddlplatformid).val();
            if (fromdate == "") {
                fromdate = null;
            }
            if (todate == "") {
                todate = null;
            }
            if (Platformid == 0) {
                Platformid = null;
            }
            if (SpeciesName == "") {
                SpeciesName = null;
            }
            var sensortype = [];
            var PID = [];
            if (configOptions.UserInfo.UserRole == "Sponsor") {
                var pids;
                var IDwithSensor = configOptions.SponsorandPublicID;
                for (var i = 0; i < IDwithSensor.length; i++) {
                    var splitData = IDwithSensor[i].split("-");

                    sensortype.push(splitData[1]);
                    PID.push(splitData[0]);
                }
                if (Platformid == null) {
                    pids = PID;
                }
                else {
                    pids = Platformid;
                }
                var requestData = {
                    id: pids.toString(),
                    type: Sensortype,
                    fromdate: fromdate,
                    todate: todate,
                    speciesname: SpeciesName
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonGetSponsorNumberofSpecies/",
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        $(currentWidget.SpeciesData).html("");
                        var jsonObj = JSON.parse(result);

                        if (jsonObj != null) {
                            currentWidget.birdInfo = jsonObj;
                            for (i = 0; i < jsonObj.length; i++) {
                                var Species = jsonObj[i].Column1;
                                $(currentWidget.SpeciesData).text(Species);


                            }
                        }
                    },
                    error: function (xhr, error) {

                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchTotalSpecies);
                        console.debug(xhr); console.debug(error);
                    },
                });

            }
            else {
                if (Platformid != null) {
                    Platformid = Platformid.toString();
                }
                var requestData = {
                    id: Platformid,
                    type: Sensortype,
                    speciesname: SpeciesName,
                    fromdate: fromdate,
                    todate: todate,
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonGetNumberofSpecies/",
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        $(currentWidget.SpeciesData).html("");
                        var jsonObj = JSON.parse(result);

                        if (jsonObj != null) {
                            currentWidget.birdInfo = jsonObj;
                            for (i = 0; i < jsonObj.length; i++) {
                                var Species = jsonObj[i].Column1;
                                $(currentWidget.SpeciesData).text(Species);


                            }
                        }
                    },
                    error: function (xhr, error) {

                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchTotalSpecies);
                        console.debug(xhr); console.debug(error);
                    },
                });
            }
        },

        getavgSpeed: function () {
            var currentWidget = this;
            var Sensortype = $(currentWidget.ddlsensor).val();
            var SpeciesName = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val().trim();
            var todate = $(currentWidget.Reporttodate).val().trim();
            var Platformid = $(currentWidget.ddlplatformid).val();
            if (fromdate == "") {
                fromdate = null;
            }
            if (SpeciesName == "") {
                SpeciesName = null;
            }
            if (todate == "") {
                todate = null;
            }
            if (Platformid == 0) {
                Platformid = null;
            }
            var sensortype = [];
            var PID = [];
            if (configOptions.UserInfo.UserRole == "Sponsor") {
                var pids;
                var IDwithSensor = configOptions.SponsorandPublicID;
                for (var i = 0; i < IDwithSensor.length; i++) {
                    var splitData = IDwithSensor[i].split("-");

                    sensortype.push(splitData[1]);
                    PID.push(splitData[0]);
                }

                if (Platformid != null) {
                    pids = PID;
                }
                else {
                    pids = Platformid;
                }
                if (pids != null) {
                    pids = pids.toString();
                }
                var requestData = {
                    id: pids,
                    type: Sensortype,
                    fromdate: fromdate,
                    todate: todate,
                    speciesname: SpeciesName
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonGetSponsorAverageSpeed/",
                    type: 'POST',
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        $(currentWidget.AvgSpeedData).html("");
                        var jsonObj = JSON.parse(result);

                        if (jsonObj != null) {
                            currentWidget.birdInfo = jsonObj;
                            for (i = 0; i < jsonObj.length; i++) {
                                var AvgSpeed = jsonObj[i].Column1;
                                var Speedval = currentWidget.roundMe(AvgSpeed, 4);
                                if (AvgSpeed == null) {
                                    Speedval = 0;
                                }
                                $(currentWidget.AvgSpeedData).text(Speedval);


                            }
                        }
                    },
                    error: function (xhr, error) {
                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchAvgSpeed);
                        console.debug(xhr); console.debug(error);
                    },
                });

            }
            else {
                if (Platformid != null) {
                    Platformid = Platformid.toString();
                }
                var requestData = {
                    id: Platformid,
                    type: Sensortype,
                    speciesname: SpeciesName,
                    fromdate: fromdate,
                    todate: todate
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonGetAverageSpeed/" ,
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        $(currentWidget.AvgSpeedData).html("");
                        var jsonObj = JSON.parse(result);

                        if (jsonObj != null) {
                            currentWidget.birdInfo = jsonObj;
                            for (i = 0; i < jsonObj.length; i++) {
                                var AvgSpeed = jsonObj[i].Column1;
                                var Speedval = currentWidget.roundMe(AvgSpeed, 4);
                                if (AvgSpeed == null) {
                                    Speedval = 0;
                                }
                                $(currentWidget.AvgSpeedData).text(Speedval);


                            }
                        }
                    },
                    error: function (xhr, error) {
                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchAvgSpeed);
                        console.debug(xhr); console.debug(error);
                    },
                });
            }
        },

        getavgAltitude: function () {
            var currentWidget = this;
            var Sensortype = $(currentWidget.ddlsensor).val();
            var SpeciesName = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val().trim();
            var todate = $(currentWidget.Reporttodate).val().trim();
            var Platformid = $(currentWidget.ddlplatformid).val();
            if (fromdate == "") {
                fromdate = null;
            }
            if (SpeciesName == "") {
                SpeciesName = null;
            }
            if (todate == "") {
                todate = null;
            }
            if (Platformid == 0) {
                Platformid = null;
            }
            var sensortype = [];
            var PID = [];
            if (configOptions.UserInfo.UserRole == "Sponsor") {
                var pids;
                var IDwithSensor = configOptions.SponsorandPublicID;
                for (var i = 0; i < IDwithSensor.length; i++) {
                    var splitData = IDwithSensor[i].split("-");

                    sensortype.push(splitData[1]);
                    PID.push(splitData[0]);
                }

                if (Platformid == null) {
                    pids = PID;
                }
                else {
                    pids = Platformid;
                }
                if (pids != null) {
                    pids = pids.toString();
                }
                var requestData = {
                    id: pids.toString(),
                    type: Sensortype,
                    fromdate: fromdate,
                    todate: todate,
                    speciesname: SpeciesName
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonGetSponsorAverageAltitude/",
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        $(currentWidget.AvgAltitudeData).html("");
                        var jsonObj = JSON.parse(result);

                        if (jsonObj != null) {
                            currentWidget.birdInfo = jsonObj;
                            for (i = 0; i < jsonObj.length; i++) {
                                var AvgAltitude = jsonObj[i].Column1;
                                var Altitudeval = currentWidget.roundMe(AvgAltitude, 4);
                                if (AvgAltitude == null) {
                                    Altitudeval = 0;
                                }
                                $(currentWidget.AvgAltitudeData).text(Altitudeval);


                            }
                        }
                    },
                    error: function (xhr, error) {

                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchAverageAltitude);

                        console.debug(xhr); console.debug(error);
                    },
                });

            }
            else {
                if (Platformid != null) {
                    Platformid = Platformid.toString();
                }
                var requestData = {
                    id: Platformid,
                    type: Sensortype,
                    fromdate: fromdate,
                    todate: todate,
                    speciesname: SpeciesName
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonGetAverageAltitude/",
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        $(currentWidget.AvgAltitudeData).html("");
                        var jsonObj = JSON.parse(result);

                        if (jsonObj != null) {
                            currentWidget.birdInfo = jsonObj;
                            for (i = 0; i < jsonObj.length; i++) {
                                var AvgAltitude = jsonObj[i].Column1;
                                var Altitudeval = currentWidget.roundMe(AvgAltitude, 4);
                                if (AvgAltitude == null) {
                                    Altitudeval = 0;
                                }
                                $(currentWidget.AvgAltitudeData).text(Altitudeval);


                            }
                        }
                    },
                    error: function (xhr, error) {

                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchAverageAltitude);

                        console.debug(xhr); console.debug(error);
                    },
                });
            }
        },
        roundMe: function (n, sig) {
            if (n === 0) return 0;
            var mult = Math.pow(10, sig - Math.floor(Math.log(n < 0 ? -n : n) / Math.LN10) - 1);
            return Math.round(n * mult) / mult;
        },
        adduserdetails: function () {
            var retval = (configOptions.UserInfo.UserName == "") ? "/null" : "/" + configOptions.UserInfo.UserName;
            retval += (configOptions.UserInfo.Password == "") ? "/null" : "/" + configOptions.UserInfo.Password;
            return retval;
        },

        RawDataGraph: function () {
            var currentWidget = this;
            $(".Overlay").fadeIn();
            var Sensortype = $(currentWidget.ddlsensor).val();
            var SpeciesName = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val().trim();
            var todate = $(currentWidget.Reporttodate).val().trim();
            var Platformid = $(currentWidget.ddlplatformid).val();



            if (fromdate != null && todate != null) {
                var isvalid = CheckDatesCompare(fromdate, todate);
                if (isvalid == false) {
                    $(".lblgreater").css("display", "block");
                    $(".Overlay").fadeOut();
                    return;
                }
            }
            if (fromdate == "") {
                fromdate = null;
            }
            if (todate == "") {
                todate = null;
            }
            if (Platformid == 0) {
                Platformid = null;
            }
            if (SpeciesName == "") {
                SpeciesName = null;
            }
            var sensortype = [];
            var PID = [];
            if (Platformid != null) {
                Platformid = Platformid.toString();
            }
            var requestdata = {
                id: Platformid,
                type: Sensortype,
                fromdate: fromdate,
                todate: todate,
                speciesname: SpeciesName,
                login: (configOptions.UserInfo.UserName == "") ? "null" : configOptions.UserInfo.UserName,
                password: (configOptions.UserInfo.Password == "") ? "null" : configOptions.UserInfo.Password
            };
            if (configOptions.UserInfo.UserRole == "Sponsor") {
                var pids;
                var IDwithSensor = configOptions.SponsorandPublicID;
                for (var i = 0; i < IDwithSensor.length; i++) {
                    var splitData = IDwithSensor[i].split("-");

                    sensortype.push(splitData[1]);
                    PID.push(splitData[0]);
                }
                if (Platformid == null) {
                    pids = PID;
                }
                else {
                    pids = Platformid;
                }
                if (pids != null) {
                    pids = pids.toString();
                }
                var requestData = {
                    id: pids.toString(),
                    type: Sensortype,
                    fromdate: fromdate,
                    todate: todate,
                    speciesname: SpeciesName
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonGetSponsorExportExcel/" ,
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {

                        var jsonObj = JSON.parse(result);
                        if (jsonObj == 0) {
                            AlertMessages("warning", '', currentWidget._i18n.NoResultsFound);

                            $(".Overlay").fadeOut();
                            return;
                        }
                        if (jsonObj != null) {
                            var pids = [];
                            var PIDArray = [];

                            var opts = [];
                            var PidArray = currentWidget.groupBy1(jsonObj, "PID");
                            for (key in PidArray) {
                                if (PidArray.hasOwnProperty(key)) {
                                    pids.push(key);
                                }
                            }


                            for (i = 0; i < pids.length; i++) {
                                if (i == 0) {
                                    opts.push({ sheetid: pids[i], header: true });
                                }
                                else {
                                    opts.push({ sheetid: pids[i], header: false });
                                }




                                PIDArray.push({ PID: pids[i], Periods: PidArray });
                            }





                            for (var k = 0; k < PIDArray.length; k++) {
                                var SheetArray = [];
                                var ids = [];
                                var DataArray = [];
                                for (key in PIDArray[k].Periods) {
                                    if (PIDArray[k].Periods.hasOwnProperty(key)) {
                                        ids.push(key);
                                    }
                                }
                                for (var m = 0; m < ids.length; m++) {
                                    var AssignedData = [];

                                    


                                    for (n = 0; n < PIDArray[k].Periods[ids[m]].length; n++) {

                                        if (Sensortype == "Argos") {
                                            AssignedData.push({ PID: PIDArray[k].Periods[ids[m]][n].PID, TDate: new Date(PIDArray[k].Periods[ids[m]][n].TDate), LocationClass: PIDArray[k].Periods[ids[m]][n].LocationClass, Lat: PIDArray[k].Periods[ids[m]][n].Lat, Long: PIDArray[k].Periods[ids[m]][n].Long, Speed: PIDArray[k].Periods[ids[m]][n].Speed, Altitude: PIDArray[k].Periods[ids[m]][n].Altitude });
                                        }
                                        else {
                                            AssignedData.push({ PID: PIDArray[k].Periods[ids[m]][n].PID, TDate: new Date(PIDArray[k].Periods[ids[m]][n].TDate), Lat: PIDArray[k].Periods[ids[m]][n].Lat, Long: PIDArray[k].Periods[ids[m]][n].Long, Speed: PIDArray[k].Periods[ids[m]][n].Speed, Altitude: PIDArray[k].Periods[ids[m]][n].Altitude });
                                        }
                                    }
                                    SheetArray.push(AssignedData);

                                }


                            }


                            var result = alasql('SELECT * INTO XLSX("RawDataReport.xlsx",?) FROM ?',
                                [opts, SheetArray]);

                        }
                        $(".Overlay").fadeOut();
                    },


                    error: function (xhr, error) {
                        $(".Overlay").fadeOut();
                        AlertMessages("error", '', currentWidget._i18n.UnabletoFetchRawDataDetails);
                        console.debug(xhr); console.debug(error);
                    },
                });

            }
            else {

                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonGetExportExcel" + "/",
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestdata),
                    success: function (result) {

                        var jsonObj = JSON.parse(result);
                        if (jsonObj == 0) {
                            AlertMessages("warning", '', currentWidget._i18n.NoResultsFound);

                            $(".Overlay").fadeOut();
                            return;
                        }
                        if (jsonObj != null) {
                            var pids = [];
                            var PIDArray = [];

                            var opts = [];
                            var PidArray = currentWidget.groupBy1(jsonObj, "PID");
                            for (key in PidArray) {
                                if (PidArray.hasOwnProperty(key)) {
                                    pids.push(key);
                                }
                            }


                            for (i = 0; i < pids.length; i++) {
                                if (i == 0) {
                                    opts.push({ sheetid: pids[i], header: true });
                                }
                                else {
                                    opts.push({ sheetid: pids[i], header: false });
                                }




                                PIDArray.push({ PID: pids[i], Periods: PidArray });
                            }





                            for (var k = 0; k < PIDArray.length; k++) {
                                var SheetArray = [];
                                var ids = [];
                                var DataArray = [];
                                for (key in PIDArray[k].Periods) {
                                    if (PIDArray[k].Periods.hasOwnProperty(key)) {
                                        ids.push(key);
                                    }
                                }
                                for (var m = 0; m < ids.length; m++) {
                                    var AssignedData = [];


                                    for (n = 0; n < PIDArray[k].Periods[ids[m]].length; n++) {
                                        if (Sensortype == "Argos") {
                                            if (typeof (PIDArray[k].Periods[ids[m]][n].IQ) != "undefined") {                                                
                                                AssignedData.push({ PID: PIDArray[k].Periods[ids[m]][n].PID, Date: new Date(PIDArray[k].Periods[ids[m]][n].TDate), LocationClass: PIDArray[k].Periods[ids[m]][n].LocationClass, Lat: PIDArray[k].Periods[ids[m]][n].Lat, Long: PIDArray[k].Periods[ids[m]][n].Long, Altitude: PIDArray[k].Periods[ids[m]][n].Altitude, IQ: PIDArray[k].Periods[ids[m]][n].IQ, NB_MESS: PIDArray[k].Periods[ids[m]][n].NB_Mess, BEST_LEVEL: PIDArray[k].Periods[ids[m]][n].Best_Level, PASS_DURATION: PIDArray[k].Periods[ids[m]][n].Pass_Duration });
                                            }
                                            else {                                                
                                                AssignedData.push({ PID: PIDArray[k].Periods[ids[m]][n].PID, Date: new Date(PIDArray[k].Periods[ids[m]][n].TDate), LocationClass: PIDArray[k].Periods[ids[m]][n].LocationClass, Lat: PIDArray[k].Periods[ids[m]][n].Lat, Long: PIDArray[k].Periods[ids[m]][n].Long, Altitude: PIDArray[k].Periods[ids[m]][n].Altitude });
                                            }
                                        }
                                        else if (Sensortype == "GPS") {
                                            var tempdate = GetFormatedDate(PIDArray[k].Periods[ids[m]][n].TDate.split('T')[0]);
                                            if (typeof (PIDArray[k].Periods[ids[m]][n].Speed) != "undefined") {
                                                AssignedData.push({ PID: PIDArray[k].Periods[ids[m]][n].PID, Date: new Date(PIDArray[k].Periods[ids[m]][n].TDate), Time: new Date(PIDArray[k].Periods[ids[m]][n].TTime).toLocaleTimeString(), Lat: PIDArray[k].Periods[ids[m]][n].Lat, Long: PIDArray[k].Periods[ids[m]][n].Long, Speed: PIDArray[k].Periods[ids[m]][n].Speed, Altitude: PIDArray[k].Periods[ids[m]][n].Altitude });
                                            }
                                            else {
                                                AssignedData.push({ PID: PIDArray[k].Periods[ids[m]][n].PID, Date: new Date(PIDArray[k].Periods[ids[m]][n].TDate), Time: new Date(PIDArray[k].Periods[ids[m]][n].TTime).toLocaleTimeString(), Lat: PIDArray[k].Periods[ids[m]][n].Lat, Long: PIDArray[k].Periods[ids[m]][n].Long });
                                            }
                                        }
                                        else if (Sensortype == "GSM") {
                                            if (typeof (PIDArray[k].Periods[ids[m]][n].Course) != "undefined") {
                                                AssignedData.push({ PID: PIDArray[k].Periods[ids[m]][n].PID, Date: new Date(PIDArray[k].Periods[ids[m]][n].TDate), Time: new Date(PIDArray[k].Periods[ids[m]][n].TTime).toLocaleTimeString(), Lat: PIDArray[k].Periods[ids[m]][n].Lat, Long: PIDArray[k].Periods[ids[m]][n].Long, Speed: PIDArray[k].Periods[ids[m]][n].Speed, Course: PIDArray[k].Periods[ids[m]][n].Course, Altitude: PIDArray[k].Periods[ids[m]][n].Altitude, HDOP: PIDArray[k].Periods[ids[m]][n].HDOP, VDOP: PIDArray[k].Periods[ids[m]][n].VDOP });
                                            }
                                            else {
                                                AssignedData.push({ PID: PIDArray[k].Periods[ids[m]][n].PID, Date: new Date(PIDArray[k].Periods[ids[m]][n].TDate), Time: new Date(PIDArray[k].Periods[ids[m]][n].TTime).toLocaleTimeString(), Lat: PIDArray[k].Periods[ids[m]][n].Lat, Long: PIDArray[k].Periods[ids[m]][n].Long });
                                            }
                                        }
                                    }
                                    SheetArray.push(AssignedData);

                                }


                            }


                            var result = alasql('SELECT * INTO XLSX("RawDataReport.xlsx",?) FROM ?',
                                [opts, SheetArray]);

                        }
                        $(".Overlay").fadeOut();
                    },


                    error: function (xhr, error) {
                        $(".Overlay").fadeOut();
                        AlertMessages("error", '', currentWidget._i18n.UnabletoFetchRawDataDetails);
                        console.debug(xhr); console.debug(error);
                    },
                });
            }
        },

        formatDate: function (input) {
            var datePart = input.match(/\d+/g),
                year = datePart[0].substring(2), // get only two digits
                month = datePart[1], day = datePart[2];

            return day + '/' + month + '/' + year;
        },

        AltitudeDataChart: function (xaxisdata) {
            var currentWidget = this;
            var pids;
            var Sensortype = $(currentWidget.ddlsensor).val();
            var fromdate = $(currentWidget.Reportfromdate).val().trim();
            var todate = $(currentWidget.Reporttodate).val().trim();
            var Platformid = $(currentWidget.ddlplatformid).val();
            var SpeciesName = $(currentWidget.ddlSpeciesName).val();
            if (fromdate == "") {
                fromdate = null;
            }


            if (todate == "") {
                todate = null;
            }
            if (Platformid == 0) {
                Platformid = null;
            }
            if (SpeciesName == "") {
                SpeciesName = null;
            }

            if (configOptions.UserInfo.UserRole == "Sponsor") {
                var sensortype = [];
                var PID = [];
                var IDwithSensor = configOptions.SponsorandPublicID;
                for (var i = 0; i < IDwithSensor.length; i++) {
                    var splitData = IDwithSensor[i].split("-");

                    sensortype.push(splitData[1]);
                    PID.push(splitData[0]);
                }
                if (Platformid == null) {
                    pids = PID;
                }
                else {
                    pids = Platformid;
                }

            }
            else {
                pids = Platformid;
            }

            currentWidget.AltitudeData = [];
            currentWidget.SpeedData = [];
            currentWidget.TotalAltitudeCountValue = [];
            if (pids != null) {
                pids = pids.toString();
            }
            var requestData = {
                id: pids,
                type: Sensortype,
                fromdate: fromdate,
                todate: todate,
                speciesname: SpeciesName
            };
            $.ajax({
                url: currentWidget.ServiceUrl + "JsonGetReportDataByAltitude/",
                type: 'POST', 
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {
                    var jsonObj = JSON.parse(result);
                    if (jsonObj == 0) {
                        AlertMessages("warning", '', currentWidget._i18n.NoResultsFound);
                        return;
                    }
                    if (jsonObj != null) {
                        var DatainSeries = [];
                        var SpeedDatainSeries = [];
                        var MeanArray = [];
                        var MaxArray = [];
                        var MinArray = [];
                        var SpeedMeanArray = [];
                        var SpeedMaxArray = [];
                        var SpeedMinArray = [];
                        var AltData = [];
                        var SpeedData = [];
                        var SpeedDataValues = [];

                        for (i = 0; i < jsonObj.length; i++) {
                            var MaxSpeed;
                            var MinSpeed;
                            var AverageSpeed;
                            var MaxAltitude;
                            var MinAltitude;
                            var AverageAlt;

                            var PID = jsonObj[i].PID;
                            if (jsonObj[i].maxalt == "0") {
                                MaxAltitude = parseInt(jsonObj[i].maxalt, 4);
                            }
                            else {
                                MaxAltitude = currentWidget.roundMe(jsonObj[i].maxalt, 4);
                            }
                            if (jsonObj[i].minalt == "0") {
                                MinAltitude = parseInt(jsonObj[i].minalt, 4);
                            }
                            else {
                                MinAltitude = currentWidget.roundMe(jsonObj[i].minalt, 4);
                            }
                            if (jsonObj[i].AvgAlt == "0") {
                                AverageAlt = parseInt(jsonObj[i].AvgAlt, 5);
                            }
                            else {
                                AverageAlt = currentWidget.roundMe(jsonObj[i].AvgAlt, 5);
                            }

                            if (jsonObj[i].maxspeed == "0") {
                                MaxSpeed = parseInt(jsonObj[i].maxspeed, 2);
                            }
                            else {
                                MaxSpeed = currentWidget.roundMe(jsonObj[i].maxspeed, 2);
                            }
                            if (jsonObj[i].minspeed == "0") {
                                MinSpeed = parseInt(jsonObj[i].minspeed, 2);
                            }
                            else {
                                MinSpeed = currentWidget.roundMe(jsonObj[i].minspeed, 2);
                            }
                            if (jsonObj[i].AvgSpeed == "0") {
                                AverageSpeed = parseInt(jsonObj[i].AvgSpeed, 2);
                            }
                            else {
                                AverageSpeed = currentWidget.roundMe(jsonObj[i].AvgSpeed, 2);
                            }

                            MeanArray.push(AverageAlt);
                            MaxArray.push(MaxAltitude);
                            MinArray.push(MinAltitude);

                            SpeedMeanArray.push(AverageSpeed);
                            SpeedMaxArray.push(MaxSpeed);
                            SpeedMinArray.push(MinSpeed);

                            AltData.push({ PID: PID, Count: jsonObj[i].Locations, MinData: MinAltitude, MaxData: MaxAltitude, AvgData: AverageAlt });
                            SpeedDataValues.push({ PID: PID, Count: jsonObj[i].Locations, MinData: MinSpeed, MaxData: MaxSpeed, AvgData: AverageSpeed });

                            //SpeedDataValues.push({ PID: PID, Count: jsonObj[i].Locations, MinData: currentWidget.roundMe(parseFloat(jsonObj[i].minspeed), 4), MaxData: currentWidget.roundMe(parseFloat(jsonObj[i].maxspeed), 4), AvgData: currentWidget.roundMe(parseFloat(jsonObj[i].AvgSpeed),5) });
                            currentWidget.TotalAltitudeCountValue.push(jsonObj[i].Locations);
                        }
                        DatainSeries.push({
                            name: currentWidget._i18n.Min, data: MinArray
                        }, {
                            name: currentWidget._i18n.Max, data: MaxArray
                        }, {
                            name: currentWidget._i18n.Avg, data: MeanArray
                        });

                        SpeedDatainSeries.push({
                            name: currentWidget._i18n.Min, data: SpeedMinArray
                        }, {
                            name: currentWidget._i18n.Max, data: SpeedMaxArray
                        }, {
                            name: currentWidget._i18n.Avg, data: SpeedMeanArray
                        });

                        currentWidget.AltitudeData = AltData;
                        currentWidget.SpeedData = SpeedDataValues;


                    }

                    if (Sensortype == "GPS") {
                        currentWidget.ArgosAltitudeData = [];
                        if (Platformid != null) {
                            Platformid = Platformid.toString();
                        }
                        var requestData = {
                            id: Platformid,
                            type: "Argos",
                            fromdate: fromdate,
                            todate: todate,
                            speciesname: SpeciesName
                        };
                        $.ajax({
                            url: currentWidget.ServiceUrl + "JsonGetReportDataByAltitude/",
                            type: 'POST',  // http method
                            crossDomain: true,
                            contentType: 'application/json',
                            data: JSON.stringify(requestData),
                            success: function (result) {

                                var jsonObj = JSON.parse(result);
                                if (jsonObj == 0) {
                                    AlertMessages("warning", '', currentWidget._i18n.NoResultsFound);

                                    //$(".Overlay").fadeOut();
                                    return;
                                }
                                if (jsonObj != null) {
                                    var DatainSeries = [];
                                    var MeanArray = [];
                                    var MaxArray = [];
                                    var MinArray = [];
                                    var TempData = [];

                                    for (i = 0; i < jsonObj.length; i++) {
                                        var PID = jsonObj[i].PID;
                                        var MaxAltitude = currentWidget.roundMe(jsonObj[i].maxalt, 4);
                                        var MinAltitude = currentWidget.roundMe(jsonObj[i].minalt, 4);
                                        var AverageAlt = currentWidget.roundMe(jsonObj[i].AvgAlt, 5);
                                        MeanArray.push(AverageAlt);
                                        MaxArray.push(MaxAltitude);
                                        MinArray.push(MinAltitude);
                                        TempData.push({ PID: PID, Count: jsonObj[i].Locations, MinData: MinAltitude, MaxData: MaxAltitude, AvgData: AverageAlt })
                                    }
                                    DatainSeries.push({
                                        name: currentWidget._i18n.Min, data: MinArray
                                    }, {
                                        name: currentWidget._i18n.Max, data: MaxArray
                                    }, {
                                        name: currentWidget._i18n.Avg, data: MeanArray
                                    });
                                    currentWidget.ArgosAltitudeData = TempData;

                                }


                                Highcharts.chart('chart4', {
                                    chart: {
                                        type: 'column'
                                    },

                                    title: {
                                        text: ''
                                        //text: 'Altitude of Selected PTT ID',
                                    },
                                    yAxis: {
                                        min: 0,
                                        title: {
                                            text: currentWidget._i18n.Altitude,
                                            style: "font-size:30px"
                                        }
                                    },

                                    xAxis: {
                                        categories: xaxisdata,
                                        title: {
                                            text: currentWidget._i18n.PlatformIDs,
                                            style: "font-size:30px"
                                        }
                                    },
                                    credits: {
                                        enabled: false
                                    },
                                    legend: {
                                        layout: 'horizontal',
                                        align: 'center',
                                        verticalAlign: 'bottom',
                                    },
                                    exporting: {
                                        accessibility: {
                                            enabled: true
                                        },
                                        filename: "Argos Altitude Report",
                                    },
                                    series: DatainSeries,


                                });
                            },
                            error: function (xhr, error) {
                                AlertMessages("error", '', currentWidget._i18n.UnabletoFetchAltitudeChartDetails);
                                console.debug(xhr); console.debug(error);
                            },
                        });
                    }


                    if (Sensortype != "Argos") {
                        $("#container3").highcharts({
                            chart: {
                                type: 'column'
                            },
                            title: {
                                text: ''
                                //text: "Altitude of Selected PTT ID"
                            },
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom',
                            },
                            credits: {
                                enabled: false
                            },
                            xAxis: {
                                categories: xaxisdata,
                                title: {
                                    text: currentWidget._i18n.PlatformIDs,
                                    style: "font-size:30px"
                                }
                            },
                            yAxis: {
                                title: {
                                    text: currentWidget._i18n.Speed,
                                    style: "font-size:30px"
                                }
                            },
                            exporting: {
                                accessibility: {
                                    enabled: true
                                },
                                //filename: "Altitude Report",
                            },
                            series: SpeedDatainSeries,
                        });
                    }



                    $("#container4").highcharts({
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: ''
                            //text: "Altitude of Selected PTT ID"
                        },
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom',
                        },
                        credits: {
                            enabled: false
                        },
                        xAxis: {
                            categories: xaxisdata,
                            title: {
                                text: currentWidget._i18n.PlatformIDs,
                                style: "font-size:30px"
                            }
                        },
                        yAxis: {
                            title: {
                                text: currentWidget._i18n.Altitude,
                                style: "font-size:30px"
                            }
                        },
                        exporting: {
                            accessibility: {
                                enabled: true
                            },
                            filename: "Altitude Report",
                        },
                        series: DatainSeries,
                    });

                },
                error: function (xhr, error) {
                    AlertMessages("error", '', currentWidget._i18n.UnabletoFetchAltitudeChartDetails);
                    console.debug(xhr); console.debug(error);
                },
            });


        },

        GetReportsData: function () {
            var currentWidget = this;
            $(".Overlay").fadeIn();
            var pids;
            currentWidget.getnoofLocations();
            currentWidget.getnoofBirds();
            currentWidget.getnoofSpecies();
            currentWidget.getavgSpeed();
            currentWidget.getavgAltitude();
            var Sensortype = $(currentWidget.ddlsensor).val();
            var SpeciesName = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val().trim();
            var todate = $(currentWidget.Reporttodate).val().trim();
            var Platformid = $(currentWidget.ddlplatformid).val();

            if (Platformid.length != 1) {
                $(".SpeedCountBox").css("display", "none");
                $(".AltitudeCountBox").css("display", "none");
            }



            if (fromdate == "") {
                fromdate = null;
            }
            if (SpeciesName == "") {
                SpeciesName = null;
            }


            if (todate == "") {
                todate = null;
            }
            if (Platformid == 0) {
                Platformid = null;
            }
            if (fromdate != null && todate != null) {
                var isvalid = CheckDatesCompare(fromdate, todate);
                if (isvalid == false) {
                    $(".lblgreater").css("display", "block");
                    $(".Overlay").fadeOut();
                    return;
                }
            }

            var ua = navigator.userAgent;
            var checker = {
                iphone: ua.match(/BirdTracking_Ios/),
                blackberry: ua.match(/BlackBerry/),
                android: ua.match(/BirdTracking_Android/)
            };


            if (configOptions.UserInfo.UserRole == "Sponsor") {
                var sensortype = [];
                var PID = [];
                var IDwithSensor = configOptions.SponsorandPublicID;
                for (var i = 0; i < IDwithSensor.length; i++) {
                    var splitData = IDwithSensor[i].split("-");

                    sensortype.push(splitData[1]);
                    PID.push(splitData[0]);
                }
                if (Platformid == null) {
                    pids = PID;
                }
                else {
                    pids = Platformid;
                }
                //if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android")) {
                //    var downloadurl = currentWidget.ServiceUrl + "JsonGetSponsorRawDataDownload" + "/" + Sensortype + "/" + SpeciesName + "/" + fromdate + "/" + todate + "/" + pids;
                //    $(currentWidget.getRawDataMobile).attr("href", downloadurl);
                //}


            }
            else {
                pids = Platformid;

                //if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android")) {
                //    var userDetails = currentWidget.adduserdetails();
                //    var downloadurl = currentWidget.ServiceUrl + "JsonGetExportRawDataDownload" + "/" + Sensortype + "/" + SpeciesName + "/" + fromdate + "/" + todate + "/" + pids + userDetails + "/" + "RawDataReport.csv";
                //    $(currentWidget.getRawDataMobile).attr("href", downloadurl);
                //}
            }
            if (pids != null) {
                pids = pids.toString();
            }
            var requestData = {
                id: pids,
                type: Sensortype,
                fromdate: fromdate,
                todate: todate,
                speciesname: SpeciesName
            };
            $.ajax({
                url: currentWidget.ServiceUrl + "JsonGetReportDataByYear/",
                type: 'POST',
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {

                    var jsonObj = JSON.parse(result);
                    if (jsonObj == 0) {
                        AlertMessages("warning", '', currentWidget._i18n.NoResultsFound);

                        $(".Overlay").fadeOut();
                        return;
                    }
                    if (jsonObj != null) {
                        $(".ChartsforSensor").css("display", "block");
                        var PidArray = currentWidget.groupBy1(jsonObj, "PID");
                        var count = 0;
                        var pids = [];
                        var pidbyyears = [];
                        var PIDCount = [];
                        var SpeedCount = [];
                        var AltitudeCount = [];
                        var LocationClassesCount = [];
                        var LocClasses = [];
                        for (key in PidArray) {
                            if (PidArray.hasOwnProperty(key)) {
                                count++;
                                pids.push(key);
                            }
                        }



                        for (i = 0; i < pids.length; i++) {
                            if (Sensortype == 'Argos') {
                                var YearArray = currentWidget.groupBy1(PidArray[pids[i]], "TDate");
                                var LoClsArray = currentWidget.groupBy1(PidArray[pids[i]], "LocationClass");
                                pidbyyears.push({ PID: pids[i], Years: YearArray });
                                PIDCount.push({ PID: pids[i], Periods: PidArray });
                                AltitudeCount.push({ PID: pids[i], AltitudeValue: PidArray });
                                LocationClassesCount.push({ PID: pids[i], LocClasses: LoClsArray });
                            }
                            else {
                                var YearArray = currentWidget.groupBy1(PidArray[pids[i]], "TDate");
                                pidbyyears.push({ PID: pids[i], Years: YearArray });
                                PIDCount.push({ PID: pids[i], Periods: PidArray });
                                SpeedCount.push({ PID: pids[i], SpeedValue: PidArray });
                                AltitudeCount.push({ PID: pids[i], AltitudeValue: PidArray });
                            }

                        }

                        currentWidget.LocationChart(pidbyyears, pids);
                        currentWidget.PIDLocationChart(PIDCount, pids);
                        if (Sensortype == 'Argos') {
                            $(".SpeedHeading").text(currentWidget._i18n.LocationClasses);
                            currentWidget.LocClassChart(LocationClassesCount, pids);
                        }
                        else {
                            $(".SpeedHeading").text(currentWidget._i18n.FlightSpeedofSelectedPTTIDs);
                        }
                        currentWidget.AltitudeDataChart(pids);
                    }

                    if (Sensortype == "GPS") {
                        var pids;
                        if (configOptions.UserInfo.UserRole == "Sponsor") {
                            var sensortype = [];
                            var PID = [];
                            var IDwithSensor = configOptions.SponsorandPublicID;
                            for (var i = 0; i < IDwithSensor.length; i++) {
                                var splitData = IDwithSensor[i].split("-");

                                sensortype.push(splitData[1]);
                                PID.push(splitData[0]);
                            }

                            if (sensortype.includes("Argos") == false) {
                                $(".ArgosBasedCharts").css("display", "none");
                                $(".Overlay").fadeOut();
                                return;
                            }


                            if (Platformid == null) {
                                pids = PID;
                            }
                            else {
                                pids = Platformid;
                            }

                        }
                        else {
                            pids = Platformid;
                        }
                        if (pids != null) {
                            pids = pids.toString();
                        }
                        var requestData = {
                            id: pids,
                            type: "Argos",
                            fromdate: fromdate,
                            todate: todate,
                            speciesname: SpeciesName
                        };
                        $.ajax({
                            url: currentWidget.ServiceUrl + "JsonGetReportDataByYear/",
                            type: 'POST',  // http method
                            crossDomain: true,
                            contentType: 'application/json',
                            data: JSON.stringify(requestData),
                            success: function (result) {

                                var jsonObj = JSON.parse(result);
                                if (jsonObj == 0) {
                                    AlertMessages("warning", '', currentWidget._i18n.NoResultsFound);

                                    $(".Overlay").fadeOut();
                                    return;
                                }
                                if (jsonObj != null) {
                                    $(".ArgosBasedCharts").css("display", "block");
                                    var PidArray = currentWidget.groupBy1(jsonObj, "PID");
                                    var count = 0;
                                    var pids = [];
                                    var pidbyyears = [];
                                    var PIDCount = [];
                                    var SpeedCount = [];
                                    var AltitudeCount = [];
                                    for (key in PidArray) {
                                        if (PidArray.hasOwnProperty(key)) {
                                            count++;
                                            pids.push(key);
                                        }
                                    }

                                    for (i = 0; i < pids.length; i++) {
                                        var YearArray = currentWidget.groupBy1(PidArray[pids[i]], "TDate");
                                        var LoClsArray = currentWidget.groupBy1(PidArray[pids[i]], "LocationClass");
                                        pidbyyears.push({ PID: pids[i], Years: YearArray });
                                        PIDCount.push({ PID: pids[i], Periods: PidArray });
                                        AltitudeCount.push({ PID: pids[i], AltitudeValue: PidArray });
                                        LocationClassesCount.push({ PID: pids[i], LocClasses: LoClsArray });
                                    }
                                    currentWidget.ArgosLocationChart(pidbyyears, pids);
                                    currentWidget.ArgosPIDLocationChart(PIDCount, pids);
                                    currentWidget.AltitudeDataChart(pids);
                                    currentWidget.ArgosLocClassChart(LocationClassesCount, pids);
                                    $(".Overlay").fadeOut();
                                }
                            },
                            error: function (xhr, error) {
                                AlertMessages("error", '', currentWidget._i18n.UnabletoFetchChartDetails);
                                console.debug(xhr); console.debug(error);
                                $(".Overlay").fadeOut();
                            },
                        });
                    }
                    else {
                        $(".Overlay").fadeOut();
                    }



                    if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android") || checker.android || checker.iphone) {
                        if (configOptions.UserInfo.UserRole == "Sponsor") {
                            var sensortype = [];
                            var PID = [];
                            var IDwithSensor = configOptions.SponsorandPublicID;
                            for (var i = 0; i < IDwithSensor.length; i++) {
                                var splitData = IDwithSensor[i].split("-");
                                sensortype.push(splitData[1]);
                                PID.push(splitData[0]);
                            }
                            if (Sensortype == "GPS") {
                                if (sensortype.includes("Argos") == false) {

                                    currentWidget.JSONToExcelYearWiseLocations("Total Locations", currentWidget.TotalLocationCountTable, currentWidget.PlatformIDList);
                                    currentWidget.JSONToExcelLocationCount("Location Count", currentWidget.LocationCount, currentWidget.LocationCountPlatformIDList);
                                    currentWidget.JSONToExcelFlightSpeed("Flight Speed", currentWidget.SpeedData, currentWidget.SpeedPlatformID, currentWidget.TotalSpeedCountValue, Sensortype);
                                    currentWidget.JSONToExcelAltitude("Altitude", currentWidget.TotalAltitudeCountValue, currentWidget.AltitudeData);
                                }
                                else {
                                    currentWidget.JSONToExcelYearWiseLocations("Total Locations", currentWidget.TotalLocationCountTable, currentWidget.PlatformIDList);
                                    currentWidget.JSONToExcelLocationCount("Location Count", currentWidget.LocationCount, currentWidget.LocationCountPlatformIDList);
                                    currentWidget.JSONToExcelFlightSpeed("Flight Speed", currentWidget.SpeedData, currentWidget.SpeedPlatformID, currentWidget.TotalSpeedCountValue, Sensortype);
                                    currentWidget.JSONToExcelAltitude("Altitude", currentWidget.TotalAltitudeCountValue, currentWidget.AltitudeData);
                                    currentWidget.JSONToExcelYearWiseLocations("Argos Total Locations", currentWidget.ArgosTotalLocationCountTable, currentWidget.ArgosPlatformIDList);
                                    currentWidget.JSONToExcelLocationCount("Argos Location Count", currentWidget.ArgosLocationCount, currentWidget.ArgosLocationCountPlatformIDList);
                                    currentWidget.JSONToExcelFlightSpeed("Argos Location Classes", currentWidget.ArgosAvgSpeedCount, currentWidget.ArgosSpeedPlatformID, "", "Argos");
                                    currentWidget.JSONToExcelAltitude("Argos Altitude", currentWidget.ArgosTotalAltitudeCountValue, currentWidget.ArgosAltitudeData);
                                }
                            }
                            else if (Sensortype == "Argos") {
                                currentWidget.JSONToExcelYearWiseLocations("Total Locations", currentWidget.TotalLocationCountTable, currentWidget.PlatformIDList);
                                currentWidget.JSONToExcelLocationCount("Location Count", currentWidget.LocationCount, currentWidget.LocationCountPlatformIDList);
                                currentWidget.JSONToExcelFlightSpeed("Location Classes", currentWidget.AvgSpeedCount, currentWidget.SpeedPlatformID, currentWidget.AvgSpeedCount, Sensortype);
                                currentWidget.JSONToExcelAltitude("Altitude", currentWidget.TotalAltitudeCountValue, currentWidget.AltitudeData);
                            }
                            else {
                                currentWidget.JSONToExcelYearWiseLocations("Total Locations", currentWidget.TotalLocationCountTable, currentWidget.PlatformIDList);
                                currentWidget.JSONToExcelLocationCount("Location Count", currentWidget.LocationCount, currentWidget.LocationCountPlatformIDList);
                                currentWidget.JSONToExcelFlightSpeed("Flight Speed", currentWidget.SpeedData, currentWidget.SpeedPlatformID, currentWidget.AvgSpeedCount, Sensortype);
                                currentWidget.JSONToExcelAltitude("Altitude", currentWidget.TotalAltitudeCountValue, currentWidget.AltitudeData);
                            }
                        }
                        else {

                            if (Sensortype == "GPS") {
                                currentWidget.JSONToExcelYearWiseLocations("Total Locations", currentWidget.TotalLocationCountTable, currentWidget.PlatformIDList);
                                currentWidget.JSONToExcelLocationCount("Location Count", currentWidget.LocationCount, currentWidget.LocationCountPlatformIDList);
                                currentWidget.JSONToExcelFlightSpeed("Flight Speed", currentWidget.SpeedData, currentWidget.SpeedPlatformID, currentWidget.TotalSpeedCountValue, Sensortype);
                                currentWidget.JSONToExcelAltitude("Altitude", currentWidget.TotalAltitudeCountValue, currentWidget.AltitudeData);
                                currentWidget.JSONToArgosExcelYearWiseLocations("Argos Total Locations", currentWidget.ArgosTotalLocationCountTable, currentWidget.ArgosPlatformIDList);
                                currentWidget.JSONToArgosExcelLocationCount("Argos Location Count", currentWidget.ArgosLocationCount, currentWidget.ArgosLocationCountPlatformIDList);
                                currentWidget.JSONToArgosExcelFlightSpeed("Argos Location Classes", currentWidget.ArgosAvgSpeedCount, currentWidget.ArgosSpeedPlatformID, "", "Argos");
                                currentWidget.JSONToArgosExcelAltitude("Argos Altitude", currentWidget.ArgosTotalAltitudeCountValue, currentWidget.ArgosAltitudeData);

                            }
                            else if (Sensortype == "Argos") {
                                currentWidget.JSONToExcelYearWiseLocations("Total Locations", currentWidget.TotalLocationCountTable, currentWidget.PlatformIDList);
                                currentWidget.JSONToExcelLocationCount("Location Count", currentWidget.LocationCount, currentWidget.LocationCountPlatformIDList);
                                currentWidget.JSONToExcelFlightSpeed("Location Classes", currentWidget.AvgSpeedCount, currentWidget.SpeedPlatformID, currentWidget.AvgSpeedCount, Sensortype);
                                currentWidget.JSONToExcelAltitude("Altitude", currentWidget.TotalAltitudeCountValue, currentWidget.AltitudeData);
                            }
                            else {
                                currentWidget.JSONToExcelYearWiseLocations("Total Locations", currentWidget.TotalLocationCountTable, currentWidget.PlatformIDList);
                                currentWidget.JSONToExcelLocationCount("Location Count", currentWidget.LocationCount, currentWidget.LocationCountPlatformIDList);
                                currentWidget.JSONToExcelFlightSpeed("Flight Speed", currentWidget.SpeedData, currentWidget.SpeedPlatformID, currentWidget.AvgSpeedCount, Sensortype);
                                currentWidget.JSONToExcelAltitude("Altitude", currentWidget.TotalAltitudeCountValue, currentWidget.AltitudeData);
                            }
                        }
                    }

                },
                error: function (xhr, error) {

                    AlertMessages("error", '', currentWidget._i18n.UnabletoFetchChartDetails);
                    console.debug(xhr); console.debug(error);
                    $(".Overlay").fadeOut();
                },
            });
        },

        groupBy1: function (xs, prop) {
            var grouped = {};
            for (var i = 0; i < xs.length; i++) {
                var p = xs[i][prop];
                if (!grouped[p]) { grouped[p] = []; }
                grouped[p].push(xs[i]);
            }
            return grouped;
        },
        getStartEndDates: function () {
            var currentWidget = this;
            var sensorType = $(currentWidget.ddlsensor).val();
            var platformid = $(currentWidget.ddlplatformid).val();
            if (platformid.length == 1) {
                if (Platformid != null) {
                    Platformid = Platformid.toString();
                }
                if (Platformid != null) {
                    Platformid = Platformid.toString();
                }
                var requestData = {
                    id: platformid,
                    type: sensorType
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JSONStartDateEndDate/",
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        var jsonObj = JSON.parse(result);
                        if (jsonObj != null) {
                            if (jsonObj[0].StartDate != null || jsonObj[0].EndDate != null) {
                                var start = jsonObj[0].StartDate.split('T');
                                var end = jsonObj[0].EndDate.split('T');
                                var startdate = start[0].split("-").reverse().join("-");
                                var enddate = end[0].split("-").reverse().join("-");
                                $(currentWidget.Reportfromdate).val(startdate);
                                $(currentWidget.Reporttodate).val(enddate);
                            }
                            else {

                            }
                        }
                    },
                    error: function (xhr, error) {
                        AlertMessages("error", '', currentWidget._i18n.Unabletofetchplatformids);
                        console.debug(xhr); console.debug(error);
                    },
                });
            }
        },

        LocationChart: function (data, xaxisdata) {
            var currentWidget = this;
            var count = 0;
            var AssignedData = [];
            var TempData = [];
            var DataArray = [];
            var DatainSeries = [];
            var years = [];
            for (var k = 0; k < data.length; k++) {

                for (key in data[k].Years) {
                    if (data[k].Years.hasOwnProperty(key)) {
                        count++;
                        years.push(key);

                    }
                }
            }
            var uniqueyears = years.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
            })

            for (i = 0; i < uniqueyears.length; i++) {
                var RealData = [];
                for (var j = 0; j < data.length; j++) {

                    if (data[j].Years[uniqueyears[i]] != undefined) {
                        RealData.push(data[j].Years[uniqueyears[i]].length);
                    }
                    else {
                        RealData.push(0);
                    }
                }
                DataArray.push({ name: uniqueyears[i], data: RealData });
            }
            currentWidget.PlatformIDList = xaxisdata;
            currentWidget.TotalLocationCountTable = DataArray;
            Highcharts.setOptions({
                lang: {
                    thousandsSep: ""
                }
            })
            $("#Reportcontainer1").highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                    //text: "Total Number of Locations"
                },
                credits: {
                    enabled: false
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',

                },
                xAxis: {
                    categories: xaxisdata,
                    title: {
                        text: currentWidget._i18n.PlatformIDs,
                        style: "font-size:30px"
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: currentWidget._i18n.TotalLocations,
                        style: "font-size:30px"
                    }
                },
                exporting: {
                    accessibility: {
                        enabled: true
                    },
                    filename: "Total Location Count Report",
                },
                series: DataArray,

            });
        },

        PIDLocationChart: function (data, xaxisdata) {
            var currentWidget = this;
            var DatainSeries = [];
            for (var k = 0; k < data.length; k++) {
                var Platformids = [];
                var DataArray = [];
                for (key in data[k].Periods) {
                    if (data[k].Periods.hasOwnProperty(key)) {
                        Platformids.push(key);
                    }
                }
                for (i = 0; i < Platformids.length; i++) {
                    DataArray.push({ PID: Platformids[i], data: data[k].Periods[Platformids[i]].length });
                }
            }

            var ResultIDs = [];
            var ResultData = currentWidget.groupBy1(DataArray, "PID");
            for (key in ResultData) {
                if (ResultData.hasOwnProperty(key)) {
                    ResultIDs.push(key);
                }
            }
            var RealData = [];
            for (var m = 0; m < ResultIDs.length; m++) {

                for (i = 0; i < ResultData[ResultIDs[m]].length; i++) {
                    RealData.push([ResultData[ResultIDs[m]][i].PID, ResultData[ResultIDs[m]][i].data]);
                }
            }

            currentWidget.LocationCountPlatformIDList = xaxisdata;
            currentWidget.LocationCount = RealData;
            $("#Reportcontainer2").highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                    //text: "Total Number of Locations for Selected PTTD"
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    categories: xaxisdata,
                    title: {
                        text: currentWidget._i18n.PlatformIDs,
                        style: "font-size:30px"
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: currentWidget._i18n.TotalLocations,
                        style: "font-size:30px"
                    }
                },
                exporting: {
                    accessibility: {
                        enabled: true
                    },
                    filename: "Total Locations Report",
                },
                series: [{
                    name: currentWidget._i18n.Locations,
                    data: RealData,
                }],


            });
        },

        SpeedChart: function (data, xaxisdata) {
            var currentWidget = this;
            var DatainSeries = [];
            for (var k = 0; k < data.length; k++) {
                var Platformids = [];
                var DataArray = [];
                currentWidget.TotalSpeedCountValue = [];
                for (key in data[k].SpeedValue) {
                    if (data[k].SpeedValue.hasOwnProperty(key)) {
                        Platformids.push(key);
                    }
                }

                for (i = 0; i < Platformids.length; i++) {
                    var AssignedData = [];
                    for (j = 0; j < data[k].SpeedValue[Platformids[i]].length; j++) {
                        AssignedData.push(parseInt(data[k].SpeedValue[Platformids[i]][j].Speed));
                    }
                    DataArray.push({ name: Platformids[i], data: AssignedData });
                    currentWidget.TotalSpeedCountValue.push(data[k].SpeedValue[Platformids[i]].length);
                }


            }
            currentWidget.SpeedPlatformID = xaxisdata;
            currentWidget.AvgSpeedCount = DataArray;


            $("#container3").highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    title: {
                        text: currentWidget._i18n.Locations,
                        style: "font-size:30px"
                    },
                    accessibility: {
                        rangeDescription: 'Range: 0 to 1000000'
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        //text: currentWidget._i18n.TotalLocations
                        text: currentWidget._i18n.Speed,
                        style: "font-size:30px"
                    }
                },
                exporting: {
                    accessibility: {
                        enabled: true
                    },
                    filename: "Speed Report",
                },
                series: DataArray,
            });
        },
        LocationClassesChart: function (data, xaxisdata) {
            var currentWidget = this;
            var DatainSeries = [];
            var DataArray = [];
            var xaxisLocClasses = [];
            for (var k = 0; k < data.length; k++) {
                var LocClsyears = [];

                for (key in data[k].Years) {
                    if (data[k].Years.hasOwnProperty(key)) {
                        LocClsyears.push(key);
                    }
                }

                for (i = 0; i < LocClsyears.length; i++) {
                    DataArray.push({ LocClassesYear: LocClsyears[i], data: data[k].Years[LocClsyears[i]].length });

                }


            }
            var ResultYears = [];
            var ResultData = currentWidget.groupBy1(DataArray, "LocClassesYear");
            for (key in ResultData) {
                if (ResultData.hasOwnProperty(key)) {
                    ResultYears.push(key);
                }
            }
            for (var m = 0; m < ResultYears.length; m++) {
                var RealData = [];
                for (i = 0; i < ResultData[ResultYears[m]].length; i++) {
                    RealData.push(ResultData[ResultYears[m]][i].data);
                }
                DatainSeries.push({ name: ResultYears[m], data: RealData });

            }
            currentWidget.SpeedPlatformID = xaxisdata;
            currentWidget.AvgSpeedCount = DataArray;
            $("#container3").highcharts({
                chart: {
                    type: 'column'
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories: xaxisdata,
                    title: {
                        text: currentWidget._i18n.Locations,
                        style: "font-size:30px"
                    },
                },
                yAxis: {
                    min: 0,
                    title: {
                        //text: currentWidget._i18n.TotalLocations
                        text: currentWidget._i18n.Speed,
                        style: "font-size:30px"
                    }
                },
                exporting: {
                    accessibility: {
                        enabled: true
                    },
                    filename: "Speed Report",
                },
                series: DatainSeries,
            });

        },
        LocClassChart: function (data, xaxisdata) {
            var currentWidget = this;
            var DatainSeries = [];
            var DataArray = [];
            for (var k = 0; k < data.length; k++) {
                var LocCls = [];
                for (key in data[k].LocClasses) {
                    if (data[k].LocClasses.hasOwnProperty(key)) {
                        LocCls.push(key);
                    }
                }
                for (i = 0; i < LocCls.length; i++) {
                    DataArray.push({ LocationsCls: LocCls[i], data: data[k].LocClasses[LocCls[i]].length });

                }
            }

            var ResultYears = [];
            var ResultData = currentWidget.groupBy1(DataArray, "LocationsCls");
            for (key in ResultData) {
                if (ResultData.hasOwnProperty(key)) {
                    ResultYears.push(key);
                }
            }
            for (var m = 0; m < ResultYears.length; m++) {
                var RealData = [];
                for (i = 0; i < ResultData[ResultYears[m]].length; i++) {
                    RealData.push(ResultData[ResultYears[m]][i].data);
                }
                DatainSeries.push({ name: ResultYears[m], data: RealData });

            }

            currentWidget.SpeedPlatformID = xaxisdata;
            currentWidget.AvgSpeedCount = DatainSeries;


            $("#container3").highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                    //text: "LocationClass for Selected PTT ID"
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories: xaxisdata,
                    title: {
                        text: currentWidget._i18n.LocationClasses,
                        style: "font-size:30px"
                    },

                },
                yAxis: {
                    min: 0,
                    title: {
                        //text: currentWidget._i18n.TotalLocations
                        text: currentWidget._i18n.Locations,
                        style: "font-size:30px"
                    }
                },
                exporting: {
                    accessibility: {
                        enabled: true
                    },
                    filename: "Speed Report",
                },
                series: DatainSeries,
            });
        },


        AltitudeChart: function (data, xaxisdata) {
            var currentWidget = this;
            var DatainSeries = [];
            var ResultantData = [];
            var MeanArray = [];
            var MaxArray = [];
            var MinArray = [];
            var DataArray = [];
            for (var k = 0; k < data.length; k++) {
                var Platformids = [];
                for (key in data[k].AltitudeValue) {
                    if (data[k].AltitudeValue.hasOwnProperty(key)) {
                        Platformids.push(key);
                    }
                }
            }
            for (i = 0; i < Platformids.length; i++) {
                var AltitudeValues = [];
                for (j = 0; j < data[i].AltitudeValue[Platformids[i]].length; j++) {
                    AltitudeValues.push(parseInt(data[i].AltitudeValue[Platformids[i]][j].Altitude));
                }
                currentWidget.TotalAltitudeCountValue.push(data[i].AltitudeValue[Platformids[i]].length);

                var filtered = AltitudeValues.filter(function (value, index, arr) { return value > 0; });
                var MaxAltitude = Math.max.apply(null, filtered);
                var MinAltitude = Math.max.apply(null, filtered);
                var MeanAltitude = currentWidget.mean(AltitudeValues);
                var MeanValues = currentWidget.roundMe(MeanAltitude, 5);
                MeanArray.push(MeanValues);
                MaxArray.push(MaxAltitude);
                MinArray.push(MinAltitude);
                DataArray.push({ name: Platformids[i], data: AltitudeValues });
            }
            DatainSeries.push({
                name: currentWidget._i18n.Min, data: MinArray
            }, {
                name: currentWidget._i18n.Max, data: MaxArray
            }, {
                name: currentWidget._i18n.Avg, data: MeanArray
            });

            currentWidget.AltitudePlatformID = xaxisdata;
            currentWidget.AvgAltitudeCount = DataArray;



            $("#container4").highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                    //text: "Altitude of Selected PTT ID"
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories: xaxisdata,
                    title: {
                        text: currentWidget._i18n.PlatformIDs,
                        style: "font-size:30px"
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: currentWidget._i18n.Altitude,
                        style: "font-size:30px"
                    }
                },
                exporting: {
                    accessibility: {
                        enabled: true
                    },
                    filename: "Altitude Report",
                },
                series: DatainSeries,
            });
        },



        ArgosLocationChart: function (data, xaxisdata) {
            var currentWidget = this;
            $(".ArgosReportDetails").css("display", "block");
            var count = 0;
            var AssignedData = [];
            var TempData = [];
            var DataArray = [];
            var DatainSeries = [];
            var years = [];
            for (var k = 0; k < data.length; k++) {


                for (key in data[k].Years) {
                    if (data[k].Years.hasOwnProperty(key)) {
                        count++;
                        years.push(key);

                    }
                }
            }
            var uniqueyears = years.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
            });

            for (i = 0; i < uniqueyears.length; i++) {
                var RealData = [];
                for (var j = 0; j < data.length; j++) {

                    if (data[j].Years[uniqueyears[i]] != undefined) {
                        RealData.push(data[j].Years[uniqueyears[i]].length);
                    }
                    else {
                        RealData.push(0);
                    }
                }
                DataArray.push({ name: uniqueyears[i], data: RealData });
            }
            currentWidget.ArgosPlatformIDList = xaxisdata;

            currentWidget.ArgosTotalLocationCountTable = DataArray;



            Highcharts.setOptions({
                lang: {
                    thousandsSep: ""
                }
            })
            $("#chart1").highcharts({
                chart: {
                    //backgroundColor: 'rgba(222,222,222,0)',
                    type: 'column'
                },
                title: {
                    text: ''
                    //text: "Total Number of Locations"
                },
                credits: {
                    enabled: false
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                },
                xAxis: {
                    categories: xaxisdata,
                    title: {
                        text: currentWidget._i18n.PlatformIDs,
                        style: "font-size:30px"
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: currentWidget._i18n.TotalLocations,
                        style: "font-size:30px"
                    }
                },
                exporting: {
                    accessibility: {
                        enabled: true
                    },
                    filename: "Argos Total Location Count Report",
                },
                series: DataArray,

            });
        },

        ArgosPIDLocationChart: function (data, xaxisdata) {
            var currentWidget = this;
            $(".ArgosReportDetails").css("display", "block");
            var DatainSeries = [];
            for (var k = 0; k < data.length; k++) {
                var Platformids = [];
                var DataArray = [];
                for (key in data[k].Periods) {
                    if (data[k].Periods.hasOwnProperty(key)) {
                        Platformids.push(key);
                    }
                }
                for (i = 0; i < Platformids.length; i++) {
                    DataArray.push({ PID: Platformids[i], data: data[k].Periods[Platformids[i]].length });
                }
            }

            var ResultIDs = [];
            var ResultData = currentWidget.groupBy1(DataArray, "PID");
            for (key in ResultData) {
                if (ResultData.hasOwnProperty(key)) {
                    ResultIDs.push(key);
                }
            }
            var RealData = [];
            for (var m = 0; m < ResultIDs.length; m++) {

                for (i = 0; i < ResultData[ResultIDs[m]].length; i++) {
                    RealData.push([ResultData[ResultIDs[m]][i].PID, ResultData[ResultIDs[m]][i].data]);
                }
            }

            currentWidget.ArgosLocationCountPlatformIDList = xaxisdata;
            currentWidget.ArgosLocationCount = RealData;
            $("#chart2").highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                    //text: "Total Number of Locations for Selected PTTD"
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    categories: xaxisdata,
                    title: {
                        text: currentWidget._i18n.PlatformIDs,
                        style: "font-size:30px"
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: currentWidget._i18n.TotalLocations,
                        style: "font-size:30px"
                    }
                },
                exporting: {
                    accessibility: {
                        enabled: true
                    },
                    filename: "Argos Total Locations Report",
                },
                series: [{
                    name: currentWidget._i18n.Locations,
                    data: RealData,
                }],


            });
        },

        ArgosSpeedChart: function (data, xaxisdata) {
            var currentWidget = this;
            $(".ArgosReportDetails").css("display", "block");
            var DatainSeries = [];
            for (var k = 0; k < data.length; k++) {
                var Platformids = [];
                var DataArray = [];
                currentWidget.TotalSpeedCountValue = [];
                for (key in data[k].SpeedValue) {
                    if (data[k].SpeedValue.hasOwnProperty(key)) {
                        Platformids.push(key);
                    }
                }

                for (i = 0; i < Platformids.length; i++) {
                    var AssignedData = [];
                    for (j = 0; j < data[k].SpeedValue[Platformids[i]].length; j++) {
                        AssignedData.push(parseInt(data[k].SpeedValue[Platformids[i]][j].Speed));
                    }
                    DataArray.push({ name: Platformids[i], data: AssignedData });
                    currentWidget.ArgosTotalSpeedCountValue.push(data[k].SpeedValue[Platformids[i]].length);
                }


            }
            currentWidget.ArgosSpeedPlatformID = xaxisdata;
            currentWidget.ArgosAvgSpeedCount = DataArray;

            Highcharts.chart('chart3', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                    //text: 'Flight Speed of Selected PTT ID',
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: currentWidget._i18n.Speed,
                        style: "font-size:30px"
                    }
                },
                xAxis: {
                    title: {
                        text: currentWidget._i18n.Locations,
                        style: "font-size:30px"
                    },
                    accessibility: {
                        rangeDescription: 'Range: 0 to 1000000'
                    }
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: false
                        },
                        pointStart: 10
                    }
                },
                exporting: {
                    accessibility: {
                        enabled: true
                    },
                    filename: "Argos Speed Report",
                },
                series: DataArray,

                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }
            });
        },

        ArgosLocClassChart: function (data, xaxisdata) {
            var currentWidget = this;
            var DatainSeries = [];
            var DataArray = [];
            for (var k = 0; k < data.length; k++) {
                var LocCls = [];

                //currentWidget.TotalSpeedCountValue = [];
                for (key in data[k].LocClasses) {
                    if (data[k].LocClasses.hasOwnProperty(key)) {
                        LocCls.push(key);
                    }
                }

                for (i = 0; i < LocCls.length; i++) {
                    DataArray.push({ LocationsCls: LocCls[i], data: data[k].LocClasses[LocCls[i]].length });
                }


            }
            var ResultYears = [];
            var ResultData = currentWidget.groupBy1(DataArray, "LocationsCls");
            for (key in ResultData) {
                if (ResultData.hasOwnProperty(key)) {
                    ResultYears.push(key);
                }
            }
            for (var m = 0; m < ResultYears.length; m++) {
                var RealData = [];
                for (i = 0; i < ResultData[ResultYears[m]].length; i++) {
                    RealData.push(ResultData[ResultYears[m]][i].data);
                }
                DatainSeries.push({ name: ResultYears[m], data: RealData });

            }
            currentWidget.ArgosSpeedPlatformID = xaxisdata;
            currentWidget.ArgosAvgSpeedCount = DatainSeries;


            $("#chart3").highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                    //text: "LocationClass for Selected PTT ID"
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories: xaxisdata,
                    title: {
                        text: currentWidget._i18n.LocationClasses,
                        style: "font-size:30px"
                    },

                },
                yAxis: {
                    min: 0,
                    title: {
                        text: currentWidget._i18n.Locations,
                        style: "font-size:30px"
                    }
                },
                exporting: {
                    accessibility: {
                        enabled: true
                    },
                    filename: "Argos Speed Report",
                },
                series: DatainSeries,
            });
        },

        ArgosAltitudeChart: function (data, xaxisdata) {
            var currentWidget = this;
            $(".ArgosReportDetails").css("display", "block");

            var DatainSeries = [];
            var ResultantData = [];
            var MeanArray = [];
            var MaxArray = [];
            var MinArray = [];
            var DataArray = [];
            for (var k = 0; k < data.length; k++) {
                var Platformids = [];
                for (key in data[k].AltitudeValue) {
                    if (data[k].AltitudeValue.hasOwnProperty(key)) {
                        Platformids.push(key);
                    }
                }
            }
            for (i = 0; i < Platformids.length; i++) {
                var AltitudeValues = [];
                for (j = 0; j < data[i].AltitudeValue[Platformids[i]].length; j++) {
                    AltitudeValues.push(parseInt(data[i].AltitudeValue[Platformids[i]][j].Altitude));
                }
                currentWidget.ArgosTotalAltitudeCountValue.push(data[i].AltitudeValue[Platformids[i]].length);
                var MaxAltitude = Math.max(...AltitudeValues);
                var MinAltitude = Math.min(...AltitudeValues);
                var MeanAltitude = currentWidget.mean(AltitudeValues);
                var MeanValues = currentWidget.roundMe(MeanAltitude, 5);
                MeanArray.push(MeanValues);
                MaxArray.push(MaxAltitude);
                MinArray.push(MinAltitude);
                DataArray.push({ name: Platformids[i], data: AltitudeValues });
            }
            DatainSeries.push({
                name: currentWidget._i18n.Min, data: MinArray
            }, { name: currentWidget._i18n.Max, data: MaxArray }, { name: currentWidget._i18n.Avg, data: MeanArray });
            currentWidget.ArgosAltitudePlatformID = xaxisdata;
            currentWidget.ArgosAvgAltitudeCount = DataArray;


            Highcharts.chart('chart4', {
                chart: {
                    type: 'column'
                },

                title: {
                    text: ''
                    //text: 'Altitude of Selected PTT ID',
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: currentWidget._i18n.Altitude,
                        style: "font-size:30px"
                    }
                },

                xAxis: {
                    categories: xaxisdata,
                    title: {
                        text: currentWidget._i18n.PlatformIDs,
                        style: "font-size:30px"
                    }
                },
                credits: {
                    enabled: false
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                },
                exporting: {
                    accessibility: {
                        enabled: true
                    },
                    filename: "Argos Altitude Report",
                },
                series: DatainSeries,
            });
        },

        ViewReportstable: function () {
            var currentWidget = this;
            var Sensortype = $(currentWidget.ddlsensor).val();
            $(".BacktoRep").css("display", "block");

            $(".TableSec").css("display", "block");
            $(".ReportSec").css("display", "none");
            $(".ReportsDashLink").css("display", "none");
            var container = $(currentWidget.totalLocataioncount).empty();
            container.empty();
            var data = currentWidget.TotalLocationCountTable;
            var pids = currentWidget.PlatformIDList;
            var content = "<div class='Locations'><table class='BtisTableFull' width='100%'>";

            content = content + "<tr><th>" + currentWidget._i18n.Year + "</th>";
            for (var k = 0; k < pids.length; k++) {
                content = content + "<th>" + pids[k] + "</th>";
            }
            content = content + "</tr>";


            for (var i = 0; i < data.length; i++) {
                content = content + "<tr><td>" + data[i].name + "</td>";
                for (var j = 0; j < data[i].data.length; j++) {
                    content = content + "<td>" + data[i].data[j] + "</td>";
                }
                content = content + "</tr>";
            }
            content = content + "</table></div>";
            var sanitizedHtml = DOMPurify.sanitize(content);
            container.append(sanitizedHtml);
            currentWidget.reportResults.push(data);



            var Countcontainer = $(currentWidget.Locationcount).empty();
            Countcontainer.empty();
            var CountValue = currentWidget.LocationCount;
            var PID = currentWidget.LocationCountPlatformIDList;
            var content1 = "<div class='LocationsCount'><table class='BtisTableFull' width='100%'>";

            content1 = content1 + "<tr>";
            for (var k = 0; k < PID.length; k++) {
                content1 = content1 + "<th>" + PID[k] + "</th>";
            }
            content1 = content1 + "</tr>";

            content1 = content1 + "<tr>";
            for (var i = 0; i < CountValue.length; i++) {
                for (var j = 1; j < CountValue[i].length; j++) {
                    content1 = content1 + "<td>" + CountValue[i][j] + "</td>";
                }

            }
            content1 = content1 + "</tr>";
            content1 = content1 + "</table></div>";
            var sanitizedHtml1 = DOMPurify.sanitize(content1);
            Countcontainer.append(sanitizedHtml1);
            // currentWidget.reportResults1.push(CountValue);


            if (Sensortype == "Argos") {
                $(".SpeedTableHeading").text(currentWidget._i18n.AverageSpeedChart);
                var Speedcontainer = $(currentWidget.SpeedofPID).empty();
                Speedcontainer.empty();
                var data = currentWidget.AvgSpeedCount;
                var pids = currentWidget.SpeedPlatformID;
                var content2 = "<div class='Locations'><table class='BtisTableFull' width='100%'>";

                content2 = content2 + "<tr><th>" + currentWidget._i18n.LocationClasses + "</th>";
                for (var k = 0; k < pids.length; k++) {
                    content2 = content2 + "<th>" + pids[k] + "</th>";
                }
                content2 = content2 + "</tr>";


                for (var i = 0; i < data.length; i++) {
                    content2 = content2 + "<tr><td>" + data[i].name + "</td>";
                    for (var j = 0; j < data[i].data.length; j++) {
                        content2 = content2 + "<td>" + data[i].data[j] + "</td>";
                    }
                    content2 = content2 + "</tr>";
                }
                content2 = content2 + "</table></div>";
                var sanitizedHtml2 = DOMPurify.sanitize(content2);
                Speedcontainer.append(sanitizedHtml2);
            }
            else {
                $(".SpeedTableHeading").text(currentWidget._i18n.FlightSpeedofSelectedPTTIDs)
                var Speedcontainer = $(currentWidget.SpeedofPID).empty();
                Speedcontainer.empty();
                var TotalSpeeedCount = currentWidget.TotalSpeedCountValue
                /*var SpeedValues = currentWidget.AvgSpeedCount;*/
                var SpeedValues = currentWidget.SpeedData;
                var PTTDID = currentWidget.SpeedPlatformID;
                var ResultArray = [];

                var content2 = "<div class='LocationsCount'><table class='BtisTableFull' width='100%'>";
                content2 = content2 + "<tr><th>" + currentWidget._i18n.IDs + "</th><th>" + currentWidget._i18n.Locations + "</th><th>" + currentWidget._i18n.MaxSpeed + "</th><th>" + currentWidget._i18n.MeanofSpeed + "</th></tr>";
                for (var i = 0; i < SpeedValues.length; i++) {
                    content2 = content2 + "<tr><td>" + SpeedValues[i].PID + "</td><td>" + SpeedValues[i].Count + "</td><td>" + SpeedValues[i].MaxData + "</td><td>" + SpeedValues[i].AvgData + "</td></tr>";

                }
                content2 = content2 + "</table></div>";
                var sanitizedHtml2 = DOMPurify.sanitize(content2);
                Speedcontainer.append(sanitizedHtml2);
            }







            var Altitudecontainer = $(currentWidget.AltitudeofPID).empty();
            Altitudecontainer.empty();
            var TotalAltitudeCount = currentWidget.TotalAltitudeCountValue;
            /*var AltitudeValues = currentWidget.AvgAltitudeCount;*/
            var AltitudeValues = currentWidget.AltitudeData;
            var PTTD = currentWidget.AltitudePlatformID;
            var ResultArray = [];
            var content3 = "<div class='AltitudeCont'><table class='BtisTableFull' width='100%'>";
            content3 = content3 + "<tr><th>" + currentWidget._i18n.IDs + "</th><th>" + currentWidget._i18n.Locations + "</th><th>" + currentWidget._i18n.MaxAltitude + "</th><th> " + currentWidget._i18n.MeanofAltitude + "</th></tr>";

            for (var i = 0; i < AltitudeValues.length; i++) {

                content3 = content3 + "<tr><td>" + AltitudeValues[i].PID + "</td><td>" + AltitudeValues[i].Count + "</td><td>" + AltitudeValues[i].MaxData + "</td><td>" + AltitudeValues[i].AvgData + "</td></tr>";

            }
            content3 = content3 + "</table></div>";
            var sanitizedHtml3 = DOMPurify.sanitize(content3);
            Altitudecontainer.append(sanitizedHtml3);


            var Sensortype = $(currentWidget.ddlsensor).val();

            if (configOptions.UserInfo.UserRole == "Sponsor") {
                var sensortype = [];
                var PID = [];
                var IDwithSensor = configOptions.SponsorandPublicID;
                for (var i = 0; i < IDwithSensor.length; i++) {
                    var splitData = IDwithSensor[i].split("-");

                    sensortype.push(splitData[1]);
                    PID.push(splitData[0]);
                }

                if (sensortype.includes("Argos") == false) {
                    $(".ArgosBasedTables").css("display", "none");
                    //$(".Overlay").fadeOut();
                    return;
                }
            }
            else {
                if (Sensortype == "GPS") {
                    currentWidget.ArgosViewReportstable();
                }
                else {
                    $(".ArgosBasedTables").css("display", "none");
                }
            }

        },


        ArgosViewReportstable: function () {
            var currentWidget = this;
            var Sensortype = $(currentWidget.ddlsensor).val();
            $(".ArgosReportDetails").css("display", "block");
            $(".ArgosBasedTables").css("display", "block");
            var container = $(currentWidget.ArgostotalLocataioncount).empty();
            container.empty();
            var data = currentWidget.ArgosTotalLocationCountTable;
            var pids = currentWidget.ArgosPlatformIDList;
            var content = "<div class='Locations'><table class='BtisTableFull' width='100%'>";

            content = content + "<tr><th>" + currentWidget._i18n.Year + "</th>";
            for (var k = 0; k < pids.length; k++) {
                content = content + "<th>" + pids[k] + "</th>";
            }
            content = content + "</tr>";


            for (var i = 0; i < data.length; i++) {
                content = content + "<tr><td>" + data[i].name + "</td>";
                for (var j = 0; j < data[i].data.length; j++) {
                    content = content + "<td>" + data[i].data[j] + "</td>";
                }
                content = content + "</tr>";
            }
            content = content + "</table></div>";
            var sanitizedHtml = DOMPurify.sanitize(content);
            container.append(sanitizedHtml);




            var Countcontainer = $(currentWidget.ArgosLocationcount).empty();
            Countcontainer.empty();
            var CountValue = currentWidget.ArgosLocationCount;
            var PID = currentWidget.ArgosLocationCountPlatformIDList;
            var content1 = "<div class='LocationsCount'><table class='BtisTableFull' width='100%'>";

            content1 = content1 + "<tr>";
            for (var k = 0; k < PID.length; k++) {
                content1 = content1 + "<th>" + PID[k] + "</th>";
            }
            content1 = content1 + "</tr>";

            content1 = content1 + "<tr>";
            for (var i = 0; i < CountValue.length; i++) {
                for (var j = 1; j < CountValue[i].length; j++) {
                    content1 = content1 + "<td>" + CountValue[i][j] + "</td>";
                }

            }
            content1 = content1 + "</tr>";
            content1 = content1 + "</table></div>";
            var sanitizedHtml1 = DOMPurify.sanitize(content1);
            Countcontainer.append(sanitizedHtml1);





            var Speedcontainer = $(currentWidget.ArgosSpeedofPID).empty();
            Speedcontainer.empty();
            var data = currentWidget.ArgosAvgSpeedCount;
            var pids = currentWidget.ArgosSpeedPlatformID;
            var content2 = "<div class='Locations'><table class='BtisTableFull' width='100%'>";

            content2 = content2 + "<tr><th>" + currentWidget._i18n.LocationClasses + "</th>";
            for (var k = 0; k < pids.length; k++) {
                content2 = content2 + "<th>" + pids[k] + "</th>";
            }
            content2 = content2 + "</tr>";


            for (var i = 0; i < data.length; i++) {
                content2 = content2 + "<tr><td>" + data[i].name + "</td>";
                for (var j = 0; j < data[i].data.length; j++) {
                    content2 = content2 + "<td>" + data[i].data[j] + "</td>";
                }
                content2 = content2 + "</tr>";
            }
            content2 = content2 + "</table></div>";
            var sanitizedHtml2 = DOMPurify.sanitize(content2);
            Speedcontainer.append(sanitizedHtml2);
            var Altitudecontainer = $(currentWidget.ArgosAltitudeofPID).empty();
            Altitudecontainer.empty();
            var TotalAltitudeCount = currentWidget.ArgosTotalAltitudeCountValue
            var AltitudeValues = currentWidget.ArgosAltitudeData;
            var PTTD = currentWidget.ArgosAltitudePlatformID;
            var ResultArray = [];
            var content3 = "<div class='AltitudeCont'><table class='BtisTableFull' width='100%'>";
            content3 = content3 + "<tr><th>" + currentWidget._i18n.IDs + "</th><th>" + currentWidget._i18n.Locations + "</th><th>" + currentWidget._i18n.MaxAltitude + "</th><th> " + currentWidget._i18n.MeanofAltitude + "</th></tr>";

            for (var i = 0; i < AltitudeValues.length; i++) {
                content3 = content3 + "<tr><td>" + AltitudeValues[i].PID + "</td><td>" + AltitudeValues[i].Count + "</td><td>" + AltitudeValues[i].MaxData + "</td><td>" + AltitudeValues[i].AvgData + "</td></tr>";

            }
            content3 = content3 + "</table></div>";
            var sanitizedHtml3 = DOMPurify.sanitize(content3);
            Altitudecontainer.append(sanitizedHtml3);
        },
        mean: function (array) {
            var currentWidget = this;
            var arraySum = currentWidget.sum(array);
            var value = arraySum / array.length
            return value;
        },
        sum: function (array) {
            var currentWidget = this;
            var total = 0;
            for (var i = 0; i < array.length; i++) {
                total += array[i];
            }
            return total;
        },


        Changecolor: function () {
            var currentWidget = this;
            $('#container1').css({
                'background': '-webkit-linear-gradient(' + $(currentWidget.reportbgcolor).val() + ',' + $(currentWidget.reportbgcolor).val() + ')',
                'background': '-o-linear-gradient(' + $(currentWidget.reportbgcolor).val() + ',' + $(currentWidget.reportbgcolor).val() + ')',
                'background': '-moz-linear-gradient(' + $(currentWidget.reportbgcolor).val() + ',' + $(currentWidget.reportbgcolor).val() + ')',
                'background': 'linear-gradient(' + $(currentWidget.reportbgcolor).val() + ',' + $(currentWidget.reportbgcolor).val() + ')'
            });
        },

        GetReports: function () {
            var currentWidget = this;
            $(".ColorPicGroup").css("display", "block");

            currentWidget.JSONToCSVConvertor(currentWidget.reportResults, "Argos_GPS_GSM Count Comparision", true);

        },
        closeReport: function () {

            $(this).closest(".ManageContainer").show().animate({
                bottom: '-100%'
            }, 20);
            event.stopPropagation();

        },
        ClearLabelfromdate: function () {
            var currentWidget = this;
            $(currentWidget.lblfromdate).css("display", "none");
            currentWidget.GetRawDataDownloadExcel();
        },
        ClearLabeltodate: function () {
            var currentWidget = this;
            $(currentWidget.lbltodate).css("display", "none");
            $(currentWidget.lblgreater).css("display", "none");
            currentWidget.GetRawDataDownloadExcel();
        },
        ClearSensorType: function () {
            var currentWidget = this;
            $(currentWidget.lblSensortype).css("display", "none");
        },

        JSONToCSVConvertor1: function (JSONData, ReportTitle, ShowLabel) {
            var currentWidget = this;
            //   var SensorType = $(currentWidget.ddlsensor).val();
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
            var CSV = '';
            if (ShowLabel) {
                var row = "";
                //This loop will extract the label from 1st index of on array
                for (var index in arrData[0]) {
                    row += index + ',';
                }
                row = row.slice(0, -1);
                //append Label row with line break
                CSV += row + '\r\n';
            }

            //1st loop is to extract each row
            for (var i = 0; i < arrData.length; i++) {
                var row = "";

                //2nd loop will extract each column and convert it in string comma-seprated
                for (var index in arrData[i]) {
                    row += '"' + arrData[i][index] + '",';
                }
                row.slice(0, row.length - 1);

                //add a line break after each row
                CSV += row + '\r\n';
            }

            //Generate a file name
            var fileName = "GPS_GSM_Argos_Report";
            //this will remove the blank-spaces from the title and replace it with an underscore
            fileName += ReportTitle.replace(/ /g, "_");

            //Initialize file format you want csv or xls
            var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

            //this trick will generate a temp <a /> tag
            var link = document.createElement("a");
            link.href = uri;

            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";

            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        JSONToCSVConvertorYearWiseLocations: function (fileName, data, pids) {
            var currentWidget = this;
            var sensortype = $(currentWidget.ddlsensor).val();
            var speciesname = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val();
            var todate = $(currentWidget.Reporttodate).val();
            var CSV = '';
            var row = "";
            if (speciesname == "" && fromdate == "" && todate == "") {
                row = sensortype;
            }
            else if (speciesname != "") {
                row = sensortype + " - " + speciesname;
            }
            else if (fromdate != "" && todate != "") {
                row = sensortype + " : " + fromdate + " - " + todate;
            }
            else {
                row = sensortype + " - " + speciesname + " : " + fromdate + " - " + todate;
            }

            CSV += row + '\r\n';
            row = "";
            row = "Year,";
            //This loop will extract the label from 1st index of on array
            for (var i = 0; i < pids.length; i++) {
                row += pids[i] + ',';
            }
            //append Label row with line break
            CSV += row + '\r\n';
            for (var i = 0; i < data.length; i++) {
                var row = "";
                row += '"' + data[i].name + '",';
                for (var j = 0; j < data[i].data.length; j++) {
                    row += '"' + data[i].data[j] + '",';
                }
                CSV += row + '\r\n';
            }
            //Generate a file name
            //var fileName = "Total_Locations_Report";
            //this will remove the blank-spaces from the title and replace it with an underscore
            // fileName += ReportTitle.replace(/ /g, "_");
            //Initialize file format you want csv or xls
            var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
            //this trick will generate a temp <a /> tag
            var link = document.createElement("a");
            link.href = uri;
            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";
            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        JSONToCSVConvertorLocationCount: function (fileName, CountValue, PID) {
            var currentWidget = this;
            //var CountValue = currentWidget.LocationCount;
            //var PID = currentWidget.LocationCountPlatformIDList;
            var sensortype = $(currentWidget.ddlsensor).val();
            var speciesname = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val();
            var todate = $(currentWidget.Reporttodate).val();
            var CSV = '';
            var row = "";
            if (speciesname == "" && fromdate == "" && todate == "") {
                row = sensortype;
            }
            else if (speciesname != "") {
                row = sensortype + " - " + speciesname;
            }
            else if (fromdate != "" && todate != "") {
                row = sensortype + " : " + fromdate + " - " + todate;
            }
            else {
                row = sensortype + " - " + speciesname + " : " + fromdate + " - " + todate;
            }

            CSV += row + '\r\n';
            row = "";

            for (var k = 0; k < PID.length; k++) {
                row += PID[k] + ',';
            }
            CSV += row + '\r\n';
            var row = "";
            for (var i = 0; i < CountValue.length; i++) {
                //row += '"' + CountValue[i].name + '",';
                for (var j = 1; j < CountValue[i].length; j++) {
                    row += '"' + CountValue[i][j] + '",';
                }
            }
            CSV += row + '\r\n';
            var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
            //this trick will generate a temp <a /> tag
            var link = document.createElement("a");
            link.href = uri;
            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";
            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        JSONToCSVConvertorFlightSpeed: function (fileName, data, pids, TotalSpeeedCount, Sensortype) {
            var currentWidget = this;
            //var data = currentWidget.AvgSpeedCount;
            //var pids = currentWidget.SpeedPlatformID;
            //var Sensortype = $(currentWidget.ddlsensor).val();


            var speciesname = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val();
            var todate = $(currentWidget.Reporttodate).val();
            var CSV = '';
            var row = "";
            if (speciesname == "" && fromdate == "" && todate == "") {
                row = Sensortype;
            }
            else if (speciesname != "") {
                row = Sensortype + " - " + speciesname;
            }
            else if (fromdate != "" && todate != "") {
                row = Sensortype + " : " + fromdate + " - " + todate;
            }
            else {
                row = Sensortype + " - " + speciesname + " : " + fromdate + " - " + todate;
            }

            CSV += row + '\r\n';
            row = "";

            row = "Location_Classes,";
            //  row = "ID's,Locations,Max Speed,Mean of Speed";
            if (Sensortype == "Argos") {
                for (var k = 0; k < pids.length; k++) {
                    row += pids[k] + ',';
                }
                CSV += row + '\r\n';

                for (var i = 0; i < data.length; i++) {
                    var row = "";
                    row += '"' + data[i].name + '",';
                    for (var j = 0; j < data[i].data.length; j++) {
                        row += '"' + data[i].data[j] + '",';
                    }
                    CSV += row + '\r\n';
                }
            }

            else {
                //var TotalSpeeedCount = currentWidget.TotalSpeedCountValue
                var SpeedValues = data;
                var PTTDID = currentWidget.SpeedPlatformID;
                var row = "";
                row = "ID's,Locations,Max Speed,Mean of Speed";
                CSV += row + '\r\n';
                for (var i = 0; i < SpeedValues.length; i++) {

                    row = SpeedValues[i].PID + ',' + SpeedValues[i].Count + ', ' + SpeedValues[i].MaxData + ',' + SpeedValues[i].AvgData;

                    CSV += row + '\r\n';
                }

            }
            var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
            //this trick will generate a temp <a /> tag
            var link = document.createElement("a");
            link.href = uri;
            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";
            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        JSONToCSVConvertorAltitude: function (fileName, TotalAltitudeCount, AltitudeValues) {
            var currentWidget = this;
            //var TotalAltitudeCount = currentWidget.TotalAltitudeCountValue;
            //var AltitudeValues = currentWidget.AvgAltitudeCount;
            var sensortype = $(currentWidget.ddlsensor).val();
            var speciesname = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val();
            var todate = $(currentWidget.Reporttodate).val();
            var CSV = '';
            var row = "";
            var row1 = "";
            if (speciesname == "" && fromdate == "" && todate == "") {
                row = sensortype;
            }
            else if (speciesname != "") {
                row = sensortype + " - " + speciesname;
            }
            else if (fromdate != "" && todate != "") {
                row = sensortype + " : " + fromdate + " - " + todate;
            }
            else {
                row = sensortype + " - " + speciesname + " : " + fromdate + " - " + todate;
            }

            CSV += row + '\r\n';
            row = "";
            row = "IDs,Locations,Max Altitude,Mean of Altitiude";
            CSV += row + '\r\n';
            for (var i = 0; i < AltitudeValues.length; i++) {


                row1 = AltitudeValues[i].PID + ',' + AltitudeValues[i].Count + ', ' + AltitudeValues[i].MaxData + ',' + AltitudeValues[i].AvgData;

                CSV += row1 + '\r\n';
            }

            var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
            //this trick will generate a temp <a /> tag
            var link = document.createElement("a");
            link.href = uri;
            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";
            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        gpsGsmandArgosCountChart: function (results, ptts) {
            var currentWidget = this;
            var pttds = currentWidget.CollectSelectedPtts();

            var ArgosGPSGSMcountLables = [];
            var dataArgos = [];
            var dataGPS = [];
            var dataGSM = [];
            for (var i = 0; i < results.ArgosGPSCount.length; i++) {
                if (jQuery.inArray(results.ArgosGPSCount[i].PID, ArgosGPSGSMcountLables) == -1) {
                    if (jQuery.inArray(results.ArgosGPSCount[i].PID, ptts) != -1) {
                        ArgosGPSGSMcountLables.push(results.ArgosGPSCount[i].PID);
                    }
                }
            }

            for (var i = 0; i < ArgosGPSGSMcountLables.length; i++) {
                var valueArgos = 0;
                var valueGPS = 0;
                var valueGSM = 0;

                for (var j = 0; j < results.ArgosGPSCount.length; j++) {
                    if (ArgosGPSGSMcountLables[i] == results.ArgosGPSCount[j].PID) {
                        pttid = results.ArgosGPSCount[j].PID;
                        if (results.ArgosGPSCount[j].newfield == "Argos") {
                            valueArgos = results.ArgosGPSCount[j].Column1;
                        }
                        if (results.ArgosGPSCount[j].newfield == "GPS") {
                            valueGPS = results.ArgosGPSCount[j].Column1;
                        }
                        if (results.ArgosGPSCount[j].newfield == "GSM") {
                            valueGSM = results.ArgosGPSCount[j].Column1;
                        }
                    }
                }
                dataArgos.push(valueArgos);
                dataGPS.push(valueGPS);
                dataGSM.push(valueGSM);

                var DatainSeries = [];
                var PlatformId = $(currentWidget.ddlsensor).val();
                var checkCount = PlatformId.length

                for (var k = 0; k < PlatformId.length; k++) {

                    if (PlatformId[k] == "Argos") {
                        DatainSeries.push({
                            name: 'Argos',
                            data: dataArgos
                        })
                    }
                    else if (PlatformId[k] == "GPS") {
                        DatainSeries.push({
                            name: 'GPS',
                            data: dataGPS
                        })
                    }
                    else if (PlatformId[k] == "GSM") {
                        DatainSeries.push({
                            name: 'GSM',
                            data: dataGSM
                        })
                    }

                }



                var ArgosGPSCount = {
                    PTTID: pttid,
                    Argos: valueArgos,
                    GPS: valueGPS,
                    GSM: valueGSM
                }
                currentWidget.reportResults.push(ArgosGPSCount);
            }

            Highcharts.setOptions({
                colors: ['#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#50B432']
            });
            Highcharts.setOptions({
                lang: {
                    thousandsSep: ""
                }
            })

            chart = $('<div class="widget barchart"></div>');
            var sanitizedHtml = DOMPurify.sanitize(chart);
            $("#container1").append(sanitizedHtml);
            chart.highcharts({
                chart: {
                    backgroundColor: 'rgba(222,222,222,0)',
                    type: 'column'
                },
                title: {
                    text: currentWidget._i18n.GPSGSMandArgosDataCollection
                },
                xAxis: {
                    categories: pttds,
                    title: {
                        text: currentWidget._i18n.PlatformIDs
                    }
                },
                yAxis: {
                    min: 0,

                    title: {
                        text: currentWidget._i18n.TotalLocations
                    }
                },
                tooltip: {

                },

                series: DatainSeries,
                exporting: {
                    chartOptions: {
                        chart: {
                            events: {
                                load: function () {
                                    this.plotBackground.attr({
                                        fill: $(currentWidget.reportbgcolor).val(),
                                    });
                                }

                            }
                        }
                    }
                },
            });

        },



        getreports: function () {
            var currentWidget = this;

            var checked = $("input[type=checkbox]:checked").length;
            //var checked = $("'.ReportscheckedValues input[type=checkbox]'").is(':checked')
            if (checked <= 1) {
                AlertMessages("warning", '', currentWidget._i18n.Youmustcheckatleastonecheckbox);
                return false;
            }
            $("#container1").show();
            $("#container1").html("");
            $(currentWidget.divOptions).show();
            $(currentWidget.lblfromdate).hide();
            $(currentWidget.lbltodate).hide();
            $(currentWidget.lblSensortype).hide();
            $(".PullRightBut").css("display", "block");
            $(".bgcolorcollapse").css("display", "block");
            $(".colorlabel").css("display", "block");
            var sensortype = $(currentWidget.ddlsensor).val();
            var fromdate = $(currentWidget.Reportfromdate).val().trim();
            var todate = $(currentWidget.Reporttodate).val().trim();

            var formIsValid = true;

            if (sensortype == "" || sensortype == null) {
                $(currentWidget.lblSensortype).css("display", "block");
                formIsValid = false;
            }
            if (fromdate == "") {
                $(currentWidget.lblfromdate).css("display", "block");

                formIsValid = false;
            }
            if (todate == "") {
                $(currentWidget.lbltodate).css("display", "block");
                formIsValid = false;
            }

            var isvalid = CheckDatesCompare(fromdate, todate);
            if (isvalid == false) {
                $(currentWidget.lbltodate).text("To Date should be Greater than From Date");
                formIsValid = false;
            }
            if (formIsValid == false)
                return false;
            currentWidget.reportResults = [];

            var ptts = currentWidget.CollectSelectedPtts();
            if (ptts == 0) {
                AlertMessages(currentWidget._i18n.warning, '', currentWidget._i18n.PleaseSelectIds);
                return;
            }

            if ($(currentWidget.Reportfromdate).val().trim() != "" && $(currentWidget.Reporttodate).val().trim() != "") {
                var requestData = {
                    fromdate: fromdate,
                    todate: todate
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "jsonReports/",
                    type: "POST",
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {

                        report = jQuery.parseJSON(result);


                        if (report.ArgosGPSCount.length != 0) {
                            var ptts = currentWidget.CollectSelectedPtts();

                            currentWidget.gpsGsmandArgosCountChart(report, ptts);
                            $(".PullRightBut").css("display", "block");
                        }
                        else {
                            AlertMessages(currentWidget._i18n.warning, '', currentWidget._i18n.NoResultsFound);
                            $(".PullRightBut").css("display", "none");
                        }



                    }
                });

            }
            else {

            }


        },

        getpptid: function () {
            var currentWidget = this;
            $(currentWidget.lblfromdate).hide();
            $(currentWidget.lbltodate).hide();
            $(currentWidget.lblSensortype).hide();
            $(currentWidget.getReports).css("display", "none");



            $("#container1").hide();
            var fromdate = $(currentWidget.Reportfromdate).val().trim();
            var todate = $(currentWidget.Reporttodate).val().trim();

            var formIsValid = true;
            if (fromdate == "") {
                $(currentWidget.lblfromdate).css("display", "block");
                formIsValid = false;
            }
            if (todate == "") {
                $(currentWidget.lbltodate).css("display", "block");
                formIsValid = false;
            }
            if ((Date.parse(todate) <= Date.parse(fromdate))) {
                $(currentWidget.lbltodate).text("To Date should be Greater than From Date");
            }
            if (formIsValid == false)
                return;


            if (configOptions.UserInfo.UserRole == "Sponsor") {
                var UserName = configOptions.UserInfo.UserName;
                var url = currentWidget.ServiceUrl + 'JsonGetUserAssinedBirdsDtls/' + UserName;
                $.ajax({
                    url: url,
                    type: 'GET',  // http method
                    crossDomain: true,
                    success: function (result) {


                        var jsonObj = JSON.parse(result.JsonGetUserAssinedBirdsDtlsResult);

                        if (jsonObj != null) {
                            var strAssignBirds = jsonObj.AssignedBirds;
                            var publicuser = jsonObj["AssignedBirds"].split(' ');
                            var publicsensortype = jsonObj.Sensortype;
                            var splitvalues = jsonObj.Sensortype.split(" ");
                            var sensorbasedtypes = [];

                            currentWidget.CollectPtts(publicuser);

                        }

                    },
                    error: function (xhr, error) {
                        AlertMessages('error', '', currentWidget._i18n.UnabletogetAssignedids);
                    },
                });

            }
            else {
                if ($(currentWidget.Reportfromdate).val().trim() != "" && $(currentWidget.Reporttodate).val().trim() != "") {
                    var requestData = {
                        fromdate: fromdate,
                        todate: todate
                    };
                    $.ajax({
                        url: currentWidget.ServiceUrl + "jsonReports/",
                        type: "POST",
                        contentType: 'application/json',
                        data: JSON.stringify(requestData),
                        success: function (result) {

                            var report = JSON.parse(result);
                            currentWidget.CollectPtts(report);

                        },
                        error: function (xhr, error) {
                            AlertMessages("error", '', currentWidget._i18n.UnabletoCollectbirdplatformids);

                        },

                    });

                }
            }
            //else {

            //}

        },
        CollectPtts: function (results) {
            var currentWidget = this;
            if (configOptions.UserInfo.UserRole == "Sponsor") {
                currentWidget.chkpttids = [];
                var ptts = [];
                $(currentWidget.PttsTable).html('');
                if (results.length == 0) {
                    $(currentWidget.getReports).css("display", "none");
                    $(".ColorPicGroup").css("display", "none");
                    AlertMessages("warning", '', currentWidget._i18n.NoBirdIdsFound);
                    return;
                }
                var tblhtml = '<thead><tr><th scope="col" style="width: 10%"></th><th scope="col" style="width: 60%" >' + currentWidget._i18n.IDs + '</th>';

                $(currentWidget.getReports).css("display", "block");

                for (var i = 0; i < results.length; i++) {
                    if (jQuery.inArray(results[i], ptts) == -1) {
                        currentWidget.chkpttids.push(results[i]);
                        tblhtml += "<tr> <td scope='row' > <input id='" + results[i] + "-SType" + "'type='checkbox' class='ReportscheckedValues' value='" + results[i] + "'></td><td><label  for='" + results[i] + "' style = 'width: 50px;'>" + results[i] + "</label></td>";

                        ptts.push(results[i].PID, ptts);
                    }
                }
                var sanitizedHtml = DOMPurify.sanitize(tblhtml);
                $(currentWidget.PttsTable).append(sanitizedHtml);
            }
            else {
                currentWidget.chkpttids = [];
                var ptts = [];
                $(currentWidget.PttsTable).html('');

                if (results.ArgosGPSCount.length == 0) {
                    $(currentWidget.getReports).css("display", "none");
                    $(".ColorPicGroup").css("display", "none");
                    AlertMessages("warning", '', currentWidget._i18n.NoBirdIdsFound);
                    return;
                }
                var tblhtml = '<thead><tr><th scope="col" style="width: 10%"></th><th scope="col" style="width: 60%" >' + currentWidget._i18n.IDs + '</th>';
                tblhtml += '<th scope="col">' + currentWidget._i18n.Status + '</th></tr></thead><tbody>'
                $(currentWidget.getReports).css("display", "block");
                for (var i = 0; i < results.ArgosGPSCount.length; i++) {
                    if (jQuery.inArray(results.ArgosGPSCount[i].PID, ptts) == -1) {
                        currentWidget.chkpttids.push(results.ArgosGPSCount[i].PID);
                        if (results.ArgosGPSCount[i].Status == "AC") {

                            tblhtml += "<tr> <td scope='row' > <input id='" + results.ArgosGPSCount[i].PID + "-SType" + "'type='checkbox' class='ReportscheckedValues' value='" + results.ArgosGPSCount[i].PID + "'></td><td><label  for='" + results.ArgosGPSCount[i].PID + "' style = 'width: 50px;  color:#29e543; !important;'>" + results.ArgosGPSCount[i].PID + "</label></td>";
                            tblhtml += '<td><span class="badge badge-active" style = "width: 50px;  color: #489D07; !important;">' + currentWidget._i18n.Active + '</span></td></tr>';

                        }
                        else if (results.ArgosGPSCount[i].Status == "NA") {
                            tblhtml += "<tr> <td scope='row'><input  id='" + results.ArgosGPSCount[i].PID + "-SType" + "'type='checkbox' class='ReportscheckedValues' value=" + results.ArgosGPSCount[i].PID + "'></td><td><label  !important;'  for='" + results.ArgosGPSCount[i].PID + "' style = 'width: 50px;  color:red; !important;'>" + results.ArgosGPSCount[i].PID + "</label></td>";
                            tblhtml += '<td><span class="badge badge-inactive" style = "width: 50px;  color: red; !important;">' + currentWidget._i18n.Inactive + '</span></td>';


                        }

                        ptts.push(results.ArgosGPSCount[i].PID, ptts);
                    }
                }
                var sanitizedHtml = DOMPurify.sanitize(tblhtml);
                $(currentWidget.PttsTable).append(sanitizedHtml);
            }
        },
        CollectSelectedPtts: function () {
            var currentWidget = this;
            var ptts = [];
            currentWidget.pttds;
            for (var i = 0; i < currentWidget.chkpttids.length; i++) {
                var checkedids = "#" + currentWidget.chkpttids[i] + "-SType";
                if ($(checkedids).is(":checked") == true) {
                    ptts.push(currentWidget.chkpttids[i]);

                }
            }
            return ptts;
        },


        JSONToExcelYearWiseLocations: function (fileName, data, pids) {
            var currentWidget = this;
            var sensortype = $(currentWidget.ddlsensor).val();
            var speciesname = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val();
            var todate = $(currentWidget.Reporttodate).val();
            var CSV = '';
            var row = "";
            if (speciesname == "" && fromdate == "" && todate == "") {
                row = sensortype;
            }
            else if (speciesname != "") {
                row = sensortype + " - " + speciesname;
            }
            else if (fromdate != "" && todate != "") {
                row = sensortype + " : " + fromdate + " - " + todate;
            }
            else {
                row = sensortype + " - " + speciesname + " : " + fromdate + " - " + todate;
            }

            CSV += row + '@';
            row = "";
            row = "Year,";
            //This loop will extract the label from 1st index of on array
            for (var i = 0; i < pids.length; i++) {
                row += pids[i] + ',';
            }
            //append Label row with line break
            CSV += row + '@';
            for (var i = 0; i < data.length; i++) {
                var row = "";
                row += '"' + data[i].name + '",';
                for (var j = 0; j < data[i].data.length; j++) {
                    row += '"' + data[i].data[j] + '",';
                }
                CSV += row + '@';
            }

            var downloadurl = currentWidget.ServiceUrl + "JSONGetExcelDataReportsDownload1" + "/" + CSV + "/" + fileName;
            $("#Report1").val(currentWidget.ServiceUrl + "JSONGetExcelDataReportsDownload1" + "/" + CSV + "/" + fileName);


        },

        JSONToExcelLocationCount: function (fileName, CountValue, PID) {
            var currentWidget = this;
            var sensortype = $(currentWidget.ddlsensor).val();
            var speciesname = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val();
            var todate = $(currentWidget.Reporttodate).val();
            var CSV = '';
            var row = "";
            if (speciesname == "" && fromdate == "" && todate == "") {
                row = sensortype;
            }
            else if (speciesname != "") {
                row = sensortype + " - " + speciesname;
            }
            else if (fromdate != "" && todate != "") {
                row = sensortype + " : " + fromdate + " - " + todate;
            }
            else {
                row = sensortype + " - " + speciesname + " : " + fromdate + " - " + todate;
            }

            CSV += row + '@';
            row = "";

            for (var k = 0; k < PID.length; k++) {
                row += PID[k] + ',';
            }
            CSV += row + '@';
            var row = "";
            for (var i = 0; i < CountValue.length; i++) {
                for (var j = 1; j < CountValue[i].length; j++) {
                    row += '"' + CountValue[i][j] + '",';
                }
            }
            CSV += row + '@';


            var downloadurl = currentWidget.ServiceUrl + "JSONGetExcelDataReportsDownload1" + "/" + CSV + "/" + fileName;
            $("#Report2").val(currentWidget.ServiceUrl + "JSONGetExcelDataReportsDownload1" + "/" + CSV + "/" + fileName);
        },

        JSONToExcelFlightSpeed: function (fileName, data, pids, TotalSpeeedCount, Sensortype) {
            var currentWidget = this;
            var speciesname = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val();
            var todate = $(currentWidget.Reporttodate).val();
            var CSV = '';
            var row = "";
            if (speciesname == "" && fromdate == "" && todate == "") {
                row = Sensortype;
            }
            else if (speciesname != "") {
                row = Sensortype + " - " + speciesname;
            }
            else if (fromdate != "" && todate != "") {
                row = Sensortype + " : " + fromdate + " - " + todate;
            }
            else {
                row = Sensortype + " - " + speciesname + " : " + fromdate + " - " + todate;
            }

            CSV += row + '@';
            row = "";

            row = "Location_Classes,";
            //  row = "ID's,Locations,Max Speed,Mean of Speed";
            if (Sensortype == "Argos") {
                for (var k = 0; k < pids.length; k++) {
                    row += pids[k] + ',';
                }
                CSV += row + '@';

                for (var i = 0; i < data.length; i++) {
                    var row = "";
                    row += '"' + data[i].name + '",';
                    for (var j = 0; j < data[i].data.length; j++) {
                        row += '"' + data[i].data[j] + '",';
                    }
                    CSV += row + '@';
                }
            }

            else {
                //var TotalSpeeedCount = currentWidget.TotalSpeedCountValue
                var SpeedValues = data;
                var PTTDID = currentWidget.SpeedPlatformID;
                var row = "";
                row = "ID's,Locations,Max Speed,Mean of Speed";
                CSV += row + '@';
                for (var i = 0; i < SpeedValues.length; i++) {

                    row = SpeedValues[i].PID + ',' + SpeedValues[i].Count + ', ' + SpeedValues[i].MaxData + ',' + SpeedValues[i].AvgData;

                    CSV += row + '@';
                }

            }

            var downloadurl = currentWidget.ServiceUrl + "JSONGetExcelDataReportsDownload1" + "/" + CSV + "/" + fileName;
            $("#Report3").val(currentWidget.ServiceUrl + "JSONGetExcelDataReportsDownload1" + "/" + CSV + "/" + fileName);

        },

        JSONToExcelAltitude: function (fileName, TotalAltitudeCount, AltitudeValues) {
            var currentWidget = this;
            var sensortype = $(currentWidget.ddlsensor).val();
            var speciesname = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val();
            var todate = $(currentWidget.Reporttodate).val();
            var CSV = '';
            var row = "";
            var row1 = "";
            if (speciesname == "" && fromdate == "" && todate == "") {
                row = sensortype;
            }
            else if (speciesname != "") {
                row = sensortype + " - " + speciesname;
            }
            else if (fromdate != "" && todate != "") {
                row = sensortype + " : " + fromdate + " - " + todate;
            }
            else {
                row = sensortype + " - " + speciesname + " : " + fromdate + " - " + todate;
            }

            CSV += row + '@';
            row = "";
            row = "IDs,Locations,Max Altitude,Mean of Altitiude";
            CSV += row + '@';
            for (var i = 0; i < AltitudeValues.length; i++) {


                row1 = AltitudeValues[i].PID + ',' + AltitudeValues[i].Count + ', ' + AltitudeValues[i].MaxData + ',' + AltitudeValues[i].AvgData;

                CSV += row1 + '@';
            }

            var downloadurl = currentWidget.ServiceUrl + "JSONGetExcelDataReportsDownload1" + "/" + CSV + "/" + fileName;
            $("#Report4").val(currentWidget.ServiceUrl + "JSONGetExcelDataReportsDownload1" + "/" + CSV + "/" + fileName);
        },




        JSONToArgosExcelYearWiseLocations: function (fileName, data, pids) {
            var currentWidget = this;
            var sensortype = $(currentWidget.ddlsensor).val();
            var speciesname = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val();
            var todate = $(currentWidget.Reporttodate).val();
            var CSV = '';
            var row = "";
            if (speciesname == "" && fromdate == "" && todate == "") {
                row = sensortype;
            }
            else if (speciesname != "") {
                row = sensortype + " - " + speciesname;
            }
            else if (fromdate != "" && todate != "") {
                row = sensortype + " : " + fromdate + " - " + todate;
            }
            else {
                row = sensortype + " - " + speciesname + " : " + fromdate + " - " + todate;
            }

            CSV += row + '@';
            row = "";
            row = "Year,";
            //This loop will extract the label from 1st index of on array
            for (var i = 0; i < pids.length; i++) {
                row += pids[i] + ',';
            }
            //append Label row with line break
            CSV += row + '@';
            for (var i = 0; i < data.length; i++) {
                var row = "";
                row += '"' + data[i].name + '",';
                for (var j = 0; j < data[i].data.length; j++) {
                    row += '"' + data[i].data[j] + '",';
                }
                CSV += row + '@';
            }

            var downloadurl = currentWidget.ServiceUrl + "JSONGetExcelDataReportsDownload1" + "/" + CSV + "/" + fileName;
            $("#Report5").val(currentWidget.ServiceUrl + "JSONGetExcelDataReportsDownload1" + "/" + CSV + "/" + fileName);


        },

        JSONToArgosExcelLocationCount: function (fileName, CountValue, PID) {
            var currentWidget = this;
            var sensortype = $(currentWidget.ddlsensor).val();
            var speciesname = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val();
            var todate = $(currentWidget.Reporttodate).val();
            var CSV = '';
            var row = "";
            if (speciesname == "" && fromdate == "" && todate == "") {
                row = sensortype;
            }
            else if (speciesname != "") {
                row = sensortype + " - " + speciesname;
            }
            else if (fromdate != "" && todate != "") {
                row = sensortype + " : " + fromdate + " - " + todate;
            }
            else {
                row = sensortype + " - " + speciesname + " : " + fromdate + " - " + todate;
            }

            CSV += row + '@';
            row = "";

            for (var k = 0; k < PID.length; k++) {
                row += PID[k] + ',';
            }
            CSV += row + '@';
            var row = "";
            for (var i = 0; i < CountValue.length; i++) {
                for (var j = 1; j < CountValue[i].length; j++) {
                    row += '"' + CountValue[i][j] + '",';
                }
            }
            CSV += row + '@';


            var downloadurl = currentWidget.ServiceUrl + "JSONGetExcelDataReportsDownload1" + "/" + CSV + "/" + fileName;
            $("#Report6").val(currentWidget.ServiceUrl + "JSONGetExcelDataReportsDownload1" + "/" + CSV + "/" + fileName);
        },

        JSONToArgosExcelFlightSpeed: function (fileName, data, pids, TotalSpeeedCount, Sensortype) {
            var currentWidget = this;
            var speciesname = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val();
            var todate = $(currentWidget.Reporttodate).val();
            var CSV = '';
            var row = "";
            if (speciesname == "" && fromdate == "" && todate == "") {
                row = Sensortype;
            }
            else if (speciesname != "") {
                row = Sensortype + " - " + speciesname;
            }
            else if (fromdate != "" && todate != "") {
                row = Sensortype + " : " + fromdate + " - " + todate;
            }
            else {
                row = Sensortype + " - " + speciesname + " : " + fromdate + " - " + todate;
            }

            CSV += row + '@';
            row = "";

            row = "Location_Classes,";
            //  row = "ID's,Locations,Max Speed,Mean of Speed";
            if (Sensortype == "Argos") {
                for (var k = 0; k < pids.length; k++) {
                    row += pids[k] + ',';
                }
                CSV += row + '@';

                for (var i = 0; i < data.length; i++) {
                    var row = "";
                    row += '"' + data[i].name + '",';
                    for (var j = 0; j < data[i].data.length; j++) {
                        row += '"' + data[i].data[j] + '",';
                    }
                    CSV += row + '@';
                }
            }

            else {
                //var TotalSpeeedCount = currentWidget.TotalSpeedCountValue
                var SpeedValues = data;
                var PTTDID = currentWidget.SpeedPlatformID;
                var row = "";
                row = "ID's,Locations,Max Speed,Mean of Speed";
                CSV += row + '@';
                for (var i = 0; i < SpeedValues.length; i++) {

                    row = SpeedValues[i].PID + ',' + SpeedValues[i].Count + ', ' + SpeedValues[i].MaxData + ',' + SpeedValues[i].AvgData;

                    CSV += row + '@';
                }

            }

            var downloadurl = currentWidget.ServiceUrl + "JSONGetExcelDataReportsDownload1" + "/" + CSV + "/" + fileName;
            $("#Report7").val(currentWidget.ServiceUrl + "JSONGetExcelDataReportsDownload1" + "/" + CSV + "/" + fileName);

        },

        JSONToArgosExcelAltitude: function (fileName, TotalAltitudeCount, AltitudeValues) {
            var currentWidget = this;
            var sensortype = $(currentWidget.ddlsensor).val();
            var speciesname = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val();
            var todate = $(currentWidget.Reporttodate).val();
            var CSV = '';
            var row = "";
            var row1 = "";
            if (speciesname == "" && fromdate == "" && todate == "") {
                row = sensortype;
            }
            else if (speciesname != "") {
                row = sensortype + " - " + speciesname;
            }
            else if (fromdate != "" && todate != "") {
                row = sensortype + " : " + fromdate + " - " + todate;
            }
            else {
                row = sensortype + " - " + speciesname + " : " + fromdate + " - " + todate;
            }

            CSV += row + '@';
            row = "";
            row = "IDs,Locations,Max Altitude,Mean of Altitiude";
            CSV += row + '@';
            for (var i = 0; i < AltitudeValues.length; i++) {


                row1 = AltitudeValues[i].PID + ',' + AltitudeValues[i].Count + ', ' + AltitudeValues[i].MaxData + ',' + AltitudeValues[i].AvgData;

                CSV += row1 + '@';
            }

            var downloadurl = currentWidget.ServiceUrl + "JSONGetExcelDataReportsDownload1" + "/" + CSV + "/" + fileName;
            $("#Report8").val(currentWidget.ServiceUrl + "JSONGetExcelDataReportsDownload1" + "/" + CSV + "/" + fileName);
        },


        GetRawDataDownloadExcel: function (sensortype, speciesname, fromdate, todate) {
            var currentWidget = this;
            var Sensortype = $(currentWidget.ddlsensor).val();
            var SpeciesName = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val();
            var todate = $(currentWidget.Reporttodate).val();
            var Platformid = $(currentWidget.ddlplatformid).val();

            if (fromdate == "") {
                fromdate = null;
            }
            if (SpeciesName == "") {
                SpeciesName = null;
            }
            if (todate == "") {
                todate = null;
            }
            if (Platformid == 0) {
                Platformid = null;
            }

            var ua = navigator.userAgent;
            var checker = {
                iphone: ua.match(/BirdTracking_Ios/),
                blackberry: ua.match(/BlackBerry/),
                android: ua.match(/BirdTracking_Android/)
            };
            if (configOptions.UserInfo.UserRole == "Sponsor") {
                if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android") || checker.android || checker.iphone) {
                    var downloadurl = currentWidget.ServiceUrl + "JsonGetSponsorRawDataDownload" + "/" + Sensortype + "/" + SpeciesName + "/" + fromdate + "/" + todate + "/" + Platformid;
                    $(currentWidget.getRawDataMobile).attr("href", downloadurl);
                }
            }
            else {
                if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android") || checker.android || checker.iphone) {
                    var downloadurl = currentWidget.ServiceUrl + "JsonGetExportRawDataDownload" + "/" + Sensortype + "/" + SpeciesName + "/" + fromdate + "/" + todate + "/" + Platformid + currentWidget.adduserdetails() + "/" + "RawDataReport.csv";
                    $(currentWidget.getRawDataMobile).attr("href", downloadurl);
                }
            }
        },




    });
});




