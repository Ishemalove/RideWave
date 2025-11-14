# RideWave ERD (Entity Relationship Diagram)

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CORE ENTITIES                             │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│     USERS       │
├─────────────────┤
│ id (UUID)       │◄─────────────────────┐
│ name            │                      │
│ email           │                      │
│ phone           │                      │
│ password_hash   │                      │
│ role (enum)     │                      │
│ is_active       │                      │
│ created_at      │                      │
│ updated_at      │                      │
└─────────────────┘                      │
        ▲                                 │
        │ inherits                        │
        │                                 │
    ┌───┴─────────────┬──────────────────┴────────────┐
    │                 │                                │
┌───┴──────┐    ┌────┴─────┐                   ┌──────┴─────┐
│ RIDERS   │    │ DRIVERS  │                   │   ADMINS   │
└──────────┘    └──────────┘                   └────────────┘
                       │
                       │ has many
                       ▼
            ┌─────────────────────┐
            │   DRIVERS (extended)│
            ├─────────────────────┤
            │ user_id (FK)        │
            │ license_no          │
            │ rating_avg          │
            │ docs_status         │
            │ is_online           │
            │ current_location    │
            │   (GEOGRAPHY)       │
            └─────────────────────┘
                     │
                     │ owns many
                     ▼
            ┌─────────────────────┐
            │    VEHICLES         │
            ├─────────────────────┤
            │ id                  │
            │ driver_id (FK)      │
            │ make, model         │
            │ plate, color        │
            │ vehicle_type (enum) │
            └─────────────────────┘

┌─────────────────┐
│     TRIPS       │
├─────────────────┤
│ id (UUID)       │
│ rider_id (FK)───┼─────────► USERS
│ driver_id (FK)─ ┼─────────► DRIVERS
│ pickup_point    │  GEOGRAPHY
│ dropoff_point   │  GEOGRAPHY
│ vehicle_type    │  (enum)
│ fare_estimate   │
│ fare_final      │
│ status (enum)   │
│ created_at      │
│ started_at      │
│ ended_at        │
└─────────────────┘
        │
        │ has one
        ▼
┌─────────────────────┐
│    PAYMENTS         │
├─────────────────────┤
│ id                  │
│ trip_id (FK)────────┼─► TRIPS
│ rider_id (FK)       │
│ amount              │
│ currency            │
│ method              │
│ status              │
│ stripe_charge_id    │
│ created_at          │
└─────────────────────┘

┌─────────────────────┐
│   LOCATIONS         │
├─────────────────────┤
│ id                  │
│ entity_id           │
│ entity_type         │
│ location (GEO)      │
│ timestamp           │
└─────────────────────┘

┌─────────────────────┐
│   PROMO_CODES       │
├─────────────────────┤
│ id                  │
│ code (unique)       │
│ discount_type       │
│ amount              │
│ valid_from          │
│ valid_to            │
│ usage_limit         │
│ usage_count         │
│ created_at          │
└─────────────────────┘

┌─────────────────────┐
│     RATINGS         │
├─────────────────────┤
│ id                  │
│ trip_id (FK)────────┼─► TRIPS
│ rater_id (FK)       │
│ ratee_id (FK)       │
│ rating (1-5)        │
│ comment             │
│ created_at          │
└─────────────────────┘

┌─────────────────────┐
│  AUDIT_LOGS         │
├─────────────────────┤
│ id                  │
│ user_id (FK)────────┼─► USERS
│ action              │
│ metadata (JSON)     │
│ timestamp           │
└─────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         KEY INDEXES                                 │
└─────────────────────────────────────────────────────────────────────┘

Geospatial (PostGIS):
- GIST index on DRIVERS.current_location
- GIST index on TRIPS.pickup_point
- GIST index on TRIPS.dropoff_point
- GIST index on LOCATIONS.location

B-Tree (Search):
- Unique on USERS.email
- Unique on USERS.phone
- Unique on VEHICLES.plate
- Unique on PROMO_CODES.code
- Index on TRIPS.status
- Index on TRIPS.created_at
- Index on PAYMENTS.trip_id
```

## Geospatial Queries (PostGIS)

```sql
-- Find nearest drivers (5 km radius from pickup point)
SELECT d.id, d.current_location, 
       ST_Distance(d.current_location, ST_GeomFromText('POINT(37.7749 -122.4194)', 4326)) AS distance
FROM drivers d
WHERE d.is_online = TRUE
  AND ST_DWithin(d.current_location, ST_GeomFromText('POINT(37.7749 -122.4194)', 4326), 5000)
ORDER BY distance
LIMIT 3;

-- Search trips in a bounding box
SELECT * FROM trips
WHERE pickup_point && ST_MakeEnvelope(37.7, -122.5, 37.8, -122.4, 4326);
```

## Relations Summary

- **User** (1) → (Many) **Trips** (as rider)
- **Driver** (1) → (Many) **Trips** (as driver)
- **Driver** (1) → (Many) **Vehicles**
- **Trip** (1) → (1) **Payment**
- **Trip** (1) → (Many) **Ratings**
- **User** (1) → (Many) **Ratings** (as rater/ratee)
