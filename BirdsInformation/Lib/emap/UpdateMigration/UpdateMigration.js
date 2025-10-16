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

    "dojo/text!emap/UpdateMigration/template/UpdateMigration.html",

    "dojo/i18n!emap/UpdateMigration/nls/resource",

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
        FromDateLocation: false,
        ToDateLocation:false,
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
            
            $(".btnLink").click(function () {
                $(".btnLink").removeClass("active");
                $(this).addClass("active");
            })

            currentwidget.map.on("click", function (evt) {
                if (typeof (evt.graphic) != "undefined") {
                    if (currentwidget.FromDateLocation == true) {
                        var sensortype = evt.graphic._graphicsLayer.id.split('_');
                        $(currentwidget.ddlsensor)[0].sumo.selectItem(sensortype[2]);
                        currentwidget.getplatformidForSensorType(evt);
                        $(currentwidget.lblfromdate).css("display", "none");
                        $(currentwidget.lblfromtime).css("display", "none");
                        $(currentwidget.lblgreaterSeason).css("display", "none");
                        $(currentwidget.lblTimegreater).css("display", "none");
                    }
                    if (currentwidget.ToDateLocation == true) {
                        if (evt.graphic.attributes['PID'] != $(currentwidget.ddlplatformid).val()) {
                            AlertMessages("warning", '', currentwidget._i18n.selectcorrectPoint);
                        }
                        else {
                            $(currentwidget.todate).val(evt.graphic.attributes['DATE']);
                            $(currentwidget.todatetime).val(evt.graphic.attributes['TIME']);
                        }
                        $(currentwidget.lbltodate).css("display", "none");
                        $(currentwidget.lbltotime).css("display", "none");
                        $(currentwidget.lblgreaterSeason).css("display", "none");
                        $(currentwidget.lblTimegreater).css("display", "none");
                    }
                    currentwidget.FromDateLocation = false;
                    currentwidget.ToDateLocation = false;
                    $(".btnLink").removeClass("active");
                    
                }
                
            });            

            this.inherited(arguments);
            $(".dateclass").datepicker();
            currentwidget.refreshDateTime();
        },


        startup: function () {
            var currentWidget = this;
            currentWidget.getsensortype();
            currentWidget.getMigrationtype();
            currentWidget.refreshDateTime();
        },
        FromLocationDate: function () {
            var currentWidget = this;
            currentWidget.FromDateLocation = true;
        },
        ToLocationDate: function () {
            var currentWidget = this;
            currentWidget.ToDateLocation = true;
        },
        ClearControls: function () {
            var currentWidget = this;
            $(currentWidget.ddlsensor).val("");
            $(currentWidget.ddlplatformid).val("");
            $(currentWidget.ddlsensor)[0].sumo.reload();
            $(currentWidget.ddlplatformid).html("");
            $(currentWidget.ddlplatformid)[0].sumo.reload();
            $(currentWidget.locationclasses).val("");
            $(currentWidget.timeinterval).val("");
            $(".stopoverclass").css("display", "none");
            $(currentWidget.lblSensortype).css("display", "none");
            $(currentWidget.lblplatformid).css("display", "none");
            $(currentWidget.lblfromdate).css("display", "none");
            $(currentWidget.lbltodate).css("display", "none");
            $(currentWidget.lblfromtime).css("display", "none");
            $(currentWidget.lbltotime).css("display", "none");
            $(currentWidget.lblgreaterSeason).css("display", "none");
            $(currentWidget.lblTimegreater).css("display", "none");
            $(currentWidget.chkSeasonWise).prop('checked', false);
        },
        refreshDateTime: function () {
            var currentWidget= this;
            var today = new Date();
            var today = new Date()
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var dd = String(today.getDate()).padStart(2, '0');
            var yyyy = String(today.getFullYear()).padStart(2, '0');
            var date = dd + "-" + mm + '-' + yyyy;
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            $(currentWidget.todatetime).val(time);
            $(currentWidget.fromdatetime).val(time);
            $(currentWidget.fromdate).val(date);
            $(currentWidget.todate).val(date);
            $(currentWidget.lblfromdate).css("display", "none");
            $(currentWidget.lbltodate).css("display", "none");
            $(currentWidget.lblfromtime).css("display", "none");
            $(currentWidget.lbltotime).css("display", "none");
            $(currentWidget.lblgreaterSeason).css("display", "none");
            $(currentWidget.lblTimegreater).css("display", "none");
        },
        ClearRecords: function () {
            var currentWidget = this;
            $(".stopoverclass").css("display", "none");

            $(currentWidget.lblplatformid).css("display", "none");
        },
        ClearLabelfromdate: function () {
            var currentWidget = this;
            var pgDirR = document.getElementsByTagName('html');
            if (pgDirR[0].dir == 'rtl' || pgDirR[0].style.direction == 'rtl') {
                $(".datepicker-container").addClass("leftimp");
            }
            else {
                $(".datepicker-container").removeClass("leftimp");
            }            
            $(currentWidget.lblfromdate).css("display", "none");
        },
        ClearLabeltodate: function () {
            var currentWidget = this;
            var pgDirR = document.getElementsByTagName('html');
            if (pgDirR[0].dir == 'rtl' || pgDirR[0].style.direction == 'rtl') {
                $(".datepicker-container").addClass("leftimp");
            }
            else {
                $(".datepicker-container").removeClass("leftimp");
            }
            $(currentWidget.lbltodate).css("display", "none");
            $(currentWidget.lblgreaterSeason).css("display", "none");
        },

        ClearLabelfromdatetime: function () {
            var currentWidget = this;
            $(currentWidget.lblfromtime).css("display", "none");
        },
        ClearLabeltodatetime: function () {
            var currentWidget = this;
            $(currentWidget.lbltotime).css("display", "none");
            $(currentWidget.lblTimegreater).css("display", "none");
        },
        ClearSeasons: function () {
            var currentWidget = this;
            $(currentWidget.lblMigration).css("display", "none");
        },

        getsensortype: function () {
            var currentWidget = this;
            $(currentWidget.ddlsensor).empty();
            $(currentWidget.ddlsensor).append('<option value=""></option>');
            $(currentWidget.ddlsensor).append('<option value="Argos">Argos</option>');
            $(currentWidget.ddlsensor).append('<option value="GPS">GPS</option>');
            $(currentWidget.ddlsensor).append('<option value="GSM">GSM</option>');
            $(currentWidget.ddlsensor).SumoSelect({ placeholder: currentWidget._i18n.placeholderSensorType });
            $(currentWidget.ddlplatformid).SumoSelect({ search: true, searchText: 'Enter here.', placeholder: currentWidget._i18n.placeholderPTTID, captionFormat: ' {0} ' + currentWidget._i18n.SelectedItems, });
        },

        getMigrationtype: function () {
            var currentWidget = this;
            $(currentWidget.ddlMigration).empty();
            $(currentWidget.ddlMigration).append('<option value=""></option>');
            $(currentWidget.ddlMigration).append('<option value="Wintering">' + encodeURIComponent(currentWidget._i18n.winter) +'</option>');
            $(currentWidget.ddlMigration).append('<option value="Spring">' + encodeURIComponent(currentWidget._i18n.spring) +'</option>');
            $(currentWidget.ddlMigration).append('<option value="Autumn">' + encodeURIComponent(currentWidget._i18n.autumn) +'</option>');
            $(currentWidget.ddlMigration).append('<option value="Summering">' + encodeURIComponent(currentWidget._i18n.summer) +'</option>');
            $(currentWidget.ddlMigration).SumoSelect({ placeholder: currentWidget._i18n.placeholderMigrationType });
            //$(currentWidget.ddlplatformid).SumoSelect({ search: true, searchText: 'Enter here.', placeholder: currentWidget._i18n.placeholderPTTID });
        },
        getplatformidForSensorType: function (evt) {
            var currentWidget = this;
            var sensorType = $(currentWidget.ddlsensor).val();
            if (sensorType == "") {
                return;
            }
            var requestData = {
                 type: sensorType
             };
            $.ajax({
                url: currentWidget.ServiceUrl + "JSONPlatFormIdsforMigration/",
                type: 'POST',
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {
                    $(currentWidget.ddlplatformid).html("");
                    $(currentWidget.ddlplatformid)[0].sumo.reload();
                    var jsonObj = JSON.parse(result);
                    if (jsonObj != null) {

                        $(currentWidget.ddlplatformid).append('<option value=""></option>');
                        for (i = 0; i < jsonObj.length; i++) {
                            //$(currentWidget.ddlplatformid).append('<option>' + jsonObj[i].PID + '</option>')
                            $(currentWidget.ddlplatformid).append('<option>' + encodeURIComponent(jsonObj[i].PID) + '</option>')
                        }
                    }
                    $(currentWidget.ddlplatformid)[0].sumo.reload();

                    $(currentWidget.ddlplatformid)[0].sumo.selectItem(evt.graphic.attributes['PID']);
                    $(currentWidget.fromdate).val(evt.graphic.attributes['DATE']);
                    $(currentWidget.fromdatetime).val(evt.graphic.attributes['TIME']);

                },
                error: function (xhr, error) {
                    var currentWidget = this;
                    AlertMessages('error', '', currentWidget._i18n.Unabletofetchbirdplatformids);

                },
            });

        },
        getplatformid: function () {
            var currentWidget = this;
            $(".stopoverclass").css("display", "none");
            $(".Densityclass").css("display", "none");
            $(currentWidget.lblSensortype).css("display", "none");
            var sensorType = $(currentWidget.ddlsensor).val();
            if (sensorType == "") {
                return;
            }
            var requestData = {
                 type: sensorType
             };
            $.ajax({
                url: currentWidget.ServiceUrl + "JSONPlatFormIdsforMigration/",
                type: 'POST', 
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {
                    $(currentWidget.ddlplatformid).html("");
                    $(currentWidget.ddlplatformid)[0].sumo.reload();
                    currentWidget.refreshDateTime();
                    $(currentWidget.timeinterval).val("");
                    var jsonObj = JSON.parse(result);
                    if (jsonObj != null) {
                        $(currentWidget.ddlplatformid).append('<option value=""></option>');
                        for (i = 0; i < jsonObj.length; i++) {
                            //$(currentWidget.ddlplatformid).append('<option>' + jsonObj[i].PID + '</option>')
                            $(currentWidget.ddlplatformid).append('<option>' + encodeURIComponent(jsonObj[i].PID) + '</option>')
                        }
                    }
                    $(currentWidget.ddlplatformid)[0].sumo.reload();
                },
                error: function (xhr, error) {
                    var currentWidget = this;
                    AlertMessages('error', '', currentWidget._i18n.Unabletofetchbirdplatformids);
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
        GetValues: function (val) {
            if (val == null || val == "null") {
                return "";
            }
            return val.toString();
        },
        AddDaytoDate: function (date) {
            var d = new Date(date),
                month = '' + d.getMonth(),
                day = '' + (d.getDate() +1),
                year = d.getFullYear();
            return [year, month, day].join('-');
        },
        ReduceDaytoDate: function (date) {
            var d = new Date(date),
                month = '' + d.getMonth(),
                day = '' + (d.getDate() - 1),
                year = d.getFullYear();
            return [year, month, day].join('-');
        },
        getMigrationValueForCorrection: function () {
            var currentWidget = this;
            $(currentWidget.lblSensortype).css("display", "none");
            $(currentWidget.lblplatformid).css("display", "none");
            $(currentWidget.lblfromdate).css("display", "none");
            $(currentWidget.lbltodate).css("display", "none");
            $(currentWidget.lblfromtime).css("display", "none");
            $(currentWidget.lbltotime).css("display", "none");
            $(currentWidget.lblgreaterSeason).css("display", "none");
            $(currentWidget.lblMigration).css("display", "none");
            $(currentWidget.lblTimegreater).css("display", "none");
            var sensor = $(currentWidget.ddlsensor).val();
            var pid = $(currentWidget.ddlplatformid).val();
            var fromdate = $(currentWidget.fromdate).val();
            var todate = $(currentWidget.todate).val();
            var f = fromdate.split("-");
            var fd = f[2] + "-" + f[1] + "-" + f[0];
            var t = todate.split("-");                
            var td = t[2] + "-" + t[1] + "-" + t[0];
            var PreviousDate = new Date(fd);
            if (PreviousDate.getDate() == 1) {
                PreviousDate.setDate(PreviousDate.getDate());
            }
            else {
                PreviousDate.setDate(PreviousDate.getDate() - 1);
            }
            var MonthVal="01"
            if (PreviousDate.getMonth() == 0) {
                MonthVal = "01";
            }
            else if (PreviousDate.getMonth() == 1) {
                MonthVal = "02";
            }
            else if (PreviousDate.getMonth() == 2) {
                MonthVal = "03";
            }
            else if (PreviousDate.getMonth() == 3) {
                MonthVal = "04";
            }
            else if (PreviousDate.getMonth() == 4) {
                MonthVal = "05";
            }
            else if (PreviousDate.getMonth() == 5) {
                MonthVal = "06";
            }
            else if (PreviousDate.getMonth() == 6) {
                MonthVal = "07";
            }
            else if (PreviousDate.getMonth() == 7) {
                MonthVal = "08";
            }
            else if (PreviousDate.getMonth() == 8) {
                MonthVal = "09";
            }
            else if (PreviousDate.getMonth() == 9) {
                MonthVal = "10";
            }
            else if (PreviousDate.getMonth() == 10) {
                MonthVal = "11";
            }
            else if (PreviousDate.getMonth() == 11) {
                MonthVal = "12";
            }
            PreviousDate = PreviousDate.getFullYear() + "-" + MonthVal + "-" + String(PreviousDate.getDate()).padStart(2, '0');
            var AfterDate = new Date(td);
            if (AfterDate.getDate() == 30 || AfterDate.getDate() == 31) {
                AfterDate.setDate(AfterDate.getDate());
            }
            else {
                AfterDate.setDate(AfterDate.getDate() + 1);
            }
            var MonthVal1 = "01"
            if (AfterDate.getMonth() == 0) {
                MonthVal1 = "01";
            }
            else if (AfterDate.getMonth() == 1) {
                MonthVal1 = "02";
            }
            else if (AfterDate.getMonth() == 2) {
                MonthVal1 = "03";
            }
            else if (AfterDate.getMonth() == 3) {
                MonthVal1 = "04";
            }
            else if (AfterDate.getMonth() == 4) {
                MonthVal1 = "05";
            }
            else if (AfterDate.getMonth() == 5) {
                MonthVal1 = "06";
            }
            else if (AfterDate.getMonth() == 6) {
                MonthVal1 = "07";
            }
            else if (AfterDate.getMonth() == 7) {
                MonthVal1 = "08";
            }
            else if (AfterDate.getMonth() == 8) {
                MonthVal1 = "09";
            }
            else if (AfterDate.getMonth() == 9) {
                MonthVal1 = "10";
            }
            else if (AfterDate.getMonth() == 10) {
                MonthVal1 = "11";
            }
            else if (AfterDate.getMonth() == 11) {
                MonthVal1 = "12";
            }
            AfterDate = AfterDate.getFullYear() + "-" + MonthVal1 + "-" + String(AfterDate.getDate()).padStart(2, '0');
            var migration = $(currentWidget.ddlMigration).val();
            var totime = $(currentWidget.todatetime).val();
            var fromtime = $(currentWidget.fromdatetime).val();
            ////var Ftime = $(currentWidget.fromdatetime).val().replace(":", "Column").replace(":", "Column");
            ////var Ttime = $(currentWidget.todatetime).val().replace(":", "Column").replace(":", "Column");
              var formIsValid = true;
            if (sensor == "") {
                $(currentWidget.lblSensortype).css("display", "block");
                formIsValid = false;
            }
            if (pid == "" || pid == null) {
                $(currentWidget.lblplatformid).css("display", "block");
                formIsValid = false;
            }
            if (fromdate == "") {
                $(currentWidget.lblfromdate).css("display", "block");

                formIsValid = false;
            }
            if (fromtime == "") {
                $(currentWidget.lblfromtime).css("display", "block");
                formIsValid = false;
            }
            if (totime == "") {
                $(currentWidget.lbltotime).css("display", "block");
                formIsValid = false;
            }
            if (todate == "") {
                $(currentWidget.lbltodate).css("display", "block");
                formIsValid = false;
            }
            var isvalid = CheckDatesCompare(fromdate, todate);
            if (isvalid == false) {
                $(currentWidget.lblgreaterSeason).css("display", "block");
                formIsValid = false;
            }
            //if (fromdate == todate) {
            //    a = fromtime
            //    b = totime

            //    timeA = new Date();
            //    timeA.setHours(a.split(":")[0], a.split(":")[1], a.split(":")[2]);
            //    timeB = new Date();
            //    timeB.setHours(b.split(":")[0], b.split(":")[1], b.split(":")[2]);
            //    if (timeA > timeB) {
            //        $(currentWidget.lblTimegreater).css("display", "block");
            //        formIsValid = false;
            //    }
            //}
            if (fromdate == todate) {
                if (fromtime == totime) {
                    $(currentWidget.lblTimegreater).css("display", "block");
                    formIsValid = false;
                }
                //a = fromtime
                //b = totime
                //timeA = new Date();
                //timeA.setHours(a.split(":")[0], a.split(":")[1], a.split(":")[2]);
                //timeB = new Date();
                //timeB.setHours(b.split(":")[0], b.split(":")[1], b.split(":")[2]);
                //if (timeA > timeB) {
                //    $(currentWidget.lblTimegreater).css("display", "block");
                //    formIsValid = false;
                //}
            }
            //else {
            //    if (fromtime == totime) {
            //        b = totime;
            //        totime = b.split(":")[0] + ":59:59";
            //    }
            //}
            var Ftime = fromtime.replace(":", "Column").replace(":", "Column");
            var Ttime = totime.replace(":", "Column").replace(":", "Column");
            if (migration == "") {
                $(currentWidget.lblMigration).css("display", "block");
                formIsValid = false;
            }

            if (formIsValid == false) {
                $(".Overlay").fadeOut();
                return;
            }
            $(".Overlay").fadeIn();
            var requestData = {
                id: pid,
                type: sensor,
                fromdate: PreviousDate,
                todate: AfterDate,
                fromtime: Ftime,
                totime: Ttime,
                MigrationType: migration
            };
            $.ajax({
                url: currentWidget.ServiceUrl + "JsonGetMigrationValueForCorrection/",
                type: 'POST',  
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {
                    var jsonObj = JSON.parse(result);
                    if (jsonObj == 0) {
                        $(".Overlay").fadeOut();
                        return;
                    }
                    if (jsonObj != null) {
                        var StartDate = "";
                        var EndDate = "";
                        if (jsonObj[0].StartDate != null && jsonObj[0].EndDate != null) {
                            StartDate = jsonObj[0].StartDate.split("T");
                            EndDate = jsonObj[0].EndDate.split("T");
                            currentWidget.updateMigrationStatusForOutLiers(StartDate[0], EndDate[0], StartDate[1], EndDate[1]);
                        }
                        else {
                            AlertMessages("error", '', currentWidget._i18n.NoResultFound);
                        }
                    }
                },
                error: function (xhr, error) {
                    AlertMessages("error", '', currentWidget._i18n.UnabletofetchSeasonCorrectionDetails);
                    $(".Overlay").fadeOut();
                    console.debug(xhr); console.debug(error);
                },
            });
        },
        updateMigrationStatusForOutLiers: function (FromDate,ToDate,FromTime,ToTime) {
            var currentWidget = this;
            $(currentWidget.lblSensortype).css("display", "none");
            $(currentWidget.lblplatformid).css("display", "none");
            $(currentWidget.lblgreaterSeason).css("display", "none");
            $(currentWidget.lblTimegreater).css("display", "none");
            $(currentWidget.lblMigration).css("display", "none");

            var sensor = $(currentWidget.ddlsensor).val();
            var pid = $(currentWidget.ddlplatformid).val();
            var migration = $(currentWidget.ddlMigration).val();
            var Ftime = FromTime.replace(":", "Column").replace(":", "Column");
            var Ttime = ToTime.replace(":", "Column").replace(":", "Column");
            var data = pid + "/" + FromDate + "/" + ToDate + "/" + Ftime + "/" + Ttime + "/" + migration;
            var requestData = {
                type: sensor,
                id: pid,
                fromdate: FromDate,
                todate: ToDate,
                fromtime: Ftime,
                totime: Ttime,
                MigrationType: migration
            };
            $(".Overlay").fadeIn();
            $.ajax({
                url: currentWidget.ServiceUrl + "JsonUpdateMigrationValueForOutLier/",
                type: 'POST',  // http method
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {
                    var jsonObj = JSON.parse(result);


                    if (jsonObj == "Success") {

                        AlertMessages("success", '', currentWidget._i18n.ResultsUpdated);
                        
                        $(".Overlay").fadeOut();
                        return;



                    }
                    else if (jsonObj == "failed") {
                        AlertMessages("warning", '', currentWidget._i18n.ResultsNotUpdated);
                        $(".Overlay").fadeOut();
                        return;
                    }

                },

                error: function (xhr, error) {
                    $(".Overlay").fadeOut();
                    AlertMessages('error', '', currentWidget._i18n.UnabletofetchSeasonCorrectionDetails);
                },

            });
        },
        getresults: function () {
            var currentWidget = this;
            $(currentWidget.lblSensortype).css("display", "none");
            $(currentWidget.lblplatformid).css("display", "none");
            $(currentWidget.lblfromdate).css("display", "none");
            $(currentWidget.lbltodate).css("display", "none");
            $(currentWidget.lblfromtime).css("display", "none");
            $(currentWidget.lbltotime).css("display", "none");
            $(currentWidget.lblgreaterSeason).css("display", "none");
            $(currentWidget.lblTimegreater).css("display", "none");
            $(currentWidget.lblMigration).css("display", "none");

            var sensor = $(currentWidget.ddlsensor).val();
            var pid = $(currentWidget.ddlplatformid).val();
            var fromdate = $(currentWidget.fromdate).val();
            var todate = $(currentWidget.todate).val();
            var migration = $(currentWidget.ddlMigration).val();
            var totime = $(currentWidget.todatetime).val();
            var fromtime = $(currentWidget.fromdatetime).val();

            //var Ftime = $(currentWidget.fromdatetime).val().replace(":", "Column").replace(":", "Column");
            //var Ttime = $(currentWidget.todatetime).val().replace(":", "Column").replace(":", "Column");
            var formIsValid = true;
            if (sensor == "") {
                $(currentWidget.lblSensortype).css("display", "block");
                formIsValid = false;
            }
            if (pid == "" || pid == null) {
                $(currentWidget.lblplatformid).css("display", "block");
                formIsValid = false;
            }
            if (fromdate == "") {
                $(currentWidget.lblfromdate).css("display", "block");

                formIsValid = false;
            }
            if (fromtime == "") {
                $(currentWidget.lblfromtime).css("display", "block");
                formIsValid = false;
            }
            if (totime == "") {
                $(currentWidget.lbltotime).css("display", "block");
                formIsValid = false;
            }
            if (todate == "") {
                $(currentWidget.lbltodate).css("display", "block");
                formIsValid = false;
            }
            var isvalid = CheckDatesCompare(fromdate, todate);
            if (isvalid == false) {
                $(currentWidget.lblgreaterSeason).css("display", "block");
                formIsValid = false;
            }
            if (fromdate == todate) {
                if (fromtime == totime) {
                    $(currentWidget.lblTimegreater).css("display", "block");
                    formIsValid = false;
                }
                //a = fromtime
                //b = totime
                //timeA = new Date();
                //timeA.setHours(a.split(":")[0], a.split(":")[1], a.split(":")[2]);
                //timeB = new Date();
                //timeB.setHours(b.split(":")[0], b.split(":")[1], b.split(":")[2]);
                //if (timeA > timeB) {
                //    $(currentWidget.lblTimegreater).css("display", "block");
                //    formIsValid = false;
                //}
            }
            //else {
            //    if (fromtime == totime) {
            //        b = totime;
            //        totime = b.split(":")[0] + ":59:59";
            //    }
            //}
            var Ftime = fromtime.replace(":", "Column").replace(":", "Column");
            var Ttime = totime.replace(":", "Column").replace(":", "Column");
            if (migration == "") {
                $(currentWidget.lblMigration).css("display", "block");
                formIsValid = false;
            }
            if (formIsValid == false) {
                $(".Overlay").fadeOut();
                return;
            }
            var data = pid + "/" + fromdate + "/" + todate + "/" + Ftime + "/" + Ttime + "/" + migration ;

            $(".Overlay").fadeIn();
            var requestData = {
                id: pid,
                type: sensor,
                fromdate: fromdate,
                todate: todate,
                fromtime: Ftime,
                totime: Ttime,
                MigrationType: migration
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
                        //currentWidget.getMigrationValueForCorrection();
                        AlertMessages("success", '', currentWidget._i18n.ResultsUpdated);
                        $(".Overlay").fadeOut();
                        return;
                    }
                    else if (jsonObj == "failed") {
                        AlertMessages("warning", '', currentWidget._i18n.ResultsNotUpdated);
                        $(".Overlay").fadeOut();
                        return;
                    }

                },

                error: function (xhr, error) {
                    $(".Overlay").fadeOut();
                    AlertMessages('error', '', currentWidget._i18n.UnabletofetchSeasonCorrectionDetails);
                },

            });
        },
    });

});










