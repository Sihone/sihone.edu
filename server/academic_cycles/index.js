const db = require('../db');

async function academicCycleGetAllRouter(req, res) {
    console.log('academicCycleGetAllRouter');
    const { company_id } = req.params;
    try {
        const result = await db.query(`
            SELECT * FROM academic_cycles
            WHERE academic_cycles.company_id = $1
        `, [company_id]);
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicCycleGetRouter(req, res) {
    console.log('academicCycleGetRouter');
    const { company_id, id } = req.params;
    try {
        const result = await db.query(`
            SELECT * FROM academic_cycles
            WHERE company_id = $1 AND id = $2
        `, [company_id, id]);
        const academic_cycle = result.rows[0];
        res.json(academic_cycle);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicCyclePostRouter(req, res) {
    console.log('academicCyclePostRouter');
    const { company_id, long_name_en, short_name_en, long_name_fr, short_name_fr } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO academic_cycles (company_id, long_name_en, short_name_en, long_name_fr, short_name_fr) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [company_id, long_name_en, short_name_en, long_name_fr, short_name_fr]
        );
        const academic_cycle = result.rows[0];
        res.status(201).json(academic_cycle);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicCyclePutRouter(req, res) {
    console.log('academicCyclePutRouter');
    const { id, long_name_en, short_name_en, long_name_fr, short_name_fr } = req.body;
    try {
        const result = await db.query(
            'UPDATE academic_cycles SET long_name_en = $1, short_name_en = $2, long_name_fr = $3, short_name_fr = $4 WHERE id = $5 RETURNING *',
            [long_name_en, short_name_en, long_name_fr, short_name_fr, id]
        );
        const academic_cycle = result.rows[0];
        res.status(201).json(academic_cycle);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicCycleDeleteRouter(req, res) {
    console.log('academicCycleDeleteRouter');
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM academic_cycles WHERE id = $1 RETURNING *', [id]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {
    academicCycleGetAllRouter,
    academicCycleGetRouter,
    academicCyclePostRouter,
    academicCyclePutRouter,
    academicCycleDeleteRouter
};