-- 1. Create the Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- 2. Create the Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    owner_email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE
);




--DATA FOR products TABLE
INSERT INTO unb_marketplace.products (title, price, image_url, owner_email) VALUES
('Wireless Mouse', 19.99, 'https://example.com/images/mouse.jpg', 'adibhosale@unb.ca'),
('Mechanical Keyboard', 89.99, 'https://example.com/images/keyboard.jpg', 'adibhosale@unb.ca'),
('USB-C Hub', 29.50, 'https://example.com/images/hub.jpg', 'adibhosale@unb.ca'),
('Laptop Stand', 34.75, 'https://example.com/images/stand.jpg', 'adibhosale@unb.ca'),
('Noise Cancelling Headphones', 129.99, 'https://example.com/images/headphones.jpg', 'adibhosale@unb.ca'),
('Webcam 1080p', 49.99, 'https://example.com/images/webcam.jpg', 'adibhosale@unb.ca'),
('Portable SSD 1TB', 149.00, 'https://example.com/images/ssd.jpg', 'adibhosale@unb.ca'),
('Bluetooth Speaker', 59.99, 'https://example.com/images/speaker.jpg', 'adibhosale@unb.ca'),
('Smartphone Tripod', 24.99, 'https://example.com/images/tripod.jpg', 'adibhosale@unb.ca'),
('Wireless Charger', 27.49, 'https://example.com/images/charger.jpg', 'adibhosale@unb.ca');



