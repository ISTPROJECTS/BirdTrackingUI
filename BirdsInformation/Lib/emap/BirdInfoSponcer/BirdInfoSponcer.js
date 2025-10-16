define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/topic',
    "dojo/text!emap/BirdInfoSponcer/templates/BirdInfoSponcer.html",

    /*'dojo/i18n!../BirdInfo/nls/jsapi'*/
    "dojo/i18n!emap/BirdInfoSponcer/nls/jsapi",
    'xstyle/css!../BirdInfoSponcer/css/BirdInfoSponcer.css',
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, topic, dijitTemplate, i18n) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: dijitTemplate,
        widgetsInTemplate: true,
        i18n: i18n,
        map: null,
        title: i18n.title,
        domNode: null,
        ServiceUrl: null,
        slideIndex: null,
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
            var currentWidget = this;
            topic.subscribe('mapClickMode/BirdInfoClearWidgets', lang.hitch(this, function () {

                currentWidget.ClearControls();
            }));
            topic.subscribe('Reports/BirdsInfoData', lang.hitch(this, function () {
                currentWidget.getBirdIds();
            }));
        },
        startup: function () {
            var currentWidget = this;
        },
        ClearControls: function () {
            var currentWidget = this;
            $(currentWidget.ddlbirdinfo).val("");
            $(currentWidget.ddlbirdinfo)[0].sumo.reload();
            $(currentWidget.bird_table).empty();
            $(currentWidget.bird_table).html("");
            $(currentWidget.lblBirdid).css("display", "none");
            $(".Exportsponsorhideshow").css("display", "none");
        },
        getBirdIds: function () {
            var currentWidget = this;
            if (configOptions.UserInfo.UserRole == "Sponsor") {
                var sensortype = [];
                var PID = [];
                $(currentWidget.ddlbirdinfo).html("");                
                var IDwithSensor = configOptions.SponsorandPublicID;
                for (var i = 0; i < IDwithSensor.length; i++) {
                    var splitData = IDwithSensor[i].split("-");
                    sensortype.push(splitData[1]);
                    PID.push(splitData[0]);
                }
                $(currentWidget.ddlbirdinfo).SumoSelect({ search: true, selectAll: false, okCancelInMulti: false, placeholder: currentWidget._i18n.placeholderSelectBirdID, captionFormatAllSelected: ' {0} ' + currentWidget._i18n.SelectedAllItems, captionFormat: ' {0} ' + currentWidget._i18n.SelectedItems, });
                $(currentWidget.ddlbirdinfo).append('<option value=""></option>');
                for (var j = 0; j < PID.length; j++) {
                    $(currentWidget.ddlbirdinfo).append('<option>' + encodeURIComponent(PID[j]) + '</option>');
                }
                $(currentWidget.ddlbirdinfo)[0].sumo.reload();
            }
        },

        GetAgeCode: function (value) {
            var currentWidget = this;
            for (var i = 0; i < birdAgeCodes.length; i++) {
                if (birdAgeCodes[i].AgeCode == value) {
                    var v = birdAgeCodes[i].Description;
                    return v;
                }
            }
        },
        GetSexCode: function (value) {
            var currentWidget = this;
            for (var i = 0; i < birdSexCodes.length; i++) {
                if (birdSexCodes[i].SexCode == value) {
                    var v = birdSexCodes[i].Description;
                    return v;
                }
            }
        },
        getBirdInfo: function () {
            var currentWidget = this;
            var birdid = $(currentWidget.ddlbirdinfo).val();
            $(currentWidget.lblBirdid).css("display", "none");
            if (birdid == "") {
                $(currentWidget.lblBirdid).css("display", "block");
                $(currentWidget.bird_table).empty();
                return;
            }
            $(".Exportsponsorhideshow").css("display", "block");

            var requestData = {
                id: birdid
             };
            var url = currentWidget.ServiceUrl + 'JSONSponsorBirdInfo/';
            $(currentWidget.bird_table).empty();
            $.ajax({
                url: url,
                type: 'POST',  // http method
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {
                    $(currentWidget.bird_table).empty();
                    var birddata = JSON.parse(result);
                    if (birddata != null) {
                        for (var i = 0; i < birddata.length; i++) {
                            let date = new Date();
                            var content = content + "<tr><td><b>" + currentWidget._i18n.PlatformId + "<b></td><td>" + birdid + "</td></tr>";
                            content = content + "<tr><td><b>" + currentWidget._i18n.CommonName + "<b></td><td>" + birddata[i]["Common Name"] + "</td></tr>";
                            content = content + "<tr><td><b>" + currentWidget._i18n.LatinName + "<b></td><td>" + birddata[i]["Latin Name"] + "</td></tr>";
                            content = content + "<tr><td><b>" + currentWidget._i18n.Site + "<b></td><td>" + birddata[i]["Site"] + "</td></tr>";
                            content = content + "<tr><td><b>" + currentWidget._i18n.SensorType + "<b></td><td>" + birddata[i]["Sensor Type"] + "</td></tr>";
                            content = content + "<tr><td><b>" + currentWidget._i18n.Age + "<b></td><td>" + currentWidget.GetAgeCode(birddata[i]["Age"]) + "</td></tr > ";
                            content = content + "<tr><td><b>" + currentWidget._i18n.Sex + "<b></td><td>" + currentWidget.GetSexCode(birddata[i]["Sex"]) + "</td></tr>";
                            content = content + "<tr><td><b>" + currentWidget._i18n.BirdWeight + " <b></td><td>" + birddata[i]["Bird Weight"] + "</td></tr > ";
                            content = content + "<tr><td><b>" + currentWidget._i18n.BandID + "<b></td><td>" + birddata[i]["Band ID"] + "</td></tr>";
                            content = content + "<tr><td><b>" + currentWidget._i18n.Status + "<b></td><td>" + birddata[i]["Status"] + "</td></tr>";
                            content = content + "<tr><td><b>" + currentWidget._i18n.SpeciesID + "<b></td><td>" + birddata[i]["Species ID"] + "</td></tr>";
                            content = content + "<tr><td><b>" + currentWidget._i18n.WingsLength + "<b></td><td>" + birddata[i]["Wings Length(mm)"] + "</td></tr>";
                            content = content + "<tr><td><b>" + currentWidget._i18n.Sensitive + "<b></td><td>" + birddata[i]["Sensitive"] + "</td></tr>";
                            content = content + "<tr><td><b>" + currentWidget._i18n.CaptureDate + "<b></td><td>" + GetFormatedDate(birddata[i]["Capture Date"].split("T")[0]) + "</td></tr>";
                            content = content + "<tr><td><b>" + currentWidget._i18n.CaptureTime + "<b></td><td>" + birddata[i]["Capture Time"] + "</td></tr>";
                            content = content + "<tr><td><b>" + currentWidget._i18n.ReleaseDate + "<b></td><td>" + GetFormatedDate(birddata[i]["Release Date"].split("T")[0]) + "</td></tr>";
                            content = content + "<tr><td><b>" + currentWidget._i18n.ReleaseTime + "<b></td><td>" + birddata[i]["Release Time"] + "</td></tr>";
                            content = content + "<tr><td><b>" + currentWidget._i18n.LastActiveDate + "<b></td><td>" + GetFormatedDate(birddata[i]["Last Active Date"].split("T")[0]) + "</td></tr>";
                            content = content + "<tr><td><b>" + currentWidget._i18n.Lat + "<b></td><td>" + birddata[i]["Lat"] + "</td></tr>";
                            content = content + "<tr><td><b>" + currentWidget._i18n.Long + "<b></td><td>" + birddata[i]["Long"] + "</td></tr>";
                            $(currentWidget.bird_table).append(content);
                        }                       
                    }
                },
                error: function (xhr, error) {
                    AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdIdDetails);
                },
            });
        },

        getExportData: function () {
            var currentWidget = this;            
            var birdid = $(currentWidget.ddlbirdinfo).val();
            var requestData = {
                id: birdid
            };
            $.ajax({
                url: currentWidget.ServiceUrl + 'JSONSponsorBirdInfo/',
                type: 'POST',  // http method
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

                        for (var i = 0; i < jsonObj.length; i++) {
                            jsonObj[i]["Age"] = currentWidget.GetAgeCode(jsonObj[i]["Age"]);
                            jsonObj[i]["Sex"] = currentWidget.GetSexCode(jsonObj[i]["Sex"]);
                            jsonObj[i]["Capture Date"] = GetFormatedDate(jsonObj[i]["Capture Date"].split("T")[0]);
                            jsonObj[i]["Release Date"] = GetFormatedDate(jsonObj[i]["Release Date"].split("T")[0]);
                            jsonObj[i]["Last Active Date"] = GetFormatedDate(jsonObj[i]["Last Active Date"].split("T")[0]);

                            if (jsonObj[i].MigrationType == "M") {
                                jsonObj[i].MigrationType = "";
                            }
                            else if (jsonObj[i].MigrationType == "D") {
                                jsonObj[i].MigrationType = "";
                            }
                            else if (jsonObj[i].MigrationType == "R") {
                                jsonObj[i].MigrationType = "";
                            }

                        }
                        currentWidget.JSONToCSVConvertor1(jsonObj, "Species", birdid);
                    }
                },


                error: function (xhr, error) {

                    AlertMessages("warning", '', currentWidget._i18n.NoResultsFound);
                    console.debug(xhr); console.debug(error);
                },
            });
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
                    if (index == "MigrationType") {
                        continue;
                    }
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
            var fileName = "Species_Information_Report";
            //this will remove the blank-spaces from the title and replace it with an underscore
            //fileName += ReportTitle.replace(/ /g, "_");

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
        }

    });
});