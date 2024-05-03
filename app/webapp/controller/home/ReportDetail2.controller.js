sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller,	JSONModel) {
	"use strict";

	return Controller.extend("com.sap.pgp.dev.inventory.controller.ReportDetail2", {

		onInit : function () {
       
			

			var plantData = this.getOwnerComponent().getModel("plantsModel").getData();
			var plantModel = new JSONModel(plantData);
			this.getView().byId("PlantCB").setModel(plantModel,"plantCodes");

		},
		
		changePlantCode: function(oEvent){
			var plantid = this.getView().byId("PlantCB").getSelectedKey();
			var plant = this.getView().byId("tab1");
			// var oVizFrame = sap.ui.core.Fragment.byId("fr1", "tab1");
			//var oVizFrame = this.getView().byId("idVizFrame");

			var fragmentId = this.getView().createId("fr1");
			var tab = sap.ui.core.Fragment.byId(fragmentId, "tab1");

			var sUrl = "/v2/inventory";
            var filter = new sap.ui.model.Filter("Plants_Plant", sap.ui.model.FilterOperator.EQ, plantid);
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
		

		},
		onNavBack: function(oEvent)	{

			window.history.go(-1);
	}

	});
});
