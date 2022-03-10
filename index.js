const inquirer = require("inquirer");
const cTable = require("console.table");
const departmentClass = require("./lib/department.js");
const roleClass = require("./lib/role.js");
const employeeClass = require("./lib/employee.js");

let sqldb = require("./db.js");

let arrayOfDepartments = [];

// Array with Main Menu prompt
const mainMenuPrompt = [
  {
    name: "mainOptions",
    type: "list",
    message: "What would you like to do?",
    choices: ["View All Departments", "Add Department", "View All Roles", "Add Role", "View All Employees", "Add Employee", "Update Employee Role", "Quit"],
  },
];

// Array with Add Department prompt

const addDepartmentPrompt = [
  {
    name: "departmentName",
    type: "input",
    message: "Enter department name.",
    validate: function (input) {
      const valid = input !== "";
      return valid || "Please enter a department name";
    },
  },
];

/*
 bannerMain()
  prints out ASCII text banner in terminal
    * prints out "Employee Tracker" in terminal
    * calls runMainMenu function
*/
function bannerMain() {
  const banner = `
 _____                    _                           
|  ___|                  | |                          
| |__   _ __ ___   _ __  | |  ___   _   _   ___   ___ 
|  __| | '_   _ \\ | '_ \\ | | / _ \\ | | | | / _ \\ / _ \\
| |___ | | | | | || |_) || || (_) || |_| ||  __/|  __/
\\____/ |_| |_| |_|| .__/ |_| \\___/  \\__, | \\___| \\___|
                  | |                __/ |            
                  |_|               |___/             
 _____                     _                          
|_   _|                   | |                         
  | |   _ __   __ _   ___ | | __  ___  _ __           
  | |  | '__| / _  | / __|| |/ / / _ \\| '__|          
  | |  | |   | (_| || (__ |   < |  __/| |             
  \\_/  |_|    \\__,_| \\___||_|\\_\\ \\___||_|             
                                                       
                                                       
 `;

  console.log(banner);
  runMainMenu();
}

/*
 runMainMenu()
  prompts user with the main options
    * 
*/
function runMainMenu() {
  inquirer.prompt(mainMenuPrompt).then(function (answers) {
    let mainMenuPick = answers.mainOptions;

    if (mainMenuPick === "View All Employees") {
      viewAllEmployees();
    } else if (mainMenuPick === "Add Employee") {
      addEmployee();
    } else if (mainMenuPick === "Update Employee Role") {
      updateEmployeeRole();
    } else if (mainMenuPick === "View All Roles") {
      viewAllRoles();
    } else if (mainMenuPick === "Add Role") {
      addRole();
    } else if (mainMenuPick === "View All Departments") {
      viewAllDepartments();
    } else if (mainMenuPick === "Add Department") {
      addDepartment();
    } else {
      quitTracker();
    }
  });
}

/*
 viewAllDepartments()
  returns department table
    * 
*/
async function viewAllDepartments() {
  const result = await departmentClass.sqlRequestAllDepartments(sqldb);
  console.table(result);
  runMainMenu();
}

/*
 addDepartment()
  add new department to department table
    * 
*/
function addDepartment() {
  inquirer.prompt(addDepartmentPrompt).then(async function (answers) {
    const newDepartmentName = answers.departmentName;
    const addNewDepartment = await departmentClass.sqlAddDepartment(sqldb, newDepartmentName);
    runMainMenu();
  });
}

/*
 viewAllRoles()
  returns roles table
    * 
*/
async function viewAllRoles() {
  const result = await roleClass.sqlRequestAllRoles(sqldb);
  console.table(result);
  runMainMenu();
}

/*
 addRole()
  add new role to role table
    * 
*/
async function addRole() {
  await updateDepartmentsArray();

  // Array with Add Role prompt
  const addRolePrompts = [
    {
      name: "roleTitle",
      type: "input",
      message: "Enter role name.",
      validate: function (input) {
        const valid = input !== "";
        return valid || "Please enter a department name";
      },
    },
    {
      name: "salary",
      type: "input",
      message: "Enter salary.",
      validate: function (input) {
        const valid = input !== "";
        return valid || "Please enter a salary";
      },
    },
    {
      name: "departmentOption",
      type: "list",
      message: "What department does this role belong to?",
      choices: arrayOfDepartments,
    },
  ];

  inquirer.prompt(addRolePrompts).then(async function (answers) {
    const newRoleTitle = answers.roleTitle;
    const newRoleSalary = answers.salary;
    const newRoleDepartment = answers.departmentOption;
    const roleDepartmentIdFromTable = await departmentClass.sqlGetDepartmentIdFromDepartmentName(sqldb, newRoleDepartment);
    const newRoleDepartmentId = roleDepartmentIdFromTable[0].id;

    const addNewRole = await roleClass.sqlAddRole(sqldb, newRoleTitle, newRoleSalary, newRoleDepartmentId);
    runMainMenu();
  });
}

/*
 getAllDepartmentsInArray()
  select all department names and put them into an array
    * 
*/
async function updateDepartmentsArray() {
  let departmentNames = await departmentClass.sqlGetAllDepartmentNames(sqldb);

  arrayOfDepartments = [];

  departmentNames.forEach((departmentName) => {
    for (let key in departmentName) {
      arrayOfDepartments.push(departmentName[key]);
    }
  });

  return arrayOfDepartments;
}

/*
 viewAllEmployees()
  returns table with all employees
    * 
*/
async function viewAllEmployees() {
  const result = await employeeClass.sqlRequestAllEmployees(sqldb);
  console.table(result);
  runMainMenu();
}

/*
 addEmployee()
  add new employee to employee table
    * 
*/
function addEmployee() {
  console.log("They chose to Add Employee");
}

/*
 updateEmployeeRole()
  add new employee to employee table
    * 
*/
function updateEmployeeRole() {
  console.log("They chose to Update Employee Role");
}

/*
 quitTracker()
  quit the app
    * 
*/
function quitTracker() {
  console.log("Thank you for using the Employee Tracker!");
  process.exit();
}

/*
 init()
  initializatize the application
    * calls figletMain function
*/
function init() {
  bannerMain();
}

// Initialize the application by calling init function
init();
