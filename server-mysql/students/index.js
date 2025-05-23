const db = require('../db');
const bcrypt = require("bcryptjs")

function studentsGetAllRouter(req, res) {
    console.log('studentsGetRouter');
    const { company_id } = req.params;
    db.query(`
        SELECT *, academic_programs.id AS programs_program_id, students.id AS id, academic_programs.company_id AS program_company_id, students.status AS status, tuition.id AS tuition_id, tuition.academic_year_id AS tuition_academic_year_id, students.academic_year_id AS academic_year_id, students.student_id AS student_id, laptops.id AS laptops_id, laptops.make_model AS laptop_make_model, laptops.serial_number AS laptop_serial_number FROM students
        LEFT JOIN academic_programs ON students.program_id = academic_programs.id
        LEFT JOIN tuition ON students.id = tuition.student_id
        LEFT JOIN laptops ON students.laptop_id = laptops.id
        WHERE students.company_id = ?
        ORDER BY students.first_name ASC
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

function studentsGetAllByAcademicYearRouter(req, res) {
    console.log('studentsGetRouter');
    const { company_id, academic_year_id } = req.params;
    db.query(`
        SELECT *, academic_programs.id AS programs_program_id, students.id AS id, academic_programs.company_id AS program_company_id, students.status AS status, tuition.id AS tuition_id, tuition.academic_year_id AS tuition_academic_year_id, students.student_id AS student_id, laptops.id AS laptops_id, laptops.make_model AS laptop_make_model, laptops.serial_number AS laptop_serial_number FROM students
        LEFT JOIN academic_programs ON students.program_id = academic_programs.id
        LEFT JOIN tuition ON students.id = tuition.student_id
        LEFT JOIN laptops ON students.laptop_id = laptops.id
        WHERE students.company_id = ? AND students.academic_year_id = ?
        ORDER BY students.first_name ASC
    `,
    [company_id, academic_year_id],
    async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            res.json(result.rows.map(row => delete row.password && row));
        }
    })
}

function studentGetRouter(req, res) {
    console.log('studentGetRouter');
    const { company_id, id } = req.params;
    db.query(
        `
        SELECT *, academic_programs.id AS programs_program_id, students.id AS id, academic_programs.company_id AS program_company_id, students.status AS status, tuition.id AS tuition_id, tuition.academic_year_id AS tuition_academic_year_id, students.student_id AS student_id, laptops.id AS laptops_id, laptops.make_model AS laptop_make_model, laptops.serial_number AS laptop_serial_number FROM students
        LEFT JOIN academic_programs ON students.program_id = academic_programs.id
        LEFT JOIN tuition ON students.id = tuition.student_id
        LEFT JOIN laptops ON students.laptop_id = laptops.id
        WHERE students.company_id = ? AND students.id = ?
        `,
        [company_id, id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            }
            else {
                const student = result.rows[0];
                student && delete student.password;
                res.json(student);
            }
        }
    );
}

async function studentsPostRouter(req, res) {
    console.log('studentsPostRouter');
    const { first_name, last_name, gender, email, phone, program_id, parent_phone, status, emmergency_contact_name, emmergency_contact_phone, emmergency_contact_relation, company_id, password, academic_year_id, dob, needs_laptop, laptop_incentive } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'Abcd1234', salt);
    db.query(
        `INSERT INTO students (first_name, last_name, gender, email, phone, program_id, parent_phone, status, emmergency_contact_name, emmergency_contact_phone, emmergency_contact_relation, company_id, password, academic_year_id, dob, needs_laptop, laptop_incentive)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
        [first_name, last_name, gender, email, phone, program_id, parent_phone, status, emmergency_contact_name, emmergency_contact_phone, emmergency_contact_relation, company_id, hashedPassword, academic_year_id, dob, needs_laptop, laptop_incentive],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                getRandomStudentId(company_id, (student_id) => {
                    console.log("student_id", student_id);
                    db.query(
                        'UPDATE students SET student_id = ? WHERE id = ?',
                        [student_id, result.rows[0].id],
                        async (result2, error) => {
                            if (error) {
                                console.log(error);
                                res.status(500).json(error);
                            } else {
                                db.query(
                                    `
                                        INSERT INTO tuition (student_id, academic_year_id, company_id) VALUES (?, ?, ?)
                                    `,
                                    [result.rows[0].id, academic_year_id, company_id],
                                    async (result3, error) => {
                                        if (error) {
                                            console.log(error);
                                            res.status(500).json(error);
                                        } else {
                                            db.query(
                                                `
                                                    SELECT *, academic_programs.id AS programs_program_id, students.id AS id, academic_programs.company_id AS program_company_id, students.status AS status, tuition.id AS tuition_id, tuition.academic_year_id AS tuition_academic_year_id, students.student_id AS student_id, laptops.id AS laptops_id, laptops.make_model AS laptop_make_model, laptops.serial_number AS laptop_serial_number FROM students
                                                    LEFT JOIN academic_programs ON students.program_id = academic_programs.id
                                                    LEFT JOIN tuition ON students.id = tuition.student_id
                                                    LEFT JOIN laptops ON students.laptop_id = laptops.id
                                                    WHERE students.id = ?
                                                `,
                                                [result.rows[0].id],
                                                async (result3, error) => {
                                                    if (error) {
                                                        console.log(error);
                                                        res.status(500).json(error);
                                                    } else {
                                                        const student = result3.rows[0];
                                                        delete student.password;
                                                        res.status(201).json(student);
                                                    }
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    );
                
                });
            }
        }
    );
}

function studentsPutRouter(req, res) {
    console.log('studentsPutRouter');
    const { id, first_name, last_name, gender, email, phone, program_id, parent_phone, status, emmergency_contact_name, emmergency_contact_phone, emmergency_contact_relation, company_id, academic_year_id, dob, needs_laptop, laptop_id } = req.body;
    db.query(`
        UPDATE students SET 
        first_name = ?, 
        last_name = ?, 
        gender = ?, 
        email = ?, 
        phone = ?, 
        program_id = ?, 
        parent_phone = ?, 
        status = ?, 
        emmergency_contact_name = ?, 
        emmergency_contact_phone = ?, 
        emmergency_contact_relation = ?,
        academic_year_id = ?,
        dob = ?,
        needs_laptop = ?,
        laptop_id = ?
        WHERE id = ?
        `,
        [first_name, last_name, gender, email, phone, program_id, parent_phone, status, emmergency_contact_name, emmergency_contact_phone, emmergency_contact_relation, academic_year_id, dob, needs_laptop, laptop_id, id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                db.query(
                    `
                    SELECT *, academic_programs.id AS programs_program_id, students.id AS id, academic_programs.company_id AS program_company_id, students.status AS status, tuition.id AS tuition_id, tuition.academic_year_id AS tuition_academic_year_id, students.student_id AS student_id, laptops.id AS laptops_id, laptops.make_model AS laptop_make_model, laptops.serial_number AS laptop_serial_number FROM students
                    LEFT JOIN academic_programs ON students.program_id = academic_programs.id
                    LEFT JOIN tuition ON students.id = tuition.student_id
                    LEFT JOIN laptops ON students.laptop_id = laptops.id
                    WHERE students.company_id = ? AND students.id = ?
                    `,
                    [company_id, id],
                    async (result3, error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json(error);
                        } else {
                            const student = result3.rows[0];
                            delete student.password;
                            res.status(201).json(student);
                        }
                    }
                );
            }
        }
    )
}

function studentsDeleteRouter(req, res) {
    console.log('studentsDeleteRouter');
    const { id } = req.params;
    db.query('DELETE FROM students WHERE id = ? RETURNING *', [id], async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            db.query('DELETE FROM tuition WHERE student_id = ? RETURNING *', [id], async (result, error) => {
                if (error) {
                    console.log(error);
                    res.status(500).json(error);
                } else {
                    res.status(201).json({ id });
                }
            });
        }
    });
}

async function passwordRouter(req, res) {
    console.log('passwordRouter');
    const { id, password } = req.body;
    console.log("req.body", req.body);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    db.query(
        'UPDATE students SET password = ? WHERE id = ?',
        [hashedPassword, id],
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

const getRandomStudentId = async (company_id, callBack) => {
    db.query('SELECT student_id FROM students', [], async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            const expectedLength = result.rows.length + 1;
            let random = '';
            while(result.rows.length < expectedLength){
                const r = Math.floor(Math.random() * 10000) + 1;
                const student_id = company_id + "" + r + new Date().getFullYear().toString().charAt(2) + new Date().getFullYear().toString().charAt(3);
                if(result.rows.indexOf(student_id) === -1) {
                    result.rows.push(student_id);
                    random = student_id;
                }
            }
            callBack(random);
        }
    
    });
}

module.exports = {
    studentsGetAllRouter,
    studentsPostRouter,
    studentsPutRouter,
    studentsDeleteRouter,
    passwordRouter,
    studentGetRouter,
    studentsGetAllByAcademicYearRouter
};
