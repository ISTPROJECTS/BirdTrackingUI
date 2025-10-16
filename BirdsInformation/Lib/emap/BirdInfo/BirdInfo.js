define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/topic',
    "dojo/text!emap/BirdInfo/templates/BirdInfo.html",

    /*'dojo/i18n!../BirdInfo/nls/jsapi'*/
    "dojo/i18n!emap/BirdInfo/nls/jsapi",
    'xstyle/css!../BirdInfo/css/BirdInfo.css',
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
            topic.subscribe('mapClickMode/BirdInfoClearWidgets', lang.hitch(this, function () {
                currentWidget.ClearControls();
            }));

            this.slideIndex = 1;
            $(this.DivBirdInfo1).on("click", ".dot", function (obj) {

                var slideno = parseInt($(obj.target).attr("slideid"));
                currentWidget.currentSlide(slideno);
            });
        },
        startup: function () {
            var currentWidget = this;
            currentWidget.getbirdnames();
        },
        ClearControls: function () {
            var currentWidget = this;
            $(currentWidget.ddlSpeciesName).val("");
            $(currentWidget.ddlBirdYear).val("");
            $(currentWidget.ddlBirdYear).html("");
            $(currentWidget.ddlbirdinfo).val("");
            $(currentWidget.ddlbirdinfo).html("");
            $(currentWidget.ddlSpeciesName)[0].sumo.reload();
            $(currentWidget.ddlBirdYear)[0].sumo.reload();
            $(currentWidget.ddlbirdinfo)[0].sumo.reload();
            $(currentWidget.bird_table).empty();
            $(currentWidget.divslider).empty();
            $(currentWidget.lblSpecies).css("display", "none");
            $(currentWidget.lblyear).css("display", "none");
            $(currentWidget.lblBirdid).css("display", "none");
            //$(".Exporthideshow").css("display", "none");
            $(currentWidget.ExportExcel).css("display", "none");
            $(currentWidget.ExportExcelBirdInfoMobile).css("display", "none");
        },
        getBirdPTTDIDs: function () {
            var currentWidget = this;
            $(currentWidget.lblSpecies).css("display", "none");

            if ($(currentWidget.ddlSpeciesName).val() == "") {
                return;
            }           
            $(currentWidget.bird_table).empty();
            $(currentWidget.divslider).empty();            
            //$(".Exporthideshow").css("display", "none");
            $(currentWidget.ExportExcel).css("display", "none");
            $(currentWidget.ExportExcelBirdInfoMobile).css("display", "none");
            var requestData = {
                 speciesname: $(this.ddlSpeciesName).val()
            };
            $.ajax({
                url: currentWidget.ServiceUrl + "jsonPTTDsByCommonName/",
                type: 'POST',  // http method
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {
                    $(currentWidget.ddlBirdYear).html("");
                    $(currentWidget.ddlBirdYear)[0].sumo.reload();
                    $(currentWidget.ddlbirdinfo).html("");
                    $(currentWidget.ddlbirdinfo)[0].sumo.reload();
                    $(currentWidget.ddlBirdYear).append('<option value=""></option>');
                    var jsonObj = JSON.parse(result);
                    if (jsonObj != null) {
                        for (i = 0; i < jsonObj.Table1.length; i++) {
                            $(currentWidget.ddlbirdinfo).append('<option value="' + encodeURIComponent(jsonObj.Table1[i].PTTD) + '">' + encodeURIComponent(jsonObj.Table1[i].PTTD) + '</option>')
                        }
                        var minYear = jsonObj.Table2[0].MinDate;
                        var maxYear = jsonObj.Table2[0].MaxDate;
                        for (i = minYear; i <= maxYear; i++) {

                            $(currentWidget.ddlBirdYear).append('<option value="' + encodeURIComponent(i) + '">' + encodeURIComponent(i) + '</option>')
                        }
                    }
                    $(currentWidget.ddlbirdinfo)[0].sumo.reload();
                    $(currentWidget.ddlBirdYear)[0].sumo.reload();

                },
                error: function (xhr, error) {
                    AlertMessages("error", '', currentWidget._i18n.UnabletofetchbirdPTTIDS);
                },
            });
        },
        getBirdId: function () {
            var currentWidget = this;
            $(currentWidget.lblBirdid).css("display", "none");
        },
       
        getbirdnames: function () {
            var currentWidget = this;
            $(currentWidget.bird_table).empty();
            $(currentWidget.divslider).empty();
            $.ajax({
                url: currentWidget.ServiceUrl + "jSONDomainBirdInfo",
                type: 'GET',  // http method
                crossDomain: true,
                success: function (result) {
                    var jsonObj = JSON.parse(result.JSONDomainBirdInfoResult);
                    if (jsonObj != null) {
                        $(currentWidget.ddlSpeciesName).append('<option value=""></option>');
                        var speciesname;
                        for (i = 0; i < jsonObj.Table1.length; i++) {
                            speciesname = currentWidget.ConvertToTitleCase(jsonObj.Table1[i].COMMONNAME);
                            var optionValue = $('<option>', {
                                value: speciesname,
                                text: speciesname
                            });
                            $(currentWidget.ddlSpeciesName).append(optionValue);
                         }
                        $(currentWidget.ddlBirdYear).append('<option value=""></option>');
                        if(jsonObj.Table2.length > 0) {
                            for (i = 0; i < jsonObj.Table2.length; i++) {
                                $(currentWidget.ddlbirdinfo).append('<option value="' + encodeURIComponent(jsonObj.Table2[i].PTTD) + '">' + encodeURIComponent(jsonObj.Table2[i].PTTD) + '</option>')
                            }
                            $(currentWidget.ddlbirdinfo).SumoSelect({ search: true, selectAll: true, okCancelInMulti: true, placeholder: currentWidget._i18n.placeholderSelectBirdId, forceCustomRendering: true, captionFormatAllSelected: ' {0} ' + currentWidget._i18n.SelectedAllItems, captionFormat: ' {0} ' + currentWidget._i18n.SelectedItems, locale: [currentWidget._i18n.OK, currentWidget._i18n.Cancel, currentWidget._i18n.SelectAll] });
                        }                        
                        var minYear = jsonObj.Table3[0].MinDate;
                        var maxYear = jsonObj.Table3[0].MaxDate;
                        for (i = minYear; i <= maxYear; i++) {
                            $(currentWidget.ddlBirdYear).append('<option value="' + encodeURIComponent(i) + '">' + encodeURIComponent(i) + '</option>')
                        }
                    }
                    $(currentWidget.ddlSpeciesName).SumoSelect({ search: true, placeholder: currentWidget._i18n.placeholderSpeciesName });
                    $(currentWidget.ddlBirdYear).SumoSelect({ search: true, placeholder: currentWidget._i18n.placeholderSelectBirdYear });
                },
                error: function (xhr, error) {
                    AlertMessages("error", '', currentWidget._i18n.unabletofetchBirdNames);
                },
            });
        },
        getyearpttd: function () {
            var currentWidget = this;

            if ($(currentWidget.ddlBirdYear).val() == "") {
                return;
            }
            $(currentWidget.bird_table).empty();
            $(currentWidget.divslider).empty();
            var CommonName = $(currentWidget.ddlSpeciesName).val() == "" ? null : $(currentWidget.ddlSpeciesName).val();
            var requestData = {
                speciesname: CommonName,
                yeardata: $(currentWidget.ddlBirdYear).val()
            };
            var url = currentWidget.ServiceUrl + "jSONPTTDSByYear/";

            $.ajax({
                url: url,
                type: 'POST',  // http method
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {

                    $(currentWidget.ddlbirdinfo).html("");
                    $(currentWidget.ddlbirdinfo)[0].sumo.reload();                    
                    var jsonObj = JSON.parse(result);
                    if (jsonObj != null) {
                        for (i = 0; i < jsonObj.length; i++) {
                            //$(currentWidget.ddlbirdinfo).append('<option value="' + jsonObj[i].PTTD + '">' + jsonObj[i].PTTD + '</option>')
                            $(currentWidget.ddlbirdinfo).append('<option value="' + encodeURIComponent(jsonObj[i].PTTD) + '">' + encodeURIComponent(jsonObj[i].PTTD) + '</option>')
                        }
                    }
                    $(currentWidget.ddlbirdinfo)[0].sumo.reload();
                },
                error: function (xhr, error) {
                    AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdIds);
                },
            });

        },
        getExportData: function () {
            var currentWidget = this;
            var Speciesname = $(currentWidget.ddlSpeciesName).val();
            var pyear = $(currentWidget.ddlBirdYear).val();
            var birdid = $(currentWidget.ddlbirdinfo).val();
            if (Speciesname == "") {
                Speciesname = null;
            }
            if (birdid == "") {
                birdid = null;
            }
            else {
                birdid = birdid.toString();
            }
            var requestData = {
                id: birdid,
                speciesname: Speciesname
            };
            var url = currentWidget.ServiceUrl + 'jsonBirdInfo/';
            $.ajax({
                url: url,
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
                            if (jsonObj[i]["Last Active Date"] == "" || jsonObj[i]["Last Active Date"] == null) {
                                jsonObj[i]["Last Active Date"] = "";
                            }
                            else {
                                jsonObj[i]["Last Active Date"] = GetFormatedDate(jsonObj[i]["Last Active Date"].split("T")[0]);
                            }

                            if (jsonObj[i].MigrationType == "M") {
                                //jsonObj[i].MigrationType="Migration"
                                jsonObj[i].MigrationType = "";
                            }
                            else if (jsonObj[i].MigrationType == "D") {
                                //jsonObj[i].MigrationType = "Dispersal"
                                jsonObj[i].MigrationType = "";
                            }
                            else if (jsonObj[i].MigrationType == "R") {
                                //jsonObj[i].MigrationType = "Residential"
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
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
            var CSV = '';
            //if (ShowLabel) {
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
            //}

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
        getBirdInfo: function () {
            var currentWidget = this;           
            var Speciesname = $(currentWidget.ddlSpeciesName).val();
            var pyear = $(currentWidget.ddlBirdYear).val();
            var birdid = $(currentWidget.ddlbirdinfo).val();
            //$(".Exporthideshow").css("display", "none");
            $(currentWidget.ExportExcel).css("display", "none");
            $(currentWidget.ExportExcelBirdInfoMobile).css("display", "none");
            if (Speciesname == "") {
                Speciesname = null;
            }
            if (birdid == "") {
                birdid = null;
            }
            else {
                birdid = birdid.toString();
            }
            var requestData = {
                id: birdid,
                speciesname: Speciesname
            };
            var url = currentWidget.ServiceUrl + 'jsonBirdInfo/';
            $(currentWidget.divslider).empty();
            $(currentWidget.bird_table).empty();

            var ua = navigator.userAgent;
            var checker = {
                iphone: ua.match(/BirdTracking_Ios/),
                blackberry: ua.match(/BlackBerry/),
                android: ua.match(/BirdTracking_Android/)
            };
            //if (ua.includes("/BirdTracking_Ios/") || ua.includes("iPad") || ua.includes("iPod") || ua.includes("/BirdTracking_Android/")) {
            if (checker.android || checker.iphone) {
                var downloadurl = currentWidget.ServiceUrl + 'JSONBirdInfoDownload/' + Speciesname + "/" + birdid + "/" + "downloadexcel.csv";
                //$(currentWidget.ExportExcelBirdInfoMobile).attr("href", downloadurl);
                $(currentWidget.ExportExcelBirdInfoMobile).attr("href", currentWidget.ServiceUrl + 'JSONBirdInfoDownload/' + Speciesname + "/" + birdid + "/" + "downloadexcel.csv");
                $(currentWidget.ExportExcel).css("display", "none");
                $(currentWidget.ExportExcelBirdInfoMobile).css("display", "block");
            }
            else {
                //$(".Exporthideshow").css("display", "block");
                $(currentWidget.ExportExcelBirdInfoMobile).css("display", "none");
                $(currentWidget.ExportExcel).css("display", "block");
            }            

            $.ajax({
                url: url,
                type: 'POST',  // http method
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {
                    var container = $(currentWidget.bird_table).empty();
                    container.empty();
                    var birddata = JSON.parse(result);
                    var dotshtml = "";
                    if (birddata.length == 0) {
                        //$(".Exporthideshow").css("display", "none");
                        $(currentWidget.ExportExcel).css("display", "none");
                        $(currentWidget.ExportExcelBirdInfoMobile).css("display", "none");
                        
                        AlertMessages("error", '', currentWidget._i18n.NoResultsFound);
                        return;
                    }
                    if (birddata != null) {
                        for (var i = 0; i < birddata.length; i++) {
                            let date = new Date();
                            var speciesname;
                            speciesname = currentWidget.ConvertToTitleCase(birddata[i]["Common Name"]);                           
                            var content = "<div class='mySlides'><table width='100%'>";
                            content = content + "<tr><td><b>" + currentWidget._i18n.PlatformId + "<b></td><td>" + birddata[i].PTTD + "</td></tr>";
                            content = content + "<tr><td><b>" + currentWidget._i18n.CommonName + "<b></td><td>" + speciesname + "</td></tr>";
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
                            if (birddata[i]["Last Active Date"] == "" || birddata[i]["Last Active Date"] == null) {
                                content = content + "<tr><td><b>" + currentWidget._i18n.LastActiveDate + "<b></td><td>" + "" + "</td></tr>";
                            }
                            else {
                                content = content + "<tr><td><b>" + currentWidget._i18n.LastActiveDate + "<b></td><td>" + GetFormatedDate(birddata[i]["Last Active Date"].split("T")[0]) + "</td></tr>";
                            }
                            
                            content = content + "<tr><td><b>" + currentWidget._i18n.Lat + "<b></td><td>" + birddata[i]["Lat"] + "</td></tr>";
                            content = content + "<tr><td><b>" + currentWidget._i18n.Long + "<b></td><td>" + birddata[i]["Long"] + "</td></tr>";
                            content = content + "</table></div>";
                            var sanitizedHtml = DOMPurify.sanitize(content);
                            container.append(sanitizedHtml);
                            dotshtml = dotshtml + '<span class="dot" slideid=' + (i + 1) + ' ></span> ';                            
                        }

                        $(currentWidget.divslider).append('<div style="text-align:center">' + dotshtml + '</div>');
                        currentWidget.currentSlide(1);
                    }
                },
                error: function (xhr, error) {
                    AlertMessages("error", '', currentWidget._i18n.UnabletofetchBirdIdDetails);
                },
            });
        },
        currentSlide: function (n) {
            this.showSlides(this.slideIndex = n);
        },
        showSlides: function (n) {
            var i;
            var slides = document.getElementsByClassName("mySlides");
            var dots = document.getElementsByClassName("dot");
            if (n > slides.length) { this.slideIndex = 1 }
            if (n < 1) {
                this.slideIndex = slides.length
                //slides[0].style.display = "none";
            }
            
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            if (dots.length > 1) {
                for (i = 0; i < dots.length; i++) {
                    dots[i].className = dots[i].className.replace(" active", "");
                }
                
                dots[this.slideIndex - 1].className += " active";
            }
            if (dots.length == 1) {
                dots[0].style.display = "none";
            }
            slides[this.slideIndex - 1].style.display = "block";
           
        },

    });
});