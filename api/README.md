RideWave API (NestJS skeleton)

This folder contains a minimal NestJS service skeleton.

Setup (PowerShell):

```powershell
cd ./api
npm install
npm run start:dev
```

The service listens on port 3000 by default.

Next tasks:
- Implement auth module, trips module, drivers module.
- Add database (TypeORM/Prisma) and migrations, configure Postgres + PostGIS.
- Add Redis + Socket.IO for realtime channels.
