ALTER TABLE `students` ADD `needs_laptop` TINYINT(1) NOT NULL DEFAULT '0' AFTER `status`;
ALTER TABLE `students` ADD `laptop_id` INT(11) AFTER `needs_laptop`;
ALTER TABLE `employees` ADD `needs_laptop` TINYINT(1) NOT NULL DEFAULT '0' AFTER `phone`;
ALTER TABLE `employees` ADD `laptop_id` INT(11) AFTER `needs_laptop`;

CREATE TABLE `laptops` (
  `id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `make_model` varchar(255) NOT NULL,
  `serial_number` varchar(255) NOT NULL,
  `status` TINYINT(1) NOT NULL DEFAULT '1',
  `company_id` int(11) NOT NULL
)

ALTER TABLE `laptops` ADD CONSTRAINT `laptops_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `settings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `students` ADD CONSTRAINT `students_laptop_id_foreign` FOREIGN KEY (`laptop_id`) REFERENCES `laptops` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `employees` ADD CONSTRAINT `employees_laptop_id_foreign` FOREIGN KEY (`laptop_id`) REFERENCES `laptops` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `settings` ADD `laptop_incentive` DECIMAL NOT NULL DEFAULT '0' AFTER `automatic_salary`;
ALTER TABLE `students` ADD `laptop_incentive` DECIMAL NOT NULL DEFAULT '50000' AFTER `laptop_id`;
ALTER TABLE `employees` ADD `laptop_incentive` DECIMAL NOT NULL DEFAULT '50000' AFTER `laptop_id`;
