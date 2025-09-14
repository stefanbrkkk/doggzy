# Doggzy - Global Dog Rescue Charity Website

A world-class, emotionally moving, and visually dynamic fundraising + e-commerce website for Doggzy, a global dog rescue charity. The platform inspires donations, drives merchandise sales, and complies with international nonprofit and tax regulations.

## 🌟 Features

### 🎯 Core Functionality
- **Dual Functionality**: Donation hub + merchandise store
- **Emotional Design**: Cinematic storytelling with heartwarming imagery
- **Global Compliance**: Tax-deductible donations, VAT handling, GDPR/CCPA compliance
- **Impact Tracking**: Real-time statistics and progress visualization

### 💝 Donation System
- One-time and recurring donations
- Sponsor-a-pet profiles with live updates
- Tax-compliant receipts (IRS, UK Gift Aid, EU VAT)
- Multiple payment methods (Stripe, PayPal)
- Automated branded receipts with rescue photos

### 🛍️ E-commerce Store
- Curated, eco-friendly dog products
- Print-on-demand apparel
- Custom dog portraits
- GPS collars and eco-friendly beds
- Transparent profit routing to shelters

### 🎨 Visual Design
- Bold, futuristic typography with heartwarming imagery
- Flashy, high-end animations and microinteractions
- Parallax scrolling and hover effects
- Real-time counters and animated progress bars
- 3D/AR features for interactive experiences

### 🌍 Global Features
- Multi-language support
- Global partner network visualization
- Regional compliance handling
- Currency localization

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **3D Graphics**: Three.js + React Three Fiber
- **UI Components**: Radix UI + Custom components
- **Payments**: Stripe + PayPal
- **Forms**: React Hook Form + Zod validation
- **State Management**: React hooks + Context
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Homepage
│   ├── donate/            # Donation pages
│   ├── shop/              # E-commerce pages
│   ├── sponsor/           # Sponsor a pet pages
│   ├── admin/             # CMS admin dashboard
│   ├── privacy/           # Legal pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/                # Base UI components
│   ├── hero-section.tsx   # Homepage hero
│   ├── impact-stats.tsx   # Statistics display
│   ├── success-stories.tsx # Story showcase
│   ├── global-partners.tsx # Partner network
│   ├── donation/          # Donation components
│   ├── shop/              # E-commerce components
│   ├── sponsor/           # Sponsorship components
│   ├── navigation.tsx     # Site navigation
│   └── footer.tsx         # Site footer
└── lib/                   # Utilities and helpers
    └── utils.ts           # Common utilities
```

## 🎨 Design System

### Colors
- **Primary**: Orange (#f97316) to Red (#ef4444) gradient
- **Secondary**: Blue (#3b82f6) to Indigo (#6366f1) gradient
- **Success**: Green (#10b981) to Emerald (#059669) gradient
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Display**: Space Grotesk (headlines)
- **Body**: Inter (body text)
- **Weights**: 300-900 for full flexibility

### Animations
- **Microinteractions**: Hover effects, button animations
- **Page Transitions**: Smooth page-to-page navigation
- **Loading States**: Skeleton screens and progress indicators
- **Scroll Animations**: Reveal animations on scroll

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd doggzy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your configuration:
   ```env
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Pages & Features

### Homepage (`/`)
- Cinematic hero section with video background
- Animated statistics and impact metrics
- Success stories carousel
- Global partner network map
- Call-to-action sections

### Donation Hub (`/donate`)
- Multi-step donation form
- Preset amounts and custom input
- Recurring donation options
- Tax-deductible receipt generation
- Payment processing with Stripe

### Merchandise Store (`/shop`)
- Product catalog with filtering
- Shopping cart functionality
- Product detail pages
- Checkout process
- Order management

### Sponsor a Pet (`/sponsor`)
- Individual dog profiles
- Progress tracking for fundraising
- Medical needs and updates
- Photo galleries
- Sponsor management

### Admin Dashboard (`/admin`)
- Content management system
- Statistics overview
- Story and product management
- User activity monitoring
- Settings configuration

### Legal Pages (`/privacy`, `/terms`)
- GDPR/CCPA compliant privacy policy
- Terms of service
- Cookie policy
- Accessibility statement

## 🔧 Configuration

### Stripe Integration
The donation system integrates with Stripe for secure payment processing:

```typescript
// Example donation processing
const handleDonation = async (amount: number, frequency: string) => {
  const response = await fetch('/api/donations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, frequency })
  });
  // Process payment with Stripe
};
```

### Analytics Integration
Google Analytics 4 and Hotjar are configured for comprehensive tracking:

```typescript
// Analytics setup
import { gtag } from 'gtag';

gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: 'Doggzy Homepage',
  page_location: window.location.href
});
```

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Configure build settings for Next.js
- **AWS Amplify**: Use Next.js build specification
- **Docker**: Use the included Dockerfile

## 🔒 Security & Compliance

### Data Protection
- GDPR compliance with cookie consent
- CCPA compliance for California residents
- Secure data handling and encryption
- Regular security audits

### Payment Security
- PCI DSS compliant payment processing
- Tokenized payment information
- Fraud detection and prevention
- Secure API endpoints

### Legal Compliance
- 501(c)(3) tax-deductible donation handling
- UK Gift Aid compliance
- EU VAT regulation compliance
- Accessibility standards (WCAG 2.1)

## 📊 Performance

### Optimization Features
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Service worker for offline functionality
- CDN integration for global performance
- Lighthouse score: 95+ across all metrics

### Monitoring
- Real-time performance monitoring
- Error tracking and reporting
- User experience analytics
- Conversion funnel analysis

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
- Email: support@doggzy.org
- Documentation: [docs.doggzy.org](https://docs.doggzy.org)
- Issues: [GitHub Issues](https://github.com/doggzy/website/issues)

## 🙏 Acknowledgments

- Framer Motion for amazing animations
- Radix UI for accessible components
- Stripe for secure payment processing
- All the rescue organizations and volunteers worldwide

---

**Made with ❤️ for rescue dogs everywhere**