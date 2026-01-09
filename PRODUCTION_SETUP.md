# Production Setup Guide - Metalex SaaS

## Quick Start - Production Ready

This guide will help you set up and deploy Metalex SaaS in a production environment.

## ✅ Pre-Deployment Verification

### 1. Build Status
```bash
npm run build
# ✓ Build successful - dist folder created
```

### 2. All Dependencies Installed
```bash
npm list --depth=0
```

### 3. Type Safety
```bash
npm run type-check
# Should show 0 errors
```

## 📦 Deployment Steps

### Step 1: Environment Setup

Create `.env.production`:
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_NAME=Metalex SaaS
VITE_APP_VERSION=1.0.0
```

### Step 2: Build Optimization

The application is built with:
- ✅ Minified CSS (6.28 KB gzipped)
- ✅ Optimized JavaScript (53.24 KB gzipped main)
- ✅ Asset optimization
- ✅ Tree shaking enabled

### Step 3: Database Setup

#### PostgreSQL Connection
```bash
# Create database
createdb metalex_prod

# Set environment variables
DATABASE_URL="postgresql://user:password@localhost:5432/metalex_prod"
```

#### Run Migrations
```bash
npx prisma migrate deploy
npx prisma generate
```

### Step 4: Backend API Setup

Your backend should implement these endpoints:

```
/api/auth/login
/api/auth/me
/api/invoices
/api/clients
/api/users
/api/reports
/api/company
```

See `API_DOCS.md` for complete specification.

### Step 5: Deployment

#### Option A: Vercel (Recommended)
```bash
vercel --prod
```

#### Option B: Docker
```bash
docker build -t metalex:1.0.0 .
docker run -d -p 3000:3000 metalex:1.0.0
```

#### Option C: Manual (Any Server)
```bash
# Copy dist folder to your server
scp -r dist/* user@server:/var/www/metalex

# Configure web server (nginx example)
# See nginx.conf example below
```

## 🔧 Web Server Configuration

### Nginx
```nginx
server {
    listen 443 ssl http2;
    server_name api.metalex.com;

    ssl_certificate /etc/ssl/cert.pem;
    ssl_certificate_key /etc/ssl/key.pem;

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
        root /var/www/metalex;
    }
}
```

### Apache
```apache
<VirtualHost *:443>
    ServerName api.metalex.com
    
    DocumentRoot /var/www/metalex

    SSLEngine on
    SSLCertificateFile /etc/ssl/cert.pem
    SSLCertificateKeyFile /etc/ssl/key.pem

    <Directory /var/www/metalex>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # SPA routing
        <IfModule mod_rewrite.c>
            RewriteEngine On
            RewriteBase /
            RewriteRule ^index\.html$ - [L]
            RewriteCond %{REQUEST_FILENAME} !-f
            RewriteCond %{REQUEST_FILENAME} !-d
            RewriteRule . /index.html [L]
        </IfModule>
    </Directory>

    # Compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/json
    </IfModule>

    # Cache headers
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
</VirtualHost>
```

## 🔒 Security Checklist

- [ ] HTTPS enabled
- [ ] SSL/TLS certificate installed
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled on API
- [ ] Database credentials secured
- [ ] API keys in environment variables
- [ ] Regular backups scheduled
- [ ] Firewall rules configured
- [ ] DDoS protection enabled

## 📊 Performance Monitoring

### Key Metrics to Monitor
```
- Page Load Time: < 2s
- First Contentful Paint: < 1s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3.5s
```

### Setup Monitoring
```bash
# Using Google Analytics
VITE_GA_ID=YOUR_GA_ID

# Using Sentry for error tracking
VITE_SENTRY_DSN=YOUR_SENTRY_DSN
```

## 🔄 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrated
- [ ] Build passes without errors
- [ ] SSL certificate installed
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Monitoring setup
- [ ] Backups configured
- [ ] Team notified
- [ ] Rollback plan ready

## 🚨 Troubleshooting

### Application won't load
```bash
# Check nginx/Apache logs
tail -f /var/log/nginx/error.log
tail -f /var/log/apache2/error.log

# Check application console
# Browser DevTools → Console tab
```

### PDF generation fails
```bash
# Ensure sufficient memory
# Increase Node memory if needed
NODE_OPTIONS="--max-old-space-size=4096"
```

### Database connection errors
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check connection pool
# Edit prisma.datasource.url
```

### Slow performance
```bash
# Enable compression
# Configure caching headers
# Reduce bundle size
npm run build -- --analyze
```

## 📞 Support

- Documentation: https://docs.metalex.com
- Issues: https://github.com/metalex/saas/issues
- Email: support@metalex.com

---

**Last Updated**: January 9, 2026
**Version**: 1.0.0 Production Ready
