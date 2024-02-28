# SAP-Online-Business-Mangement
SAP company management program. utilizes SAPUI5 and ABAP. Grade 105.

Manages Employees, Salaries, Positions and Departments of a Company.

Translated to both Hebrew and English.

Depatments and their Managers are displayed at the home screen. by clicking on the Department, a list of its Employees will be dsiplayed, excluding the manager. 
Achieved by utilizing a Deep Entity of a Department with a table of it's Employees.

By clicking the "Add Employee" button a popup will be displayed with the required fields to fill.

A list of Employees is displayed at the Employees and Salaries screen.
By clicking on an Employee, a list of their Salary history will be displayed, with the top Salary being the latest.

By clicking the "Add Salary" button a popup will be displayed with the required fields to fill. the new Salary will be updated  at the Employee table as well, and will be this Employee's latest Salary.

More Features:
Employees:
- Can be added throught the ui.
- Positions are automatically filled at the ui Select Field by reading them from the OData service.
- When a new Employee is added, a new Salary is added as well.

Salaries:
- Uses a Currency field to determine in which currency the Salary is paid.
- Can be added for a selected Employee through the client's ui.
- A history of each Employee's Salaries as well as its' effective dates is stored in the OData service.
- A single Employee can have multiple Salaries in history, but only the latest will be displayed in the Employee table.

The application will notify the user of an incorrect input BEFORE sending it to the service. an error message will be displayed on the ui and the OData service will NOT BE CALLED until the input passes all checks.

The service automatically generates ID for new Employees and Salaries.
