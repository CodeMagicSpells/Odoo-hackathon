CREATE EXTENSION IF NOT EXISTS pgcrypto; -- for gen_random_uuid() if needed


CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
email VARCHAR(255) UNIQUE NOT NULL,
username VARCHAR(50) UNIQUE NOT NULL,
password_hash VARCHAR(255) NOT NULL,
name VARCHAR(100) NOT NULL,
created_at TIMESTAMP NOT NULL DEFAULT NOW()
);


-- Enum simulation via check constraint for portability
CREATE TABLE IF NOT EXISTS products (
id SERIAL PRIMARY KEY,
owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
title VARCHAR(150) NOT NULL,
description TEXT,
category VARCHAR(50) NOT NULL CHECK (category IN (
'clothing','electronics','books','furniture','home','toys','sports','other'
)),
price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
image_url TEXT DEFAULT 'https://placehold.co/600x400?text=EcoFinds',
created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_products_title ON products (title);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_owner ON products (owner_id);


CREATE TABLE IF NOT EXISTS cart_items (
id SERIAL PRIMARY KEY,
user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
UNIQUE (user_id, product_id)
);


CREATE TABLE IF NOT EXISTS purchases (
id SERIAL PRIMARY KEY,
user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE SET NULL,
price_at_purchase NUMERIC(10,2) NOT NULL,
purchased_at TIMESTAMP NOT NULL DEFAULT NOW()
);
