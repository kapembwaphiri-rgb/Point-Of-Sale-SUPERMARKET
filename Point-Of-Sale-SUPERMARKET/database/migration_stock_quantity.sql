USE pos_supermarket;

ALTER TABLE products ADD COLUMN stock_quantity INT NOT NULL DEFAULT 0 AFTER tax_rate;
UPDATE products p JOIN inventory i ON i.product_id = p.id SET p.stock_quantity = i.quantity;