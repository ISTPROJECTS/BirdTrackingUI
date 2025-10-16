define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/topic',
    "dojo/text!emap/AssignIdsToGroup/templates/AssignIdsToGroup.html",

    /*'dojo/i18n!../BirdInfo/nls/jsapi'*/
    "dojo/i18n!emap/AssignIdsToGroup/nls/jsapi",
    'xstyle/css!../AssignIdsToGroup/css/AssignIdsToGroup.css',
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
        selecteduserassignedbirds: null,
        selecteduserbirdsensortypes: null,
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
            $(".CloseContainer").click(function () {
                $(".ManageContainer").animate({
                    bottom: '-100%'
                }, 200);
                var pgDirR = document.getElementsByTagName('html');
                if (pgDirR[0].dir == 'rtl' || pgDirR[0].style.direction == 'rtl')
                    $(".esriSimpleSliderTL").animate({ right: '20px' }, 200);
                else
                    $(".esriSimpleSliderTL").animate({ left: '20px' }, 200);
                $(currentWidget.lblGroup).css("display", "none");
                $(currentWidget.lblBirdid).css("display", "none");
            });

        },

        startup: function () {
            var currentWidget = this;
            currentWidget.getAssignBirds();
            currentWidget.getGroupsNames();
        },
        getGroupsNames: function () {
            var currentWidget = this;
            $(currentWidget.ddlGroup).empty();
            $(currentWidget.lblGroup).css("display", "none");
            var Pid = currentWidget._i18n.Public;
            $(currentWidget.ddlGroup).append('<option value="Public">' + encodeURIComponent(currentWidget._i18n.Public) + '</option>');
            $(currentWidget.ddlGroup).SumoSelect();
        },
        ClearBirdid: function () {
            var currentWidget = this;
            $(currentWidget.lblBirdid).css("display", "none");
        },
        ClearGroupNames: function () {
            var currentWidget = this;
            $(currentWidget.lblGroup).css("display", "none");
        },
        CheckedAssignedBirds: function () {
            var currentWidget = this;
            var AssignedBirds = "";
            var Sensortype = "";
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
                        AssignedBirds = jsonObj.Table1[0].AssignIDs;
                        Sensortype = jsonObj.Table1[0].SensorType;
                        if (AssignedBirds != "null") {
                            var array = AssignedBirds.split(",");
                            currentWidget.selecteduserassignedbirds = AssignedBirds.split(' ').join(',');
                            currentWidget.selecteduserbirdsensortypes = Sensortype.split(' ').join(',');
                            if (array.length == 0) {
                                return;
                            }
                            for (i = 0; i < array.length; i++) {
                                for (j = 0; j < $(currentWidget.ddlBirdAssign)[0].length; j++) {
                                    if (array[i] == $(currentWidget.ddlBirdAssign)[0].children[j].innerText) {
                                        $(currentWidget.ddlBirdAssign)[0].parentNode.children[2].children[1].children[j].className += " selected"
                                    }
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
                    console.debug(xhr); console.debug(error);
                },

            });
        },
        
        getAssignBirds: function (SelectDropdown, obj) {
            var currentWidget = this;
            $(currentWidget.ddlBirdAssign).val("");
            $(currentWidget.lblBirdid).css("display", "none");
            var url = configOptions.ServiceUrl + 'JsonGetGroupAssignedIDs/';
            var requestData = {
                GroupName: "Public"
            };
            $.ajax({
                type: 'POST',  // http method
                crossDomain: true,
                url: url,
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {
                    var jsonObj = JSON.parse(result);
                    if (jsonObj.Table2.length > 0) {
                        for (var j = 0; j < jsonObj.Table2.length; j++) {
                            if (jsonObj.Table2[j].Status == "AC") {
                                if (jsonObj.Table1.length == 0) {
                                    $(currentWidget.ddlBirdAssign).append('<option value="' + encodeURIComponent(jsonObj.Table2[j].PTTD + "-" + jsonObj.Table2[j].Type) + '">' + encodeURIComponent(jsonObj.Table2[j].PTTD) + '</option>');
                                }
                                else {
                                    if (jsonObj.Table1[0].AssignIDs.indexOf(jsonObj.Table2[j].PTTD) != -1) {
                                        $(currentWidget.ddlBirdAssign).append('<option selected value="' + encodeURIComponent(jsonObj.Table2[j].PTTD + "-" + jsonObj.Table2[j].Type) + '">' + encodeURIComponent(jsonObj.Table2[j].PTTD) + '</option>');
                                    }
                                    else {
                                        $(currentWidget.ddlBirdAssign).append('<option value="' + encodeURIComponent(jsonObj.Table2[j].PTTD + "-" + jsonObj.Table2[j].Type) + '">' + encodeURIComponent(jsonObj.Table2[j].PTTD) + '</option>');
                                    }
                                }
                            }
                        }
                    }
                    $(currentWidget.ddlBirdAssign).SumoSelect({
                        search: true,
                        placeholder: currentWidget._i18n.placeholderSelectHere,
                        selectAll: true, okCancelInMulti: true, isClickAwayOk: true,
                        forceCustomRendering: true,
                        captionFormat: ' {0} ' + currentWidget._i18n.SelectedItems,
                        captionFormatAllSelected: ' {0} ' + currentWidget._i18n.SelectedAllItems,
                        locale: [currentWidget._i18n.OK, currentWidget._i18n.Cancel, currentWidget._i18n.SelectAll],
                    });
                },
                error: function (xhr, error) {
                    AlertMessages("error", "", currentWidget._i18n.Unabletofetchbirdids);
                    $(".Overlay").fadeOut();
                },
            });

        },
        AssignIDsGroup: function () {
            var currentWidget = this;
            $(".Overlay").fadeIn();
            try {
                var GroupName = $(currentWidget.ddlGroup).val();
                var platFormID = $(currentWidget.ddlBirdAssign).val();
                $(currentWidget.lblBirdid).css("display", "none");
                $(currentWidget.lblGroup).css("display", "none");
                var formIsValid = true;
                if (GroupName == "") {
                    $(currentWidget.lblGroup).css("display", "block");
                    formIsValid = false;
                }
                if (platFormID == "" || platFormID == null) {
                    $(currentWidget.lblBirdid).css("display", "block");
                    formIsValid = false;
                }
                if (formIsValid == false) {
                    $(".Overlay").fadeOut();
                    return;
                }
                var assignedIds = "";
                var SensorTypePIds = "";
                var AssignedIdarray = [];
                var Assignedtypearray = [];
                var listofIds = $(currentWidget.ddlBirdAssign)[0].nextSibling.nextSibling.children[1].children;
                for (j = 0; j < listofIds.length; j++) {
                    if (listofIds[j].className == 'opt selected') {
                        for (i = 0; i < $(currentWidget.ddlBirdAssign)[0].children.length; i++) {
                            if ($(currentWidget.ddlBirdAssign)[0].children[i].innerText == listofIds[j].innerText) {
                                AssignedIdarray.push($(currentWidget.ddlBirdAssign)[0].children[i].innerText);
                                Assignedtypearray.push($(currentWidget.ddlBirdAssign)[0].children[i].value);
                            }
                        }
                    }
                }
                if (AssignedIdarray.length > 0) {
                    assignedIds = AssignedIdarray.join(",");
                    SensorTypePIds = Assignedtypearray.join(",");
                }
                var requestData = {
                    GroupName: GroupName,
                    AssignBirds: assignedIds,
                    SensorType: SensorTypePIds
                };
                var url = currentWidget.ServiceUrl + 'JsonAssignIdsToGroup/';
                $(".Overlay").fadeIn();
                $.ajax({
                    url: url,
                    type: 'POST',  // http method
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function (result) {
                        var jsonObj = JSON.parse(result);
                        if (jsonObj.message == "Ids Assigned successfully.") {
                            AlertMessages("success", "", currentWidget._i18n.IdsAssignedsuccessfully);
                        }
                        $(".Overlay").fadeOut();
                    },
                    error: function (xhr, error) {
                        AlertMessages("error", "", currentWidget._i18n.UnabletoAssignIds);
                        $(".Overlay").fadeOut();
                    },
                });
            }
            catch (e) {
                console.log(e);
            }
        }
    });
});