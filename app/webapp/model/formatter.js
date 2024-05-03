sap.ui.define([], function () {
	"use strict";
	return {
		statusText: function (sStatus) {
			switch (sStatus) {
				case "0":
					return "Out Of Stock";
				default:
					return "Available";
			}
		}
	};
});