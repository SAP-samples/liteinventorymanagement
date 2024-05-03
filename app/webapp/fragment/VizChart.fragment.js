sap.ui.define([
	"sap/viz/ui5/controls/VizFrame",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/viz/ui5/data/DimensionDefinition",
	"sap/viz/ui5/data/MeasureDefinition",
	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/ui/model/json/JSONModel"
], function (VizFrame, FlattenedDataset, DimensionDefinition, MeasureDefinition, FeedItem, JSONModel) {
	"use strict";

	return sap.ui.jsfragment("com.sap.pgp.dev.inventory.fragment.VizChart", {
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
					value: "{id}"
				}),
				measures: [
					new MeasureDefinition({
						name: "Available Quantity",
						value: "{QtyAvailable}"
					}),
					new MeasureDefinition({
						name: "ReOrder Point",
						value: "{ReOrderPoint}"
					})
				],
				data: "{/Temperatures}"
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
						text: controller.getOwnerComponent().getModel("i18n").getResourceBundle().getText("chartContainerTemperature")
					}
				}
			});

			var oModel = new JSONModel("mock/ChartData.json");
			controller.getView().setModel(oModel);

			return oVizFrame;
		}
	});
});
