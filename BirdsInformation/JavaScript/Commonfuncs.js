function changeColor(obj,value, id) {
    var currentLayer = configOptions.CurrentMap.getLayer(id);
    if (id.indexOf("_P") >= 0) {
        var FeatureLayerId = "Feature_" + id;
        var FCurrentLayer = configOptions.CurrentMap.getLayer(FeatureLayerId);
    }
    if (id.indexOf("_T") >= 0) {
        var TextLayerFeatureID = "LabelFeature_" + id;
        var TextFeatureCurrentLayer = configOptions.CurrentMap.getLayer(TextLayerFeatureID);
    }


    

    var oldColor = $(obj).attr("current-color").toUpperCase();
    if (oldColor == value.toUpperCase()) {
        return;
    }

    if (id.indexOf("MCPLayer") >= 0) {
        var colorobj = esri.Color.fromHex(value);
        colorobj.a = 0.40;
        var MCPCurrentLayer = configOptions.CurrentMap.getLayer(id);
        if (MCPCurrentLayer.graphics[0].symbol.color.toHex().toUpperCase() == oldColor) {
            MCPCurrentLayer.graphics[0].symbol.setColor(colorobj);
            MCPCurrentLayer.graphics[0].symbol.setOutline(new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, esri.Color.fromHex(value), 2));
        }
        MCPCurrentLayer.redraw();
    }
    else if(currentLayer.graphics.length > 0) {
        for (var i = 0; i < currentLayer.graphics.length; i++) {
            if (currentLayer.graphics[i].symbol.color.toHex().toUpperCase() == oldColor) {
                currentLayer.graphics[i].symbol.setColor(esri.Color.fromHex(value));
            }
        }
        currentLayer.redraw();
    }

    
    if (id.indexOf("_P") >= 0) {
        if (FCurrentLayer.graphics.length > 0) {
            for (var i = 0; i < FCurrentLayer.graphics.length; i++) {
                if (typeof (FCurrentLayer.graphics[i]._sourceLayer.renderer._symbols) == "undefined") {
                    if (FCurrentLayer.graphics[i]._sourceLayer.renderer.symbol.color != null) {
                        if (FCurrentLayer.graphics[i]._sourceLayer.renderer.symbol.color.toHex().toUpperCase() == oldColor) {
                            FCurrentLayer.graphics[i]._sourceLayer.renderer.symbol.color = esri.Color.fromHex(value);
                        }
                    }
                }
                else {
                    if (FCurrentLayer.graphics[i]._sourceLayer.renderer._symbols[1].symbol.color != null) {
                        if (FCurrentLayer.graphics[i]._sourceLayer.renderer._symbols[1].symbol.color.toHex().toUpperCase() == oldColor) {
                            FCurrentLayer.graphics[i]._sourceLayer.renderer._symbols[1].symbol.color = esri.Color.fromHex(value);
                        }
                    }
                    if (FCurrentLayer.graphics[i]._sourceLayer.renderer._symbols[2].symbol.color != null) {
                       if (FCurrentLayer.graphics[i]._sourceLayer.renderer._symbols[2].symbol.color.toHex().toUpperCase() == oldColor) {
                            FCurrentLayer.graphics[i]._sourceLayer.renderer._symbols[2].symbol.color = esri.Color.fromHex(value);
                        }
                    }
                    if (FCurrentLayer.graphics[i]._sourceLayer.renderer._symbols[3].symbol.color != null) {
                       if (FCurrentLayer.graphics[i]._sourceLayer.renderer._symbols[3].symbol.color.toHex().toUpperCase() == oldColor) {
                            FCurrentLayer.graphics[i]._sourceLayer.renderer._symbols[3].symbol.color = esri.Color.fromHex(value);
                        }
                    }
                    if (FCurrentLayer.graphics[i]._sourceLayer.renderer._symbols[4].symbol.color != null) {
                       if (FCurrentLayer.graphics[i]._sourceLayer.renderer._symbols[4].symbol.color.toHex().toUpperCase() == oldColor) {
                            FCurrentLayer.graphics[i]._sourceLayer.renderer._symbols[4].symbol.color = esri.Color.fromHex(value);
                        }
                    }
                }
            }
            FCurrentLayer.redraw();
        }
    }

    if (id.indexOf("_T") >= 0) {
        if (TextFeatureCurrentLayer.graphics.length > 0) {
            for (var i = 0; i < TextFeatureCurrentLayer.graphics.length; i++) {
                if (typeof (TextFeatureCurrentLayer.graphics[i]._layer.renderer._symbols) == "undefined") {
                    if (TextFeatureCurrentLayer.graphics[i]._layer.renderer.symbol.color != null) {
                        if (TextFeatureCurrentLayer.graphics[i]._layer.renderer.symbol.color.toHex().toUpperCase() == oldColor) {
                            TextFeatureCurrentLayer.graphics[i]._layer.renderer.symbol.color = esri.Color.fromHex(value);
                        }
                    }
                }
                else {
                    if (TextFeatureCurrentLayer.graphics[i]._layer.renderer._symbols[1].symbol.color != null) {
                        if (TextFeatureCurrentLayer.graphics[i]._layer.renderer._symbols[1].symbol.color.toHex().toUpperCase() == oldColor) {
                            TextFeatureCurrentLayer.graphics[i]._layer.renderer._symbols[1].symbol.color = esri.Color.fromHex(value);
                        }
                    }
                    if (TextFeatureCurrentLayer.graphics[i]._layer.renderer._symbols[2].symbol.color != null) {
                       if (TextFeatureCurrentLayer.graphics[i]._layer.renderer._symbols[2].symbol.color.toHex().toUpperCase() == oldColor) {
                            TextFeatureCurrentLayer.graphics[i]._layer.renderer._symbols[2].symbol.color = esri.Color.fromHex(value);
                        }
                    }
                    if (TextFeatureCurrentLayer.graphics[i]._layer.renderer._symbols[3].symbol.color != null) {
                       if (TextFeatureCurrentLayer.graphics[i]._layer.renderer._symbols[3].symbol.color.toHex().toUpperCase() == oldColor) {
                            TextFeatureCurrentLayer.graphics[i]._layer.renderer._symbols[3].symbol.color = esri.Color.fromHex(value);
                        }
                    }
                    if (TextFeatureCurrentLayer.graphics[i]._layer.renderer._symbols[4].symbol.color != null) {
                       if (TextFeatureCurrentLayer.graphics[i]._layer.renderer._symbols[4].symbol.color.toHex().toUpperCase() == oldColor) {
                            TextFeatureCurrentLayer.graphics[i]._layer.renderer._symbols[4].symbol.color = esri.Color.fromHex(value);
                        }
                    }
                }
            }
            TextFeatureCurrentLayer.redraw();
        }
    }
    $(obj).attr("current-color", value);
}
function clearPointDensityLayer() {
    var pointdensityLayer = configOptions.CurrentMap.getLayer("pointDensityLayer");
    if (pointdensityLayer != null)
        configOptions.CurrentMap.removeLayer(pointdensityLayer);
}

