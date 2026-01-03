
-- Create device enum type
CREATE TYPE device AS ENUM ('display', 'keyboard', 'mouse', 'headset', 'webcam');


-- Create Users table
-- CREATE TABLE IF NOT EXISTS Users (
--  id UUID DEFAULT gen_random_uuid(),
--  firstName VARCHAR NOT NULL,
--  lastName VARCHAR NOT NULL,
 -- avatarPath VARCHAR NULL,
 -- inserted_at timestamp with time zone default timezone('utc'::text, now()) NOT NULL,
 -- updated_at timestamp with time zone default timezone('utc'::text, now()) NOT NULL,
 -- PRIMARY KEY(id)
--);


-- Create Rooms table
CREATE TABLE IF NOT EXISTS Rooms (
  id UUID DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  address VARCHAR,
  booker_id UUID,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone default timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY(id),
  CONSTRAINT fk_booker FOREIGN KEY (booker_id) REFERENCES Auth.Users(id)
);


-- Create Devices table
CREATE TABLE IF NOT EXISTS Devices (
  id UUID DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  type device,
  hoster_id UUID,
  battery_level INT,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone default timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY(id),
  CONSTRAINT fk_hoster FOREIGN KEY (hoster_id) REFERENCES Rooms(id) ON DELETE CASCADE
);

