const db = require('../db');

function tuitionItemsGetAllRouter(req, res) {
    console.log('tuitionItemsGetAllRouter');
    const { company_id } = req.params;
    db.query(`
        SELECT *, tuition_items.id AS id FROM tuition_items
        LEFT JOIN items ON tuition_items.item_id = items.id
        WHERE items.company_id = ?
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

function tuitionItemsGetRouter(req, res) {
    console.log('tuitionItemsGetRouter');
    const { company_id, id } = req.params;
    db.query(`
        SELECT *, tuition_items.id AS id FROM tuition_items
        LEFT JOIN items ON tuition_items.item_id = items.id
        WHERE items.company_id = ? AND tuition_items.id = ?
    `,
    [company_id, id],
    async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            const tuitionItem = result.rows[0];
            res.json(tuitionItem);
        }
    })
}

function tuitionItemsPostRouter(req, res) {
    console.log('tuitionItemsPostRouter');
    const { item_id, tuition_id } = req.body;
    db.query(
        'INSERT INTO tuition_items (item_id, tuition_id) VALUES (?, ?) RETURNING *',
        [item_id, tuition_id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                db.query(
                    'SELECT *, tuition_items.id AS id FROM tuition_items LEFT JOIN items ON tuition_items.item_id = items.id WHERE tuition_items.id = ?',
                    [result.rows[0].id],
                    async (result, error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json(error);
                        } else {
                            const tuitionItem = result.rows[0];
                            res.status(201).json(tuitionItem);
                        }
                    }
                )
            }
        }
    )
}

function tuitionItemsDeleteRouter(req, res) {
    console.log('tuitionItemsDeleteRouter');
    const { id } = req.params;
    db.query(
        'DELETE FROM tuition_items WHERE id = ?',
        [id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                res.status(201).json({ id });
            }
        }
    )
}

module.exports = {
    tuitionItemsGetAllRouter,
    tuitionItemsGetRouter,
    tuitionItemsPostRouter,
    tuitionItemsDeleteRouter
}