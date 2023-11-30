const db = require('../db');

function rolesGetRouter(req, res) {
    console.log('rolesGetRouter');
    const { company_id } = req.params;
    db.query('SELECT * FROM roles WHERE company_id = ?', [company_id], async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            res.json(result.rows);
        }
    });
}

function roleGetRouter(req, res) {
    console.log('roleGetRouter');
    const { company_id, id } = req.params;
    db.query('SELECT * FROM roles WHERE company_id = ? AND id = ?', [company_id, id], async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            const role = result.rows[0];
            res.json(role);
        }
    });
}

function rolesPostRouter(req, res) {
    console.log('rolesPostRouter');
    const { company_id, name, description, permissions } = req.body;
    db.query(
        'INSERT INTO roles (company_id, name, description, permissions) VALUES (?, ?, ?, ?) RETURNING *',
        [company_id, name, description, permissions],
        async (result, error) => {
            console.log({result, error});
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                const role = result.rows[0];
                res.status(201).json(role);
            }
        }
    );
}

function rolesPutRouter(req, res) {
    console.log('rolesPutRouter');
    const { id, name, description, permissions } = req.body;
    db.query(
        'UPDATE roles SET name = ?, description = ?, permissions = ? WHERE id = ?',
        [name, description, permissions, id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                db.query(
                    'SELECT * FROM roles WHERE id = ?',
                    [id],
                    async (result, error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json(error);
                        } else {
                            const role = result.rows[0];
                            res.status(201).json(role);
                        }
                    }
                )
            }
        }
    );
}

function rolesDeleteRouter(req, res) {
    console.log('rolesDeleteRouter');
    const { id } = req.params;
    db.query('DELETE FROM roles WHERE id = ?', [id], async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            res.status(201).json({id});
        }
    });
}

module.exports = {
    rolesGetRouter,
    roleGetRouter,
    rolesPostRouter,
    rolesPutRouter,
    rolesDeleteRouter,
};