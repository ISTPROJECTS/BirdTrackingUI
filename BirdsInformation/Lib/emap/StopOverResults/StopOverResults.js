define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/topic',
    "dojo/store/Memory",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane",
    'dgrid/extensions/ColumnHider',
    "dojo/text!emap/StopOverResults/templates/StopOverResults.html",

    "dojo/i18n!emap/Samplewidget/nls/Resource"

], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, topic, Memory, TabContainer, ContentPane, ColumnHider, dijitTemplate, i18n) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: dijitTemplate,
        widgetsInTemplate: true,
        i18n: i18n,
        map: null,
        title: i18n.title,
        currentuser: null,
        queryinfo: null,
        table: null,
        counter: 0,
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
            topic.subscribe('mapClickMode/DeleteGraphics', lang.hitch(this, function () {

                var QueryResults = this.tc;
                for (var i = QueryResults.getChildren().length; i > 0; i--) {
                    QueryResults.removeChild(QueryResults.getChildren()[0]);
                }
            }));
            $("#QueryResults").empty();

            var div = document.createElement('div');
            div.id = "QueryResults" + counter;
            this.counter++;
            $("#QueryResults").append(div);


            this.tc = new TabContainer({
                style: "height: 100%; width: 100%;"
            }, div.id);
            this.tc.startup();
    
        },




        startup: function () {
            var currentWidget = this;

        },
        AddDataToTable: function (type, result) {
            var currentWidget = this;
            var data = [];
            var aColumns = [];

            var grid = null;
            var cp1 = null;

            for (var obj in result[0]) {
                var colName = obj.toUpperCase();
                var item = [
                    { 'name': colName, 'field': obj, 'width': 'auto' },
                ];
                aColumns.push(item[0]);
            };



            require(['dgrid/OnDemandGrid', 'dgrid/extensions/Pagination', "dgrid/extensions/ColumnHider",
                'dojo/_base/declare', 'dojox/grid/EnhancedGrid', 'dojox/grid/enhanced/plugins/Pagination',
                "dojox/grid/enhanced/plugins/Menu",
                "dijit/Menu",
                'dojo/domReady!'],
                function (Grid, Pagination, ColumnHider, declare, EnhancedGrid, Pagination, Menus, Menu) {

                    /*var existingtab = dijit.byId(result[0].PID);*/
                    //if (existingtab != null) {
                    //    currentwidget.tc.removeChild(existingtab);
                    //}
                    var tabs = currentWidget.tc.getChildren();
                    for (var i = tabs.length - 1; i >= 0; i--) {
                        if (tabs[i].title == result[0].PID) {
                            var existingtab = tabs[i];
                            currentWidget.tc.removeChild(existingtab);
                        }
                    }

                    var dataForGrid = [];

                    var data = {
                        identifier: 'id',
                        items: []
                    };
                    
                    dataForGrid = result;
                    for (var i = 0; i < dataForGrid.length; i++) {
                        data.items.push(lang.mixin({ id: i + 1 }, dataForGrid[i]));
                    }
                    var store = new dojo.data.ItemFileWriteStore({ data: data });

                    var layout = [];
                    for (var i = 0; i < aColumns.length; i++) {
                        layout.push(aColumns[i]);
                    }
                    var grid = new EnhancedGrid({
                        //id: 'grid',
                        store: store,
                        structure: layout,
                        //rowSelector: '20px',
                        plugins: {
                            pagination: {
                                pageSizes: ["10", "25", "50", "100", "All"],
                                description: true,
                                sizeSwitch: true,
                                pageStepper: true,
                                gotoButton: true,
                                /*page step to be displayed*/
                                maxPageStep: 4,
                                /*position of the pagination bar*/
                                position: "bottom"
                            }
                        }
                    }, document.createElement('div'));
                    cp1 = new ContentPane({
                        title: result[0].PLATFORM_ID,
                        content: grid.domNode,
                        style: "width:100%;height:100%;",
                    });
                    currentWidget.tc.addChild(cp1);


                    /*$(".stopoverclass").css("display", "block");*/
                    /*$("#ResultPagePanel").show().animate({ bottom: '0px' }, 200);*/


                });
            return;
        },

    });
});