CREATE TABLE user_table (
  id SERIAL PRIMARY KEY,
  auth_provider VARCHAR(1000) NOT NULL,
  id_from_provider VARCHAR(1000) NOT NULL,
  UNIQUE (auth_provider, id_from_provider)
);

ALTER TABLE book
ADD COLUMN
  owner_id INTEGER
  REFERENCES user_table (id) NOT NULL
;
