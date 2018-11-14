-- ----------------------------------------------------------
-- Create table worklog.
-- Stores worklog data from Tempo used for transfer to Rexor.
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `rexor_integration_database`.`worklog` (
    `id` VARCHAR(100) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `time_spent` DECIMAL(4,2) NOT NULL,
    `comment` TEXT NULL,
    `approval_status` VARCHAR(100) NOT NULL,
    `work_date` DATETIME NOT NULL,
    `issue_key` VARCHAR(100) NOT NULL,
    `issue_summary` TEXT NOT NULL,
    `issue_type_id` VARCHAR(100) NOT NULL,
    `project_key` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id`))
ENGINE = InnoDB;

-- ----------------------------------------------------------
-- Create table transfer_status.
-- Holds possible transfer statuses: ready, complete, failed.
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `rexor_integration_database`.`transfer_status` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `cd` VARCHAR(30) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `cd_unique_1` (`cd` ASC))
ENGINE = InnoDB;

-- ----------------------------------------------------------
-- Inserts predefined status values.
-- ----------------------------------------------------------
INSERT INTO `rexor_integration_database`.`transfer_status`
    (`cd`, `name`)
VALUES
    ("ready","Ready"),
    ("complete","Complete"),
    ("failed","Failed");

-- ----------------------------------------------------------
-- Create table worklog_transfer.
-- Holds the information about worklogs queued for transfer
-- and transfer status. 
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `rexor_integration_database`.`worklog_transfer` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `worklog_id` VARCHAR(100) NOT NULL,
    `created_by` VARCHAR(100) NOT NULL,
    `created_on` DATETIME NOT NULL,
    `transfer_status_cd` VARCHAR(30) NOT NULL,
    `transfer_log` TEXT NULL,
    `transferred_on` DATETIME NULL,
    PRIMARY KEY (`id`),
    INDEX `transfer_status_cd_idx` (`transfer_status_cd` ASC),
    UNIQUE INDEX `worklog_id_unique_1` (`worklog_id` ASC),
    CONSTRAINT `worklog_transfer_transfer_status_cd`
        FOREIGN KEY (`transfer_status_cd`)
        REFERENCES `rexor_integration_database`.`transfer_status` (`cd`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    CONSTRAINT `worklog_transfer_worklog_id`
        FOREIGN KEY (`worklog_id`)
        REFERENCES `rexor_integration_database`.`worklog` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE)
ENGINE = InnoDB;

-- ----------------------------------------------------------
-- Create table system.
-- Holds the basic information about external systems that  
-- the application is interacting with.
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `rexor_integration_database`.`system` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `cd` VARCHAR(30) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `cd_unique_1` (`cd` ASC))
ENGINE = InnoDB;

-- ----------------------------------------------------------
-- Inserts predefined status values.
-- ----------------------------------------------------------
INSERT INTO `rexor_integration_database`.`system`
    (`cd`, `name`)
VALUES
    ("rexor","Rexor"),
    ("jira","Jira"),
    ("tempo","Tempo");

-- ----------------------------------------------------------
-- Create table authentication.
-- Holds authorization tokens for each system.
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `rexor_integration_database`.`authentication_token` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `system_cd` VARCHAR(30) NOT NULL,
    `type` VARCHAR(30) NOT NULL,
    `value` TEXT NOT NULL,
    `received_on` DATE NULL,
    `expires_in` INT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `system_cd_unique_1` (`system_cd` ASC),
    CONSTRAINT `authentication_token_system_cd`
        FOREIGN KEY (`system_cd`)
        REFERENCES `rexor_integration_database`.`system` (`cd`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- --------------------------------------------------------------------------------------
-- Insert static token values for Jira and Tempo.
-- Tempo uses Api Token generated for the account (and bound to the ip address)
-- Jira uses Basic authentication. Token is Base64 encoded string of `username:password`.
-- --------------------------------------------------------------------------------------
INSERT INTO `rexor_integration_database`.`authentication_token`
    (`system_cd`, `type`, `value`)
VALUES
    ("tempo", "Api Token", "abcd"),
    ("jira", "Basic", "abcd");