const db = require('../db');

function financeAccountsGetAllRouter(req, res) {
    console.log('financeAccountsGetAllRouter');
    const { company_id } = req.params;
    db.query(`
        SELECT * FROM finance_accounts
        WHERE finance_accounts.company_id = ?
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

function financeAccountGetRouter(req, res) {
    console.log('financeAccountGetRouter');
    const { company_id, id } = req.params;
    db.query(`
        SELECT * FROM finance_accounts
        WHERE company_id = ? AND id = ?
    `,
    [company_id, id],
    async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            const finance_account = result.rows[0];
            res.json(finance_account);
        }
    })
}

function financeAccountsPostRouter(req, res) {
    console.log('financeAccountsPostRouter');
    const { company_id, name, description } = req.body;
    db.query(
        'INSERT INTO finance_accounts (company_id, name, description) VALUES (?, ?, ?) RETURNING *',
        [company_id, name, description],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                const finance_account = result.rows[0];
                res.status(201).json(finance_account);
            }
        }
    );
}

function financeAccountsPutRouter(req, res) {
    console.log('financeAccountsPutRouter');
    const { id, name, description } = req.body;
    db.query(
        'UPDATE finance_accounts SET name = ?, description = ? WHERE id = ?',
        [name, description, id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                db.query(
                    'SELECT * FROM finance_accounts WHERE id = ?',
                    [id],
                    async (result, error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json(error);
                        } else {
                            const finance_account = result.rows[0];
                            res.status(201).json(finance_account);
                        }
                    }
                )
            }
        }
    );
}

function financeAccountsDeleteRouter(req, res) {
    console.log('financeAccountsDeleteRouter');
    const { id } = req.params;
    db.query(
        'DELETE FROM finance_accounts WHERE id = ?',
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
    financeAccountsGetAllRouter,
    financeAccountGetRouter,
    financeAccountsPostRouter,
    financeAccountsPutRouter,
    financeAccountsDeleteRouter
};