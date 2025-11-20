# RideWave — On-demand Ride-hailing Platform

Monorepo scaffold for RideWave: Rider, Driver mobile apps (Flutter), Backend API (NestJS/Node), Admin dashboard (Next.js), and Infrastructure IaC.

Tech choices (decided):
- Mobile: Flutter (Dart)
- Backend: Node.js + TypeScript (NestJS)
- Realtime: Socket.IO (WebSockets)
- Database: PostgreSQL + PostGIS
- Cache/pubsub: Redis
- Payments: Stripe
- Storage: AWS S3

Repository layout
```
/
  /mobile         # Flutter app (rider & driver)
  /api            # Backend services (NestJS)
  /admin          # Admin dashboard (Next.js)
  /infrastructure # Terraform / Docker / CI configs
```

Quick start (Windows PowerShell)

1) Mobile (Flutter)

```powershell
# Install Flutter SDK and set up PATH
# From repo root:
cd ./mobile
flutter pub get
flutter run -d <device>
```

2) API (local dev)

```powershell
cd ./api
npm install
npm run start:dev
```

3) Admin (local dev)

```powershell
cd ./admin
npm install
npm run dev
```

Next steps:
- Implement auth, trips, driver matching, payments integration.
- Add Terraform and CI/CD pipelines in `/infrastructure`.

See individual READMEs for per-project details.
