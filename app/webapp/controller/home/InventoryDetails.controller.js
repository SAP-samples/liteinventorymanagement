sap.ui.define([
	"com/sap/pgp/dev/inventory/controller/BaseController",
	"sap/ui/Device",
    "sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/Button",
	"sap/ui/core/routing/History",
	"com/sap/pgp/dev/inventory/model/formatter",
	"sap/m/MessageToast"
], function (Controller, Device, JSONModel, Filter, FilterOperator, Button, History, formatter, MessageToast) {
	"use strict";

	return Controller.extend("com.sap.pgp.dev.inventory.controller.InventoryDetails", {
		formatter: formatter,
		onInit: function () {

			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();

			this.oRouter.getRoute("InventoryDetails").attachPatternMatched(this._onProductMatched, this);



		},
		onNavBack1: function(oEvent)	{
			var oHistory, sPreviousHash;
	
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
	
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("home", {}, true /*no history*/);
			}
		},

		onNavBack: function(oEvent)	{

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Home", {}, true /*no history*/);
		},

		_onProductMatched: function (oEvent) {
			this._product = oEvent.getParameter("arguments").product || this._product || "0";
		
	        var oProductDetailPanel = this.getView().byId("grtable");
			
			oProductDetailPanel.bindElement({
				// path: "/Inventory/" + this._product,
				model: "products",
				path: "/Products(" + this._product + ")",
				parameters: {
					expand: "Products2Plants"
				}
			});



		},


		handleFullScreen: function () {
			this.bFocusFullScreenButton = true;
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.oRouter.navTo("detail", {layout: sNextLayout, product: this._product});
		},
		handleExitFullScreen: function () {
			this.bFocusFullScreenButton = true;
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.oRouter.navTo("detail", {layout: sNextLayout, product: this._product});
		},
		handleClose: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.oRouter.navTo("master", {layout: sNextLayout});
		},

		clearSelection: function(evt) {
			this.byId("table1").clearSelection();
		},

		formatAvailableToObjectState : function(bAvailable) {
			return bAvailable ? "Success" : "Error";
		},

		formatAvailableToIcon : function(bAvailable) {
			return bAvailable ? "sap-icon://accept" : "sap-icon://decline";
		},

		onDetailsPress : function(oEvent) {
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(2),
				supplierPath = oEvent.getSource().getBindingContext("products").getPath(),
				supplier = supplierPath.split("/").slice(-1).pop();
				supplier = supplier.substring(21, supplier.length - 2);

				this.oRouter.navTo("InventoryDetailDetail", {layout: oNextUIState.layout, product: this._product, supplier: supplier});
			
		}

		
	});
});