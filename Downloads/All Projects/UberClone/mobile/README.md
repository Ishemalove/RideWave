RideWave Mobile (Flutter)

This folder contains the Flutter app skeleton for Rider and Driver.

Getting started (Windows PowerShell):

1) Install Flutter from https://flutter.dev and add to PATH.

2) From this directory:

```powershell
flutter pub get
flutter run -d <device>
```

Notes:
- This is a minimal skeleton. Implement screens: HomeMap, RequestFlow, TripInProgress, DriverAcceptModal, Auth, Profile, Payments.
- Use `google_maps_flutter` (or Mapbox via plugin) for maps. Use `socket_io_client` for realtime.
- Configure Android/iOS native settings for Google Maps API keys and push notifications.
