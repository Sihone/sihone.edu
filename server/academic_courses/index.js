const db = require('../db');

async function academicCourseGetAllRouter(req, res) {
    console.log('academicCourseGetAllRouter');
    const { company_id } = req.params;
    try {
        const result = await db.query(`
            SELECT * FROM academic_courses
            WHERE academic_courses.company_id = $1
        `, [company_id]);
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicCourseGetRouter(req, res) {
    console.log('academicCourseGetRouter');
    const { company_id, id } = req.params;
    try {
        const result = await db.query(`
            SELECT * FROM academic_courses
            WHERE company_id = $1 AND id = $2
        `, [company_id, id]);
        const academic_course = result.rows[0];
        res.json(academic_course);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicCoursePostRouter(req, res) {
    console.log('academicCoursePostRouter');
    const { company_id, name_en, name_fr, program_ids, description, coefficient, employee_id, exempted_academic_years } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO academic_courses (company_id, name_en, name_fr, program_ids, description, coefficient, employee_id, exempted_academic_years) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [company_id, name_en, name_fr, program_ids, description, coefficient, employee_id, exempted_academic_years]
        );
        const academic_course = result.rows[0];
        res.status(201).json(academic_course);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicCoursePutRouter(req, res) {
    console.log('academicCoursePutRouter');
    const { id, name_en, name_fr, program_ids, description, employee_id, coefficient, exempted_academic_years } = req.body;
    try {
        const result = await db.query(
            'UPDATE academic_courses SET name_en = $1, name_fr = $2, program_ids = $3, description = $4, employee_id = $5, coefficient = $6, exempted_academic_years = $7 WHERE id = $8 RETURNING *',
            [name_en, name_fr, program_ids, description, employee_id, coefficient, exempted_academic_years, id]
        );
        const academic_course = result.rows[0];
        res.status(201).json(academic_course);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicCourseDeleteRouter(req, res) {
    console.log('academicCourseDeleteRouter');
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM academic_courses WHERE id = $1 RETURNING *', [id]);
        const academic_course = result.rows[0];
        res.json(academic_course);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {
    academicCourseGetAllRouter,
    academicCourseGetRouter,
    academicCoursePostRouter,
    academicCoursePutRouter,
    academicCourseDeleteRouter
};