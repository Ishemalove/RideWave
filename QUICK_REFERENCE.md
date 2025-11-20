# RideWave Developer Quick Reference

## Directory Map

```
/mobile       → Flutter app (Rider & Driver interfaces)
/api          → NestJS REST API + WebSocket server
/admin        → Next.js admin web dashboard
/infrastructure → Docker, Terraform, CI/CD configs
```

## API Endpoints (Quick List)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/v1/auth/signup` | ✗ | Register user |
| POST | `/api/v1/auth/login` | ✗ | Login with credentials |
| POST | `/api/v1/auth/otp/send` | ✗ | Send SMS OTP |
| POST | `/api/v1/auth/otp/verify` | ✗ | Verify OTP & login |
| POST | `/api/v1/trips/estimate` | ✗ | Get fare quote |
| POST | `/api/v1/trips` | ✓ | Create trip request |
| GET | `/api/v1/trips/:id` | ✓ | Get trip status |
| POST | `/api/v1/trips/:id/cancel` | ✓ | Cancel trip |
| POST | `/api/v1/drivers/availability` | ✓ | Toggle online/offline |
| POST | `/api/v1/drivers/location` | ✓ | Update GPS location |
| POST | `/api/v1/drivers/:id/accept` | ✓ | Accept trip request |
| POST | `/api/v1/payments/intents` | ✓ | Create payment intent |
| POST | `/api/v1/payments/confirm` | ✓ | Confirm payment |
| POST | `/api/v1/payments/refund` | ✓ | Issue refund |
| GET | `/api/v1/admin/users` | ✓ | List users |
| GET | `/api/v1/admin/drivers` | ✓ | List drivers |
| GET | `/api/v1/admin/trips` | ✓ | List trips |
| GET | `/api/v1/admin/analytics/daily` | ✓ | Daily stats |

## WebSocket Events

**Namespace:** `/ws/trips`

| Event | Emitted By | Data |
|-------|-----------|------|
| `join_trip` | Client | `{ tripId }` |
| `driver_location` | Driver | `{ tripId, driverId, lat, lng, timestamp }` |
| `driver_location_update` | Server | Broadcast to riders in trip |
| `trip_accepted` | Server | Trip matched to driver |
| `trip_started` | Server | Driver started route |
| `trip_completed` | Server | Trip ended |

## Key Files & Their Roles

| File | Purpose |
|------|---------|
| `src/main.ts` | API bootstrap, Socket.IO setup |
| `src/app.module.ts` | Root NestJS module (imports all sub-modules) |
| `src/common/types.ts` | Shared interfaces (User, Driver, Trip, etc.) |
| `src/modules/auth/*` | AuthService, AuthController, auth DTOs |
| `src/modules/trips/*` | Trip logic, fare calc, distance calc |
| `src/modules/drivers/*` | Driver onboarding, availability, location |
| `src/modules/payments/*` | Stripe integration stubs |
| `src/modules/matching/*` | Nearest driver search algorithm |
| `src/modules/admin/*` | Admin endpoints for CRUD & analytics |
| `mobile/lib/main.dart` | Flutter app (Auth, Home, Trip screens) |
| `admin/pages/*.tsx` | Next.js admin UI pages |

## Common Tasks

### Add a New API Endpoint

1. Create DTO in `modules/<feature>/<feature>.dto.ts`
2. Add method to `modules/<feature>/<feature>.service.ts`
3. Add route to `modules/<feature>/<feature>.controller.ts`
4. Ensure module is imported in `app.module.ts`
5. Update `openapi.yaml` and `postman_collection.json`

### Test an Endpoint

```bash
# With curl (PowerShell)
curl -X POST http://localhost:3000/api/v1/trips/estimate `
  -H "Content-Type: application/json" `
  -d '{
    "pickupLat": 37.7749,
    "pickupLng": -122.4194,
    "dropoffLat": 37.8044,
    "dropoffLng": -122.2712,
    "vehicleType": "economy"
  }'

# With auth (use token from signup/login response)
curl -X GET http://localhost:3000/api/v1/trips/trip-id `
  -H "Authorization: Bearer <access_token>"
