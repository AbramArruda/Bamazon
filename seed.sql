DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR (45) NULL,
department_name VARCHAR (45) NULL,
price DECIMAL(10,2) NULL, 
stock_quantity INT NULL,

PRIMARY KEY (item_id)
);


INSERT INTO products 
(product_name, department_name, price, stock_quantity)

VALUES 
("apple", "produce", 1.50, 5),
("bananas", "produce", 2.00, 12),
("kale", "produce", 3.00, 8),
("bread", "deli", 1.00, 15),
("sliced turkey", "deli", 4.00, 15),
("cheese", "deli", 3.50, 15);
