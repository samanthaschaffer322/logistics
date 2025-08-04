# 🚀 LogiAI Deployment Guide

This guide will help you deploy LogiAI to production using Supabase, GitHub, and Cloudflare Pages.

## 📋 Prerequisites

- GitHub account
- Supabase account
- Cloudflare account
- Domain name (optional)

## 🗄️ Step 1: Set Up Supabase Database

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `logiai-production`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 1.2 Configure Database Schema

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy the entire content from `supabase/schema.sql`
4. Paste it into the SQL editor
5. Click **Run** to execute the schema

### 1.3 Set Up Authentication

1. Go to **Authentication** > **Settings**
2. Configure **Site URL**: `https://your-domain.com` (or your Cloudflare Pages URL)
3. Add **Redirect URLs**:
   - `https://your-domain.com/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)
4. Enable **Email** provider
5. Configure email templates if needed

### 1.4 Get API Keys

1. Go to **Settings** > **API**
2. Copy your:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIs...`)

## 🐙 Step 2: Set Up GitHub Repository

### 2.1 Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click **New repository**
3. Repository details:
   - **Name**: `logiai-app`
   - **Description**: `AI-Powered Logistics Management Platform`
   - **Visibility**: Private (recommended) or Public
4. Click **Create repository**

### 2.2 Push Your Code

```bash
# Navigate to your project directory
cd /Users/aelitapham/Development/logistics

# Add GitHub remote (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/logiai-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2.3 Set Up Repository Settings

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Add the following repository secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

## ☁️ Step 3: Deploy to Cloudflare Pages

### 3.1 Connect GitHub Repository

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages**
3. Click **Create a project**
4. Choose **Connect to Git**
5. Select **GitHub** and authorize Cloudflare
6. Choose your `logiai-app` repository
7. Click **Begin setup**

### 3.2 Configure Build Settings

**Build configuration:**
- **Framework preset**: Next.js
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Root directory**: `/` (leave empty)

**Environment variables:**
Add the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://your-app.pages.dev
NODE_VERSION=18
```

### 3.3 Deploy

1. Click **Save and Deploy**
2. Wait for the build to complete (usually 2-5 minutes)
3. Your app will be available at `https://your-app.pages.dev`

### 3.4 Custom Domain (Optional)

1. In Cloudflare Pages, go to your project
2. Navigate to **Custom domains**
3. Click **Set up a custom domain**
4. Enter your domain name
5. Follow the DNS configuration instructions

## 🔧 Step 4: Post-Deployment Configuration

### 4.1 Update Supabase Settings

1. Go back to your Supabase project
2. Navigate to **Authentication** > **Settings**
3. Update **Site URL** to your production URL
4. Add your production URL to **Redirect URLs**

### 4.2 Test Your Deployment

1. Visit your deployed application
2. Test user registration and login
3. Verify all features work correctly
4. Check browser console for any errors

### 4.3 Set Up Database Seed Data (Optional)

Create initial data for testing:

```sql
-- Insert sample warehouse
INSERT INTO warehouse (name, location, manager_id) VALUES 
('Main Warehouse', 'Ho Chi Minh City, Vietnam', (SELECT id FROM users WHERE role = 'admin' LIMIT 1));

-- Insert sample inventory items
INSERT INTO inventory (item_name, sku, quantity, reorder_level, warehouse_id) VALUES 
('Laptop Computer', 'LAP-001', 50, 10, (SELECT id FROM warehouse LIMIT 1)),
('Office Chair', 'CHR-001', 25, 5, (SELECT id FROM warehouse LIMIT 1)),
('Printer Paper', 'PPR-001', 100, 20, (SELECT id FROM warehouse LIMIT 1));
```

## 🔄 Step 5: Set Up Continuous Deployment

### 5.1 Automatic Deployments

Cloudflare Pages automatically deploys when you push to your main branch:

```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push origin main
```

### 5.2 Preview Deployments

- Every pull request creates a preview deployment
- Test changes before merging to main
- Preview URLs are automatically generated

## 🤖 Step 6: Set Up Ollama for AI Features (Optional)

### 6.1 Local Development

```bash
# Install Ollama
brew install ollama

# Start Ollama service
ollama serve

# Download models
ollama pull deepseek-r1
ollama pull gemma2
```

### 6.2 Production AI Setup

For production AI features, consider:

1. **Hosted Ollama**: Deploy Ollama on a VPS or cloud server
2. **OpenAI API**: Use OpenAI's API for production
3. **Hugging Face**: Use Hugging Face Inference API

Update your environment variables accordingly:

```
OLLAMA_BASE_URL=https://your-ollama-server.com
# or
OPENAI_API_KEY=your-openai-key
```

## 🔗 Step 7: Connect to Lovable (Optional)

### 7.1 Import Project to Lovable

1. Go to [lovable.dev](https://lovable.dev)
2. Sign in with your GitHub account
3. Click **Import Project**
4. Select your `logiai-app` repository
5. Follow the import wizard

### 7.2 Configure Lovable

1. Set up environment variables in Lovable
2. Configure deployment settings
3. Enable AI-assisted development features

## 📊 Step 8: Monitoring and Analytics

### 8.1 Supabase Analytics

- Monitor database performance
- Track API usage
- Set up alerts for errors

### 8.2 Cloudflare Analytics

- Monitor website traffic
- Track performance metrics
- Set up uptime monitoring

### 8.3 Error Tracking

Consider adding error tracking:

```bash
npm install @sentry/nextjs
```

## 🔒 Step 9: Security Checklist

- [ ] Enable Row Level Security (RLS) in Supabase
- [ ] Configure proper CORS settings
- [ ] Set up SSL/TLS certificates
- [ ] Enable Cloudflare security features
- [ ] Regular security updates
- [ ] Monitor for vulnerabilities

## 🚀 Step 10: Performance Optimization

### 10.1 Cloudflare Optimizations

- Enable **Auto Minify** for CSS, JS, HTML
- Enable **Brotli compression**
- Configure **Caching rules**
- Enable **Rocket Loader**

### 10.2 Next.js Optimizations

- Use **Image Optimization**
- Enable **Static Generation** where possible
- Implement **Code Splitting**
- Optimize **Bundle Size**

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (use 18+)
   - Verify environment variables
   - Check for TypeScript errors

2. **Authentication Issues**
   - Verify Supabase URL and keys
   - Check redirect URLs
   - Ensure CORS is configured

3. **Database Connection Issues**
   - Verify Supabase project is active
   - Check RLS policies
   - Ensure proper permissions

### Getting Help

- Check Supabase documentation
- Review Cloudflare Pages docs
- Create issues in your GitHub repository
- Contact support teams if needed

## 📈 Next Steps

After successful deployment:

1. Set up monitoring and alerts
2. Configure backup strategies
3. Plan for scaling
4. Implement CI/CD improvements
5. Add more AI features
6. Integrate with third-party services

---

🎉 **Congratulations!** Your LogiAI application is now deployed and ready for production use!
