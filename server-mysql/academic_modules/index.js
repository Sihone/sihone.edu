const db = require('../db');

function academicModuleGetAllRouter(req, res) {
    console.log('academicModuleGetAllRouter');
    const { company_id } = req.params;
    db.query(`
        SELECT * FROM academic_modules
        WHERE academic_modules.company_id = ?
    `,
    [company_id],
    async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            res.json(result.rows);
        }
    })
}

function academicModuleGetRouter(req, res) {
    console.log('academicModuleGetRouter');
    const { company_id, id } = req.params;
    db.query(`
        SELECT * FROM academic_modules
        WHERE company_id = ? AND id = ?
    `,
    [company_id, id],
    async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            const academic_module = result.rows[0];
            res.json(academic_module);
        }
    })
}

function academicModulePostRouter(req, res) {
    console.log('academicModulePostRouter');
    const { company_id, name_en, name_fr, course_ids, description, coefficient, employee_id } = req.body;
    db.query(
        'INSERT INTO academic_modules (company_id, name_en, name_fr, course_ids, description, coefficient, employee_id) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *',
        [company_id, name_en, name_fr, course_ids, description, coefficient, employee_id || null],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                const academic_module = result.rows[0];
                res.status(201).json(academic_module);
            }
        }
    )
}

function academicModulePutRouter(req, res) {
    console.log('academicModulePutRouter');
    const { id, name_en, name_fr, course_ids, description, employee_id, coefficient } = req.body;
    db.query(
        'UPDATE academic_modules SET name_en = ?, name_fr = ?, course_ids = ?, description = ?, employee_id = ?, coefficient = ? WHERE id = ?',
        [name_en, name_fr, course_ids, description, employee_id || null, coefficient, id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                db.query(
                    'SELECT * FROM academic_modules WHERE id = ?',
                    [id],
                    async (result, error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json(error);
                        } else {
                            const academic_module = result.rows[0];
                            res.status(201).json(academic_module);
                        }
                    }
                )
            }
        }
    )
}

function academicModuleDeleteRouter(req, res) {
    console.log('academicModuleDeleteRouter');
    const { id } = req.params;
    db.query(
        'DELETE FROM academic_modules WHERE id = ? RETURNING *',
        [id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                res.json({ id });
            }
        }
    )
}

module.exports = {
    academicModuleGetAllRouter,
    academicModuleGetRouter,
    academicModulePostRouter,
    academicModulePutRouter,
    academicModuleDeleteRouter
};