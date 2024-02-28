# SAP-Online-Business-Mangement
SAP company management program. utilizes SAPUI5 and ABAP. Grade 105.

Manages Employees, Salaries, Positions and Departments of a Company.

Translated to both Hebrew and English.

Employees:
- Can be added throught the ui.
- Positions are automatically filled at the ui Select Field by reading them from the OData service.
- When a new Employee is added, a new Salary is added as well.

Salaries:
- Can be added for a selected Employee through the client's ui.
- A history of each Employee's Salaries as well as its' effective dates is stored in the OData service.
- A single Employee can have multiple Salaries in history, but only the latest will be displayed in the Employee table.

The service automatically generates ID for new Employees and Salaries.
