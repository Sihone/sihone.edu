const db = require('../db');

function academicProgramGetAllRouter(req, res) {
    console.log('academicProgramGetAllRouter');
    const { company_id } = req.params;
    db.query(`
        SELECT *, academic_programs.id AS id FROM academic_programs
        LEFT JOIN academic_cycles ON academic_programs.cycle_id = academic_cycles.id
        WHERE academic_programs.company_id = ?
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

function academicProgramGetRouter(req, res) {
    console.log('academicProgramGetRouter');
    const { company_id, id } = req.params;
    db.query(`
        SELECT *, academic_programs.id AS id FROM academic_programs
        LEFT JOIN academic_cycles ON academic_programs.cycle_id = academic_cycles.id
        WHERE academic_programs.company_id = ? AND id = ?
    `,
    [company_id, id],
    async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            const academic_program = result.rows[0];
            res.json(academic_program);
        }
    })
}

function academicProgramPostRouter(req, res) {
    console.log('academicProgramPostRouter');
    const { company_id, name_en, name_fr, cycle_id, price, employee_id } = req.body;
    db.query(
        'INSERT INTO academic_programs (company_id, name_en, name_fr, cycle_id, price, employee_id) VALUES (?, ?, ?, ?, ?, ?) RETURNING *',
        [company_id, name_en, name_fr, cycle_id, price, employee_id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                const academic_program = result.rows[0];
                res.status(201).json(academic_program);
            }
        }
    )
}

function academicProgramPutRouter(req, res) {
    console.log('academicProgramPutRouter');
    const { id, name_en, name_fr, cycle_id, price, employee_id } = req.body;
    db.query(
        'UPDATE academic_programs SET name_en = ?, name_fr = ?, cycle_id = ?, price = ?, employee_id = ? WHERE id = ?',
        [name_en, name_fr, cycle_id, price, employee_id, id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                db.query(
                    'SELECT * FROM academic_programs WHERE academic_programs.id = ?',
                    [id],
                    async (result, error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json(error);
                        } else {
                            const academic_program = result.rows[0];
                            res.status(201).json(academic_program);
                        }
                    }
                )
            }
        }
    )
}

function academicProgramDeleteRouter(req, res) {
    console.log('academicProgramDeleteRouter');
    const { id } = req.params;
    db.query(
        'DELETE FROM academic_programs WHERE id = ? RETURNING *',
        [id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                res.json({id});
            }
        }
    )
}

module.exports = {
    academicProgramGetAllRouter,
    academicProgramGetRouter,
    academicProgramPostRouter,
    academicProgramPutRouter,
    academicProgramDeleteRouter
};