function changePointSize(value, id) {
    var isize = parseInt(value);
    var currentLayer = configOptions.CurrentMap.getLayer(id);
    if (currentLayer.graphics.length > 0) {
        for (var i = 0; i < currentLayer.graphics.length; i++) {
            /*configOptions.CurrentMap.getLayer(id).graphics[i].symbol.setSize(iWidth);*/
            currentLayer.graphics[i].symbol.size = isize;
        }
        currentLayer.redraw();
    }
}

function changeArrowColor(obj, value, id) {
    var oldColor = $(obj).attr("current-Arrowcolor").toUpperCase();
    if (oldColor == value.toUpperCase()) {
        return;
    }
  
    var colorobj = new dojo.Color(value);
    var layer = configOptions.CurrentMap.getLayer(id);
    if (layer.graphics.length > 0) {
        for (var i = 0; i < layer.graphics.length; i++) {
            if (typeof (layer.graphics[i].symbol.directionColor) != "undefined") {
                if (layer.graphics[i].symbol.directionColor.toHex().toUpperCase() == oldColor) {
                    layer.graphics[i].symbol.directionColor = colorobj;

                    layer.graphics[i].symbol.directionFillColor = colorobj;
                }
            }
        }
        layer.redraw();
        configOptions.CurrentMap.setZoom(configOptions.CurrentMap.getZoom());
    }
    $(obj).attr("current-Arrowcolor", value);
}

