const db = require('../db');
const bcrypt = require("bcryptjs")

// define a function to get employees from the database
async function employeesGetRouter(req, res) {
    console.log('employeesGetRouter');
    const { company_id } = req.params;
    console.log("company_id", company_id);
    try {
        const result = await db.query(`
            SELECT *, roles.id AS roles_role_id, employees.id AS id, roles.company_id AS role_company_id, roles.name AS role_name, roles.description AS role_description FROM employees
            LEFT JOIN roles ON employees.role = roles.id
            WHERE employees.company_id = $1
            ORDER BY employees.id DESC
        `, [company_id]);
        res.json(result.rows.map(row => delete row.password && row));
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function employeesPostRouter(req, res) {
    console.log('employeesPostRouter');
    const { salutation, first_name, last_name, email, password, role, company_id, base_salary, hourly_rate, pay_period, emmergency_contact_name, emmergency_contact_phone, emmergency_contact_relation, phone } = req.body;
    console.log("req.body", req.body);
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
        const result = await db.query(
            'INSERT INTO employees (salutation, first_name, last_name, email, password, role, company_id, base_salary, hourly_rate, pay_period, emmergency_contact_name, emmergency_contact_phone, emmergency_contact_relation, employee_id, phone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11,$12,$13, $14, $15) RETURNING *',
            [salutation, first_name, last_name, email, hashedPassword, role, company_id, base_salary, hourly_rate, pay_period, emmergency_contact_name, emmergency_contact_phone, emmergency_contact_relation, "", phone]
        );

        const employee_id = await getRandomEmployeeId(company_id);
        console.log("employee_id", employee_id);
        const updated = await db.query(
            `
                WITH updated AS (
                    UPDATE employees SET employee_id = $1 WHERE id = $2 RETURNING *
                ) SELECT *, roles.id AS roles_role_id, updated.id AS id, roles.company_id AS role_company_id, roles.name AS role_name, roles.description AS role_description FROM updated
                LEFT JOIN roles ON updated.role = roles.id
            `,
            [employee_id, result.rows[0].id]
        );
        const employee = updated.rows[0];
        delete employee.password;
        res.status(201).json(employee);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getRandomEmployeeId = async (company_id) => {
    const employee_ids = await db.query(`
        SELECT employee_id FROM employees
    `);
    const expectedLength = employee_ids.rows.length + 1;
    let random = '';
    while(employee_ids.rows.length < expectedLength){
        const r = Math.floor(Math.random() * 10000) + 1;
        const employee_id = company_id + "" + r + new Date().getFullYear().toString().charAt(2) + new Date().getFullYear().toString().charAt(3);
        if(employee_ids.rows.indexOf(employee_id) === -1) {
            employee_ids.rows.push(employee_id);
            random = employee_id;
        }
    }
    return random;
}


async function employeeGetRouter(req, res) {
    console.log('employeeGetRouter');
    const { company_id, id } = req.params;
    console.log("company_id", company_id);
    console.log("id", id);
    try {
        const result = await db.query(`
            SELECT *, roles.id AS roles_role_id, employees.id AS id, roles.company_id AS role_company_id, roles.name AS role_name, roles.description AS role_description FROM employees
            LEFT JOIN roles ON employees.role = roles.id
            WHERE employees.company_id = $1 AND employees.id = $2
        `, [company_id, id]);
        const employee = result.rows[0];
        delete employee.password;
        res.json(employee);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function employeesPutRouter(req, res) {
    console.log('employeesPutRouter');
    const { id, salutation, first_name, last_name, email, role, employee_id, company_id, base_salary, hourly_rate, pay_period, emmergency_contact_name, emmergency_contact_phone, emmergency_contact_relation } = req.body;
    console.log("req.body", req.body);
    try {
        const result = await db.query(
            `  
            WITH updated AS (
                UPDATE employees SET first_name = $1, last_name = $2, email = $3, role = $4, employee_id = $5, company_id = $6, base_salary = $7, hourly_rate = $8, pay_period = $9, salutation = $10, emmergency_contact_name = $11, emmergency_contact_phone = $12, emmergency_contact_relation = $13 WHERE id = $14 RETURNING *
            ) SELECT *, roles.id AS roles_role_id, updated.id AS id, roles.company_id AS role_company_id, roles.name AS role_name, roles.description AS role_description FROM updated
            LEFT JOIN roles ON updated.role = roles.id
            `,
            [first_name, last_name, email, role, employee_id, company_id, base_salary, hourly_rate, pay_period, salutation, emmergency_contact_name, emmergency_contact_phone, emmergency_contact_relation, id]
        );
        const employee = result.rows[0];
        delete employee.password;
        res.status(201).json(employee);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function employeesDeleteRouter(req, res) {
    console.log('employeesDeleteRouter');
    const { id } = req.params;
    console.log("id", id);
    try {
        const result = await db.query('DELETE FROM employees WHERE id = $1 RETURNING *', [id]);
        const employee = result.rows[0];
        delete employee.password;
        res.status(201).json(employee);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function passwordRouter(req, res) {
    console.log('passwordRouter');
    const { id, password } = req.body;
    console.log("req.body", req.body);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
        const result = await db.query(
            'UPDATE employees SET password = $1 WHERE id = $2 RETURNING *',
            [hashedPassword, id]
        );
        const employee = result.rows[0];
        delete employee.password;
        res.status(201).json(employee);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {
    employeesGetRouter,
    employeesPostRouter,
    employeesPutRouter,
    employeesDeleteRouter,
    passwordRouter,
    employeeGetRouter,
};