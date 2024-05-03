sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"sap/ui/table/RowAction",
	"sap/ui/table/RowActionItem",
	"sap/ui/table/RowSettings"
], function (Controller, JSONModel, Fragment, Filter, FilterOperator,MessageBox,RowAction,RowActionItem,RowSettings) {
	"use strict";


	return Controller.extend("com.sap.pgp.dev.inventory.controller.home.PRGoodsIssue", {


		onInit: async function () {
						
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();
            var GIComplete = '';
			
            
		    var oDataModel = this.getOwnerComponent().getModel("products");

			var _this = this;
			

            oDataModel.read("/PRGoodsIssue", {
				filters: [new Filter("GIComplete", FilterOperator.EQ, GIComplete)],
                success: function(oData, response) {
                             
                            var oJSONModel =  new sap.ui.model.json.JSONModel(oData);
                       
						_this.getView().setModel(oJSONModel,"products1");

						},
                            error : function(oError) {
                                alert("Failure");
                            } 
					});

		},
		
		onDetailsPress : function(oEvent) {
			
			 var	GIPath = oEvent.getSource().getBindingContext("products1").getPath();
			 var	GIObject = oEvent.getSource().getBindingContext("products1").getObject();
			 var    CompanyCode = GIObject.CompanyCode;
			 var   ProductId = GIObject.ProductId;
			 var  Location = GIObject.Location;
			 var  CostCenter = GIObject.CostCenter;
			 var  PRNo = GIObject.PRID;
			 var  PRItem = GIObject.PRItem;
			 var GLAccount = GIObject.GLAccount;
			 var EmployeeID = GIObject.Requester;
			 var Quantity = GIObject.Quantity;

			 
			 var oDataModel = this.getView().getModel("products");

	
			 var PlantGUID;
			 var Plant;
			 var StockQAvailable;
			 var productImage;
			 var ProductId;
			 var ProductDesc;
			 var plantdescription;
			 var StockQAvailable;
			 var ProductPicUrl;
		 
		     var _this = this;
		 
			 oDataModel.read("/Products2Plants", {
				  filters: [new Filter("Plants_Plant", FilterOperator.EQ, Location),
							new Filter("ProductId", FilterOperator.EQ, ProductId)],
				 success: function(oData, response) {
							  
							 var oJSONModel =  new sap.ui.model.json.JSONModel(oData);
								 PlantGUID = oData.results[0].Plants_ID;
								 ProductDesc = oData.results[0].ProductDesc;
								 plantdescription = oData.results[0].plantdescription;
								 StockQAvailable = oData.results[0].StockQAvailable;
								 ProductPicUrl = oData.results[0].ProductPicUrl;

								 
								 _this.byId("TXProductID2").setText(ProductId);
								 _this.byId("TXProductdesc").setText(ProductDesc);
								 _this.byId("TXLocation").setText(plantdescription);
								 _this.byId("TXstock").setText(StockQAvailable);
								 _this.byId("image").setSrc(ProductPicUrl);

								 _this.getView().byId("pproductinfo").setVisible(true);
								 _this.getView().byId("pgi").setVisible(true);

								// SAVE SOME ADDITIONAL DATA FOR FUTURE GI

								_this.byId("TXLOCATIONID").setText(Location);
								_this.byId("TXCOSTCENTERID").setText(CostCenter);
								_this.byId("TXPRNO").setText(PRNo);
								_this.byId("TXGLACCOUNT").setText(GLAccount);
								_this.byId("TXEMPLOYEEID").setText(EmployeeID);
								_this.byId("TXQUANTITY").setText(Quantity);
								_this.byId("TXCOMPANYCODE").setText(CompanyCode);
								_this.byId("TXPRItem").setText(PRItem);
								

		 
							 },
							 error : function(oError) {
								 alert("Failure");
							 } 
					 });




		},

		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [new Filter("Name", FilterOperator.Contains, sQuery)];
			}

			this.getView().byId("productsTable").getBinding("items").filter(oTableSearchState, "Application");
		},
		
		getSelectedIndices: function(evt) {
			var aIndices = this.byId("table1").getSelectedIndices();
			var sMsg;
			if (aIndices.length < 1) {
				sMsg = "no item selected";
			} else {
				sMsg = aIndices;
			}
			MessageToast.show(sMsg);
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




			var Plant = this.getView().byId("TXLOCATIONID").getText();
			var CompanyCode = this.getView().byId("TXCOMPANYCODE").getText();
			var CostCenter = this.getView().byId("TXCOSTCENTERID").getText();
			var RequisitionNo = this.getView().byId("TXPRNO").getText();
			var GLAccount =  this.getView().byId("TXGLACCOUNT").getText();
			var Product = this.getView().byId("TXProductID2").getText();
			var EmployeeID = this.getView().byId("TXEMPLOYEEID").getText();
			var Quantity =  this.getView().byId("TXQUANTITY").getText();
			var PRItem =  this.getView().byId("TXPRItem").getText();

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
				    //    oJSONModel.setData(oData);
				//  oVizFrame.setModel(oJSONModel,"products");
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
		  
			var _this = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

	/////////////////////////////////


        
		var oGIEntry = {
			"GIComplete": "X"
			};

		var str1 = "/PRGoodsIssue(PRID='";
		var str2 = "',PRItem='";
		var str3 = "')";
		var GIURL = str1.concat(RequisitionNo,str2,PRItem,str3);

 		oModel.update(GIURL,oGIEntry, {
		method: "PUT",
		success: function(oRetrievedResult) {



		
		},
		error: function(oError) { 
			alert("Failed updating Goods Issue Document"); 
		}
	  });	



	/////////////////////////////////

			oModel.update("/GoodsIssue/"+uuid,oEntry, {
				method: "PUT",
				success: function(oRetrievedResult) {


					MessageBox.success("Goods Issue Document Saved Successfully", {
						actions: ["Go Home", "New Goods Issue"],
						emphasizedAction: MessageBox.Action.OK,
						onClose: function (sAction) {
							//MessageToast.show("Action selected: " + sAction);
							_this.byId("TXProductID2").setText("");
							_this.byId("TXProductdesc").setText("");
							_this.byId("TXLocation").setText("");
							_this.byId("TXstock").setText("");
							_this.byId("image").setSrc("");
							_this.byId("TXLOCATIONID").setText("");
							_this.byId("TXCOSTCENTERID").setText("");
							_this.byId("TXPRNO").setText("");
							_this.byId("TXGLACCOUNT").setText("");
							_this.byId("TXEMPLOYEEID").setText("");
							_this.byId("TXQUANTITY").setText("");
							_this.byId("TXCOMPANYCODE").setText("");
							_this.byId("TXPRItem").setText("");

							_this.getView().byId("pproductinfo").setVisible(false);
							_this.getView().byId("pgi").setVisible(false);

							if (sAction == "Go Home"){
								oRouter.navTo("Home", {}, true /*no history*/);
								window.location.reload(true);
										}
						    else {
								oRouter.navTo("PRGoodsIssue", {}, true /*no history*/);
								window.location.reload(true);
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