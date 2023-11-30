const db = require('../db');

function academicCycleGetAllRouter(req, res) {
    console.log('academicCycleGetAllRouter');
    const { company_id } = req.params;
    db.query(
        'SELECT * FROM academic_cycles WHERE company_id = ?',
        [company_id],
        async (result, err) => {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.status(200).json(result.rows);
            }
        }
    )
}

function academicCycleGetRouter(req, res) {
    console.log('academicCycleGetRouter');
    const { company_id, id } = req.params;
    db.query(
        'SELECT * FROM academic_cycles WHERE company_id = ? AND id = ?',
        [company_id, id],
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

function academicCyclePostRouter(req, res) {
    console.log('academicCyclePostRouter');
    const { company_id, long_name_en, short_name_en, long_name_fr, short_name_fr } = req.body;
    db.query(
        'INSERT INTO academic_cycles (company_id, long_name_en, short_name_en, long_name_fr, short_name_fr) VALUES (?, ?, ?, ?, ?) RETURNING *',
        [company_id, long_name_en, short_name_en, long_name_fr, short_name_fr],
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

function academicCyclePutRouter(req, res) {
    console.log('academicCyclePutRouter');
    const { id, long_name_en, short_name_en, long_name_fr, short_name_fr } = req.body;
    db.query(
        'UPDATE academic_cycles SET long_name_en = ?, short_name_en = ?, long_name_fr = ?, short_name_fr = ? WHERE id = ?',
        [long_name_en, short_name_en, long_name_fr, short_name_fr, id],
        async (result, err) => {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                db.query(
                    'SELECT * FROM academic_cycles WHERE id = ?',
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

function academicCycleDeleteRouter(req, res) {
    console.log('academicCycleDeleteRouter');
    const { id } = req.params;
    db.query(
        'DELETE FROM academic_cycles WHERE id = ? RETURNING *',
        [id],
        async (result, err) => {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.status(201).json({id});
            }
        }
    )
}

module.exports = {
    academicCycleGetAllRouter,
    academicCycleGetRouter,
    academicCyclePostRouter,
    academicCyclePutRouter,
    academicCycleDeleteRouter
};