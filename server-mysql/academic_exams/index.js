const db = require('../db');

function academicExamsGetAllRouter(req, res) {
    console.log('academicExamsGetAllRouter');
    const { company_id } = req.params;
    db.query(`
        SELECT * FROM academic_exams
        WHERE academic_exams.company_id = ?
    `, [company_id],
        (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                res.status(201).json(result.rows);
            }
        }
    );
}

function academicExamsGetRouter(req, res) {
    console.log('academicExamsGetRouter');
    const { company_id, id } = req.params;
    db.query(`
        SELECT * FROM academic_exams
        WHERE company_id = ? AND academic_year_id = ?
    `, [company_id, id],
        (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                res.status(201).json(result.rows);
            }
        }
    );
}

function academicExamsPostRouter(req, res) {
    console.log('academicExamsPostRouter');
    const { company_id, name_en, name_fr, module_id, course_id, program_id, cycle_id, employee_id, date, duration, total_mark, academic_year_id } = req.body;
    db.query(
        `INSERT INTO academic_exams (company_id, name_en, name_fr, module_id, course_id, program_id, cycle_id, employee_id, date, duration, total_mark, academic_year_id) VALUES
            (
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?
            ) RETURNING *`,
        [company_id, name_en, name_fr, module_id, course_id, program_id, cycle_id, employee_id, date, duration, total_mark, academic_year_id],
        (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                const academic_exam = result.rows[0];
                res.status(201).json(academic_exam);
            }
        }
    );
}

function academicExamsPutRouter(req, res) {
    console.log('academicExamsPutRouter');
    const { id, name_en, name_fr, module_id, course_id, program_id, cycle_id, employee_id, date, duration, total_mark, academic_year_id, grades } = req.body;
    db.query(
        `UPDATE academic_exams SET
            name_en = ?, name_fr = ?, module_id = ?, course_id = ?, program_id = ?, cycle_id = ?,
            employee_id = ?, date = ?, duration = ?, total_mark = ?, academic_year_id = ?, grades = ?
        WHERE id = ?`,
        [name_en, name_fr, module_id, course_id, program_id, cycle_id, employee_id, date, duration, total_mark, academic_year_id, grades, id],
        (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                db.query(
                    'SELECT * FROM academic_exams WHERE id = ?',
                    [id],
                    (result, error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json(error);
                        } else {
                            const academic_exam = result.rows[0];
                            res.status(201).json(academic_exam);
                        }
                    }
                );
            }
        }
    );
}

function academicExamsDeleteRouter(req, res) {
    console.log('academicExamsDeleteRouter');
    const { id } = req.params;
    db.query(
        'DELETE FROM academic_exams WHERE id = ? RETURNING *',
        [id],
        (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                res.status(201).json({ id });
            }
        }
    );
}
        
module.exports = {
    academicExamsGetAllRouter,
    academicExamsGetRouter,
    academicExamsPostRouter,
    academicExamsPutRouter,
    academicExamsDeleteRouter
};