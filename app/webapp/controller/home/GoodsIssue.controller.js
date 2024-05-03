sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox"
], function (Controller, JSONModel, Fragment, Filter, FilterOperator,MessageBox) {
	"use strict";


	return Controller.extend("com.sap.pgp.dev.inventory.controller.home.GoodsIssue", {


		onInit: async function () {
						
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();


			var compCodeData = this.getOwnerComponent().getModel("compCodes").getData();
			var cCodesModel = new JSONModel(compCodeData);
			this.getView().byId("CCodeCB").setModel(cCodesModel,"compCodes");

			var plantData = this.getOwnerComponent().getModel("plantsModel").getData();
			var plantModel = new JSONModel(plantData);
			this.getView().byId("LocationCB").setModel(plantModel,"plantsModel");
			
			var employeeModel = new JSONModel("./mock/Employee.json");
			employeeModel.setSizeLimit(100000);
			this.getView().byId("employeeInput").setModel(employeeModel,"Employee");

          
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
			this.getView().byId("LocationCB").setSelectedKey("");
			this.getView().byId("CCodeCB").setSelectedKey("");
			this.getView().byId("CostCC").setValue("");
			this.getView().byId("Requisition1").setSelectedKey("");
			this.getView().byId("GLAccount1").setSelectedKey("");
			this.getView().byId("Quantity").setValue("");
			this.getView().byId("productInput").setSelectedKey("");
			this.getView().byId("employeeInput").setSelectedKey("");
			this.getView().byId("selectedKeyIndicator1").setText("");
			this.getView().byId("selectedKeyIndicator").setText("");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Home", {}, true /*no history*/);
		},

		onNavBack: function(oEvent)	{

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Home", {}, true /*no history*/);
		},
		
		OnPressSave:function(oEvent){

			var dt = new Date().getTime();
			var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = (dt + Math.random()*16)%16 | 0;
				dt = Math.floor(dt/16);
				return (c=='x' ? r :(r&0x3|0x8)).toString(16);
			});

			var Plant = this.getView().byId("LocationCB").getSelectedKey();
			var CompanyCode = this.getView().byId("CCodeCB").getSelectedKey();
			var CostCenter = this.getView().byId("CostCC").getValue();
			var RequisitionNo = this.getView().byId("Requisition1").getValue();
			var GLAccount =  this.getView().byId("GLAccount1").getValue();
			var Product = this.getView().byId("selectedKeyIndicator").getText();
			var EmployeeID = this.getView().byId("selectedKeyIndicator1").getText();
			var Quantity =  this.getView().byId("Quantity").getValue();
			var oModel = this.getOwnerComponent().getModel("products");
			var oEntry = {
				"GIssueID": uuid,
				"RequesterID": EmployeeID,
				"CostCenter": CostCenter,
				"CompanyCode": CompanyCode,
				"Location": Plant,
				"Requisition": RequisitionNo,
				"ProductID":Product,
				"Quantity":Quantity,
				"GLAccount":GLAccount
				};

		    if ( Plant == "" || CompanyCode == "" ||  EmployeeID == "" || Product == "" || Plant == "" || RequisitionNo == "" || Quantity == "" || GLAccount == "") {
				MessageBox.error("Please input all mandatory fields");
			}
			else
			{
	
	var oDataModel = this.getView().getModel("products");

	
	var PlantGUID;
	var ProductID;
	var Stock;
	var StockRemaining;


	oDataModel.read("/Products2Plants", {
		 filters: [new Filter("Plants_Plant", FilterOperator.EQ, Plant),
		           new Filter("ProductId", FilterOperator.EQ, Product)],
		success: function(oData, response) {
					 
					var oJSONModel =  new sap.ui.model.json.JSONModel(oData);
						PlantGUID = oData.results[0].Plants_ID;
						Stock = oData.results[0].StockQAvailable;
						Stock = Stock - Quantity;
						StockRemaining = Stock.toString();

				// Reduce Inventory
				var oStockUpdate = {
					"ID": PlantGUID,
					"Plant": Plant,
					"StockQAvailable": StockRemaining 
						};
			
						oModel.update("/Plants/"+PlantGUID+"/"+Plant,oStockUpdate, {
							method: "PUT",
							success: function(oRetrievedResult) {
															
							},
							error: function(oError) { 
								alert("Failed reducing inventory"); 
							}
						  });

					},
					error : function(oError) {
						alert("Failure");
					} 
			});
          
	/////////////////////////////////
			var _this = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oModel.update("/GoodsIssue/"+uuid,oEntry, {
				method: "PUT",
				success: function(oRetrievedResult) {


					MessageBox.success("Goods Issue Document Saved Successfully", {
						actions: ["Go Home", "New Goods Issue"],
						emphasizedAction: MessageBox.Action.OK,
						onClose: function (sAction) {
							//MessageToast.show("Action selected: " + sAction);
							_this.getView().byId("LocationCB").setSelectedKey("");
							_this.getView().byId("CCodeCB").setSelectedKey("");
							_this.getView().byId("CostCC").setValue("");
							_this.getView().byId("Requisition1").setSelectedKey("");
							_this.getView().byId("GLAccount1").setSelectedKey("");
							_this.getView().byId("Quantity").setValue("");
							_this.getView().byId("productInput").setSelectedKey("");
							_this.getView().byId("employeeInput").setSelectedKey("");
							_this.getView().byId("selectedKeyIndicator1").setText("");
							_this.getView().byId("selectedKeyIndicator").setText("");

							if (sAction == "Go Home"){
								oRouter.navTo("Home", {}, true /*no history*/);
										}
						    else {
								oRouter.navTo("GoodsIssue", {}, true /*no history*/);
							}
						}
					});

					
				},
				error: function(oError) { 
					alert("Failed updating Goods Issue Document"); 
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

		},

		onSuggestionItemSelected1: function (oEvent) {
			var oItem = oEvent.getParameter("selectedItem");
			this.byId("selectedKeyIndicator1").setText(oItem.getKey());
		}


	});

});