const db = require('../db');

function attendanceGetAllRouter(req, res) {
    console.log('attendanceGetAllRouter');
    const { company_id } = req.params;
    db.query(`
        SELECT *, employee_attendance.id AS id, employees.id AS employees_id FROM employee_attendance
        LEFT JOIN employees ON employee_attendance.employee_id = employees.id
        WHERE employee_attendance.company_id = ?
        ORDER BY employee_attendance.id DESC
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

function attendanceGetRouter(req, res) {
    console.log('attendanceGetRouter');
    const { company_id, id } = req.params;
    db.query(`
        SELECT *, employee_attendance.id AS id, employees.id AS employees_id FROM employee_attendance
        LEFT JOIN employees ON employee_attendance.employee_id = employees.id
        WHERE company_id = ? AND employee_attendance.id = ?
    `,
    [company_id, id],
    async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            res.json(result.rows[0]);
        }
    })
}

function attendancePostRouter(req, res) {
    console.log('attendancePostRouter');
    const { company_id, employee_id, attendance_date, clock_in, clock_out } = req.body;
    const total_time = clock_out ? toSeconds(clock_out) - toSeconds(clock_in) : 0;
    db.query('INSERT INTO employee_attendance (company_id, employee_id, attendance_date, clock_in, clock_out, total_time) VALUES (?, ?, ?, ?, ?, ?) RETURNING *',
        [company_id, employee_id, attendance_date, clock_in, clock_out, total_time],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                db.query(
                    'SELECT *, employee_attendance.id AS id, employees.id AS employees_id FROM employee_attendance LEFT JOIN employees ON employee_attendance.employee_id = employees.id WHERE employee_attendance.id = ?',
                    [result.rows[0].id],
                    async (result2, error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json(error);
                        } else {
                            const attendance = result2.rows[0];
                            res.status(201).json(attendance);
                        }
                    }
                )
            }
        }
    )
}

function attendancePutRouter(req, res) {
    console.log('attendancePutRouter');
    const { id, employee_id, attendance_date, clock_in, clock_out } = req.body;
    const total_time = clock_out ? toSeconds(clock_out) - toSeconds(clock_in) : 0;
    db.query('UPDATE employee_attendance SET employee_id = ?, attendance_date = ?, clock_in = ?, clock_out = ?, total_time = ? WHERE id = ?',
        [employee_id, attendance_date, clock_in, clock_out, total_time, id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                db.query(
                    'SELECT *, employee_attendance.id AS id, employees.id AS employees_id FROM employee_attendance LEFT JOIN employees ON employee_attendance.employee_id = employees.id WHERE employee_attendance.id = ?',
                    [id],
                    async (result2, error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json(error);
                        } else {
                            const attendance = result2.rows[0];
                            res.status(201).json(attendance);
                        }
                    }
                )
            }
        }
    )
}

function attendanceDeleteRouter(req, res) {
    console.log('attendanceDeleteRouter');
    const { id } = req.params;
    db.query('DELETE FROM employee_attendance WHERE id = ?', [id], async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            res.status(201).json({ id });
        }
    })
}

function toSeconds(time_str) {
    // Extract hours, minutes and seconds
    var parts = time_str.split(':');
    // compute  and return total seconds
    return Number(parts[0]) * 3600 + // an hour has 3600 seconds
            Number(parts[1]) * 60;   // a minute has 60 seconds
}

module.exports = {
    attendanceGetAllRouter,
    attendanceGetRouter,
    attendancePostRouter,
    attendancePutRouter,
    attendanceDeleteRouter
};