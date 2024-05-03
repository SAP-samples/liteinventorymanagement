sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox"
], function (Controller, JSONModel, Fragment, Filter, FilterOperator,MessageBox) {
	"use strict";


	return Controller.extend("com.sap.pgp.dev.inventory.controller.home.GoodsReceipt", {


		onInit: async function () {
						
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();

		    var oDataModel = this.getOwnerComponent().getModel("products");
			var _this = this;
		
            oDataModel.read("/Products2Plants", {
              
                success: function(oData, response) {
                             
                            var oJSONModel =  new sap.ui.model.json.JSONModel(oData);
     						_this.getView().setModel(oJSONModel,"products1");
						},
                            error : function(oError) {
                                alert("Failure");
                            } 
					});

			oDataModel.read("/PurchaseRequisition", {
		
				success: function(oData, response) {
								
							var oJSONModel1 =  new sap.ui.model.json.JSONModel(oData);
								_this.getView().setModel(oJSONModel1,"requisitions");
						},
							error : function(oError) {
								alert("Failure");
							} 
					});

							

		},

	    changePlantCode: function() {

		    var plantinfo = this.getView().byId("LocationCB").getSelectedKey();
			
            var filter = new sap.ui.model.Filter("Plants_Plant", sap.ui.model.FilterOperator.EQ, plantinfo);
			
			var oDataModel = this.getView().getModel("products");
            
			var _this = this;
			
            oDataModel.read("/Products2Plants", {
                 filters: [filter],
                success: function(oData, response) {
                             
                            var oJSONModel =  new sap.ui.model.json.JSONModel(oData);
							_this.getView().setModel(oJSONModel,"products1");
						},
                            error : function(oError) {
                                alert("Failure");
                            } 
					});
		},
		
		
		OnPressCancel:function(oEvent) {

			
			this.getView().byId("LocationFE1").setVisible(false);
			this.getView().byId("Productfe").setVisible(false);
			this.getView().byId("Quantityfe").setVisible(false);
			this.getView().byId("selectedLocationKey").setText("");
			this.getView().byId("selectedKeyIndicator").setText("");
			this.getView().byId("selectedKeyIndicator1").setText("");
			this.getView().byId("Quantity").setValue("");
			this.getView().byId("RequisitionInput").setSelectedKey("");
			// this.getView().byId("selectedKeyIndicator1").setText("");
			// this.getView().byId("selectedKeyIndicator").setText("");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Home", {}, true /*no history*/);
		},

		onNavBack: function(oEvent)	{

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Home", {}, true /*no history*/);
		},
		
		OnPressSave:function(oEvent){

			// var Plant = this.getView().byId("LocationCB").getSelectedKey();
			var Plant = this.getView().byId("selectedLocationKey").getText();
			var Product = this.getView().byId("selectedKeyIndicator").getText();
			var PR = this.getView().byId("selectedKeyIndicator1").getText(); // not needed for now as I am not commiting this to DB
			var Quantity =  this.getView().byId("Quantity").getValue();

		
		    if ( Plant == "" || Product == "" || Quantity == "") {
				MessageBox.error("Please input all mandatory fields");
			}
			else
	 		{
	var oDataModel = this.getView().getModel("products");

	
	var PlantGUID;
	var ProductID;
	var Stock;
	var StockRemaining;
	var availablitystatus;
	var _this = this;
	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

	oDataModel.read("/Products2Plants", {
		 filters: [new Filter("Plants_Plant", FilterOperator.EQ, Plant),
		           new Filter("ProductId", FilterOperator.EQ, Product)],
		success: function(oData, response) {
					 
					var oJSONModel =  new sap.ui.model.json.JSONModel(oData);
				    //    oJSONModel.setData(oData);
				//  oVizFrame.setModel(oJSONModel,"products");
						PlantGUID = oData.results[0].Plants_ID;
						Stock = oData.results[0].StockQAvailable;
						Quantity = parseInt(Quantity);
						Stock = parseInt(Stock);
						Stock = Stock + Quantity;
						StockRemaining = Stock.toString();
						availablitystatus = 'Available';
						availablitystatus = availablitystatus.toString();
                       
				// Reduce Inventory
				var oStockUpdate = {
					"ID": PlantGUID,
					"Plant": Plant,
					"StockQAvailable": StockRemaining,
					"AvailabilityStatus": availablitystatus
						};
			
						oDataModel.update("/Plants/"+PlantGUID+"/"+Plant,oStockUpdate, {
							method: "PUT",
							success: function(oRetrievedResult) {
	
		    				MessageBox.success("Goods Receipt Document Saved Successfully", {
								actions: ["Go Home", "New Goods Receipt"],
								emphasizedAction: MessageBox.Action.OK,
								onClose: function (sAction) {
									_this.getView().byId("LocationFE1").setVisible(false);
									_this.getView().byId("Productfe").setVisible(false);
									_this.getView().byId("Quantityfe").setVisible(false);
									_this.getView().byId("selectedLocationKey").setText("");
									_this.getView().byId("selectedKeyIndicator").setText("");
									_this.getView().byId("selectedKeyIndicator1").setText("");
									_this.getView().byId("Quantity").setValue("");
									_this.getView().byId("RequisitionInput").setSelectedKey("");
						

		
									if (sAction == "Go Home"){
										oRouter.navTo("Home", {}, true /*no history*/);
												}
								    else {
										oRouter.navTo("GoodsReceipt", {}, true /*no history*/);
									}
								}
							});
	
							},
							error: function(oError) { 
								alert("Failed reducing inventory"); 
							}
						  });

						},
						error: function(oError) { 
							alert("Failed updating Goods Receipt Document"); 
						}
					  });
 		} //end of else

		},
		create_UUID: function(){
			var dt = new Date().getTime();
			var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = (dt + Math.random()*16)%16 | 0;
				dt = Math.floor(dt/16);
				return (c=='x' ? r :(r&0x3|0x8)).toString(16);
			});
			return uuid;
		},
		onValueHelpRequest: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			// if (!this._oValueHelpDialog) {
				Fragment.load({
					name: "com.sap.pgp.dev.inventory.view.ValueHelpDialog",
					controller: this
				}).then(function (oFragment) {
					this._oValueHelpDialog = oFragment;
					this.getView().addDependent(this._oValueHelpDialog);

					// Create a filter for the binding
					this._oValueHelpDialog.getBinding("items")
						.filter([new Filter("ProductDesc", FilterOperator.Contains, sInputValue)]);
					// Open ValueHelpDialog filtered by the input's value
					this._oValueHelpDialog.open(sInputValue);
				}.bind(this));
		},
		onPRValueHelpRequest: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			// if (!this._oValueHelpDialog) {
				Fragment.load({
					name: "com.sap.pgp.dev.inventory.view.PRValueHelpDialog",
					controller: this
				}).then(function (oFragment) {
					this._oValueHelpDialog = oFragment;
					this.getView().addDependent(this._oValueHelpDialog);

					// Create a filter for the binding
					this._oValueHelpDialog.getBinding("items")
						.filter([new Filter("PRID", FilterOperator.Contains, sInputValue)]);
					// Open ValueHelpDialog filtered by the input's value
					this._oValueHelpDialog.open(sInputValue);
				}.bind(this));
		},
		onValueHelpDialogSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("ProductDesc", FilterOperator.Contains, sValue);

			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onValueHelpDialogClose: function (oEvent) {
			var sDescription,
				oSelectedItem = oEvent.getParameter("selectedItem");
			oEvent.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}

			sDescription = oSelectedItem.getDescription();

			this.byId("productInput").setSelectedKey(sDescription);
			this.byId("selectedKeyIndicator").setText(sDescription);

		},
		onValuePRHelpDialogClose: function (oEvent) {
			var sDescription,
				oSelectedItem = oEvent.getParameter("selectedItem");
			oEvent.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}

			sDescription = oSelectedItem.getDescription();
			var PRID = oSelectedItem.getTitle();
	 
		    var PlantText = oSelectedItem.getInfo();

			var plant = PlantText.substring(PlantText.length - 4, PlantText.length);

			this.getView().byId("RequisitionInput").setSelectedKey(PRID);
			this.byId("selectedKeyIndicator1").setText(PRID);
			
			var ProductID = sDescription.match(/\(([^)]+)\)/)[1]

			this.byId("selectedLocationKey").setText(plant);
			this.byId("selectedKeyIndicator").setText(ProductID);
			this.getView().byId("LocationFE1").setVisible(true);
			this.getView().byId("Productfe").setVisible(true);
			this.getView().byId("Quantityfe").setVisible(true);
			
			

			
		},

		onSuggestionItemSelected: function (oEvent) {
			var oItem = oEvent.getParameter("selectedItem");
			this.byId("selectedKeyIndicator").setText(oItem.getKey());
		},
		onValueHelpRequest1: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			// if (!this._oValueHelpDialog) {
				Fragment.load({
					name: "com.sap.pgp.dev.inventory.view.EValueHelpDialog",
					controller: this
				}).then(function (oFragment) {
					this._oValueHelpDialog = oFragment;
					this.getView().addDependent(this._oValueHelpDialog);

					// Create a filter for the binding
					this._oValueHelpDialog.getBinding("items")
						.filter([new Filter("Name", FilterOperator.Contains, sInputValue)]);
					// Open ValueHelpDialog filtered by the input's value
					this._oValueHelpDialog.open(sInputValue);
				}.bind(this));
		},

		onValueHelpDialogSearch1: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Name", FilterOperator.Contains, sValue);

			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		onValueHelpPRDialogSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("PRID", FilterOperator.Contains, sValue);

			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onValueHelpDialogClose1: function (oEvent) {
			var sDescription,
				oSelectedItem = oEvent.getParameter("selectedItem");
			oEvent.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}

			sDescription = oSelectedItem.getDescription();

			this.byId("employeeInput").setSelectedKey(sDescription);
			this.byId("selectedKeyIndicator1").setText(sDescription);
			this.byId("selectedLocationKey").setText(sDescription);
			this.byId("selectedKeyIndicator").setText(sDescription);
	
		},

		onSuggestionItemSelected1: function (oEvent) {
			var oItem = oEvent.getParameter("selectedItem");
			this.byId("selectedKeyIndicator1").setText(oItem.getKey());
		}


	});

});