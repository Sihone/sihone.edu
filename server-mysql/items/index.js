const db = require('../db');

function itemsGetAllRouter(req, res) {
    console.log('itemsGetAllRouter');
    const { company_id } = req.params;
    db.query('SELECT * FROM items WHERE company_id = ?', [company_id], async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            res.json(result.rows);
        }
    });
}

function itemGetRouter(req, res) {
    console.log('itemGetRouter');
    const { company_id, id } = req.params;
    db.query('SELECT * FROM items WHERE company_id = ? AND id = ?', [company_id, id], async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            const role = result.rows[0];
            res.json(role);
        }
    });
}

function itemsPostRouter(req, res) {
    console.log('itemsPostRouter');
    const { company_id, name, price } = req.body;
    db.query(
        'INSERT INTO items (company_id, name, price) VALUES (?, ?, ?) RETURNING *',
        [company_id, name, price],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                const item = result.rows[0];
                res.status(201).json(item);
            }
        }
    );
}

function itemsPutRouter(req, res) {
    console.log('itemsPutRouter');
    const { id, name, price } = req.body;
    db.query(
        'UPDATE items SET name = ?, price = ? WHERE id = ?',
        [name, price, id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                db.query(
                    'SELECT * FROM items WHERE items.id = ?',
                    [id],
                    async (result, error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json(error);
                        } else {
                            const item = result.rows[0];
                            res.status(201).json(item);
                        }
                    }
                )
            }
        }
    )
}

function itemsDeleteRouter(req, res) {
    console.log('itemsDeleteRouter');
    const { id } = req.params;
    db.query(
        'DELETE FROM items WHERE id = ?',
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
    itemsGetAllRouter,
    itemGetRouter,
    itemsPostRouter,
    itemsPutRouter,
    itemsDeleteRouter
};