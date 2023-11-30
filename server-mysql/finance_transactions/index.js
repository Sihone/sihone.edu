const db = require('../db');

function financeTransactionsGetAllRouter(req, res) {
    console.log('financeTransactionsGetAllRouter');
    const { company_id } = req.params;
    db.query(`
        SELECT * FROM finance_transactions
        WHERE finance_transactions.company_id = ?
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

function financeTransactionsGetRouter(req, res) {
    console.log('financeTransactionsGetRouter');
    const { company_id, id } = req.params;
    db.query(`
        SELECT * FROM finance_transactions
        WHERE company_id = ? AND id = ?
    `,
    [company_id, id],
    async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            const finance_transaction = result.rows[0];
            res.json(finance_transaction);
        }
    })
}

function financeTransactionsPostRouter(req, res) {
    console.log('financeTransactionsPostRouter');
    const { company_id, description, date, amount, type, employee_id, account_id } = req.body;
    db.query(
        'INSERT INTO finance_transactions (company_id, description, date, amount, type, employee_id, account_id) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *',
        [company_id, description, date, amount, type, employee_id, account_id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                const finance_transaction = result.rows[0];
                res.status(201).json(finance_transaction);
            }
        }
    );
}

function financeTransactionsPutRouter(req, res) {
    console.log('financeTransactionsPutRouter');
    const { id, description, date, amount, type, employee_id, account_id } = req.body;
    db.query(
        'UPDATE finance_transactions SET description = ?, date = ?, amount = ?, type = ?, employee_id = ?, account_id = ? WHERE id = ?',
        [description, date, amount, type, employee_id, account_id, id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                db.query(
                    'SELECT * FROM finance_transactions WHERE id = ?',
                    [id],
                    async (result, error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json(error);
                        } else {
                            const finance_transaction = result.rows[0];
                            res.status(201).json(finance_transaction);
                        }
                    }
                )
            }
        }
    );
}

function financeTransactionsDeleteRouter(req, res) {
    console.log('financeTransactionsDeleteRouter');
    const { id } = req.params;
    db.query(
        'DELETE FROM finance_transactions WHERE id = ?',
        [id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                res.status(201).json({ id });
            }
        }
    );
}

module.exports = {
    financeTransactionsGetAllRouter,
    financeTransactionsGetRouter,
    financeTransactionsPostRouter,
    financeTransactionsPutRouter,
    financeTransactionsDeleteRouter
}
