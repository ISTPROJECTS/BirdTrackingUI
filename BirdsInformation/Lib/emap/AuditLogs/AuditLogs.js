define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    "dojo/text!emap/AuditLogs/templates/AuditLogs.html",

    "dojo/i18n!emap/AuditLogs/nls/Resource",

], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, dijitTemplate, i18n) {
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
        DataList:null,
        selectedusername: null,
        selecteduserrole: null,
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

            $(".CloseContainer").click(function () {
                $(".ManageContainer").animate({
                    bottom: '-100%'
                }, 200);

                var pgDirR = document.getElementsByTagName('html');
                if (pgDirR[0].dir == 'rtl' || pgDirR[0].style.direction == 'rtl') {
                    $(".esriSimpleSliderTL").animate({ right: '20px' }, 200);
                }
                else {
                    $(".esriSimpleSliderTL").animate({ left: '20px' }, 200);
                }
                $(currentWidget.auditfromdate).val("");
                $(currentWidget.audittodate).val("");
                $(currentWidget.AuditLogTable).html("");
                $(currentWidget.TableAuditDiv).css("display", "none");
            });
           
        },
        startup: function () {
            var currentWidget = this;
            
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
        getresults: function () {
            var currentWidget = this;
            var fromdate = $(currentWidget.auditfromdate).val();
            var todate = $(currentWidget.audittodate).val();
            $(currentWidget.lbltodate).css("display", "none");
            $(currentWidget.lblfromdate).css("display", "none");

            var formIsValid = true;
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

            if (formIsValid == false)
                return false;
            var requestData = {
                fromdate: fromdate,
                todate: todate
            };
            $.ajax({
                url: currentWidget.ServiceUrl + "JsonGetAuditStatus/",
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (result) {
                    var report = JSON.parse(result);
                    currentWidget.DataList = [];
                    var dataSet = currentWidget.DataList;

                    $(currentWidget.TableAuditDiv).css("display", "block");
                    for (var i = 0; i < report.length; i++) {

                        if (report[i].ActivityStatus == "Created") {
                            var ResultData = [];
                            ResultData = [i + 1, "user " + report[i].UserName + " Created on " + report[i].LogTimeStamp.split("T")[0] + " from " + report[i].Location + " by " + report[i].UpdatedBy]
                            dataSet.push(ResultData);
                        }
                        else if (report[i].ActivityStatus == "Deleted") {
                            var ResultData = [];
                            ResultData = [i + 1, "user " + report[i].UserName + " Deleted on " + report[i].LogTimeStamp.split("T")[0] + " from " + report[i].Location + " by " + report[i].UpdatedBy]
                            dataSet.push(ResultData);
                        }
                        else if (report[i].ActivityStatus == "Login") {
                            var ResultData = [];
                            ResultData = [i + 1, "user " + report[i].UserName + " Login on " + report[i].LogTimeStamp.split("T")[0] + " from " + report[i].Location + " by " + report[i].UpdatedBy]
                            dataSet.push(ResultData);
                        }
                        else if (report[i].ActivityStatus == "LogOut") {
                            var ResultData = [];
                            ResultData = [i + 1, "user " + report[i].UserName + " LogOut on " + report[i].LogTimeStamp.split("T")[0] + " from " + report[i].Location + " by " + report[i].UpdatedBy]
                            dataSet.push(ResultData);
                        }
                    }

                    var pgDirR = document.getElementsByTagName('html');
                    if (pgDirR[0].dir == 'rtl' || pgDirR[0].style.direction == 'rtl') {
                        $(currentWidget.AuditLogTable).DataTable({
                            data: dataSet,
                            destroy: true,
                            "bLengthChange": false,
                            "language": {
                                "url": "//cdn.datatables.net/plug-ins/1.11.3/i18n/ar.json"
                            },
                            columns: [
                                { title: currentWidget._i18n.SNo },
                                { title: currentWidget._i18n.ActivityStatus },

                            ]
                        });
                        var table = $(currentWidget.AuditLogTable).DataTable();
                        $('.dataTables_filter input').unbind().keyup(function (e) {
                            var value = $(this).val();
                            if (value.length >= 2) {

                                table.search(value).draw();
                            } else {
                                //optional, reset the search if the phrase 
                                //is less then 3 characters long
                                table.search('').draw();
                            }
                        });
                    }
                    else {
                        $(currentWidget.AuditLogTable).DataTable({
                            data: dataSet,
                            destroy: true,
                            "bLengthChange": false,
                             columns: [
                                { title: currentWidget._i18n.SNo },
                                { title: currentWidget._i18n.ActivityStatus },

                            ]
                        });
                        var table = $(currentWidget.AuditLogTable).DataTable();
                        $('.dataTables_filter input').unbind().keyup(function (e) {
                            var value = $(this).val();
                            if (value.length >= 2) {
                                
                                table.search(value).draw();
                            } else {
                                //optional, reset the search if the phrase 
                                //is less then 3 characters long
                                table.search('').draw();
                            }
                        });
                    }
                },
                error: function (xhr, error) {
                    AlertMessages("error", '', currentWidget._i18n.NoResultsFound);

                },

            });

        },
        clearresults: function () {
            var currentWidget = this;
            $(currentWidget.auditfromdate).val("");
            $(currentWidget.audittodate).val("");
            $(currentWidget.AuditLogTable).html("");
            $(currentWidget.TableAuditDiv).css("display", "none");
        }
    });
});



