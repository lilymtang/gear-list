CREATE DATABASE gearlist;

CREATE TABLE item (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    product_name TEXT,
    type TEXT,
    category TEXT NOT NULL,
    weight DECIMAL NOT NULL, 
    user_id INTEGER REFERENCES account NOT NULL,
    is_inventory BOOLEAN,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE account (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pack (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    user_id INTEGER REFERENCES account NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pack_has_item(
    pack_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    FOREIGN KEY (pack_id) REFERENCES pack(id) ON DELETE CASCADE, 
    FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE CASCADE,
    UNIQUE (pack_id, item_id)
);

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON account
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON item
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();