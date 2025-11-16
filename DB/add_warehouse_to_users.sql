-- Migration: Add warehouse_id to Users table
-- Date: 2025-11-16
-- Description: Add foreign key reference from Users to Warehouse
-- NOTE: This uses MySQL syntax, not SQL Server

USE wine_production;

-- First, we need to ensure Warehouse table has some data
-- Add a default warehouse if not exists (optional)
INSERT IGNORE INTO Warehouse (warehouse_id, categories) 
VALUES (1, 'Red Wine Production');

-- Add warehouse_id column to Users table
ALTER TABLE Users 
ADD warehouse_id INT NULL;

-- Add foreign key constraint
ALTER TABLE Users
ADD CONSTRAINT fk_users_warehouse
FOREIGN KEY (warehouse_id) REFERENCES Warehouse(warehouse_id)
ON DELETE SET NULL
ON UPDATE CASCADE;

-- Verify the change (MySQL command)
SHOW COLUMNS FROM Users;

-- Optional: Update existing users with warehouse assignments
-- Uncomment and modify as needed after migration:
-- UPDATE Users SET warehouse_id = 1 WHERE role = 'manager';
-- UPDATE Users SET warehouse_id = 1 WHERE role = 'engineer';
-- UPDATE Users SET warehouse_id = 1 WHERE role = 'tester';
