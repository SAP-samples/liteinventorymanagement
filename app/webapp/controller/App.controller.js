sap.ui.define([
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/m/Button"
], function (Device, JSONModel, Controller, Button) {
	"use strict";

	return Controller.extend("com.sap.pgp.dev.inventory.controller.App", {
		onInit: function () {

		this.oRouter = this.getOwnerComponent().getRouter();
		var oModel = new JSONModel("mock/data.json");
		this.getView().setModel(oModel);
		if (!this._oPopover) {
			this._oPopover = sap.ui.xmlfragment("com.sap.pgp.dev.inventory.view.ProductSwitchPopover", this);
			this.getView().addDependent(this._oPopover);

			if (Device.system.phone) {
				this._oPopover.setEndButton(new Button({text: "Close", type: "Emphasized", press: this.fnClose.bind(this)}));
			}
		}

			},	

			fnChange: function (oEvent) {


				if (oEvent.getParameter("itemPressed").getId() == "__item0-__switch0-1")
					{
						this.oRouter.navTo("ReportDetail");
					}
				else if (oEvent.getParameter("itemPressed").getId() == "__item0-__switch0-0"){
					this.oRouter.navTo("UserDetail");
				}
				else if (oEvent.getParameter("itemPressed").getId() == "__item0-__switch0-2"){
					this.oRouter.navTo("FileUpload");
				}
				else if (oEvent.getParameter("itemPressed").getId() == "__item0-__switch0-3"){
					this.oRouter.navTo("GoodsIssue");
				}
				else if (oEvent.getParameter("itemPressed").getId() == "__item0-__switch0-4"){
					this.oRouter.navTo("RequisitionDetails");
				}
				else if (oEvent.getParameter("itemPressed").getId() == "__item0-__switch0-5"){
					this.oRouter.navTo("GoodsReceipt");
				}
				else if (oEvent.getParameter("itemPressed").getId() == "__item0-__switch0-6"){
					this.oRouter.navTo("PRGoodsIssue");
				}
			},
			fnOpen: function (oEvent) {
				 this._oPopover.openBy(oEvent.getParameter("button"));
				// this.oRouter.navTo("ReportDetail");
			},
			fnClose: function () {
				this._oPopover.close();
			},


		onBeforeRouteMatched: function(oEvent) {

			var oModel = this.getOwnerComponent().getModel();

			var sLayout = oEvent.getParameters().arguments.layout;

			// If there is no layout parameter, query for the default level 0 layout (normally OneColumn)
			if (!sLayout) {
				var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(0);
				sLayout = oNextUIState.layout;
			}

			// Update the layout of the FlexibleColumnLayout
			if (sLayout) {
				oModel.setProperty("/layout", sLayout);
			}
		},

		onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name"),
				oArguments = oEvent.getParameter("arguments");

			this._updateUIElements();

			// Save the current route name
			this.currentRouteName = sRouteName;
			this.currentProduct = oArguments.product;
			this.currentSupplier = oArguments.supplier;
		},

		onStateChanged: function (oEvent) {
			var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
				sLayout = oEvent.getParameter("layout");

			this._updateUIElements();

			// Replace the URL with the new layout if a navigation arrow was used
			if (bIsNavigationArrow) {
				this.oRouter.navTo(this.currentRouteName, {layout: sLayout, product: this.currentProduct, supplier: this.currentSupplier}, true);
			}
		},

		// Update the close/fullscreen buttons visibility
		_updateUIElements: function () {
			var oModel = this.getOwnerComponent().getModel();
			var oUIState = this.getOwnerComponent().getHelper().getCurrentUIState();
			oModel.setData(oUIState);
		},

		handleBackButtonPressed: function () {
			window.history.go(-1);
		},

		onExit: function () {
			this.oRouter.detachRouteMatched(this.onRouteMatched, this);
			this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		}
	});
});
