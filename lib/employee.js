/*
Employee class
    * properties: id, title, salary, department_id
    * methods: 
*/

class Employee {
  constructor({ id, first_name, last_name, role_id, manager_id }) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.role_id = role_id;
    this.manager_id = manager_id;
  }
}

function sqlRequestAllEmployees(sqldb) {
  const query = `SELECT 
  employee.id, employee.first_name, employee.last_name, 
  role.title AS job_title, role.salary, 
  department.name AS department,
  CONCAT (manager.first_name, ' ', manager.last_name) AS manager
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
LEFT JOIN employee AS manager ON employee.manager_id = manager.id
ORDER BY employee.id`;
  return new Promise((resolve, reject) => {
    sqldb.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// modules to export
module.exports = { Employee, sqlRequestAllEmployees };