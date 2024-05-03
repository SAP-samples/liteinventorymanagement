sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	'sap/m/MessageBox',
	"sap/m/MessageToast"
], function (JSONModel, Controller,MessageBox, MessageToast) {
	"use strict";

	return Controller.extend("com.sap.pgp.dev.inventory.controller.home.InventoryDetailDetail", {
		onInit: function () {
			var oExitButton = this.getView().byId("exitFullScreenBtn"),
				oEnterButton = this.getView().byId("enterFullScreenBtn");

			this.oRouter = this.getOwnerComponent().getRouter();
			 this.oModel = this.getOwnerComponent().getModel();

			this.oRouter.getRoute("InventoryDetailDetail").attachPatternMatched(this._onSupplierMatched, this);

			[oExitButton, oEnterButton].forEach(function (oButton) {
				oButton.addEventDelegate({
					onAfterRendering: function () {
						if (this.bFocusFullScreenButton) {
							this.bFocusFullScreenButton = false;
							oButton.focus();
						}
					}.bind(this)
				});
			}, this);
		},
		toggleFullScreen: function () {
			var oModel = this.getView().getModel("applayout");
			var bFullScreen = oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
			oModel.setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
			if (!bFullScreen) {
				// store current layout and go full screen
				oModel.setProperty("/previousLayout", oModel.getProperty("/layout"));
				oModel.setProperty("/layout", "MidColumnFullScreen");
			} else {
				// reset to previous layout
				oModel.setProperty("/layout",  oModel.getProperty("/previousLayout"));
			}
		},
		handleAboutPress: function () {
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(3);
			this.oRouter.navTo("page2", {layout: oNextUIState.layout});
		},
		handleFullScreen: function () {
			this.bFocusFullScreenButton = true;
		    var sNextLayout = "EndColumnFullScreen";
			this.oRouter.navTo("InventoryDetailDetail", {layout: sNextLayout, product: this._product, supplier: this._supplier});
			
		},
		handleExitFullScreen: function () {
			this.bFocusFullScreenButton = true;
			var sNextLayout = "TwoColumnsMidExpanded";
			this.oRouter.navTo("InventoryDetailDetail", {layout: sNextLayout, product: this._product, supplier: this._supplier});
		},
		handleClose: function () {
			var sNextLayout = "TwoColumnsMidExpanded";
			this.oRouter.navTo("InventoryDetails", {layout: sNextLayout, product: this._product});
		},
		_onSupplierMatched: function (oEvent) {
			this._supplier = oEvent.getParameter("arguments").supplier || this._supplier || "0";
			this._product = oEvent.getParameter("arguments").product || this._product || "0";
			this.getView().bindElement({
				model: "products",
				path: "/Products2Plants(" + this._supplier + ")",
			});
		},
		toggleAreaPriority: function(oEvent){
			this.getView().byId("rQtyL1").setVisible(false);
			this.getView().byId("rQty1").setVisible(false);
			this.getView().byId("rQtyL2").setVisible(true);
			this.getView().byId("rQty2").setVisible(true);
			this.getView().byId("ebutton").setVisible(false);
			this.getView().byId("sbutton").setVisible(true);

			this.getView().byId("lreorderQty").setVisible(false);
			this.getView().byId("treorderQty").setVisible(false);
			this.getView().byId("lreorderQtye").setVisible(true);
			this.getView().byId("treorderQtye").setVisible(true);

		},

		OnPressSave:function(oEvent){

			var plantguid = this.getView().getModel("products").getProperty("/Products2Plants(guid'"+this._supplier+"')/Plants_ID");
			var plantid = this.getView().getModel("products").getProperty("/Products2Plants(guid'"+this._supplier+"')/Plants_Plant");
			var reorderPoint = this.getView().getModel("products").getProperty("/Products2Plants(guid'"+this._supplier+"')/ReorderPoint");
			var reorderQuantity = this.getView().getModel("products").getProperty("/Products2Plants(guid'"+this._supplier+"')/ReorderQuantity");
			var stockAvailable = this.getView().getModel("products").getProperty("/Products2Plants(guid'"+this._supplier+"')/StockQAvailable");

			var oModel = this.getOwnerComponent().getModel("products");
			var oEntry = {
				"ID": plantguid,
				"Plant": plantid,
				"StockQAvailable": stockAvailable,
				"ReorderPoint": reorderPoint,
				"ReorderQuantity":reorderQuantity
				};

			var _this = this;
			oModel.update("/Plants(ID="+plantguid+",Plant='"+plantid+"')",oEntry, {
				method: "PUT",
				success: function(oRetrievedResult) {
					_this.getView().byId("rQtyL1").setVisible(true);
					_this.getView().byId("rQty1").setVisible(true);
					_this.getView().byId("rQtyL2").setVisible(false);
					_this.getView().byId("rQty2").setVisible(false);					
					_this.getView().byId("ebutton").setVisible(true);
					_this.getView().byId("sbutton").setVisible(false);		
					
					_this.getView().byId("lreorderQty").setVisible(true);
					_this.getView().byId("treorderQty").setVisible(true);
					_this.getView().byId("lreorderQtye").setVisible(false);
					_this.getView().byId("treorderQtye").setVisible(false);

					MessageBox.success("Saved successfully");
				},
				error: function(oError) { 
					alert("failed"); 
				}
			  });			  
      
		}
	});
});
