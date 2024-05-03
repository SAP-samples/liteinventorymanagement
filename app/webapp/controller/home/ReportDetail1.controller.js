sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller,	formatMessage) {
	"use strict";

	return Controller.extend("com.sap.pgp.dev.inventory.controller.ReportDetail1", {
		formatMessage: formatMessage,
		
		onNavBack: function(oEvent)	{

			window.history.go(-1);
	}

	});
});
