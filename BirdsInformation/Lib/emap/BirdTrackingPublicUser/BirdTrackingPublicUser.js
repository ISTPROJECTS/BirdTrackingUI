define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    "dojo/text!emap/BirdTrackingPublicUser/templates/BirdTrackingPublicUser.html",
    'dojo/topic',
    /*'dojo/i18n!../BirdInfo/nls/jsapi'*/
    "dojo/i18n!emap/BirdTrackingPublicUser/nls/Resource",
    'xstyle/css!../BirdTrackingPublicUser/css/BirdTrackingPublicUser.css',
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, dijitTemplate, topic, i18n) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: dijitTemplate,
        widgetsInTemplate: true,
        i18n: i18n,
        map: null,
        title: i18n.title,
        domNode: null,
        ServiceUrl: null,
        slideIndex: null,
        ClickStatus: false,
        assignedBirdsType: [],
        assignedBirdId: null,
        assignedBirdType: null,
        SelectedBirdNameIDs: [],
        IDsByNames: [],
        NumberofIds: null,
        IDsCount: null,
        isDataavailable: false,
        NumberofPTTDIDs: "",

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
            var currentwidget = this;
            topic.subscribe('mapClickMode/ClearWidgets', lang.hitch(this, function () {
                currentwidget.ClearControls();
            }));
            this.inherited(arguments);
            this.queryinfo = {
                type: "",
                settype: function (sensortype) {
                    if (sensortype == "ARGOS") {
                        this.type = "ARGOS";
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
                locclass: "",
                platformidList: "",
                year: "",
                fromdate: "",
                todate: " ",
                timeinterval: "",
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


        },

        startup: function () {
            var currentWidget = this;
            currentWidget.getplatformid();
        },
        ClearControls: function () {
            var currentWidget = this;
            $(currentWidget.ddlplatformid).val("");
            $(currentWidget.ddlplatformid)[0].sumo.reload();
            $(currentWidget.ddlDurationTime).html("");
            $(currentWidget.ddlDurationTime).val("");
            $(currentWidget.ddlDurationTime)[0].sumo.reload();
            $(currentWidget.lblplatformid).css("display", "none");
            $(currentWidget.lblDurationType).css("display", "none");
        },
        getPidBasedonNames: function () {
            var currentWidget = this;
            var SpeciesName = $(currentWidget.ddlSpeciesName).val();
            currentWidget.IDsByNames = [];
            for (j = 0; j < currentWidget.SelectedBirdNameIDs.length; j++) {
                if (SpeciesName == currentWidget.SelectedBirdNameIDs[j]["Parameters"]) {
                    currentWidget.IDsByNames.push({ PTTDID: currentWidget.SelectedBirdNameIDs[j]["PTTDID"], SensorType: currentWidget.SelectedBirdNameIDs[j]["SensorType"] })

                }
            }
        },

        getBirdNames: function (PTTDIDs) {
            var currentWidget = this;
            var AssignedBirds = "";
            var requestData = {
                id: PTTDIDs
            };
            var url = configOptions.ServiceUrl + 'JsonGetSponsorBirdsName/' ;
            $.ajax({
                url: url,
                type: 'POST',  // http method
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {
                    $(currentWidget.ddlSpeciesName).html("");
                    var jsonObj = JSON.parse(result);
                    if (jsonObj.Table.length > 0) {
                        $(currentWidget.ddlSpeciesName).append('<option value=""></option>');
                        var speciesname;
                        for (i = 0; i < jsonObj.Table.length; i++) {
                            speciesname = currentWidget.ConvertToTitleCase(jsonObj.Table[i]["CommonName"]);

                            var optionValue = $('<option>', {
                                value: speciesname + ' (' + jsonObj.Table[i]["PTTD"] + ')',
                                html: speciesname + ' (' + jsonObj.Table[i]["PTTD"] + ')'
                                //text: speciesname + ' (' + jsonObj.Table[i]["PTTD"] + ')'
                            });
                            $(currentWidget.ddlSpeciesName).append(optionValue);
                            
                            currentWidget.SelectedBirdNameIDs.push({ PTTDID: jsonObj.Table[i]["PTTD"], SensorType: jsonObj.Table[i]["Type"], CommonName: jsonObj.Table[i]["CommonName"], Parameters: speciesname + ' (' + jsonObj.Table[i]["PTTD"] + ')' });


                            $(currentWidget.ddlplatformid).append('<option value="' + encodeURIComponent(jsonObj.Table[i]["PTTD"] + "_" + jsonObj.Table[i]["Type"]) + '">' + encodeURIComponent(jsonObj.Table[i]["CommonName"]) + '</option>');
                        }
                        $(currentWidget.ddlplatformid).SumoSelect({ search: true, searchText: 'Enter here.', selectAll: true, okCancelInMulti: true, captionFormatAllSelected: ' {0} ' + currentWidget._i18n.SelectedAllItems, captionFormat: ' {0} ' + currentWidget._i18n.SelectedItems, });
                        $(currentWidget.ddlSpeciesName).SumoSelect({ search: true, selectAll: true, okCancelInMulti: true, placeholder: currentWidget._i18n.placeholderBirdName });
                        $(currentWidget.ddlDurationTime).SumoSelect({ search: true, selectAll: true, okCancelInMulti: true, placeholder: currentWidget._i18n.placeholderDurationTime });

                    }

                },
                error: function (xhr, error) {
                    console.debug(xhr); console.debug(error);
                },
            });
        },

        getplatformid: function () {
            var currentWidget = this;
            var UserName = configOptions.UserInfo.UserName;
            var requestData = {
                login: configOptions.UserInfo.UserName
            };
            var url = currentWidget.ServiceUrl + 'JsonGetUserAssinedBirdsDtls/';
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
                        var PTTDIDs = strAssignBirds.replaceAll(" ", ",")
                        currentWidget.getBirdNames(PTTDIDs);
                    }
                },
                error: function (xhr, error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Unable to fetch bird platform ids.',

                    })
                },
            });
        },

        GetDurationTime: function () {

            var currentWidget = this;
            $(currentWidget.lblDurationType).css("display", "none");
            var date = $(currentWidget.ddlDurationTime).val();
            var fromdate;
            var todate;
            if (date == "onemonth") {
                var today = new Date()
                var mm = String(today.getMonth() + 1).padStart(2, '0');
                var dd = String(today.getDate()).padStart(2, '0');
                var yyyy = String(today.getFullYear()).padStart(2, '0');
                fromdate = yyyy + '-' + mm + '-' + dd;
                var predate = new Date();
                var premonth = (predate.getMonth() + 1 - 1);
                var preYear = (predate.getFullYear());
                var mm = String(premonth).padStart(2, '0');
                var dd = String(predate.getDate()).padStart(2, '0');
                var yyyy = String(preYear).padStart(2, '0');
                predate = yyyy + '-' + mm + '-' + dd;
                todate = predate;
                // console.log(predate)
            }
            else if (date == "6months") {
                var today = new Date()
                //fromdate = today;
                var mm3 = String(today.getMonth() + 1).padStart(2, '0');
                var dd3 = String(today.getDate()).padStart(2, '0');
                var yyyy3 = String(today.getFullYear()).padStart(2, '0');
                fromdate = yyyy3 + '-' + mm3 + '-' + dd3;
                var predate = new Date();
                var premonth = (predate.getMonth() + 1 - 6);
                var preYear = (predate.getFullYear());
                if (premonth == 0) {
                    preYear = preYear - 1;
                }
                else if (premonth == -1) {
                    premonth = 11;
                    preYear = preYear - 1;
                } else if (premonth == -2) {
                    premonth = 10;
                    preYear = preYear - 1;
                } else if (premonth == -3) {
                    premonth = 9;
                    preYear = preYear - 1;
                } else if (premonth == -4) {
                    premonth = 8;
                    preYear = preYear - 1;
                } else if (premonth == -5) {
                    premonth = 7;
                    preYear = preYear - 1;
                }
                var mm = String(premonth).padStart(2, '0');
                var dd = String(predate.getDate()).padStart(2, '0');
                var yyyy = String(preYear).padStart(2, '0');
                predate = yyyy + '-' + mm + '-' + dd;
                todate = predate;
                // console.log(predate)
            }
            else if (date == "1year") {
                var today = new Date();
                //fromdate = today;
                var mm2 = String(today.getMonth() + 1).padStart(2, '0');
                var dd2 = String(today.getDate()).padStart(2, '0');
                var yyyy2 = String(today.getFullYear()).padStart(2, '0');
                fromdate = yyyy2 + '-' + mm2 + '-' + dd2;
                var predate = new Date();
                var mm = String(predate.getMonth() + 1).padStart(2, '0');
                var dd = String(predate.getDate()).padStart(2, '0');
                var yyyy = String(predate.getFullYear() - 1).padStart(2, '0');
                predate = yyyy + '-' + mm + '-' + dd;
                todate = predate;
                //console.log(predate)
            }
            else if (date == "2years") {
                var today = new Date();
                var mm1 = String(today.getMonth() + 1).padStart(2, '0');
                var dd1 = String(today.getDate()).padStart(2, '0');
                var yyyy1 = String(today.getFullYear()).padStart(2, '0');
                fromdate = yyyy1 + '-' + mm1 + '-' + dd1;
                var predate = new Date();
                var mm = String(predate.getMonth() + 1).padStart(2, '0');
                var dd = String(predate.getDate()).padStart(2, '0');
                var yyyy = String(predate.getFullYear() - 2).padStart(2, '0');
                predate = yyyy + '-' + mm + '-' + dd;
                todate = predate;
                //console.log(predate)
            }
            currentWidget.fromdate = fromdate;
            currentWidget.todate = todate;
        },
        ClearLabelPlatForm: function () {
            var currentWidget = this;
            $(currentWidget.lblplatformid).css("display", "none");
            $(currentWidget.ddlDurationTime)[0].sumo.reload();
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

        GetTrackingBirdDetails: function (results, Pid) {
            var currentWidget = this;
            currentWidget.IDsCount++;

            if (results != null) {
                if (results.Table1.length == 0) {
                    currentWidget.NumberofPTTDIDs += Pid + ",";
                    //$(".Overlay").fadeOut();
                    AlertMessages(currentWidget._i18n.warning, '', currentWidget._i18n.NoResultsFound);
                    $(".Overlay").fadeOut();
                    // return;
                }
                else {
                    var BirdTrackingData = [];
                    if (results.Table1.length > 0) {
                        currentWidget.queryResultsWidget.AddFeaturesToMap1(results.Table1, "", null, currentWidget.queryinfo, BirdTrackingData, false);
                    }
                    currentWidget.queryResultsWidget.AddDataToTable(currentWidget.queryinfo.type, BirdTrackingData);

                }
                $(".Overlay").fadeOut();
            }

        },

        GetPlotingData: function () {
            var currentWidget = this;
            currentWidget.ClickStatus = true;
            currentWidget.getPTTDIDData();
        },
        GetAnimateData: function () {
            var currentWidget = this;
            currentWidget.ClickStatus = false;
            currentWidget.getPTTDIDData();
        },



        GetAnimateDetails: function (result) {
            var currentWidget = this;
            if (result != null) {
                if (result.Table1.length == 0) {
                    AlertMessages(currentWidget._i18n.warning, '', currentWidget._i18n.NoResultsFound);
                    $(".Overlay").fadeOut();
                    return;
                }
                var BirdTrackingData = [];
                if (result.Table1.length > 0) {
                    $(".ManageContainer").show().animate({
                        bottom: '-100%'
                    }, 200);
                    currentWidget.animateResults.PopulateBirdNamesForPublic(result, currentWidget.fromdate, currentWidget.todate);
                    
                }

                $(".Overlay").fadeOut();
                $(".ManageContainer").show().animate({
                    bottom: '-100%'
                }, 200);

                $("#divPublicanimateWidget").show().animate({
                    bottom: '0px'
                }, 500);
                $("#divPublicUserAnimation").show().animate({
                    bottom: '0px'
                }, 500);

            }
            else {
                $(currentWidget.lblerror).show();
            }
        },




        getPTTDIDData: function () {
            $(".Overlay").fadeIn();
            var currentWidget = this;
            BirdName = $(currentWidget.ddlSpeciesName).val();
            DurationTime = $(currentWidget.ddlDurationTime).val();;
            $(currentWidget.lblplatformid).css("display", "none");
            $(currentWidget.lblDurationType).css("display", "none");

            var formIsValid = true;
            if (BirdName == "") {
                $(currentWidget.lblplatformid).css("display", "block");
                formIsValid = false;
            }
            if (DurationTime == "") {
                $(currentWidget.lblDurationType).css("display", "block");
                formIsValid = false;
            }
            if (formIsValid == false) {
                $(".Overlay").fadeOut();
                return;
            }
            var data;
            var funcname;
            currentWidget.NumberofIds = currentWidget.IDsByNames.length;
            for (i = 0; i < currentWidget.IDsByNames.length; i++) {
                var Pid = currentWidget.IDsByNames[i].PTTDID
                var Sensortype = currentWidget.IDsByNames[i].SensorType;
                if (Sensortype == "ARGOS") {
                    currentWidget.functype = "ARGOS";
                    funcname = "JSONArgosData";
                    data = Pid + "/null/" + currentWidget.fromdate + "/" + currentWidget.todate + "/null/null/null";
                }
                else if (Sensortype == "GPS") {
                    currentWidget.functype = "GPS";
                    funcname = "jsonGPSData";
                    data = Pid + "/" + currentWidget.fromdate + "/" + currentWidget.todate + "/null/null/null";

                }
                else if (Sensortype == "GSM") {
                    currentWidget.functype = "GSM";
                    funcname = "jsonGSMData";
                    data = Pid + "/" + currentWidget.fromdate + "/" + currentWidget.todate + "/null/null/null";
                }
                var requestData = {
                    id: Pid,
                    locCls: "null",
                    fromdate: currentWidget.todate,
                    todate: currentWidget.fromdate,
                    filter: "null",
                    login: "null",
                    password: "null"
                };
               
                $(".Overlay").fadeIn();
                $.ajax({
                    url: currentWidget.ServiceUrl + funcname + "/",
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        var jsonObj = null;
                        jsonObj = JSON.parse(result);
                        currentWidget.queryinfo.type = currentWidget.functype;
                        if (currentWidget.ClickStatus == true) {
                            currentWidget.GetTrackingBirdDetails(jsonObj, Pid);
                        }
                        else if (currentWidget.ClickStatus == false) {
                            currentWidget.GetAnimateDetails(jsonObj);
                        }



                    },
                    error: function (xhr, error) {
                        AlertMessages("error", '', currentWidget._i18n.UnabletofetchbirdPTTIDdetails);
                        $(".Overlay").fadeOut();
                        // console.debug(xhr); console.debug(error);
                    },

                });
            }


        },





    });
});