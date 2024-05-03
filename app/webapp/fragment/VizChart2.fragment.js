sap.ui.define([
	"sap/viz/ui5/controls/VizFrame",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/viz/ui5/data/DimensionDefinition",
	"sap/viz/ui5/data/MeasureDefinition",
	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/ui/model/json/JSONModel"
], function (VizFrame, FlattenedDataset, DimensionDefinition, MeasureDefinition, FeedItem, JSONModel) {
	"use strict";

	return sap.ui.jsfragment("com.sap.pgp.dev.inventory.fragment.VizChart2", {
		createContent: function (controller) {

			var oVizFrame = new VizFrame({
				height: "700px",
				width: "100%",
				vizType: "vertical_bullet",
				uiConfig: {
					applicationSet: 'fiori'
				}
			});

			var oDataset = new FlattenedDataset({
				dimensions: new DimensionDefinition({
					name: "Products",
					value: "{products>ProductDesc}"
				}),
				measures: [
					new MeasureDefinition({
						name: "Available Quantity",
						value: "{products>StockQAvailable}"
					}),
					new MeasureDefinition({
						name: "ReOrder Point",
						value: "{products>ReorderPoint}"
					})
				],
				data: "{products>/results}"
			});

			oVizFrame.setDataset(oDataset);

			oVizFrame.addFeed(new FeedItem({
				uid: "valueAxis",
				type: "Measure",
				values: [
					"Available Quantity"
				]
			}));

			oVizFrame.addFeed(new FeedItem({
				uid: "targetValues",
				type: "Measure",
				values: [
					"ReOrder Point"
				]
			}));

			oVizFrame.addFeed(new FeedItem({
				uid: "categoryAxis",
				type: "Dimension",
				values: [ "Products" ]
			}));

			oVizFrame.setVizProperties({
				plotArea: {
					showGap: true
				},
				title: {
					visible: false
				},
				valueAxis: {
					title: {
						text: controller.getOwnerComponent().getModel("i18n").getResourceBundle().getText("AvailableQty")
					}
				}
			});

			var sUrl = "/v2/inventory";
            var filter = new sap.ui.model.Filter("Plants_Plant", sap.ui.model.FilterOperator.EQ, "1710");
            var oDataModel = new sap.ui.model.odata.v2.ODataModel(sUrl, {
                json: true,
                loadMetadataAsync: true
            });
            
            
            
            oDataModel.read("/Products2Plants", {
                 filters: [filter],
                success: function(oData, response) {
                             
                            var oJSONModel =  new sap.ui.model.json.JSONModel(oData);
                          //  oJSONModel.setData(oData);
                          oVizFrame.setModel(oJSONModel,"products");
                            
                            },
                            error : function(oError) {
                                alert("Failure");
                            } 
                    });
			  
					

			return oVizFrame;
		}
	});
});
