define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/topic',
    "dojo/text!emap/birdTrackingByNamesNew/template/birdTrackingByNamesNew.html",
    /*"emap/BTRouteWidget/BTRouteWidget",*/
    "dojo/i18n!emap/birdTrackingByNamesNew/nls/resource"

], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, topic, dijitTemplate, i18n) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: dijitTemplate,
        widgetsInTemplate: true,
        _i18n: i18n,
        map: null,
        title: i18n.title,
        configOptions: null,
        domNode: null,
        queryinfo: null,
        ServiceUrl: null,
        queryResultsWidget: null,
        StopOverResults: null,
        resultNode: null,
        birdInfo: null,
        BirdIdSensorType: [],
        SensorTypeValues: [],
        SensorTypeValuesResult: [],
        isgetPTTDSSelected: false,
        jsonObj: null,
        checkConditions: false,
        NoDataVariable: null,
        ResultantData: null,
        ExportMobileUrls : [],
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
            var currentwidget = this;
            this.inherited(arguments);
            $("html").on('click', '.select-all', function () {
                var myObj = $(this).closest('.SumoSelect.open').children()[0];
                if ($(this).hasClass("selected")) {
                    $(this).parents(".SumoSelect").find("select>option").prop("selected", true);
                    $(myObj)[0].sumo.selectAll();
                    $(this).parent().find("ul.options>li").addClass("selected");
                }
                else {
                    $(this).parents(".SumoSelect").find("select>option").prop("selected", false);
                    $(myObj)[0].sumo.unSelectAll();
                    $(this).parent().find("ul.options>li").removeClass("selected");
                }
            });

            if (configOptions.UserInfo.UserRole == "Sponsor") {
                $(".divyear").css("display", "none");
            }
            else {
                $(".divyear").css("display", "block");
            }

            this.queryinfo = {
                type: $(this.dddlSensorType).val(),
                settype: function (sensortype) {
                    if (sensortype == "Argos") {
                        this.type = "Argos";
                        this.funcname = "jsonArgos";
                    }
                    else if (sensortype == "GPS") {
                        this.type = "GPS";
                        this.funcname = "jsonGPSData";
                    }
                    else if (sensortype == "GSM") {
                        this.type = "GSM";
                        this.funcname = "jsonGSMData";
                    }
                },
                datefield: "DATE",
                latfield: "LAT",
                longfield: "LONG",
                platformid: $(this.ddlplatformid).val(),
                locclass: $(this.locationclasses).val(),
                platformidList: $(this.divPlatFormIds).val(),
                year: "",
                fromdate: $(this.fromdate).val(),
                todate: $(this.todate).val(),
                timeinterval: $(this.ddltimeInterval).val(),
                seasonWise: $(this.chkSeasonWise).is(":checked"),
                funcname: "",
                commonname: "",
                commonptts: [],
                commontype: "",
                results: {
                    data: [],
                    savelayerinfo: function (id, obj, status, result) {
                        this.id = id;
                        this.obj = obj;
                        this.status = status;
                        this.result = result;
                    }
                }
            }
            $(currentwidget.btnstopover).click(function () {
                $(".StopOverdiv").css("display", "block");
                $(".LeftPanel .card-header a").css("display", "none");
                currentwidget.StopOverResults.queryinfo = currentwidget.queryinfo;
                $(".StopOverdiv").animate({
                    right: "0px"
                }, 200);
                $("#SlidePanel .card-body").css("overflow-y", "hidden");
                $("#LayersPanel .card-body").css("overflow-y", "scroll");
            });

            $(".closeStop").click(function () {
                $(".LeftPanel .card-header a").css("display", "block");
                $(".StopOverdiv").animate({
                    right: "-320px"
                }, 200);
                $("#SlidePanel .card-body").css("overflow-y", "scroll");
                $("#LayersPanel .card-body").css("overflow-y", "scroll");
            });

            $(currentwidget.animate).click(function () {
                $(".Overlay").fadeIn();
                var formIsValid = true;
                $(this.stop).removeAttr("disabled");
                var speciesName = $(currentwidget.ddlSpeciesName).val();
                currentwidget.queryinfo.commonname = speciesName;

                var sensorcategory = $(currentwidget.ddlSensorCategory).val();
                var sensorName = $(currentwidget.dddlSensorType).val();
                var year = $(currentwidget.ddlYears).val();
                var timeIntervals = $(currentwidget.ddltimeInterval).val();
                var platFormID = $(currentwidget.divPlatFormIds).val();
                currentwidget.queryinfo.settype($(currentwidget.dddlSensorType).val());
                currentwidget.queryinfo.seasonWise = $(currentwidget.chkSeasonWise).is(":checked");
                var cNameyear = $(currentwidget.ddlYears).val();
                var timeinterval = $(currentwidget.ddltimeInterval).val();
                currentwidget.queryinfo.timeinterval = timeinterval;
                $(currentwidget.lblSpeciesName).css("display", "none");
                $(currentwidget.lblSensorCategory).css("display", "none");
                $(currentwidget.lblSensortName).css("display", "none");
                $(currentwidget.lblSensorYear).css("display", "none");
                $(currentwidget.lblplatformID).css("display", "none");

                if ($(currentwidget.ddlYears).val() === "" || $(currentwidget.ddlYears).val() === null) {
                    cNameyear = "9999";
                }
                if (speciesName == "") {
                    $(currentwidget.lblSpeciesName).css("display", "block");
                    formIsValid = false;
                }
                if (platFormID.length == 0) {
                    $(currentwidget.lblplatformID).css("display", "block");
                    formIsValid = false;
                }

                if (formIsValid == false) {
                    $(".Overlay").fadeOut();
                    return;
                }

                currentwidget.animateResults.queryinfo = currentwidget.queryinfo;
                currentwidget.queryinfo.platformid = null;
                if (currentwidget.checkConditions == true) {

                    currentwidget.animateResults.AddDataTogmapWithNames();
                }
                else {
                    currentwidget.queryinfo.platformidList = "";
                    var speciesName = $(currentwidget.ddlSpeciesName).val();
                    var sensorcategory = $(currentwidget.ddlSensorCategory).val();
                    var sensorName = $(currentwidget.dddlSensorType).val();
                    var timeIntervals = $(currentwidget.ddltimeInterval).val();
                    var platFormID = $(currentwidget.divPlatFormIds).val();
                    currentwidget.queryinfo.settype($(currentwidget.dddlSensorType).val());
                    var cNameyear = $(currentwidget.ddlYears).val();
                    var timeinterval = $(currentwidget.ddltimeInterval).val();
                    currentwidget.queryinfo.timeinterval = timeinterval;
                    currentwidget.queryinfo.seasonWise = $(currentwidget.chkSeasonWise).is(":checked");
                    currentwidget.queryinfo.commonname = speciesName;

                    for (var k = 0; k < platFormID.length; k++) {

                        currentwidget.queryinfo.platformid = platFormID[k];
                        if (currentwidget.queryinfo.platformidList == "") {
                            currentwidget.queryinfo.platformidList = platFormID[k];
                            for (i = 0; i < currentwidget.BirdIdSensorType.length; i++) {
                                var assignedid = currentwidget.BirdIdSensorType[i].split("_");
                                if (currentwidget.queryinfo.platformidList == assignedid[0]) {
                                    currentwidget.queryinfo.type = assignedid[1];
                                }
                            }
                        }
                        else {

                            currentwidget.queryinfo.platformidList = currentwidget.queryinfo.platformidList + "," + platFormID[k];
                            for (i = 0; i < currentwidget.BirdIdSensorType.length; i++) {
                                var assignedid = currentwidget.BirdIdSensorType[i].split("_");
                                if (currentwidget.queryinfo.platformid == assignedid[0]) {
                                    currentwidget.queryinfo.type = assignedid[1];
                                }
                            }
                        }
                    }

                    if (cNameyear === "" || cNameyear === null) {
                        cNameyear = "9999";
                    }

                    currentwidget.queryinfo.platformid = null;
                    currentwidget.queryinfo.timeinterval = timeIntervals == "" ? null : timeinterval;
                    currentwidget.queryinfo.year = cNameyear;

                    currentwidget.animateResults.AddDataTogmapWithNames();
                }

                $(".ManageContainer").show().animate({
                    bottom: '-100%'
                }, 200);

                $("#divanimateWidget").show().animate({
                    bottom: '0px'
                }, 500);
                $("#divAnimation").show().animate({
                    bottom: '0px'
                }, 500);
            });

            $("#ExportExcelMobileNames").click(function () {
                var filesForDownload = [];
                for (var m = 0; m < currentwidget.ExportMobileUrls.length; m++) {                    
                    filesForDownload.push({ path: currentwidget.ExportMobileUrls[m], name: "file"+ m +".txt" });
                }

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
                        }, 10000);
                    }
                    // Initiate the first download.
                    download_next(0);
                }
            });

        },


        startup: function () {
            var currentWidget = this;
            currentWidget.getbirdnames();
            currentWidget.getSensorCategeory();

        },

        ClearControls: function () {
            var currentWidget = this;
            $(currentWidget.ddlSpeciesName).val("");
            $(currentWidget.ddlSpeciesName)[0].sumo.reload();
            $(currentWidget.ddlSensorCategory).val("");
            $(currentWidget.ddlSensorCategory)[0].sumo.reload();
            $(currentWidget.dddlSensorType).val("");
            $(currentWidget.dddlSensorType).html("");
            $(currentWidget.dddlSensorType)[0].sumo.reload();
            $(currentWidget.ddlYears).val("");
            $(currentWidget.ddlYears).html("");
            $(currentWidget.ddlYears)[0].sumo.reload();
            $(currentWidget.ddltimeInterval).val("");
            $(currentWidget.lblSpeciesName).css("display", "none");
            $(currentWidget.lblSensorCategory).css("display", "none");
            $(currentWidget.lblSensortName).css("display", "none");
            $(currentWidget.lblSensorYear).css("display", "none");
            $(currentWidget.lblplatformID).css("display", "none");
            $(".testselect2").empty();
            $(".btnstopover").css("display", "none");
            $(currentWidget.pltfrmdiv).hide();

            $(currentWidget.chkSeasonWise).prop('checked', false);


        },
        GetMigration: function () {
            var currentWidget = this;
            $(currentWidget.chkSeasonWise).checked = false;
        },
        getPlatformIDList: function () {
            var currentWidget = this;
            $(currentWidget.lblplatformID).css("display", "none");
        },
        getSensorCategeory: function () {
            var currentWidget = this;
            $(currentWidget.ddlSensorCategory).append('<option value=""></option>');
            $(currentWidget.ddlSensorCategory).append('<option>All</option>');
            $(currentWidget.ddlSensorCategory).append('<option>Main</option>');
            $(currentWidget.ddlSensorCategory).append('<option>Secondary</option>');
            $(currentWidget.ddlSensorCategory).SumoSelect({ placeholder: currentWidget._i18n.placeholderSensorCategory });
            $(currentWidget.dddlSensorType).SumoSelect({ placeholder: currentWidget._i18n.placeholderSensorType });
            $(currentWidget.ddlYears).SumoSelect({ placeholder: currentWidget._i18n.placeholderYear });
        },
        getspeciesNames: function () {
            var currentWidget = this;

            $(currentWidget.lblSpeciesName).css("display", "none");
            $(currentWidget.ddlSensorCategory).val("");
            $(currentWidget.dddlSensorType).val("");
            $(currentWidget.ddlYears).val("");
            $(currentWidget.ddlSensorCategory)[0].sumo.reload();
            $(currentWidget.dddlSensorType)[0].sumo.reload();
            $(currentWidget.ddlYears)[0].sumo.reload();
            $(currentWidget.ddltimeInterval).val("");

        },

        getPTTDS: function () {
            var currentWidget = this;
            $(currentWidget.pltfrmdiv).show();
            var BirdName = $(currentWidget.ddlSpeciesName).val();
            currentWidget.isgetPTTDSSelected = true;
            var formIsValid = true;
            if (BirdName == "") {
                $(currentWidget.lblSpeciesName).css("display", "block");
                formIsValid = false;
            }
            if (formIsValid == false) {
                $(".Overlay").fadeOut();
                return;
            }
            currentWidget.getspeciesNames();
            var requestData = {
                speciesname: BirdName
            };
            $.ajax({
                url: currentWidget.ServiceUrl + "jsonPTTDsByCommonName/",
                type: 'POST', 
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {
                    var container = $(currentWidget.divPlatFormIds);
                    container.html("");
                    container[0].sumo.reload();
                    currentWidget.BirdIdSensorType = [];
                    $(currentWidget.ddlSensorCategory)[0].selectedIndex = 0;
                    $(currentWidget.dddlSensorType)[0].options.length = 0;
                    var jsonObj = JSON.parse(result);
                    if (jsonObj != null) {
                        currentWidget.birdInfo = jsonObj;
                        for (i = 0; i < jsonObj.Table1.length; i++) {
                            //if (currentWidget.birdInfo.Table1[i].TYPE != currentWidget.birdInfo.Table1[i].SecondaryType || currentWidget.birdInfo.Table1[i].SecondaryType != "NULL" || currentWidget.birdInfo.Table1[i].SecondaryType != "" || currentWidget.birdInfo.Table1[i].SecondaryType != null) {
                            if ((currentWidget.birdInfo.Table1[i].TYPE != currentWidget.birdInfo.Table1[i].SecondaryType) && (currentWidget.birdInfo.Table1[i].SecondaryType != "NULL" && currentWidget.birdInfo.Table1[i].SecondaryType != "" && currentWidget.birdInfo.Table1[i].SecondaryType != null && currentWidget.birdInfo.Table1[i].SecondaryType != "null")) {
                                currentWidget.BirdIdSensorType.push(currentWidget.birdInfo.Table1[i].PTTD + "_" + currentWidget.birdInfo.Table1[i].SecondaryType);
                            }
                            currentWidget.BirdIdSensorType.push(currentWidget.birdInfo.Table1[i].PTTD + "_" + currentWidget.birdInfo.Table1[i].TYPE);
                            if (jsonObj.Table1[i].Status == 'NA') {
                                var optionValue = $('<option>', {
                                    value: jsonObj.Table1[i].PTTD,
                                    html: jsonObj.Table1[i].PTTD + " (" + jsonObj.Table1[i].Status + ")",
                                    //text: jsonObj.Table1[i].PTTD + " (" + jsonObj.Table1[i].Status + ")",
                                    style: 'color: red; !important;'
                                });
                            }
                            else {
                                var optionValue = $('<option>', {
                                    value: jsonObj.Table1[i].PTTD,
                                    html: jsonObj.Table1[i].PTTD + " (" + jsonObj.Table1[i].Status + ")",
                                    //text: jsonObj.Table1[i].PTTD + " (" + jsonObj.Table1[i].Status + ")",
                                    style: 'color: green; !important;'
                                });
                            }
                           
                            container.append(optionValue);

                        }
                    }
                    container[0].sumo.reload();
                    //console.log(result);
                },
                error: function (xhr, error) {
                    AlertMessages('error', '', currentWidget._i18n.Unabletofetchbirdplatformids);

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

        getbirdnames: function () {
            var currentWidget = this;
            var token = localStorage.getItem('token'); // Assuming 'token' is the key where your JWT is stored
            var refreshtoken = localStorage.getItem('refreshtoken');

            if (!token) {
                console.error("Token not found in localStorage!");
                return;
            }
            $.ajax({
                url: currentWidget.ServiceUrl + "jsonCommonNames",
                type: 'GET',  // http method
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
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
                    $(currentWidget.ddlSpeciesName).SumoSelect({ search: true, placeholder: currentWidget._i18n.placeholderSpeciesName });

                    $(".testselect2").SumoSelect({
                        placeholder: currentWidget._i18n.placeholderPlatFormId, search: true, selectAll: true, okCancelInMulti: true, captionFormatAllSelected: ' {0} ' + currentWidget._i18n.SelectedAllItems, captionFormat: ' {0} ' + currentWidget._i18n.SelectedItems, forceCustomRendering: true, locale: [currentWidget._i18n.OK, currentWidget._i18n.Cancel, currentWidget._i18n.SelectAll],
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
                error: function (xhr, error) {
                    AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdNamesDetails);
                },
            });
        },
        getsensortype: function () {
            var currentWidget = this;
            $(".btnstopover").css("display", "none");
            $(currentWidget.lblSensorCategory).css("display", "none");

            var sensorCategeoryType = $(currentWidget.ddlSensorCategory).val();
            if (sensorCategeoryType == "") {
                currentWidget.getPTTDS();
                $(currentWidget.dddlSensorType).val("");
                $(currentWidget.dddlSensorType).html("");
                $(currentWidget.dddlSensorType)[0].sumo.reload();
                return;
            }


            if ($(currentWidget.ddlSensorCategory).val() == "All") {
                $(currentWidget.dddlSensorType).html("");
                $(currentWidget.dddlSensorType)[0].sumo.reload();
                $(currentWidget.dddlSensorType)[0].options.length = 0;
                $(currentWidget.dddlSensorType).append('<option value=""></option>');
                $(currentWidget.dddlSensorType).append('<option value="GSM"> GSM </option>');
                $(currentWidget.dddlSensorType).append('<option value="GPS"> GPS </option>');
                $(currentWidget.dddlSensorType).append('<option value="Argos"> Argos </option>');
                $(currentWidget.ddlYears).SumoSelect();
                $(currentWidget.dddlSensorType)[0].sumo.reload();
                $(".testselect2").SumoSelect({ placeholder: currentWidget._i18n.placeholderPlatFormId, selectAll: true, okCancelInMulti: true, forceCustomRendering: true, locale: [currentWidget._i18n.OK, currentWidget._i18n.Cancel, currentWidget._i18n.SelectAll] });
                return;
            }
            var sensorCategory = $(currentWidget.ddlSensorCategory).val() == "" ? null : $(currentWidget.ddlSensorCategory).val();

            var birdName = $(currentWidget.ddlSpeciesName).val() == "" ? null : $(currentWidget.ddlSpeciesName).val();
            var requestData = {
                type: sensorCategory,
                speciesname: birdName
            };
            $.ajax({
                url: currentWidget.ServiceUrl + "jsonSensors/",
                type: 'POST',
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {
                    $(currentWidget.dddlSensorType).html("");
                    $(currentWidget.dddlSensorType)[0].sumo.reload();
                    $(currentWidget.dddlSensorType)[0].options.length = 0;
                    $(currentWidget.dddlSensorType).append('<option value=""></option>');

                    var jsonObj = JSON.parse(result);
                    if (jsonObj != null) {



                        for (i = 0; i < jsonObj.length; i++) {
                            if (jsonObj[i].Type == "null" || jsonObj[i].Type == null) {
                                continue;
                            }
                            if (jsonObj[i].Type != "") {
                                $(currentWidget.dddlSensorType).append('<option>' + encodeURIComponent(jsonObj[i].Type) + '</option>')
                            }
                        }
                    }
                    $(currentWidget.ddlYears).SumoSelect();
                    $(currentWidget.dddlSensorType)[0].sumo.reload();
                    $(".testselect2").SumoSelect({
                        placeholder: currentWidget._i18n.placeholderPlatFormId, selectAll: true, okCancelInMulti: true, forceCustomRendering: true, locale: [currentWidget._i18n.OK, currentWidget._i18n.Cancel, currentWidget._i18n.SelectAll],
                        renderLi: (li, originalOption) => {
                            // Edit your li here
                            if (li[0].innerText.indexOf("AC") != -1) {
                                $(li).find("label").css("color", "darkgreen");
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
                    AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdSensorTypes);
                },
            });
        },

        getYearsValues: function () {
            var currentWidget = this;
            $(currentWidget.pltfrmdiv).show();
            $(".btnstopover").css("display", "none");
            $(currentWidget.lblSensortName).css("display", "none");
            var sensorType = $(currentWidget.dddlSensorType).val() == "" ? null : $(currentWidget.dddlSensorType).val();
            var sensorCategory = $(currentWidget.ddlSensorCategory).val() == "" ? null : $(currentWidget.ddlSensorCategory).val();
            var birdName = $(currentWidget.ddlSpeciesName).val() == "" ? null : $(currentWidget.ddlSpeciesName).val();
            var year = 9999;
            var container = $(currentWidget.divPlatFormIds);

            currentWidget.isgetPTTDSSelected = false;
            if (sensorType == "" || sensorType == null) {
                currentWidget.getPTTDS();
                $(currentWidget.ddlYears).val("");
                $(currentWidget.ddlYears).html("");
                $(currentWidget.ddlYears)[0].sumo.reload();
                return;
            }
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
                        container.html("");
                        container[0].sumo.reload();


                        var jsonObj = JSON.parse(result);
                        if (jsonObj != null) {
                            var strAssignBirds = jsonObj.AssignedBirds;
                            var publicuser = jsonObj["AssignedBirds"].split(' ');
                            var publicsensortype = jsonObj.Sensortype;
                            var splitvalues = jsonObj.Sensortype.split(" ");
                            var sensorbasedtypes = [];
                            for (i = 0; i < publicuser.length; i++) {
                                var publicusersensortype = splitvalues[i].split("-");
                                if (sensorType == publicusersensortype[1]) {
                                    var optionValue = $('<option>', {
                                        value: publicuser[i],
                                        html: publicuser[i] + " (AC)"
                                        //text: publicuser[i] + " (" + "AC" + ")"
                                    });
                                    container.append(optionValue);
                                }
                            }
                            container[0].sumo.reload();
                        }
                    },
                    error: function (xhr, error) {
                        var currentWidget = this;
                        AlertMessages('error', '', currentWidget._i18n.UnabletogetAssignedsid);
                        // console.debug(xhr); console.debug(error);
                    },
                });

            }
            else {
                var requestData = {
                    type: sensorType,
                    speciesname: birdName
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "jsonYearsOnCommonName" ,
                    type: 'POST',
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        $(currentWidget.ddlYears).html("");
                        $(currentWidget.ddlYears)[0].sumo.reload();
                        var jsonObj = JSON.parse(result);
                        if (jsonObj != null) {
                            $(currentWidget.ddlYears).append('<option value=""></option>');
                            for (i = 0; i < jsonObj.length; i++) {
                                $(currentWidget.ddlYears).append('<option>' + encodeURIComponent(jsonObj[i].CYEAR) + '</option>')
                            }
                        }
                        $(currentWidget.ddlYears)[0].sumo.reload();
                    },
                    error: function (xhr, error) {
                        var currentWidget = this;
                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdYears);
                    },
                });
                var requestData = {
                    type: sensorType,
                    speciesname: birdName,
                    yeardata: year
                };
                $.ajax({
                    url: currentWidget.ServiceUrl + "JsonNamesbasePttsYear/",
                    type: 'POST',
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        container.html("");
                        container[0].sumo.reload();
                        var jsonObj = JSON.parse(result);
                        if (jsonObj != null) {

                            for (i = 0; i < jsonObj.length; i++) {
                                var optionValue = $('<option>', {
                                    value: jsonObj[i].PTTD,
                                    html: jsonObj[i].PTTD + " (" + jsonObj[i].Status + ")"
                                    //text: jsonObj[i].PTTD + " (" + jsonObj[i].Status + ")"
                                });
                                container.append(optionValue);
                            }
                        }
                        container[0].sumo.reload();

                    },
                    error: function (xhr, error) {
                        var currentWidget = this;
                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdPTTIDs);
                    },
                });
            }
        },
        GetTableCellStyle: function (status) {
            if (status == "NA") {
                return "style='background:red; color:white; !important;'";
            }
            else if (status == "AC") {
                return "style='background:Green; color:white; !important;'";
            }
            else {
                return "style='background:#dfdfdf; color:white; !important;'";
            }
        },
        getPlatFormIDS: function () {
            var currentWidget = this;
            $(currentWidget.lblSensorYear).css("display", "none");
            $(currentWidget.pltfrmdiv).show();
            var sensorCategory = $(currentWidget.ddlSensorCategory).val() == "" ? null : $(currentWidget.ddlSensorCategory).val();
            var sensorType = $(currentWidget.dddlSensorType).val() == "" ? null : $(currentWidget.dddlSensorType).val();
            var birdName = $(currentWidget.ddlSpeciesName).val() == "" ? null : $(currentWidget.ddlSpeciesName).val();
            var year = $(currentWidget.ddlYears).val() == "" ? null : $(currentWidget.ddlYears).val();
            var container = $(currentWidget.divPlatFormIds);
            currentWidget.isgetPTTDSSelected = false;


            if (year == "" || year == null) {
                currentWidget.getPTTDS();
                return;
            }

            var requestData = {
                type: sensorType,
                speciesname: birdName,
                yeardata: year
            };
            $.ajax({
                url: currentWidget.ServiceUrl + "jsonNamesbasePttsYear/",
                type: 'POST',
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {
                    container.html("");
                    container[0].sumo.reload();
                    var jsonObj = JSON.parse(result);
                    if (jsonObj != null) {
                        for (i = 0; i < jsonObj.length; i++) {
                            var optionValue = $('<option>', {
                                value: jsonObj[i].PTTD,
                                html: jsonObj[i].PTTD + " (" + jsonObj[i].Status + ")"
                                //text: jsonObj[i].PTTD + " (" + jsonObj[i].Status + ")"
                            });
                            container.append(optionValue);
                        }
                    }
                    container[0].sumo.reload();
                },
                error: function (xhr, error) {
                    AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdPlatformIds);
                },
            });
        },
        adduserdetails: function () {
            var retval = (configOptions.UserInfo.UserName == "") ? "/null" : "/" + configOptions.UserInfo.UserName;
            retval += (configOptions.UserInfo.Password == "") ? "/null" : "/" + configOptions.UserInfo.Password;
            return retval;
        },

        PrepareArguments: function () {
            var data = "";
            var timeinterval = (this.queryinfo.timeinterval.trim() == "") ? null : this.queryinfo.timeinterval.trim();
            if (this.queryinfo.type == "Argos") {
                data = this.queryinfo.pltformid;
                data += (this.queryinfo.locclass.trim() == "") ? "/null" : "/" + this.queryinfo.locclass.trim();
                data += "/" + this.queryinfo.fromdate + "/" + this.queryinfo.todate + "/" + timeinterval;
                data += adduserdetails();
            }
            else if (this.queryinfo.type == "GPS" || this.queryinfo.type == "GSM") {
                data = this.queryinfo.pltformid;
                data += "/" + this.queryinfo.fromdate + "/" + this.queryinfo.todate + "/" + timeinterval;
                data += this.adduserdetails();
            }
            return data;
        },
        getBirdNameResult1: function () {
            try {
                var currentWidget = this;
                $(".Overlay").fadeIn();
                $(this.stop).removeAttr("disabled");

                currentWidget.queryinfo.platformidList = "";
                var speciesName = $(currentWidget.ddlSpeciesName).val();
                var sensorcategory = $(currentWidget.ddlSensorCategory).val();
                var sensorName = $(currentWidget.dddlSensorType).val();
                var year = $(currentWidget.ddlYears).val();
                var timeIntervals = $(currentWidget.ddltimeInterval).val();
                var platFormID = $(currentWidget.divPlatFormIds).val();
                this.queryinfo.settype($(currentWidget.dddlSensorType).val());
                var cNameyear = $(currentWidget.ddlYears).val();
                var timeinterval = $(currentWidget.ddltimeInterval).val();
                this.queryinfo.timeinterval = timeinterval;
                $(currentWidget.lblSpeciesName).css("display", "none");
                $(currentWidget.lblSensorCategory).css("display", "none");
                $(currentWidget.lblSensortName).css("display", "none");
                $(currentWidget.lblSensorYear).css("display", "none");
                $(currentWidget.lblplatformID).css("display", "none");

                if ($(currentWidget.ddlYears).val() === "" || $(currentWidget.ddlYears).val() === null) {
                    cNameyear = "9999";
                }

                var formIsValid = true;
                if (speciesName == "") {
                    $(currentWidget.lblSpeciesName).css("display", "block");
                    formIsValid = false;
                }
                if (platFormID.length == 0) {
                    $(currentWidget.lblplatformID).css("display", "block");
                    formIsValid = false;
                }

                if (formIsValid == false) {
                    $(".Overlay").fadeOut();
                    return;
                }
                this.queryinfo.timeinterval = timeIntervals == "" ? null : timeinterval;
                this.queryinfo.year = cNameyear;

                var CheckCount = platFormID.length;
                $('Button').prop('disabled', true);

                var count = 0;
                currentWidget.NoDataVariable = "";
                for (var k = 0; k < platFormID.length; k++) {
                    currentWidget.queryinfo.platformid = platFormID[k];
                    if (currentWidget.queryinfo.platformidList == "") {
                        currentWidget.queryinfo.platformidList = platFormID[k];
                        if (currentWidget.isgetPTTDSSelected == true) {
                            for (i = 0; i < currentWidget.BirdIdSensorType.length; i++) {
                                var assignedid = currentWidget.BirdIdSensorType[i].split("_");
                                if (currentWidget.queryinfo.platformidList == assignedid[0]) {
                                    currentWidget.queryinfo.type = assignedid[1];
                                }
                            }
                        }
                    }
                    else {
                        currentWidget.queryinfo.platformidList = currentWidget.queryinfo.platformidList + "," + platFormID[k];
                        if (currentWidget.isgetPTTDSSelected == true) {
                            for (i = 0; i < currentWidget.BirdIdSensorType.length; i++) {
                                var assignedid = currentWidget.BirdIdSensorType[i].split("_");
                                if (currentWidget.queryinfo.platformid == assignedid[0]) {
                                    currentWidget.queryinfo.type = assignedid[1];
                                }
                            }
                        }
                    }
                    var url;
                    if (typeof (currentWidget.queryinfo.type) == 'undefined') {
                        for (var i = 0; i < currentWidget.birdInfo.length; i++) {
                            if (currentWidget.birdInfo[i].PTTD == platFormID[k]) {
                                var requestData = {
                                    id: platFormID[k],
                                    type: currentWidget.birdInfo[i].TYPE,
                                    yeardata: cNameyear,
                                    timeinterval: currentWidget.queryinfo.timeinterval
                                };
                                url = currentWidget.ServiceUrl + "jsonPttsYear/";
                            }
                        }
                    }
                    else {
                        var requestData = {
                            id: platFormID[k],
                            type: currentWidget.queryinfo.type,
                            yeardata: cNameyear,
                            timeinterval: currentWidget.queryinfo.timeinterval,
                            login: (configOptions.UserInfo.UserName == "") ? "/null" : "/" + configOptions.UserInfo.UserName,
                            password: (configOptions.UserInfo.Password == "") ? "/null" : "/" + configOptions.UserInfo.Password
                        };
                        url = currentWidget.ServiceUrl + "jsonPttsYear/";
                    }

                    $.ajax({
                        url: url,
                        type: 'POST',  // http method
                        async: false,
                        crossDomain: true,
                        contentType: 'application/json',
                        data: JSON.stringify(requestData),
                        beforeSend: function () { $(".Overlay").fadeIn(); },
                        success: function (result) {

                            currentWidget.jsonObj = JSON.parse(result);
                            var jsonObj = currentWidget.jsonObj;
                            currentWidget.ResultantData = jsonObj;
                            if (jsonObj != null) {
                                if (jsonObj.Table1.length == 0) {
                                    $('Button').prop('disabled', false);
                                    if (((configOptions.UserInfo.UserRole).toUpperCase() == "STANDARD") || ((configOptions.UserInfo.UserRole).toUpperCase() == "SPONSOR")) {
                                        $(".btnstopover").css("display", "none");
                                    }
                                    else {
                                        $(".btnstopover").css("display", "block");
                                    }

                                    currentWidget.NoDataVariable += currentWidget.queryinfo.platformid + ",";
                                }
                            }
                            var BirdTrackingData = [];
                            if (jsonObj.Table1.length > 0) {
                                //if (jsonObj.Table1.length >= 30000) {
                                //    AlertMessages("warning", '', currentWidget._i18n.HugeData);
                                //    $(".Overlay").fadeOut();
                                //    return;
                                //}
                                clearPointDensityLayer();
                                currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObj.Table1, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), "1");
                                currentWidget.checkConditions = true;
                            }


                            
                            count++;
                            if (CheckCount == count) {
                                $('Button').prop('disabled', false);
                                //$(".Overlay").fadeOut();
                                if (((configOptions.UserInfo.UserRole).toUpperCase() == "STANDARD") || ((configOptions.UserInfo.UserRole).toUpperCase() == "SPONSOR")) {
                                    $(".btnstopover").css("display", "none");
                                }
                                else {
                                    $(".btnstopover").css("display", "block");
                                }

                                if (currentWidget.NoDataVariable != "") {
                                    AlertMessages("warning", '', currentWidget._i18n.NoResultFound + " for " + currentWidget.NoDataVariable.slice(0, -1));
                                    //$(".Overlay").fadeOut();
                                }

                            }

                            $("#ResultPagePanel").css('visibility', 'visible');
                            $("#ResultPagePanel").css('bottom', '-265px');
                            $("#ResultPagePanel").css('z-index', '9');
                            $(".Overlay").fadeOut();

                        },
                        error: function (xhr, error) {
                            $('Button').prop('disabled', false);
                            AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdNamesDetails);
                            $(".Overlay").fadeOut();
                            // console.debug(xhr); console.debug(error);
                        },
                    });



                };

            }
            catch (err) {
                console.log(err);
                throw err;
            }

        },

        getBirdNameResult: function () {
            try {
                var currentWidget = this;
                $(".Overlay").fadeIn();
                $(this.stop).removeAttr("disabled");

                currentWidget.queryinfo.platformidList = "";
                //currentWidget.queryinfo.type = "";
                var speciesName = $(currentWidget.ddlSpeciesName).val();
                var sensorcategory = $(currentWidget.ddlSensorCategory).val();
                var sensorName = $(currentWidget.dddlSensorType).val();
                var year = $(currentWidget.ddlYears).val();
                var timeIntervals = $(currentWidget.ddltimeInterval).val();
                var platFormID = $(currentWidget.divPlatFormIds).val();
                this.queryinfo.settype($(currentWidget.dddlSensorType).val());
                var cNameyear = $(currentWidget.ddlYears).val();
                var timeinterval = $(currentWidget.ddltimeInterval).val();
                this.queryinfo.timeinterval = timeinterval;
                $(currentWidget.lblSpeciesName).css("display", "none");
                $(currentWidget.lblSensorCategory).css("display", "none");
                $(currentWidget.lblSensortName).css("display", "none");
                $(currentWidget.lblSensorYear).css("display", "none");
                $(currentWidget.lblplatformID).css("display", "none");

                var ua = navigator.userAgent;
                var checker = {
                    iphone: ua.match(/BirdTracking_Ios/),
                    blackberry: ua.match(/BlackBerry/),
                    android: ua.match(/BirdTracking_Android/)
                };
                if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("Android") || checker.android || checker.iphone) {
                    $("#ExportExcelMobileNames").css("display", "inline-block");
                    $("#ExportExcelMobile").css("display", "none");
                }


                if ($(currentWidget.ddlYears).val() === "" || $(currentWidget.ddlYears).val() === null) {
                    cNameyear = "9999";
                }

                var formIsValid = true;
                if (speciesName == "") {
                    $(currentWidget.lblSpeciesName).css("display", "block");
                    formIsValid = false;
                }
                if (platFormID.length == 0) {
                    $(currentWidget.lblplatformID).css("display", "block");
                    formIsValid = false;
                }

                if (formIsValid == false) {
                    $(".Overlay").fadeOut();
                    return;
                }
                this.queryinfo.timeinterval = timeIntervals == "" ? null : timeinterval;
                this.queryinfo.year = cNameyear;
                var CheckCount;

                if (currentWidget.isgetPTTDSSelected == true) {
                    CheckCount = 0;
                    for (d = 0; d < platFormID.length; d++) {
                        var FilterCount = currentWidget.BirdIdSensorType.filter(element => element.includes(platFormID[d]));
                        if (FilterCount.length > 0) {
                            for (var p = 0; p < FilterCount.length; p++) {
                                var pidcount = FilterCount[p].split("_");
                                if (pidcount[0] == platFormID[d]) {
                                    CheckCount = CheckCount + 1;
                                }
                            }
                        }
                    }
                }
                else {
                    CheckCount = platFormID.length;
                }

                $('Button').prop('disabled', true);

                var count = 0;
                currentWidget.NoDataVariable = "";
                currentWidget.ExportMobileUrls = [];

                for (var k = 0; k < platFormID.length; k++) {

                    currentWidget.queryinfo.platformid = platFormID[k];
                    if (currentWidget.queryinfo.platformidList == "") {
                        currentWidget.queryinfo.platformidList = platFormID[k];
                        if (currentWidget.isgetPTTDSSelected == true) {
                            for (i = 0; i < currentWidget.BirdIdSensorType.length; i++) {
                                var assignedid = currentWidget.BirdIdSensorType[i].split("_");
                                if (currentWidget.queryinfo.platformidList == assignedid[0]) {
                                    currentWidget.queryinfo.type = assignedid[1];
                                }
                                else {
                                    currentWidget.queryinfo.type = "";
                                }
                                var url;
                                if (currentWidget.queryinfo.type != "") {
                                    if (typeof (currentWidget.queryinfo.type) == 'undefined') {
                                        for (var i = 0; i < currentWidget.birdInfo.length; i++) {
                                            if (currentWidget.birdInfo[i].PTTD == platFormID[k]) {

                                                if (currentWidget.birdInfo[i].TYPE == "Argos") {
                                                    var downloadurl = currentWidget.ServiceUrl + "JSONPttsYearDownload/" + platFormID[k] + "/" + currentWidget.birdInfo[i].TYPE + "/" + cNameyear + "/" + currentWidget.queryinfo.timeinterval;
                                                }
                                                else if (currentWidget.birdInfo[i].TYPE == "GPS") {
                                                    var downloadurl = currentWidget.ServiceUrl + "JSONPttsYearDownload/" + platFormID[k] + "/" + currentWidget.birdInfo[i].TYPE + "/" + cNameyear + "/" + currentWidget.queryinfo.timeinterval;
                                                }
                                                else if (currentWidget.birdInfo[i].TYPE == "GSM") {
                                                    var downloadurl = currentWidget.ServiceUrl + "JSONPttsYearDownload/" + platFormID[k] + "/" + currentWidget.birdInfo[i].TYPE + "/" + cNameyear + "/" + currentWidget.queryinfo.timeinterval;
                                                }
                                                currentWidget.ExportMobileUrls.push(downloadurl);
                                                //$("#ExportExcelMobile").attr("href", downloadurl);

                                                var requestData = {
                                                    id: platFormID[k],
                                                    type: currentWidget.birdInfo[i].TYPE,
                                                    yeardata: cNameyear,
                                                    timeinterval: currentWidget.queryinfo.timeinterval,
                                                    login: (configOptions.UserInfo.UserName == "") ? "/null" : "/" + configOptions.UserInfo.UserName,
                                                    password: (configOptions.UserInfo.Password == "") ? "/null" : "/" + configOptions.UserInfo.Password

                                                };
                                                url = currentWidget.ServiceUrl + "jsonPttsYear/";
                                                $.ajax({
                                                    url: url,
                                                    type: 'POST',  // http method
                                                    async: false,
                                                    crossDomain: true,
                                                    contentType: 'application/json',
                                                    data: JSON.stringify(requestData),
                                                    beforeSend: function () { $(".Overlay").fadeIn(); },
                                                    success: function (result) {
                                                        currentWidget.jsonObj = JSON.parse(result);
                                                        var jsonObj = currentWidget.jsonObj;
                                                        currentWidget.ResultantData = jsonObj;
                                                        var BirdTrackingData = [];
                                                        if (jsonObj.Table1.length > 0) {
                                                            //if (jsonObj.Table1.length >= 30000) {
                                                            //    AlertMessages("warning", '', currentWidget._i18n.HugeData);
                                                            //    $(".Overlay").fadeOut();
                                                            //    return;
                                                            //}
                                                            if ($(currentWidget.chkSeasonWise).is(":checked") == true) {
                                                                if ($(currentWidget.ddlYears).val() === "" || $(currentWidget.ddlYears).val() === null) {
                                                                    if (jsonObj.Table2.length > 0) {
                                                                        for (var k = 0; k < jsonObj.Table2.length; k++) {
                                                                            var jsonObjYearWise = jsonObj.Table1.filter(function (jsonYearinfo) {
                                                                                return jsonYearinfo.YearData == jsonObj.Table2[k].YearData;
                                                                            });
                                                                            var YearInfo = jsonObj.Table2[k].YearData;
                                                                            if (jsonObjYearWise.length > 0) {
                                                                                currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObjYearWise, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), YearInfo);
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                else {
                                                                    currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObj.Table1, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), $(currentWidget.ddlYears).val());
                                                                }
                                                            }
                                                            else {
                                                                currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObj.Table1, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), "");
                                                            }

                                                            clearPointDensityLayer();
                                                            currentWidget.checkConditions = true;
                                                        }
                                                        else {
                                                            if (((configOptions.UserInfo.UserRole).toUpperCase() == "STANDARD") || ((configOptions.UserInfo.UserRole).toUpperCase() == "SPONSOR")) {
                                                                $(".btnstopover").css("display", "none");
                                                            }
                                                            else {
                                                                $(".btnstopover").css("display", "block");
                                                            }
                                                            currentWidget.NoDataVariable += currentWidget.queryinfo.platformid + '_' + currentWidget.queryinfo.type + ",";

                                                        }
                                                        count++;
                                                        if (CheckCount == count) {
                                                            $('Button').prop('disabled', false);
                                                            if (((configOptions.UserInfo.UserRole).toUpperCase() == "STANDARD") || ((configOptions.UserInfo.UserRole).toUpperCase() == "SPONSOR")) {
                                                                $(".btnstopover").css("display", "none");
                                                            }
                                                            else {
                                                                $(".btnstopover").css("display", "block");
                                                            }
                                                            if (currentWidget.NoDataVariable != "") {
                                                                AlertMessages("warning", '', currentWidget._i18n.NoResultFound + " for " + currentWidget.NoDataVariable.slice(0, -1));

                                                            }
                                                        }
                                                        $("#ResultPagePanel").css('visibility', 'visible');
                                                        $("#ResultPagePanel").css('bottom', '-265px');
                                                        $("#ResultPagePanel").css('z-index', '9');
                                                        $(".Overlay").fadeOut();
                                                    },
                                                    error: function (xhr, error) {
                                                        $('Button').prop('disabled', false);
                                                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdNamesDetails);
                                                        $(".Overlay").fadeOut();
                                                    },
                                                });
                                            }
                                        }

                                    }
                                    else {
                                        if (currentWidget.queryinfo.type == "Argos") {
                                            var downloadurl = currentWidget.ServiceUrl + "JSONPttsYearDownload/" + platFormID[k] + "/" + currentWidget.queryinfo.type + "/" + cNameyear + "/" + currentWidget.queryinfo.timeinterval;
                                        }
                                        else if (currentWidget.queryinfo.type == "GPS") {
                                            var downloadurl = currentWidget.ServiceUrl + "JSONPttsYearDownload/" + platFormID[k] + "/" + currentWidget.queryinfo.type + "/" + cNameyear + "/" + currentWidget.queryinfo.timeinterval;
                                        }
                                        else if (currentWidget.queryinfo.type == "GSM") {
                                            var downloadurl = currentWidget.ServiceUrl + "JSONPttsYearDownload/" + platFormID[k] + "/" + currentWidget.queryinfo.type + "/" + cNameyear + "/" + currentWidget.queryinfo.timeinterval;
                                        }
                                        currentWidget.ExportMobileUrls.push(downloadurl);

                                        //$("#ExportExcelMobile").attr("href", downloadurl);
                                        var requestData = {
                                            id: platFormID[k],
                                            type: currentWidget.queryinfo.type,
                                            yeardata: cNameyear,
                                            timeinterval: currentWidget.queryinfo.timeinterval,
                                            login: (configOptions.UserInfo.UserName == "") ? "/null" : "/" + configOptions.UserInfo.UserName,
                                            password: (configOptions.UserInfo.Password == "") ? "/null" : "/" + configOptions.UserInfo.Password

                                        };
                                        url = currentWidget.ServiceUrl + "jsonPttsYear/";

                                        $.ajax({

                                            url: url,
                                            type: 'POST',  // http method
                                            async: false,
                                            crossDomain: true,
                                            contentType: 'application/json',
                                            data: JSON.stringify(requestData),
                                            beforeSend: function () { $(".Overlay").fadeIn(); },
                                            success: function (result) {

                                                currentWidget.jsonObj = JSON.parse(result);
                                                var jsonObj = currentWidget.jsonObj;
                                                currentWidget.ResultantData = jsonObj;
                                                var BirdTrackingData = [];
                                                if (jsonObj.Table1.length > 0) {
                                                    //if (jsonObj.Table1.length >= 30000) {
                                                    //    AlertMessages("warning", '', currentWidget._i18n.HugeData);
                                                    //    $(".Overlay").fadeOut();
                                                    //    return;
                                                    //}
                                                    if ($(currentWidget.chkSeasonWise).is(":checked") == true) {
                                                        if ($(currentWidget.ddlYears).val() === "" || $(currentWidget.ddlYears).val() === null) {
                                                            if (jsonObj.Table2.length > 0) {
                                                                for (var k = 0; k < jsonObj.Table2.length; k++) {
                                                                    var jsonObjYearWise = jsonObj.Table1.filter(function (jsonYearinfo) {
                                                                        return jsonYearinfo.YearData == jsonObj.Table2[k].YearData;
                                                                    });
                                                                    var YearInfo = jsonObj.Table2[k].YearData;
                                                                    if (jsonObjYearWise.length > 0) {
                                                                        currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObjYearWise, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), YearInfo);
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        else {
                                                            currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObj.Table1, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), $(currentWidget.ddlYears).val());
                                                        }
                                                    }
                                                    else {
                                                        currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObj.Table1, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), "");
                                                    }


                                                    clearPointDensityLayer();
                                                    currentWidget.checkConditions = true;
                                                }
                                                else {
                                                    if (((configOptions.UserInfo.UserRole).toUpperCase() == "STANDARD") || ((configOptions.UserInfo.UserRole).toUpperCase() == "SPONSOR")) {
                                                        $(".btnstopover").css("display", "none");
                                                    }
                                                    else {
                                                        $(".btnstopover").css("display", "block");
                                                    }

                                                    currentWidget.NoDataVariable += currentWidget.queryinfo.platformid + '_' + currentWidget.queryinfo.type + ",";

                                                }
                                                count++;
                                                if (CheckCount == count) {
                                                    $('Button').prop('disabled', false);
                                                    if (((configOptions.UserInfo.UserRole).toUpperCase() == "STANDARD") || ((configOptions.UserInfo.UserRole).toUpperCase() == "SPONSOR")) {
                                                        $(".btnstopover").css("display", "none");
                                                    }
                                                    else {
                                                        $(".btnstopover").css("display", "block");
                                                    }

                                                    if (currentWidget.NoDataVariable != "") {
                                                        AlertMessages("warning", '', currentWidget._i18n.NoResultFound + " for " + currentWidget.NoDataVariable.slice(0, -1));
                                                    }
                                                }
                                                $("#ResultPagePanel").css('visibility', 'visible');
                                                $("#ResultPagePanel").css('bottom', '-265px');
                                                $("#ResultPagePanel").css('z-index', '9');
                                                $(".Overlay").fadeOut();

                                            },
                                            error: function (xhr, error) {
                                                $('Button').prop('disabled', false);
                                                AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdNamesDetails);
                                                $(".Overlay").fadeOut();
                                            },
                                        });

                                    }
                                }
                            }
                        }
                        else {
                            currentWidget.queryinfo.type = sensorName;

                            if (currentWidget.queryinfo.type == "Argos") {
                                var downloadurl = currentWidget.ServiceUrl + "JSONPttsYearDownload/" + platFormID[k] + "/" + currentWidget.queryinfo.type + "/" + cNameyear + "/" + currentWidget.queryinfo.timeinterval;
                            }
                            else if (currentWidget.queryinfo.type == "GPS") {
                                var downloadurl = currentWidget.ServiceUrl + "JSONPttsYearDownload/" + platFormID[k] + "/" + currentWidget.queryinfo.type + "/" + cNameyear + "/" + currentWidget.queryinfo.timeinterval;
                            }
                            else if (currentWidget.queryinfo.type == "GSM") {
                                var downloadurl = currentWidget.ServiceUrl + "JSONPttsYearDownload/" + platFormID[k] + "/" + currentWidget.queryinfo.type + "/" + cNameyear + "/" + currentWidget.queryinfo.timeinterval;
                            }
                            currentWidget.ExportMobileUrls.push(downloadurl);
                            //$("#ExportExcelMobile").attr("href", downloadurl);
                            var requestData = {
                                id: platFormID[k],
                                type: currentWidget.queryinfo.type,
                                yeardata: cNameyear,
                                timeinterval: currentWidget.queryinfo.timeinterval,
                                login: (configOptions.UserInfo.UserName == "") ? "/null" : "/" + configOptions.UserInfo.UserName,
                                password: (configOptions.UserInfo.Password == "") ? "/null" : "/" + configOptions.UserInfo.Password

                            };
                            var url = currentWidget.ServiceUrl + "jsonPttsYear/";
                            $.ajax({
                                url: url,
                                type: 'POST',  // http method
                                async: false,
                                crossDomain: true,
                                contentType: 'application/json',
                                data: JSON.stringify(requestData),
                                beforeSend: function () { $(".Overlay").fadeIn(); },
                                success: function (result) {

                                    currentWidget.jsonObj = JSON.parse(result);
                                    var jsonObj = currentWidget.jsonObj;
                                    currentWidget.ResultantData = jsonObj;

                                    var BirdTrackingData = [];
                                    if (jsonObj.Table1.length > 0) {
                                        //if (jsonObj.Table1.length >= 30000) {
                                        //    AlertMessages("warning", '', currentWidget._i18n.HugeData);
                                        //    $(".Overlay").fadeOut();
                                        //    return;
                                        //}

                                        if ($(currentWidget.chkSeasonWise).is(":checked") == true) {
                                            if ($(currentWidget.ddlYears).val() === "" || $(currentWidget.ddlYears).val() === null) {
                                                if (jsonObj.Table2.length > 0) {
                                                    for (var k = 0; k < jsonObj.Table2.length; k++) {
                                                        var jsonObjYearWise = jsonObj.Table1.filter(function (jsonYearinfo) {
                                                            return jsonYearinfo.YearData == jsonObj.Table2[k].YearData;
                                                        });
                                                        var YearInfo = jsonObj.Table2[k].YearData;
                                                        if (jsonObjYearWise.length > 0) {
                                                            currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObjYearWise, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), YearInfo);
                                                        }
                                                    }
                                                }
                                            }
                                            else {
                                                currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObj.Table1, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), $(currentWidget.ddlYears).val());
                                            }
                                        }
                                        else {
                                            currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObj.Table1, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), "");
                                        }
                                        clearPointDensityLayer();
                                        //currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObj.Table1, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), "");
                                        currentWidget.checkConditions = true;
                                    }
                                    else {
                                        if (((configOptions.UserInfo.UserRole).toUpperCase() == "STANDARD") || ((configOptions.UserInfo.UserRole).toUpperCase() == "SPONSOR")) {
                                            $(".btnstopover").css("display", "none");
                                        }
                                        else {
                                            $(".btnstopover").css("display", "block");
                                        }

                                        currentWidget.NoDataVariable += currentWidget.queryinfo.platformid + '_' + currentWidget.queryinfo.type + ",";

                                    }
                                    count++;
                                    if (CheckCount == count) {
                                        $('Button').prop('disabled', false);
                                        if (((configOptions.UserInfo.UserRole).toUpperCase() == "STANDARD") || ((configOptions.UserInfo.UserRole).toUpperCase() == "SPONSOR")) {
                                            $(".btnstopover").css("display", "none");
                                        }
                                        else {
                                            $(".btnstopover").css("display", "block");
                                        }

                                        if (currentWidget.NoDataVariable != "") {
                                            AlertMessages("warning", '', currentWidget._i18n.NoResultFound + " for " + currentWidget.NoDataVariable.slice(0, -1));
                                            //$(".Overlay").fadeOut();
                                        }

                                    }

                                    $("#ResultPagePanel").css('visibility', 'visible');
                                    $("#ResultPagePanel").css('bottom', '-265px');
                                    $("#ResultPagePanel").css('z-index', '9');
                                    $(".Overlay").fadeOut();

                                },
                                error: function (xhr, error) {
                                    $('Button').prop('disabled', false);
                                    AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdNamesDetails);
                                    $(".Overlay").fadeOut();
                                },
                            });
                        }

                    }
                    else {
                        currentWidget.queryinfo.platformidList = currentWidget.queryinfo.platformidList + "," + platFormID[k];

                        if (currentWidget.isgetPTTDSSelected == true) {
                            for (i = 0; i < currentWidget.BirdIdSensorType.length; i++) {
                                var assignedid = currentWidget.BirdIdSensorType[i].split("_");
                                if (currentWidget.queryinfo.platformid == assignedid[0]) {
                                    currentWidget.queryinfo.type = assignedid[1];
                                }

                                else {
                                    currentWidget.queryinfo.type = "";
                                }
                                var url;
                                if (currentWidget.queryinfo.type != "") {
                                    if (typeof (currentWidget.queryinfo.type) == 'undefined') {
                                        for (var i = 0; i < currentWidget.birdInfo.length; i++) {
                                            if (currentWidget.birdInfo[i].PTTD == platFormID[k]) {

                                                if (currentWidget.birdInfo[i].TYPE == "Argos") {
                                                    var downloadurl = currentWidget.ServiceUrl + "JSONPttsYearDownload/" + platFormID[k] + "/" + currentWidget.birdInfo[i].TYPE + "/" + cNameyear + "/" + currentWidget.queryinfo.timeinterval;
                                                }
                                                else if (currentWidget.birdInfo[i].TYPE == "GPS") {
                                                    var downloadurl = currentWidget.ServiceUrl + "JSONPttsYearDownload/" + platFormID[k] + "/" + currentWidget.birdInfo[i].TYPE + "/" + cNameyear + "/" + currentWidget.queryinfo.timeinterval;
                                                }
                                                else if (currentWidget.birdInfo[i].TYPE == "GSM") {
                                                    var downloadurl = currentWidget.ServiceUrl + "JSONPttsYearDownload/" + platFormID[k] + "/" + currentWidget.birdInfo[i].TYPE + "/" + cNameyear + "/" + currentWidget.queryinfo.timeinterval;
                                                }
                                                currentWidget.ExportMobileUrls.push(downloadurl);
                                                //$("#ExportExcelMobile").attr("href", downloadurl);
                                                var requestData = {
                                                    id: platFormID[k],
                                                    type: currentWidget.birdInfo[i].TYPE,
                                                    yeardata: cNameyear,
                                                    timeinterval: currentWidget.queryinfo.timeinterval,
                                                    login: (configOptions.UserInfo.UserName == "") ? "/null" : "/" + configOptions.UserInfo.UserName,
                                                    password: (configOptions.UserInfo.Password == "") ? "/null" : "/" + configOptions.UserInfo.Password

                                                };
                                                url = currentWidget.ServiceUrl + "jsonPttsYear/";
                                                $.ajax({

                                                    url: url,
                                                    type: 'POST',  // http method
                                                    async: false,
                                                    crossDomain: true,
                                                    contentType: 'application/json',
                                                    data: JSON.stringify(requestData),
                                                    beforeSend: function () { $(".Overlay").fadeIn(); },
                                                    success: function (result) {
                                                        currentWidget.jsonObj = JSON.parse(result);
                                                        var jsonObj = currentWidget.jsonObj;
                                                        currentWidget.ResultantData = jsonObj;
                                                        var BirdTrackingData = [];
                                                        if (jsonObj.Table1.length > 0) {
                                                            //if (jsonObj.Table1.length >= 30000) {
                                                            //    AlertMessages("warning", '', currentWidget._i18n.HugeData);
                                                            //    $(".Overlay").fadeOut();
                                                            //    return;
                                                            //}


                                                            if ($(currentWidget.chkSeasonWise).is(":checked") == true) {
                                                                if ($(currentWidget.ddlYears).val() === "" || $(currentWidget.ddlYears).val() === null) {
                                                                    if (jsonObj.Table2.length > 0) {
                                                                        for (var k = 0; k < jsonObj.Table2.length; k++) {
                                                                            var jsonObjYearWise = jsonObj.Table1.filter(function (jsonYearinfo) {
                                                                                return jsonYearinfo.YearData == jsonObj.Table2[k].YearData;
                                                                            });
                                                                            var YearInfo = jsonObj.Table2[k].YearData;
                                                                            if (jsonObjYearWise.length > 0) {
                                                                                currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObjYearWise, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), YearInfo);
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                else {
                                                                    currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObj.Table1, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), $(currentWidget.ddlYears).val());
                                                                }
                                                            }
                                                            else {
                                                                currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObj.Table1, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), "");
                                                            }

                                                            clearPointDensityLayer();
                                                            currentWidget.checkConditions = true;
                                                        }
                                                        else {
                                                            if (((configOptions.UserInfo.UserRole).toUpperCase() == "STANDARD") || ((configOptions.UserInfo.UserRole).toUpperCase() == "SPONSOR")) {
                                                                $(".btnstopover").css("display", "none");
                                                            }
                                                            else {
                                                                $(".btnstopover").css("display", "block");
                                                            }

                                                            currentWidget.NoDataVariable += currentWidget.queryinfo.platformid + '_' + currentWidget.queryinfo.type + ",";

                                                        }
                                                        count++;
                                                        if (CheckCount == count) {
                                                            $('Button').prop('disabled', false);
                                                            if (((configOptions.UserInfo.UserRole).toUpperCase() == "STANDARD") || ((configOptions.UserInfo.UserRole).toUpperCase() == "SPONSOR")) {
                                                                $(".btnstopover").css("display", "none");
                                                            }
                                                            else {
                                                                $(".btnstopover").css("display", "block");
                                                            }

                                                            if (currentWidget.NoDataVariable != "") {
                                                                AlertMessages("warning", '', currentWidget._i18n.NoResultFound + " for " + currentWidget.NoDataVariable.slice(0, -1));

                                                            }

                                                        }

                                                        $("#ResultPagePanel").css('visibility', 'visible');
                                                        $("#ResultPagePanel").css('bottom', '-265px');
                                                        $("#ResultPagePanel").css('z-index', '9');
                                                        $(".Overlay").fadeOut();

                                                    },
                                                    error: function (xhr, error) {
                                                        $('Button').prop('disabled', false);
                                                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdNamesDetails);
                                                        $(".Overlay").fadeOut();
                                                    },
                                                });
                                            }
                                        }

                                    }
                                    else {
                                        if (currentWidget.queryinfo.type == "Argos") {
                                            var downloadurl = currentWidget.ServiceUrl + "JSONPttsYearDownload/" + platFormID[k] + "/" + currentWidget.queryinfo.type + "/" + cNameyear + "/" + currentWidget.queryinfo.timeinterval;
                                        }
                                        else if (currentWidget.queryinfo.type == "GPS") {
                                            var downloadurl = currentWidget.ServiceUrl + "JSONPttsYearDownload/" + platFormID[k] + "/" + currentWidget.queryinfo.type + "/" + cNameyear + "/" + currentWidget.queryinfo.timeinterval;
                                        }
                                        else if (currentWidget.queryinfo.type == "GSM") {
                                            var downloadurl = currentWidget.ServiceUrl + "JSONPttsYearDownload/" + platFormID[k] + "/" + currentWidget.queryinfo.type + "/" + cNameyear + "/" + currentWidget.queryinfo.timeinterval;
                                        }
                                        currentWidget.ExportMobileUrls.push(downloadurl);
                                        //$("#ExportExcelMobile").attr("href", downloadurl);

                                        var requestData = {
                                            id: platFormID[k],
                                            type: currentWidget.queryinfo.type,
                                            yeardata: cNameyear,
                                            timeinterval: currentWidget.queryinfo.timeinterval,
                                            login: (configOptions.UserInfo.UserName == "") ? "/null" : "/" + configOptions.UserInfo.UserName,
                                            password: (configOptions.UserInfo.Password == "") ? "/null" : "/" + configOptions.UserInfo.Password

                                        };
                                        url = currentWidget.ServiceUrl + "jsonPttsYear/";

                                        $.ajax({

                                            url: url,
                                            type: 'POST',  // http method
                                            async: false,
                                            crossDomain: true,
                                            contentType: 'application/json',
                                            data: JSON.stringify(requestData),
                                            beforeSend: function () { $(".Overlay").fadeIn(); },
                                            success: function (result) {
                                                currentWidget.jsonObj = JSON.parse(result);
                                                var jsonObj = currentWidget.jsonObj;
                                                currentWidget.ResultantData = jsonObj;
                                                var BirdTrackingData = [];
                                                if (jsonObj.Table1.length > 0) {
                                                    if (jsonObj.Table1.length >= 30000) {
                                                        AlertMessages("warning", '', currentWidget._i18n.HugeData);
                                                        $(".Overlay").fadeOut();
                                                        return;
                                                    }

                                                    if ($(currentWidget.chkSeasonWise).is(":checked") == true) {
                                                        if ($(currentWidget.ddlYears).val() === "" || $(currentWidget.ddlYears).val() === null) {
                                                            if (jsonObj.Table2.length > 0) {
                                                                for (var k = 0; k < jsonObj.Table2.length; k++) {
                                                                    var jsonObjYearWise = jsonObj.Table1.filter(function (jsonYearinfo) {
                                                                        return jsonYearinfo.YearData == jsonObj.Table2[k].YearData;
                                                                    });
                                                                    var YearInfo = jsonObj.Table2[k].YearData;
                                                                    if (jsonObjYearWise.length > 0) {
                                                                        currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObjYearWise, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), YearInfo);
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        else {
                                                            currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObj.Table1, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), $(currentWidget.ddlYears).val());
                                                        }
                                                    }
                                                    else {
                                                        currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObj.Table1, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), "");
                                                    }
                                                    clearPointDensityLayer();
                                                    currentWidget.checkConditions = true;
                                                }
                                                else {
                                                    if (((configOptions.UserInfo.UserRole).toUpperCase() == "STANDARD") || ((configOptions.UserInfo.UserRole).toUpperCase() == "SPONSOR")) {
                                                        $(".btnstopover").css("display", "none");
                                                    }
                                                    else {
                                                        $(".btnstopover").css("display", "block");
                                                    }
                                                    currentWidget.NoDataVariable += currentWidget.queryinfo.platformid + '_' + currentWidget.queryinfo.type + ",";
                                                }
                                                count++;
                                                if (CheckCount == count) {
                                                    $('Button').prop('disabled', false);
                                                    if (((configOptions.UserInfo.UserRole).toUpperCase() == "STANDARD") || ((configOptions.UserInfo.UserRole).toUpperCase() == "SPONSOR")) {
                                                        $(".btnstopover").css("display", "none");
                                                    }
                                                    else {
                                                        $(".btnstopover").css("display", "block");
                                                    }

                                                    if (currentWidget.NoDataVariable != "") {
                                                        AlertMessages("warning", '', currentWidget._i18n.NoResultFound + " for " + currentWidget.NoDataVariable.slice(0, -1));
                                                    }
                                                }
                                                $("#ResultPagePanel").css('visibility', 'visible');
                                                $("#ResultPagePanel").css('bottom', '-265px');
                                                $("#ResultPagePanel").css('z-index', '9');
                                                $(".Overlay").fadeOut();

                                            },
                                            error: function (xhr, error) {
                                                $('Button').prop('disabled', false);
                                                AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdNamesDetails);
                                                $(".Overlay").fadeOut();
                                            },
                                        });

                                    }
                                }
                            }
                        }
                        else {
                            currentWidget.queryinfo.type = sensorName;

                            if (currentWidget.queryinfo.type == "Argos") {
                                var downloadurl = currentWidget.ServiceUrl + "JSONPttsYearDownload/" + platFormID[k] + "/" + currentWidget.queryinfo.type + "/" + cNameyear + "/" + currentWidget.queryinfo.timeinterval;
                            }
                            else if (currentWidget.queryinfo.type == "GPS") {
                                var downloadurl = currentWidget.ServiceUrl + "JSONPttsYearDownload/" + platFormID[k] + "/" + currentWidget.queryinfo.type + "/" + cNameyear + "/" + currentWidget.queryinfo.timeinterval;
                            }
                            else if (currentWidget.queryinfo.type == "GSM") {
                                var downloadurl = currentWidget.ServiceUrl + "JSONPttsYearDownload/" + platFormID[k] + "/" + currentWidget.queryinfo.type + "/" + cNameyear + "/" + currentWidget.queryinfo.timeinterval;
                            }
                            currentWidget.ExportMobileUrls.push(downloadurl);
                            //$("#ExportExcelMobile").attr("href", downloadurl);

                            var requestData = {
                                id: platFormID[k],
                                type: currentWidget.queryinfo.type,
                                yeardata: cNameyear,
                                timeinterval: currentWidget.queryinfo.timeinterval,
                                login: (configOptions.UserInfo.UserName == "") ? "/null" : "/" + configOptions.UserInfo.UserName,
                                password: (configOptions.UserInfo.Password == "") ? "/null" : "/" + configOptions.UserInfo.Password

                            };
                            var url = currentWidget.ServiceUrl + "jsonPttsYear/";
                            $.ajax({
                                url: url,
                                type: 'POST',  // http method
                                async: false,
                                crossDomain: true,
                                contentType: 'application/json',
                                data: JSON.stringify(requestData),
                                beforeSend: function () { $(".Overlay").fadeIn(); },
                                success: function (result) {
                                    currentWidget.jsonObj = JSON.parse(result);
                                    var jsonObj = currentWidget.jsonObj;
                                    currentWidget.ResultantData = jsonObj;
                                    var BirdTrackingData = [];
                                    if (jsonObj.Table1.length > 0) {
                                        //if (jsonObj.Table1.length >= 30000) {
                                        //    AlertMessages("warning", '', currentWidget._i18n.HugeData);
                                        //    $(".Overlay").fadeOut();
                                        //    return;
                                        //}
                                        if ($(currentWidget.chkSeasonWise).is(":checked") == true) {
                                            if ($(currentWidget.ddlYears).val() === "" || $(currentWidget.ddlYears).val() === null) {
                                                if (jsonObj.Table2.length > 0) {
                                                    for (var k = 0; k < jsonObj.Table2.length; k++) {
                                                        var jsonObjYearWise = jsonObj.Table1.filter(function (jsonYearinfo) {
                                                            return jsonYearinfo.YearData == jsonObj.Table2[k].YearData;
                                                        });
                                                        var YearInfo = jsonObj.Table2[k].YearData;
                                                        if (jsonObjYearWise.length > 0) {
                                                            currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObjYearWise, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), YearInfo);
                                                        }
                                                    }
                                                }
                                            }
                                            else {
                                                currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObj.Table1, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), $(currentWidget.ddlYears).val());
                                            }
                                        }
                                        else {
                                            currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObj.Table1, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), "");
                                        }
                                        clearPointDensityLayer();
                                        //currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObj.Table1, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"), "");
                                        currentWidget.checkConditions = true;
                                    }
                                    else {
                                        if (((configOptions.UserInfo.UserRole).toUpperCase() == "STANDARD") || ((configOptions.UserInfo.UserRole).toUpperCase() == "SPONSOR")) {
                                            $(".btnstopover").css("display", "none");
                                        }
                                        else {
                                            $(".btnstopover").css("display", "block");
                                        }
                                        currentWidget.NoDataVariable += currentWidget.queryinfo.platformid + '_' + currentWidget.queryinfo.type + ",";
                                    }
                                    count++;
                                    if (CheckCount == count) {
                                        $('Button').prop('disabled', false);
                                        if (((configOptions.UserInfo.UserRole).toUpperCase() == "STANDARD") || ((configOptions.UserInfo.UserRole).toUpperCase() == "SPONSOR")) {
                                            $(".btnstopover").css("display", "none");
                                        }
                                        else {
                                            $(".btnstopover").css("display", "block");
                                        }

                                        if (currentWidget.NoDataVariable != "") {
                                            AlertMessages("warning", '', currentWidget._i18n.NoResultFound + " for " + currentWidget.NoDataVariable.slice(0, -1));
                                        }
                                    }
                                    $("#ResultPagePanel").css('visibility', 'visible');
                                    $("#ResultPagePanel").css('bottom', '-265px');
                                    $("#ResultPagePanel").css('z-index', '9');
                                    $(".Overlay").fadeOut();

                                },
                                error: function (xhr, error) {
                                    $('Button').prop('disabled', false);
                                    AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdNamesDetails);
                                    $(".Overlay").fadeOut();
                                },
                            });
                        }
                    }
                };
            }
            catch (err) {
                console.log(err);
                throw err;
            }

        },

        getBirdNameResultCount1: function () {
            try {
                var currentWidget = this;
                $(".Overlay").fadeIn();
                //var isHugeData = false;
                currentWidget.queryinfo.platformidList = "";
                var speciesName = $(currentWidget.ddlSpeciesName).val();
                var timeIntervals = $(currentWidget.ddltimeInterval).val();
                var platFormID = $(currentWidget.divPlatFormIds).val();
                this.queryinfo.settype($(currentWidget.dddlSensorType).val());
                var cNameyear = $(currentWidget.ddlYears).val();
                var timeinterval = $(currentWidget.ddltimeInterval).val();
                this.queryinfo.timeinterval = timeinterval;
                $(currentWidget.lblSpeciesName).css("display", "none");
                $(currentWidget.lblSensorCategory).css("display", "none");
                $(currentWidget.lblSensortName).css("display", "none");
                $(currentWidget.lblSensorYear).css("display", "none");
                $(currentWidget.lblplatformID).css("display", "none");
                var Datacount = 0;

                if ($(currentWidget.ddlYears).val() === "" || $(currentWidget.ddlYears).val() === null) {
                    cNameyear = "9999";
                }

                var formIsValid = true;
                if (speciesName == "") {
                    $(currentWidget.lblSpeciesName).css("display", "block");
                    formIsValid = false;
                }
                if (platFormID.length == 0) {
                    $(currentWidget.lblplatformID).css("display", "block");
                    formIsValid = false;
                }

                if (formIsValid == false) {
                    $(".Overlay").fadeOut();
                    return;
                }
                this.queryinfo.timeinterval = timeIntervals == "" ? null : timeinterval;
                this.queryinfo.year = cNameyear;

                for (var k = 0; k < platFormID.length; k++) {
                    currentWidget.queryinfo.platformid = platFormID[k];
                    if (currentWidget.queryinfo.platformidList == "") {
                        currentWidget.queryinfo.platformidList = platFormID[k];
                        if (currentWidget.isgetPTTDSSelected == true) {
                            for (i = 0; i < currentWidget.BirdIdSensorType.length; i++) {
                                var assignedid = currentWidget.BirdIdSensorType[i].split("_");
                                if (currentWidget.queryinfo.platformidList == assignedid[0]) {
                                    currentWidget.queryinfo.type = assignedid[1];
                                }
                            }
                        }
                    }
                    else {
                        currentWidget.queryinfo.platformidList = currentWidget.queryinfo.platformidList + "," + platFormID[k];
                        if (currentWidget.isgetPTTDSSelected == true) {
                            for (i = 0; i < currentWidget.BirdIdSensorType.length; i++) {
                                var assignedid = currentWidget.BirdIdSensorType[i].split("_");
                                if (currentWidget.queryinfo.platformid == assignedid[0]) {
                                    currentWidget.queryinfo.type = assignedid[1];
                                }
                            }
                        }
                    }
                    var url;
                    if (typeof (currentWidget.queryinfo.type) == 'undefined') {
                        for (var i = 0; i < currentWidget.birdInfo.length; i++) {
                            if (currentWidget.birdInfo[i].PTTD == platFormID[k]) {
                                var requestData = {
                                    id: platFormID[k],
                                    type: currentWidget.birdInfo[i].TYPE,
                                    yeardata: cNameyear,
                                    timeinterval: currentWidget.queryinfo.timeinterval
                                };
                                url = currentWidget.ServiceUrl + "jsonPttsYear/";
                            }
                        }
                    }
                    else {
                        var requestData = {
                            id: platFormID[k],
                            type: currentWidget.queryinfo.type,
                            yeardata: cNameyear,
                            timeinterval: currentWidget.queryinfo.timeinterval,
                            login: (configOptions.UserInfo.UserName == "") ? "/null" : "/" + configOptions.UserInfo.UserName,
                            password: (configOptions.UserInfo.Password == "") ? "/null" : "/" + configOptions.UserInfo.Password
                        };
                        url = currentWidget.ServiceUrl + "jsonPttsYear/";
                    }

                    $.ajax({
                        url: url,
                        type: 'POST',  // http method
                        async: false,
                        crossDomain: true,
                        contentType: 'application/json',
                        data: JSON.stringify(requestData),
                        beforeSend: function () { $(".Overlay").fadeIn(); },
                        success: function (result) {
                            currentWidget.jsonObj = JSON.parse(result);
                            var jsonObj = currentWidget.jsonObj;
                            currentWidget.ResultantData = jsonObj;

                            if (jsonObj.Table1.length > 0) {
                                Datacount = Datacount + jsonObj.Table1.length;
                            }
                        },
                        error: function (xhr, error) {
                            AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdNamesDetails);
                            $(".Overlay").fadeOut();
                        },
                    });

                };
                return Datacount;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        },

        getBirdNameResultCount: function () {
            try {
                var currentWidget = this;
                $(".Overlay").fadeIn();
                currentWidget.queryinfo.platformidList = "";
                var speciesName = $(currentWidget.ddlSpeciesName).val();
                var timeIntervals = $(currentWidget.ddltimeInterval).val();
                var platFormID = $(currentWidget.divPlatFormIds).val();
                this.queryinfo.settype($(currentWidget.dddlSensorType).val());
                var cNameyear = $(currentWidget.ddlYears).val();
                var timeinterval = $(currentWidget.ddltimeInterval).val();
                this.queryinfo.timeinterval = timeinterval;
                $(currentWidget.lblSpeciesName).css("display", "none");
                $(currentWidget.lblSensorCategory).css("display", "none");
                $(currentWidget.lblSensortName).css("display", "none");
                $(currentWidget.lblSensorYear).css("display", "none");
                $(currentWidget.lblplatformID).css("display", "none");
                var Datacount = 0;

                if ($(currentWidget.ddlYears).val() === "" || $(currentWidget.ddlYears).val() === null) {
                    cNameyear = "9999";
                }

                var formIsValid = true;
                if (speciesName == "") {
                    $(currentWidget.lblSpeciesName).css("display", "block");
                    formIsValid = false;
                }
                if (platFormID.length == 0) {
                    $(currentWidget.lblplatformID).css("display", "block");
                    formIsValid = false;
                }

                if (formIsValid == false) {
                    $(".Overlay").fadeOut();
                    return;
                }
                this.queryinfo.timeinterval = timeIntervals == "" ? null : timeinterval;
                this.queryinfo.year = cNameyear;

                for (var k = 0; k < platFormID.length; k++) {
                    currentWidget.queryinfo.platformid = platFormID[k];
                    if (currentWidget.queryinfo.platformidList == "") {
                        currentWidget.queryinfo.platformidList = platFormID[k];
                        if (currentWidget.isgetPTTDSSelected == true) {
                            for (i = 0; i < currentWidget.BirdIdSensorType.length; i++) {
                                var assignedid = currentWidget.BirdIdSensorType[i].split("_");
                                if (currentWidget.queryinfo.platformidList == assignedid[0]) {
                                    currentWidget.queryinfo.type = assignedid[1];
                                }
                                else {
                                    currentWidget.queryinfo.type = "";
                                }
                                var url;
                                if (currentWidget.queryinfo.type != "") {
                                    if (typeof (currentWidget.queryinfo.type) == 'undefined') {
                                        for (var i = 0; i < currentWidget.birdInfo.length; i++) {
                                            if (currentWidget.birdInfo[i].PTTD == platFormID[k]) {
                                                var requestData = {
                                                    id: platFormID[k],
                                                    type: currentWidget.birdInfo[i].TYPE,
                                                    yeardata: cNameyear,
                                                    timeinterval: currentWidget.queryinfo.timeinterval,
                                                    login: (configOptions.UserInfo.UserName == "") ? "/null" : "/" + configOptions.UserInfo.UserName,
                                                    password: (configOptions.UserInfo.Password == "") ? "/null" : "/" + configOptions.UserInfo.Password

                                                };
                                                url = currentWidget.ServiceUrl + "jsonPttsYear/";
                                                $.ajax({
                                                    url: url,
                                                    async: false,
                                                    type: 'POST',  // http method 
                                                    crossDomain: true,
                                                    contentType: 'application/json',
                                                    data: JSON.stringify(requestData),
                                                    success: function (result) {
                                                        currentWidget.jsonObj = JSON.parse(result);
                                                        var jsonObj = currentWidget.jsonObj;
                                                        currentWidget.ResultantData = jsonObj;

                                                        if (jsonObj.Table1.length > 0) {
                                                            Datacount = Datacount + jsonObj.Table1.length;
                                                        }
                                                    },
                                                    error: function (xhr, error) {
                                                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdNamesDetails);
                                                        $(".Overlay").fadeOut();
                                                    },
                                                });
                                            }

                                        }
                                    }
                                    else {
                                        var requestData = {
                                            id: platFormID[k],
                                            type: currentWidget.queryinfo.type,
                                            yeardata: cNameyear,
                                            timeinterval: currentWidget.queryinfo.timeinterval,
                                            login: (configOptions.UserInfo.UserName == "") ? "/null" : "/" + configOptions.UserInfo.UserName,
                                            password: (configOptions.UserInfo.Password == "") ? "/null" : "/" + configOptions.UserInfo.Password

                                        };
                                        url = currentWidget.ServiceUrl + "jsonPttsYear/";
                                        $.ajax({
                                            url: url,
                                            async: false,
                                            type: 'POST',  // http method 
                                            crossDomain: true,
                                            contentType: 'application/json',
                                            data: JSON.stringify(requestData),
                                            success: function (result) {
                                                currentWidget.jsonObj = JSON.parse(result);
                                                var jsonObj = currentWidget.jsonObj;
                                                currentWidget.ResultantData = jsonObj;

                                                if (jsonObj.Table1.length > 0) {
                                                    Datacount = Datacount + jsonObj.Table1.length;
                                                }
                                            },
                                            error: function (xhr, error) {
                                                AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdNamesDetails);
                                                $(".Overlay").fadeOut();
                                            },
                                        });
                                    }
                                }




                            }
                        }
                        else {
                            var requestData = {
                                id: platFormID[k],
                                type: currentWidget.queryinfo.type,
                                yeardata: cNameyear,
                                timeinterval: currentWidget.queryinfo.timeinterval,
                                login: (configOptions.UserInfo.UserName == "") ? "/null" : "/" + configOptions.UserInfo.UserName,
                                password: (configOptions.UserInfo.Password == "") ? "/null" : "/" + configOptions.UserInfo.Password

                            };
                            url = currentWidget.ServiceUrl + "jsonPttsYear/" ;
                            $.ajax({
                                url: url,
                                async: false,
                                type: 'POST',  // http method 
                                crossDomain: true,
                                contentType: 'application/json',
                                data: JSON.stringify(requestData),
                                success: function (result) {
                                    currentWidget.jsonObj = JSON.parse(result);
                                    var jsonObj = currentWidget.jsonObj;
                                    currentWidget.ResultantData = jsonObj;

                                    if (jsonObj.Table1.length > 0) {
                                        Datacount = Datacount + jsonObj.Table1.length;
                                    }
                                },
                                error: function (xhr, error) {
                                    AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdNamesDetails);
                                    $(".Overlay").fadeOut();
                                },
                            });
                        }
                    }
                    else {
                        currentWidget.queryinfo.platformidList = currentWidget.queryinfo.platformidList + "," + platFormID[k];
                        if (currentWidget.isgetPTTDSSelected == true) {
                            for (i = 0; i < currentWidget.BirdIdSensorType.length; i++) {
                                var assignedid = currentWidget.BirdIdSensorType[i].split("_");
                                if (currentWidget.queryinfo.platformid == assignedid[0]) {
                                    currentWidget.queryinfo.type = assignedid[1];
                                }
                                else {
                                    currentWidget.queryinfo.type = "";
                                }
                                var url;
                                if (currentWidget.queryinfo.type != "") {
                                    if (typeof (currentWidget.queryinfo.type) == 'undefined') {
                                        for (var i = 0; i < currentWidget.birdInfo.length; i++) {
                                            if (currentWidget.birdInfo[i].PTTD == platFormID[k]) {
                                                var requestData = {
                                                    id: platFormID[k],
                                                    type: currentWidget.birdInfo[i].TYPE,
                                                    yeardata: cNameyear,
                                                    timeinterval: currentWidget.queryinfo.timeinterval,
                                                    login: (configOptions.UserInfo.UserName == "") ? "/null" : "/" + configOptions.UserInfo.UserName,
                                                    password: (configOptions.UserInfo.Password == "") ? "/null" : "/" + configOptions.UserInfo.Password

                                                };
                                                url = currentWidget.ServiceUrl + "jsonPttsYear/";
                                                $.ajax({
                                                    url: url,
                                                    async: false,
                                                    type: 'POST',  // http method 
                                                    crossDomain: true,
                                                    contentType: 'application/json',
                                                    data: JSON.stringify(requestData),
                                                    success: function (result) {
                                                        currentWidget.jsonObj = JSON.parse(result);
                                                        var jsonObj = currentWidget.jsonObj;
                                                        currentWidget.ResultantData = jsonObj;

                                                        if (jsonObj.Table1.length > 0) {
                                                            Datacount = Datacount + jsonObj.Table1.length;
                                                        }
                                                    },
                                                    error: function (xhr, error) {
                                                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdNamesDetails);
                                                        $(".Overlay").fadeOut();
                                                    },
                                                });
                                            }

                                        }
                                    }
                                    else {
                                        var requestData = {
                                            id: platFormID[k],
                                            type: currentWidget.queryinfo.type,
                                            yeardata: cNameyear,
                                            timeinterval: currentWidget.queryinfo.timeinterval,
                                            login: (configOptions.UserInfo.UserName == "") ? "/null" : "/" + configOptions.UserInfo.UserName,
                                            password: (configOptions.UserInfo.Password == "") ? "/null" : "/" + configOptions.UserInfo.Password

                                        };
                                        url = currentWidget.ServiceUrl + "jsonPttsYear/";
                                        $.ajax({
                                            url: url,
                                            async: false,
                                            type: 'POST', 
                                            crossDomain: true,
                                            contentType: 'application/json',
                                            data: JSON.stringify(requestData),
                                            success: function (result) {
                                                currentWidget.jsonObj = JSON.parse(result);
                                                var jsonObj = currentWidget.jsonObj;
                                                currentWidget.ResultantData = jsonObj;

                                                if (jsonObj.Table1.length > 0) {
                                                    Datacount = Datacount + jsonObj.Table1.length;
                                                }
                                            },
                                            error: function (xhr, error) {
                                                AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdNamesDetails);
                                                $(".Overlay").fadeOut();
                                            },
                                        });
                                    }
                                }

                            }
                        }
                        else {
                            var requestData = {
                                id: platFormID[k],
                                type: currentWidget.queryinfo.type,
                                yeardata: cNameyear,
                                timeinterval: currentWidget.queryinfo.timeinterval,
                                login: (configOptions.UserInfo.UserName == "") ? "/null" : "/" + configOptions.UserInfo.UserName,
                                password: (configOptions.UserInfo.Password == "") ? "/null" : "/" + configOptions.UserInfo.Password

                            };
                            url = currentWidget.ServiceUrl + "jsonPttsYear/";
                            $.ajax({
                                url: url,
                                async: false,
                                type: 'POST', 
                                crossDomain: true,
                                contentType: 'application/json',
                                data: JSON.stringify(requestData),
                                success: function (result) {
                                    currentWidget.jsonObj = JSON.parse(result);
                                    var jsonObj = currentWidget.jsonObj;
                                    currentWidget.ResultantData = jsonObj;

                                    if (jsonObj.Table1.length > 0) {
                                        Datacount = Datacount + jsonObj.Table1.length;
                                    }
                                },
                                error: function (xhr, error) {
                                    AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdNamesDetails);
                                    $(".Overlay").fadeOut();
                                },
                            });
                        }
                    }

                };
                return Datacount;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        },

        getBirdNameResultValidate: function () {
            try {
                var currentWidget = this;
                var speciesName = $(currentWidget.ddlSpeciesName).val();
                var platFormID = $(currentWidget.divPlatFormIds).val();
                $(currentWidget.lblSpeciesName).css("display", "none");
                $(currentWidget.lblplatformID).css("display", "none");

                var formIsValid = true;
                if (speciesName == "") {
                    $(currentWidget.lblSpeciesName).css("display", "block");
                    formIsValid = false;
                }
                if (platFormID.length == 0) {
                    $(currentWidget.lblplatformID).css("display", "block");
                    formIsValid = false;
                }

                if (formIsValid == false) {
                    $(".Overlay").fadeOut();
                    return;
                }
                var isDataCount = currentWidget.getBirdNameResultCount();
                //if (isDataCount >= 30000) {
                //    AlertMessages("warning", '', currentWidget._i18n.NoDataFound);
                //    $(".Overlay").fadeOut();
                //    return;
                //}
                //else {
                //    currentWidget.getBirdNameResult();
                //}
                currentWidget.getBirdNameResult();
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        },

    });



});