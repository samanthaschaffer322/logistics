# LogiAI - AI-Powered Logistics Management Platform

LogiAI is a unified AI-powered web application that replaces multiple logistics roles (Logistics Manager, Warehouse Manager, Transportation Manager, Distribution Manager, Procurement Manager) with intelligent automation and insights.

## 🚀 Features

### 🔐 User Management
- Email/password authentication via Supabase
- Role-based access control (admin, warehouse, transport, distribution, procurement)
- Activity logging for all users

### 📦 Warehouse Management
- Real-time inventory tracking
- Stock in/out record keeping
- Smart reorder suggestions with AI
- Low stock alerts and recommendations

### 🚚 Transportation Management
- Fleet tracking with real-time GPS
- Driver assignments & schedules
- Route optimization using AI
- Maintenance alerts

### 📤 Distribution Management
- Order fulfillment workflow
- Dispatch scheduling
- Delivery status updates

### 📥 Procurement Management
- Supplier database
- Smart purchase request generation
- AI evaluation of Incoterm conditions
- Vendor recommendations

### 🌐 Logistics Manager Dashboard
- Visualized analytics of logistics KPIs
- Daily/weekly/monthly reports
- Notifications on bottlenecks
- AI-suggested workflow optimizations

### 🧠 AI Integration
- Chat & recommendation engine
- Learn from uploaded files (Excel logistics plans)
- Forecast inventory demand
- Auto-generate procurement and delivery plans

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 + React + TypeScript + TailwindCSS |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| AI/ML | Ollama (DeepSeek-R1, Gemma3n) |
| File Parsing | Python (Pandas) + Ollama |
| Maps/Geo | Mapbox / OpenStreetMap |
| Fleet Management | Fleetbase clone integration |

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ and npm
- Git
- Supabase account
- Ollama (for local AI)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/logistics.git
cd logistics
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy the database schema from `supabase/schema.sql` and run it in your Supabase SQL editor

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Ollama Configuration (for local AI)
OLLAMA_BASE_URL=http://localhost:11434

# Mapbox Configuration (optional)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Set Up Ollama (Optional - for AI features)

Install Ollama and download the required models:

```bash
# Install Ollama (macOS)
brew install ollama

# Start Ollama service
ollama serve

# Download AI models
ollama pull deepseek-r1
ollama pull gemma2
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

The application uses the following main tables:

- **users** - User authentication and roles
- **warehouse** - Warehouse locations and managers
- **inventory** - Stock items and quantities
- **fleet** - Vehicle and driver information
- **driver_schedule** - Driver assignments and routes
- **distribution_orders** - Customer orders and deliveries
- **procurement** - Purchase orders and suppliers
- **uploaded_plans** - AI learning from uploaded files

## 🔧 Configuration

### Supabase Setup

1. **Authentication**: Enable email/password authentication in Supabase Auth settings
2. **Row Level Security**: The schema includes RLS policies for secure data access
3. **Storage**: Set up a bucket for file uploads (logistics plans, documents)

### Role-Based Access

The application supports 5 user roles:
- **admin**: Full access to all modules
- **warehouse**: Inventory and warehouse management
- **transport**: Fleet and transportation management
- **distribution**: Order fulfillment and delivery
- **procurement**: Purchase orders and supplier management

## 🚀 Deployment

### Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `out` (if using static export) or `.next` (for SSR)
4. Add environment variables in Cloudflare Pages settings

### Vercel

```bash
npm install -g vercel
vercel
```

### Docker

```bash
docker build -t logiai .
docker run -p 3000:3000 logiai
```

## 🤖 AI Features

### File Learning Engine

Upload Excel files containing logistics plans, and the AI will:
- Parse and understand the structure
- Learn from templates and patterns
- Improve suggestion models over time
- Generate optimized plans based on historical data

### Smart Recommendations

The AI provides intelligent suggestions for:
- Inventory reorder points and quantities
- Optimal delivery routes
- Supplier selection based on Incoterms
- Demand forecasting

## 🔗 Integrations

### Fleetbase Integration

For advanced fleet management features, integrate with Fleetbase:

1. Clone relevant modules from the Fleetbase repository
2. Adapt the API endpoints for your use case
3. Integrate real-time GPS tracking
4. Use their route optimization algorithms

### Lovable Integration

Connect with Lovable for enhanced development workflow:

1. Import your project structure
2. Use AI-assisted development features
3. Collaborate on feature development
4. Deploy directly from Lovable

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices
- Progressive Web App (PWA) capabilities

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

## 📈 Monitoring and Analytics

- Built-in activity logging
- Performance monitoring with Supabase
- Custom analytics dashboard
- Error tracking and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Contact the development team

## 🗺️ Roadmap

- [ ] Advanced AI model integration
- [ ] Real-time GPS tracking
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] API documentation
- [ ] Third-party integrations (ERP, CRM)

---

Built with ❤️ using Next.js, Supabase, and AI
# SSL Fix - Thu 14 Aug 2025 14:08:54 +07