function changeLableSize(value, id) {
    var layer = configOptions.CurrentMap.getLayer(id);
    if (layer.graphics.length > 0) {
        for (var i = 0; i < layer.graphics.length; i++) {
            layer.graphics[i].symbol.font.setSize(value);
        }
        layer.redraw();
    }
}
function changeFont(value, id) {
    var layer = configOptions.CurrentMap.getLayer(id);
    if (layer.graphics.length > 0) {
        for (var i = 0; i < layer.graphics.length; i++) {
            layer.graphics[i].symbol.font.setFamily(value);
        }
        layer.redraw();
    }
}
function changeLineWidth(value, id) {
    var iWidth = parseInt(value);
    var layer = configOptions.CurrentMap.getLayer(id);
    if (layer.graphics.length > 0) {
        for (var i = 0; i < layer.graphics.length; i++) {
            layer.graphics[i].symbol.width = iWidth;
        }
        layer.redraw();
    }
}

function ChangeElementUsability(id, disable) {
    $(id).prop('disabled', disable);
}

function GetFormatedDate(val) {
    var spltvals = val.split("-");
    return spltvals[2] + "-" + spltvals[1] + "-" + spltvals[0];
}

function GetFormatedDateStopOver(val) {
    var spltvals = val.split("-");
    return spltvals[2] + "-" + spltvals[1] + "-" + spltvals[0];
}

function GetFormatedDateForLabel(val) {
    var spltvals = val.split("-");
    return spltvals[2] + "/" + spltvals[1] + "/" + spltvals[0].substring(2, 4);
}

function CheckDatesCompare(fromdate, todate) {
    var FDate = fromdate.split("-");
    var TDate = todate.split("-");
    //if year equlas then check month if month equals check day
    if (TDate[2] == FDate[2]) {
        if (TDate[1] == FDate[1]) {
            if (TDate[0] < FDate[0]) {
                return false;
            }
        }
        else if (TDate[1] < FDate[1]) {
            return false;
        }
    }
    else if (TDate[2] < FDate[2]) {
        return false;
    }
    return true;
}




var sessionvals = {
    beachMarker1: null,
    routePoints: null,
    index: null,
    dates: null,
    curDate: null,
    geocoder: null
}



var rad = function (x) {
    return x * Math.PI / 180;
};





function AlertMessages(status,title,text) {
    var Oktext
    if (location.search.substring(1) == "") {
        Oktext = "Ok";
    }
    else {
        Oktext = "نعم";
    }

    Swal.fire({
        icon: status,
        title: title,
        text: text,
        confirmButtonText:Oktext,
    })
    
}

function refreshAccessToken(refreshToken) {
    var currentWidget = this;
    console.log(currentWidget)
     $.ajax({
        url: http://localhost:53925/Service1.svc/RefreshToken',  // WCF service endpoint
        type: 'POST',  // HTTP method
        contentType: 'application/json',  // Set content type to JSON
        data: JSON.stringify({ refreshToken }),  // Convert the data object to a JSON string
        success: function (data) {
            return data.accessToken;  // Handle the response and return the new access token
        },
        error: function (xhr, status, error) {
            console.error('Error refreshing token:', error);  // Handle any errors
            return null;  // Return null or handle as needed
        }
    });
}























