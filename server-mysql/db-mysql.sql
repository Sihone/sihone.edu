CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    company_address VARCHAR(255) NOT NULL,
    company_phone VARCHAR(255) NOT NULL,
    company_email VARCHAR(255) NOT NULL,
    company_website VARCHAR(255),
    company_logo VARCHAR(255),
    company_currency VARCHAR(255) NOT NULL,
    smtp_server VARCHAR(255) NOT NULL,
    smtp_port VARCHAR(255) NOT NULL,
    smtp_user VARCHAR(255) NOT NULL,
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

ALTER TABLE settings
ADD COLUMN company_registration VARCHAR(255);

CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    company_id INTEGER NOT NULL,
    CONSTRAINT fk_company_permissions FOREIGN KEY (company_id) REFERENCES settings (id)
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    permissions VARCHAR(255) NOT NULL,
    company_id INTEGER NOT NULL,
    super INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT fk_company_roles FOREIGN KEY (company_id) REFERENCES settings (id)
);

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
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
    CONSTRAINT fk_company_employees FOREIGN KEY (company_id) REFERENCES settings (id),
    CONSTRAINT fk_role_employees FOREIGN KEY (role) REFERENCES roles (id)
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
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    attendance_date VARCHAR(255) NOT NULL,
    clock_in VARCHAR(255) NOT NULL,
    clock_out VARCHAR(255),
    total_time INTEGER DEFAULT 0,
    company_id INTEGER NOT NULL,
    CONSTRAINT fk_company_attendance FOREIGN KEY (company_id) REFERENCES settings (id),
    CONSTRAINT fk_employee_attendance FOREIGN KEY (employee_id) REFERENCES employees (id)
);

-- Payroll
CREATE TABLE payroll (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    pay_period VARCHAR(255) NOT NULL,
    base_salary VARCHAR(255) NOT NULL,
    total_hours INTEGER NOT NULL,
    hourly_rate INTEGER NOT NULL,
    total_salary INTEGER NOT NULL,
    company_id INTEGER NOT NULL,
    CONSTRAINT fk_company_payroll FOREIGN KEY (company_id) REFERENCES settings (id),
    CONSTRAINT fk_employee_payroll FOREIGN KEY (employee_id) REFERENCES employees (id)
);

ALTER TABLE payroll
ADD COLUMN pay_date VARCHAR(255);

CREATE TABLE academic_years (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date VARCHAR(255) NOT NULL,
    end_date VARCHAR(255) NOT NULL,
    grade_total INTEGER NOT NULL DEFAULT 20,
    company_id INTEGER NOT NULL,
    CONSTRAINT fk_company_years FOREIGN KEY (company_id) REFERENCES settings (id)
);

CREATE TABLE academic_cycles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company_id INTEGER NOT NULL,
    CONSTRAINT fk_company_cycles FOREIGN KEY (company_id) REFERENCES settings (id)
);

ALTER TABLE academic_cycles
RENAME COLUMN name to long_name_en;

ALTER TABLE academic_cycles
ADD COLUMN short_name_en VARCHAR(255);

ALTER TABLE academic_cycles
ADD COLUMN long_name_fr VARCHAR(255);

ALTER TABLE academic_cycles
ADD COLUMN short_name_fr VARCHAR(255);

ALTER TABLE settings
ADD COLUMN current_academic_year INTEGER
REFERENCES academic_years (id);

ALTER TABLE settings
ADD COLUMN current_academic_cycle INTEGER
REFERENCES academic_cycles (id);

CREATE TABLE academic_programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_fr VARCHAR(255) NOT NULL,
    cycle_id INTEGER NOT NULL,
    price VARCHAR(255) NOT NULL,
    employee_id INTEGER NOT NULL,
    company_id INTEGER NOT NULL,
    CONSTRAINT fk_company_programs FOREIGN KEY (company_id) REFERENCES settings (id),
    CONSTRAINT fk_cycle_programs FOREIGN KEY (cycle_id) REFERENCES academic_cycles (id),
    CONSTRAINT fk_head_programs FOREIGN KEY (employee_id) REFERENCES employees (id)
);

CREATE TABLE academic_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_fr VARCHAR(255) NOT NULL,
    program_ids VARCHAR(255),
    description VARCHAR(255),
    coefficient DECIMAL NOT NULL, 
    employee_id INTEGER,
    exempted_academic_years VARCHAR(255),
    company_id INTEGER NOT NULL,
    CONSTRAINT fk_company_courses FOREIGN KEY (company_id) REFERENCES settings (id),
    CONSTRAINT fk_employee_courses FOREIGN KEY (employee_id) REFERENCES employees (id)
);

CREATE TABLE academic_modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_fr VARCHAR(255) NOT NULL,
    course_ids VARCHAR(255),
    description VARCHAR(255),
    coefficient DECIMAL,
    employee_id INTEGER,
    company_id INTEGER NOT NULL,
    CONSTRAINT fk_company_modules FOREIGN KEY (company_id) REFERENCES settings (id),
    CONSTRAINT fk_employee_modules FOREIGN KEY (employee_id) REFERENCES employees (id)
);

CREATE TABLE academic_exams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_fr VARCHAR(255) NOT NULL,
    module_id INTEGER,
    course_id INTEGER,
    program_id INTEGER,
    cycle_id INTEGER,
    employee_id INTEGER,
    date VARCHAR(255) NOT NULL,
    duration VARCHAR(255),
    total_mark INTEGER,
    academic_year_id INTEGER,
    company_id INTEGER NOT NULL,
    CONSTRAINT fk_company_exams FOREIGN KEY (company_id) REFERENCES settings (id),
    CONSTRAINT fk_employee_exams FOREIGN KEY (employee_id) REFERENCES employees (id),
    CONSTRAINT fk_module_exams FOREIGN KEY (module_id) REFERENCES academic_modules (id),
    CONSTRAINT fk_course_exams FOREIGN KEY (course_id) REFERENCES academic_courses (id),
    CONSTRAINT fk_program_exams FOREIGN KEY (program_id) REFERENCES academic_programs (id),
    CONSTRAINT fk_academic_year_exams FOREIGN KEY (academic_year_id) REFERENCES academic_years (id),
    CONSTRAINT fk_cycle_exams FOREIGN KEY (cycle_id) REFERENCES academic_cycles (id)
);

CREATE TABLE finance_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    company_id INTEGER NOT NULL,
    CONSTRAINT fk_company_accounts FOREIGN KEY (company_id) REFERENCES settings (id)
);

CREATE TABLE finance_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INTEGER NOT NULL,
    type VARCHAR(255) NOT NULL,
    date VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL,
    description VARCHAR(255),
    employee_id INTEGER NOT NULL,
    company_id INTEGER NOT NULL,
    CONSTRAINT fk_company_transactions FOREIGN KEY (company_id) REFERENCES settings (id),
    CONSTRAINT fk_account_transactions FOREIGN KEY (account_id) REFERENCES finance_accounts (id),
    CONSTRAINT fk_employee_transactions FOREIGN KEY (employee_id) REFERENCES employees (id)
);

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    gender VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(255),
    program_id INTEGER NOT NULL,
    parent_phone VARCHAR(255),
    status VARCHAR(255) NOT NULL,
    emmergency_contact_name VARCHAR(255),
    emmergency_contact_phone VARCHAR(255),
    emmergency_contact_relation VARCHAR(255),
    password VARCHAR(255),
    company_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_company_students FOREIGN KEY (company_id) REFERENCES settings (id),
    CONSTRAINT fk_program_students FOREIGN KEY (program_id) REFERENCES academic_programs (id)
)
