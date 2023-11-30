const db = require('../db');
const bcrypt = require("bcryptjs")

function employeesGetRouter(req, res) {
    console.log('employeesGetRouter');
    const { company_id } = req.params;
    db.query(`
        SELECT *, roles.id AS roles_role_id, employees.id AS id, roles.company_id AS role_company_id, roles.name AS role_name, roles.description AS role_description FROM employees
        LEFT JOIN roles ON employees.role = roles.id
        WHERE employees.company_id = ?
        ORDER BY employees.id DESC
    `,
    [company_id],
    async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            res.json(result.rows.map(row => delete row.password && row));
        }
    })
}

function employeeGetRouter(req, res) {
    console.log('employeeGetRouter');
    const { company_id, id } = req.params;
    db.query(`
        SELECT *, roles.id AS roles_role_id, employees.id AS id, roles.company_id AS role_company_id, roles.name AS role_name, roles.description AS role_description FROM employees
        LEFT JOIN roles ON employees.role = roles.id
        WHERE employees.company_id = ? AND employees.id = ?
    `,
    [company_id, id],
    async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            const employee = result.rows[0];
            delete employee.password;
            res.json(employee);
        }
    })
}

async function employeesPostRouter(req, res) {
    console.log('employeesPostRouter');
    const { salutation, first_name, last_name, email, password, role, company_id, base_salary, hourly_rate, pay_period, emmergency_contact_name, emmergency_contact_phone, emmergency_contact_relation, phone } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    db.query(
        'INSERT INTO employees (salutation, first_name, last_name, email, password, role, company_id, base_salary, hourly_rate, pay_period, emmergency_contact_name, emmergency_contact_phone, emmergency_contact_relation, employee_id, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *',
        [salutation, first_name, last_name, email, hashedPassword, role, company_id, base_salary, hourly_rate, pay_period, emmergency_contact_name, emmergency_contact_phone, emmergency_contact_relation, "", phone],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                getRandomEmployeeId(company_id, (employee_id) => {
                    console.log("employee_id", employee_id);
                    db.query(
                        'UPDATE employees SET employee_id = ? WHERE id = ?',
                        [employee_id, result.rows[0].id],
                        async (result2, error) => {
                            if (error) {
                                console.log(error);
                                res.status(500).json(error);
                            } else {
                                db.query(
                                    `
                                    SELECT *, roles.id AS roles_role_id, employees.id AS id, roles.company_id AS role_company_id, roles.name AS role_name, roles.description AS role_description FROM employees
                                    LEFT JOIN roles ON employees.role = roles.id
                                    WHERE employees.company_id = ? AND employees.id = ?
                                    `,
                                    [company_id, result.rows[0].id],
                                    async (result3, error) => {
                                        if (error) {
                                            console.log(error);
                                            res.status(500).json(error);
                                        } else {
                                            const employee = result3.rows[0];
                                            delete employee.password;
                                            res.status(201).json(employee);
                                        }
                                    }
                                );
                            }
                        }
                    );
                
                });
            }
        }
    );
}

function employeesPutRouter(req, res) {
    console.log('employeesPutRouter');
    const { id, salutation, first_name, last_name, email, role, employee_id, company_id, base_salary, hourly_rate, pay_period, emmergency_contact_name, emmergency_contact_phone, emmergency_contact_relation } = req.body;
    db.query('UPDATE employees SET salutation = ?, first_name = ?, last_name = ?, email = ?, role = ?, employee_id = ?, company_id = ?, base_salary = ?, hourly_rate = ?, pay_period = ?, emmergency_contact_name = ?, emmergency_contact_phone = ?, emmergency_contact_relation = ? WHERE id = ?',
        [salutation, first_name, last_name, email, role, employee_id, company_id, base_salary, hourly_rate, pay_period, emmergency_contact_name, emmergency_contact_phone, emmergency_contact_relation, id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                db.query(
                    `
                    SELECT *, roles.id AS roles_role_id, employees.id AS id, roles.company_id AS role_company_id, roles.name AS role_name, roles.description AS role_description FROM employees
                    LEFT JOIN roles ON employees.role = roles.id
                    WHERE employees.company_id = ? AND employees.id = ?
                    `,
                    [company_id, id],
                    async (result3, error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json(error);
                        } else {
                            const employee = result3.rows[0];
                            delete employee.password;
                            res.status(201).json(employee);
                        }
                    }
                );
            }
        }
    );
}

function employeesDeleteRouter(req, res) {
    console.log('employeesDeleteRouter');
    const { id } = req.params;
    db.query('DELETE FROM employees WHERE id = ? RETURNING *', [id], async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            const employee = result.rows[0];
            delete employee.password;
            res.status(201).json(employee);
        }
    });
}

async function passwordRouter(req, res) {
    console.log('passwordRouter');
    const { id, password } = req.body;
    console.log("req.body", req.body);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    db.query(
        'UPDATE employees SET password = ? WHERE id = ?',
        [hashedPassword, id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                res.status(201).json();
            }
        }
    );
}

const getRandomEmployeeId = async (company_id, callBack) => {
    db.query('SELECT employee_id FROM employees', [], async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            const expectedLength = result.rows.length + 1;
            let random = '';
            while(result.rows.length < expectedLength){
                const r = Math.floor(Math.random() * 10000) + 1;
                const employee_id = company_id + "" + r + new Date().getFullYear().toString().charAt(2) + new Date().getFullYear().toString().charAt(3);
                if(result.rows.indexOf(employee_id) === -1) {
                    result.rows.push(employee_id);
                    random = employee_id;
                }
            }
            callBack(random);
        }
    
    });
}

module.exports = {
    employeesGetRouter,
    employeesPostRouter,
    employeesPutRouter,
    employeesDeleteRouter,
    passwordRouter,
    employeeGetRouter,
};