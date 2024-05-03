sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";


	return Controller.extend("com.sap.pgp.dev.inventory.controller.home.UserDetail", {


		onInit: async function () {
						



			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();

			this.getView().bindElement({
				model: "products",
				path: "/EmployeeProfile/I12345",
			});


			var compCodeData = this.getOwnerComponent().getModel("compCodes").getData();
			var cCodesModel = new JSONModel(compCodeData);
			this.getView().byId("CCodeCB").setModel(cCodesModel,"compCodes");

			var plantData = this.getOwnerComponent().getModel("plantsModel").getData();
			var plantModel = new JSONModel(plantData);
			this.getView().byId("LocationCB").setModel(plantModel,"plantsModel");

		},

		onAfterRendering: function(){

		},


		toggleAreaPriority: function(oEvent){


			this.getView().byId("CCode1").setVisible(false);
			this.getView().byId("CCode2").setVisible(true);
			
			this.getView().byId("CC1").setVisible(false);
			this.getView().byId("CC2").setVisible(true);
			
			this.getView().byId("PORG1").setVisible(false);
			this.getView().byId("PORG2").setVisible(true);
			
			this.getView().byId("GL1").setVisible(false);
			this.getView().byId("GL2").setVisible(true);
			
			this.getView().byId("LocationFE1").setVisible(false);
			this.getView().byId("LocationFE2").setVisible(true);
			

			this.getView().byId("ebutton").setVisible(false);
			this.getView().byId("sbutton").setVisible(true);
			this.getView().byId("cbutton").setVisible(true);
			
		},

		OnPressCancel:function(oEvent) {
			this.getView().byId("CCode1").setVisible(true);
			this.getView().byId("CCode2").setVisible(false);
			this.getView().byId("CC1").setVisible(true);
			this.getView().byId("CC2").setVisible(false);
			this.getView().byId("PORG1").setVisible(true);
			this.getView().byId("PORG2").setVisible(false);
			this.getView().byId("GL1").setVisible(true);
			this.getView().byId("GL2").setVisible(false);
			this.getView().byId("LocationFE1").setVisible(true);
			this.getView().byId("LocationFE2").setVisible(false);
			this.getView().byId("ebutton").setVisible(true);
			this.getView().byId("sbutton").setVisible(false);
			this.getView().byId("cbutton").setVisible(false);
			
		},

		onNavBack: function(oEvent)	{

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Home", {}, true /*no history*/);
		},
		
		OnPressSave:function(oEvent){

			var companycode = this.getView().getModel("products").getProperty("/EmployeeProfile('I12345')/CompanyCode");
			var costcenter = this.getView().getModel("products").getProperty("/EmployeeProfile('I12345')/CostCenter");
			var POrg = this.getView().getModel("products").getProperty("/EmployeeProfile('I12345')/PurchOrg");
			var GLAccount = this.getView().getModel("products").getProperty("/EmployeeProfile('I12345')/GLAccount");
			var Location = this.getView().getModel("products").getProperty("/EmployeeProfile('I12345')/Location");

			var oModel = this.getOwnerComponent().getModel("products");
			var oEntry = {
				"EmployeeID": "I12345",
				"GLAccount": GLAccount,
				"CompanyCode": companycode,
				"CostCenter": costcenter,
				"PurchOrg": POrg,
				"Location":Location
				};

			var _this = this;
			oModel.update("/EmployeeProfile/I12345",oEntry, {
				method: "PUT",
				success: function(oRetrievedResult) {

					_this.getView().byId("CCode1").setVisible(true);
					_this.getView().byId("CCode2").setVisible(false);
					_this.getView().byId("CC1").setVisible(true);
					_this.getView().byId("CC2").setVisible(false);
					_this.getView().byId("PORG1").setVisible(true);
					_this.getView().byId("PORG2").setVisible(false);
					_this.getView().byId("GL1").setVisible(true);
					_this.getView().byId("GL2").setVisible(false);
					_this.getView().byId("LocationFE1").setVisible(true);
					_this.getView().byId("LocationFE2").setVisible(false);
					_this.getView().byId("ebutton").setVisible(true);
					_this.getView().byId("sbutton").setVisible(false);
					_this.getView().byId("cbutton").setVisible(false);
					
					MessageBox.success("Saved successfully");
				},
				error: function(oError) { 
					alert("failed"); 
				}
			  });			  
      
		}

	});

});