```

### Connect Mobile App to API

In `mobile/lib/main.dart`:
```dart
// Update API base URL (currently hardcoded to localhost)
const String API_BASE_URL = 'http://10.0.2.2:3000'; // Android emulator
const String API_BASE_URL = 'http://localhost:3000';  // iOS simulator
```

### Run Tests

```bash
cd api
npm test
```

### Build for Production

```bash
# API
cd api
npm run build
docker build -f ../infrastructure/Dockerfile.api -t ridewave-api:latest .

# Admin
cd admin
npm run build
docker build -f ../infrastructure/Dockerfile.admin -t ridewave-admin:latest .

# Mobile (release APK/IPA)
cd mobile
flutter build apk --release
flutter build ios --release
```

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module '@nestjs/common'` | Dependencies not installed | `npm install` in `/api` |
| `Port 3000 already in use` | Another service running | `lsof -i :3000` (macOS) or `netstat -ano \| findstr :3000` (Windows) |
| `Database connection error` | Postgres not running | `docker-compose up -d postgres` |
| `Flutter build fails` | Missing packages | `flutter pub get && flutter clean` |
| `CORS error from mobile` | API not allowing origin | Enable CORS in `main.ts` |

## Environment Variables

**API** (`.env` or via Docker):
```
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLIC_KEY=pk_test_xxx
DATABASE_URL=postgresql://user:pass@localhost:5432/ridewave
REDIS_URL=redis://localhost:6379
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
NODE_ENV=development
```

**Admin** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Git Workflow (Recommended)

```bash
# Create feature branch
git checkout -b feature/add-driver-rating

# Make changes, commit
git add .
git commit -m "feat: add driver rating endpoint"

# Push & create PR
git push origin feature/add-driver-rating

# On approval & merge to develop → deploys to staging
# On merge to main → manual approval for production
```

## Monitoring & Debugging

### Check API Logs
```bash
docker-compose logs -f api
```

### Check Database
```bash
psql postgresql://ridewave:ridewave_dev_password@localhost:5432/ridewave
# Then: SELECT * FROM users LIMIT 5;
```

### Monitor WebSocket Connections
```bash
# Check active Socket.IO clients in Prometheus/Grafana dashboard
# Or log in socket connection handlers in main.ts
```

## Performance Tips

- Use `/trips/estimate` to prefetch fare (no DB call)
- Cache frequent queries in Redis
- Index geospatial queries on `drivers.current_location`
- Batch location updates (send every 5s, not every 1s)
- Compress responses with gzip middleware

## Security Checklist Before Launch

- [ ] Set strong `JWT_SECRET` (32+ random chars)
- [ ] Enable HTTPS/TLS (Let's Encrypt)
- [ ] Hide error messages in production
- [ ] Rate limit public endpoints (OTP send, signup)
- [ ] Enable CORS only for your domains
- [ ] Rotate Stripe keys
- [ ] Set up audit logging
- [ ] Enable database backups
- [ ] Configure WAF (Web Application Firewall)
- [ ] Run security scan: `npm audit`

## Resources

- API Spec: `openapi.yaml`
- Testing: `postman_collection.json`
- Setup: `SETUP.md`
- Operations: `RUNBOOK.md`
- Database: `ERD.md`
- Legal: `PRIVACY_POLICY.md`, `TERMS_OF_SERVICE.md`

## Quick Commands

```powershell
# Start everything locally
cd ./
docker-compose up -d
cd api && npm install && npm run start:dev
# In another terminal:
cd admin && npm install && npm run dev

# Test API
curl -X POST http://localhost:3000/api/v1/trips/estimate `
  -H "Content-Type: application/json" `
  -d '{"pickupLat":37.7749,"pickupLng":-122.4194,"dropoffLat":37.8044,"dropoffLng":-122.2712,"vehicleType":"economy"}'

# View logs
docker-compose logs -f api

# Cleanup
docker-compose down -v
```

---

**Last Updated:** November 14, 2025
