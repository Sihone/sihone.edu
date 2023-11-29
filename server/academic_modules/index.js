const db = require('../db');

async function academicModuleGetAllRouter(req, res) {
    console.log('academicModuleGetAllRouter');
    const { company_id } = req.params;
    try {
        const result = await db.query(`
            SELECT * FROM academic_modules
            WHERE academic_modules.company_id = $1
        `, [company_id]);
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicModuleGetRouter(req, res) {
    console.log('academicModuleGetRouter');
    const { company_id, id } = req.params;
    try {
        const result = await db.query(`
            SELECT * FROM academic_modules
            WHERE company_id = $1 AND id = $2
        `, [company_id, id]);
        const academic_module = result.rows[0];
        res.json(academic_module);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicModulePostRouter(req, res) {
    console.log('academicModulePostRouter');
    const { company_id, name_en, name_fr, course_ids, description, coefficient, employee_id } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO academic_modules (company_id, name_en, name_fr, course_ids, description, coefficient, employee_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [company_id, name_en, name_fr, course_ids, description, coefficient, employee_id]
        );
        const academic_module = result.rows[0];
        res.status(201).json(academic_module);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicModulePutRouter(req, res) {
    console.log('academicModulePutRouter');
    const { id, name_en, name_fr, course_ids, description, employee_id, coefficient } = req.body;
    try {
        const result = await db.query(
            'UPDATE academic_modules SET name_en = $1, name_fr = $2, course_ids = $3, description = $4, employee_id = $5, coefficient = $6 WHERE id = $7 RETURNING *',
            [name_en, name_fr, course_ids, description, employee_id, coefficient, id]
        );
        const academic_module = result.rows[0];
        res.status(201).json(academic_module);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicModuleDeleteRouter(req, res) {
    console.log('academicModuleDeleteRouter');
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM academic_modules WHERE id = $1 RETURNING *', [id]);
        const academic_module = result.rows[0];
        res.json(academic_module);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {
    academicModuleGetAllRouter,
    academicModuleGetRouter,
    academicModulePostRouter,
    academicModulePutRouter,
    academicModuleDeleteRouter
};