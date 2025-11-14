# RideWave Terraform Infrastructure (AWS)

Placeholder for production infrastructure as code.

## Required Resources

- **EKS Cluster** (Kubernetes) or **ECS** for container orchestration
- **RDS Instance** (PostgreSQL 14 with PostGIS)
- **ElastiCache** (Redis cluster)
- **S3 Buckets** (user/driver documents, receipts)
- **ALB/NLB** (Load balancing)
- **CloudFront** (CDN for static assets)
- **IAM Roles** (RBAC for services)
- **Security Groups** (Network policies)
- **CloudWatch** (Monitoring & Logs)
- **SQS/SNS** (Message queue and notifications)

## Next Steps

1. Create `main.tf` with provider and networking setup.
2. Add `rds.tf` for Postgres + PostGIS.
3. Add `eks.tf` or `ecs.tf` for container orchestration.
4. Add `s3.tf` for storage.
5. Add `outputs.tf` to export resource IDs.
6. Use `terraform apply` to provision resources.

## Example Commands

```bash
terraform init
terraform plan
terraform apply
```

See subdirectories for individual component configs.
