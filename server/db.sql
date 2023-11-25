CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    company_address VARCHAR(255) NOT NULL,
    company_phone VARCHAR(255) NOT NULL,
    company_email VARCHAR(255) NOT NULL,
    company_website VARCHAR(255),
    company_logo VARCHAR(255),
    company_currency VARCHAR(255) NOT NULL,
    smtp_host VARCHAR(255) NOT NULL,
    smtp_port VARCHAR(255) NOT NULL,
    smtp_username VARCHAR(255) NOT NULL,
    smtp_password VARCHAR(255) NOT NULL,
    smtp_security VARCHAR(255) NOT NULL
);

ALTER TABLE settings
ADD COLUMN employee_id_prefix VARCHAR(255) DEFAULT 'EMP';

ALTER TABLE settings
ADD COLUMN employee_id_length INTEGER DEFAULT 7;

ALTER TABLE settings
ADD COLUMN student_id_prefix VARCHAR(255) DEFAULT 'STU';

ALTER TABLE settings
ADD COLUMN student_id_length INTEGER DEFAULT 9;

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    company_id INTEGER NOT NULL,
    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES settings (id)
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    permissions VARCHAR(255) NOT NULL,
    company_id INTEGER NOT NULL,
    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES settings (id)
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    employee_id VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    base_salary INTEGER NOT NULL,
    hourly_rate INTEGER NOT NULL,
    pay_period VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role INTEGER NOT NULL,
    company_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES settings (id),
    CONSTRAINT fk_role FOREIGN KEY (role) REFERENCES roles (id)
);

ALTER TABLE employees
ADD COLUMN salutation VARCHAR(255);

-- Emmergency Contact
ALTER TABLE employees
ADD COLUMN emmergency_contact_name VARCHAR(255);

ALTER TABLE employees
ADD COLUMN emmergency_contact_phone VARCHAR(255);

ALTER TABLE employees
ADD COLUMN emmergency_contact_relation VARCHAR(255);

-- Unique email
ALTER TABLE employees
ADD CONSTRAINT unique_email UNIQUE (email);

-- Employee Attendance
CREATE TABLE employee_attendance (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    attendance_date VARCHAR(255) NOT NULL,
    clock_in VARCHAR(255) NOT NULL,
    clock_out VARCHAR(255),
    total_hours INTEGER DEFAULT 0,
    company_id INTEGER NOT NULL,
    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES settings (id),
    CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES employees (id)
);



