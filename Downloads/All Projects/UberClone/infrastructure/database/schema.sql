-- RideWave PostgreSQL + PostGIS Schema
-- Run this after Postgres and PostGIS are installed

CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255),
  role VARCHAR(20) NOT NULL CHECK (role IN ('rider', 'driver', 'admin')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drivers table
CREATE TABLE drivers (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  license_no VARCHAR(50),
  rating_avg FLOAT DEFAULT 5.0,
  docs_status VARCHAR(20) DEFAULT 'pending',
  is_online BOOLEAN DEFAULT FALSE,
  current_location GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles table
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  make VARCHAR(100),
  model VARCHAR(100),
  plate VARCHAR(20) UNIQUE,
  color VARCHAR(50),
  vehicle_type VARCHAR(50) CHECK (vehicle_type IN ('economy', 'xl', 'premium')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trips table
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id UUID NOT NULL REFERENCES users(id),
  driver_id UUID REFERENCES drivers(id),
  pickup_point GEOGRAPHY(POINT, 4326) NOT NULL,
  dropoff_point GEOGRAPHY(POINT, 4326) NOT NULL,
  vehicle_type VARCHAR(50),
  fare_estimate FLOAT,
  fare_final FLOAT,
  status VARCHAR(50) DEFAULT 'requested',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  ended_at TIMESTAMP
);

-- Locations (history)
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL,
  entity_type VARCHAR(50),
  location GEOGRAPHY(POINT, 4326),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id),
  rider_id UUID REFERENCES users(id),
  amount FLOAT NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  stripe_charge_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Promo codes table
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(50),
  amount FLOAT,
  valid_from TIMESTAMP,
  valid_to TIMESTAMP,
  usage_limit INT,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ratings table
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id),
  rater_id UUID REFERENCES users(id),
  ratee_id UUID REFERENCES users(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(255),
  metadata JSONB,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_drivers_user_id ON drivers(user_id);
CREATE INDEX idx_trips_rider_id ON trips(rider_id);
CREATE INDEX idx_trips_driver_id ON trips(driver_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_created_at ON trips(created_at);
CREATE INDEX idx_locations_entity ON locations(entity_id, entity_type);
CREATE INDEX idx_payments_trip_id ON payments(trip_id);
CREATE INDEX idx_ratings_trip_id ON ratings(trip_id);

-- Geospatial indexes
CREATE INDEX idx_drivers_location ON drivers USING GIST(current_location);
CREATE INDEX idx_trips_pickup ON trips USING GIST(pickup_point);
CREATE INDEX idx_trips_dropoff ON trips USING GIST(dropoff_point);
CREATE INDEX idx_locations_geom ON locations USING GIST(location);
