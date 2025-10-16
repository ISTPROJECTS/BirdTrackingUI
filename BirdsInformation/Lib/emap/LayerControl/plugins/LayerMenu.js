define([
    'dojo/_base/declare',
    'dijit/Menu',
    'dijit/MenuItem',
    'dijit/PopupMenuItem',
    'dijit/MenuSeparator',
    "dojo/i18n!../nls/strings", // localization
    './Transparency'
], function (
    declare,
    Menu,
    MenuItem,
    PopupMenuItem,
    MenuSeparator,i18n,
    Transparency
) {
    return declare(Menu, {
        _removed: false, //for future use
        constructor: function ()
        {
            this._i18n = i18n;
        },
        postCreate: function () {
            var currentWidget = this;
            this.inherited(arguments);
            var removeServiceStatus = true;
           
            var control = this.control,
                layer = control.layer,
                controlOptions = control.controlOptions,
                controller = control.controller,
                layerType = control._layerType,
                menu = this;
            //reorder menu items
          
            if (controlOptions.isMandetory)
                removeServiceStatus = true;
            else
                removeServiceStatus = false;

            menu.addChild(new MenuItem({
                label: currentWidget._i18n.RemoveMapServiceLabel,
                disabled:removeServiceStatus,
                onClick: function () {
                    //console.log(layer);
                   // alert("remove" + layer);
                   controller._removeLayer(control);
                    //controller._zoomToLayer(layer);
                }
            }));
            menu.addChild(new MenuSeparator());
           
            if ((layerType === 'vector' && controller.vectorReorder) || (layerType === 'overlay' && controller.overlayReorder)) {
                control._reorderUp = new MenuItem({
                    label: currentWidget._i18n.MoveUpLabel,
                    onClick: function () {
                        controller._moveUp(control);
                    }
                });
                menu.addChild(control._reorderUp);
                control._reorderDown = new MenuItem({
                    label: currentWidget._i18n.MoveDownLabel,
                    onClick: function () {
                        controller._moveDown(control);
                    }
                });
                menu.addChild(control._reorderDown);
                menu.addChild(new MenuSeparator());
            }
            //zoom to layer
            //if ((controlOptions.noZoom !== true && controller.noZoom !== true) || (controller.noZoom === true && controlOptions.noZoom === false)) {
            //    menu.addChild(new MenuItem({
            //        label: 'Zoom to Layer',
            //        onClick: function () {
            //            controller._zoomToLayer(layer);
            //        }
            //    }));
            //}
            //transparency
            if ((controlOptions.noTransparency !== true && controller.noTransparency !== true) || (controller.noTransparency === true && controlOptions.noTransparency === false)) {
                menu.addChild(new Transparency({
                    label: currentWidget._i18n.TransparencyLabel,
                    layer: layer
                }));
            }
            //layer swipe
            if (controlOptions.swipe === true || (controller.swipe === true && controlOptions.swipe !== false)) {
                var swipeMenu = new Menu();
                swipeMenu.addChild(new MenuItem({
                    label: currentWidget._i18n.VerticalLabel,
                    onClick: function () {
                        controller._swipeLayer(layer, 'vertical');
                    }
                }));
                swipeMenu.addChild(new MenuItem({
                    label: currentWidget._i18n.HorizontalLabel,
                    onClick: function () {
                        controller._swipeLayer(layer, 'horizontal');
                    }
                }));
                if (controlOptions.swipeScope === true) {
                    swipeMenu.addChild(new MenuItem({
                        label: currentWidget._i18n.ScopeLabel,
                        onClick: function () {
                            controller._swipeLayer(layer, 'scope');
                        }
                    }));
                }
                menu.addChild(new PopupMenuItem({
                    label: currentWidget._i18n.LayerSwipeLabel,
                    popup: swipeMenu
                }));
            }
            //if last child is a separator remove it
            var lastChild = menu.getChildren()[menu.getChildren().length - 1];
            if (lastChild && lastChild.isInstanceOf(MenuSeparator)) {
                menu.removeChild(lastChild);
            }
        }
    });
});