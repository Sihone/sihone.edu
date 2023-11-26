const db = require('../db');

async function payrollGetAllRouter(req, res) {
    console.log('payrollGetAllRouter');
    const { company_id } = req.params;

    try {
        const result = await db.query(`
            SELECT *, payroll.id AS id, employees.id AS employees_id, payroll.pay_period AS pay_period FROM payroll
            LEFT JOIN employees ON payroll.employee_id = employees.id
            WHERE payroll.company_id = $1
        `, [company_id]);
        console.log("results",result.rows);
        const payroll = result.rows;
        res.json(payroll);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function payrollGetRouter(req, res) {
    console.log('payrollGetRouter');
    const { company_id, id } = req.params;

    try {
        const result = await db.query(`
            SELECT *, payroll.id AS id, employees.id AS employees_id, payroll.pay_period AS pay_period FROM payroll
            LEFT JOIN employees ON payroll.employee_id = employees.id
            WHERE payroll.company_id = $1 AND payroll.id = $2
        `, [company_id, id]);
        const payroll = result.rows[0];
        res.json(payroll);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function payrollPostRouter(req, res) {
    console.log('payrollPostRouter');
    const { company_id, employee_id, pay_period, base_salary, total_hours, hourly_rate, total_salary, pay_date } = req.body;
    
    try {
        const result = await db.query(
            `
            WITH payroll AS (
                INSERT INTO payroll (employee_id, pay_period, base_salary, total_hours, hourly_rate, total_salary, company_id, pay_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
            ) SELECT *, payroll.id AS id, employees.id AS employees_id, payroll.pay_period AS pay_period FROM payroll
            LEFT JOIN employees ON payroll.employee_id = employees.id
            `,
            [employee_id, pay_period, base_salary, total_hours, hourly_rate, total_salary, company_id, pay_date]
        );
        const payroll = result.rows[0];
        res.status(201).json(payroll);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function payrollPutRouter(req, res) {
    console.log('payrollPutRouter');
    const { id, employee_id, pay_period, base_salary, total_hours, hourly_rate, total_salary, pay_date } = req.body;
    
    try {
        const result = await db.query(
            `
            WITH payroll AS (
                UPDATE payroll SET employee_id = $1, pay_period = $2, base_salary = $3, total_hours = $4, hourly_rate = $5, total_salary = $6, pay_date = $7 WHERE id = $8 RETURNING *
            ) SELECT *, payroll.id AS id, employees.id AS employees_id, payroll.pay_period AS pay_period FROM payroll
            LEFT JOIN employees ON payroll.employee_id = employees.id
            `,
            [employee_id, pay_period, base_salary, total_hours, hourly_rate, total_salary, pay_date, id]
        );
        const payroll = result.rows[0];
        res.status(201).json(payroll);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function payrollDeleteRouter(req, res) {
    console.log('payrollDeleteRouter');
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM payroll WHERE id = $1', [id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {
    payrollGetAllRouter,
    payrollGetRouter,
    payrollPostRouter,
    payrollPutRouter,
    payrollDeleteRouter
};