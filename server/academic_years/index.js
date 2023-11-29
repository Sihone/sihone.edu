const db = require('../db');

async function academicYearsGetAllRouter(req, res) {
    console.log('academicYearsGetAllRouter');
    const { company_id } = req.params;
    try {
        const result = await db.query(`
            SELECT academic_years.id AS id, name, start_date, end_date, grade_total, current_academic_year FROM academic_years
            LEFT JOIN settings ON company_id = settings.id
            WHERE company_id = $1`, [company_id]);
        const academic_years = result.rows;
        res.json(academic_years);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicYearGetRouter(req, res) {
    console.log('academicYearGetRouter');
    const { company_id, id } = req.params;
    try {
        const result = await db.query( `
            SELECT academic_years.id AS id, name, start_date, end_date, grade_total, current_academic_year FROM academic_years
            LEFT JOIN settings ON company_id = settings.id
            WHERE company_id = $1 AND id = $2`, [company_id, id]);
        const academic_year = result.rows[0];
        res.json(academic_year);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicYearsPostRouter(req, res) {
    console.log('academicYearsPostRouter');
    const { company_id, name, start_date, end_date, grade_total, active } = req.body;
    try {
        const result = await db.query(
            `
            INSERT INTO academic_years (company_id, name, start_date, end_date, grade_total) VALUES ($1, $2, $3, $4, $5) RETURNING *
            `,
            [company_id, name, start_date, end_date, grade_total]
        );
        const academic_year = result.rows[0];

        const result2 = active ? await db.query(
            'UPDATE settings SET current_academic_year = $1 WHERE id = $2 RETURNING *',
            [academic_year.id, company_id]
        ) : await db.query(
            'UPDATE settings SET current_academic_year = NULL WHERE id = $1 RETURNING *',
            [company_id]
        );
        res.status(201).json({...academic_year, current_academic_year: result2.rows[0].current_academic_year});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicYearsPutRouter(req, res) {
    console.log('academicYearsPutRouter');
    const { id, name, start_date, end_date, grade_total, active, company_id } = req.body;
    try {
        const result = await db.query(
            `
            UPDATE academic_years SET name = $1, start_date = $2, end_date = $3, grade_total = $4 WHERE id = $5 RETURNING *
            `,
            [name, start_date, end_date, grade_total, id]
        );
        const academic_year = result.rows[0];

        const result2 = await db.query(
            'UPDATE settings SET current_academic_year = $1 WHERE id = $2 RETURNING *',
            [active ? academic_year.id : null, company_id]
        );
        res.status(201).json({...academic_year, current_academic_year: result2.rows[0].current_academic_year});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function academicYearsDeleteRouter(req, res) {
    console.log('academicYearsDeleteRouter');
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM academic_years WHERE id = $1 RETURNING *', [id]);
        const academic_year = result.rows[0];
        res.status(201).json(academic_year);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {
    academicYearsGetAllRouter,
    academicYearGetRouter,
    academicYearsPostRouter,
    academicYearsPutRouter,
    academicYearsDeleteRouter
}