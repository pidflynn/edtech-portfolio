# EdTech Portfolio - Patrick Flynn

A professional portfolio website showcasing EdTech leadership, Computer Science teaching experience, and educational innovation at international schools.

## 🌟 Overview

This portfolio presents my journey as an EdTech Coach and IBDP/IGCSE Computer Science Teacher, highlighting strategic initiatives, curriculum development, and technology integration across international education settings.

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: [Bulma CSS Framework](https://bulma.io/)
- **Icons**: [Font Awesome](https://fontawesome.com/)
- **Fonts**: Google Fonts (Merriweather, Poppins)
- **Content Management**: JSON-based dynamic content loading
- **Hosting**: Static site (Cloudflare Pages compatible)

## 📁 Project Structure

```
edtech-portfolio/
├── README.md                 # Project documentation
├── .gitignore               # Git ignore rules
├── index.html               # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css        # Main stylesheet
│   ├── js/
│   │   └── script.js        # Interactive functionality
│   └── images/
│       ├── profile/         # Profile photos
│       ├── about/           # Personal & activity photos
│       └── favicon/         # Site icons & favicons
├── content/                 # JSON content files
│   ├── home.json           # Homepage content
│   ├── about.json          # About section content
│   ├── portfolio.json      # Project portfolio
│   ├── contact.json        # Contact information
│   └── metadata.json       # Site metadata & SEO
├── documents/
│   └── Patrick_Flynn_CV.pdf # Downloadable CV
├── robots.txt              # Search engine directives
├── sitemap.xml            # Site structure for SEO
└── site.webmanifest       # PWA manifest
```

## ✏️ Content Management

The site uses a **JSON-based content management system** for easy updates without HTML knowledge:

### Updating Content

1. **Home Page**: Edit `content/home.json`
   - Hero text and introduction
   - Key highlights sections
   
2. **About Page**: Edit `content/about.json`
   - Biography and journey
   - Personal life content
   - Photo galleries
   
3. **Portfolio**: Edit `content/portfolio.json`
   - Add new projects
   - Update project descriptions
   - Modify technologies used
   
4. **Contact Info**: Edit `content/contact.json`
   - Email and social links
   - Contact information
   
5. **Site Metadata**: Edit `content/metadata.json`
   - SEO information
   - Social media metadata
   - Schema markup

### Adding a New Portfolio Project

Add a new object to the `projects` array in `content/portfolio.json`:

```json
{
  "id": 12,
  "title": "Full Project Title",
  "shortTitle": "Display Title",
  "description": "Detailed project description...",
  "technologies": "Tech1, Tech2, Tech3",
  "icon": "fas fa-icon-name",
  "tileColor": "tile-color-1",
  "shortDescription": "Brief description"
}
```

## 🚀 Development & Deployment

### Local Development

1. Clone the repository
2. Serve files using any static server:
   ```bash
   # Using Python
   python -m http.server 8080
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8080
   ```
3. Open `http://localhost:8080` in your browser

### Deployment

This is a **static website** compatible with:
- **Cloudflare Pages** (current hosting)
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

Simply push changes to the repository, and your hosting service will automatically rebuild and deploy.

## 🎨 Features

- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Interactive Portfolio**: Modal dialogs with project details and navigation
- **Touch/Swipe Support**: Mobile-friendly gesture controls
- **SEO Optimized**: Structured data, meta tags, and sitemap
- **Performance**: Optimized images and minimal dependencies
- **Accessibility**: ARIA labels, keyboard navigation, semantic HTML

## 🔧 Customization

### Styling
- Main styles in `assets/css/style.css`
- Uses CSS Grid and Flexbox for layouts
- Bulma framework for component styling
- Custom properties for consistent theming

### JavaScript
- Modular functions in `assets/js/script.js`
- Dynamic content loading from JSON
- Modal management for portfolio items
- Navigation and interaction handling

### Adding New Sections

1. Create new JSON file in `content/`
2. Add rendering function in `script.js`
3. Update HTML with placeholder containers
4. Call rendering function in `loadAllContent()`

## 📧 Contact & Updates

- **Email**: pid.flynn@gmail.com
- **LinkedIn**: [Patrick Flynn](https://www.linkedin.com/in/patrick-flynn-9bb1a246/)
- **Website**: [patrickflynnedtech.com](https://www.patrickflynnedtech.com/)

## 📝 License

This portfolio is personal property. Content and design are © 2024 Patrick Flynn. Code structure may be referenced for educational purposes.

---

**Last Updated**: August 2024  
**Version**: 2.0.0 (JSON Content Management System)