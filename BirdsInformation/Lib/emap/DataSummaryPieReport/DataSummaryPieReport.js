define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    "dojo/text!emap/DataSummaryPieReport/templates/DataSummaryPieReport.html",

    "dojo/i18n!emap/DataSummaryPieReport/nls/Resource",
    'xstyle/css!../DataSummaryPieReport/css/DataSummaryPieReport.css',
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

        
        SummaryPieChart: function (GSMData, GPSData, ArgosData) {
            var currentWidget = this;
            var total = (parseInt(GSMData) + parseInt(GPSData) + parseInt(ArgosData));
            var GSMpercent = ((parseInt(GSMData) / total) * 100);
            var GPSpercent = ((parseInt(GPSData) / total) * 100);
            var Argospercent = ((parseInt(ArgosData) / total) * 100);

            Highcharts.setOptions({
                colors: ["#a3bdf0", "#f7ce7c", "#f3fc47",]
            });

            Highcharts.chart('divcontainersummary', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: currentWidget._i18n.GPSGSMandArgosDataSummary,
                    align: "left",
                    style: {
                        fontWeight: "bold",
                        fontSize: "14px",
                        fontFamily: "Open Sans"
                    }
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                credits: {
                    enabled: false
                },
                accessibility: {
                    point: {
                        valueSuffix: '%'
                    }
                },
                plotOptions: {
                    pie: {
                        showInLegend: false,
                        dataLabels: {
                            enabled: true,
                            distance: '-50',
                            format: '<b>{point.name}</b></br> {point.percentage:.1f} %',
                        },
                        point: {
                            events: {}
                        },
                        allowPointSelect: true,
                        cursor: "pointer"
                    }
                },                
                exporting: {
                    accessibility: {
                        enabled: true
                    },
                    filename: "GSM,GPS,ARGOS Report",
                },
                series: [{
                    name: currentWidget._i18n.Type,
                    colorByPoint: true,
                    data: [{
                        name: 'GPS',
                        y: GPSpercent

                    }, {
                        name: 'GSM',
                        y: GSMpercent
                    },
                    {
                        name: 'ARGOS',
                        y: Argospercent
                        },
                        
                    ]
                }]
            });
        },
        getDataSummary: function () {
            var currentWidget = this;
            var token = localStorage.getItem('token'); // Assuming 'token' is the key where your JWT is stored
            var refreshtoken = localStorage.getItem('refreshtoken');

            if (!token) {
                console.error("Token not found in localStorage!");
                return;
            }
            var GPSData, GSMData, ArgosData;
            $(".Overlay").fadeIn();
            $.ajax({
                type: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                url: currentWidget.ServiceUrl + "getTransactionsCount",
                success: function (data) {
                    var ResultSet = data.getTransactionsCountResult;
                    for (var i = 0; i <= ResultSet.length - 1; i++) {
                        if ((ResultSet[i].TransmitterType).toUpperCase() == 'ARGOS') {
                            ArgosData = ResultSet[i].NoOfRecords;
                            var ArgosFormat = ArgosData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            $('#lblArgosData').text(ArgosFormat + " ");
                        }
                        else if ((ResultSet[i].TransmitterType).toUpperCase() == 'GPS') {
                            GPSData = ResultSet[i].NoOfRecords;
                            var GPSFormat = GPSData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            $('#lblGPSData').text(GPSFormat + " ");
                        }
                        else if ((ResultSet[i].TransmitterType).toUpperCase() == 'GSM') {
                            GSMData = ResultSet[i].NoOfRecords;
                           var GSMFormat =  GSMData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            $('#lblGsmData').text(GSMFormat + " ");
                        }
                    }
                    var totaldata = parseInt(ArgosData) + parseInt(GPSData) + parseInt(GSMData);
                    var totalformatdata = totaldata.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    $("#lblresults").text(totalformatdata);
                    currentWidget.SummaryPieChart(GSMData, GPSData, ArgosData);
                    $(".Overlay").fadeOut();
                },
                error: function (xhr, error) {
                    AlertMessages("error", '', currentWidget._i18n.UnabletofetchSensortypeDetails);
                    console.debug(xhr); console.debug(error);
                    $(".Overlay").fadeOut();
                },
            });
        }
    });
});