const jwt = require('jsonwebtoken');
const db = require('../db');
const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer");

const JWT_SECRET = "jwt_secret";
const JWT_VALIDITY = "1h";

const loginRouter = async (req, res) => {
    console.log('POST /api/auth/login', req.body);
    const { email, password } = req.body;
    const result = await db.query('SELECT *, employees.id AS id FROM employees LEFT JOIN roles ON role = roles.id WHERE email = $1', [email]);
    const settings = await db.query('SELECT * FROM settings WHERE id = $1', [result.rows[0].company_id]);
    const userDb = result.rows[0];
    if (!userDb) {
        return res.status(401).json({ message: "Invalid email or password" });
    } else {
        const isMatch = await bcrypt.compare(password, userDb.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        } else {
            const accessToken = jwt.sign({ userId: userDb.id }, JWT_SECRET, {
                expiresIn: JWT_VALIDITY,
            });
            return res.status(200).json({
                user: {
                    id: userDb.id,
                    role: userDb.role,
                    first_name: userDb.first_name,
                    last_name: userDb.last_name,
                    email: userDb.email,
                    employee_id: userDb.employee_id,
                    company_id: userDb.company_id,
                    currency: settings.rows[0].company_currency,
                    company_name: settings.rows[0].company_name,
                    company_address: settings.rows[0].company_address,
                    company_phone: settings.rows[0].company_phone,
                    company_registration: settings.rows[0].company_registration,
                    permissions: JSON.parse(userDb.permissions),
                    currentAcademicYearId: settings.rows[0].current_academic_year,
                },
                accessToken: accessToken
            });
        }
    }
}

const profileRouter = async (req, res) => {
    console.log('GET /api/auth/profile');
    const { authorization } = req.headers;
    console.log("Authorization", authorization);
    if (!authorization) {
        return res.status(401).json({ message: "Invalid Authorization token" });
    } else {
        const accessToken = authorization.split(" ")[1];
        console.log("accessToken", accessToken);
        const { userId } = jwt.verify(accessToken, JWT_SECRET);
        console.log("userId", userId);
        const userDb = await db.query('SELECT *, employees.id AS id FROM employees LEFT JOIN roles ON role = roles.id WHERE employees.id = $1', [userId]);
        const user = userDb.rows[0];
        const settings = await db.query('SELECT * FROM settings WHERE id = $1', [user.company_id]);
        if (!user) {
            return res.status(401).json({ message: "Invalid authorization token" });
        } else {
            const accessToken = jwt.sign({ userId: userDb.id }, JWT_SECRET, {
                expiresIn: JWT_VALIDITY,
            });
            return res.status(200).json({
                user: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role,
                    employee_id: user.employee_id,
                    company_id: user.company_id,
                    currency: settings.rows[0].company_currency,
                    company_name: settings.rows[0].company_name,
                    company_address: settings.rows[0].company_address,
                    company_phone: settings.rows[0].company_phone,
                    company_registration: settings.rows[0].company_registration,
                    permissions: JSON.parse(user.permissions),
                    currentAcademicYearId: settings.rows[0].current_academic_year,
                },
                accessToken: accessToken
            });
        }
    }
}

const resetPasswordRouter = async (req, res) => {
    console.log('POST /api/auth/reset', req.body);
    const { email } = req.body;
    const user = db.query('SELECT * FROM employees WHERE email = $1', [email]);
    if (!user) {
        return res.status(401).json({ message: "Invalid email" });
    } else {
        const { transporter, company_name, smtp_user } = await getEmailSettings(user.company_id);

        const newPassword = Math.random().toString(36).slice(-8);
        await updateUserPassword(user.id, newPassword);
            
        const subject = "Password Reset - " + company_name;
        const content = `
            <p>Hi ${user.first_name},</p>
            <p>Your new password.</p>
            <p style="padding: 10px; background-color: #facdd5; display: inline;"><b><code>${newPassword}</code></b></p>
            <p>You can change your password after logging in.</p>
            <p>Regards,</p>
            <p>${company_name}</p>
        `;

        const mailOptions = {
            from: smtp_user,
            to: user.email,
            subject: subject,
            html: content,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Internal server error" });
            } else {
                console.log("Email sent: " + info.response);
                return res.status(200).json({ message: "Email sent" });
            }
        });
    }
}

const registerRouter = async (req, res) => {
    console.log('POST /api/auth/register', req.body);
    const {
        first_name,
        last_name,
        email,
        phone,
        password,
        company_name,
        company_address,
        company_phone,
        company_email,
        company_website,
        company_logo,
        company_currency,
        smtp_server = "",
        smtp_port = "",
        smtp_user = "",
        smtp_password = "",
        smtp_security = "",
    } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const settings = await db.query('INSERT INTO settings (company_name, company_address, company_phone, company_email, company_website, company_logo, company_currency, smtp_server, smtp_port, smtp_user, smtp_password, smtp_security) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *', [company_name, company_address, company_phone, company_email, company_website, company_logo, company_currency, smtp_server, smtp_port, smtp_user, smtp_password, smtp_security]);
    const company_id = settings.rows[0].id;

    const role = await db.query('INSERT INTO roles (name, description, permissions, company_id, super) VALUES ($1, $2, $3, $4, $5) RETURNING *', ['SU', 'Super Admin', '[superadmin]', company_id, 1]);
    const role_id = role.rows[0].id;

    const employee_id = "SU" + company_id + "0001";
    const base_salary = 0;
    const hourly_rate = 0;
    const pay_period = "Monthly";
    const result = await db.query('INSERT INTO employees (first_name, last_name, email, phone, password, employee_id, role, company_id, base_salary, hourly_rate, pay_period) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *', [first_name, last_name, email, phone, hashedPassword, employee_id, role_id, company_id, base_salary, hourly_rate, pay_period]);
    const userDb = result.rows[0];

    const accessToken = jwt.sign({ userId: userDb.id }, JWT_SECRET, {
        expiresIn: JWT_VALIDITY,
    });
    return res.status(200).json({
        user: {
            id: userDb.id,
            role: userDb.role,
            first_name: userDb.first_name,
            last_name: userDb.last_name,
            email: userDb.email,
            employee_id: userDb.employee_id,
            company_id: userDb.company_id,
            currency: settings.rows[0].company_currency,
            company_name: settings.rows[0].company_name,
            company_address: settings.rows[0].company_address,
            company_phone: settings.rows[0].company_phone,
            company_registration: settings.rows[0].company_registration,
            permissions: JSON.parse(role.rows[0].permissions),
            currentAcademicYearId: settings.rows[0].current_academic_year,
        },
        accessToken: accessToken
    });
}

const getEmailSettings = async (company_id) => {
    const settings = await db.query('SELECT * FROM email_settings WHERE id = $1', [company_id]);
    const smtp_server = settings.rows[0].smtp_server;
    const smtp_port = settings.rows[0].smtp_port;
    const smtp_user = settings.rows[0].smtp_user;
    const smtp_password = settings.rows[0].smtp_password;
    const smtp_security = settings.rows[0].smtp_security;
    const company_name = settings.rows[0].company_name;
    
    const transporter = nodemailer.createTransport({
        host: smtp_server,
        port: smtp_port,
        secure: !!smtp_security,
        auth: {
            user: smtp_user,
            pass: smtp_password,
        },
    });

    return { transporter, company_name, smtp_user };
}

const updateUserPassword = async (userId, newPassword) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await db.query('UPDATE employees SET password = $1 WHERE id = $2', [hashedPassword, userId]);
}

module.exports = {loginRouter, profileRouter, resetPasswordRouter, registerRouter};
