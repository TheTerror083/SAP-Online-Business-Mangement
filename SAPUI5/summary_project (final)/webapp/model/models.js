sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
        },
        createReqModel: function () {
            return new JSONModel({request: []})
        },

        createODataModel: function () {
            var oModel = new ODataModel("http://35.222.88.198:50000/sap/opu/odata/SAP/ZHA_SUM_SRV_DEV15_SRV", {
                json: true
            });

            return oModel;
        }
    };
});