const db = require('../db');

async function attendanceGetAllRouter(req, res) {
    console.log('attendanceGetAllRouter');
    const { company_id } = req.params;
    try {
        const result = await db.query(`
            SELECT *, employee_attendance.id AS id, employees.id AS employees_id FROM employee_attendance
            LEFT JOIN employees ON employee_attendance.employee_id = employees.id
            WHERE employee_attendance.company_id = $1
        `, [company_id]);
        const attendance = result.rows;
        res.json(attendance);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function attendanceGetRouter(req, res) {
    console.log('attendanceGetRouter');
    const { company_id, id } = req.params;
    try {
        const result = await db.query(`
            SELECT *, employee_attendance.id AS id, employees.id AS employees_id FROM employee_attendance
            LEFT JOIN employees ON employee_attendance.employee_id = employees.id
            WHERE company_id = $1 AND employee_attendance.id = $2
        `, [company_id, id]);
        const attendance = result.rows[0];
        res.json(attendance);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function attendancePostRouter(req, res) {
    console.log('attendancePostRouter');
    const { company_id, employee_id, attendance_date, clock_in, clock_out } = req.body;
    const total_time = clock_out ? toSeconds(clock_out) - toSeconds(clock_in) : 0;

    try {
        const result = await db.query(
            `
            WITH attendance AS (
                INSERT INTO employee_attendance (company_id, employee_id, attendance_date, clock_in, clock_out, total_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
            ) SELECT *, attendance.id AS id, employees.id AS employees_id FROM attendance
            LEFT JOIN employees ON attendance.employee_id = employees.id
            `,
            [company_id, employee_id, attendance_date, clock_in, clock_out, total_time]
        );
        const attendance = result.rows[0];
        res.status(201).json(attendance);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function attendancePutRouter(req, res) {
    console.log('attendancePutRouter');
    const { id, employee_id, attendance_date, clock_in, clock_out } = req.body;
    const total_time = clock_out ? toSeconds(clock_out) - toSeconds(clock_in) : 0;
    try {
        const result = await db.query(
            `
            WITH attendance AS (
                UPDATE employee_attendance SET employee_id = $1, attendance_date = $2, clock_in = $3, clock_out = $4, total_time = $5 WHERE id = $6 RETURNING *
            ) SELECT *, attendance.id AS id, employees.id AS employees_id FROM attendance
            LEFT JOIN employees ON attendance.employee_id = employees.id
            `,
            [employee_id, attendance_date, clock_in, clock_out, total_time, id]
        );
        const attendance = result.rows[0];
        res.status(201).json(attendance);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function attendanceDeleteRouter(req, res) {
    console.log('attendanceDeleteRouter');
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM employee_attendance WHERE id = $1', [id]);
        res.status(201).json({ id });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
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