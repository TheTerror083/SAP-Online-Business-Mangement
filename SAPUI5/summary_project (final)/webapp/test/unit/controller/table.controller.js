/*global QUnit*/

sap.ui.define([
	"summary_project/controller/table.controller"
], function (Controller) {
	"use strict";

	QUnit.module("table Controller");

	QUnit.test("I should test the table controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
