const db = require('../db');

function payrollGetAllRouter(req, res) {
    console.log('payrollGetAllRouter');
    const { company_id } = req.params;
    db.query(`
        SELECT *, payroll.id AS id, employees.id AS employees_id, payroll.pay_period AS pay_period FROM payroll
        LEFT JOIN employees ON payroll.employee_id = employees.id
        WHERE payroll.company_id = ?
    `,
    [company_id],
    async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            res.json(result.rows);
        }
    })
}

function payrollGetRouter(req, res) {
    console.log('payrollGetRouter');
    const { company_id, id } = req.params;
    db.query(`
        SELECT *, payroll.id AS id, employees.id AS employees_id, payroll.pay_period AS pay_period FROM payroll
        LEFT JOIN employees ON payroll.employee_id = employees.id
        WHERE payroll.company_id = ? AND payroll.id = ?
    `,
    [company_id, id],
    async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            res.json(result.rows[0]);
        }
    })
}

function payrollPostRouter(req, res) {
    console.log('payrollPostRouter');
    const { company_id, employee_id, pay_period, base_salary, total_hours, hourly_rate, total_salary, pay_date, yearly_rate, transport_rate, irpp, tdl, rav, cfc, pvid } = req.body;
    
    db.query(
        'INSERT INTO payroll (employee_id, pay_period, base_salary, total_hours, hourly_rate, total_salary, company_id, pay_date, yearly_rate, transport_rate, irpp, tdl, rav, cfc, pvid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *',
        [employee_id, pay_period, base_salary, total_hours, hourly_rate, total_salary, company_id, pay_date, yearly_rate, transport_rate, irpp, tdl, rav, cfc, pvid],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                db.query(
                    `
                    SELECT
                        tp.*,
                        employees.id AS employees_id,
                        tp.pay_period AS pay_period
                    FROM payroll tp
                    LEFT JOIN employees ON tp.employee_id = employees.id
                    WHERE tp.id = ?
                    `,
                    [result.rows[0].id],
                    async (result2, error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json(error);
                        } else {
                            const payroll = result2.rows[0];
                            res.status(201).json(payroll);
                        }
                    }
                );
            }
        }
    )
}

function payrollPutRouter(req, res) {
    console.log('payrollPutRouter');
    const { id, employee_id, pay_period, base_salary, total_hours, hourly_rate, total_salary, pay_date, yearly_rate, transport_rate, irpp, tdl, rav, cfc, pvid } = req.body;
    
    db.query(
            'UPDATE payroll SET employee_id = ?, pay_period = ?, base_salary = ?, total_hours = ?, hourly_rate = ?, total_salary = ?, pay_date = ?, yearly_rate = ?, transport_rate = ?, irpp = ?, tdl = ?, rav = ?, cfc = ?, pvid = ? WHERE id = ?',
            [employee_id, pay_period, base_salary, total_hours, hourly_rate, total_salary, pay_date, yearly_rate, transport_rate, irpp, tdl, rav, cfc, pvid, id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                db.query(
                    `
                    SELECT
                        tp.*,
                        employees.id AS employees_id,
                        tp.pay_period AS pay_period
                    FROM payroll tp
                    LEFT JOIN employees ON tp.employee_id = employees.id
                    WHERE tp.id = ?
                    `,
                    [id],
                    async (result2, error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json(error);
                        } else {
                            const payroll = result2.rows[0];
                            res.status(201).json(payroll);
                        }
                    }
                );
            }
        }
    )
}

function payrollDeleteRouter(req, res) {
    console.log('payrollDeleteRouter');
    const { id } = req.params;

    db.query('DELETE FROM payroll WHERE id = ?', [id], async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            res.json({ id });
        }
    })
}

module.exports = {
    payrollGetAllRouter,
    payrollGetRouter,
    payrollPostRouter,
    payrollPutRouter,
    payrollDeleteRouter
};
