# RideWave Development Setup & Quick Start

## Prerequisites

- **Node.js** 16+ (for API & Admin)
- **Flutter SDK** (for Mobile)
- **Docker & Docker Compose** (for local Postgres + Redis)
- **PostgreSQL** 14+ with PostGIS (or use Docker)

## Local Development Setup

### 1. Start Database & Cache (Docker)

```powershell
cd "c:\Users\user\Downloads\All Projects\UberClone"
docker-compose up -d postgres redis
```

This starts:
- **Postgres** on port 5432 (credentials: ridewave/ridewave_dev_password)
- **Redis** on port 6379

Run migrations (if DB is ready):
```powershell
# TODO: Set up Prisma or TypeORM migrations
# For now, the schema.sql is in /infrastructure/database/schema.sql
```

### 2. Start Backend API

```powershell
cd "c:\Users\user\Downloads\All Projects\UberClone\api"
npm install
npm run start:dev
```

API runs on `http://localhost:3000`.

**Endpoints overview:**
- `POST /api/v1/auth/signup` — Register
- `POST /api/v1/auth/login` — Login
- `POST /api/v1/auth/otp/send` — Send OTP
- `POST /api/v1/trips/estimate` — Fare estimate
- `POST /api/v1/trips` — Create trip (requires JWT)
- `WS ws://localhost:3000/ws/trips` — WebSocket for realtime updates

### 3. Start Admin Dashboard

```powershell
cd "c:\Users\user\Downloads\All Projects\UberClone\admin"
npm install
npm run dev
```

Admin runs on `http://localhost:3001`.

**Admin pages:**
- `/` — Dashboard (placeholder)
- `/users` — User management
- `/trips` — Trip logs

### 4. Run Flutter Mobile App

**Android:**
```powershell
cd "c:\Users\user\Downloads\All Projects\UberClone\mobile"
flutter pub get
flutter run -d emulator-5554  # Use your emulator ID
```

**iOS (macOS only):**
```powershell
flutter run -d <iOS device ID>
```

## Testing

### API Health Check

```powershell
# Test trips/estimate (no auth needed)
curl -X POST http://localhost:3000/api/v1/trips/estimate `
  -H "Content-Type: application/json" `
  -d '{
    "pickupLat": 37.7749,
    "pickupLng": -122.4194,
    "dropoffLat": 37.8044,
    "dropoffLng": -122.2712,
    "vehicleType": "economy"
  }'
```

### Auth Flow Example

```powershell
# 1. Sign up
$signupResponse = curl -X POST http://localhost:3000/api/v1/auth/signup `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Test Rider",
    "email": "test@example.com",
    "phone": "+1234567890",
    "password": "TestPass123"
  }' | ConvertFrom-Json

$accessToken = $signupResponse.accessToken

# 2. Use token for protected endpoints
curl -X GET http://localhost:3000/api/v1/admin/users `
  -H "Authorization: Bearer $accessToken"
```

## Postman Collection

Import `postman_collection.json` into Postman for a pre-built test suite.

## Docker Compose Cleanup

```powershell
docker-compose down -v  # Stop and remove volumes
```

## Next Steps

1. **Connect Flutter to API**: Update `lib/main.dart` to use actual API URLs (currently hardcoded to localhost:3000).
2. **Database migrations**: Set up Prisma/TypeORM migrations to populate the Postgres schema.
3. **Stripe integration**: Replace payment service placeholders with real Stripe SDK.
4. **Real WebSocket events**: Emit driver-matched and location-update events to connected clients.
5. **Admin auth**: Add login/RBAC checks to admin endpoints.

## Troubleshooting

**Port already in use?**
```powershell
netstat -ano | findstr :3000  # Find what's using port 3000
taskkill /PID <PID> /F        # Kill the process
```

**Postgres connection error?**
```powershell
docker-compose logs postgres  # Check Postgres logs
```

**Flutter build issues?**
```powershell
flutter clean
flutter pub get
flutter run
```

## Security Checklist (Before Production)

- [ ] Swap JWT_SECRET and STRIPE_SECRET_KEY from env vars
- [ ] Enable HTTPS/TLS
- [ ] Add rate limiting middleware
- [ ] Mask phone numbers for calls
- [ ] Implement audit logging
- [ ] Add 2FA for admins
- [ ] Set up database encryption for sensitive fields
- [ ] Configure CORS properly (not `*`)
