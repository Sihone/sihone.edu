const db = require('../db');

function settingGetRouter(req, res) {
    console.log('settingGetRouter');
    const { company_id } = req.params;
    db.query('SELECT * FROM settings WHERE id = ?', [company_id], async (result, error) => {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        } else {
            const settings = result.rows[0];
            res.json(settings);
        }
    });
}

function settingPutRouter(req, res) {
    console.log('settingPutRouter');
    const { id, company_name, company_address, company_phone, company_email, company_website, company_logo, company_currency, smtp_server, smtp_port, smtp_user, smtp_password, smtp_security, company_registration } = req.body;
    db.query(
        'UPDATE settings SET company_name = ?, company_address = ?, company_phone = ?, company_email = ?, company_website = ?, company_logo = ?, company_currency = ?, smtp_server = ?, smtp_port = ?, smtp_user = ?, smtp_password = ?, smtp_security = ?, company_registration = ? WHERE id = ?',
        [company_name, company_address, company_phone, company_email, company_website, company_logo, company_currency, smtp_server, smtp_port, smtp_user, smtp_password, smtp_security, company_registration, id],
        async (result, error) => {
            if (error) {
                console.log(error);
                res.status(500).json(error);
            } else {
                db.query(
                    'SELECT * FROM settings WHERE id = ?',
                    [id],
                    async (result2, error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json(error);
                        } else {
                            const setting = result2.rows[0];
                            res.status(201).json(setting);
                        }
                    }
                );
            }
        }
    );
}

module.exports = {
    settingGetRouter,
    settingPutRouter
}