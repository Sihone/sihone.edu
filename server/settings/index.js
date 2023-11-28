const db = require('../db');

async function settingGetRouter (req, res) {
    console.log('settingGetRouter');
    const { company_id } = req.params;
    try {
        const result = await db.query('SELECT * FROM settings WHERE id = $1', [company_id]);
        const settings = result.rows[0];
        res.json(settings);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

async function settingPutRouter (req, res) {
    console.log('settingPutRouter');
    const { id, company_name, company_address, company_phone, company_email, company_website, company_logo, company_currency, smtp_server, smtp_port, smtp_user, smtp_password, smtp_security, company_registration } = req.body;
    try {
        const result = await db.query(
            'UPDATE settings SET company_name = $1, company_address = $2, company_phone = $3, company_email = $4, company_website = $5, company_logo = $6, company_currency = $7, smtp_server = $8, smtp_port = $9, smtp_user = $10, smtp_password = $11, smtp_security = $12, company_registration = $13 WHERE id = $14 RETURNING *',
            [company_name, company_address, company_phone, company_email, company_website, company_logo, company_currency, smtp_server, smtp_port, smtp_user, smtp_password, smtp_security, company_registration, id]
        );
        const setting = result.rows[0];
        res.status(201).json(setting);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {
    settingGetRouter,
    settingPutRouter
}