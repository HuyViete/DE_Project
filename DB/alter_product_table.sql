ALTER TABLE product ADD COLUMN warehouse_id int DEFAULT NULL;
ALTER TABLE product ADD COLUMN line_id int DEFAULT NULL;
ALTER TABLE product ADD CONSTRAINT product_ibfk_2 FOREIGN KEY (warehouse_id) REFERENCES warehouse (warehouse_id);
ALTER TABLE product ADD CONSTRAINT product_ibfk_3 FOREIGN KEY (line_id) REFERENCES line (line_id);
