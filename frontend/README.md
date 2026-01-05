# Smart Potato Farming System - Frontend

Modern React-based web application for potato farming analysis and recommendations.

## 🚀 Features

### 🌱 Soil Health Analysis
- Interactive soil parameter input form
- Real-time ML predictions for soil suitability
- Growth stage-specific recommendations
- Fertilizer (Urea, TSP, MOP) calculations

### 📊 Data Visualization
- Live statistics dashboard
- Historical data analysis
- Recent soil samples table
- Suitability distribution charts

### 🎨 UI/UX
- Clean, modern interface with Tailwind CSS
- Responsive design for all devices
- Tabbed navigation (Predict, Results, Analysis)
- Print-friendly report generation

## 📋 Prerequisites

- Node.js 16+ or higher
- npm or yarn package manager
- Backend API running on `http://127.0.0.1:5000`

## 🛠️ Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

The application will start at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🗺️ Application Routes

### Public Routes
- `/` - Landing page
- `/signin` - User sign in
- `/signup` - User registration

### Protected Routes (App)
- `/app` - Main dashboard
- `/app/soil-health` - Soil health analysis (Main Feature)
- `/app/seed-readiness` - Seed readiness checker
- `/app/disease` - Disease predictor
- `/app/cost` - Cost analysis tools

## 📱 Soil Health Page Features

### 1. Prediction Form
Input soil parameters with decimal precision:
- **Soil Chemistry:**
  - pH Level (e.g., 6.49)
  - EC - Electrical Conductivity (e.g., 0.042)
  - Nitrogen (N) in ppm (e.g., 40.2)
  - Phosphorus (P) in ppm (e.g., 43.4)
  - Potassium (K) in ppm (e.g., 250.4)

- **Growth Stage:**
  - Germination (0-3 weeks)
  - Vegetative (3-6 weeks)
  - Tuber Initiation (6-10 weeks)
  - Maturation (10-16 weeks)

- **Environmental Conditions:**
  - Temperature (°C)
  - Humidity (%)
  - Soil Moisture (%)

### 2. Results & Recommendations
- **Suitability Status:** Green/Orange/Red indicator
- **Confidence Score:** Prediction accuracy percentage
- **Fertilizer Recommendations:**
  - Urea (kg/acre)
  - TSP - Triple Super Phosphate (kg/acre)
  - MOP - Muriate of Potash (kg/acre)
- **Action Guidelines:** Step-by-step improvement recommendations

### 3. Data Analysis
- Total samples statistics
- Location-based analysis
- Average nutrient levels
- Suitability distribution
- Recent samples table

## 🎨 Design System

### Color Palette
- **Primary:** Green (`#10b981`) - Agriculture theme
- **Success:** Emerald (`#059669`)
- **Warning:** Orange (`#f97316`)
- **Danger:** Red (`#ef4444`)
- **Info:** Blue (`#3b82f6`)

### Components
- Cards with gradient backgrounds
- Tabbed navigation
- Responsive forms with validation
- Modal alerts
- Loading states

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, icons
│   ├── components/     # Reusable components
│   │   ├── Layout.jsx      # Main app layout
│   │   ├── Sidebar.jsx     # Navigation sidebar
│   │   ├── Header.jsx      # App header
│   │   └── Footer.jsx      # App footer
│   ├── contexts/       # React contexts
│   │   └── AuthContext.jsx # Authentication
│   ├── pages/          # Page components
│   │   ├── Landing.jsx          # Home page
│   │   ├── SignIn.jsx           # Login page
│   │   ├── SignUp.jsx           # Registration
│   │   ├── Dashboard.jsx        # Main dashboard
│   │   ├── SoilHealth.jsx       # Soil analysis (Main)
│   │   ├── InputPage.jsx        # Data input
│   │   ├── ResultsPage.jsx      # Results display
│   │   └── RecommendationPage.jsx
│   ├── App.jsx         # Root component
│   ├── main.jsx        # Entry point
│   └── firebase.js     # Firebase config
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS config
└── README.md           # This file
```

## 📦 Dependencies

### Core
- `react` ^18.2.0 - UI library
- `react-dom` ^18.2.0 - React DOM renderer
- `react-router-dom` ^6.x - Routing

### Styling
- `tailwindcss` ^3.x - Utility-first CSS
- `postcss` ^8.x - CSS processing
- `autoprefixer` ^10.x - CSS vendor prefixes

### Build Tools
- `vite` ^5.x - Fast build tool
- `@vitejs/plugin-react` - React plugin for Vite

### Development
- `eslint` - Code linting
- `console-ninja` - Development debugging

## 🔧 Configuration

### API Endpoint
Update in `src/pages/SoilHealth.jsx`:
```javascript
const API_URL = 'http://127.0.0.1:5000';
```

### Firebase (Optional)
Configure in `src/firebase.js` if using authentication.

## 🧪 Testing

### Test Data Examples

**Suitable Soil (Prediction: 2)**
```
pH: 6.4
EC: 0.136
N: 50.2
P: 116.5
K: 335.9
Temperature: 25.7
Humidity: 65.4
Moisture: 58.3
Growth Stage: Vegetative
```

**Marginally Suitable (Prediction: 1)**
```
pH: 6.49
EC: 0.042
N: 40.2
P: 43.4
K: 250.4
Temperature: 23.4
Humidity: 76.5
Moisture: 61.4
Growth Stage: Maturation
```

**Not Suitable (Prediction: 0)**
```
pH: 4.5
EC: 0.189
N: 40
P: 91.1
K: 219.9
Temperature: 23.2
Humidity: 77.4
Moisture: 53.7
Growth Stage: Germination
```

## 🐛 Troubleshooting

### Port Already in Use
The app runs on port 5173 by default. If occupied, Vite will try 5174, 5175, etc.

### Backend Connection Error
Ensure backend is running at `http://127.0.0.1:5000`:
```bash
cd backend
python app.py
```

### Tailwind Styles Not Loading
Rebuild the CSS:
```bash
npm run dev
```

### Build Errors
Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🎯 Key Features Implementation

### Decimal Input Handling
All input fields use `type="text"` with `inputMode="decimal"` for accurate decimal entry without browser step restrictions.

### Real-time Validation
Form validates all required fields before submission to ensure data quality.

### Responsive Design
- Mobile-first approach
- Grid layouts adapt to screen size
- Touch-friendly interface

### Print Functionality
Results page includes print styling for professional reports.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Deploy to Vercel/Netlify
1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables if needed

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## ⚡ Performance

- Lazy loading for routes
- Optimized bundle size with Vite
- Fast page transitions
- Minimal re-renders with React best practices

## 🤝 Contributing

When adding new features:
1. Create component in appropriate directory
2. Follow existing naming conventions
3. Use Tailwind for styling
4. Test on mobile and desktop
5. Update this README

## 📝 Code Style

- Use functional components with hooks
- Follow React best practices
- Use Tailwind utility classes
- Keep components focused and reusable
- Add comments for complex logic

## 📄 License

Part of the Smart Potato Farming System project.

## 👨‍💻 Maintainer

Modern web interface for smart potato farming analysis.

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)
- [React Router](https://reactrouter.com)
