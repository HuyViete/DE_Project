-- Migration to add AUTO_INCREMENT to auditlog table and update event column
-- Run this script in MySQL to update the auditlog table structure

-- First, update the log_id to be AUTO_INCREMENT
ALTER TABLE auditlog MODIFY COLUMN log_id INT NOT NULL AUTO_INCREMENT;

-- Update the event column to allow longer event titles
ALTER TABLE auditlog MODIFY COLUMN event VARCHAR(255) NOT NULL;

-- Update the description column to allow longer descriptions (if not already TEXT)
ALTER TABLE auditlog MODIFY COLUMN description TEXT DEFAULT NULL;
