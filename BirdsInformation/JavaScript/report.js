require([
    "emap/ReportsWidget/ReportsWidget",
    "emap/BTRouteWidget/BTRouteWidget",
    "dojo/domReady!"],
    function (ReportsWidget, BTRouteWidget) {

        var BTR = new BTRouteWidget({
            map: configOptions.CurrentMap,
           
        });
        BTR.startup();

        var reportdetails = new ReportsWidget({
            ServiceUrl: configOptions.ServiceUrl,
            queryResultsWidget: BTR,
        }, "Divreport");
        reportdetails.startup();

       
       
    });


