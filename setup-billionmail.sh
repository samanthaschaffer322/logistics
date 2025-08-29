#!/bin/bash

# BillionMail Setup Script for LogiAI
echo "🚀 Setting up BillionMail for LogiAI Email System..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Install BillionMail
echo "📧 Installing BillionMail..."
cd /opt
git clone https://github.com/aaPanel/BillionMail
cd BillionMail

# Run BillionMail installer
echo "⚙️ Running BillionMail installer..."
bash install.sh

echo "✅ BillionMail installation completed!"
echo ""
echo "🔧 Next Steps:"
echo "1. Access BillionMail web interface at: http://your-server-ip:8080"
echo "2. Complete the setup wizard"
echo "3. Add your domain and verify DNS records"
echo "4. Update your LogiAI .env.local file with:"
echo "   SMTP_HOST=your-server-ip"
echo "   SMTP_PORT=587"
echo "   SMTP_USER=logiai@yourdomain.com"
echo "   SMTP_PASS=your-password"
echo ""
echo "📧 Your LogiAI app will then send REAL emails to andantecampion@proton.me!"
