const db = require('../db');

function academicCourseGetAllRouter(req, res) {
    console.log('academicCourseGetAllRouter');
    const { company_id } = req.params;
    db.query(
        'SELECT * FROM academic_courses WHERE company_id = ?',
        [company_id],
        async (result, err) => {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.json(result.rows);
            }
        }
    )
}

function academicCourseGetRouter(req, res) {
    console.log('academicCourseGetRouter');
    const { company_id, id } = req.params;
    db.query(
        'SELECT * FROM academic_courses WHERE company_id = ? AND id = ?',
        [company_id, id],
        async (result, err) => {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.json(result.rows[0]);
            }
        }
    )
}

function academicCoursePostRouter(req, res) {
    console.log('academicCoursePostRouter');
    const { company_id, name_en, name_fr, program_ids, description, coefficient, employee_id, exempted_academic_years, semester, semester_per_year } = req.body;
    db.query(
        'INSERT INTO academic_courses (company_id, name_en, name_fr, program_ids, description, coefficient, employee_id, exempted_academic_years, semester, semester_per_year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *',
        [company_id, name_en, name_fr, program_ids, description, coefficient, employee_id || null, exempted_academic_years, semester, semester_per_year],
        async (result, err) => {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.status(201).json(result.rows[0]);
            }
        }
    )
}

function academicCoursePutRouter(req, res) {
    console.log('academicCoursePutRouter');
    const { id, name_en, name_fr, program_ids, description, employee_id, coefficient, exempted_academic_years, semester, semester_per_year } = req.body;
    db.query(
        'UPDATE academic_courses SET name_en = ?, name_fr = ?, program_ids = ?, description = ?, employee_id = ?, coefficient = ?, exempted_academic_years = ?, semester = ?, semester_per_year = ? WHERE id = ?',
        [name_en, name_fr, program_ids, description, employee_id || null, coefficient, exempted_academic_years, semester, semester_per_year, id],
        async (result, err) => {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                db.query(
                    'SELECT * FROM academic_courses WHERE id = ?',
                    [id],
                    async (result, err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json(err);
                        } else {
                            res.status(201).json(result.rows[0]);
                        }
                    }
                )
            }
        }
    )
}

function academicCourseDeleteRouter(req, res) {
    console.log('academicCourseDeleteRouter');
    const { id } = req.params;
    db.query(
        'DELETE FROM academic_courses WHERE id = ?',
        [id],
        async (result, err) => {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.status(201).json({ id });
            }
        }
    )
}

module.exports = {
    academicCourseGetAllRouter,
    academicCourseGetRouter,
    academicCoursePostRouter,
    academicCoursePutRouter,
    academicCourseDeleteRouter
};