require([
    "emap/Login/Login",
    
    "dojo/domReady!"],
    function (LoginWidget ) {
        var LoginWdg = new LoginWidget({
            ServiceUrl: configOptions.ServiceUrl,
         }, "divLoginSec");
        LoginWdg.startup();
        
    });



