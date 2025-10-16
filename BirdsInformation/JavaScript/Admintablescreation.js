require([
    
    "emap/AdminDetails/AdminDetails",
    "dojo/domReady!"],
    function (AdminDetails) {
        
        var adminwidget = new AdminDetails({
            ServiceUrl: configOptions.ServiceUrl
        }, "AdminValues");
        adminwidget.startup();
        
        

        //var Admin = new AdminDetails({
        //    ServiceUrl: configOptions.ServiceUrl
        //}, "AdminValues");
        //Admin.startup();
    });


