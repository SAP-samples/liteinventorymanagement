sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox"
], function(Controller, JSONModel, Fragment, Filter, FilterOperator,MessageBox) {
	"use strict";

	return Controller.extend("com.sap.pgp.dev.inventory.controller.RequisitionDetails", {
	
		onInit: function () {

			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();
			var _this = this;

            var oDataModel = this.getOwnerComponent().getModel("products");

            oDataModel.read("/PurchaseRequisition", {
              
                success: function(oData, response) {
                             
                            var oJSONModel =  new sap.ui.model.json.JSONModel(oData);
   							_this.getView().setModel(oJSONModel,"products1");

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
