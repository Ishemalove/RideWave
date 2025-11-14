# RideWave Operations Runbook

## Incident Response

### 1. API Service Down

**Symptoms:** Users cannot create trips or login.

**Steps:**
1. Check API logs: `kubectl logs -n ridewave deployment/api`
2. Check database connectivity: `psql postgresql://user:pass@postgres:5432/ridewave -c "SELECT 1"`
3. Verify Redis: `redis-cli ping`
4. Restart API pods: `kubectl rollout restart deployment/api -n ridewave`
5. Monitor dashboards (Grafana) for recovery

**Prevention:**
- Set up liveness/readiness probes in Kubernetes
- Enable auto-scaling for API pods

### 2. Database Performance Degradation

**Symptoms:** Slow trip creation, timeouts on distance queries.

**Steps:**
1. Check slow query logs: `tail -f /var/log/postgres/slow.log`
2. Analyze index usage: `EXPLAIN ANALYZE SELECT ...`
3. Check geospatial index freshness (especially `drivers.current_location`)
4. Run VACUUM and ANALYZE: `VACUUM ANALYZE;`
5. Scale read replicas if needed

**Prevention:**
- Monitor query performance with Prometheus
- Regular maintenance windows for index reorg
- Alert on queries taking > 1 second

### 3. Surge Pricing Errors

**Symptoms:** Riders complain about incorrect surge multiplier.

**Steps:**
1. Check surge config in admin dashboard
2. Verify Redis cache: `redis-cli GET surge:nyc:peak`
3. Check last surge calculation timestamp
4. Manually trigger surge recalculation or restart matching service
5. Review audit logs for who changed surge settings

**Fix:** Update surge multiplier via admin UI → Settings → Pricing → Surge Multiplier

**Prevention:**
- Log all pricing changes
- Require admin approval for surge > 2.0x
- Set alerts for unusual surge spikes

### 4. Stripe Payment Processing Failures

**Symptoms:** Payment intents fail, riders cannot complete payment.

**Steps:**
1. Check Stripe dashboard for errors: https://dashboard.stripe.com
2. Review payment service logs: `kubectl logs -n ridewave deployment/payments`
3. Check if Stripe test mode is accidentally enabled in production
4. Verify webhook signatures are correct: `grep STRIPE_WEBHOOK_SECRET env`
5. Contact Stripe support if API key is compromised

**Recovery:**
- Switch to Stripe backup/fallback processor if configured
- Manually refund failed transactions
- Communicate with affected riders

### 5. Driver Location Stale/Missing

**Symptoms:** Riders see old driver location, matching is poor.

**Steps:**
1. Check Redis Geo data: `GEOHASH driver_locations *`
2. Verify WebSocket connections active: `netstat -an | grep :3000`
3. Check if driver's location update is being sent: check app logs
4. Verify PostGIS is indexing properly: `SELECT * FROM drivers WHERE id = '<driver_id>'`
5. Restart location streaming service if needed

**Prevention:**
- Monitor active Socket.IO connections
- Alert if fewer than X drivers updating location every 10s
- Implement fallback to periodic HTTP location updates

### 6. OTP Delivery Failures

**Symptoms:** Users cannot receive SMS OTP codes.

**Steps:**
1. Check SMS provider logs (Twilio, MessageBird)
2. Verify phone number format (must include country code: +1234567890)
3. Check if rate limits hit: `redis-cli GET otp:rate_limit:<phone>`
4. Review provider status page for outages
5. Test manually: curl -X POST http://localhost:3000/api/v1/auth/otp/send

**Recovery:**
- Implement fallback to email OTP
- Extend OTP timeout temporarily if provider is slow
- Notify users of delays

### 7. Runaway Matching Algorithm

**Symptoms:** Same driver is being assigned multiple trips simultaneously, causing conflicts.

**Steps:**
1. Check matching service logs
2. Query database: `SELECT driver_id, COUNT(*) FROM trips WHERE status = 'accepted' GROUP BY driver_id HAVING COUNT(*) > 1`
3. Review driver assignment logic in `matching.service.ts`
4. Check for race conditions in trip acceptance
5. Disable new trip assignments temporarily if needed: Set feature flag `matching_enabled=false`

**Fix:**
- Implement row-level locking: `BEGIN; SELECT * FROM drivers WHERE id = ? FOR UPDATE; ...COMMIT;`
- Add unique constraint: `ALTER TABLE trips ADD UNIQUE (driver_id, status)`

### 8. Audit Log Explosion

**Symptoms:** Audit table grows too fast, query performance hits.

