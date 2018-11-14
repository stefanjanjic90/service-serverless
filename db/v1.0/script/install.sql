-- ----------------------------------------------------------
-- Drop schema rexor_integration_database.
-- ----------------------------------------------------------
DROP SCHEMA IF EXISTS `rexor_integration_database` ;

-- ----------------------------------------------------------
-- Create schema rexor_integration_database.
-- ----------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `rexor_integration_database` DEFAULT CHARACTER SET utf8 ;
USE `rexor_integration_database` ;

-- ----------------------------------------------------------
-- Create table jira_project_rexor_project.
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `rexor_integration_database`.`jira_project_rexor_project` (
  `id`                INT NOT NULL AUTO_INCREMENT,
  `jira_project_id`   VARCHAR(100) NOT NULL,
  `rexor_project_uid` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `jira_project_rexor_project_unique_1` (`jira_project_id` ASC))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `rexor_integration_database`.`issue_type_project_activity` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `issue_type_id`                  VARCHAR(100) NOT NULL,
  `project_activity_uid`           VARCHAR(100) NOT NULL,
  `jira_project_rexor_project_id`  INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `issue_type_project_activity_unique_1` (`jira_project_rexor_project_id` ASC, `issue_type_id` ASC),
  CONSTRAINT `jira_project_rexor_project_id`
    FOREIGN KEY (`jira_project_rexor_project_id`)
    REFERENCES `rexor_integration_database`.`jira_project_rexor_project` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- ----------------------------------------------------------
-- Create table worklog_time_transaction.
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `rexor_integration_database`.`worklog_time_transaction` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `worklog_id` VARCHAR(100) NOT NULL,
  `time_transaction_uid` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `worklog_id_UNIQUE` (`worklog_id` ASC),
  UNIQUE INDEX `time_transaction_uid_UNIQUE` (`time_transaction_uid` ASC))
ENGINE = InnoDB;