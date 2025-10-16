define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/topic',
    'dojo/_base/lang',
    "dojo/text!emap/BirdInformationForm/templates/BirdInformationForm.html",
    "dojo/i18n!emap/BirdInformationForm/nls/Resource"

], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, topic, lang, dijitTemplate, i18n) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: dijitTemplate,
        widgetsInTemplate: true,
        i18n: i18n,
        map: null,
        title: i18n.title,
        domNode: null,
        status:null,


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
            $(currentWidget.clearbirdinfo).click(function () {
                currentWidget.clearbirdsinfo();
                $(currentWidget.biPTTID).val('');                
            });
            $(currentWidget.biRelDate).on("change", function () {
                var RelDate = $(currentWidget.biRelDate).val();
                $(currentWidget.biActiveLastDate).val(RelDate);                
            });
            $(".CloseContainer").click(function () {
                $(".ManageContainer").animate({
                    bottom: '-100%'
                }, 200);
                $(currentWidget.Searchbirdid).val("");
                $(currentWidget.lblmessage).css("display", "none");
                $(currentWidget.ViewResDiv).hide();
                $(currentWidget.AddBirdDiv).hide();
                $(currentWidget.Searchbirdid)[0].sumo.reload();
                var pgDirR = document.getElementsByTagName('html');
                if (pgDirR[0].dir == 'rtl' || pgDirR[0].style.direction == 'rtl')
                    $(".esriSimpleSliderTL").animate({ right: '20px' }, 200);
                else
                $(".esriSimpleSliderTL").animate({ left: '20px' }, 200);

//                $(".esriSimpleSliderTL").animate({ left: '20px' }, 200);
            });
            topic.subscribe('Managebird/ClearWidget', lang.hitch(this, function () {
                currentWidget.clearbirdsinfo();
                $(currentWidget.Searchbirdid).val("");
                $(currentWidget.lblmessage).css("display", "none");
                $(currentWidget.ViewResDiv).hide();
                $(currentWidget.AddBirdDiv).hide();
                $(currentWidget.Searchbirdid)[0].sumo.reload();
            }));
            $(currentWidget.SearchRec).click(function () {
                $(".BirdInfoCard").hide()
                $(currentWidget.lblmessage).css("display", "none");
                var birdid = $(currentWidget.Searchbirdid).val();
                if (birdid == "") {
                    $(currentWidget.lblmessage).css("display", "block");
                }
                else {
                    $(currentWidget.lblmessage).css("display", "none");
                    $(currentWidget.ViewResDiv).show();
                    currentWidget.ShowBirdResults(birdid);
                    $(currentWidget.ViewResDiv).fadeIn();
                }
            });

            $(currentWidget.AddBirdBut).click(function () {
                $(".BirdInfoCard").hide();
                $(currentWidget.Searchbirdid).val("");
                $(currentWidget.Searchbirdid)[0].sumo.reload();
                $(currentWidget.AddBirdDiv).fadeIn();
                currentWidget.status="Add"
                currentWidget.clearbirdsinfo();
                $(currentWidget.AddHeading).css("display", "block");
                $(currentWidget.UpdateHeading).css("display", "none");
                $(currentWidget.mandatory).css("display", "block");
                $(currentWidget.biPTTID).prop('disabled', false);
            });
            $(currentWidget.editbirddetails).click(function () {
                $(".BirdInfoCard").hide()
                $(currentWidget.AddBirdDiv).fadeIn();
                currentWidget.status = "Update"
                $(currentWidget.AddHeading).css("display", "none");
                $(currentWidget.UpdateHeading).css("display", "block");
                $(currentWidget.biPTTID).prop('disabled', true);
            });
            $(currentWidget.savebirddata).click(function () {
                currentWidget.addbirdsinfo();  
            });
        },




        startup: function () {
            var currentWidget = this;
            $(currentWidget.biSite).SumoSelect({ search: true});
            $(currentWidget.bitype).SumoSelect();
            $(currentWidget.bisecondarytype).SumoSelect();
            $(currentWidget.biSpecies).SumoSelect({ search: true});
            $(currentWidget.biAge).SumoSelect({ search: true});
            $(currentWidget.biSex).SumoSelect({ search: true});
            $(currentWidget.biStatus).SumoSelect();
            $(currentWidget.biMigration).SumoSelect();            
            currentWidget.GetBirdsTableData();
            currentWidget.getBirdIds();
        },
        getBirdIds: function () {
            var currentWidget = this;
            var url = currentWidget.ServiceUrl + "jsonBirdIds";
            var token = localStorage.getItem('token'); // Assuming 'token' is the key where your JWT is stored
            var refreshtoken = localStorage.getItem('refreshtoken');

            if (!token) {
                console.error("Token not found in localStorage!");
                return;
            }
            $.ajax({
                url: url,
                type: 'GET',  // http method   
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                crossDomain: true,
                success: function (result) {
                    var jsonObj = JSON.parse(result.JSONBirdIDsResult);
                    if (jsonObj != null) {
                        $(currentWidget.Searchbirdid).append('<option value=""></option>');
                        for (i = 0; i < jsonObj.length; i++) {
                            //$(currentWidget.Searchbirdid).append('<option value="' + jsonObj[i].PTTD + '">' + jsonObj[i].PTTD + '</option>')
                            $(currentWidget.Searchbirdid).append('<option value="' + encodeURIComponent(jsonObj[i].PTTD) + '">' + encodeURIComponent(jsonObj[i].PTTD) + '</option>')
                        }
                    }
                    $(currentWidget.Searchbirdid).SumoSelect({ search: true, searchText: 'Enter here.' });
                    $(currentWidget.Searchbirdid)[0].sumo.reload();
                },
                error: function (xhr, error) {
                    AlertMessages("error", '', currentWidget._i18n.Unabletofetchbirdids);
                },
            });

        },
        ShowBirdResults: function (birdid) {
            var currentWidget = this;
            var pttid = $(currentWidget.Searchbirdid).val();
            var requestData = {
                id: pttid
             };
            $.ajax({
                type: "POST",
                url: currentWidget.ServiceUrl + "jsonBirdInfoForForm/",
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (val) {
                    var birdinfo = jQuery.parseJSON(val);
                    if (birdinfo.length == 0) {
                        currentWidget.clearbirdsinfo();
                    }
                    else {
                        $(currentWidget.biAge)[0].sumo.reload();
                        $(currentWidget.biSex)[0].sumo.reload();
                        $(currentWidget.biSite)[0].sumo.reload();
                        $(currentWidget.biSpecies)[0].sumo.reload();
                        $(currentWidget.bitype)[0].sumo.reload();
                        $(currentWidget.bisecondarytype)[0].sumo.reload();
                        $(currentWidget.biStatus)[0].sumo.reload();
                        $(currentWidget.biMigration)[0].sumo.reload();

                        lastactivedate = birdinfo[0].LastActiveDate;
                        var pttd = currentWidget.GetValues(birdinfo[0].PTTD);
                        var weight = currentWidget.GetValues(birdinfo[0].PTTWeight_g);
                        var capturdate = currentWidget.GetValues(birdinfo[0].CaptureDate.split("T")[0]);
                        var capturetime = currentWidget.GetValues(birdinfo[0].CaptureTime);
                        var lat = currentWidget.GetValues(birdinfo[0].Lat);
                        var long = currentWidget.GetValues(birdinfo[0].Long);
                        var type = currentWidget.GetValues(birdinfo[0].Type.toString());
                        var age = currentWidget.GetValues(birdinfo[0].Age);
                        var site = currentWidget.GetValues(birdinfo[0].Site);
                        var sex = currentWidget.GetValues(birdinfo[0].Sex);
                        var species = currentWidget.GetValues(birdinfo[0].Species);
                        var birdweight = currentWidget.GetValues(birdinfo[0].Weight_g);
                        var wings = currentWidget.GetValues(birdinfo[0].Wings_mm);
                        var bandid = currentWidget.GetValues(birdinfo[0].BandID);
                        var lastactivedate = currentWidget.GetValues(birdinfo[0].LastActiveDate.split("T")[0]);
                        var status = currentWidget.GetValues(birdinfo[0].Status);
                        var reldate = currentWidget.GetValues(birdinfo[0].RelDate.split("T")[0]);
                        var reltime = currentWidget.GetValues(birdinfo[0].RelTime);
                        var purchaseyear = currentWidget.GetValues(birdinfo[0].PurYear);
                        var bill = currentWidget.GetValues(birdinfo[0].Bill_mm);
                        var tarsus = currentWidget.GetValues(birdinfo[0].Tarsus_mm);
                        var notes = currentWidget.GetValues(birdinfo[0].Notes);
                        var BirdName = currentWidget.GetValues(birdinfo[0].BirdName);
                        var Migration = currentWidget.GetValues(birdinfo[0].MigrationType);

                        $(currentWidget.biPTTID).val(pttd)
                        $(currentWidget.biPTTweight).val(weight);
                        $(currentWidget.biCaptureDate).val(currentWidget.GetFormatedDate(capturdate));
                        $(currentWidget.biCapTime).val(capturetime);
                        $(currentWidget.biLatitude).val(lat);
                        $(currentWidget.biLongitude).val(long);
                        $(currentWidget.bitype)[0].sumo.selectItem(type);
                        $(currentWidget.bisecondarytype)[0].sumo.selectItem(type);                        
                        $(currentWidget.biAge)[0].sumo.selectItem(age);
                        $(currentWidget.biSite)[0].sumo.selectItem(site);
                        $(currentWidget.biSex)[0].sumo.selectItem(sex);
                        $(currentWidget.biSpecies)[0].sumo.selectItem(species);
                        $(currentWidget.biWeight).val(birdweight);
                        $(currentWidget.biWings).val(wings);
                        $(currentWidget.biBandID).val(bandid);
                        if (lastactivedate != "") {
                            $(currentWidget.biActiveLastDate).val(currentWidget.GetFormatedDate(lastactivedate));
                        } else {
                            $(currentWidget.biActiveLastDate).val("");
                        }
                        $(currentWidget.biStatus)[0].sumo.selectItem(status);
                        $(currentWidget.biRelDate).val(currentWidget.GetFormatedDate(reldate));
                        $(currentWidget.biRelTime).val(reltime);
                        $(currentWidget.biPurchageyear).val(purchaseyear);
                        $(currentWidget.biBill).val(bill);
                        $(currentWidget.biTarsus).val(tarsus);
                        $(currentWidget.biNotes).val(notes);
                        $(currentWidget.biBirdName).val(BirdName);
                        $(currentWidget.biMigration)[0].sumo.selectItem(Migration);


                        $(currentWidget.ViewPTTID).text(pttd);
                        $(currentWidget.ViewPTTweight).text(weight);
                        $(currentWidget.ViewCaptureDate).text(currentWidget.GetFormatedDate(capturdate));
                        $(currentWidget.ViewCapTime).text(capturetime);
                        $(currentWidget.ViewLatitude).text(lat);
                        $(currentWidget.ViewLongitude).text(long);
                        $(currentWidget.Viewtype).text(type);
                        $(currentWidget.ViewSite).text(site);
                        $(currentWidget.ViewBirdName).text(BirdName);
                        if (Migration == "R") {
                            $(currentWidget.ViewMigration).text("Residential");
                        } else if (Migration == "M") {
                            $(currentWidget.ViewMigration).text("Migration");
                        } else if (Migration == "D") {
                            $(currentWidget.ViewMigration).text("Dispersal");
                        }
                        $(currentWidget.ViewSpecies).text(currentWidget.GetValues(currentWidget.ConvertToTitleCase(birdinfo[0].CommonName)));                        
                        $(currentWidget.ViewAge).text(currentWidget.GetAgeCode(age));
                        $(currentWidget.ViewSex).text(currentWidget.GetSexCode(sex));
                        $(currentWidget.ViewWeight).text(birdweight);
                        $(currentWidget.ViewWings).text(wings);
                        $(currentWidget.ViewBandID).text(bandid);
                        if (lastactivedate != "") {
                            $(currentWidget.ViewActiveLastDate).text(currentWidget.GetFormatedDate(lastactivedate.split("T")[0]));
                        } else {
                            $(currentWidget.ViewActiveLastDate).text("");
                        }
                        if (status == "AC") {
                            $(currentWidget.ViewStatus).text("Active");
                        } else if (status == "NA") {
                            $(currentWidget.ViewStatus).text("Inactive");
                        }

                        $(currentWidget.ViewRelDate).text(currentWidget.GetFormatedDate(reldate));
                        $(currentWidget.ViewRelTime).text(reltime);
                        $(currentWidget.ViewPurchaseYear).text(purchaseyear);
                        $(currentWidget.ViewBill).text(bill);
                        $(currentWidget.ViewTarsus).text(tarsus);
                        $(currentWidget.ViewNotes).text(notes);
                        $(currentWidget.ViewSite).SumoSelect();
                        $(currentWidget.Viewtype).SumoSelect();
                        $(currentWidget.ViewSpecies).SumoSelect();
                        $(currentWidget.ViewAge).SumoSelect();
                        $(currentWidget.ViewSex).SumoSelect();
                        $(currentWidget.ViewStatus).SumoSelect();
                        $(currentWidget.ViewMigration).SumoSelect();

                    }
                },
                error: function (err) {

                }

            });
        },


        GetValues: function (val) {
            if (val == null || val=="null") {
                return "";
            }
            return val.toString();
        },
        GetFormatedDate: function (val) {
            if (val == null) {
                return "";
            }
            var spltvals = val.split("-");
            return spltvals[2] + "-" + spltvals[1] + "-" + spltvals[0];
        },
        GetFormatedDateWithSlash: function (val) {
            var spltvals = val.split("-");
            return spltvals[0] + "/" + spltvals[1] + "/" + spltvals[2];
        },
        clearbirdsinfo: function () {
            var currentWidget = this;
            $(currentWidget.biPTTID).val('');
            $(currentWidget.biPTTweight).val('');
            $(currentWidget.biCaptureDate).val('');
            $(currentWidget.biCapTime).val('');
            $(currentWidget.biLatitude).val('');
            $(currentWidget.biLongitude).val('');
            $(currentWidget.bitype).val('');
            $(currentWidget.bisecondarytype).val('');
            $(currentWidget.biSite).val('');
            $(currentWidget.biSpecies).val('');
            $(currentWidget.biAge).val('');
            $(currentWidget.biSex).val('');
            $(currentWidget.biWeight).val('');
            $(currentWidget.biWings).val('');
            $(currentWidget.biBandID).val('');
            $(currentWidget.biActiveLastDate).val('');
            $(currentWidget.biStatus).val('AC');
            $(currentWidget.biRelDate).val('');
            $(currentWidget.biRelTime).val('');
            $(currentWidget.biPurchageyear).val('');
            $(currentWidget.biBill).val('');
            $(currentWidget.biTarsus).val('');
            $(currentWidget.biNotes).val('');
            $(currentWidget.biBirdName).val('');
            $(currentWidget.biSite)[0].sumo.reload();
            $(currentWidget.bitype)[0].sumo.reload();
            $(currentWidget.bisecondarytype)[0].sumo.reload();
            $(currentWidget.biSpecies)[0].sumo.reload();
            $(currentWidget.biAge)[0].sumo.reload();
            $(currentWidget.biSex)[0].sumo.reload();
            $(currentWidget.biStatus)[0].sumo.reload();
            $(currentWidget.biMigration)[0].sumo.reload();
            $(currentWidget.lblmessage).css("display", "none");
        },
        
        addbirdsinfo: function () {
            var currentWidget = this;          

            var isvalid = CheckDatesCompare($(currentWidget.biCaptureDate).val(), $(currentWidget.biRelDate).val());
            if (isvalid == false) {
                $(currentWidget.biCaptureDate).val("");
                $(currentWidget.biRelDate).val("");
                AlertMessages("warning", '', currentWidget._i18n.capdatelabel);
            }
            if (currentWidget.CheckBirdFormInputs() == false)
            {
                AlertMessages("warning", '', "Please enter mandatory fields");
                return;
            } 

            var values = $(currentWidget.biPTTID).val() + "|";
            values += $(currentWidget.biPTTweight).val().replace(".", "Deg") + "|";
            values += $(currentWidget.bitype).val() + "|";
            values += $(currentWidget.bisecondarytype).val() + "|";
            values += $(currentWidget.biPurchageyear).val() + "|";
            values += $(currentWidget.biBandID).val() + "|";
            values += $(currentWidget.biCaptureDate).val() + "|";
            values += $(currentWidget.biRelDate).val() + "|";
            values += $(currentWidget.biLatitude).val().replace(".", "Deg") + "|";
            values += $(currentWidget.biLongitude).val().replace(".", "Deg") + "|";
            values += $(currentWidget.biSite).val() + "|";
            values += $(currentWidget.biSpecies).val() + "|";
            values += $(currentWidget.biCapTime).val().replace(":", "Column").replace(":", "Column") + "|";
            values += $(currentWidget.biRelTime).val().replace(":", "Column").replace(":", "Column") + "|";
            values += $(currentWidget.biSex).val() + "|";
            values += $(currentWidget.biAge).val() + "|";
            values += $(currentWidget.biWeight).val().replace(".", "Deg") + "|";
            values += $(currentWidget.biWings).val().replace(".", "Deg") + "|";
            values += $(currentWidget.biBill).val().replace(".", "Deg") + "|";
            values += $(currentWidget.biTarsus).val().replace(".", "Deg") + "|";
            values += $(currentWidget.biStatus).val() + "|";
            values += $(currentWidget.biActiveLastDate).val() + "|";
            values += $(currentWidget.biNotes).val() + "|";
            values += $(currentWidget.biBirdName).val() + "|";
            values += $(currentWidget.biMigration).val() + "|";

            values += (configOptions.UserInfo.UserName) + "|";
            var requestData = {
                
                type: ((currentWidget.status == "Add") ? "Add" : "Update"),
                values: values
            };
            $.ajax({
                type: "POST",
                url: currentWidget.ServiceUrl + "jsonUpdateBirdInfo/",
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (val) {
                    if (val.indexOf("Success") != -1) {
                        if (currentWidget.status == "Add") {
                            //alert("Record Added Successfully");
                            AlertMessages("success", '', currentWidget._i18n.RecordisAddedSuccessfully);
                        }
                        else {
                            AlertMessages("success", '', currentWidget._i18n.RecordisUpdatedSuccessfully);
                        }
                        currentWidget.getBirdIds();
                        currentWidget.clearbirdsinfo();
                        $(currentWidget.biPTTID).val('');
                        $(currentWidget.Searchbirdid)[0].sumo.reload();
                    }
                    else {
                        //currentWidget.UpdateToolProgress("Failed to Add/Update Record..Check inputs", true, 5000);
                        AlertMessages("error", '', currentWidget._i18n.ErrorinUpdate);
                    }
                },
                error: function (err) {
                    AlertMessages("error", '', currentWidget._i18n.ErrorinUpdate);
                    //currentWidget.UpdateToolProgress("Failed to Add/Update Record..Check inputs", true, 5000);
                }
            });

        },
        CheckBirdNameStatus: function () {
            var currentWidget = this;
            var birdname = $(currentWidget.biBirdName).val();
            var pid = $(currentWidget.biPTTID).val();
            var requestData = {
                id: pid,
                speciesname: birdname
            };
            $.ajax({
                type: "POST",
                url: currentWidget.ServiceUrl + "JsonCheckBirdName/",
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (val) {
                    if (val == true) {
                        AlertMessages("warning", '', currentWidget._i18n.birdnamealreadyexists);
                        $(currentWidget.biBirdName).val("");
                    }
                },
                error: function (err) {
                    //currentWidget.UpdateToolProgress("Failed to Add/Update Record..Check inputs", true, 5000);
                }
            });
        },
        UpdateToolProgress: function (value, isResult, time) {
            windowProgress.open();
            if (isResult) {
                $("#toolProgress").html(value);
                window.setTimeout(windowProgress.close, time);
            }
            else {
                if (time == 0) {
                    $("#toolProgress").html(value + " ..");
                }
                else {
                    $("#toolProgress").html(value + " ...<i class='fa fa-cog fa-spin'></i>");
                }

            }
        },


        PopulateAgeCodes: function (id, results) {
            birdAgeCodes = results;
            id.empty();
            var val = [];
            var txt = [];
            for (var i = 0; i < results.length; i++) {
                val.push(results[i].AgeCode);
                txt.push(results[i].Description);
            }
            val.sort(function (a, b) {
                if (isNaN(a) || isNaN(b)) {
                    return a > b ? 1 : -1;
                }
                return a - b;
            });
            id
                .append("<option value='' ></option>");
            for (var i = 0; i < val.length; i++) {
                id
                    .append($("<option></option>")
                        .attr("value", val[i])
                        .text(txt[i]));
            }
        },

        PopulateSexCodes: function (id, results) {
            birdSexCodes = results;
            id.empty();
            var val = [];
            var txt = [];
            for (var i = 0; i < results.length; i++) {
                val.push(results[i].SexCode);
                txt.push(results[i].Description);
            }
            val.sort(function (a, b) {
                if (isNaN(a) || isNaN(b)) {
                    return a > b ? 1 : -1;
                }
                return a - b;
            });
            id
                .append("<option  value='' ></option>");
            for (var i = 0; i < val.length; i++) {
                id
                    .append($("<option></option>")
                        .attr("value", val[i])
                        .text(txt[i]));
            }
        },

       
        PopulateSpeciesCodes: function (id, results) {
            //birdSpeciesCode = results;
            var currentWidget = this;
            id.empty();
            var val = [];
            var txt = [];
            if (results.length == 0) return;
            results.sort(function (a, b) {
                var nameA = a.COMMON_NAME.toLowerCase(), nameB = b.COMMON_NAME.toLowerCase()
                if (nameA < nameB) //sort string ascending
                    return -1
                if (nameA > nameB)
                    return 1
                return 0 //default return value (no sorting)
            });

            for (var i = 0; i < results.length; i++) {
                val.push(results[i].SPECIES_CODE);
                txt.push(results[i].COMMON_NAME);
            }
            id.append("<option value=''></option>");
            for (var i = 0; i < val.length; i++) {
                id
                    .append($("<option></option>")
                        .attr("value", val[i])
                        .text(currentWidget.ConvertToTitleCase(txt[i])));
            }
        },

        PopulateSiteCodes: function (id, results) {
            id.empty();
            var val = [];
            var txt = [];
            for (var i = 0; i < results.length; i++) {
                val.push(results[i].BirdSites);
                txt.push(results[i].BirdSites);
            }
            id.append("<option value=''></option>");
            for (var i = 0; i < val.length; i++) {
                id
                    .append($("<option></option>")
                        .attr("value", val[i])
                        .text(txt[i]));
            }
        },


        GetBirdsTableData: function () {
            var currentWidget = this;
            var token = localStorage.getItem('token'); // Assuming 'token' is the key where your JWT is stored
            var refreshtoken = localStorage.getItem('refreshtoken');

            if (!token) {
                console.error("Token not found in localStorage!");
                return;
            }
            $.ajax({
                type: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                url: currentWidget.ServiceUrl + "jsonBirdAge",
                success: function (val) {
                    var birdinfo = jQuery.parseJSON(val.JSONBirdAgeResult);
                    currentWidget.PopulateAgeCodes($(currentWidget.biAge), birdinfo);
                },
                error: function (err) {
                    AlertMessages("error", '', currentWidget._i18n.UnabletoFetchAgeCodes);                    
                }

            });

            $.ajax({
                type: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                url: currentWidget.ServiceUrl + "jsonBirdSex",
                success: function (val) {
                    var birdinfo = jQuery.parseJSON(val.JSONBirdSexResult);
                    currentWidget.PopulateSexCodes($(currentWidget.biSex), birdinfo);
                },
                error: function (err) {
                    AlertMessages("error", '', currentWidget._i18n.UnabletoFetchSexCodes);                    
                }
            });

            $.ajax({
                type: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                url: currentWidget.ServiceUrl + "jsonBirdSpecies",
                success: function (val) {
                    var birdinfo = jQuery.parseJSON(val.JSONBirdSpeciesResult);
                    currentWidget.PopulateSpeciesCodes($(currentWidget.biSpecies), birdinfo);
                },
                error: function (err) {
                    AlertMessages("error", '', currentWidget._i18n.UnabletoFetchSpecies);
                }
            });

            $.ajax({
                type: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                url: currentWidget.ServiceUrl + "jsonBirdSite",
                success: function (val) {
                    var birdinfo = jQuery.parseJSON(val.JSONBirdSiteResult);
                    currentWidget.PopulateSiteCodes($(currentWidget.biSite), birdinfo);
                },
                error: function (err) {
                    AlertMessages("error", '', currentWidget._i18n.UnabletoFetchSpecies);
                }
            });
        },
        getPurchaseYear: function () {
            var currentWidget = this;
            var currentTime = new Date();
            var year = currentTime.getFullYear();
            var purchaseyear = $(currentWidget.biPurchageyear).val();
             if($(currentWidget.biPurchageyear).val() > year || purchaseyear.length < 4) {
                 AlertMessages("warning", '', currentWidget._i18n.EntervalidPurchaseYear);
                 $(currentWidget.biPurchageyear).val("");
              }
        },
        getLatitude: function () {
            var currentWidget = this;
            var Latitude = $(currentWidget.biLatitude).val();
            var regexLat = new RegExp('^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$');
            if (!regexLat.test($(currentWidget.biLatitude).val())) {
                AlertMessages("warning", '', currentWidget._i18n.EntervalidLatitude);
                $(currentWidget.biLatitude).val("");
            }
        },
        getLongitude: function () {
            var currentWidget = this;
            var Longitude = $(currentWidget.biLongitude).val();
            var regexLong = new RegExp('^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$');
            if (!regexLong.test($(currentWidget.biLongitude).val())) {
                AlertMessages("warning", '', currentWidget._i18n.EntervalidLongitude);
                $(currentWidget.biLongitude).val("");
            }
        },
        CheckBirdFormInputs: function () {
            var currentWidget = this;
            var currentTime = new Date();
            var year = currentTime.getFullYear();
            var purchaseyear = $(currentWidget.biPurchageyear).val();
           
            var formisValid = true;
            if ($(currentWidget.biPTTID).val() == '') {
                formisValid = false;
            }
            else if ($(currentWidget.biBirdName).val() == '') {
                formisValid = false;
            }

            else if ($(currentWidget.biLatitude).val() == '') {
                formisValid = false;
            }
            else if ($(currentWidget.biLongitude).val() == '') {
                formisValid = false;
            }
            else if ($(currentWidget.biCaptureDate).val() == '') {
                formisValid = false;
            }
            else if ($(currentWidget.bitype).val() == '') {
                formisValid = false;
            }
            else if ($(currentWidget.biSpecies).val() == '') {
                formisValid = false;
            }
            else if ($(currentWidget.biAge).val() == '') {
                formisValid = false;
            }

            else if ($(currentWidget.biSex).val() == '') {
                formisValid = false;
            }
            else if ($(currentWidget.biRelDate).val() == '') {
                formisValid = false;
            }

            else if ($(currentWidget.biRelTime).val() == '') {
                formisValid = false;
            }
            else if ($(currentWidget.biWeight).val() == '') {
                formisValid = false;
            }
            else if ($(currentWidget.biMigration).val() == '') {
                formisValid = false;
            }

            if (formisValid == false) {
                $(currentWidget.mandatory).css("display", "block");
                return formisValid;
            }
            else {
                $(".BirdInfoCard").hide()
                $(currentWidget.AddBirdDiv).fadeOut();
                $(currentWidget.Searchbirdid).val("");
                return formisValid;
            }
        },
        
        Empty: function () {

        },
        GetAgeCode: function (value) {
            for (var i = 0; i < birdAgeCodes.length; i++) {
                if (birdAgeCodes[i].AgeCode.toString() == value) {
                    var v = birdAgeCodes[i].Description;
                    return v;

                }
            }
        },
        GetSexCode: function (value) {
            for (var i = 0; i < birdSexCodes.length; i++) {
                if (birdSexCodes[i].SexCode.toString() == value) {
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

        ChangeSensorType: function () {
            var currentWidget = this;
            var data = $(currentWidget.bitype).val()
            if (data == "Argos" || data == "GSM") {
                $(currentWidget.bisecondarytype).val('');
                $(currentWidget.bisecondarytype).prop('disabled', true);
                $(currentWidget.bisecondarytype).val('');
                $(currentWidget.bisecondarytype)[0].sumo.reload();
            }
            else if (data == "GPS") {
                $(currentWidget.bisecondarytype).prop('disabled', false);
                $(currentWidget.bisecondarytype)[0].sumo.selectItem("Argos");
            }
        },
       
        
        CheckPlatformID: function () {
            var currentWidget = this;
            var PTTDID = $(currentWidget.biPTTID).val();
            var requestData = {
                id: PTTDID
            };
            $.ajax({
                type: "POST",
                url: currentWidget.ServiceUrl + "JsonGetStatusForNames/",
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (val) {
                    var birdinfo = jQuery.parseJSON(val);
                    if (birdinfo.length != 0) {
                        AlertMessages("error", '', currentWidget._i18n.PlatformIDAlreadyExist);
                        $(currentWidget.biPTTID).val('');
                    }

                },
                error: function (err) {
                   // AlertMessages("error", '', currentWidget._i18n.UnabletoFetchSexCodes);

                }

            });

        }

    });
});