define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/topic',
    "dojo/text!emap/MMCWidget/templates/MMCWidget.html",

    "dojo/i18n!emap/MMCWidget/nls/Resource"

], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, topic, dijitTemplate, i18n) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: dijitTemplate,
        widgetsInTemplate: true,
        _i18n: i18n,
        map: null,
        title: i18n.title,
        domNode: null,
        queryResultsWidget: null,
        ServiceUrl: null,
        MMCReportData: null,
        WinteringReportData: null,
        SpringMigrationReportData: null,
        BreedingReportData: null,
        AutumnReportData: null,
        ExportMobileUrls:[],
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
            $(".dateclass").datepicker();


            topic.subscribe('Reports/MMCData', lang.hitch(this, function () {
                currentWidget.getsensortype();
                currentWidget.getSpeciesNames();
                $(".BacktoDash").css("display", "block");
            }));


            $(currentWidget.exportReportsMobile).click(function () {
                var filesForDownload = [];
                filesForDownload.push({ path: $("#MMCReport1").val(), name: "file1.txt" });
                filesForDownload.push({ path: $("#MMCReport2").val(), name: "file2.txt" });
                filesForDownload.push({ path: $("#MMCReport3").val(), name: "file3.txt" });
                filesForDownload.push({ path: $("#MMCReport4").val(), name: "file4.txt" });

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
                            var sanitizedHtml = DOMPurify.sanitize(a);
                            (document.body || document.documentElement).appendChild(sanitizedHtml);
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

            //$(currentWidget.exportReportsMobile).click(function () {
            //    var filesForDownload = [];
            //    var filesForDownload = [];
            //    filesForDownload.push({ path: $("#MMCReport1").val(), name: "file1.txt" });
            //    filesForDownload.push({ path: $("#MMCReport2").val(), name: "file2.txt" });
            //    filesForDownload.push({ path: $("#MMCReport3").val(), name: "file3.txt" });
            //    filesForDownload.push({ path: $("#MMCReport4").val(), name: "file4.txt" });


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
            //});

            $(currentWidget.exportReports).click(function () {
                var Winter = currentWidget.WinteringReportData;
                var Spring = currentWidget.SpringMigrationReportData;
                var Breeding = currentWidget.BreedingReportData;
                var Autumn = currentWidget.AutumnReportData;
                var AllSeasonData = [];
                var SheetArray = [];
                AllSeasonData.push(Winter, Spring, Breeding, Autumn);

                var opts = [{ sheetid: 'Winter Report', header: true }, { sheetid: 'Spring Report', header: false }, { sheetid: 'Summering Report', header: false }, { sheetid: 'Autumn Report', header: false }];

                for (var k = 0; k < AllSeasonData.length; k++) {
                    var DataArray = [];

                    var ids = [];

                    var AssignedData = [];
                    for (var m = 0; m < AllSeasonData[k].length; m++) {

                        var AvgSpeed;
                        var AvgAlt;
                        if (AllSeasonData[k][m].AvgSpeed != null) {
                            AvgSpeed = AllSeasonData[k][m].AvgSpeed
                        }
                        else {
                            AvgSpeed = 0;
                        }
                        if (AllSeasonData[k][m].AvgAlt != null) {
                            AvgAlt = AllSeasonData[k][m].AvgAlt;
                        }
                        else {
                            AvgAlt = 0;
                        }

                        var Distance = currentWidget.calculateLatLongValues(AllSeasonData[k][m].MaxLat, AllSeasonData[k][m].MaxLong, AllSeasonData[k][m].MinLat, AllSeasonData[k][m].MinLong);
                        if (k == 0 || k == 2) {
                            AssignedData.push({
                                "PlatformID": AllSeasonData[k][m].PlatformId, "ArrivalDate": AllSeasonData[k][m].StartDate, "DepartureDate": AllSeasonData[k][m].EndDate, "Duration (Days)": AllSeasonData[k][m].Duration, "AvgSpeed (Kt)": AvgSpeed, "AvgAltitude (Meter)": AvgAlt, "Distance (Km)": Distance, "Locations": AllSeasonData[k][m].Locations
                            });

                        } else {
                            AssignedData.push({
                                "PlatformID": AllSeasonData[k][m].PlatformId, "StartDate": AllSeasonData[k][m].StartDate, "EndDate": AllSeasonData[k][m].EndDate, "Duration (Days)": AllSeasonData[k][m].Duration, "AvgSpeed (Kt)": AvgSpeed, "AvgAltitude (Meter)": AvgAlt, "Distance (Km)": Distance, "Locations": AllSeasonData[k][m].Locations
                            });
                        }
                    }

                    if (AssignedData != 0) {
                        SheetArray.push(AssignedData);
                    }


                }

                var result = alasql('SELECT * INTO XLSX("MMC_Report.xlsx",?) FROM ?',
                    [opts, SheetArray]);

            });

            $('.ReportsDashLink').click(function () {

                $(".ReportsHideShow").hide();
                $("#ReportMainSec").fadeIn();
                $("#NewReportWid").fadeIn();
                $(".CloseContainer").css("display", "block");
                $(currentWidget.WinteringAreaTable).html('');
                $(currentWidget.BreedingArea).html('');
                $(currentWidget.SpringMigration).html('');
                $(currentWidget.AutumnMigration).html('');
                currentWidget.ClearControls();
            });
            $('.BacktoDash').click(function () {
                $(this).closest('.ReportsHideShow').hide();
                $("#NewReportWid").fadeIn();
                $(".ReportsHideShow").hide();


                $(currentWidget.WinteringAreaTable).html('');
                $(currentWidget.BreedingArea).html('');
                $(currentWidget.SpringMigration).html('');
                $(currentWidget.AutumnMigration).html('');
                currentWidget.ClearControls();
                $(".CloseContainer").css("display", "block");
            });
        },

        startup: function () {
            var currentWidget = this;
        },
        ClearLabels: function () {
            var currentWidget = this;
            $(currentWidget.ddlSpeciesName).val("");
            $(currentWidget.ddlSpeciesName).html("");
            $(currentWidget.ddlSensorType).html("");
            $(currentWidget.ddlSensorType).val("");
            $(currentWidget.fromdate).val("");
            $(currentWidget.todate).val("");
            $(currentWidget.ddlPlatformID).html("");
            $(currentWidget.ddlPlatformID).val("");
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

        ClearControls: function () {
            var currentWidget = this;
            $(currentWidget.ddlSensorType).val("");
            $(currentWidget.ddlPlatformID).val("");
            $(currentWidget.ddlSpeciesName).val("");
            $(currentWidget.ddlSpeciesName).html("");
            $(currentWidget.ddlSpeciesName)[0].sumo.reload();
            $(currentWidget.ddlSensorType)[0].sumo.reload();
            $(currentWidget.ddlPlatformID).html("");
            $(currentWidget.ddlPlatformID)[0].sumo.reload();
            $(currentWidget.fromdate).val("");
            $(currentWidget.todate).val("");
            $(currentWidget.lblSensortName).css("display", "none");
            $(currentWidget.lblPlatformId).css("display", "none");
            $(currentWidget.lblfromdate).css("display", "none");
            $(currentWidget.lbltodate).css("display", "none");
            $(currentWidget.lblgreater).css("display", "none");
            $(currentWidget.lblSpeciesName).css("display", "none");
            $(currentWidget.exportReports).css("display", "none");
            $(currentWidget.exportReportsMobile).css("display", "none");
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
        getbirdnames: function () {
            var currentWidget = this;
            $.ajax({
                url: currentWidget.ServiceUrl + "jsonCommonNames",
                type: 'GET',  // http method
                crossDomain: true,
                success: function (result) {
                    $(currentWidget.ddlSpeciesName).append('<option value=""></option>');
                    var jsonObj = JSON.parse(result.JSONCommonNamesResult);
                    if (jsonObj != null) {
                        var speciesname;
                        for (i = 0; i < jsonObj.length; i++) {

                            speciesname = currentWidget.ConvertToTitleCase(jsonObj[i].COMMONNAME);
                            var optionValue = $('<option>', {
                                value: speciesname,
                                text: speciesname
                            });
                            $(currentWidget.ddlSpeciesName).append(optionValue);
                            

                        }
                    }
                    $(currentWidget.ddlSpeciesName).SumoSelect({ search: true, searchText: 'Enter here.', placeholder: currentWidget._i18n.placeholderSpeciesName });
                },
                error: function (xhr, error) {
                    AlertMessages("error", '', currentWidget._i18n.Unabletofetchbirdnames);

                    console.debug(xhr); console.debug(error);
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
        getSpeciesNames: function () {
            var currentWidget = this;
            $.ajax({
                url: currentWidget.ServiceUrl + "jsonCommonNames",
                type: 'GET',  // http method
                crossDomain: true,
                success: function (result) {
                    $(currentWidget.ddlSpeciesName).append('<option value=""></option>');
                    var jsonObj = JSON.parse(result.JSONCommonNamesResult);
                    if (jsonObj != null) {
                        var speciesname;
                        for (i = 0; i < jsonObj.length; i++) {
                            speciesname = currentWidget.ConvertToTitleCase(jsonObj[i].COMMONNAME);
                            var optionValue = $('<option>', {
                                value: speciesname,
                                text: speciesname
                            });
                            $(currentWidget.ddlSpeciesName).append(optionValue);
                            
                        }
                    }
                    //$(currentWidget.ddlSpeciesName).SumoSelect({ search: true, placeholder: currentWidget._i18n.placeholderSpeciesName });
                    $(currentWidget.ddlSpeciesName)[0].sumo.reload();
                },
                error: function (xhr, error) {
                    AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdNamesDetails);
                },
            });
        },
        getsensortype: function () {
            var currentWidget = this;
            $(currentWidget.ddlSensorType).SumoSelect({ search: true, searchText: 'Enter here.', placeholder: currentWidget._i18n.placeholderSensorType, forceCustomRendering: true });
            $(currentWidget.ddlSensorType).empty();
            if (configOptions.UserInfo.UserRole == "Sponsor") {
                var sensortype = [];
                var PID = [];
                var IDwithSensor = configOptions.SponsorandPublicID;
                for (var i = 0; i < IDwithSensor.length; i++) {
                    var splitData = IDwithSensor[i].split("-");

                    sensortype.push(splitData[1]);
                    PID.push(splitData[0]);
                }
                $(currentWidget.ddlSensorType).append('<option value=""></option>');
                if (sensortype.includes("Argos") == true) {
                    $(currentWidget.ddlSensorType).append('<option value="Argos">Argos</option>');
                }
                if (sensortype.includes("GPS") == true) {
                    $(currentWidget.ddlSensorType).append('<option value="GPS">GPS</option>');
                }
                if (sensortype.includes("GSM") == true) {
                    $(currentWidget.ddlSensorType).append('<option value="GSM">GSM</option>');
                }

                $(currentWidget.ddlSensorType)[0].sumo.reload();
            }
            else {
                $(currentWidget.ddlSensorType).append('<option value=""></option>');
                $(currentWidget.ddlSensorType).append('<option value="Argos">Argos</option>');
                $(currentWidget.ddlSensorType).append('<option value="GPS">GPS</option>');
                $(currentWidget.ddlSensorType).append('<option value="GSM">GSM</option>');
                $(currentWidget.ddlSensorType)[0].sumo.reload();
            }
            $(currentWidget.ddlSpeciesName).SumoSelect({ search: true, searchText: 'Enter here.', placeholder: currentWidget._i18n.placeholderSpeciesName });

            $(currentWidget.ddlPlatformID).SumoSelect({
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
                    //console.log(li);
                    // console.log("org",originalOption);
                    return li;
                }
            });
        },
        ClearDropdownlabels: function () {
            var currentWidget = this;
            $(currentWidget.ddlSensorType).val("");
            $(currentWidget.ddlPlatformID).val("");
            $(currentWidget.ddlSensorType)[0].sumo.reload();
            $(currentWidget.ddlplatformid).html("");
            $(currentWidget.ddlPlatformID)[0].sumo.reload();
            $(currentWidget.fromdate).val("");
            $(currentWidget.todate).val("");
            $(currentWidget.lblSensortName).css("display", "none");
            $(currentWidget.lblPlatformId).css("display", "none");
            $(currentWidget.lblfromdate).css("display", "none");
            $(currentWidget.lbltodate).css("display", "none");
            $(currentWidget.lblgreater).css("display", "none");
            $(currentWidget.lblSpeciesName).css("display", "none");
        },
        getPlatformIds: function () {
            var currentWidget = this;
            $(currentWidget.ddlPlatformID).val("");
            $(currentWidget.ddlplatformid).html("");
            $(currentWidget.ddlPlatformID)[0].sumo.reload();
            $(currentWidget.ddlSpeciesName).val("");
            $(currentWidget.ddlSpeciesName).html("");
            $(currentWidget.ddlSpeciesName)[0].sumo.reload();
            $(currentWidget.fromdate).val("");
            $(currentWidget.todate).val("");
            $(currentWidget.lblSensortName).css("display", "none");
            $(currentWidget.lblPlatformId).css("display", "none");
            $(currentWidget.lblfromdate).css("display", "none");
            $(currentWidget.lbltodate).css("display", "none");
            $(currentWidget.lblgreater).css("display", "none");
            $(currentWidget.lblSpeciesName).css("display", "none");


            var speciesName = $(currentWidget.ddlSpeciesName).val();
            var sensorType = $(currentWidget.ddlSensorType).val();
            if (sensorType == "") {
                return;
            }

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
                    id: PID,
                    type: sensorType
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JSONDistinctSponsorCommonNames/" ,
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
                            for (i = 0; i < jsonObj.length; i++) {
                                var optionValue = $('<option>', {
                                    value: jsonObj[i].CommonName,
                                    text: jsonObj[i].CommonName
                                });
                                $(currentWidget.ddlSpeciesName).append(optionValue);
                                
                            }
                        }
                        $(currentWidget.ddlSpeciesName)[0].sumo.reload();


                    },
                    error: function (xhr, error) {
                        var currentWidget = this;
                        AlertMessages("error", '', currentWidget._i18n.Unabletofetchbirdnames);
                    },
                });

                var requestData = {
                    id: PID,
                    type: sensorType
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JSONDistinctSponsorPlatformIds/",
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        /* $(currentWidget.ddlplatformid).empty();*/
                        $(currentWidget.ddlPlatformID).html("");
                        $(currentWidget.ddlPlatformID)[0].sumo.reload();

                        var jsonObj = JSON.parse(result);
                        if (jsonObj != null) {
                            $(currentWidget.ddlPlatformID).append('<option value=""></option>');
                            for (i = 0; i < jsonObj.length; i++) {
                                if (jsonObj[i].Status == "AC") {
                                    var optionValue = $('<option>', {
                                        value: jsonObj[i].PID,
                                        html: jsonObj[i].PID + " (AC)"
                                        //text: jsonObj[i].PID + " (" + "AC" + ")"
                                    });
                                    $(currentWidget.ddlPlatformID).append(optionValue);
                                    
                                }
                                else {
                                    var optionValue1 = $('<option>', {
                                        value: jsonObj[i].PID,
                                        html: jsonObj[i].PID + " (NA)"
                                        //text: jsonObj[i].PID + " (" + "NA" + ")"
                                    });
                                    $(currentWidget.ddlPlatformID).append(optionValue1);
                                    
                                }
                            }
                        }
                        $(currentWidget.ddlPlatformID)[0].sumo.reload();

                    },
                    error: function (xhr, error) {
                        AlertMessages('error', '', currentWidget._i18n.Unabletofetchplatformids);
                    },
                });



            }
            else {
                var requestData = {
                    type: sensorType
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JSONDistinctCommonNames/",
                    type: 'GET',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        $(currentWidget.ddlSpeciesName).html("");
                        $(currentWidget.ddlSpeciesName)[0].sumo.reload();

                        var jsonObj = JSON.parse(result);
                        if (jsonObj != null) {
                            $(currentWidget.ddlSpeciesName).append('<option value=""></option>');
                            for (i = 0; i < jsonObj.length; i++) {
                                var optionValue = $('<option>', {
                                    value: jsonObj[i].CommonName,
                                    text: jsonObj[i].CommonName
                                });
                                $(currentWidget.ddlSpeciesName).append(optionValue);
                                
                            }
                        }
                        $(currentWidget.ddlSpeciesName)[0].sumo.reload();


                    },
                    error: function (xhr, error) {
                        var currentWidget = this;
                        AlertMessages("error", '', currentWidget._i18n.Unabletofetchbirdnames);
                    },
                });

                var requestData = {
                    type: sensorType
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JSONDistinctPlatformIds/",
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        /* $(currentWidget.ddlplatformid).empty();*/
                        $(currentWidget.ddlPlatformID).html("");
                        $(currentWidget.ddlPlatformID)[0].sumo.reload();

                        var jsonObj = JSON.parse(result);
                        if (jsonObj != null) {
                            $(currentWidget.ddlPlatformID).append('<option value=""></option>');
                            for (i = 0; i < jsonObj.length; i++) {
                                if (jsonObj[i].Status == "AC") {
                                    var optionValue = $('<option>', {
                                        value: jsonObj[i].PID,
                                        html: jsonObj[i].PID + " (AC)"
                                        //text: jsonObj[i].PID + " (" + "AC" + ")"
                                    });
                                    $(currentWidget.ddlPlatformID).append(optionValue);
                                    
                                }
                                else {
                                    var optionValue1 = $('<option>', {
                                        value: jsonObj[i].PID,
                                        html: jsonObj[i].PID + " (NA)"
                                        //text: jsonObj[i].PID + " (" + "NA" + ")"
                                    });
                                    $(currentWidget.ddlPlatformID).append(optionValue1);
                                   
                                }
                            }
                        }
                        $(currentWidget.ddlPlatformID)[0].sumo.reload();

                    },
                    error: function (xhr, error) {
                        AlertMessages('error', '', currentWidget._i18n.Unabletofetchplatformids);
                    },
                });
            }

        },
        getPTTDS: function () {
            var currentWidget = this;
            $(currentWidget.fromdate).val("");
            $(currentWidget.todate).val("");
            $(currentWidget.lblSensortName).css("display", "none");
            $(currentWidget.lblSpeciesName).css("display", "none");
            $(currentWidget.lblSensortype).css("display", "none");
            var BirdName = $(currentWidget.ddlSpeciesName).val();
            var sensorType = $(currentWidget.ddlSensorType).val();
            var fromdate = $(currentWidget.fromdate).val();
            var todate = $(currentWidget.todate).val();
            $(currentWidget.ddlPlatformID).val("");
            //$(currentWidget.ddlPlatformID)[0].sumo.reload();
            var formIsValid = true;
            if (BirdName == "") {
                $(currentWidget.ddlSpeciesName).css("display", "block");
                formIsValid = false;
            }
            if (sensorType == "") {
                $(currentWidget.lblSensortype).css("display", "block");
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
                    id: PID,
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
                        $(currentWidget.ddlPlatformID).html("");
                        $(currentWidget.ddlPlatformID)[0].sumo.reload();
                        var jsonObj = JSON.parse(result);
                        if (jsonObj != null) {
                            for (i = 0; i < jsonObj.length; i++) {
                                if (jsonObj[i].Status == "AC") {
                                    var optionValue = $('<option>', {
                                        value: jsonObj[i].PID,
                                        html: jsonObj[i].PID + " (AC)"
                                        //html: jsonObj[i].PID + " (" + "AC" + ")"
                                    });
                                    $(currentWidget.ddlPlatformID).append(optionValue);
                                    
                                }
                                else {
                                    var optionValue1 = $('<option>', {
                                        value: jsonObj[i].PID,
                                        html: jsonObj[i].PID + " (NA)"
                                        //text: jsonObj[i].PID + " (" + "NA" + ")"
                                    });
                                    $(currentWidget.ddlPlatformID).append(optionValue1);
                                    
                                }

                            }
                        }
                        $(currentWidget.ddlplatformid)[0].sumo.reload();
                    },
                    error: function (xhr, error) {

                        AlertMessages("error", '', currentWidget._i18n.Unabletofetchplatformids);

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
                        $(currentWidget.ddlPlatformID).html("");
                        $(currentWidget.ddlPlatformID)[0].sumo.reload();
                        var jsonObj = JSON.parse(result);
                        if (jsonObj != null) {
                            $(currentWidget.ddlPlatformID).append('<option value=""></option>');
                            for (i = 0; i < jsonObj.length; i++) {
                                if (jsonObj[i].Status == "AC") {
                                    var optionValue = $('<option>', {
                                        value: jsonObj[i].PID,
                                        html: jsonObj[i].PID + " (AC)"
                                        //text: jsonObj[i].PID + " (" + "AC" + ")"
                                    });
                                    $(currentWidget.ddlPlatformID).append(optionValue);
                                    
                                }
                                else {
                                    var optionValue1 = $('<option>', {
                                        value: jsonObj[i].PID,
                                        html: jsonObj[i].PID + " (NA)"
                                        //text: jsonObj[i].PID + " (" + "NA" + ")"
                                    });
                                    $(currentWidget.ddlPlatformID).append(optionValue1);
                                    
                                }

                            }
                        }
                        $(currentWidget.ddlPlatformID)[0].sumo.reload();



                    },
                    error: function (xhr, error) {

                        AlertMessages("error", '', currentWidget._i18n.Unabletofetchplatformids);

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

        getStartEndDates: function () {
            var currentWidget = this;
            $(currentWidget.lblPlatformId).css("display", "none");
            $(currentWidget.lblfromdate).css("display", "none");
            $(currentWidget.lbltodate).css("display", "none");
            var sensorType = $(currentWidget.ddlSensorType).val();
            var platformid = $(currentWidget.ddlPlatformID).val();
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
                            $(currentWidget.fromdate).val(startdate);
                            $(currentWidget.todate).val(enddate);
                        }
                        else {
                            $(currentWidget.fromdate).val('');
                            $(currentWidget.todate).val('');
                        }
                    }
                },
                error: function (xhr, error) {
                    AlertMessages("error", '', currentWidget._i18n.Unabletofetchplatformids);
                    console.debug(xhr); console.debug(error);
                },
            });

        },
        ClearLabelfromdate: function () {
            var currentWidget = this;
            $(currentWidget.lblfromdate).css("display", "none");
        },
        ClearLabeltodate: function () {
            var currentWidget = this;
            $(currentWidget.lbltodate).css("display", "none");
            $(currentWidget.lblgreater).css("display", "none");
        },
        getReporthtml: function (table, season) {
            var currentWidget = this;
            if (season == "Wintering Duration" || season == "Summering Duration") {
                var tblhtml = '<thead><tr><th style="width:12%">' + currentWidget._i18n.PlatformID + '</th>';
                tblhtml += '<th>' + currentWidget._i18n.ArrivalDate + '</th>';
                tblhtml += '<th>' + currentWidget._i18n.DepartureDate + '</th>';
                tblhtml += '<th>' + currentWidget._i18n.Duration + '</th>';
                tblhtml += '<th>' + currentWidget._i18n.AverageSpeed + '</th>';
                tblhtml += '<th>' + currentWidget._i18n.AverageAltitude + '</th>';
                tblhtml += '<th>' + currentWidget._i18n.Distance + '</th>';
                tblhtml += '<th>' + currentWidget._i18n.Locations + '</th></thead><tbody>';
            }
            else if (season == "Spring Migration" || season == "Autumn Migration") {
                var tblhtml = '<thead><tr><th style="width:12%">' + currentWidget._i18n.PlatformID + '</th>';
                tblhtml += '<th>' + currentWidget._i18n.MigrationStartDate + '</th>';
                tblhtml += '<th>' + currentWidget._i18n.MigrationEndDate + '</th>';
                tblhtml += '<th>' + currentWidget._i18n.Duration + '</th>';
                tblhtml += '<th>' + currentWidget._i18n.AverageSpeed + '</th>';
                tblhtml += '<th>' + currentWidget._i18n.AverageAltitude + '</th>';
                tblhtml += '<th>' + currentWidget._i18n.Distance + '</th>';
                tblhtml += '<th>' + currentWidget._i18n.Locations + '</th></thead><tbody>';
            }

            for (var i = 0; i < table.length; i++) {
                tblhtml += "<tr><td>" + table[i].PlatformId + "</td>";
                tblhtml += "<td>" + table[i].StartDate + "</td>";
                tblhtml += "<td>" + table[i].EndDate + "</td>";
                tblhtml += "<td>" + table[i].Duration + "</td>";

                if (table[i].AvgSpeed != null) {
                    tblhtml += "<td>" + table[i].AvgSpeed + "</td>";
                }
                else {
                    tblhtml += "<td>" + 0 + "</td>";
                }
                if (table[i].AvgAlt != null) {
                    tblhtml += "<td>" + table[i].AvgAlt + "</td>";
                }
                else {
                    tblhtml += "<td>" + 0 + "</td>";
                }
                var Distance = currentWidget.calculateLatLongValues(table[i].MaxLat, table[i].MaxLong, table[i].MinLat, table[i].MinLong);
                tblhtml += "<td>" + Distance.toFixed(2) + "</td>";

                tblhtml += "<td>" + table[i].Locations + "</td></tr>";
            }
            tblhtml += '</tbody>';
            return tblhtml;
        },
        UpdateMigrationValues: function (fromdate, todate, migrationvalue) {


            var currentWidget = this;
            var sensor = $(currentWidget.ddlSensorType).val();
            var pid = $(currentWidget.ddlPlatformID).val();
            var fromtime = "00:00:00";
            var totime = "23:59:00";
            var Ftime = fromtime.replace(":", "Column").replace(":", "Column");
            var Ttime = totime.replace(":", "Column").replace(":", "Column");

            var data = pid + "/" + fromdate + "/" + todate + "/" + Ftime + "/" + Ttime + "/" + migrationvalue;
            var requestData = {
                id: pid,
                type: sensor,
                fromdate: fromdate,
                todate: todate,
                fromtime: Ftime,
                totime: Ttime,
                MigrationType: migrationvalue
            };
            $.ajax({
                url: currentWidget.ServiceUrl + "JsonUpdateMigrationStatus/",
                type: 'POST',  // http method
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {
                    var jsonObj = JSON.parse(result);

                    if (jsonObj == "Success") {

                        return;

                    }
                    else if (jsonObj == "failed") {

                        return;
                    }

                },

                error: function (xhr, error) {

                    AlertMessages('error', '', currentWidget._i18n.ErrorinUpdate);
                },

            });
        },
        generateReport: function () {
            var currentWidget = this;
            $(".Overlay").fadeIn();
            var speciesName = $(currentWidget.ddlSpeciesName).val();
            var sensorType = $(currentWidget.ddlSensorType).val();
            var fromdate = $(currentWidget.fromdate).val();
            var todate = $(currentWidget.todate).val();
            var platformId = $(currentWidget.ddlPlatformID).val();
            $(currentWidget.lblSpeciesName).css("display", "none");
            $(currentWidget.lblSensortName).css("display", "none");
            $(currentWidget.lblfromdate).css("display", "none");
            $(currentWidget.lbltodate).css("display", "none");
            $(currentWidget.lblgreater).css("display", "none");
            $(currentWidget.lblPlatformId).css("display", "none");


            var ua = navigator.userAgent;
            var checker = {
                iphone: ua.match(/BirdTracking_Ios/),
                blackberry: ua.match(/BlackBerry/),
                android: ua.match(/BirdTracking_Android/)
            };
            var pgDir = document.getElementsByTagName('html');

            if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android") || checker.android || checker.iphone) {
                $(currentWidget.exportReportsMobile).css("display", "block");
                $(currentWidget.exportReports).css("display", "none");
            }
            else {
                $(currentWidget.exportReports).css("display", "block");
                $(currentWidget.exportReportsMobile).css("display", "none");
            }

            if ($(window).width() <= 800) {
                //$(currentWidget.exportReportsMobile).css("display", "block");
                //$(currentWidget.exportReports).css("display", "none");
                if (pgDir[0].dir == 'rtl' || pgDir[0].style.direction == 'rtl') {
                    $(currentWidget.exportReports).removeClass("PullRightBut");
                    $(currentWidget.exportReports).css("float", "left");
                    $(currentWidget.exportReports).css("margin-right", "auto");

                    $(currentWidget.exportReportsMobile).removeClass("PullRightBut");
                    $(currentWidget.exportReportsMobile).css("float", "left");
                    $(currentWidget.exportReportsMobile).css("margin-right", "auto");
                }
                else {
                    $(currentWidget.exportReports).removeClass("PullRightBut");
                    $(currentWidget.exportReports).css("float", "right");
                    $(currentWidget.exportReports).css("margin-left", "auto");

                    $(currentWidget.exportReportsMobile).removeClass("PullRightBut");
                    $(currentWidget.exportReportsMobile).css("float", "right");
                    $(currentWidget.exportReportsMobile).css("margin-left", "auto");
                }

            }
            else {
                //$(currentWidget.exportReports).css("display", "block");
                $(currentWidget.exportReports).addClass("PullRightBut");
                //$(currentWidget.exportReportsMobile).css("display", "none");
            }

            var pids;
            var formIsValid = true;

            if (speciesName == "") {
                $(currentWidget.lblSpeciesName).css("display", "block");
                formIsValid = false;
            }

            if (sensorType == "") {
                $(currentWidget.lblSensortName).css("display", "block");
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



            if (platformId == "") {
                $(currentWidget.lblPlatformId).css("display", "block");
                formIsValid = false;
            }

            if (formIsValid == false) {
                $(".Overlay").fadeOut();
                return;
            }

            if (fromdate != "") {
                var startdate = fromdate.split("-").reverse().join("");
            }
            if (todate != "") {
                var enddate = todate.split("-").reverse().join("");
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
                if (platformId == null) {
                    pids = PID;
                }
                else {
                    pids = platformId;
                }

            }
            else {
                pids = platformId;
            }
            var requestData = {
                id: pids,
                type: sensorType,
                fromdate: startdate,
                todate: enddate
            };
            var url = currentWidget.ServiceUrl + "JSONGenerateMMCReport/";
            // $(".Overlay").fadeIn();
            $.ajax({
                url: url,
                type: 'POST',
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {

                    currentWidget.WinteringReportData = [];
                    currentWidget.SpringMigrationReportData = [];
                    currentWidget.BreedingReportData = [];
                    currentWidget.AutumnReportData = [];

                    $(currentWidget.WinteringAreaTable).html('');
                    $(currentWidget.BreedingArea).html('');
                    $(currentWidget.SpringMigration).html('');
                    $(currentWidget.AutumnMigration).html('');
                    if (result != 'null' && result != '') {
                        currentWidget.MMCReportData = JSON.parse(JSON.parse(result));
                        currentWidget.WinteringReportData = currentWidget.MMCReportData.Table;
                        currentWidget.SpringMigrationReportData = currentWidget.MMCReportData.Table1;
                        currentWidget.BreedingReportData = currentWidget.MMCReportData.Table2;
                        currentWidget.AutumnReportData = currentWidget.MMCReportData.Table3;
                        var enableExport = false;
                        if (currentWidget.MMCReportData != null) {
                            if (currentWidget.WinteringReportData.length > 0) {
                                //WinteringAreaTable

                                $(currentWidget.WinteringAreaTable).html('');
                                $(currentWidget.WinteringAreaTable).append(currentWidget.getReporthtml(currentWidget.WinteringReportData, "Wintering Duration"));
                                enableExport = true;
                            }
                            else {
                                $(currentWidget.WinteringAreaTable).append(currentWidget.getNoDatafoundMsg());
                            }

                            if (currentWidget.SpringMigrationReportData.length > 0) {
                                //SpringMigration
                                $(currentWidget.SpringMigration).html('');
                                $(currentWidget.SpringMigration).append(currentWidget.getReporthtml(currentWidget.SpringMigrationReportData, "Spring Migration"));
                                enableExport = true;
                            }
                            else {
                                $(currentWidget.SpringMigration).append(currentWidget.getNoDatafoundMsg());
                            }

                            if (currentWidget.BreedingReportData.length > 0) {
                                //BreedingArea
                                $(currentWidget.BreedingArea).html('');
                                $(currentWidget.BreedingArea).append(currentWidget.getReporthtml(currentWidget.BreedingReportData, "Summering Duration"));
                                enableExport = true;
                            }
                            else {
                                $(currentWidget.BreedingArea).append(currentWidget.getNoDatafoundMsg());
                            }

                            if (currentWidget.AutumnReportData.length > 0) {
                                //AutumnMigration
                                $(currentWidget.AutumnMigration).html('');
                                $(currentWidget.AutumnMigration).append(currentWidget.getReporthtml(currentWidget.AutumnReportData, "Autumn Migration"));
                                enableExport = true;
                            }
                            else {
                                $(currentWidget.AutumnMigration).append(currentWidget.getNoDatafoundMsg());
                            }
                        }
                        if (enableExport) {
                            $(currentWidget.exportReports).removeAttr('disabled');
                            //currentWidget = this;

                            if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android") || checker.android || checker.iphone) {
                                currentWidget.JSONToWinterExcelDownload(currentWidget.WinteringReportData, "MMC_WinterReport");
                                currentWidget.JSONToSpringExcelDownload(currentWidget.SpringMigrationReportData, "MMC_SpringReport");
                                currentWidget.JSONToSummerExcelDownload(currentWidget.BreedingReportData, "MMC_BreedingReport");
                                currentWidget.JSONToAutumnExcelDownload(currentWidget.AutumnReportData, "MMC_AutumnReport");
                            }
                        }
                        else {
                            $(currentWidget.exportReports).attr('disabled', 'disabled');

                            $(currentWidget.WinteringAreaTable).append(currentWidget.getNoDatafoundMsg());
                            $(currentWidget.SpringMigration).append(currentWidget.getNoDatafoundMsg());
                            $(currentWidget.BreedingArea).append(currentWidget.getNoDatafoundMsg());
                            $(currentWidget.AutumnMigration).append(currentWidget.getNoDatafoundMsg());
                        }

                    }
                    else {
                        $(currentWidget.exportReports).attr('disabled', 'disabled');

                        $(currentWidget.WinteringAreaTable).append(currentWidget.getNoDatafoundMsg());
                        $(currentWidget.SpringMigration).append(currentWidget.getNoDatafoundMsg());
                        $(currentWidget.BreedingArea).append(currentWidget.getNoDatafoundMsg());
                        $(currentWidget.AutumnMigration).append(currentWidget.getNoDatafoundMsg());
                    }

                    

                    $(".Overlay").fadeOut();


                },

                error: function (xhr, error) {
                    AlertMessages('error', '', currentWidget._i18n.Unabletofetchmmcreportdetails);

                    console.debug(xhr); console.debug(error);
                    $(".Overlay").fadeOut();
                },

            });
        },

        getNoDatafoundMsg: function () {
            var currentWidget = this;
            return '<h4 class="SubHeading">' + currentWidget._i18n.NoResultFound + '</h4>';
        },
        JSONToCSVConvertor: function (JSONData, ReportTitle, ShowLabel) {
            var currentWidget = this;
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
                // 2nd loop will extract each column and convert it in string comma-seprated
                for (var index in arrData[i]) {
                    row += '"' + arrData[i][index] + '",';
                }

                row.slice(0, row.length - 1);

                //add a line break after each row
                CSV += row + '\r\n';
            }

            //Generate a file name
            var fileName = "MyReport_";
            //this will remove the blank-spaces from the title and replace it with an underscore
            fileName += ReportTitle.replace(/ /g, "_");

            //Initialize file format you want csv or xls
            var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

            // Now the little tricky part.
            // you can use either>> window.open(uri);
            // but this will not work in some browsers
            // or you will not get the correct file extension

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
        calculateLatLongValues: function (lat1, lon1, lat2, lon2) {
            var currentWidget = this;
            var R = 6371; // km
            var dLat = currentWidget.toRad(lat2 - lat1);
            var dLon = currentWidget.toRad(lon2 - lon1);
            var lat1 = currentWidget.toRad(lat1);
            var lat2 = currentWidget.toRad(lat2);

            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d;
        },

        // Converts numeric degrees to radians
        toRad: function (Value) {
            return Value * Math.PI / 180;
        },

        JSONToWinterExcelDownload: function (WinteringReportData, fileName) {
            var currentWidget = this;
            var winterdata = WinteringReportData;
            var CSV = '';
            var row = "";
            var row1 = '';
            var row2 = '';

            row = 'PlatformID,ArrivalDate,DepartureDate,Duration (Days),AvgSpeed (Kt),AvgAltitude (Meter),Distance (Km),Locations';
            CSV += row + '@';
            row = "";

            for (var u = 0; u < winterdata.length; u++) {
                var dataforMMC = [];
                var row = "";
                $.each(winterdata[u], function (key, value) {
                    row1 = key + ',';
                    row2 = value + ',';

                    dataforMMC.push({ name: key, data: value });
                });

                for (var i = 0; i < dataforMMC.length; i++) {

                    if (dataforMMC[i].name == "MaxLat" || dataforMMC[i].name == "MaxLong" || dataforMMC[i].name == "MinLat" || dataforMMC[i].name == "MinLong") {
                        continue;
                    }
                    else {
                        row += '"' + dataforMMC[i].data + '",';
                    }

                    //row += '"' + data[i].name + '",';
                    //var matchingvarable = dataforMMC[i].name;
                    //if (dataforMMC[i].name == matchingvarable) {
                    //    row += '"' + dataforMMC[i].data + '",';
                    //}

                }
                CSV += row + '@';
            }
            var downloadurl = currentWidget.ServiceUrl + "JSONGenerateExcelMMCReportDownload" + "/" + CSV + "/" + fileName;
            $("#MMCReport1").val(currentWidget.ServiceUrl + "JSONGenerateExcelMMCReportDownload" + "/" + CSV + "/" + fileName);

        },
        JSONToSpringExcelDownload: function (SpringMigrationReportData, fileName) {
            var currentWidget = this;
            var springdata = SpringMigrationReportData;
            var CSV = '';
            var row = "";
            var row1 = '';
            var row2 = '';

            row = 'PlatformID,ArrivalDate,DepartureDate,Duration (Days),AvgSpeed (Kt),AvgAltitude (Meter),Distance (Km),Locations';
            CSV += row + '@';
            row = "";

            for (var u = 0; u < springdata.length; u++) {
                var dataforMMC = [];
                var row = "";
                $.each(springdata[u], function (key, value) {
                    row1 = key + ',';
                    row2 = value + ',';

                    dataforMMC.push({ name: key, data: value });
                });

                for (var i = 0; i < dataforMMC.length; i++) {

                    if (dataforMMC[i].name == "MaxLat" || dataforMMC[i].name == "MaxLong" || dataforMMC[i].name == "MinLat" || dataforMMC[i].name == "MinLong") {
                        continue;
                    }
                    else {
                        row += '"' + dataforMMC[i].data + '",';
                    }


                    //row += '"' + data[i].name + '",';
                    //var matchingvarable = dataforMMC[i].name;
                    //if (dataforMMC[i].name == matchingvarable) {
                    //    row += '"' + dataforMMC[i].data + '",';
                    //}

                }
                CSV += row + '@';
            }
            var downloadurl = currentWidget.ServiceUrl + "JSONGenerateExcelMMCReportDownload" + "/" + CSV + "/" + fileName;
            $("#MMCReport2").val(currentWidget.ServiceUrl + "JSONGenerateExcelMMCReportDownload" + "/" + CSV + "/" + fileName);
        },

        JSONToSummerExcelDownload: function (BreedingReportData, fileName) {
            var currentWidget = this;
            var summerdata = BreedingReportData;
            var CSV = '';
            var row = "";
            var row1 = '';
            var row2 = '';

            row = 'PlatformID,ArrivalDate,DepartureDate,Duration (Days),AvgSpeed (Kt),AvgAltitude (Meter),Distance (Km),Locations';
            CSV += row + '@';
            row = "";

            for (var u = 0; u < summerdata.length; u++) {
                var dataforMMC = [];
                var row = "";
                $.each(summerdata[u], function (key, value) {
                    row1 = key + ',';
                    row2 = value + ',';

                    dataforMMC.push({ name: key, data: value });
                });

                for (var i = 0; i < dataforMMC.length; i++) {

                    if (dataforMMC[i].name == "MaxLat" || dataforMMC[i].name == "MaxLong" || dataforMMC[i].name == "MinLat" || dataforMMC[i].name == "MinLong") {
                        continue;
                    }
                    else {
                        row += '"' + dataforMMC[i].data + '",';
                    }

                    //row += '"' + data[i].name + '",';
                    //var matchingvarable = dataforMMC[i].name;
                    //if (dataforMMC[i].name == matchingvarable) {
                    //    row += '"' + dataforMMC[i].data + '",';
                    //}

                }
                CSV += row + '@';
            }
            var downloadurl = currentWidget.ServiceUrl + "JSONGenerateExcelMMCReportDownload" + "/" + CSV + "/" + fileName;
            $("#MMCReport3").val(currentWidget.ServiceUrl + "JSONGenerateExcelMMCReportDownload" + "/" + CSV + "/" + fileName);
        },
        JSONToAutumnExcelDownload: function (AutumnReportData, fileName) {
            var currentWidget = this;
            var Autumndata = AutumnReportData;
            var CSV = '';
            var row = "";
            var row1 = '';
            var row2 = '';

            row = 'PlatformID,ArrivalDate,DepartureDate,Duration (Days),AvgSpeed (Kt),AvgAltitude (Meter),Distance (Km),Locations';
            CSV += row + '@';
            row = "";

            for (var u = 0; u < Autumndata.length; u++) {
                var dataforMMC = [];
                var row = "";
                $.each(Autumndata[u], function (key, value) {
                    row1 = key + ',';
                    row2 = value + ',';

                    dataforMMC.push({ name: key, data: value });
                });

                for (var i = 0; i < dataforMMC.length; i++) {

                    if (dataforMMC[i].name == "MaxLat" || dataforMMC[i].name == "MaxLong" || dataforMMC[i].name == "MinLat" || dataforMMC[i].name == "MinLong") {
                        continue;
                    }
                    else {
                        row += '"' + dataforMMC[i].data + '",';
                    }

                    //var matchingvarable = dataforMMC[i].name;
                    //if (dataforMMC[i].name == matchingvarable) {
                    //    if (dataforMMC[i].name == MaxLat || dataforMMC[i].name == MaxLong || dataforMMC[i].name == MinLat || dataforMMC[i].name == MinLong) {
                    //        continue;
                    //    }
                    //    else {
                    //        row += '"' + dataforMMC[i].data + '",';
                    //    }
                    //}

                }
                CSV += row + '@';
            }
            var downloadurl = currentWidget.ServiceUrl + "JSONGenerateExcelMMCReportDownload" + "/" + CSV + "/" + fileName;
            $("#MMCReport4").val(currentWidget.ServiceUrl + "JSONGenerateExcelMMCReportDownload" + "/" + CSV + "/" + fileName);
        },

        

    });
});