define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    "dojo/text!emap/DataSummaryBarReport/templates/DataSummaryBarReport.html",

    "dojo/i18n!emap/DataSummaryBarReport/nls/Resource"

], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, dijitTemplate, i18n) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: dijitTemplate,
        widgetsInTemplate: true,
        i18n: i18n,
        map: null,
        title: i18n.title,
        domNode: null,
        ServiceUrl: null,
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
        },
        startup: function () {
            var currentWidget = this;
            currentWidget.getDataSummary();            
        },
        SummaryBarChart: function (data, xaxisdata) {
            var currentWidget = this;            
            var DatainSeries = [];
            for (var k = 0; k < data.length; k++) {
                var names = [];
                var DataArray = [];
                for (key in data[k].Collection) {
                    if (data[k].Collection.hasOwnProperty(key)) {
                        names.push(key);
                    }
                }
                for (i = 0; i < names.length; i++) {
                    DataArray.push({ Names: names[i], data: data[k].Collection[names[i]].length });
                }
            }
            var ResultNames = [];
            var ResultData = currentWidget.groupBy1(DataArray, "Names");
            for (key in ResultData) {
                if (ResultData.hasOwnProperty(key)) {
                    ResultNames.push(key);
                }
            }            
            var RealData = [];
            for (var m = 0; m < ResultNames.length; m++) {

                for (i = 0; i < ResultData[ResultNames[m]].length; i++) {
                    RealData.push([ResultData[ResultNames[m]][i].Names, ResultData[ResultNames[m]][i].data]);
                }
            }           

            Highcharts.chart('containerbarchartsummary', {
                chart: {
                    type: 'column'
                },                
                title: {
                    text: currentWidget._i18n.SpeciesDataSummary,
                     align: "left",
                    style: {
                        fontWeight: "bold",
                        fontSize: "14px",
                        fontFamily: "Open Sans"
                    }
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    categories: xaxisdata,
                    title: {
                        text: currentWidget._i18n.SpeciesNames,
                        style:"font-size:30px"
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: currentWidget._i18n.NumberofPttids,
                        style: "font-size:30px"
                    }
                },
                exporting: {
                    accessibility: {
                        enabled: true
                    },
                    filename: "Species Report",
                },
                //series: DatainSeries,
                series: [{
                    name: currentWidget._i18n.NumberofSpecies,
                    data: RealData,
                }],
            });
        },
        getDataSummary: function () {
            var currentWidget = this;
            var GPSData, GSMData, ArgosData;
            $.ajax({
                type: "GET",
                url: currentWidget.ServiceUrl + "JsonGetSpeciesData",
                success: function (result) {
                    var jsonObj = JSON.parse(result.JsonGetSpeciesDataResult);
                    if (jsonObj == 0) {
                        AlertMessages("warning", '', currentWidhet._i18n.NoResultsFound);
                        return;
                    }
                    if (jsonObj != null) {
                        for (i = 0; i < jsonObj.length; i++) {
                            var speciesname = currentWidget.ConvertToTitleCase(jsonObj[i].CommonName);
                            jsonObj[i].CommonName = speciesname;
                        }
                        var names = [];
                        var CommonNamesData = [];

                        var CommonNames = currentWidget.groupBy1(jsonObj, "CommonName");
                    }
                    for (key in CommonNames) {
                        if (CommonNames.hasOwnProperty(key)) {
                            names.push(key);
                        }
                    }
                    var xaxisData;
                    for (i = 0; i < names.length; i++) {
                        xaxisData += names[i] + ",";
                        CommonNamesData.push({ Name: names[i], Collection: CommonNames });                        
                    }
                    currentWidget.SummaryBarChart(CommonNamesData, names);
                },
                error: function (xhr, error) {                   
                    AlertMessages("error", '', currentWidget._i18n.UnabletofetchBarReport);
                    console.debug(xhr); console.debug(error);
                },
            });            
        },
        groupBy1: function (xs, prop) {
            var grouped = {};
            for (var i = 0; i < xs.length; i++) {
                var p = xs[i][prop];
                if (!grouped[p]) { grouped[p] = []; }
                grouped[p].push(xs[i]);
            }
            return grouped;
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
        }
    });
});