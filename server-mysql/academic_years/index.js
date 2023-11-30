const db = require('../db');

function academicYearsGetAllRouter(req, res) {
    console.log('academicYearsGetAllRouter');
    const { company_id } = req.params;
    db.query(`
        SELECT academic_years.id AS id, name, start_date, end_date, grade_total, current_academic_year FROM academic_years
        LEFT JOIN settings ON company_id = settings.id
        WHERE company_id = ?
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

function academicYearGetRouter(req, res) {
    console.log('academicYearGetRouter');
    const { company_id, id } = req.params;
    db.query(`
        SELECT academic_years.id AS id, name, start_date, end_date, grade_total, current_academic_year FROM academic_years
        LEFT JOIN settings ON company_id = settings.id
        WHERE company_id = ? AND id = ?
    `,
    [company_id, id],
    async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            const academic_year = result.rows[0];
            res.json(academic_year);
        }
    })
}

function academicYearsPostRouter(req, res) {
    console.log('academicYearsPostRouter');
    const { company_id, name, start_date, end_date, grade_total, active } = req.body;
    db.query(
        'INSERT INTO academic_years (company_id, name, start_date, end_date, grade_total) VALUES (?, ?, ?, ?, ?) RETURNING *',
        [company_id, name, start_date, end_date, grade_total],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                const academic_year = result.rows[0];

                active ? db.query(
                    'UPDATE settings SET current_academic_year = ? WHERE id = ?',
                    [academic_year.id, company_id],
                    async (result, error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json(error);
                        } else {
                            res.status(201).json({...academic_year, current_academic_year: academic_year.id});
                        }
                    }
                ) : db.query(
                    'SELECT * FROM settings WHERE id = ?',
                    [company_id],
                    async (result, error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json(error);
                        } else {
                            res.status(201).json({...academic_year, current_academic_year: result.rows[0].current_academic_year});
                        }
                    }
                );
            }
        }
    )
}

function academicYearsPutRouter(req, res) {
    console.log('academicYearsPutRouter');
    const { id, name, start_date, end_date, grade_total, active, company_id } = req.body;
    db.query(
        'UPDATE academic_years SET name = ?, start_date = ?, end_date = ?, grade_total = ? WHERE id = ?',
        [name, start_date, end_date, grade_total, id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                active ? db.query(
                    'UPDATE settings SET current_academic_year = ? WHERE id = ?',
                    [id, company_id],
                    async (result, error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json(error);
                        } else {
                            db.query(
                                'SELECT * FROM academic_years WHERE id = ?',
                                [id],
                                async (result2, error) => {
                                    if (error) {
                                        console.log(error);
                                        res.status(500).json(error);
                                    } else {
                                        res.status(201).json({...result2.rows[0], current_academic_year: id});
                                    }
                                }
                            );
                        }
                    }
                ) : db.query(
                    'SELECT * FROM academic_years WHERE id = ?',
                    [id],
                    async (result2, error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json(error);
                        } else {
                            res.status(201).json(result2.rows[0]);
                        }
                    }
                );    
            }
        }
    )
}

function academicYearsDeleteRouter(req, res) {
    console.log('academicYearsDeleteRouter');
    const { id } = req.params;
    db.query(
        'DELETE FROM academic_years WHERE id = ? RETURNING *',
        [id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                const academic_year = result.rows[0];
                res.status(201).json(academic_year);
            }
        }
    )
}

module.exports = {
    academicYearsGetAllRouter,
    academicYearGetRouter,
    academicYearsPostRouter,
    academicYearsPutRouter,
    academicYearsDeleteRouter
}