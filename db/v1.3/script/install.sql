-- ----------------------------------------------------------
-- Alter table worklog.
-- Add column location in order to support location based pricing.
-- ----------------------------------------------------------
ALTER TABLE `rexor_integration_database`.`worklog`
ADD COLUMN `location` VARCHAR(100) NULL;

