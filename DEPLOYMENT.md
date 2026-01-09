# Metalex SaaS - Deployment Guide

## Production Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (`npm run test`)
- [ ] Type checking passed (`npm run type-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] Security audit completed

## Deployment Platforms

### 1. Vercel (Recommended)

**Advantages:**
- Zero-config deployment
- Automatic HTTPS
- CDN included
- Environment variables management
- Preview deployments

**Setup:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

**Environment Variables in Vercel:**
- Go to Project Settings → Environment Variables
- Add `VITE_API_BASE_URL` pointing to your API
- Add other required variables

### 2. Netlify

**Setup:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### 3. Self-Hosted (Docker)

**Dockerfile:**
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 3000
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]
```

**Build and run:**
```bash
docker build -t metalex-saas .
docker run -p 3000:3000 metalex-saas
```

### 4. AWS (EC2/S3)

**S3 Static Hosting:**
```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist s3://your-bucket-name --delete

# Optional: Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### 5. DigitalOcean App Platform

**Configuration:**
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set run command: `npm start` (or use static site option)
4. Add environment variables
5. Deploy

## Environment Configuration

### Production Variables (.env.production)
```env
VITE_API_BASE_URL=https://api.metalex.com
VITE_APP_NAME=Metalex SaaS
VITE_APP_VERSION=1.0.0
VITE_SENTRY_DSN=your-sentry-dsn
VITE_ANALYTICS_ID=your-ga-id
```

## Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm run build -- --analyze

# Enable compression
# Add to vite.config.ts
import compression from 'vite-plugin-compression'
```

### Runtime Optimization
- Code splitting enabled by default
- Lazy loading for routes
- Image optimization
- CSS minification

## Security Hardening

### HTTPS
- Enable HTTPS on your domain
- Set HSTS header
- Use secure cookies

### CORS Configuration
```typescript
// Backend should configure:
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

### Security Headers
```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

## Monitoring & Analytics

### Error Tracking (Sentry)
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Performance Monitoring
- Use Lighthouse CI
- Set up Web Vitals monitoring
- Configure RUM (Real User Monitoring)

### Database Monitoring
- Monitor slow queries
- Set up connection pooling
- Regular backups (daily)

## Scaling Considerations

### Database
- Connection pooling with PgBouncer
- Read replicas for reporting
- Caching layer (Redis)
- Regular VACUUM and ANALYZE

### API
- Load balancing
- Rate limiting
- API versioning
- Caching headers

### Frontend
- CDN for static assets
- Image compression
- Code splitting
- Service Workers for offline

## Maintenance

### Regular Tasks
- **Weekly**: Monitor logs and error rates
- **Monthly**: Security patches, dependency updates
- **Quarterly**: Performance review, capacity planning
- **Yearly**: Security audit, disaster recovery test

### Backup Strategy
```bash
# Daily backups
0 2 * * * pg_dump dbname > /backup/db_$(date +\%Y\%m\%d).sql

# Retention: Keep 30 days of backups
find /backup -name "db_*.sql" -mtime +30 -delete
```

## Rollback Procedure

### Vercel
- Automatic rollback available in Deployment History
- Click "Redeploy" on previous version

### Docker
```bash
# Tag new version
docker tag metalex-saas:latest metalex-saas:v1.0.0

# Rollback to previous
docker pull metalex-saas:v0.9.9
docker run -d metalex-saas:v0.9.9
```

## Troubleshooting

### Common Issues

**500 Errors:**
- Check API connectivity
- Verify database connection
- Check environment variables

**Slow Load Times:**
- Analyze bundle size
- Check CDN configuration
- Monitor database queries

**PDF Generation Fails:**
- Verify memory allocation
- Check file permissions
- Test with smaller documents

## Compliance & Legal

### GDPR
- Data retention policies
- User deletion procedures
- Privacy policy linked

### Data Protection
- Encryption at rest
- Encryption in transit
- Access logs
- Regular security audits

## Support & Issues

### Getting Help
- Check deployment logs
- Verify all environment variables
- Test API connectivity
- Check browser console

### Contact
- support@metalex.com
- Documentation: https://docs.metalex.com
- Status: https://status.metalex.com
