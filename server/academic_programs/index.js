const db = require('../db');

async function academicProgramGetAllRouter(req, res) {
    console.log('academicProgramGetAllRouter');
    const { company_id } = req.params;
    try {
        const result = await db.query(`
            SELECT *, academic_programs.id AS id FROM academic_programs
            LEFT JOIN academic_cycles ON academic_programs.cycle_id = academic_cycles.id
            WHERE academic_programs.company_id = $1
        `, [company_id]);
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicProgramGetRouter(req, res) {
    console.log('academicProgramGetRouter');
    const { company_id, id } = req.params;
    try {
        const result = await db.query(`
            SELECT *, academic_programs.id AS id FROM academic_programs
            LEFT JOIN academic_cycles ON academic_programs.cycle_id = academic_cycles.id
            WHERE academic_programs.company_id = $1 AND id = $2
        `, [company_id, id]);
        const academic_program = result.rows[0];
        res.json(academic_program);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicProgramPostRouter(req, res) {
    console.log('academicProgramPostRouter');
    const { company_id, name_en, name_fr, cycle_id, price, employee_id } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO academic_programs (company_id, name_en, name_fr, cycle_id, price, employee_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [company_id, name_en, name_fr, cycle_id, price, employee_id]
        );
        const academic_program = result.rows[0];
        res.status(201).json(academic_program);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicProgramPutRouter(req, res) {
    console.log('academicProgramPutRouter');
    const { id, name_en, name_fr, cycle_id, price, employee_id } = req.body;
    try {
        const result = await db.query(
            'UPDATE academic_programs SET name_en = $1, name_fr = $2, cycle_id = $3, price = $4, employee_id = $5 WHERE id = $6 RETURNING *',
            [name_en, name_fr, cycle_id, price, employee_id, id]
        );
        const academic_program = result.rows[0];
        res.status(201).json(academic_program);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicProgramDeleteRouter(req, res) {
    console.log('academicProgramDeleteRouter');
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM academic_programs WHERE id = $1 RETURNING *', [id]);
        const academic_program = result.rows[0];
        res.json(academic_program);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {
    academicProgramGetAllRouter,
    academicProgramGetRouter,
    academicProgramPostRouter,
    academicProgramPutRouter,
    academicProgramDeleteRouter
};