**Steps:**
1. Check audit log volume: `SELECT COUNT(*) FROM audit_logs WHERE timestamp > NOW() - INTERVAL '1 day'`
2. Identify which action is being logged excessively
3. Adjust logging level: reduce frequency for "location_update" or similar high-volume actions
4. Archive old logs: `COPY audit_logs TO '/backup/audit_logs_old.csv' WHERE timestamp < NOW() - INTERVAL '1 year'`
5. Delete archived rows: `DELETE FROM audit_logs WHERE timestamp < NOW() - INTERVAL '1 year'`

### 9. SSL Certificate Expiry

**Symptoms:** Browser warnings, API clients fail TLS handshake.

**Steps:**
1. Check cert expiry: `openssl s_client -connect api.ridewave.com:443 -showcerts | grep "notAfter"`
2. If expiring soon: Regenerate cert via Let's Encrypt or provider
3. Update cert in Kubernetes: `kubectl create secret tls api-tls --cert=cert.pem --key=key.pem --dry-run=client -o yaml | kubectl apply -f -`
4. Restart API pods to pick up new cert

**Prevention:**
- Enable automatic cert renewal (Let's Encrypt with cert-manager)
- Set alerts 30 days before expiry

### 10. Data Privacy Request (GDPR/CCPA)

**Symptoms:** Legal request to delete or export user data.

**Steps:**
1. Verify request authenticity (ask for government ID)
2. Identify user by email/phone
3. Export data: `SELECT * FROM users WHERE email = ? ... (join all tables)`
4. Delete user & related data:
   ```sql
   BEGIN;
   DELETE FROM ratings WHERE rater_id = ? OR ratee_id = ?;
   DELETE FROM payments WHERE rider_id = ?;
   DELETE FROM trips WHERE rider_id = ? OR driver_id = ?;
   DELETE FROM drivers WHERE user_id = ?;
   DELETE FROM users WHERE id = ?;
   COMMIT;
   ```
5. Confirm deletion with requester within 30 days

**Prevention:**
- Implement data export function in admin UI
- Automate right-to-be-forgotten workflow

## Deployment Procedures

### Blue-Green Deployment

```bash
# 1. Deploy new version to "green" environment
kubectl apply -f api-deployment-green.yaml

# 2. Run smoke tests against green
./smoke-tests.sh http://api-green:3000

# 3. Switch traffic (update service selector)
kubectl patch service api -p '{"spec":{"selector":{"version":"green"}}}'

# 4. Monitor metrics for 5 minutes
watch kubectl get pods

# 5. Keep blue for quick rollback
# To rollback: kubectl patch service api -p '{"spec":{"selector":{"version":"blue"}}}'
```

### Database Migration

```bash
# 1. Take backup
pg_dump postgresql://user:pass@postgres:5432/ridewave > backup_$(date +%s).sql

# 2. Run migration (test in dev first!)
psql postgresql://user:pass@postgres:5432/ridewave -f migrations/001_add_new_column.sql

# 3. Verify
psql -c "SELECT * FROM new_table LIMIT 1;"

# 4. If error, rollback from backup
psql postgresql://user:pass@postgres:5432/ridewave < backup_*.sql
```

## Monitoring & Alerts

### Key Metrics to Watch

- **API response time:** P95 < 200ms, P99 < 500ms
- **Trip creation rate:** Expected ~100/hour during peak
- **Driver availability:** > 50 online drivers during peak hours
- **Payment success rate:** > 99%
- **WebSocket connections:** Should scale with trip volume
- **Database query time:** P95 < 50ms

### Sentry Alerts

- 5xx errors > 10 in 5 minutes → Page on-call
- OOM errors → Investigate memory leak
- Database connection pool exhausted → Scale DB connections

### Custom Dashboards (Grafana)

- Trip volume (by hour, by zone)
- Revenue trends
- Driver earnings distribution
- Customer satisfaction (avg rating)

## Security Checklist (Weekly)

- [ ] Review failed login attempts (brute force?)
- [ ] Check for unusual geographic patterns (fraud?)
- [ ] Audit admin actions
- [ ] Review payment refunds (legitimate?)
- [ ] Check for driver rating anomalies
- [ ] Monitor for rate limit abuse

## Communication

### On-call Contact

**Primary:** [Phone/Slack] @oncall-engineer  
**Backup:** [Phone/Slack] @backup-engineer  
**Manager:** [Contact] @engineering-manager

### Status Page

Post updates to https://status.ridewave.com (Statuspage.io or similar)

- Incident declared
- ETA for resolution
- All-clear when resolved

## Runbook Updates

- Review quarterly
- Update after each incident post-mortem
- Keep URL accessible to all team members

---

*Last Updated: November 2025*
