sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Column",
    "sap/m/Text"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel,  Column, Text) {
        "use strict";

        return Controller.extend("summaryproject.controller.table", {
            onInit: function () {
              var tableData = [];
                var managerDataModel = this.getOwnerComponent().getModel();

                  var tableHeaders = [
                    { property: "EmployeeId", label: "Employee ID" },
                    { property: "FirstName", label: "First Name" },
                    { property: "LastName", label: "Last Name" },
                    { property: "Birthdate", label: "Birthdate" },
                    { property: "Gender", label: "Gender" },
                    { property: "DepartmentId", label: "Department ID" },
                    { property: "PositionId", label: "Position ID" },
                    { property: "show employees" },
                  ];

                // Create a JSON model and set it to the view
                var managerModel = new JSONModel({
                    tableData: tableData,
                    tableHeaders: tableHeaders,
                    selectedDepartment: "",
                  });
                  this.getView().setModel(managerModel);
                  managerModel.setProperty("/btnEnabled", false);
            
                  var empTableHeaders = [
                    { property: "EmployeeId", label: "Employee ID" },
                    { property: "FirstName", label: "First Name" },
                    { property: "LastName", label: "Last Name" },
                    { property: "Birthdate", label: "Birthdate" },
                    { property: "Gender", label: "Gender" },
                    { property: "DepartmentId", label: "Department ID" },
                    { property: "SalaryAmount", label: "Salary Amount" },
                    { property: "Currency", label: "Currency" },
                  ];

                  // Dynamically create columns based on tableHeaders
                  this.createColumns(tableHeaders, "myTableId");
                  this.createColumns(empTableHeaders, "employeeTableId");
                  

                  managerDataModel.read(`/ManagerAndDepartmentSet`, {    
                    success: function(data) {
                      tableData = data.results;
                      managerModel.setProperty("/tableData", tableData);
                    },
                    error: function(error) {
                       console.error("Error reading data: " + error);
                    }
                 });
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

              openPopup: function () {
                // Get the reference to the current view
                var oView = this.getView();
                // Try to get the reference to a dialog with the ID "myPopupFragment" in the current view
                var oDialog = oView.byId("myPopupFragment");

                // If the dialog does not exist, create it using XML fragment
                if (!oDialog) {
                    // Create a new dialog by loading an XML fragment
                    oDialog = sap.ui.xmlfragment(oView.getId(), "summaryproject.view.popup", this);
  
                    // Add the dialog as a dependent of the view
                    oView.addDependent(oDialog);
                }
                var popupViewData = this.getOwnerComponent().getModel();
                var selectedDataModel = new JSONModel(popupViewData);

                oDialog.setModel(selectedDataModel, 'popupModel');
                popupViewData.read(`/PositionSet()`, {    
                  success: function(data) {
                    selectedDataModel.setProperty("/positions", data.results);                  
                    oDialog.open()
                  },                                                               
                  error: function(error) {
                     console.error("Error reading data: " + error);
                  }
               });

            },
  
            closePopup: function () {
                this.getView().byId("myPopupFragment").close()
            },

            fillEmployeeTable: function(oEvent) {
              // get the selected row's data, to use it's Department ID later:
                var selectedItemData = oEvent.getSource().getBindingContext().getObject();
                
                var employeeDataModel = this.getOwnerComponent().getModel();
                var employeeModel = this.getView().getModel();
                  employeeModel.setProperty("/selectedDepartment", selectedItemData.DepartmentId);
              console.log(selectedItemData.DepartmentId);
                  // send the get expanded entity request with the respective Department ID 
                  employeeDataModel.read(`/DepartmentSet('${selectedItemData.DepartmentId}')`, {    
                    urlParameters:{
                      "$expand": "EmployeesAndSalaries"
                    },
                    success: function(data) {
                      // add the result to the Employees Table
                      employeeModel.setProperty("/empViewTableData", data.EmployeesAndSalaries.results);
                    },
                    error: function(error) {
                       console.error("Error reading data: " + error);
                    }
                 });
                 employeeModel.setProperty("/btnEnabled", true);

            },
            inputCheck: function(inputDataSource){ //returns true of input is valid, else returns false.
              var inpCheck = {
                FirstName: inputDataSource.byId("inpFirstName").getValue(),
                LastName: inputDataSource.byId("inpLastName").getValue(),
                SalaryAmount: inputDataSource.byId("inpSalaryAmount").getValue(),
              }
              if(inpCheck.SalaryAmount < 0 || inpCheck.SalaryAmount > 9999999999 
                || inpCheck.SalaryAmount.length < 1 || isNaN(inpCheck.SalaryAmount) == true)
              {
                sap.m.MessageToast.show("Error: Invalid salary amount entered.");
                return false;
              }
              if(inpCheck.FirstName.length < 1 || inpCheck.FirstName.length > 40)
              {
                sap.m.MessageToast.show("Error: First name must be between 1 to 40 letters.");
                return false;
              }
              if(inpCheck.LastName.length < 1 || inpCheck.LastName.length > 40)
              {
                sap.m.MessageToast.show("Error: Last name must be between 1 to 40 letters.");
                return false;
              }
              return true; // means input is valid

            },

            approve: function () {
              var control = this;
              var newEmployeeModel = this.getOwnerComponent().getModel();
              var inputDataSource = this.getView();
              var isValid = this.inputCheck(inputDataSource);
              if( isValid == true ){
              // Add a new Employee and a new Salary.
              // Both are added to their respective database tables using a single Entity.
              newEmployeeModel.createEntry("/EmployeeAndSalarySet()", {
                properties: {
                  // IDs for both Employee and the new Salary are defined at the sevice automatically.
                  // if an ID would be provided here it would be overwritten.
                  FirstName: inputDataSource.byId("inpFirstName").getValue(),
                  LastName: inputDataSource.byId("inpLastName").getValue(),
                  Birthdate: inputDataSource.byId("inpBirthdate").getDateValue(),  // the date cannot be entered manually to prevent incompatible inputs.
                  Gender: inputDataSource.byId("inpGender").getSelectedKey(),
                  DepartmentId: inputDataSource.byId("inpDepartmentId").getValue(),
                  PositionId: inputDataSource.byId("inputPosId").getSelectedKey(),
                  SalaryAmount: inputDataSource.byId("inpSalaryAmount").getValue(),
                  Currency: inputDataSource.byId("inpCurr").getSelectedKey(),
                }
            });
            newEmployeeModel.submitChanges({
              success: function(data){
                sap.m.MessageToast.show("Success!");
                control.closePopup();

                // after adding the employee to the table, the service returns the employee and salary entry with the new ID.
                // instead of calling the service again, the program will take the already existing data,
                // save it in an array and push the received employee to it, and then update the table.
                // the new employee row will be added to the bottom of the table at the view

                var addEmp = [data.__batchResponses[0].__changeResponses[0].data];                     // get the result we need
                var newEmpData = control.getView().getModel().getProperty("/empViewTableData");         //get the existing data
                newEmpData.push.apply(newEmpData, addEmp);
                control.getView().getModel().setProperty("/empViewTableData", newEmpData);
              },
              error: function(error){
                console.log("Failed to add new employee. Error " + error);
                sap.m.MessageToast.show("An error has occured");
              }
            })
            }              
          },

            navigateToSalaries: function(){
              var oRouter =  sap.ui.core.UIComponent.getRouterFor(this);
              oRouter.navTo("salaries");
            }
        });
    });
