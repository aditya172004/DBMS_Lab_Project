CREATE DATABASE IF NOT EXISTS inventory_management;
USE inventory_management;

--  Categories table
CREATE TABLE IF NOT EXISTS categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--  Products table
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category_id INT,
    supplier_id INT,
    sku VARCHAR(50) UNIQUE,
    quantity INT DEFAULT 0,
    unit_price DECIMAL(10, 2),
    reorder_level INT DEFAULT 10,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE SET NULL
);

INSERT INTO categories (category_name, description) VALUES
('Electronics', 'Electronic devices and components'),
('Furniture', 'Office and home furniture'),
('Stationery', 'Office supplies and stationery items');

INSERT INTO suppliers (supplier_name, contact_person, phone, email, address) VALUES
('TechSupplies Inc.', 'John Smith', '555-1234', 'john@techsupplies.com', '123 Tech Street, Silicon Valley'),
('Office Furnish', 'Mary Johnson', '555-5678', 'mary@officefurnish.com', '456 Oak Avenue, New York'),
('Paper & Pens Ltd', 'Robert Brown', '555-9012', 'robert@paperpens.com', '789 Pine Road, Chicago');

INSERT INTO products (product_name, category_id, supplier_id, sku, quantity, unit_price, reorder_level, description) VALUES
('Laptop', 1, 1, 'ELEC-001', 25, 899.99, 5, 'High-performance laptop for business use'),
('Office Chair', 2, 2, 'FURN-001', 15, 149.99, 3, 'Ergonomic office chair with lumbar support'),
('Notebook Pack', 3, 3, 'STAT-001', 100, 12.99, 20, 'Pack of 5 professional notebooks'),
('Wireless Mouse', 1, 1, 'ELEC-002', 30, 24.99, 10, 'Wireless optical mouse'),
('Desk', 2, 2, 'FURN-002', 8, 249.99, 2, 'Large office desk with drawers'),
('Ballpoint Pens', 3, 3, 'STAT-002', 200, 5.99, 50, 'Box of 20 ballpoint pens');