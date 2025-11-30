-- 1. Modify warehouse_id to be AUTO_INCREMENT (if not already)
-- We need to drop foreign keys referencing it first if strict mode complains, 
-- but usually modifying the column to add AUTO_INCREMENT is allowed if it's the PK.
-- However, to be safe and ensure the schema is robust:
ALTER TABLE `warehouse` MODIFY COLUMN `warehouse_id` INT NOT NULL AUTO_INCREMENT;

-- 2. Add new columns for ownership and invitation logic
ALTER TABLE `warehouse`
ADD COLUMN `owner_id` INT UNSIGNED DEFAULT NULL,
ADD COLUMN `invitation_token` VARCHAR(64) DEFAULT NULL,
ADD COLUMN `token_expires_at` DATETIME DEFAULT NULL;

-- 3. Add Foreign Key for owner_id linking to users table
-- We use ON DELETE SET NULL so if an owner is deleted, the warehouse remains (or you could use CASCADE to delete the warehouse)
ALTER TABLE `warehouse`
ADD CONSTRAINT `fk_warehouse_owner`
FOREIGN KEY (`owner_id`) REFERENCES `users` (`user_id`)
ON DELETE SET NULL
ON UPDATE CASCADE;

-- 4. Add Unique constraint to invitation_token to ensure no duplicates
ALTER TABLE `warehouse`
ADD CONSTRAINT `uq_invitation_token` UNIQUE (`invitation_token`);

-- 5. (Optional) Index for faster token lookups
CREATE INDEX `idx_warehouse_token` ON `warehouse` (`invitation_token`);
