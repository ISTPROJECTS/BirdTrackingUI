define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/topic',
    "dojo/text!emap/AdminDetails/templates/AdminDetails.html",

    "dojo/i18n!emap/AdminDetails/nls/Resource",

], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, topic, dijitTemplate, i18n) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: dijitTemplate,

        widgetsInTemplate: true,
        _i18n: i18n,
        map: null,
        title: i18n.title,
        domNode: null,
        ServiceUrl: null,
        user: null,
        array1: null,
        array: null,
        selectedusername: null,
        selecteduserrole: null,
        selecteduserassignedbirds: null,
        selecteduserbirdsensortypes: null,
        AssignedtoPublicSponcerBirds: null,
        isUpdatesuccesfully: false,
        SelectedBirdNameIDs: [],
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
            topic.subscribe('Manageusers/ClearWidget', lang.hitch(this, function () {
                currentWidget.clearUsersinfo();
            }));
            $(".CloseContainer").click(function () {
                $(".ManageContainer").animate({
                    bottom: '-100%'
                }, 200);
            });

            $(currentWidget.AddUserBut).click(function () {
                $(currentWidget.UsersTable).hide();
                $(currentWidget.divsponsorcreation).show();
                $(currentWidget.Email).val("");
                $(currentWidget.SponserPassword).val("");
                $(currentWidget.SponserUsername).val("");
                $(currentWidget.ddlBirdAssign).val("");
                $(currentWidget.ddlBirdAssign)[0].sumo.reload();
                $(currentWidget.lbluser).css("display", "none");
                $(currentWidget.lblpwd).css("display", "none");
                $(currentWidget.lblemail).css("display", "none");
                $(currentWidget.lblAssignedBirds).css("display", "none");
                
            });

            $(".CloseUserForm").click(function () {
                $(currentWidget.divsponsorcreation).hide();
                $(currentWidget.UsersTable).show();
                $(currentWidget.Email).val("");
                $(currentWidget.SponserPassword).val("");
                $(currentWidget.SponserUsername).val("");
                $(currentWidget.ddlBirdAssign).val("");
                $(currentWidget.ddlBirdAssign)[0].sumo.reload();
                $(currentWidget.lbluser).css("display", "none");
                $(currentWidget.lblpwd).css("display", "none");
                $(currentWidget.lblemail).css("display", "none");
                $(currentWidget.lblAssignedBirds).css("display", "none");

            });

            $('.BtisTableFull').on("click", ".CloseAssignBtn", function (obj) {
                if (obj.target.id == 'btnclose') {
                    $(this).closest("tr").find(".AssignBirdDiv").hide();
                }
            });
            $('.BtisTableFull').on("click", ".assign", function (obj) {
                if (obj.target.id == 'btndelete') {

                    Swal.fire({
                        title: i18n.AreyousuretoDelete,
                        showDenyButton: true,
                        confirmButtonText: i18n.Yes,
                        denyButtonText: i18n.No,
                    }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                            currentWidget.DeleteUser(obj.target);
                            $(".icon-bar a").removeClass("active");
                            return true;
                        } else if (result.isDenied) {
                            $(".icon-bar a").removeClass("active");
                            return false;
                        }
                    })
                }
                else if (obj.target.id == 'btnassign') {
                    $(currentWidget.divassignbirds).show();
                    var id = $(this).parent().parent().children()[0].innerText;
                    currentWidget.getBirdIds("BirdIdDropdown" + id, obj.target);
                    $(".AssignBirdDiv").fadeOut();
                    $(this).closest("tr").find(".AssignBirdDiv").fadeIn();
                }
                else if (obj.target.id == 'btnverify') {
                    currentWidget.UserVerify(obj.target);
                }
            });

            $('.BtisTableFull').on("change", ".SelectAssignDropdown", function (obj) {
                $('#s_transtype').val($(this).val())
            });

            $('.BtisTableFull').on("click", ".SaveAssignBirdsBtn", function (obj) {
                if (obj.target.id == 'btnAssigntoUser') {
                    currentWidget.SetAssingbirdstoUser(obj.target);
                    if (currentWidget.isUpdatesuccesfully == true) {
                        $(this).closest("tr").find(".AssignBirdDiv").hide();
                    }
                }
            });
        },
        startup: function () {
            var currentWidget = this;
            currentWidget.GetDetails();
            currentWidget.PublicSponcerBirds();
            
        },
        clearUsersinfo: function () {
            var currentWidget = this;
            $(currentWidget.divsponsorcreation).hide();
            $(currentWidget.UsersTable).show();
        },
        PublicSponcerBirds: function () {
            var currentWidget = this;
            $.ajax({
                url: currentWidget.ServiceUrl + "JsonPublicSponsorAssignedIds1",
                type: 'GET',  // http method
                crossDomain: true,
                success: function (result) {
                    var jsonObj = JSON.parse(result.JsonPublicSponsorAssignedIds1Result);
                    //if (jsonObj.Status == false) {
                    //    AlertMessages(currentWidget._i18n.warning, '', jsonObj.message);
                    //    return;
                    //}
                    if (jsonObj != "null") {
                        if (jsonObj.Table != undefined) {
                            for (i = 0; i < jsonObj.Table.length; i++) {
                                if (i == 0) {
                                    currentWidget.AssignedtoPublicSponcerBirds = jsonObj.Table[i].AssignedBirds.split(",");
                                }
                                else {
                                    currentWidget.AssignedtoPublicSponcerBirds += ',' + jsonObj.Table[i].AssignedBirds.split(",");
                                }

                            }
                            
                        }
                        
                    }
                    currentWidget.getAssignBirds();
                },
                error: function (xhr, error) {
                    AlertMessages("error", "", currentWidget._i18n.Unabletofetchbirdids);
                },
            });
        },
        GetAssignbirdsPopup: function (id) {
            var currentWidget = this;
            var currentpopup = '<div class="AssignBirdDiv">'
            currentpopup += '<div class="row">'
            currentpopup += '<div class="form-group col-md-8 col-10 d-flex SumoMultiselect">'
            currentpopup += '<label class="LabelSec">' + currentWidget._i18n.SelectBirds + ' </label>'
            currentpopup += '<select class="form-control SelectAssignDropdown" placeholder="' + currentWidget._i18n.SelectBirds + '" id="BirdIdDropdown' + id + '" multiple></select>'          
            currentpopup += '<button class="btn btn-primary SaveAssignBirdsBtn" id="btnAssigntoUser">' + currentWidget._i18n.Save + '</button>'
            currentpopup += '<button class="btn btn-secondary CloseAssignBtn" id="btnclose">' + currentWidget._i18n.Cancel + '</button>'
            currentpopup += '</div></div></div>';
            return currentpopup;
        },
        GetDetails: function () {
            var currentWidget = this;
            $(currentWidget.UsersTable).html('');
            var tblhtml = '<tr><th style="display:none">' + currentWidget._i18n.ID + '</th><th style="width:12%">' + currentWidget._i18n.UserName + '</th><th style="width:8%">' + currentWidget._i18n.Role + '</th><th style="width:25%"> ' + currentWidget._i18n.Email + '</th><th style="width:35%">' + currentWidget._i18n.AssignedBirds + '</th><th style="width:20%;">' + currentWidget._i18n.Actions + '</th></tr>';
            $.ajax({
                url: currentWidget.ServiceUrl + "JsonGetAdminUserDtls",
                type: 'GET',  // http method
                crossDomain: true,
                success: function (result) {
                    $(currentWidget.UsersTable).html('');
                    var jsonObj = JSON.parse(result.JsonGetAdminUserDtlsResult);
                    if (jsonObj["Table1"] != "null") {
                        if (jsonObj["Table1"].length == 0) {
                            //AlertMessages(currentWidget._i18n.warning, '', currentWidget._i18n.NoResultsFound);
                            return;
                        }
                        for (var i = 0; i < jsonObj["Table1"].length; i++) {
                            if (jsonObj["Table1"][i].Role == null)
                                continue;
                            if (jsonObj["Table1"][i].Role.toUpperCase() == "PUBLIC" || jsonObj["Table1"][i].Role.toUpperCase() == "SPONSOR") {
                                var currentpopup = currentWidget.GetAssignbirdsPopup(jsonObj["Table1"][i].id);
                                if (jsonObj["Table1"][i].AssignedBirds == null) {
                                    jsonObj["Table1"][i].AssignedBirds = "";
                                }
                                var assids = jsonObj["Table1"][i].AssignedBirds.replaceAll(",", ", ");
                                if (jsonObj["Table1"][i].Role.toUpperCase() == "PUBLIC") {
                                    if (jsonObj["Table1"][i].isVerified == 0) {
                                        tblhtml += "< tr ><td style='width:100px; display:none'>" + jsonObj["Table1"][i].id + " </td><td style='width:100px'>" + jsonObj["Table1"][i].UserName + " </td><td style='width:100px'>" + jsonObj["Table1"][i].Role + " </td><td style='width:170px'>" + jsonObj["Table1"][i].Email + " </td><td class='AssignColumnTd'>" + assids + "</td><td>" + currentpopup + "<button id='btnassign' class='btn btn-primary assign' bird-id='" + jsonObj["Table1"][i].id + "'type='button'>" + currentWidget._i18n.Update + "</buttton><button id='btnverify' class='btn btn-primary assign' bird-id='" + jsonObj["Table1"][i].id + "'type='button'>" + currentWidget._i18n.Verify + "</buttton><button id='btndelete' class='btn btn-secondary assign delete' data-confirm='Are you sure to delete?'  type='button'>" + currentWidget._i18n.Delete + "</buttton></td><td style='display:none' class='sensorTypeTd'>" + jsonObj["Table1"][i].SensorType + "</td></tr >"
                                    }
                                    else {
                                        tblhtml += "< tr ><td style='width:100px; display:none'>" + jsonObj["Table1"][i].id + " </td><td style='width:100px'>" + jsonObj["Table1"][i].UserName + " </td><td style='width:100px'>" + jsonObj["Table1"][i].Role + " </td><td style='width:170px'>" + jsonObj["Table1"][i].Email + " </td><td class='AssignColumnTd'>" + assids + "</td><td>" + currentpopup + "<button id='btnassign' class='btn btn-primary assign' bird-id='" + jsonObj["Table1"][i].id + "'type='button'>" + currentWidget._i18n.Update + "</buttton><button id='btndelete' class='btn btn-secondary assign delete' data-confirm='Are you sure to delete?'  type='button'>" + currentWidget._i18n.Delete + "</buttton></td><td style='display:none' class='sensorTypeTd'>" + jsonObj["Table1"][i].SensorType + "</td></tr >"
                                    }
                                }
                                else if (jsonObj["Table1"][i].Role.toUpperCase() == "SPONSOR") {
                                    tblhtml += "< tr ><td style='width:100px; display:none'>" + jsonObj["Table1"][i].id + " </td><td style='width:100px'>" + jsonObj["Table1"][i].UserName + " </td><td style='width:100px'>" + jsonObj["Table1"][i].Role + " </td><td style='width:170px'>" + jsonObj["Table1"][i].Email + " </td><td class='AssignColumnTd'>" + assids + "</td><td>" + currentpopup + "<button id='btnassign' class='btn btn-primary assign' bird-id='" + jsonObj["Table1"][i].id + "'type='button'>" + currentWidget._i18n.Update + "</buttton><button id='btndelete' class='btn btn-secondary assign delete' data-confirm='Are you sure to delete?'  type='button'>" + currentWidget._i18n.Delete + "</buttton></td><td style='display:none' class='sensorTypeTd'>" + jsonObj["Table1"][i].SensorType + "</td></tr >"
                                }
                            }
                        }
                        //var sanitizedHtml = DOMPurify.sanitize(tblhtml);
                        //$(currentWidget.UsersTable).append(sanitizedHtml);
                        $(currentWidget.UsersTable).append(tblhtml);
                    }
                }
            });
        },
        getBirdIds: function (SelectDropdown, obj) {
            var currentWidget = this;
            var url = currentWidget.ServiceUrl + "jsonBirdIds";
            $.ajax({
                url: url,
                type: 'GET',  // http method
                crossDomain: true,
                success: function (result) {
                    var jsonObj = JSON.parse(result.JSONBirdIDsResult);
                    if (jsonObj != "null") {
                        for (i = 0; i < jsonObj.length; i++) {
                            if (jsonObj[i].Status == "AC") {
                                currentWidget.array1 = jsonObj;

                                if (currentWidget.AssignedtoPublicSponcerBirds == null) {
                                    //$("#" + SelectDropdown).append('<option value="' + jsonObj[i].PTTD + "-" + jsonObj[i].Type + '">' + jsonObj[i].PTTD + '</option>');
                                    $("#" + SelectDropdown).append('<option value="' + encodeURIComponent(jsonObj[i].PTTD + "-" + jsonObj[i].Type) + '">' + encodeURIComponent(jsonObj[i].PTTD) + '</option>');
                                }
                                else {
                                    if (currentWidget.AssignedtoPublicSponcerBirds.indexOf(jsonObj[i].PTTD) >= 0) {
                                        continue;
                                    }
                                    else {
                                        //$("#" + SelectDropdown).append('<option value="' + jsonObj[i].PTTD + "-" + jsonObj[i].Type + '">' + jsonObj[i].PTTD + '</option>');
                                        $("#" + SelectDropdown).append('<option value="' + encodeURIComponent(jsonObj[i].PTTD + "-" + jsonObj[i].Type) + '">' + encodeURIComponent(jsonObj[i].PTTD) + '</option>');
                                    }
                                }
                                                             
                            }
                        }
                        var AssignedBirds1 = obj.parentNode.parentNode.children[4].innerText;
                        var AssignedBirdsType1 = obj.parentNode.parentNode.children[6].innerText;
                        if (AssignedBirds1 != "null") {
                            var array1 = AssignedBirds1.split(", ");
                            var array2 = AssignedBirdsType1.split(",");
                            for (i = 0; i < array1.length; i++) {
                                $("#" + SelectDropdown).append('<option value="' + encodeURIComponent(array2[i]) + '">' + encodeURIComponent(array1[i]) + '</option>');
                            }
                        }
                    }
                    $("#" + SelectDropdown).SumoSelect({ search: true, searchText: 'Enter here.', selectAll: true, okCancelInMulti: true, forceCustomRendering: true, captionFormatAllSelected: ' {0} ' + currentWidget._i18n.SelectedAllItems, captionFormat: ' {0} ' + currentWidget._i18n.SelectedItems, locale: [currentWidget._i18n.OK, currentWidget._i18n.Cancel, currentWidget._i18n.SelectAll] });
                    currentWidget.selectedusername = obj.parentNode.parentNode.childNodes[1].innerText;
                    currentWidget.selecteduserrole = obj.parentNode.parentNode.childNodes[2].innerText;
                    var AssignedBirds = obj.parentNode.parentNode.children[4].innerText;
                    var Sensortype = obj.parentNode.parentNode.children[6].innerText
                    if (AssignedBirds != "null") {
                        var array = AssignedBirds.split(", ");
                        currentWidget.selecteduserassignedbirds = AssignedBirds.split(' ').join(',');
                        currentWidget.selecteduserbirdsensortypes = Sensortype.split(' ').join(',');
                        $('#s_transtype').val(currentWidget.selecteduserassignedbirds);
                        if (array.length == 0) {
                            return;
                        }
                        for (i = 0; i < array.length; i++) {  
                            for (j = 0; j < $("#" + SelectDropdown)[0].length; j++) {
                                if (array[i] == $("#" + SelectDropdown)[0].children[j].innerText) {
                                    $("#" + SelectDropdown)[0].parentNode.children[2].children[1].children[j].className += " selected"
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        currentWidget.selecteduserassignedbirds = "";
                        currentWidget.selecteduserbirdsensortypes = "";
                    }                    
                },
                error: function (xhr, error) {
                    AlertMessages("error", "", currentWidget._i18n.Unabletofetchbirdids);
                },
            });
        },
    
        getAssignBirds: function (SelectDropdown, obj) {
            var currentWidget = this;
            var url = currentWidget.ServiceUrl + "jsonBirdIds";
            $.ajax({
                url: url,
                type: 'GET',  // http method
                crossDomain: true,
                success: function (result) {
                    $(currentWidget.ddlBirdAssign).html("");
                    var jsonObj = JSON.parse(result.JSONBirdIDsResult);
                    if (jsonObj != "null") {
                        var BirdName;
                        for (i = 0; i < jsonObj.length; i++) {
                            if (jsonObj[i].Status == "AC") {
                                currentWidget.array1 = jsonObj;

                                if (currentWidget.AssignedtoPublicSponcerBirds == null) {
                                    BirdName = jsonObj[i]["BirdName"];
                                    var optionValue = $('<option>', {
                                        value: jsonObj[i].PTTD + "-" + jsonObj[i].Type,
                                        html: jsonObj[i].PTTD + ' (' + BirdName + ')'
                                        //text: jsonObj[i].PTTD + ' (' + BirdName + ')'
                                    });
                                    $(currentWidget.ddlBirdAssign).append(optionValue);
                                }
                                else {
                                    if (currentWidget.AssignedtoPublicSponcerBirds.indexOf(jsonObj[i].PTTD) >= 0) {
                                        continue;
                                    }
                                    else {
                                        BirdName = jsonObj[i]["BirdName"];
                                        var optionValue = $('<option>', {
                                            value: jsonObj[i].PTTD + "-" + jsonObj[i].Type,
                                            html: jsonObj[i].PTTD + ' (' + BirdName + ')'
                                            //text: jsonObj[i].PTTD + ' (' + BirdName + ')'
                                        });
                                        $(currentWidget.ddlBirdAssign).append(optionValue);
                                    }
                                }
                            }
                        }
                    }
                    $(currentWidget.ddlBirdAssign).SumoSelect({ search: true, selectAll: true, okCancelInMulti: true, placeholder: currentWidget._i18n.placeholderAssignBirds, forceCustomRendering: true, captionFormatAllSelected: ' {0} ' + currentWidget._i18n.SelectedAllItems, captionFormat: ' {0} ' + currentWidget._i18n.SelectedItems, locale: [currentWidget._i18n.OK, currentWidget._i18n.Cancel, currentWidget._i18n.SelectAll] });

                },
                error: function (xhr, error) {
                    AlertMessages("error", "", currentWidget._i18n.Unabletofetchbirdids);
                },
            });
        },        
        Cancelassingbirds: function () {
            var currentWidget = this;
            $(currentWidget.divassignbirds).hide();
        },
        SetAssingbirdstoUser: function (obj) {
            var currentWidget = this;
            var AssignedIdarray = [];
            var Assignedtypearray = [];
            var listofIds = obj.previousSibling.children[0].nextSibling.nextSibling.children[1].children;
            if (listofIds.length == 0) {
                $(currentWidget.lblerror).css("display", "block");
                return false;
            }
            for (j = 0; j < listofIds.length; j++) {
                if (listofIds[j].className == 'opt selected') {
                    for (i = 0; i < obj.previousSibling.children[0].children.length; i++) {
                        if (obj.previousSibling.children[0].children[i].innerText == listofIds[j].innerText) {
                            AssignedIdarray.push(obj.previousSibling.children[0].children[i].innerText);
                            Assignedtypearray.push(obj.previousSibling.children[0].children[i].value);
                        }
                    }
                }
            }
            if (AssignedIdarray.length > 0) {
                var assignids = AssignedIdarray.join(",");
                var assigntypes = Assignedtypearray.join(",");
                var requestData = {
                    AssignBirds: assignids,
                    SensorType: assigntypes,
                    login: currentWidget.selectedusername,
                    Role: currentWidget.selecteduserrole
                };
                var url = currentWidget.ServiceUrl + "JsonUpdateAssignBirdsByRole/";
                $.ajax({
                    url: url,
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        var jsonObj = JSON.parse(result);
                        if (jsonObj != null) {
                            if (jsonObj.message == "Assigned birds successfully.") {
                                AlertMessages("success", "", currentWidget._i18n.Assignedbirdssuccessfully);
                                currentWidget.isUpdatesuccesfully = true;
                            }
                            currentWidget.GetDetails();
                            currentWidget.PublicSponcerBirds();
                        }
                        currentWidget.selecteduserrole = null;
                        currentWidget.selectedusername = null;
                        assignedbirds = null;
                    },
                    error: function (xhr, error) {
                        currentWidget.selecteduserrole = null;
                        currentWidget.selectedusername = null;
                        assignedbirds = null;
                    },
                });
            }
            else {
                AlertMessages(currentWidget._i18n.warning, "", currentWidget._i18n.SelectBirdIds);
                currentWidget.isUpdatesuccesfully = fasle;
            }
        },
        ClearUsername: function () {
            var currentWidget = this;
            $(currentWidget.lbluser).css("display", "none");
        },
        ClearPassword: function () {
            var currentWidget = this;
            $(currentWidget.lblpwd).css("display", "none");
        },
        ClearEmail: function () {
            var currentWidget = this;
            $(currentWidget.lblemail).css("display", "none");
        },
        ClearBirdIds: function () {
            var currentWidget = this;
            $(currentWidget.lblAssignedBirds).css("display", "none");
        },
        RegisterUser: function () {
            var currentWidget = this;
            try {
                var UserName = $(currentWidget.SponserUsername).val();
                var password = $(currentWidget.SponserPassword).val();
                var email = $(currentWidget.Email).val();
                var platFormID = $(currentWidget.ddlBirdAssign).val();
                var emailReg = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                var Role = "Sponsor";
                var isverified = "1";
                $(currentWidget.lblAssignedBirds).css("display", "none");
                var Phonenumber = null;
                var formIsValid = true;
                if ($(currentWidget.SponserUsername).val() == "") {
                    $(currentWidget.lbluser).css("display", "block");
                    formIsValid = false;
                }
                if ($(currentWidget.SponserPassword).val() == "") {
                    $(currentWidget.lblpwd).css("display", "block");
                    formIsValid = false;
                }
                if (!emailReg.test(email) || email == "") {
                    $(currentWidget.lblemail).css("display", "block");
                    formIsValid = false;
                }
                if (platFormID == "") {
                    $(currentWidget.lblAssignedBirds).css("display", "block");
                    formIsValid = false;
                }
                if (formIsValid == false) {
                    return;
                }
                var assignedIds = "";
                var SensorTypePIds = "";
                for (var k = 0; k < platFormID.length; k++) {
                    if (SensorTypePIds == "") {
                        SensorTypePIds = platFormID[k];
                    }
                    else {
                        SensorTypePIds = SensorTypePIds + "," + platFormID[k];
                    }
                    var birdid = platFormID[k].split("-");
                    if (assignedIds == "") {
                        assignedIds = birdid[0];
                    } else {
                        assignedIds = assignedIds + "," + birdid[0];
                    }
                }
                var requestData = {
                    login: UserName,
                    password: password,
                    email: email,
                    Role: Role,
                    Phoneno: Phonenumber,
                    isVerified: isverified,
                    AssignBirds: assignedIds,
                    SensorType: SensorTypePIds
                };
                var url = currentWidget.ServiceUrl + 'JsonRegisteredUser/';
                $(".Overlay").fadeIn();
                $.ajax({
                    url: url,
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        var jsonObj = JSON.parse(result);
                        if (jsonObj.message == "User created successfully.") {
                            AlertMessages("success", "", currentWidget._i18n.Usercreatedsuccessfully);
                        }
                        else if (jsonObj.message == "User Name already exists.") {
                            AlertMessages("warning", "", currentWidget._i18n.UserNamealreadyexists);
                        }
                        else if (jsonObj.message == "User already registered with this Email") {
                            AlertMessages("warning", "", currentWidget._i18n.UseralreadyregisteredwiththisEmail);
                        }
                        $(".Overlay").fadeOut();
                        $(currentWidget.divsponsorcreation).hide();
                        $(currentWidget.UsersTable).show();
                        currentWidget.GetDetails();
                        currentWidget.PublicSponcerBirds();
                        $(currentWidget.SponserUsername).val("");
                        $(currentWidget.SponserPassword).val("");
                        $(currentWidget.Email).val("");
                    },
                    error: function (xhr, error) {
                        $(currentWidget.divsponsorcreation).hide();
                        $(currentWidget.UsersTable).show();
                        $(currentWidget.SponserUsername).val("");
                        $(currentWidget.SponserPassword).val("");
                        $(currentWidget.Email).val("");
                        var pgDirB = document.getElementsByTagName('html');
                        AlertMessages("error", "", currentWidget._i18n.UnabletoCreateUser);
                        $(".Overlay").fadeOut();
                    },
                });
            }
            catch (e) {
                $(currentWidget.divsponsorcreation).hide();
                $(currentWidget.UsersTable).show();
                console.log(e);
            }
        },


        DeleteUser: function (user) {
            var currentWidget = this;
            var requestdata = {
                updatedby: configOptions.UserInfo.UserName,
                login: user.parentNode.parentNode.childNodes[1].innerText,
            };
            var url = currentWidget.ServiceUrl + 'JsonUserDelete/';
            $.ajax({
                url: url,
                type: 'POST',  // http method
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestdata),
                success: function (result) {
                    var jsonObj = JSON.parse(result);
                    if (jsonObj.message == "User Deleted successfully") {
                        AlertMessages("success", "", currentWidget._i18n.UserDeletedsuccessfully);
                    }
                    currentWidget.GetDetails();
                    currentWidget.PublicSponcerBirds();                    
                },
                error: function (xhr, error) {
                    console.debug(xhr); console.debug(error);
                },
            });
        },
        UserVerify: function (obj) {
            var currentWidget = this;
            var user = obj.parentNode.parentNode.childNodes[1].innerText;
            var email = obj.parentNode.parentNode.childNodes[3].innerText;
            var requestData = {
                login: obj.parentNode.parentNode.childNodes[1].innerText,
                email: obj.parentNode.parentNode.childNodes[3].innerText,
            };
            var url = currentWidget.ServiceUrl + 'JsonVerifyUser/';
            $(".Overlay").fadeIn();
            $.ajax({
                url: url,
                type: 'POST',  // http method
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {
                    var jsonObj = JSON.parse(result);
                    if (jsonObj.updateStatus == true) {
                        currentWidget.GetDetails();
                        if (jsonObj.message == "User verified successfully.")
                            AlertMessages("success", "", currentWidget._i18n.Userverifiedsuccessfully);
                        $(".Overlay").fadeOut();
                    }
                    else {
                        if (jsonObj.message == "Unable to verify the account.")
                            AlertMessages("error", "", currentWidget._i18n.Unabletoverifytheaccount);
                        $(".Overlay").fadeOut();
                    }
                },
                error: function (xhr, error) {
                    console.debug(xhr); console.debug(error);
                    $(".Overlay").fadeOut();
                },
            });

        }
    });
});



