ALTER TABLE `academic_cycles` ADD `number_of_years` TINYINT(1) NOT NULL DEFAULT '1' AFTER `short_name_fr`;
ALTER TABLE `tuition` ADD `academic_year_id` INT(11) NOT NULL DEFAULT '2' AFTER `student_id`;
ALTER TABLE `tuition` ADD CONSTRAINT `tuition_academic_year_id_foreign` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `academic_cycles` ADD `reg_fee` DECIMAL NOT NULL DEFAULT '0' AFTER `number_of_years`;
