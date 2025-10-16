define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/topic',
    "dojo/text!emap/ReportsWidget/templates/ReportsWidget.html",
    "dojo/i18n!emap/ReportsWidget/nls/Resource",
    /* 'xstyle/css!../ReportsWidget/css/ReportsWidget.css',*/
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
        GlobalSensorValue: null,
        lblExcelReportHeading: null,

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
            currentWidget.currentuser = configOptions.UserInfo.UserRole;


            topic.subscribe('Reports/TrackingData', lang.hitch(this, function () {

                currentWidget.getsensortype();
                currentWidget.GetPlatformidsbasedonSensortype();

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
                /*event.stopPropagation();*/


            });
            $(".ReportTabs .nav-link").click(function () {
                $(".ReportTabs .nav-link").removeClass("active");
                $(this).addClass("active");
            });
            /* $(currentWidget.divReports).hide();*/


            $('.ReportsDashLink').click(function () {

                $(".ReportsHideShow").hide();
                $("#ReportMainSec").show();
                $(".CloseContainer").css("display", "block");
                $("#container1").html("");
                currentWidget.ClearControls();


            });

            $('.BacktoDash').click(function () {
                $(this).closest('.ReportsHideShow').hide();
                $("#NewReportWid").fadeIn();
                $(".ReportsHideShow").hide();


                $("#container1").html("");
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
            $(currentWidget.PttsTable).html('');
            $(currentWidget.ddlsensor).html("");
            $(currentWidget.ddlsensor).val("");
            $(currentWidget.ddlSpeciesName).html("");
            $(currentWidget.ddlSpeciesName).val("");
            $(currentWidget.ddlplatformid).html("");
            $(currentWidget.ddlplatformid).val("");
            $(currentWidget.lblSpeciesName).css("display", "none");
            $(currentWidget.lblplatformid).css("display", "none");
            $(currentWidget.ddlDurationtype).val("");
            $(currentWidget.lblfromdate).css("display", "none");
            $(currentWidget.lbltodate).css("display", "none");
            $(currentWidget.lblgreater).css("display", "none");
            $(currentWidget.lblSensortype).css("display", "none");
            $(currentWidget.lblspeciesName).css("display", "none");
            $(currentWidget.MinMaxDates).text(currentWidget._i18n.Reports);
            $(currentWidget.exportReportsMobile).css("display", "none");
            $(currentWidget.exportReports).css("display", "none");

        },


        getsensortype: function () {
            var currentWidget = this;
            $(currentWidget.ddlsensor).SumoSelect({ search: true, selectAll: false, okCancelInMulti: true, placeholder: currentWidget._i18n.placeholderSensorType, forceCustomRendering: true, locale: [currentWidget._i18n.OK, currentWidget._i18n.Cancel, currentWidget._i18n.SelectAll] });
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
                $(currentWidget.ddlsensor).append('<option value="Argos" Selected>Argos</option>');
                $(currentWidget.ddlsensor).append('<option value="GPS">GPS</option>');
                $(currentWidget.ddlsensor).append('<option value="GSM">GSM</option>');
                $(currentWidget.ddlsensor)[0].sumo.reload();
            }
            $(currentWidget.ddlSpeciesName).SumoSelect({ search: true, searchText: 'Enter here.', placeholder: currentWidget._i18n.placeholderSpeciesName });
            $(currentWidget.ddlplatformid).SumoSelect({
                placeholder: currentWidget._i18n.placeholderPTTID, search: true, selectAll: true, okCancelInMulti: true, forceCustomRendering: true, captionFormatAllSelected: ' {0} ' + currentWidget._i18n.SelectedAllItems, captionFormat: ' {0} ' + currentWidget._i18n.SelectedItems, locale: [currentWidget._i18n.OK, currentWidget._i18n.Cancel, currentWidget._i18n.SelectAll],
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
        ExportReport: function () {
            var currentWidget = this;

            currentWidget.JSONToCSVConvertor(currentWidget.reportResults, "Tracking Report", true);
        },
        //ExportReportMobile: function () {
        //    var currentWidget = this;
        //    currentWidget.JSONToExcelDownload(currentWidget.reportResults, "Tracking Report", true);
        //},

        getBirdids: function () {
            var currentWidget = this;
            var token = localStorage.getItem('token'); // Assuming 'token' is the key where your JWT is stored
            var refreshtoken = localStorage.getItem('refreshtoken');

            if (!token) {
                console.error("Token not found in localStorage!");
                return;
            }
            $.ajax({
                url: currentWidget.ServiceUrl + "jsonBirdIds",
                type: 'GET',  // http method
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                crossDomain: true,
                success: function (result) {
                    $(currentWidget.ddlplatformid).html("");

                    var jsonObj = JSON.parse(result.JSONBirdIDsResult);

                    if (jsonObj != null) {
                        for (i = 0; i < jsonObj.length; i++) {
                            if (jsonObj[i].Status == "AC") {
                                var optionValue = $('<option>', {
                                    value: jsonObj[i].PTTD,
                                    html: jsonObj[i].PID + " (AC)"
                                    //text: jsonObj[i].PTTD + " (" + "AC" + ")"
                                });
                                $(currentWidget.ddlplatformid).append(optionValue);
                                
                                
                            }
                            else {
                                var optionValue1 = $('<option>', {
                                    value: jsonObj[i].PTTD,
                                    html: jsonObj[i].PID + " (NA)"
                                    //text: jsonObj[i].PTTD + " (" + "NA" + ")"
                                });
                                $(currentWidget.ddlplatformid).append(optionValue1);
                            }
                        }
                    }
                    $(currentWidget.ddlplatformid).SumoSelect({
                        placeholder: currentWidget._i18n.placeholderPlatFormId, selectAll: true, okCancelInMulti: true, forceCustomRendering: true, locale: [currentWidget._i18n.OK, currentWidget._i18n.Cancel, currentWidget._i18n.SelectAll],
                        renderLi: (li, originalOption) => {
                            // Edit your li here
                            if (li[0].innerText.indexOf("AC") != -1) {
                                $(li).find("label").css("color", "#489D07");
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
                error: function (xhr, error) {
                    AlertMessages("error", '', currentWidget._i18n.Unabletofetchplatformids);
                },
            });

        },
        closeReport: function () {

            $(this).closest(".ManageContainer").show().animate({
                bottom: '-100%'
            }, 20);

            event.stopPropagation();

        },
        JSONToCSVConvertor: function (JSONData, ReportTitle, ShowLabel) {
            var currentWidget = this;
            var SensorType = $(currentWidget.ddlsensor).val();
            var speciesname = $(currentWidget.ddlSpeciesName).val();


            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

            var CSV = '';

            if (ShowLabel) {

                if (speciesname == "") {
                    var row = currentWidget.lblExcelReportHeading;
                } else {
                    var row = speciesname + " - " + currentWidget.lblExcelReportHeading;
                }
                CSV += row + '\r\n';
                var row = "";
                //This loop will extract the label from 1st index of on array
                for (var index in arrData[0]) {
                    if (index == "PTTID") {
                        row += index + ',';
                    }
                    if (SensorType.indexOf(index) == -1) {
                        continue;
                    }
                    else {
                        row += index + ',';
                    }

                    //row += index + ',';
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
                    if (index == "PTTID") {
                        row += '"' + arrData[i][index] + '",';
                    }

                    if (SensorType.indexOf(index) == -1) {
                        continue;
                    }
                    else {
                        row += '"' + arrData[i][index] + '",';
                    }

                    //row += '"' + arrData[i][index] + '",';
                }
                row.slice(0, row.length - 1);

                //add a line break after each row
                CSV += row + '\r\n';
            }


            //Generate a file name
            var fileName = "";
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

        JSONToExcelDownload: function (JSONData, ReportTitle, ShowLabel) {
            var currentWidget = this;
            var SensorType = $(currentWidget.ddlsensor).val();
            var speciesname = $(currentWidget.ddlSpeciesName).val();


            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

            var CSV = '';

            if (ShowLabel) {

                var text = currentWidget.lblExcelReportHeading.replace(":", "-");

                if (speciesname == "") {
                    var row = text;
                } else {
                    var row = speciesname + " - " + text;
                }
                CSV += row + '@';
                var row = "";
                //This loop will extract the label from 1st index of on array
                for (var index in arrData[0]) {
                    if (index == "PTTID") {
                        row += index + ',';
                    }
                    if (SensorType.indexOf(index) == -1) {
                        continue;
                    }
                    else {
                        row += index + ',';
                    }

                    //row += index + ',';
                }

                row = row.slice(0, -1);

                //append Label row with line break
                CSV += row + '@';
            }

            //1st loop is to extract each row
            for (var i = 0; i < arrData.length; i++) {
                var row = "";

                //2nd loop will extract each column and convert it in string comma-seprated
                for (var index in arrData[i]) {
                    if (index == "PTTID") {
                        row += '"' + arrData[i][index] + '",';
                    }

                    if (SensorType.indexOf(index) == -1) {
                        continue;
                    }
                    else {
                        row += '"' + arrData[i][index] + '",';
                    }

                    //row += '"' + arrData[i][index] + '",';
                }
                row.slice(0, row.length - 1);

                //add a line break after each row
                CSV += row + '@';
            }


            //Generate a file name
            var fileName = "";
            //this will remove the blank-spaces from the title and replace it with an underscore
            fileName += ReportTitle.replace(/ /g, "_");

            var downloadurl = currentWidget.ServiceUrl + "JSONGetExcelDataReportsDownload1" + "/" + CSV + "/" + fileName;
            $(currentWidget.exportReportsMobile).attr("href", currentWidget.ServiceUrl + "JSONGetExcelDataReportsDownload1" + "/" + CSV + "/" + fileName);


            //var ua = navigator.userAgent;
            //var checker = {
            //    iphone: ua.match(/BirdTracking_Ios/),
            //    blackberry: ua.match(/BlackBerry/),
            //    android: ua.match(/BirdTracking_Android/)
            //};
            //if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android") || checker.android || checker.iphone) {
            //    var downloadurl = currentWidget.ServiceUrl + "JSONGetExcelDataReportsDownload1" + "/" + CSV + "/" + fileName;
            //    $(currentWidget.exportReportsMobile).attr("href", currentWidget.ServiceUrl + "JSONGetExcelDataReportsDownload1" + "/" + CSV + "/" + fileName);

            //    //var link = document.createElement("a");
            //    //link.href = downloadurl;
            //    //document.body.appendChild(link);
            //    //link.click();
            //    //document.body.removeChild(link);
            //}
        },


        gpsGsmandArgosCountChart: function (results) {
            var currentWidget = this;
            //var pttds = currentWidget.CollectSelectedPtts();
            var ArgosGPSGSMcountLables = [];
            var dataArgos = [];
            var dataGPS = [];
            var dataGSM = [];
            for (var i = 0; i < results.ArgosGPSCount.length; i++) {
                if (jQuery.inArray(results.ArgosGPSCount[i].PID, ArgosGPSGSMcountLables) == -1) {
                    ArgosGPSGSMcountLables.push(results.ArgosGPSCount[i].PID);
                }
            }
            var pttds = ArgosGPSGSMcountLables;
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
            $("#container1").append(chart);

            chart.highcharts({
                chart: {
                    backgroundColor: 'rgba(222,222,222,0)',
                    type: 'column'
                },
                title: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories: pttds,
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
                tooltip: {

                },
                exporting: {
                    accessibility: {
                        enabled: true
                    },
                    filename: "Sensor Type Report",
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

        GetPlatformidsbasedonSensortype: function () {
            var currentWidget = this;
            $(currentWidget.Reportfromdate).val("");
            $(currentWidget.Reporttodate).val("");




            $(currentWidget.lblSensortype).css("display", "none");
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
                if (PID != null) {
                    PID = PID.toString();
                }
                var requestData = {
                    id: PID,
                    type: sensorType.toString(),
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JSONSponsorMultiCommonNames/",
                    type: 'POST',
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        /* $(currentWidget.ddlplatformid).empty();*/
                        $(currentWidget.ddlSpeciesName).html("");
                        $(currentWidget.ddlSpeciesName)[0].sumo.reload();

                        var jsonObj = JSON.parse(result);
                        if (jsonObj != null) {
                            $(currentWidget.ddlSpeciesName).append('<option value=""></option>');
                            var speciesname;
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
                        // var currentWidget = this;
                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchSpeciesnames);
                    },
                });
                if (PID != null) {
                    PID = PID.toString();
                }
                var requestData = {
                    id: PID,
                    type: sensorType.toString()
                 };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JSONSponsorMultiSensorPlatformIds/",
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
                        // var currentWidget = this;
                        AlertMessages('error', '', currentWidget._i18n.Unabletofetchplatformids);
                    },
                });



            }
            else {
                var requestData = {
                    type: sensorType.toString()
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JSONMultiCommonNames/",
                    type: 'POST',  
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        $(currentWidget.ddlSpeciesName).html("");
                        $(currentWidget.ddlSpeciesName)[0].sumo.reload();

                        var jsonObj = JSON.parse(result);
                        if (jsonObj != null) {
                            $(currentWidget.ddlSpeciesName).append('<option value=""></option>');
                            var speciesname;
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
                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchSpeciesnames);
                    },
                });

                var requestData = {
                    type: sensorType.toString()
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JSONMultiSensorPlatformIds/",
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
                        // var currentWidget = this;
                        AlertMessages('error', '', currentWidget._i18n.Unabletofetchplatformids);
                    },
                });
            }

        },
        getPTTDS: function () {
            var currentWidget = this;
            $("#container1").html("");
            $(currentWidget.MinMaxDates).text(currentWidget._i18n.Reports)


            var BirdName = $(currentWidget.ddlSpeciesName).val();
            var sensorType = $(currentWidget.ddlsensor).val();
            currentWidget.GetRawDataDownloadExcel();
            $(".ViewTables").css("display", "none");
            $(".ArgosViewTables").css("display", "none");

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
                if (PID != null) {
                    PID = PID.toString();
                }
                var requestData = {
                    id: PID,
                    type: sensorType,
                    speciesname: BirdName
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonSponsorMultipleIdsbyName/",
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
                        //console.log(result);
                    },
                    error: function (xhr, error) {
                        AlertMessages("error", '', currentWidget._i18n.Unabletofetchplatformids);
                        console.debug(xhr); console.debug(error);
                    },
                });

            }
            else {
                var requestData = {
                    type: sensorType.toString(),
                    speciesname: BirdName
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonMultipleIdsbyName",
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
                        //console.log(result);
                    },
                    error: function (xhr, error) {
                        AlertMessages("error", '', currentWidget._i18n.Unabletofetchplatformids);
                        console.debug(xhr); console.debug(error);
                    },
                });
            }

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

        groupBy1: function (xs, prop) {
            var grouped = {};
            for (var i = 0; i < xs.length; i++) {
                var p = xs[i][prop];
                if (!grouped[p]) { grouped[p] = []; }
                grouped[p].push(xs[i]);
            }
            return grouped;
        },
        getreports: function () {
            var currentWidget = this;
            $(".Overlay").fadeIn();

            $("#container1").show();
            $("#container1").html("");
            $(currentWidget.lblsensortype).css("display", "none");
            $(currentWidget.lblfromdate).hide();
            $(currentWidget.lbltodate).hide();
            $(currentWidget.lblSensortype).hide();

            currentWidget.reportResults = [];
            var sensortype = $(currentWidget.ddlsensor).val();
            var speciesname = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val().trim();
            var todate = $(currentWidget.Reporttodate).val().trim();
            var PlatformId = $(currentWidget.ddlplatformid).val();
            var pids;
            var formIsValid = true;
            if (sensortype == "") {
                $(currentWidget.lblsensortype).css("display", "block");
                formIsValid = false;
            }

            if (fromdate == "") {
                fromdate = null;
            }
            if (todate == "") {
                todate = null;
            }
            if (PlatformId == 0) {
                PlatformId = null;
            }
            if (formIsValid == false) {
                $(".Overlay").fadeOut();
                return;
            }
            if (fromdate != null && todate != null) {
                var isvalid = CheckDatesCompare(fromdate, todate);
                if (isvalid == false) {
                    $(".lblgreater").text(currentWidget._i18n.ToDateshouldbeGreaterthanFromDate);
                    formIsValid = false;
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
                if (PlatformId == null) {
                    pids = PID;
                }
                else {
                    pids = PlatformId;
                }

                //if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android")) {
                //    var downloadurl = currentWidget.ServiceUrl + "JsonGetSponsorRawDataDownload" + "/" + sensortype + "/" + speciesname + "/" + fromdate + "/" + todate + "/" + pids;
                //    $(currentWidget.getRawDataMobile).attr("href", downloadurl);
                //}
            }
            else {
                pids = PlatformId;

                //if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android")) {
                //    var userDetails = currentWidget.adduserdetails();
                //    var downloadurl = currentWidget.ServiceUrl + "JsonGetExportRawDataDownload" + "/" + sensortype + "/" + speciesname + "/" + fromdate + "/" + todate + "/" + pids + userDetails + "/" + "RawDataReport.csv";
                //    $(currentWidget.getRawDataMobile).attr("href", downloadurl);
                //}
            }

            if (fromdate == null && todate == null) {
                minarray = [];
                maxarray = [];
                if (pids != null) {
                    pids = pids.toString();
                }
                var requestData = {
                    id: pids
                  };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonReportsForDates/",
                    type: "POST",
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        report = jQuery.parseJSON(result);
                        var mindate = report[0].MinDate;
                        var maxdate = report[0].MaxDate;
                        var maxdate1 = new Date(maxdate);
                        var maxmonth = String(maxdate1.toLocaleString('default', { month: 'short' }));
                        var maxyear = String(maxdate1.getFullYear()).padStart(0, '0');
                        maxdate1 = maxmonth + '-' + maxyear;

                        var mindate1 = new Date(mindate);
                        var minmonth = String(mindate1.toLocaleString('default', { month: 'short' }));
                        var minyear = String(mindate1.getFullYear()).padStart(0, '0');
                        mindate1 = minmonth + '-' + minyear;

                        $(currentWidget.MinMaxDates).text(currentWidget._i18n.Reports + " : " + mindate1 + " " + currentWidget._i18n.to + " " + maxdate1);
                        currentWidget.lblExcelReportHeading = currentWidget._i18n.Reports + " : " + mindate1 + " " + currentWidget._i18n.to + " " + maxdate1;
                    }
                });
            } else {

                var fromdate = GetFormatedDate($(currentWidget.Reportfromdate).val().trim());
                var fromdate1 = new Date(fromdate);
                var maxmonth = String(fromdate1.toLocaleString('default', { month: 'short' }));
                var maxyear = String(fromdate1.getFullYear()).padStart(0, '0');
                fromdate1 = maxmonth + '-' + maxyear;

                var todate = GetFormatedDate($(currentWidget.Reporttodate).val().trim());
                var todate1 = new Date(todate);
                var minmonth = String(todate1.toLocaleString('default', { month: 'short' }));
                var minyear = String(todate1.getFullYear()).padStart(0, '0');
                todate1 = minmonth + '-' + minyear;
                $(currentWidget.MinMaxDates).text(currentWidget._i18n.Reports + " : " + fromdate1 + " " + currentWidget._i18n.to + " " + todate1);
                currentWidget.lblExcelReportHeading = currentWidget._i18n.Reports + " : " + fromdate1 + " " + currentWidget._i18n.to + " " + todate1;

            }
            if (pids != null) {
                pids = pids.toString();
            }
            var requestData = {
                id: pids,
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
                        //var ptts = currentWidget.CollectSelectedPtts();
                        currentWidget.gpsGsmandArgosCountChart(report);
                        if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android") || checker.android || checker.iphone) {
                            $(currentWidget.exportReportsMobile).css("display", "block");
                            $(currentWidget.exportReports).css("display", "none");
                        }
                        else {
                            $(currentWidget.exportReports).css("display", "block");
                            $(currentWidget.exportReportsMobile).css("display", "none");
                        }
                    }
                    else {
                        AlertMessages(currentWidget._i18n.warning, '', currentWidget._i18n.NoResultsFound);
                        $(".PullRightBut").css("display", "none");
                    }
                    $(".Overlay").fadeOut();

                    if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android") || checker.android || checker.iphone) {
                        currentWidget.JSONToExcelDownload(currentWidget.reportResults, "Tracking Report", true);
                    }
                }

            });

        },

        adduserdetails: function () {
            var retval = (configOptions.UserInfo.UserName == "") ? "/null" : "/" + configOptions.UserInfo.UserName;
            retval += (configOptions.UserInfo.Password == "") ? "/null" : "/" + configOptions.UserInfo.Password;
            return retval;
        },
        getStartEndDates: function () {
            var currentWidget = this;
            $(currentWidget.lblfromdate).css("display", "none");
            $(currentWidget.lbltodate).css("display", "none");
            var sensorType = $(currentWidget.ddlsensor).val();
            var platformid = $(currentWidget.ddlplatformid).val();
            currentWidget.GetRawDataDownloadExcel();
            if (platformid.length == 1 && sensorType.length == 1) {
                if (platformid != null) {
                    platformid = platformid.toString();
                }
                var requestData = {
                    id: platformid,
                    type: sensorType.toString()
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



        RawDataGraph1: function () {
            var currentWidget = this;
            $(".Overlay").fadeIn();
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

            if (fromdate != null && todate != null) {
                var isvalid = CheckDatesCompare(fromdate, todate);
                if (isvalid == false) {
                    $(".lblgreater").css("display", "block");
                    $(".Overlay").fadeOut();
                    return;
                }
            }

            var CheckCount = Sensortype.length;
            var count = 0;
            for (var x = 0; x < Sensortype.length; x++) {
                var Type = Sensortype[x];
                if (Platformid != null) {
                    Platformid = Platformid.toString();
                }
                var requestdata = {
                    id: Platformid,
                    type: Type.toString(),
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
                        pids = pids.toString();
                    }
                    var requestData = {
                        id: pids,
                        type: Type.toString(),
                        fromdate: fromdate,
                        todate: todate,
                        speciesname: SpeciesName
                    };
                    $.ajax({
                        url: currentWidget.ServiceUrl + "JsonGetSponsorExportExcel/",
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
                                            var stype;
                                            if (PIDArray[k].Periods[ids[m]][n].hasOwnProperty("ArgosID") == true) {
                                                stype = "Argos";
                                            }
                                            else if (PIDArray[k].Periods[ids[m]][n].hasOwnProperty("GPSID") == true) {
                                                stype = "GPS";
                                            }
                                            else if (PIDArray[k].Periods[ids[m]][n].hasOwnProperty("GSMID") == true) {
                                                stype = "GSM";
                                            }
                                            
                                            if (Type == "Argos") {
                                                AssignedData.push({ PID: PIDArray[k].Periods[ids[m]][n].PID, TDate: new Date(PIDArray[k].Periods[ids[m]][n].TDate), LocationClass: PIDArray[k].Periods[ids[m]][n].LocationClass, Lat: PIDArray[k].Periods[ids[m]][n].Lat, Long: PIDArray[k].Periods[ids[m]][n].Long, Speed: PIDArray[k].Periods[ids[m]][n].Speed, Altitude: PIDArray[k].Periods[ids[m]][n].Altitude });
                                            }
                                            else {
                                                AssignedData.push({ PID: PIDArray[k].Periods[ids[m]][n].PID, TDate: new Date(PIDArray[k].Periods[ids[m]][n].TDate), Lat: PIDArray[k].Periods[ids[m]][n].Lat, Long: PIDArray[k].Periods[ids[m]][n].Long, Speed: PIDArray[k].Periods[ids[m]][n].Speed, Altitude: PIDArray[k].Periods[ids[m]][n].Altitude });
                                            }
                                        }
                                        SheetArray.push(AssignedData);

                                    }


                                }

                                var result = alasql('SELECT * INTO XLSX("' + stype + 'RawDataReport.xlsx",?) FROM ?',
                                    [opts, SheetArray]);

                            }
                            count++;
                            if (CheckCount == count) {
                                $(".Overlay").fadeOut();
                            }
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
                                            var stype;
                                            if (PIDArray[k].Periods[ids[m]][n].hasOwnProperty("ArgosID") == true) {
                                                stype = "Argos";
                                            }
                                            else if (PIDArray[k].Periods[ids[m]][n].hasOwnProperty("GPSID") == true) {
                                                stype = "GPS";
                                            }
                                            else if (PIDArray[k].Periods[ids[m]][n].hasOwnProperty("GSMID") == true) {
                                                stype = "GSM";
                                            }
                                            if (stype == "Argos") {
                                                if (typeof (PIDArray[k].Periods[ids[m]][n].IQ) != "undefined") {
                                                    AssignedData.push({ PID: PIDArray[k].Periods[ids[m]][n].PID, Date: new Date(PIDArray[k].Periods[ids[m]][n].TDate), LocationClass: PIDArray[k].Periods[ids[m]][n].LocationClass, Lat: PIDArray[k].Periods[ids[m]][n].Lat, Long: PIDArray[k].Periods[ids[m]][n].Long, Altitude: PIDArray[k].Periods[ids[m]][n].Altitude, IQ: PIDArray[k].Periods[ids[m]][n].IQ, NB_MESS: PIDArray[k].Periods[ids[m]][n].NB_Mess, BEST_LEVEL: PIDArray[k].Periods[ids[m]][n].Best_Level, PASS_DURATION: PIDArray[k].Periods[ids[m]][n].Pass_Duration });
                                                }
                                                else {
                                                    AssignedData.push({ PID: PIDArray[k].Periods[ids[m]][n].PID, Date: new Date(PIDArray[k].Periods[ids[m]][n].TDate), LocationClass: PIDArray[k].Periods[ids[m]][n].LocationClass, Lat: PIDArray[k].Periods[ids[m]][n].Lat, Long: PIDArray[k].Periods[ids[m]][n].Long, Altitude: PIDArray[k].Periods[ids[m]][n].Altitude });
                                                }
                                            }
                                            else if (stype == "GPS") {
                                                if (typeof (PIDArray[k].Periods[ids[m]][n].Speed) != "undefined") {
                                                    AssignedData.push({ PID: PIDArray[k].Periods[ids[m]][n].PID, Date: new Date(PIDArray[k].Periods[ids[m]][n].TDate), Time: new Date(PIDArray[k].Periods[ids[m]][n].TTime).toLocaleTimeString(), Lat: PIDArray[k].Periods[ids[m]][n].Lat, Long: PIDArray[k].Periods[ids[m]][n].Long, Speed: PIDArray[k].Periods[ids[m]][n].Speed, Altitude: PIDArray[k].Periods[ids[m]][n].Altitude });
                                                }
                                                else {
                                                    AssignedData.push({ PID: PIDArray[k].Periods[ids[m]][n].PID, Date: new Date(PIDArray[k].Periods[ids[m]][n].TDate), Time: new Date(PIDArray[k].Periods[ids[m]][n].TTime).toLocaleTimeString(), Lat: PIDArray[k].Periods[ids[m]][n].Lat, Long: PIDArray[k].Periods[ids[m]][n].Long });
                                                }
                                            }
                                            else if (stype == "GSM") {
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


                                var result = alasql('SELECT * INTO XLSX("' + stype + 'RawDataReport.xlsx",?) FROM ?',
                                    [opts, SheetArray]);



                            }
                            count++;
                            if (CheckCount == count) {
                                $(".Overlay").fadeOut();
                            }

                        },


                        error: function (xhr, error) {

                            AlertMessages("error", '', currentWidget._i18n.UnabletoFetchRawDataDetails);
                            console.debug(xhr); console.debug(error);
                        },
                    });
                }
            }


        },

        RawDataGraph: function () {
            var currentWidget = this;
            $(".Overlay").fadeIn();
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

            if (fromdate != null && todate != null) {
                var isvalid = CheckDatesCompare(fromdate, todate);
                if (isvalid == false) {
                    $(".lblgreater").css("display", "block");
                    $(".Overlay").fadeOut();
                    return;
                }
            }

            var CheckCount = Sensortype.length;
            var count = 0;
            var opts = [];
            var SheetArray = [];
            var NoResultArray = [];
            var AssignedDataforSpecies = [];
            for (var x = 0; x < Sensortype.length; x++) {
                var Type = Sensortype[x];
                if (Platformid != null) {
                    Platformid = Platformid.toString();
                }
                var requestdata = {
                    id: Platformid,
                    type: Type.toString(),
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
                        pids = pids.toString();
                    }
                    var requestData = {
                        id: pids,
                        type: Type.toString(),
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
                                            var stype;
                                            if (PIDArray[k].Periods[ids[m]][n].hasOwnProperty("ArgosID") == true) {
                                                stype = "Argos";
                                            }
                                            else if (PIDArray[k].Periods[ids[m]][n].hasOwnProperty("GPSID") == true) {
                                                stype = "GPS";
                                            }
                                            else if (PIDArray[k].Periods[ids[m]][n].hasOwnProperty("GSMID") == true) {
                                                stype = "GSM";
                                            }
                                            if (Type == "Argos") {
                                                AssignedData.push({ PID: PIDArray[k].Periods[ids[m]][n].PID, TDate: new Date(PIDArray[k].Periods[ids[m]][n].TDate), LocationClass: PIDArray[k].Periods[ids[m]][n].LocationClass, Lat: PIDArray[k].Periods[ids[m]][n].Lat, Long: PIDArray[k].Periods[ids[m]][n].Long, Speed: PIDArray[k].Periods[ids[m]][n].Speed, Altitude: PIDArray[k].Periods[ids[m]][n].Altitude });
                                            }
                                            else {
                                                AssignedData.push({ PID: PIDArray[k].Periods[ids[m]][n].PID, TDate: new Date(PIDArray[k].Periods[ids[m]][n].TDate), Lat: PIDArray[k].Periods[ids[m]][n].Lat, Long: PIDArray[k].Periods[ids[m]][n].Long, Speed: PIDArray[k].Periods[ids[m]][n].Speed, Altitude: PIDArray[k].Periods[ids[m]][n].Altitude });
                                            }
                                        }
                                        SheetArray.push(AssignedData);

                                    }


                                }

                                var result = alasql('SELECT * INTO XLSX("' + stype + 'RawDataReport.xlsx",?) FROM ?',
                                    [opts, SheetArray]);

                            }
                            count++;
                            if (CheckCount == count) {
                                $(".Overlay").fadeOut();
                            }
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
                        url: currentWidget.ServiceUrl + "JsonGetExportExcelForTrackingReport" + "/",
                        type: 'POST',  // http method
                        crossDomain: true,
                        contentType: 'application/json',
                        data: JSON.stringify(requestdata),
                        success: function (result) {
                            var jsonObj = JSON.parse(result);
                            if (jsonObj.Table1.length <= 0) {
                                AlertMessages("warning", '', currentWidget._i18n.NoResultsFound);
                                count++;
                                if (CheckCount == count) {
                                    $(".Overlay").fadeOut();
                                }
                                return;
                            }
                            if (jsonObj.Table1.length > 0) {
                                var pids = [];

                                var AssignedData = [];

                                if (AssignedDataforSpecies.length <= 0) {
                                    for (var z = 0; z < jsonObj.Table2.length; z++) {
                                        var GSMLastDate = "";
                                        var GPSLastDate = "";
                                        var ArgosLastDate = "";
                                        var Capturedate = "";
                                        var Lastactivedate = "";
                                        var Lastactivedatenongsm = "";
                                        var Updateddate = "";
                                        var Releasedate = "";
                                        var Createdate = "";
                                        var StatusType = "";
                                        var Migration = "";
                                        if (jsonObj.Table2[z].Created_Date != null) {
                                            Createdate = jsonObj.Table2[z].Created_Date.split["T"][0];
                                        }
                                        else {
                                            Createdate = "null";
                                        }
                                        if (jsonObj.Table2[z].LastActiveDate_GSM != null) {
                                            GSMLastDate = jsonObj.Table2[z].LastActiveDate_GSM.split("T")[0];
                                        }
                                        else {
                                            GSMLastDate = "null";
                                        }
                                        if (jsonObj.Table2[z].LastActiveDate_GPS != null) {
                                            GPSLastDate = jsonObj.Table2[z].LastActiveDate_GPS.split("T")[0];
                                        }
                                        else {
                                            GPSLastDate = "null";
                                        }
                                        if (jsonObj.Table2[z].LastActiveDate_Argos != null) {
                                            ArgosLastDate = jsonObj.Table2[z].LastActiveDate_Argos.split("T")[0];
                                        }
                                        else {
                                            ArgosLastDate = "null";
                                        }
                                        if (jsonObj.Table2[z].CaptureDate != null) {
                                            Capturedate = jsonObj.Table2[z].CaptureDate.split("T")[0];
                                        }
                                        else {
                                            Capturedate = "null";
                                        }
                                        if (jsonObj.Table2[z].RelDate != null) {
                                            Releasedate = jsonObj.Table2[z].RelDate.split("T")[0];
                                        }
                                        else {
                                            Releasedate = "null";
                                        }
                                        if (jsonObj.Table2[z].Updated_Date != null) {
                                            Updateddate = jsonObj.Table2[z].Updated_Date.split("T")[0];
                                        }
                                        else {
                                            Updateddate = "null";
                                        }
                                        if (jsonObj.Table2[z].LastActiveDate != null) {
                                            Lastactivedate = jsonObj.Table2[z].LastActiveDate.split("T")[0];
                                        }
                                        else {
                                            Lastactivedate = "null";
                                        }
                                        if (jsonObj.Table2[z].LastActiveDate_NonGSM != null) {
                                            Lastactivedatenongsm = jsonObj.Table2[z].LastActiveDate_NonGSM.split("T")[0];
                                        }
                                        else {
                                            Lastactivedatenongsm = "null";
                                        }


                                        if (jsonObj.Table2[z].Status == "AC") {
                                            StatusType = "Active";
                                        }
                                        else if (jsonObj.Table2[z].Status == "NA") {
                                            StatusType = "InActive"
                                        }

                                        if (jsonObj.Table2[z].MigrationType == "M") {
                                            Migration = "Migratory";
                                        }
                                        else if (jsonObj.Table2[z].MigrationType == "R") {
                                            Migration = "Residential";
                                        }
                                        else if (jsonObj.Table2[z].MigrationType == "D") {
                                            Migration = "Dispersal";
                                        }


                                        AssignedDataforSpecies.push({ SN: jsonObj.Table2[z].SN, PurSN: jsonObj.Table2[z].PurSN, PTTD: jsonObj.Table2[z].PTTD, PTTWeight: jsonObj.Table2[z].PTTWeight_g, Type: jsonObj.Table2[z].Type, SecondaryType: jsonObj.Table2[z].SecondaryType, PurYear: jsonObj.Table2[z].PurYear, BandID: jsonObj.Table2[z].BandID, CaptureDate: Capturedate, RelDate: Releasedate, Lat: jsonObj.Table2[z].Lat, Long: jsonObj.Table2[z].Long, Site: jsonObj.Table2[z].Site, Species: jsonObj.Table2[z].Species, CommonName: jsonObj.Table2[z].CommonName, LatinName: jsonObj.Table2[z].LatinName, CaptureTime: jsonObj.Table2[z].CaptureTime, RelTime: jsonObj.Table2[z].RelTime, Sex: jsonObj.Table2[z].Sex, Age: jsonObj.Table2[z].Age, Weight: jsonObj.Table2[z].Weight_g, Wings: jsonObj.Table2[z].Wings_mm, Bill: jsonObj.Table2[z].Bill_mm, Tarsus: jsonObj.Table2[z].Tarsus_mm, Status: StatusType, LastActiveDate: Lastactivedate, Sensitive: jsonObj.Table2[z].Sensitive, Notes: jsonObj.Table2[z].Notes, LastActiveDate_NonGSM: Lastactivedatenongsm, LastActiveDate_GPS: GPSLastDate, LastActiveDate_Argos: ArgosLastDate, LastActiveDate_GSM: GSMLastDate, Created_By: jsonObj.Table2[z].Created_By, Updated_By: jsonObj.Table2[z].Updated_By, Created_Date: Createdate, Updated_Date: Updateddate, BirdName: jsonObj.Table2[z].BirdName, MigrationType: Migration });

                                    }
                                }
                                var sensorName = "";
                                for (var k = 0; k < jsonObj.Table1.length; k++) {
                                    if (jsonObj.Table1[k].hasOwnProperty("ArgosID") == true) {
                                        sensorName = "Argos";
                                        if (typeof (jsonObj.Table1[k].IQ) != "undefined") {
                                            AssignedData.push({ PID: jsonObj.Table1[k].PLATFORM_ID, Date: new Date(jsonObj.Table1[k].TDATE.split("T")[0]), Time: new Date(jsonObj.Table1[k].TTIME).toLocaleTimeString(), LocationClass: jsonObj.Table1[k].LOC_CLASS, Lat1: jsonObj.Table1[k].LAT1, Lat1_Dir: jsonObj.Table1[k].LAT1_DIR, Long1: jsonObj.Table1[k].LONG1, Long1_Dir: jsonObj.Table1[k].LONG1_DIR, Lat2: jsonObj.Table1[k].LAT2, Lat2_Dir: jsonObj.Table1[k].LAT2_DIR, Long2: jsonObj.Table1[k].LONG2, Long2_Dir: jsonObj.Table1[k].LONG2_DIR, Altitude: jsonObj.Table1[k].ALTITUDE, IQ: jsonObj.Table1[k].IQ, NB_MESS: jsonObj.Table1[k].NB_MESS, NBMESS_120: jsonObj.Table1[k].NBMESS_120, BEST_LEVEL: jsonObj.Table1[k].BEST_LEVEL, S1: jsonObj.Table1[k].S1, S2: jsonObj.Table1[k].S2, S3: jsonObj.Table1[k].S3, S4: jsonObj.Table1[k].S4, S5: jsonObj.Table1[k].S5, S6: jsonObj.Table1[k].S6, S7: jsonObj.Table1[k].S7, S8: jsonObj.Table1[k].S8, S9: jsonObj.Table1[k].S9, S10: jsonObj.Table1[k].S10, S11: jsonObj.Table1[k].S11, S12: jsonObj.Table1[k].S12, S13: jsonObj.Table1[k].S13, S14: jsonObj.Table1[k].S14, S15: jsonObj.Table1[k].S15, S16: jsonObj.Table1[k].S16, S17: jsonObj.Table1[k].S17, S18: jsonObj.Table1[k].S18, S19: jsonObj.Table1[k].S19, S20: jsonObj.Table1[k].S20, S21: jsonObj.Table1[k].S21, S22: jsonObj.Table1[k].S22, S23: jsonObj.Table1[k].S23, S24: jsonObj.Table1[k].S24, S25: jsonObj.Table1[k].S25, S26: jsonObj.Table1[k].S26, S27: jsonObj.Table1[k].S27, S28: jsonObj.Table1[k].S28, S29: jsonObj.Table1[k].S29, S30: jsonObj.Table1[k].S30, S31: jsonObj.Table1[k].S31, S32: jsonObj.Table1[k].S32, PASS_DURATION: jsonObj.Table1[k].PASS_DURATION, NOPC: jsonObj.Table1[k].NOPC, CAL_FRQ: jsonObj.Table1[k].CAL_FRQ, PROJ_ID: jsonObj.Table1[k].PROJ_ID, DISTANCE_KM: jsonObj.Table1[k].DISTANCE_KM, Validated: jsonObj.Table1[k].Validated });
                                        }
                                        else {
                                            AssignedData.push({ PID: jsonObj.Table1[k].PID, Date: new Date(jsonObj.Table1[k].TDate.split("T")[0]), LocationClass: jsonObj.Table1[k].LocationClass, Lat: jsonObj.Table1[k].Lat, Long: jsonObj.Table1[k].Long, Altitude: jsonObj.Table1[k].Altitude });
                                        }
                                    }
                                    else if (jsonObj.Table1[k].hasOwnProperty("GPSID") == true) {
                                        sensorName = "GPS";
                                        if (typeof (jsonObj.Table1[k].SPEED) != "undefined") {
                                            AssignedData.push({ PID: jsonObj.Table1[k].PLATFORM_ID, Date: new Date(jsonObj.Table1[k].GPS_DATE.split("T")[0]), Time: new Date(jsonObj.Table1[k].GPS_TIME).toLocaleTimeString(), Lat: jsonObj.Table1[k].LAT, Long: jsonObj.Table1[k].LONG, Speed: jsonObj.Table1[k].SPEED, Course: jsonObj.Table1[k].COURSE, Altitude: jsonObj.Table1[k].ALT, Validated: jsonObj.Table1[k].Validated });
                                        }
                                        else {
                                            AssignedData.push({ PID: jsonObj.Table1[k].PID, Date: new Date(jsonObj.Table1[k].TDate), Time: new Date(jsonObj.Table1[k].TTime).toLocaleTimeString(), Lat: jsonObj.Table1[k].Lat, Long: jsonObj.Table1[k].Long });
                                        }
                                    }
                                    else if (jsonObj.Table1[k].hasOwnProperty("GSMID") == true) {
                                        sensorName = "GSM";
                                        if (typeof (jsonObj.Table1[k].COURSE) != "undefined") {
                                            AssignedData.push({ PID: jsonObj.Table1[k].PLATFORM_ID, Date: new Date(jsonObj.Table1[k].GSM_DATE.split("T")[0]), Time: new Date(jsonObj.Table1[k].GSM_TIME).toLocaleTimeString(), Lat: jsonObj.Table1[k].LAT, Long: jsonObj.Table1[k].LONG, Speed: jsonObj.Table1[k].SPEED, Course: jsonObj.Table1[k].COURSE, Altitude: jsonObj.Table1[k].ALT, HDOP: jsonObj.Table1[k].HDOP, VDOP: jsonObj.Table1[k].VDOP, Validated: jsonObj.Table1[k].Validated, SCOUNT: jsonObj.Table1[k].SCOUNT, SHOWKML: jsonObj.Table1[k].SHOWKML });
                                        }
                                        else {
                                            AssignedData.push({ PID: jsonObj.Table1[k].PID, Date: new Date(jsonObj.Table1[k].TDate), Time: new Date(jsonObj.Table1[k].TTime).toLocaleTimeString(), Lat: jsonObj.Table1[k].Lat, Long: jsonObj.Table1[k].Long });
                                        }
                                    }
                                }
                                opts.push({ sheetid: sensorName, header: true });
                                SheetArray.push(AssignedData);
                            }
                            count++;
                            if (CheckCount == count) {
                                opts.push({ sheetid: "Species", header: true });
                                SheetArray.push(AssignedDataforSpecies);
                                var result = alasql('SELECT * INTO XLSX("RawDataReport.xlsx",?) FROM ?',
                                    [opts, SheetArray]);
                                $(".Overlay").fadeOut();
                            }

                        },
                        error: function (xhr, error) {

                            AlertMessages("error", '', currentWidget._i18n.UnabletoFetchRawDataDetails);
                            console.debug(xhr); console.debug(error);
                            $(".Overlay").fadeOut();
                        },
                    });

                }
            }


        },
        GetRawDataDownloadExcel: function () {
            var currentWidget = this;
            var sensortype = $(currentWidget.ddlsensor).val();
            var speciesname = $(currentWidget.ddlSpeciesName).val();
            var fromdate = $(currentWidget.Reportfromdate).val().trim();
            var todate = $(currentWidget.Reporttodate).val().trim();
            var PlatformId = $(currentWidget.ddlplatformid).val();

            if (fromdate == "") {
                fromdate = null;
            }
            if (todate == "") {
                todate = null;
            }
            if (speciesname == "") {
                speciesname = null;
            }
            if (PlatformId == 0) {
                PlatformId = null;
            }

            var ua = navigator.userAgent;
            var checker = {
                iphone: ua.match(/BirdTracking_Ios/),
                blackberry: ua.match(/BlackBerry/),
                android: ua.match(/BirdTracking_Android/)
            };
            if (configOptions.UserInfo.UserRole == "Sponsor") {
                if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android") || checker.android || checker.iphone) {
                    var downloadurl = currentWidget.ServiceUrl + "JsonGetSponsorRawDataDownload" + "/" + sensortype + "/" + speciesname + "/" + fromdate + "/" + todate + "/" + PlatformId;
                    $(currentWidget.getRawDataMobile).attr("href", downloadurl);
                }
            }
            else {
                if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android") || checker.android || checker.iphone) {
                    var downloadurl = currentWidget.ServiceUrl + "JsonGetExportRawDataDownload" + "/" + sensortype + "/" + speciesname + "/" + fromdate + "/" + todate + "/" + PlatformId + currentWidget.adduserdetails() + "/" + "RawDataReport.csv";
                    $(currentWidget.getRawDataMobile).attr("href", downloadurl);
                }
            }
        }
    });
});




