define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/topic',
    "dojo/text!emap/DurationTypeReport/templates/DurationTypeReport.html",
    "dojo/i18n!emap/DurationTypeReport/nls/Resource",
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
        chkpttids: [],
        backgroundColorCode: null,
        reportheading: [],
        monthtotalcount: [],
        daytotalcount: [],
        weektotalcount: [],



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

            topic.subscribe('Reports/PlatformRecordCountData', lang.hitch(this, function () {
                currentWidget.getsensortype();
                currentWidget.GetPlatformidsbasedonSensortype();
                currentWidget.getDurationtype();
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
                $("#NewReportWid").css("display", "block");
                $("#container").html("");
                currentWidget.ClearControls();
            });
            $('.BacktoDash').click(function () {
                $(this).closest('.ReportsHideShow').hide();
                $("#NewReportWid").fadeIn();
                $(".ReportsHideShow").hide();
                $("#container").html("");
                currentWidget.ClearControls();
                $(".CloseContainer").css("display", "block");
            });
        },

        startup: function () {
            var currentWidget = this;
        },
        ClearControls: function () {
            var currentWidget = this;
            $(currentWidget.Reportfromdate).val("");
            $(currentWidget.Reporttodate).val("");
            $(currentWidget.ddlsensor).html("");
            $(currentWidget.ddlsensor).val("");
            $(currentWidget.ddlSpeciesName).html("");
            $(currentWidget.ddlSpeciesName).val("");
            $(currentWidget.ddlplatformid).html("");
            $(currentWidget.ddlplatformid).val("");
            $(currentWidget.lblSensortype).css("display", "none");
            $(currentWidget.lblSpeciesName).css("display", "none");
            $(currentWidget.lblplatformid).css("display", "none");
            $(currentWidget.lblDurationtime).css("display", "none");
            $(currentWidget.lblfromdate).css("display", "none");
            $(currentWidget.lbltodate).css("display", "none");
            $(currentWidget.lblgreater).css("display", "none");
            $(currentWidget.ddlDurationtype).html("");
            $(currentWidget.ddlDurationtype).val("");
            $(currentWidget.exportReportsMobile).css("display", "none");
            $(currentWidget.exportReports).css("display", "none");
        },
        getsensortype: function () {
            var currentWidget = this;
            $(currentWidget.ddlsensor).SumoSelect({ search: true, searchText: 'Enter here.', placeholder: currentWidget._i18n.placeholderSensorType, forceCustomRendering: true });
            $(currentWidget.ddlsensor).empty();
            $(currentWidget.ddlsensor).html("");
            $(currentWidget.ddlsensor).val("");
            if (configOptions.UserInfo.UserRole == "Sponsor") {
                var sensortype = [];
                var PID = [];
                var IDwithSensor = configOptions.SponsorandPublicID;
                for (var i = 0; i < IDwithSensor.length; i++) {
                    var splitData = IDwithSensor[i].split("-");

                    sensortype.push(splitData[1]);
                    PID.push(splitData[0]);
                }
                $(currentWidget.ddlsensor).append('<option value=""></option>');
                if (sensortype.includes("Argos") == true) {
                    $(currentWidget.ddlsensor).append('<option value="Argos">Argos</option>');
                }
                if (sensortype.includes("GPS") == true) {
                    $(currentWidget.ddlsensor).append('<option value="GPS">GPS</option>');
                }
                if (sensortype.includes("GSM") == true) {
                    $(currentWidget.ddlsensor).append('<option value="GSM">GSM</option>');
                }
                $(currentWidget.ddlsensor)[0].sumo.reload();
            }
            else {
                $(currentWidget.ddlsensor).append('<option value=""></option>');
                $(currentWidget.ddlsensor).append('<option value="Argos" selected>Argos</option>');
                $(currentWidget.ddlsensor).append('<option value="GPS">GPS</option>');
                $(currentWidget.ddlsensor).append('<option value="GSM">GSM</option>');
                $(currentWidget.ddlsensor)[0].sumo.reload();
            }
            $(currentWidget.ddlSpeciesName).SumoSelect({ search: true, searchText: 'Enter here.', placeholder: currentWidget._i18n.placeholderSpeciesName });
            $(currentWidget.ddlDurationtype).SumoSelect({ search: true, searchText: 'Enter here.', placeholder: currentWidget._i18n.placeholderDurationType });
            $(currentWidget.ddlplatformid).SumoSelect({
                placeholder: currentWidget._i18n.placeholderPlatFormId, selectAll: true, okCancelInMulti: true, forceCustomRendering: true, captionFormatAllSelected: ' {0} ' + currentWidget._i18n.SelectedAllItems, captionFormat: ' {0} ' + currentWidget._i18n.SelectedItems, locale: [currentWidget._i18n.OK, currentWidget._i18n.Cancel, currentWidget._i18n.SelectAll],
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

        getDurationtype: function () {
            var currentWidget = this;
            $(currentWidget.ddlDurationtype).empty();
            $(currentWidget.ddlDurationtype).append('<option value=""></option>');
            $(currentWidget.ddlDurationtype).append('<option value="Day Wise">Day Wise</option>');
            $(currentWidget.ddlDurationtype).append('<option value="Week Wise">Week Wise</option>');
            $(currentWidget.ddlDurationtype).append('<option value="Month Wise">Month Wise</option>');
            $(currentWidget.ddlDurationtype)[0].sumo.reload();
        },

        GetPlatformidsbasedonSensortype: function () {
            var currentWidget = this;
            $(currentWidget.lblSensortype).css("display", "none");
            $(currentWidget.ddlSpeciesName).val("");

            $(currentWidget.Reportfromdate).val("");
            $(currentWidget.Reportfromdate).html("");
            $(currentWidget.Reporttodate).val("");
            $(currentWidget.Reporttodate).html("");
            $(currentWidget.ddlDurationtype).val("");

            $(currentWidget.ddlDurationtype)[0].sumo.reload();
            var sensorType = $(currentWidget.ddlsensor).val();


            if (sensorType == "") {
                return;
            }
            currentWidget.GetRawDataDownloadExcel();

            if (configOptions.UserInfo.UserRole == "Sponsor") {
                var IDwithSensor = configOptions.SponsorandPublicID;

                var Sensortype = [];
                var PID = [];
                for (var i = 0; i < IDwithSensor.length; i++) {
                    var splitData = IDwithSensor[i].split("-");
                    Sensortype.push(splitData[1]);
                    PID.push(splitData[0]);
                }
                var requestData = {
                    id: PID.toString(),
                    type: sensorType
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

                    },
                    error: function (xhr, error) {
                        AlertMessages("error", '', currentWidget._i18n.Unabletofetchbirdnames);
                    },
                });

                var requestData = {
                    id: PID.toString(),
                    type: sensorType
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
                                    });
                                    $(currentWidget.ddlplatformid).append(optionValue);
                                    
                                }
                                else {
                                    var optionValue1 = $('<option>', {
                                        value: jsonObj[i].PID,
                                        html: jsonObj[i].PID + " (NA)"
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
                    type: sensorType
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JSONDistinctCommonNames/",
                    type: 'POST',  
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        $(currentWidget.ddlSpeciesName).html("");
                        $(currentWidget.ddlSpeciesName)[0].sumo.reload();

                        var jsonObj = JSON.parse(result);
                        if (jsonObj != null) {
                            var speciesname;
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


                    },
                    error: function (xhr, error) {
                        AlertMessages("error", '', currentWidget._i18n.Unabletofetchbirdnames);
                    },
                });

                var requestData = {
                    type: sensorType
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JSONDistinctPlatformIds/",
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

        getPTTDS: function () {
            var currentWidget = this;
            $(currentWidget.lblSensortype).css("display", "none");
            $("#container").html("");

            var BirdName = $(currentWidget.ddlSpeciesName).val();
            var sensorType = $(currentWidget.ddlsensor).val();
            var fromdate = $(currentWidget.Reportfromdate).val();
            var todate = $(currentWidget.Reporttodate).val();

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
                $(".Overlay").fadeOut();
                return;
            }
            if (fromdate == "") {
                fromdate = null;
            }
            if (todate == "") {
                todate = null;
            }
            if (configOptions.UserInfo.UserRole == "Sponsor") {
                var pids;
                var sensortype = [];
                var PID = [];
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
                    type: 'POST',
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        $(currentWidget.ddlplatformid).html("");
                        $(currentWidget.ddlplatformid)[0].sumo.reload();
                        $(currentWidget.lblplatformid).css("display", "none");
                        var jsonObj = JSON.parse(result);
                        if (jsonObj != null) {
                            currentWidget.birdInfo = jsonObj;
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
                        console.log(result);
                    },
                    error: function (xhr, error) {

                        AlertMessages("error", '', currentWidget._i18n.Unabletofetchbirdplatformids);
                        console.debug(xhr); console.debug(error);
                    },
                });
            }
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
        ExportReport: function () {
            var currentWidget = this;
            currentWidget.JSONToCSVConvertor("Platform Record Count", currentWidget.reportResults, currentWidget.reportheading);

        },
        //ExportReportMobile: function () {
        //    var currentWidget = this;
        //    currentWidget.JSONToExcelDownload("Platform Record Count", currentWidget.reportResults, currentWidget.reportheading);

        //},
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
        ClearDurationType: function () {
            var currentWidget = this;
            $(currentWidget.lblDurationtime).css("display", "none");
        },

        JSONToCSVConvertor: function (fileName, data, pids) {
            var currentWidget = this;
            var sensortype = $(currentWidget.ddlsensor).val();
            var speciesname = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val();
            var todate = $(currentWidget.Reporttodate).val();
            var CSV = '';
            var row = "";
            if (speciesname == "") {
                row = sensortype + " : " + fromdate + " - " + todate;
            } else {
                row = sensortype + " - " + speciesname + " : " + fromdate + " - " + todate;
            }

            CSV += row + '\r\n';
            row = "";
            row += "PlatformId,";
            //This loop will extract the label from 1st index of on array
            for (var i = 0; i < pids.length; i++) {
                row += pids[i] + ',';
            }
            //row = "";
            //append Label row with line break
            CSV += row + '\r\n';
            row = "";
            for (var i = 0; i < data.length; i++) {
                var row = "";
                row += '"' + data[i].name + '",';
                for (var j = 0; j < data[i].data.length; j++) {
                    row += '"' + data[i].data[j] + '",';
                }
                CSV += row + '\r\n';
            }
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            var blob = new Blob([CSV], { type: "octet/stream;charset=utf-8;filename=" + fileName + '.csv' });
            contentType = blob.type;
            url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = contentType.split(";")[2].split("=")[1];
            a.click();
            window.URL.revokeObjectURL(url);
        },

        getdurationdata: function () {
            var currentWidget = this;
            $("#container").html("");
            $(".Overlay").fadeIn();
            var pids;
            var sensorType = $(currentWidget.ddlsensor).val();
            var speciesname = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val();
            var todate = $(currentWidget.Reporttodate).val();
            var platformid = $(currentWidget.ddlplatformid).val();
            var durationtype = $(currentWidget.ddlDurationtype).val();



            if (platformid == 0) {
                platformid = null;
            }
            if (speciesname == "") {
                speciesname = null;
            }
            var formIsValid = true;
            if (sensorType == "") {
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
                $(currentWidget.lblgreater).css("display", "block");
                formIsValid = false;
            }

            if (durationtype == "") {
                $(currentWidget.lblDurationtime).css("display", "block");
                formIsValid = false;
            }

            if (formIsValid == false) {
                $(".Overlay").fadeOut();
                return;
            }

            var ua = navigator.userAgent;
            var checker = {
                iphone: ua.match(/BirdTracking_Ios/),
                blackberry: ua.match(/BlackBerry/),
                android: ua.match(/BirdTracking_Android/)
            };

            if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android") || checker.android || checker.iphone) {
                $(currentWidget.exportReportsMobile).css("display", "block");
                $(currentWidget.exportReports).css("display", "none");
            }
            else {
                $(currentWidget.exportReports).css("display", "block");
                $(currentWidget.exportReportsMobile).css("display", "none");
            }

            var dateFormats = {
                'YYYY-MM-DD': /^\d{4}-\d{2}-\d{2}$/,
                'MM/DD/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
                'DD/MM/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
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
                if (platformid == null) {
                    pids = PID;
                }
                else {
                    pids = platformid;
                }

                //if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android")) {
                //    var downloadurl = currentWidget.ServiceUrl + "JsonGetSponsorRawDataDownload" + "/" + sensorType + "/" + speciesname + "/" + fromdate + "/" + todate + "/" + pids;
                //    $(currentWidget.getRawDataMobile).attr("href", downloadurl);
                //}

            }
            else {
                pids = platformid;

                //if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android")) {
                //    var userDetails = currentWidget.adduserdetails();
                //    var downloadurl = currentWidget.ServiceUrl + "JsonGetExportRawDataDownload" + "/" + sensorType + "/" + speciesname + "/" + fromdate + "/" + todate + "/" + pids + userDetails + "/" + "RawDataReport.csv";
                //    $(currentWidget.getRawDataMobile).attr("href", downloadurl);
                //}
            }



            if (durationtype == "Week Wise") {
                $("#container").css("display", "block");
                if (pids != null) {
                    pids = pids.toString()
                }
                var requestData = {
                    id: pids,
                    type: sensorType,
                    fromdate: fromdate,
                    todate: todate,
                    speciesname: speciesname
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonGetReportDataByWeek/",
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
                        else {
                            if (jsonObj != null) {
                                var SeriesData = [];
                                var XaxisSeries = [];
                                var PreviousYear;
                                var PrevWeek;
                                var result;
                                var yearCount = 0;
                                var isNextYear = false;

                                for (var i = 0; i < jsonObj.length; i++) {
                                    var currentdate = new Date(jsonObj[i].TDate.split("T")[0]);
                                    if (i == 0) {
                                        PreviousYear = currentdate.getFullYear();
                                    }
                                    if (PreviousYear != currentdate.getFullYear()) {
                                        isNextYear = true;
                                        yearCount++;
                                        PreviousYear = currentdate.getFullYear();
                                    }
                                    if (PreviousYear == currentdate.getFullYear() && isNextYear == false) {
                                        var oneJan = new Date(currentdate.getFullYear(), 0, 1);

                                        var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
                                        result = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);
                                        jsonObj[i].TDate = result;
                                        // }
                                    }

                                    else {
                                        var oneJan = new Date(currentdate.getFullYear(), 0, 1);

                                        var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
                                        var result1 = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);

                                        if (PrevWeek != result1) {
                                            PrevWeek = result1;
                                            result = result1 + (53 * parseInt(yearCount));
                                        }
                                        jsonObj[i].TDate = result;

                                    }
                                }

                                var PidArray = currentWidget.groupBy1(jsonObj, "PID");
                                var count = 0;
                                var pids = [];


                                for (key in PidArray) {
                                    if (PidArray.hasOwnProperty(key)) {
                                        count++;
                                        pids.push(key);
                                    }
                                }

                                for (i = 0; i < pids.length; i++) {
                                    var pidbyweek = [];
                                    var WeekArray = currentWidget.groupBy1(PidArray[pids[i]], "TDate");
                                    pidbyweek.push({ PID: pids[i], Week: WeekArray });

                                    for (var k = 0; k < pidbyweek.length; k++) {
                                        var perWeek = [];
                                        var DataArray = [];
                                        for (key in pidbyweek[k].Week) {
                                            if (pidbyweek[k].Week.hasOwnProperty(key)) {
                                                count++;
                                                perWeek.push(key);

                                            }
                                        }
                                        var WeekCount = 1;
                                        for (var j = 0; j < perWeek.length; j++) {
                                            DataArray.push(pidbyweek[k].Week[perWeek[j]].length);
                                            if (XaxisSeries.indexOf("Week " + parseInt(perWeek[j])) < 0) {
                                                XaxisSeries.push("Week " + parseInt(perWeek[j]));
                                            }
                                        }

                                    }
                                    SeriesData.push({ name: pids[i], data: DataArray });

                                }
                                currentWidget.WeekwiseBarGraph(SeriesData, XaxisSeries);
                                currentWidget.reportResults = SeriesData;
                                currentWidget.reportheading = XaxisSeries;
                                $(".Overlay").fadeOut();
                            }
                        }
                        if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android") || checker.android || checker.iphone) {
                            currentWidget.JSONToExcelDownload("Platform Record Count", currentWidget.reportResults, currentWidget.reportheading);
                        }
                    },
                    error: function (xhr, error) {
                        $(".Overlay").fadeOut();

                        AlertMessages("error", '', currentWidget._i18n.UnabletoFetchWeekChartDetails);
                        console.debug(xhr); console.debug(error);
                    },
                });
            }
            if (durationtype == "Day Wise") {
                $("#container").css("display", "block");
                if (pids != null) {
                    pids = pids.toString()
                }
                var requestData = {
                    id: pids,
                    type: sensorType,
                    fromdate: fromdate,
                    todate: todate,
                    speciesname: speciesname
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonGetReportDataByDay/",
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
                        else {
                            if (jsonObj != null) {
                                var DateArray = [];
                                var SeriesData = [];
                                var XaxisSeries = [];
                                var Monthval;
                                for (var i = 0; i < jsonObj.length; i++) {
                                    var Dateval = String(jsonObj[i].TDate).split("T")[0];
                                    if (/^\d{4}-\d{2}-\d{2}$/.test(Dateval)) {
                                        var parsedDate = moment(Dateval, 'YYYY-MM-DD', true);
                                        if (!parsedDate.isValid()) {
                                            continue;
                                        }
                                        var TempDate = new Date(Dateval);

                                        if (TempDate.getMonth() == 0) {
                                            MonthVal = "1";
                                        }
                                        else if (TempDate.getMonth() == 1) {
                                            MonthVal = "2";
                                        }
                                        else if (TempDate.getMonth() == 2) {
                                            MonthVal = "3";
                                        }
                                        else if (TempDate.getMonth() == 3) {
                                            MonthVal = "4";
                                        }
                                        else if (TempDate.getMonth() == 4) {
                                            MonthVal = "5";
                                        }
                                        else if (TempDate.getMonth() == 5) {
                                            MonthVal = "6";
                                        }
                                        else if (TempDate.getMonth() == 6) {
                                            MonthVal = "7";
                                        }
                                        else if (TempDate.getMonth() == 7) {
                                            MonthVal = "8";
                                        }
                                        else if (TempDate.getMonth() == 8) {
                                            MonthVal = "9";
                                        }
                                        else if (TempDate.getMonth() == 9) {
                                            MonthVal = "10";
                                        }
                                        else if (TempDate.getMonth() == 10) {
                                            MonthVal = "11";
                                        }
                                        else if (TempDate.getMonth() == 11) {
                                            MonthVal = "12";
                                        }

                                        DateArray.push(TempDate.getDate() + "/" + TempDate.getMonth() + "/" + TempDate.getFullYear())
                                        jsonObj[i].TDate = TempDate.getDate() + "/" + MonthVal + "/" + TempDate.getFullYear();
                                    }
                                    else {
                                        continue;
                                    }
                                }
                                var PidArray = currentWidget.groupBy1(jsonObj, "PID");
                                var count = 0;
                                var pids = [];


                                for (key in PidArray) {
                                    if (PidArray.hasOwnProperty(key)) {
                                        count++;
                                        pids.push(key);
                                    }
                                }

                                for (i = 0; i < pids.length; i++) {
                                    var pidbyday = [];
                                    var DayArray = currentWidget.groupBy1(PidArray[pids[i]], "TDate");
                                    pidbyday.push({ PID: pids[i], Days: DayArray });

                                    for (var k = 0; k < pidbyday.length; k++) {
                                        var perDay = [];
                                        var DataArray = [];
                                        for (key in pidbyday[k].Days) {
                                            if (pidbyday[k].Days.hasOwnProperty(key)) {
                                                count++;
                                                perDay.push(key);

                                            }
                                        }
                                        for (var j = 0; j < perDay.length; j++) {
                                            DataArray.push(pidbyday[k].Days[perDay[j]].length);

                                            if (XaxisSeries.indexOf(perDay[j]) < 0) {
                                                XaxisSeries.push(perDay[j]);
                                            }
                                        }
                                    }
                                    SeriesData.push({ name: pids[i], data: DataArray });
                                }
                                currentWidget.DaywiseBarGraph(SeriesData, XaxisSeries);
                                currentWidget.reportResults = SeriesData;
                                currentWidget.reportheading = XaxisSeries;
                                $(".Overlay").fadeOut();
                            }
                        }
                        if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android") || checker.android || checker.iphone) {
                            currentWidget.JSONToExcelDownload("Platform Record Count", currentWidget.reportResults, currentWidget.reportheading);
                        }
                    },
                    error: function (xhr, error) {
                        $(".Overlay").fadeOut();

                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchDaywiseChartDetails);
                        console.debug(xhr); console.debug(error);
                    },
                });
            }
            if (durationtype == "Month Wise") {
                $("#container").css("display", "block");
                if (pids != null) {
                    pids = pids.toString()
                }
                var requestData = {
                    id: pids,
                    type: sensorType,
                    fromdate: fromdate,
                    todate: todate,
                    speciesname:speciesname
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonGetReportDataByMonth/",
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
                        else {
                            if (jsonObj != null) {
                                var TempMonth = [];
                                var TempYear = [];
                                var Dateval = [];
                                var DateArray = [];
                                var SeriesData = [];
                                var XaxisSeries = [];

                                for (var i = 0; i < jsonObj.length; i++) {

                                    var Dateval = String(jsonObj[i].TDate).split("T")[0];
                                    if (/^\d{4}-\d{2}-\d{2}$/.test(Dateval)) {
                                        var parsedDate = moment(Dateval, 'YYYY-MM-DD', true);

                                        if (!parsedDate.isValid()) {
                                            continue;
                                        }
                                        var TempDate = new Date(Dateval);

                                        if (TempDate.getMonth() == 0) {
                                            MonthVal = "Jan";
                                        }
                                        else if (TempDate.getMonth() == 1) {
                                            MonthVal = "Feb";
                                        }
                                        else if (TempDate.getMonth() == 2) {
                                            MonthVal = "Mar";
                                        }
                                        else if (TempDate.getMonth() == 3) {
                                            MonthVal = "Apr";
                                        }
                                        else if (TempDate.getMonth() == 4) {
                                            MonthVal = "May";
                                        }
                                        else if (TempDate.getMonth() == 5) {
                                            MonthVal = "June";
                                        }
                                        else if (TempDate.getMonth() == 6) {
                                            MonthVal = "July";
                                        }
                                        else if (TempDate.getMonth() == 7) {
                                            MonthVal = "Aug";
                                        }
                                        else if (TempDate.getMonth() == 8) {
                                            MonthVal = "Sep";
                                        }
                                        else if (TempDate.getMonth() == 9) {
                                            MonthVal = "Oct";
                                        }
                                        else if (TempDate.getMonth() == 10) {
                                            MonthVal = "Nov";
                                        }
                                        else if (TempDate.getMonth() == 11) {
                                            MonthVal = "Dec";
                                        }
                                        DateArray.push(MonthVal + "/" + TempDate.getFullYear());
                                        jsonObj[i].TDate = MonthVal + "/" + TempDate.getFullYear();
                                    }
                                    else
                                    {
                                        continue;
                                    }
                                }

                                var PidArray = currentWidget.groupBy1(jsonObj, "PID");
                                var count = 0;
                                var pids = [];


                                for (key in PidArray) {
                                    if (PidArray.hasOwnProperty(key)) {
                                        count++;
                                        pids.push(key);
                                    }
                                }

                                for (i = 0; i < pids.length; i++) {
                                    var pidbymonth = [];
                                    var MonthArray = currentWidget.groupBy1(PidArray[pids[i]], "TDate");
                                    pidbymonth.push({ PID: pids[i], Month: MonthArray });
                                    for (var k = 0; k < pidbymonth.length; k++) {
                                        var Months = [];
                                        var DataArray = [];
                                        for (key in pidbymonth[k].Month) {
                                            if (pidbymonth[k].Month.hasOwnProperty(key)) {
                                                count++;
                                                Months.push(key);

                                            }
                                        }
                                        for (var j = 0; j < Months.length; j++) {
                                            DataArray.push(pidbymonth[k].Month[Months[j]].length);

                                            if (XaxisSeries.indexOf(Months[j]) < 0) {
                                                XaxisSeries.push(Months[j]);
                                            }

                                        }


                                    }
                                    SeriesData.push({ name: pids[i], data: DataArray });
                                }
                                currentWidget.MonthwiseBarGraph(SeriesData, XaxisSeries);
                                currentWidget.reportResults = SeriesData;
                                currentWidget.reportheading = XaxisSeries;
                                $(".Overlay").fadeOut();
                            }
                        }
                        if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android") || checker.android || checker.iphone) {
                            currentWidget.JSONToExcelDownload("Platform Record Count", currentWidget.reportResults, currentWidget.reportheading);
                        }
                    },
                    error: function (xhr, error) {

                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchMonthChartDetails);
                        console.debug(xhr); console.debug(error);
                        $(".Overlay").fadeOut();
                    },
                });
            }


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

        WeekwiseBarGraph: function (SeriesData, XaxisSeries) {
            var currentWidget = this;
            var count = 0;
            var AssignedData = [];
            var TempData = [];
            var DataArray = [];

            Highcharts.chart('container', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: XaxisSeries,
                    title: {
                        text: currentWidget._i18n.Weeks,
                        style: "font-size:30px"
                    },
                },
                credits: {
                    enabled: false
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: currentWidget._i18n.Locations,
                        style: "font-size:30px"
                    },
                },
                exporting: {
                    accessibility: {
                        enabled: true
                    },
                    filename: "Week-wise Report",
                },
                series: SeriesData,
            });


        },
        MonthwiseBarGraph: function (datainSeries, xaxisdata) {
            var currentWidget = this;
            var count = 0;
            var AssignedData = [];
            var TempData = [];
            var Platformid = [];
            var DatainSeries = [];

            $('#container').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
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
                    formatter: undefined,
                    title: {
                        text: currentWidget._i18n.Months,
                        style: "font-size:30px"
                    }
                },
                yAxis: {
                    title: {
                        text: currentWidget._i18n.Locations,
                        style: "font-size:30px"
                    }
                },
                exporting: {
                    accessibility: {
                        enabled: true
                    },
                    filename: "Month-wise Duration Report",
                },
                series: datainSeries,
            });


        },
        DaywiseBarGraph: function (DatainSeries, xaxisdata) {
            var currentWidget = this;
            var count = 0;
            var AssignedData = [];
            var TempData = [];
            var DataArray = [];
            Highcharts.chart('container', {
                chart: {
                    type: 'column'
                },
                subtitle: {
                    text: currentWidget._i18n.DurationByDayWise
                },
                title: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories: xaxisdata,
                    title: {
                        text: currentWidget._i18n.Days,
                        style: "font-size:30px"
                    }

                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                },
                yAxis: {
                    title: {
                        text: currentWidget._i18n.Locations,
                        style: "font-size:30px"
                    }
                },

                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                exporting: {
                    accessibility: {
                        enabled: true
                    },
                    filename: "Daily-wise Report",
                },

                series: DatainSeries,
            });

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
                $(currentWidget.lbltodate).text(currentWidget._i18n.ToDateshouldbeGreaterthanFromDate);
            }
            if (formIsValid == false)
                return;
            if (configOptions.UserInfo.UserRole == "Sponsor") {
                var UserName = configOptions.UserInfo.UserName;
                var requestData = {
                    login: configOptions.UserInfo.UserName
                };
                var url = currentwidget.ServiceUrl + 'JsonGetUserAssinedBirdsDtls/';
                $.ajax({
                    url: url,
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {


                        var jsonObj = JSON.parse(result);

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
                            AlertMessages("error", '', currentWidget._i18n.UnabletogetAssignedids);

                        },

                    });

                }
            }
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
            if (Sensortype == "") {
                $(currentWidget.lblSensortype).css("display", "block");
                $(".Overlay").fadeOut();
                return;
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
                if (pids != null) {
                    pids=pids.toString()
                }
                var requestData = {
                    id: pids.toString(),
                    type: Sensortype,
                    fromdate: fromdate,
                    todate: todate,
                    speciesname: SpeciesName
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonGetSponsorExportExcel/",
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
                                        //AssignedData.push({ PID: PIDArray[k].Periods[ids[m]][n].PID, TDate: PIDArray[k].Periods[ids[m]][n].TDate, LocationClass: PIDArray[k].Periods[ids[m]][n].LocationClass, Lat: PIDArray[k].Periods[ids[m]][n].Lat, Long: PIDArray[k].Periods[ids[m]][n].Long, Speed: PIDArray[k].Periods[ids[m]][n].Speed, Altitude: PIDArray[k].Periods[ids[m]][n].Altitude });
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

                        AlertMessages("error", '', currentWidget._i18n.UnabletoFetchRawDataDetails);
                        console.debug(xhr); console.debug(error);
                        $(".Overlay").fadeOut();
                    },
                });

            }
            else {
                
                //var requestData = {
                //    id: Platformid,
                //    type: Sensortype,
                //    fromdate: fromdate,
                //    todate: todate,
                //    speciesname: SpeciesName,
                //    login: (configOptions.UserInfo.UserName == "") ? "/null" : "/" + configOptions.UserInfo.UserName,
                //    password: (configOptions.UserInfo.Password == "") ? "/null" : "/" + configOptions.UserInfo.Password
                //};
                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonGetExportExcel/",
                    type: 'POST', 
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
        getStartEndDates: function () {
            var currentWidget = this;
            $(currentWidget.lblfromdate).css("display", "none");
            $(currentWidget.lbltodate).css("display", "none");
            $(currentWidget.lblDurationtime).css("display", "none");
            var sensorType = $(currentWidget.ddlsensor).val();
            var platformid = $(currentWidget.ddlplatformid).val();
            currentWidget.GetRawDataDownloadExcel();
            if (platformid.length == 1) {
                if (platformid != null) {
                    platformid = platformid.toString();
                }
                if (sensorType != null) {
                    sensorType = sensorType.toString();
                }
                var requestData = {
                    id: platformid,
                    type: sensorType
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JSONStartDateEndDate/" ,
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
                                $(currentWidget.Reportfromdate).val('');
                                $(currentWidget.Reporttodate).val('');
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

        JSONToExcelDownload: function (fileName, data, pids) {
            var currentWidget = this;
            var sensortype = $(currentWidget.ddlsensor).val();
            var speciesname = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val();
            var todate = $(currentWidget.Reporttodate).val();
            var CSV = '';
            var row = "";
            if (speciesname == "") {
                row = sensortype + " : " + fromdate + " - " + todate;
            } else {
                row = sensortype + " - " + speciesname + " - " + fromdate + " - " + todate;
            }

            CSV += row + '@';
            row = "";
            row += "PlatformId,";
            //This loop will extract the label from 1st index of on array

            var Pttidtypes;
            for (var i = 0; i < pids.length; i++) {
                Pttidtypes = pids[i].replace('/', '-');
                //row += pids[i] + ',';
                row += Pttidtypes + ',';
            }
            //row = "";
            //append Label row with line break
            CSV += row + '@';
            row = "";
            for (var i = 0; i < data.length; i++) {
                var row = "";
                row += '"' + data[i].name + '",';
                for (var j = 0; j < data[i].data.length; j++) {
                    row += '"' + data[i].data[j] + '",';
                }
                CSV += row + '@';
            }

            var downloadurl = currentWidget.ServiceUrl + "JSONGetExcelDataReportsDownload1" + "/" + CSV + "/" + fileName;
            $(currentWidget.exportReportsMobile).attr("href", currentWidget.ServiceUrl + "JSONGetExcelDataReportsDownload1" + "/" + CSV + "/" + fileName);


            //var ua = navigator.userAgent;

            //if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android")) {

            //    //var link = document.createElement("a");
            //    //link.href = downloadurl;
            //    //document.body.appendChild(link);
            //    //link.click();
            //    //document.body.removeChild(link);
            //}
        },

        GetRawDataDownloadExcel: function () {
            var currentWidget = this;
            var sensorType = $(currentWidget.ddlsensor).val();
            var speciesname = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val();
            var todate = $(currentWidget.Reporttodate).val();
            var platformid = $(currentWidget.ddlplatformid).val();
            var durationtype = $(currentWidget.ddlDurationtype).val();

            if (platformid == 0) {
                platformid = null;
            }
            if (speciesname == "") {
                speciesname = null;
            }
            if (fromdate == "") {
                fromdate = null;
            }
            if (todate == "") {
                todate = null;
            }

            var ua = navigator.userAgent;
            var checker = {
                iphone: ua.match(/BirdTracking_Ios/),
                blackberry: ua.match(/BlackBerry/),
                android: ua.match(/BirdTracking_Android/)
            };
            if (configOptions.UserInfo.UserRole == "Sponsor") {
                if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android") || checker.android || checker.iphone) {
                    var downloadurl = currentWidget.ServiceUrl + "JsonGetSponsorRawDataDownload" + "/" + sensorType + "/" + speciesname + "/" + fromdate + "/" + todate + "/" + platformid;
                    $(currentWidget.getRawDataMobile).attr("href", downloadurl);
                }
            }
            else {
                if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android") || checker.android || checker.iphone) {
                    var downloadurl = currentWidget.ServiceUrl + "JsonGetExportRawDataDownload" + "/" + sensorType + "/" + speciesname + "/" + fromdate + "/" + todate + "/" + platformid + currentWidget.adduserdetails() + "/" + "RawDataReport.csv";
                    $(currentWidget.getRawDataMobile).attr("href", downloadurl);
                }
            }
        }



    });
});




