const db = require('../db');

function tuitionPostRouter(req, res) {
  console.log('tuitionPostRouter');
  const { student_id, company_id, academic_year_id } = req.body;
  console.log({
    student_id,
    company_id,
    academic_year_id
  })
  db.query(
    'INSERT INTO tuition (student_id, academic_year_id, company_id) VALUES (?, ?, ?)',
    [student_id, academic_year_id, company_id],
    async (result, error) => {
      if (error) {
        console.log(error);
        res.status(500).json(error);
      } else {
        res.status(201).json();
      }
    }
  );
}

function tuitionGetAllRouter(req, res) {
    console.log('tuitionGetRouter');
    const { company_id } = req.params;
    db.query(`
        SELECT *, tuition.id AS id, academic_years.name AS ay_name, tuition.status AS status, students.status AS student_status, tuition.student_id AS student_id, students.student_id AS studentId, tuition.academic_year_id AS academic_year_id, students.academic_year_id AS student_academic_year_id FROM tuition
        LEFT JOIN students ON tuition.student_id = students.id
        LEFT JOIN academic_years ON tuition.academic_year_id = academic_years.id
        LEFT JOIN academic_programs ON students.program_id = academic_programs.id
        LEFT JOIN academic_cycles ON academic_programs.cycle_id = academic_cycles.id
        WHERE tuition.company_id = ?
        ORDER BY students.first_name ASC, students.last_name ASC, academic_years.name DESC
    `,
    [company_id],
    async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            res.json(result.rows.map(row => delete row.password && row));
        }
    })
}

function tuitionGetRouter(req, res) {
    console.log('tuitionGetRouter');
    const { company_id, id } = req.params;
    db.query(`
        SELECT *, tuition.id AS id, academic_years.name AS ay_name, tuition.status AS status, students.status AS student_status, tuition.student_id AS student_id, students.student_id AS studentId, tuition.academic_year_id AS academic_year_id, students.academic_year_id AS student_academic_year_id FROM tuition
        LEFT JOIN students ON tuition.student_id = students.id
        LEFT JOIN academic_years ON tuition.academic_year_id = academic_years.id
        LEFT JOIN academic_programs ON students.program_id = academic_programs.id
        LEFT JOIN academic_cycles ON academic_programs.cycle_id = academic_cycles.id
        WHERE tuition.company_id = ? AND tuition.id = ?
    `,
    [company_id, id],
    async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            const tuition = result.rows[0];
            res.json(tuition);
        }
    })
}

function tuitionPutRouter(req, res) {
    console.log('tuitionPutRouter');
    const { id, rebate } = req.body;
    db.query(
        'UPDATE tuition SET rebate = ? WHERE id = ?',
        [rebate, id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                db.query(
                    `
                        SELECT *, tuition.id AS id, academic_years.name AS ay_name, tuition.status AS status, students.status AS student_status, tuition.student_id AS student_id, students.student_id AS studentId, tuition.academic_year_id, students.academic_year_id AS student_academic_year_id FROM tuition
                        LEFT JOIN students ON tuition.student_id = students.id
                        LEFT JOIN academic_years ON tuition.academic_year_id = academic_years.id
                        LEFT JOIN academic_programs ON students.program_id = academic_programs.id
                        LEFT JOIN academic_cycles ON academic_programs.cycle_id = academic_cycles.id
                        WHERE tuition.id = ?
                    `,
                    [id],
                    async (result, error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json(error);
                        } else {
                            const tuition = result.rows[0];
                            res.status(201).json(tuition);
                        }
                    }
                )
            }
        }
    )
}

module.exports = {
    tuitionPostRouter,
    tuitionGetAllRouter,
    tuitionGetRouter,
    tuitionPutRouter
};
