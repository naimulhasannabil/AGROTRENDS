# AgroTrends - Modern Sustainable Farming Platform

A comprehensive web platform dedicated to empowering farmers worldwide with knowledge, tools, and insights for sustainable agriculture. Built with modern web technologies to provide an exceptional user experience across all devices.

## 🌱 About

AgroTrends is a knowledge-sharing platform that connects farmers, agricultural experts, and enthusiasts. Our mission is to promote sustainable farming practices through expert blogs, community Q&A, premium courses, and market insights.

## ✨ Features

### 🏠 Core Pages
- **Home**: Hero section with featured content and quick access to all services
- **About Us**: Mission statement, team profiles, and company values
- **Blogs**: Expert articles with category filtering and search functionality
- **Products**: Sustainable farming tools and supplies marketplace
- **Courses**: Premium online courses for skill development
- **Q&A**: Community-driven question and answer platform
- **Events**: Agricultural conferences, workshops, and networking events

### 🎨 Design Features
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Modern UI**: Clean, professional interface with subtle animations
- **Accessibility**: WCAG compliant with proper contrast ratios
- **Performance**: Optimized images and efficient component structure
- **SEO Ready**: Semantic HTML and meta tag optimization

### 🔧 Technical Features
- **React Router**: Client-side routing for seamless navigation
- **Component Architecture**: Modular, reusable components
- **Tailwind CSS**: Utility-first styling with custom design system
- **Form Handling**: Interactive forms with validation
- **Newsletter Integration**: Email subscription functionality
- **Search & Filter**: Dynamic content filtering capabilities

## 🚀 Tech Stack

- **Frontend Framework**: React 18.3.1
- **Styling**: Tailwind CSS 3.4.1
- **Build Tool**: Vite 5.4.2
- **Routing**: React Router DOM 6.22.3
- **Icons**: React Icons 5.0.1
- **Language**: JavaScript (ES6+)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/naimulhasannabil/AGROTRENDS.git
   cd AgroTrends
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BlogCard.jsx    # Blog post card component
│   ├── CategoryFilter.jsx # Category filtering component
│   ├── FeatureCard.jsx # Feature showcase card
│   ├── Footer.jsx      # Site footer
│   ├── HeroSection.jsx # Hero section component
│   ├── Logo.jsx        # Brand logo component
│   ├── Navbar.jsx      # Navigation bar
│   ├── Newsletter.jsx  # Newsletter subscription
│   └── TeamMember.jsx  # Team member card
├── layouts/            # Layout components
│   └── Layout.jsx      # Main layout wrapper
├── pages/              # Page components
│   ├── About.jsx       # About us page
│   ├── Blogs.jsx       # Blog listing page
│   ├── Courses.jsx     # Courses page
│   ├── Events.jsx      # Events page
│   ├── Home.jsx        # Homepage
│   ├── NotFound.jsx    # 404 error page
│   ├── Products.jsx    # Products page
│   ├── QA.jsx          # Q&A page
│   ├── SignIn.jsx      # Sign in page
│   └── SignUp.jsx      # Sign up page
├── App.jsx             # Main app component
├── main.jsx            # App entry point
└── index.css           # Global styles
```

## 🎨 Design System

### Color Palette
- **Primary Green**: #15803d (with 50-950 shades)
- **Neutral Grays**: For text and backgrounds
- **Semantic Colors**: Success, warning, and error states

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Responsive Scaling**: Fluid typography across breakpoints

### Spacing
- **Base Unit**: 8px
- **Consistent Scale**: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

## 🔧 Customization

### Adding New Pages
1. Create a new component in `src/pages/`
2. Add the route to `src/App.jsx`
3. Update navigation in `src/components/Navbar.jsx`

### Modifying Colors
Update the color palette in `tailwind.config.js`:
```javascript
colors: {
  primary: {
    // Your custom color shades
  }
}
```

### Adding Components
Create new components in `src/components/` following the existing patterns:
- Use functional components with hooks
- Implement proper prop validation
- Follow responsive design principles

## 🌐 Deployment

### Netlify (Recommended)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure redirects for client-side routing

### Other Platforms
The built application is a static site that can be deployed to:
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## 🔮 Future Enhancements

- [ ] User authentication system
- [ ] Database integration for dynamic content
- [ ] Payment processing for courses and products
- [ ] Real-time chat for Q&A section
- [ ] Mobile app development
- [ ] Advanced search with filters
- [ ] User profiles and dashboards
- [ ] Content management system
- [ ] Multi-language support
- [ ] Progressive Web App (PWA) features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request


## 🙏 Acknowledgments

- **Pexels**: For providing high-quality stock images
- **Tailwind CSS**: For the utility-first CSS framework
- **React Community**: For the excellent ecosystem and tools
- **Agricultural Experts**: For inspiring the content and mission

---

**Built with ❤️ for the farming community**
