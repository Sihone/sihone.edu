const db = require('../db');

async function academicExamsGetAllRouter(req, res) {
    console.log('academicExamsGetAllRouter');
    const { company_id } = req.params;
    try {
        const result = await db.query(`
            SELECT * FROM academic_exams
            WHERE academic_exams.company_id = $1
        `, [company_id]);
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicExamsGetRouter(req, res) {
    console.log('academicExamsGetRouter');
    const { company_id, id } = req.params;
    try {
        const result = await db.query(`
            SELECT * FROM academic_exams
            WHERE company_id = $1 AND id = $2
        `, [company_id, id]);
        const academic_exam = result.rows[0];
        res.json(academic_exam);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicExamsPostRouter(req, res) {
    console.log('academicExamsPostRouter');
    const { company_id, name_en, name_fr, module_id, course_id, program_id, cycle_id, employee_id, date, duration, total_mark, academic_year_id } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO academic_exams (company_id, name_en, name_fr, module_id, course_id, program_id, cycle_id, employee_id, date, duration, total_mark, academic_year_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
            [company_id, name_en, name_fr, module_id, course_id, program_id, cycle_id, employee_id, date, duration, total_mark, academic_year_id]
        );
        const academic_exam = result.rows[0];
        res.status(201).json(academic_exam);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicExamsPutRouter(req, res) {
    console.log('academicExamsPutRouter');
    const { id, name_en, name_fr, module_id, course_id, program_id, cycle_id, employee_id, date, duration, total_mark, academic_year_id } = req.body;
    try {
        const result = await db.query(
            'UPDATE academic_exams SET name_en = $1, name_fr = $2, module_id = $3, course_id = $4, program_id = $5, cycle_id = $6, employee_id = $7, date = $8, duration = $9, total_mark = $10, academic_year_id = $11 WHERE id = $12 RETURNING *',
            [name_en, name_fr, module_id, course_id, program_id, cycle_id, employee_id, date, duration, total_mark, academic_year_id, id]
        );
        const academic_exam = result.rows[0];
        res.status(201).json(academic_exam);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicExamsDeleteRouter(req, res) {
    console.log('academicExamsDeleteRouter');
    const { id } = req.params;
    try {
        const result = await db.query(
            'DELETE FROM academic_exams WHERE id = $1 RETURNING *',
            [id]
        );
        const academic_exam = result.rows[0];
        res.status(201).json(academic_exam);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {
    academicExamsGetAllRouter,
    academicExamsGetRouter,
    academicExamsPostRouter,
    academicExamsPutRouter,
    academicExamsDeleteRouter
};