define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'esri/toolbars/draw',
    'esri/tasks/geometry',
    'esri/tasks/query',
    'esri/geometry/Point',
    'esri/graphic',
    'dojo/topic',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleFillSymbol',
    "dojo/_base/Color",
    "esri/layers/GraphicsLayer",
    "esri/renderers/DotDensityRenderer",

    "dojo/text!emap/SponsorBirdTrackingPPTID/template/SponsorBirdTrackingPPTID.html",

    "dojo/i18n!emap/SponsorBirdTrackingPPTID/nls/resource",

], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, Draw, geometryService, Query, Point,
    Graphic, topic, SimpleLineSymbol, SimpleFillSymbol, Color, GraphicsLayer, DotDensityRenderer, dijitTemplate,
    i18n) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: dijitTemplate,
        widgetsInTemplate: true,
        i18n: i18n,
        map: null,
        title: i18n.title,
        domNode: null,
        toolbar: null,
        defaultSymbol: null,
        pointFeatures: null,
        geometryService: null,
        queryinfo: null,
        currentuser: null,
        configOptions: null,
        tempsymbol: null,
        ServiceUrl: null,
        queryResultsWidget: null,
        StopOverResults: null,
        jsonObj: null,
        animateResults: null,
        checkConditions: false,
        globalCurrentWidget: null,
        publicassignedids: [],
        publicidschecked: [],
        sensortyperesults: [],
        isdatavailable: false,
        NoDataVariable: null,
        PlatformIDList: [],
        SponcerBasedIDs: [],
        PublicBasedIDs:[],
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
            globalCurrentWidget = this;

            topic.subscribe('mapClickMode/ClearWidgets', lang.hitch(this, function () {

                currentwidget.ClearControls();
            }));
            this.inherited(arguments);
            $(".dateclass").datepicker();
            this.queryinfo = {
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
                platformid: $(this.ddlBirdname).val(),
                locclass: $(this.locationclasses).val(),
                platformidList: $(this.divPlatFormIds).val(),
                SensorList: "",
                year: "",
                fromdate: $(this.fromdate).val(),
                todate: $(this.todate).val(),
                timeinterval: $(this.timeinterval).val(),
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
                currentwidget.StopOverResults.queryinfo = currentwidget.queryinfo;
                $(".StopOverdiv").animate({
                    right: "0px"
                }, 200);
                $("#SlidePanel .card-body").css("overflow-y", "hidden");
                $("#LayersPanel .card-body").css("overflow-y", "scroll");

            });

            $(".closeStop").click(function () {
                $(".StopOverdiv").css("display", "none");
                $(".StopOverdiv").animate({
                    right: "-320px"
                }, 200);
                $(".card-body").css("overflow-y", "scroll");
            });
            $(currentwidget.animate).click(function () {
                $(".Overlay").fadeIn();
                var birdname = $(currentwidget.ddlBirdname).val();
                var birdid = [];
                var birdtype = [];
                for (var j = 0; j < birdname.length; j++) {
                    var pidarray = birdname[j].split("_");
                    birdid.push(pidarray[0]);
                    birdtype.push(pidarray[1]);
                }
                currentwidget.queryinfo.fromdate = $(currentwidget.fromdate).val();
                currentwidget.queryinfo.todate = $(currentwidget.todate).val();
                currentwidget.queryinfo.locclass = $(currentwidget.locationclasses).val();
                currentwidget.queryinfo.seasonWise = $(currentwidget.chkSeasonWise).is(":checked");
                $(currentwidget.lblSensortype).css("display", "none");
                $(currentwidget.lblplatformid).css("display", "none");
                $(currentwidget.lblfromdate).css("display", "none");
                $(currentwidget.lbltodate).css("display", "none");
                $(currentwidget.lblgreater).css("display", "none");
                var formIsValid = true;
                if (currentwidget.queryinfo.fromdate == "") {
                    $(currentwidget.lblfromdate).css("display", "block");
                    formIsValid = false;
                }
                if (currentwidget.queryinfo.todate == "") {
                    $(currentwidget.lbltodate).css("display", "block");
                    formIsValid = false;
                }
                var isvalid = CheckDatesCompare(currentwidget.queryinfo.fromdate, currentwidget.queryinfo.todate);
                if (isvalid == false) {
                    $(currentwidget.lblgreater).css("display", "block");
                    formIsValid = false;
                }
                if (formIsValid == false) {
                    $(".Overlay").fadeOut();
                    return;
                }
                currentwidget.animateResults.queryinfo = currentwidget.queryinfo;
                if (currentwidget.checkConditions == true) {
                    currentwidget.animateResults.SponserAnimation(birdid, birdtype);
                }
                else {
                    currentwidget.queryinfo.fromdate = $(currentwidget.fromdate).val();
                    currentwidget.queryinfo.todate = $(currentwidget.todate).val();
                    currentwidget.queryinfo.timeinterval = $(currentwidget.timeinterval).val();
                    currentwidget.queryinfo.locclass = $(currentwidget.locationclasses).val();
                    currentwidget.queryinfo.seasonWise = $(currentwidget.chkSeasonWise).is(":checked");
                    var timeinterval = (currentwidget.queryinfo.timeinterval.trim() == "") ? "null" : currentwidget.queryinfo.timeinterval.trim();
                    var data = "";
                    currentwidget.animateResults.SponserAnimation(birdid, birdtype);
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
        },


        startup: function () {
            var currentWidget = this;
            $(currentWidget.locationclasses).hide();
            $(currentWidget.location).hide();
            currentWidget.getpublicassignids();
            currentWidget.getplatformid();
           
        },

        ClearControls: function () {
            var currentWidget = this;
            $(currentWidget.locationclasses).val("");
            $(currentWidget.fromdate).val("");
            $(currentWidget.todate).val("");
            $(currentWidget.timeinterval).val("");
            $(".stopoverclass").css("display", "none");
            $(currentWidget.lblSensortype).css("display", "none");
            $(currentWidget.lblplatformid).css("display", "none");
            $(currentWidget.lblfromdate).css("display", "none");
            $(currentWidget.lbltodate).css("display", "none");
            $(currentWidget.lblgreater).css("display", "none");
            $(currentWidget.chkSeasonWise).prop('checked', false);

        },
        ClearRecords: function () {
            var currentWidget = this;
            $(".stopoverclass").css("display", "none");

            $(currentWidget.lblplatformid).css("display", "none");
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
        getpublicassignids: function () {
            var currentWidget = this;
            var AssignedBirds = "";
            var requestData = {
                GroupName: "Public"
            };
            var url = configOptions.ServiceUrl + 'JsonGetGroupAssignedIDs/';
            $.ajax({
                url: url,
                type: 'POST',  // http method
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {
                    var jsonObj = JSON.parse(result);
                    if (jsonObj.Table1.length > 0) {
                        currentWidget.publicassignedids = jsonObj.Table1[0].AssignIDs;
                        currentWidget.PublicBasedIDs = jsonObj.Table1[0].SensorType.split(",");
                    }
                },
                error: function (xhr, error) {
                    console.debug(xhr); console.debug(error);
                },
            });
        },
        getsponsorbirdnames: function (PTTDIDs) {
            var currentWidget = this;
            var AssignedBirds = "";
            var requestData = {
                id: PTTDIDs
            };
            var url = configOptions.ServiceUrl + 'JsonGetSponsorBirdsName/';
            $.ajax({
                url: url,
                type: 'POST',  // http method
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {
                    $(currentWidget.ddlBirdname).html("");
                    var jsonObj = JSON.parse(result);
                    if (jsonObj.Table.length > 0) {
                        for (i = 0; i < jsonObj.Table.length; i++) {
                            $(currentWidget.ddlBirdname).append('<option value="' + encodeURIComponent(jsonObj.Table[i]["PTTD"] + "_" + jsonObj.Table[i]["Type"]) + '">' + encodeURIComponent(jsonObj.Table[i]["BirdName"]) + '</option>')
                        }
                        $(currentWidget.ddlBirdname).SumoSelect({ search: true, selectAll: true, okCancelInMulti: true });
                        $(currentWidget.ddlBirdname)[0].sumo.reload();
                    }

                },
                error: function (xhr, error) {
                    console.debug(xhr); console.debug(error);
                },
            });
        },
        getplatformid: function () {
            var currentWidget = this;
            $(".stopoverclass").css("display", "none");
            $(".Densityclass").css("display", "none");
            var UserName = configOptions.UserInfo.UserName;
            var requestData = {
                login: configOptions.UserInfo.UserName
            };
            var url = currentwidget.ServiceUrl + 'JsonGetUserAssinedBirdsDtls/';
            $.ajax({
                url: url,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                crossDomain: true,

                success: function (result) {
                    var jsonObj = JSON.parse(result);
                    if (jsonObj != null) {
                        var strAssignBirds = jsonObj.AssignedBirds;
                        var PTTDIDs = strAssignBirds.replaceAll(" ", ",");
                        var SensorType = jsonObj.Sensortype.split(" ");  
                        if (currentWidget.publicidschecked == true) {
                            if (currentWidget.publicassignedids != undefined) {
                                PTTDIDs += "," + currentWidget.publicassignedids.replaceAll(",", ",");
                                var TotalBirdsIDs = configOptions.SponsorandPublicID.concat(currentWidget.PublicBasedIDs);

                                configOptions.SponsorandPublicID = TotalBirdsIDs;
                            }
                        }
                        else {
                            PTTDIDs = strAssignBirds.replaceAll(" ", ",");

                            currentWidget.SponcerBasedIDs = jsonObj.Sensortype.split(" ");
                            configOptions.SponsorandPublicID = currentWidget.SponcerBasedIDs;
                        }
                        currentWidget.GetSponsorSensorValues(configOptions.SponsorandPublicID);
                        currentWidget.getsponsorbirdnames(PTTDIDs);
                    }

                },
                error: function (xhr, error) {
                    var currentWidget = this;
                    AlertMessages('error', '', currentWidget._i18n.UnabletogetAssignedids);
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

            var timeinterval = (this.queryinfo.timeinterval.trim() == "") ? "null" : this.queryinfo.timeinterval.trim();
            if (this.queryinfo.type == "Argos") {
                var data = {
                    id: this.queryinfo.platformid,
                    locCls: (this.queryinfo.locclass.trim() == "") ? "null" : this.queryinfo.locclass.trim(),
                    fromdate: this.queryinfo.fromdate,
                    todate: this.queryinfo.todate,
                    filter: timeinterval,
                    login: (configOptions.UserInfo.UserName == "") ? "null" : configOptions.UserInfo.UserName,
                    password: (configOptions.UserInfo.Password == "") ? "null" : configOptions.UserInfo.Password
                };
            }
            else if (this.queryinfo.type == "GPS" || this.queryinfo.type == "GSM") {
                var data = {
                    id: this.queryinfo.platformid,
                    locCls: "null",
                    fromdate: this.queryinfo.fromdate,
                    todate: this.queryinfo.todate,
                    filter: timeinterval,
                    login: (configOptions.UserInfo.UserName == "") ? "null" : configOptions.UserInfo.UserName,
                    password: (configOptions.UserInfo.Password == "") ? "null" : configOptions.UserInfo.Password
                };
            }
            return data;
        },
        PrepareArguments1: function () {
            var data = "";
            var timeinterval = (this.queryinfo.timeinterval.trim() == "") ? "null" : this.queryinfo.timeinterval.trim();
            if (this.queryinfo.type == "Argos") {
                data = this.queryinfo.platformid;
                data += (this.queryinfo.locclass.trim() == "") ? "/null" : "/" + this.queryinfo.locclass.trim();
                data += "/" + this.queryinfo.fromdate + "/" + this.queryinfo.todate + "/" + timeinterval;
                data += this.adduserdetails();
            }
            else if (this.queryinfo.type == "GPS" || this.queryinfo.type == "GSM") {
                data = this.queryinfo.platformid;
                data += "/" + this.queryinfo.fromdate + "/" + this.queryinfo.todate + "/" + timeinterval;
                data += this.adduserdetails();
            }
            return data;
        },


        CheckFloatValue: function (val) {
            if (parseFloat(val) == null) {
                return false;
            }
            else if (isNaN(parseFloat(val))) {
                return false;
            }
            else {
                return true;
            }
        },
        getColorCode: function () {
            var makeColorCode = '0123456789ABCDEF';
            var code = '#';
            for (var count = 0; count < 6; count++) {
                code = code + makeColorCode[Math.floor(Math.random() * 16)];
            }
            return code;
        },
        getresults: function () {
            var currentWidget = this;
            clearPointDensityLayer();
            $(currentWidget.lblplatformid).css("display", "none");
            $(currentWidget.lblfromdate).css("display", "none");
            $(currentWidget.lbltodate).css("display", "none");
            $(currentWidget.lblgreater).css("display", "none");
            $(".Densityclass").css("display", "block");
            currentWidget.queryinfo.fromdate = $(currentWidget.fromdate).val();
            currentWidget.queryinfo.todate = $(currentWidget.todate).val();
            currentWidget.queryinfo.timeinterval = $(currentWidget.timeinterval).val();
            currentWidget.queryinfo.locclass = $(currentWidget.locationclasses).val();
            var formIsValid = true;
            if (currentWidget.ddlBirdname == "" || currentWidget.ddlBirdname == null) {
                $(currentWidget.lblplatformid).css("display", "block");
                formIsValid = false;
            }
            if (currentWidget.queryinfo.fromdate == "") {
                $(currentWidget.lblfromdate).css("display", "block");
                formIsValid = false;
            }
            if (currentWidget.queryinfo.todate == "") {
                $(currentWidget.lbltodate).css("display", "block");
                formIsValid = false;
            }
            var isvalid = CheckDatesCompare(currentWidget.queryinfo.fromdate, currentWidget.queryinfo.todate);
            if (isvalid == false) {
                $(currentWidget.lblgreater).css("display", "block");
                formIsValid = false;
            }
            if (formIsValid == false) {
                $(".Overlay").fadeOut();
                return;
            }
            var CheckCount = $(currentWidget.ddlBirdname).val().length;
            $('Button').prop('disabled', true);
            $(".Overlay").fadeIn();
            var count = 0;
            for (i = 0; i < $(currentWidget.ddlBirdname).val().length; i++) {
                var assignedid = $(currentWidget.ddlBirdname).val()[i].split("_");
                currentWidget.queryinfo.platformid = assignedid[0];
                var sensor = assignedid[1];
                currentWidget.queryinfo.type = assignedid[1];
                if (sensor == "Argos") {
                    currentWidget.queryinfo.type = "Argos";
                    currentWidget.queryinfo.funcname = "jsonArgos";
                }
                else if (sensor == "GPS") {
                    currentWidget.queryinfo.type = "GPS";
                    currentWidget.queryinfo.funcname = "jsonGPSData";
                }
                else if (sensor == "GSM") {
                    currentWidget.queryinfo.type = "GSM";
                    currentWidget.queryinfo.funcname = "jsonGSMData";
                }
                
                var requestdata = currentWidget.PrepareArguments();
                //var data = currentWidget.PrepareArguments1();
                var url = currentWidget.ServiceUrl + currentWidget.queryinfo.funcname + "/";
                $(".Overlay").fadeIn();
                $.ajax({
                    url:url,
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestdata),
                    async: true,
                    beforeSend: function () { $(".Overlay").fadeIn(); },
                    success: function (result) {
                        var jsonObj = null;
                        jsonObj = JSON.parse(result);
                        //currentWidget.queryinfo.type = sensor;
                        //if (result.hasOwnProperty('JSONGSMDataResult')) {
                        //    jsonObj = JSON.parse(result);
                        //    currentWidget.queryinfo.type = "GSM";

                        //} else if (result.hasOwnProperty('JSONGPSDataResult')) {
                        //    jsonObj = JSON.parse(result);
                        //    currentWidget.queryinfo.type = "GPS";
                        //}
                        //else if (result.hasOwnProperty('JSONArgosDataResult')) {
                        //    jsonObj = JSON.parse(result);
                        //    currentWidget.queryinfo.type = "Argos";
                        //}
                        currentWidget.jsonObj = jsonObj;
                        if (jsonObj != null) {
                            currentWidget.sensortyperesults.push(jsonObj);
                            if (jsonObj.Table1.length == 0) {
                                AlertMessages("warning", '', currentWidget._i18n.NoResultFound);
                            }                            
                            currentWidget.pointFeatures = jsonObj;                            
                        }
                        else {                            
                            $(currentWidget.lblerror).show();
                            $(".Overlay").fadeOut();
                            return;
                        }
                        var BirdTrackingData = [];
                        if (jsonObj.Table1.length > 0) {
                            currentWidget.queryResultsWidget.AddFeaturesToMap1(jsonObj.Table1, "", null, currentWidget.queryinfo, BirdTrackingData, $(currentWidget.chkSeasonWise).is(":checked"));
                            currentWidget.checkConditions = true;
                            currentWidget.isdatavailable = true;
                        }
                        count++;
                        if (CheckCount == count) {
                            $('Button').prop('disabled', false);
                            $(".Overlay").fadeOut();
                            if (((configOptions.UserInfo.UserRole).toUpperCase() == "STANDARD") || ((configOptions.UserInfo.UserRole).toUpperCase() == "SPONSOR")) {
                                $(".stopoverclass").css("display", "none");
                            }
                            else {
                                $(".stopoverclass").css("display", "block");
                            }
                            if (currentWidget.isdatavailable == false) {
                                AlertMessages("warning", '', currentWidget._i18n.NoResultFound);
                                $(".Overlay").fadeOut();
                            }
                        }
                        $("#ResultPagePanel").css('visibility', 'visible');
                        $("#ResultPagePanel").css('bottom', '-265px');
                        $("#ResultPagePanel").css('z-index', '9');

                    },

                    error: function (xhr, error) {
                        $(".Overlay").fadeOut();
                        AlertMessages('error', '', currentWidget._i18n.UnabletofetchbirdPTTIDdetails);
                    },

                });
            }

        },
        checkpublicids: function () {
            var currentWidget = this;
            currentWidget.publicidschecked = $(currentWidget.chkpublicBid).is(":checked");
            currentWidget.getplatformid();

        },


        GetSponsorSensorValues: function (ids) {
            var currentWidget = this;
            var sensortype = [];
            var PID = [];
            for (var i = 0; i < ids.length; i++) {
                var splitData = ids[i].split("-");
                sensortype.push(splitData[1]);
                PID.push(splitData[0]);
            }
            $("#ArgosReportBox").css("display", "none");
            $("#GSMReportBox").css("display", "none");
            $("#GPSReportBox").css("display", "none");
            $(".Overlay").fadeIn();
            var requestData = {
                id: PID.toString(),
                type: sensortype.toString()
            };
            $.ajax({
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                url: currentWidget.ServiceUrl + "JSONSponsorTotalLocations/",
                success: function (data) {
                    var ResultSet = JSON.parse(data);
                    var GPS, Argos, GSM;
                    if (typeof (ResultSet.Table1) != 'undefined') {
                        if (ResultSet.Table1[0].TransmitterType=="GPS") {
                            GPS = ResultSet.Table1[0].NoofRecords;
                            var GPSFormat = GPS.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            $('#lblGPSData').text(GPSFormat);
                            $("#GPSReportBox").css("display", "block");
                        }
                        else if (ResultSet.Table1[0].TransmitterType=="Argos") {
                            Argos = ResultSet.Table1[0].NoofRecords;
                            var ArgosFormat = Argos.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            $('#lblArgosData').text(ArgosFormat);
                            $("#ArgosReportBox").css("display", "block");
                        }
                        else if (ResultSet.Table1[0].TransmitterType=="GSM") {
                            GSM = ResultSet.Table1[0].NoofRecords;
                            var GSMFormat = GSM.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            $('#lblGsmData').text(GSMFormat);
                            $("#GSMReportBox").css("display", "block");
                        }
                    }
                    if (typeof (ResultSet.Table2) != 'undefined') {
                        if (ResultSet.Table2[0].TransmitterType=="GPS") {
                            GPS = ResultSet.Table2[0].NoofRecords;
                            var GPSFormat = GPS.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            $('#lblGPSData').text(GPSFormat);
                            $("#GPSReportBox").css("display", "block");
                        }

                        else if (ResultSet.Table2[0].TransmitterType=="Argos") {
                            Argos = ResultSet.Table2[0].NoofRecords;
                            var ArgosFormat = Argos.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            $('#lblArgosData').text(ArgosFormat);
                            $("#ArgosReportBox").css("display", "block");
                        }
                        else if (ResultSet.Table2[0].TransmitterType=="GSM") {
                            GSM = ResultSet.Table2[0].NoofRecords;
                            var GSMFormat = GSM.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            $('#lblGsmData').text(GSMFormat);
                            $("#GSMReportBox").css("display", "block");
                        }
                    }
                    if (typeof (ResultSet.Table3) != 'undefined') {
                        if (ResultSet.Table3[0].TransmitterType=="GPS") {
                            GPS = ResultSet.Table3[0].NoofRecords;
                            var GPSFormat = GPS.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            $('#lblGPSData').text(GPSFormat);
                            $("#GPSReportBox").css("display", "block");
                        }

                        else if (ResultSet.Table3[0].TransmitterType=="Argos") {
                            Argos = ResultSet.Table3[0].NoofRecords;
                            var ArgosFormat = Argos.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            $('#lblArgosData').text(ArgosFormat);
                            $("#ArgosReportBox").css("display", "block");
                        }
                        else if (ResultSet.Table3[0].TransmitterType=="GSM") {
                            GSM = ResultSet.Table3[0].NoofRecords;
                            var GSMFormat = GSM.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            $('#lblGsmData').text(GSMFormat);
                            $("#GSMReportBox").css("display", "block");
                        }
                    }

                    if (Argos == undefined) {
                        Argos = 0;
                    }
                    if (GPS == undefined) {
                        GPS = 0;
                    }
                    if (GSM == undefined) {
                        GSM = 0;
                    }
                    var totaldata = parseInt(Argos) + parseInt(GPS) + parseInt(GSM);
                    var totalformatdata = totaldata.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    $("#lblresults").text(totalformatdata);
                    $(".Overlay").fadeOut();
                },
                error: function (xhr, error) {
                    $(".Overlay").fadeOut();
                    AlertMessages("error", '', currentWidget._i18n.Unabletofetchbirddetails);
                    console.debug(xhr); console.debug(error);
                },
            });

        }





    });

});










