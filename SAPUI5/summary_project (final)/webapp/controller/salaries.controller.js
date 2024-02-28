sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Column",
    "sap/m/Text"
 ], 
 
 function (Controller, JSONModel,  Column, Text) {
    "use strict";
 
    return Controller.extend("summaryproject.controller.salaries", {
        onInit: function () {
            var tableData = [];
                var employeesDataModel = this.getOwnerComponent().getModel();

                var empTableHeaders = [
                  { property: "EmployeeId", label: "Employee ID" },
                  { property: "FirstName", label: "First Name" },
                  { property: "LastName", label: "Last Name" },
                  { property: "Birthdate", label: "Birthdate" },
                  { property: "Gender", label: "Gender" },
                  { property: "DepartmentId", label: "Department ID" },
                  { property: "SalaryId", label: "Salary ID" },
                  { property: "show salaries" },
                ]; 

                  var tableHeaders = [
                    { property: "SalaryId", label: "Salary ID" },
                    { property: "EmployeeId", label: "Employee ID" },
                    { property: "SalaryAmount", label: "Salary Amount" },
                    { property: "Currency", label: "Currency" },
                    { property: "EffectiveDate", label: "Effective Date" }
                  ];

                // Create a JSON model and set it to the view
                var employeesModel = new JSONModel({
                    tableData: tableData,
                    tableHeaders: empTableHeaders,
                    selectedEmployee: ""
                  });
                  this.getView().setModel(employeesModel);

                  employeesModel.setProperty("/addSalEnabled", false);
            
                  // Dynamically create columns based on tableHeaders
                  this.createColumns(tableHeaders, "salTableId");
                  this.createColumns(empTableHeaders, "employeeTableId");
                  

                  employeesDataModel.read(`/EmployeeSet`, {    
                    success: function(data) {
                      tableData = data.results;
                      employeesModel.setProperty("/empViewTableData", tableData);
                    },
                    error: function(error) {
                       console.error("Error reading data: " + error);
                    }
                 });
        },

        navigateToDepartments: function(){
            var oRouter =  sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("table");
        },



        createColumns: function (headers, tableId) {
            var oTable = this.getView().byId(tableId);
            headers.forEach(function (header) {
              var oColumn = new Column({
                header: new Text({ text: header.label }),
              });
              oTable.addColumn(oColumn);
            });
          },

          fillSalaryTable: function(oEvent) {
                var selectedItemData = oEvent.getSource().getBindingContext().getObject();

                var salaryDataModel = this.getOwnerComponent().getModel();
                var salaryModel = this.getView().getModel();
                  salaryModel.setProperty("/selectedEmployee", selectedItemData.EmployeeId);

                  // Call the get entitySet using the selected Employee ID as filter:
                  salaryDataModel.read(`/SalarySet`, { 
                    filters: [new sap.ui.model.Filter("EmployeeId", "EQ", selectedItemData.EmployeeId)],  
                    success: function(data) {
                      // add the result to the Salaries Table
                      salaryModel.setProperty("/tableData", data.results);
                    },
                    error: function(error) {
                       console.error("Error reading data: " + error);
                    }
                 });
                 salaryModel.setProperty("/addSalEnabled", true);

            },

            showPopup: function (selectedDataModel) {
              // Get the reference to the current view
              var oView = this.getView();
              // Try to get the reference to a dialog with the ID "myPopupFragment" in the current view
              var oDialog = oView.byId("salPopupFragment");

              // If the dialog does not exist, create it using XML fragment
              if (!oDialog) {
                  // Create a new dialog by loading an XML fragment
                  oDialog = sap.ui.xmlfragment(oView.getId(), "summaryproject.view.salarypopup", this);

                  // Add the dialog as a dependent of the view
                  oView.addDependent(oDialog);
              }
              oDialog.setModel(selectedDataModel, 'popupModel');                
              oDialog.open();
          },

          salInputCheck: function(inputDataSource){ //returns true of input is valid, else returns false.
            var salAnmountCheck = inputDataSource.byId("inpSalaryAmount").getValue();
            if(salAnmountCheck < 0 || salAnmountCheck > 9999999999 ||  
              isNaN(salAnmountCheck) == true || salAnmountCheck.length < 1)
            {
              sap.m.MessageToast.show("Error: Invalid salary amount entered.");
              return false;
            }
            return true; // means input is valid
          },

          submit: function () {
            var control = this;
            var newSalaryModel = this.getOwnerComponent().getModel();
            var inputDataSource = this.getView();
            var isValid = this.salInputCheck(inputDataSource)

            if( isValid == true){
            // Add a new Salary.
            // Both are added to their respective database tables using a single Entity.
            newSalaryModel.createEntry("/SalarySet()", {
              properties: {
                // Salary ID and Effective Date are defined at the service automatically.
                // if an ID or Effective Date would be provided here they will be overwritten.
                EmployeeId: inputDataSource.byId("inpEmployeeId").getValue(),
                SalaryAmount: inputDataSource.byId("inpSalaryAmount").getValue(),
                Currency: inputDataSource.byId("inpCurr").getSelectedKey(),
              }
          });
          newSalaryModel.submitChanges({
            success: function(data){
              sap.m.MessageToast.show("Success!");
              control.closePop();
              var addSal = [data.__batchResponses[0].__changeResponses[0].data];               // get the result we need
              var newSalData = control.getView().getModel().getProperty("/tableData");         //get the existing data

              //NOTE: the table rows are sorted in a descending order,
              //this is done to ensure the new salary will appear at the top of the list
              // so it would fit with the original design of the table (showing the employee's current salary at the top).
              newSalData.push.apply(newSalData, addSal);                                       
              control.getView().getModel().setProperty("/tableData", newSalData);
              
            },
            error: function(error){
              console.log("Failed to add new salary. Error " + error);
            }
          })
        }
          },

          closePop: function () {
              this.getView().byId("salPopupFragment").close()
          },
        
    });
 
 });