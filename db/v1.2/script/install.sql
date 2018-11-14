-- -----------------------------------------------------
-- Create table absence
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rexor_integration_database`.`absence` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `classification_id` VARCHAR(100) NOT NULL,
  `jira_project_rexor_project_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `jira_project_rexor_project_id_unique_1` (`jira_project_rexor_project_id` ASC),
  CONSTRAINT `absence_jira_project_rexor_project_id`
    FOREIGN KEY (`jira_project_rexor_project_id`)
    REFERENCES `rexor_integration_database`.`jira_project_rexor_project` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Create table issue_time_code
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rexor_integration_database`.`issue_time_code` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `issue_id` VARCHAR(100) NOT NULL,
    `time_code_uid` VARCHAR(100) NOT NULL,
    `absence_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `absence_id_index` (`absence_id` ASC),
    UNIQUE INDEX `issue_time_code_unqiue_1` (`issue_id` ASC, `absence_id` ASC),
    CONSTRAINT `issue_time_code_absence_id`
        FOREIGN KEY (`absence_id`)
        REFERENCES `rexor_integration_database`.`absence` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE)
ENGINE = InnoDB;


