sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/BindingMode',
	'sap/ui/model/json/JSONModel',
	'sap/viz/ui5/controls/common/feeds/FeedItem',
	'sap/viz/ui5/data/FlattenedDataset',
	'sap/viz/ui5/format/ChartFormatter',
    'sap/viz/ui5/api/env/Format',
    "sap/viz/ui5/controls/VizFrame",
	"sap/viz/ui5/data/DimensionDefinition",
	"sap/viz/ui5/data/MeasureDefinition"
	//'./fragment/InitPage'
], function(Controller, BindingMode, JSONModel, FeedItem, FlattenedDataset, ChartFormatter, Format,VizFrame, DimensionDefinition, MeasureDefinition) {
"use strict";

	var Controller = Controller.extend("com.sap.pgp.dev.inventory.controller.ReportDetail", {

        dataPath : "mock",

        settingsModel : {
            chartType : {
                name: "Chart Type",
                defaultSelected : 0,
                values : [{
                    type : "Texas",
                    key : "0",
                    json : "/ChartData.json",
                    value : ["Profit"],
                    vizType : "bar",
                    dataset : {
                        dimensions: [{
                            name: "Products",
                            value: "{id}"
                        }],
                        measures: [{
                            name: 'Available Quantity',
                            value: '{QtyAvailable}'
                        }],
                        data: {
                            path: "/Temperatures"
                        }
                    },
                    vizProperties : {
                        plotArea: {
                            dataLabel: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2,
                                visible: true
                            }
                        },
                        valueAxis: {
                            label: {
                                formatString: ChartFormatter.DefaultPattern.SHORTFLOAT
                            },
                            title: {
                                visible: false
                            }
                        },
                        categoryAxis: {
                            title: {
                                visible: false
                            },
                            label : {
                                rotation : 'auto',
                                angle : 45
                            }
                        },
                        title: {
                            visible: false,
                            text: 'Inventory Data'
                        }
                    }
				},
				{
                    type : "California",
                    key : "1",
                    json : "/ChartData.json",
                    value : ["Profit"],
                    vizType : "bar",
                    dataset : {
                        dimensions: [{
                            name: "Products",
                            value: "{id}"
                        }],
                        measures: [{
                            name: 'Available Quantity',
                            value: '{QtyAvailable}'
                        }],
                        data: {
                            path: "/Temperatures"
                        }
                    },
                    vizProperties : {
                        plotArea: {
                            dataLabel: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2,
                                visible: true
                            }
                        },
                        valueAxis: {
                            label: {
                                formatString: ChartFormatter.DefaultPattern.SHORTFLOAT
                            },
                            title: {
                                visible: false
                            }
                        },
                        categoryAxis: {
                            title: {
                                visible: false
                            },
                            label : {
                                rotation : 'auto',
                                angle : 45
                            }
                        },
                        title: {
                            visible: false,
                            text: 'Inventory Data'
                        }
                    }
				}

                ]
            }
        },

        oVizFrame : null, flattenedDataset : null,
    
        onInit : function (evt) {


            // this.getView().bindElement({
			// 	model: "products",
			// 	path: "/EmployeeProfile/I12345",
			// });


            Format.numericFormatter(ChartFormatter.getInstance());

            var oModel = new JSONModel(this.settingsModel);
            oModel.setDefaultBindingMode(BindingMode.OneWay);
            this.getView().setModel(oModel);

            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            var DefaultPlant = this.getView().byId("PlantCB");
        //    oVizFrame.setVizProperties(this.settingsModel.chartType.values[0].vizProperties); 
    
          //  var sUrl = "/v2/inventory";
          //var sUrl = "/v2/inventory";
          
           // var sUrl = this.getView().getModel("i18n_en_US").getResourceBundle().getText("backendurl");
         //  var sUrl = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("backendurl");

            // var oDataModel = new sap.ui.model.odata.v2.ODataModel(sUrl, {
            //     json: true,
            //     loadMetadataAsync: true
            // });
            
            // var oDataModel = this.getView().getModel("products");
            var oDataModel = this.getOwnerComponent().getModel("products");

            var _this = this;
 
            oDataModel.read("/EmployeeProfile/I12345", {
                success: function(oData, response) {
                             
                            var plantModel =  new sap.ui.model.json.JSONModel(oData);
                          //  oJSONModel.setData(oData);
                            DefaultPlant.setModel(plantModel,"userprofile");
                            var plantData = _this.getOwnerComponent().getModel("plantsModel").getData();
                            var plantModel = new JSONModel(plantData);
                            _this.getView().byId("PlantCB").setModel(plantModel,"plantCodes");
                            _this.getView().byId("PlantCB").setSelectedKey(oData.Location);
                
                            
                            var filter = new sap.ui.model.Filter("Plants_Plant", sap.ui.model.FilterOperator.EQ, oData.Location);

                            oDataModel.read("/Products2Plants", {
                                 filters: [filter],
                                success: function(oData, response) {
                                             
                                            var oJSONModel =  new sap.ui.model.json.JSONModel(oData);
                                          //  oJSONModel.setData(oData);
                                          oVizFrame.setModel(oJSONModel,"products1");
                                            
                                            },
                                            error : function(oError) {
                                                alert("Failure");
                                            } 
                                    });

                            
                            },
                            error : function(oError) {
                                alert("Failure");
                            } 
                    });

            


    
           
            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(ChartFormatter.DefaultPattern.STANDARDFLOAT);


            
          //  InitPageUtil.initPageSettings(this.getView());
        },

        changePlantCode: function(oEvent){
			var plantid = this.getView().byId("PlantCB").getSelectedKey();

			var oVizFrame = this.getView().byId("idVizFrame");

            // var sUrl = "/backend/v2/inventory";

            var oDataModel = this.getView().getModel("products");



            var filter = new sap.ui.model.Filter("Plants_Plant", sap.ui.model.FilterOperator.EQ, plantid);
            
            
            oDataModel.read("/Products2Plants", {
                 filters: [filter],
                success: function(oData, response) {
                             
                            var oJSONModel =  new sap.ui.model.json.JSONModel(oData);
                          //  oJSONModel.setData(oData);
                          oVizFrame.setModel(oJSONModel,"products1");
                            
                            },
                            error : function(oError) {
                                alert("Failure");
                            } 
					});
		

		},

        onNavBack: function(oEvent)	{

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Home", {}, true /*no history*/);
		},
        onAfterRendering : function(){
            // var chartTypeSelect = this.getView().byId('chartTypeSelect');
            // chartTypeSelect.setSelectedIndex(this.settingsModel.chartType.defaultSelected);
        },
        onChartTypeChanged : function(oEvent){
            if (this.oVizFrame){
                var selectedKey = parseInt(oEvent.getSource().getSelectedKey());
                var bindValue = this.settingsModel.chartType.values[selectedKey];
                this.oVizFrame.destroyDataset();
                this.oVizFrame.destroyFeeds();
                this.oVizFrame.setVizType(bindValue.vizType);
                this.oVizFrame.setVizProperties(bindValue.vizProperties);
                var feedValueAxis = new FeedItem({
                    'uid': "valueAxis",
                    'type': "Measure",
					// 'values': bindValue.value
					'values': ['Available Quantity']
                }),
                feedCategoryAxis = new FeedItem({
                    'uid': "categoryAxis",
                    'type': "Dimension",
                    'values': ["Products"]
                })
                ;

                switch (selectedKey){
                    case 0:
                        this.oVizFrame.addFeed(feedValueAxis);
                        this.oVizFrame.addFeed(feedCategoryAxis);
                        break;
                    case 1:
                        this.oVizFrame.addFeed(feedValueAxis);
                        this.oVizFrame.addFeed(feedCategoryAxis);
                        break;
                    default :
                        this.oVizFrame.addFeed(feedValueAxis);
                        this.oVizFrame.addFeed(feedCategoryAxis);
                        this.oVizFrame.addFeed(feedColor);
                }
                var oDataset = new FlattenedDataset(bindValue.dataset);
                this.oVizFrame.setDataset(oDataset);
                var dataModel = new JSONModel(this.dataPath + bindValue.json);
                this.oVizFrame.setModel(dataModel);
            }
        }
    });

    return Controller;


});
