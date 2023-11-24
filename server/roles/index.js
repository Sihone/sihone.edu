const db = require('../db');

async function rolesGetRouter(req, res) {
    console.log('rolesGetRouter');
    const { company_id } = req.params;
    try {
        const result = await db.query('SELECT * FROM roles WHERE company_id = $1', [company_id]);
        const roles = result.rows;
        res.json(roles);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function roleGetRouter(req, res) {
    console.log('roleGetRouter');
    const { company_id, id } = req.params;
    try {
        const result = await db.query('SELECT * FROM roles WHERE company_id = $1 AND id = $2', [company_id, id]);
        const role = result.rows[0];
        res.json(role);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function rolesPostRouter(req, res) {
    console.log('rolesPostRouter');
    const { company_id, name, description } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO roles (company_id, name, description) VALUES ($1, $2, $3) RETURNING *',
            [company_id, name, description]
        );
        const role = result.rows[0];
        res.status(201).json(role);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function rolesPutRouter(req, res) {
    console.log('rolesPutRouter');
    const { id, name, description } = req.body;
    try {
        const result = await db.query(
            'UPDATE roles SET name = $1, description = $2 WHERE id = $3 RETURNING *',
            [name, description, id]
        );
        const role = result.rows[0];
        res.status(201).json(role);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function rolesDeleteRouter(req, res) {
    console.log('rolesDeleteRouter');
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM roles WHERE id = $1 RETURNING *', [id]);
        const role = result.rows[0];
        res.status(201).json(role);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {
    rolesGetRouter,
    roleGetRouter,
    rolesPostRouter,
    rolesPutRouter,
    rolesDeleteRouter,
};