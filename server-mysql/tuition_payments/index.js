const db = require('../db');

function tuitionPaymentsGetAllRouter(req, res) {
    console.log('tuitionGetRouter');
    const { company_id } = req.params;
    db.query(`
        SELECT *, tuition_payments.id AS id, tuition.academic_year_id AS tuition_academic_year_id FROM tuition_payments
        LEFT JOIN tuition ON tuition_payments.tuition_id = tuition.id
        WHERE tuition_payments.company_id = ?
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

function tuitionPaymentsGetRouter(req, res) {
    console.log('tuitionGetRouter');
    const { company_id, id } = req.params;
    db.query(`
        SELECT *, tuition_payments.id AS id, tuition.academic_year_id AS tuition_academic_year_id FROM tuition_payments
        LEFT JOIN tuition ON tuition_payments.tuition_id = tuition.id
        WHERE tuition_payments.company_id = ? AND tuition_payments.id = ?
    `,
    [company_id, id],
    async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            const tuition = result.rows[0];
            res.json(tuition);
        }
    })
}

function tuitionPaymentsPostRouter(req, res) {
    console.log('tuitionPostRouter');
    const { tuition_id, amount, payment_date, company_id } = req.body;
    db.query(
        'INSERT INTO tuition_payments (tuition_id, amount, payment_date, company_id) VALUES (?, ?, ?, ?) RETURNING *',
        [tuition_id, amount, payment_date, company_id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                db.query(
                    'SELECT *, tuition_payments.id AS id, tuition.academic_year_id AS tuition_academic_year_id FROM tuition_payments LEFT JOIN tuition ON tuition_payments.tuition_id = tuition.id WHERE tuition_payments.id = ?',
                    [result.rows[0].id],
                    async (result, error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json(error);
                        } else {
                            const tuition = result.rows[0];
                            res.status(201).json(tuition);
                        }
                    }
                )
            }
        }
    )
}

function tuitionPaymentsPutRouter(req, res) {
    console.log('tuitionPutRouter');
    const { id, amount } = req.body;
    db.query(
        'UPDATE tuition_payments SET amount = ? id = ?',
        [amount, id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                db.query(
                    'SELECT *, tuition_payments.id AS id, tuition.academic_year_id AS tuition_academic_year_id FROM tuition_payments LEFT JOIN tuition ON tuition_payments.tuition_id = tuition.id WHERE tuition_payments.id = ?',
                    [id],
                    async (result, error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json(error);
                        } else {
                            const tuition = result.rows[0];
                            res.status(201).json(tuition);
                        }
                    }
                )
            }
        }
    )
}

function tuitionPaymentsDeleteRouter(req, res) {
    console.log('tuitionDeleteRouter');
    const { id } = req.params;
    db.query(
        'DELETE FROM tuition_payments WHERE id = ?',
        [id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                res.json({id});
            }
        }
    )
}

module.exports = {
    tuitionPaymentsGetAllRouter,
    tuitionPaymentsGetRouter,
    tuitionPaymentsPostRouter,
    tuitionPaymentsPutRouter,
    tuitionPaymentsDeleteRouter
};
