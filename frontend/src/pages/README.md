# Frontend Pages Documentation

This directory contains all the main page components for the Smart Potato Farming System.

## 📑 Page Overview

### 🏠 Public Pages

#### Landing.jsx
**Route:** `/`
**Purpose:** Landing page and application introduction
**Features:**
- Hero section with call-to-action
- Feature highlights
- System benefits overview
- Navigation to sign-in/sign-up

**Usage:**
```jsx
import Landing from './pages/Landing';
// Used in App.jsx for route "/"
```

---

#### SignIn.jsx
**Route:** `/signin`
**Purpose:** User authentication and login
**Features:**
- Email/password authentication
- Firebase integration
- Form validation
- Redirect to dashboard after login
- "Remember me" functionality

**State Management:**
```javascript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
```

**Authentication Flow:**
1. User enters credentials
2. Firebase authentication
3. Context updates (AuthContext)
4. Redirect to `/app`

---

#### SignUp.jsx
**Route:** `/signup`
**Purpose:** New user registration
**Features:**
- User registration form
- Password confirmation
- Email validation
- Firebase user creation
- Auto sign-in after registration

**Form Fields:**
- Full Name
- Email
- Password
- Confirm Password

---

### 🔒 Protected Pages (Requires Authentication)

#### Dashboard.jsx
**Route:** `/app`
**Purpose:** Main application dashboard and overview
**Features:**
- Quick stats summary
- Recent activities
- Navigation cards to main features
- User profile section

**Key Sections:**
1. **Statistics Cards:** Overview metrics
2. **Quick Actions:** Links to main features
3. **Recent Data:** Latest predictions/analyses
4. **Notifications:** System alerts

**Dependencies:**
- AuthContext for user data
- Layout component for app structure

---

#### SoilHealth.jsx ⭐ (Main Feature)
**Route:** `/app/soil-health`
**Purpose:** Soil health analysis and ML predictions
**Status:** ✅ Fully Implemented

#### Features Overview
1. **Prediction Form (Tab 1)**
   - 8 soil parameters with decimal input
   - Growth stage selection
   - Real-time validation
   - Submit to ML backend

2. **Results Display (Tab 2)**
   - Suitability classification (0/1/2)
   - Confidence score
   - Fertilizer recommendations (Urea, TSP, MOP)
   - Numbered action items
   - Print functionality

3. **Data Analysis (Tab 3)**
   - Historical statistics
   - Recent samples table
   - Distribution charts
   - Location-based insights

#### Component Structure
```jsx
const SoilHealth = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('predict');
  const [formData, setFormData] = useState({
    pH: '', EC: '', N: '', P: '', K: '',
    Temperature: '', Humidity: '', Moisture: '',
    Growth_Stage: 'Vegetative'
  });
  const [prediction, setPrediction] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [recentSamples, setRecentSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // API Integration
  const handleSubmit = async () => {
    // POST to /api/soil/predict
  };

  return (
    // Tabbed Interface with 3 sections
  );
};
```

#### Input Fields Specification
| Field | Type | Range | Example | Description |
|-------|------|-------|---------|-------------|
| pH | Decimal | 4.0-8.5 | 6.49 | Soil acidity/alkalinity |
| EC | Decimal | 0.01-0.5 | 0.042 | Electrical conductivity (dS/m) |
| N | Decimal | 0-200 | 40.2 | Nitrogen content (ppm) |
| P | Decimal | 0-200 | 43.4 | Phosphorus content (ppm) |
| K | Decimal | 0-500 | 250.4 | Potassium content (ppm) |
| Temperature | Decimal | 15-35 | 25.7 | Soil temperature (°C) |
| Humidity | Decimal | 40-90 | 65.4 | Relative humidity (%) |
| Moisture | Decimal | 30-80 | 58.3 | Soil moisture (%) |

#### Growth Stages
- **Germination** (0-3 weeks): Initial sprouting
- **Vegetative** (3-6 weeks): Leaf and stem growth
- **Tuber_Initiation** (6-10 weeks): Potato formation begins
- **Maturation** (10-16 weeks): Tuber growth and ripening

#### Prediction Output
```javascript
{
  "prediction": 2,           // 0=Not Suitable, 1=Marginally, 2=Suitable
  "suitability": "Suitable", // Human-readable status
  "confidence": 0.89,        // Model confidence (0-1)
  "recommendations": {
    "urea": 125.5,          // kg/acre
    "tsp": 87.3,            // kg/acre
    "mop": 45.2,            // kg/acre
    "actions": [
      "Maintain current pH level...",
      "Continue regular irrigation...",
      // ...more actions
    ]
  }
}
```

#### API Endpoints Used
- `POST /api/soil/predict` - Submit soil data for prediction
- `GET /api/soil/statistics` - Fetch historical stats
- `GET /api/soil/recent?limit=10` - Get recent samples

#### Styling Features
- Color-coded sections (green=chemistry, purple=growth, blue=environment)
- Gradient cards for visual appeal
- Responsive grid layout (1-3 columns)
- Print-friendly styles
- Loading states and error handling

#### Test Scenarios
See main frontend README.md for complete test data.

---

#### InputPage.jsx
**Route:** `/app/input`
**Purpose:** Generic data input interface
**Features:**
- Multi-purpose data entry form
- Flexible field configuration
- Data validation
- Save to database/API

**Use Cases:**
- Manual data entry
- Batch data import
- Configuration updates

---

#### ResultsPage.jsx
**Route:** `/app/results`
**Purpose:** Display analysis results and predictions
**Features:**
- Dynamic result rendering
- Chart visualizations
- Export functionality (PDF, CSV)
- Comparison views

**Data Sources:**
- API prediction results
- Historical comparisons
- Statistical analysis

---

#### RecommendationPage.jsx
**Route:** `/app/recommendations`
**Purpose:** Show farming recommendations based on analysis
**Features:**
- Personalized recommendations
- Action timelines
- Resource calculations
- Best practices guide

**Recommendation Types:**
1. Fertilizer applications
2. Irrigation schedules
3. Pest management
4. Harvest timing

---

## 🔄 Navigation Flow

```
Landing (/)
  ├── SignIn (/signin) → Dashboard (/app)
  └── SignUp (/signup) → Dashboard (/app)

Dashboard (/app)
  ├── SoilHealth (/app/soil-health) ⭐
  ├── InputPage (/app/input)
  ├── ResultsPage (/app/results)
  └── RecommendationPage (/app/recommendations)
```

## 🎨 Common UI Patterns

### Layout Structure
All protected pages use the `Layout` component:
```jsx
<Layout>
  <PageContent />
</Layout>
```

### Form Patterns
```jsx
// Controlled inputs with validation
const [value, setValue] = useState('');
const handleChange = (e) => setValue(e.target.value);

<input
  type="text"
  value={value}
  onChange={handleChange}
  className="w-full px-4 py-2 border rounded-lg"
/>
```

### API Calls
```javascript
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await fetch(`${API_URL}/endpoint`);
    const data = await response.json();
    setData(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Tab Navigation
```jsx
<div className="flex border-b">
  {tabs.map(tab => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 ${
        activeTab === tab ? 'border-b-2 border-green-600' : ''
      }`}
    >
      {tab}
    </button>
  ))}
</div>
```

## 🛠️ Development Guidelines

### Adding a New Page

1. **Create Component:**
   ```bash
   touch src/pages/NewPage.jsx
   ```

2. **Basic Structure:**
   ```jsx
   import React, { useState, useEffect } from 'react';
   import Layout from '../components/Layout';

   const NewPage = () => {
     return (
       <Layout>
         <div className="container mx-auto p-6">
           <h1 className="text-2xl font-bold mb-4">New Page</h1>
           {/* Page content */}
         </div>
       </Layout>
     );
   };

   export default NewPage;
   ```

3. **Add Route in App.jsx:**
   ```jsx
   import NewPage from './pages/NewPage';
   
   <Route path="/app/new-page" element={<NewPage />} />
   ```

4. **Add Navigation Link:**
   Update `Sidebar.jsx` with new menu item

### State Management Best Practices
- Use `useState` for local component state
- Use `useContext` for shared state (e.g., authentication)
- Keep state as close to where it's used as possible
- Lift state up when multiple components need it

### Error Handling
```javascript
const [error, setError] = useState('');

// In try-catch
catch (err) {
  setError(err.response?.data?.error || 'Something went wrong');
}

// Display
{error && (
  <div className="bg-red-100 text-red-700 p-4 rounded-lg">
    {error}
  </div>
)}
```

### Loading States
```javascript
const [loading, setLoading] = useState(false);

{loading ? (
  <div className="flex justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
  </div>
) : (
  <Content />
)}
```

## 📱 Responsive Design

All pages follow mobile-first approach:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid: 1 col mobile, 2 tablet, 3 desktop */}
</div>
```

## 🧪 Testing Checklist

For each page, verify:
- ✅ Renders without errors
- ✅ Protected routes check authentication
- ✅ Forms validate input correctly
- ✅ API calls handle errors gracefully
- ✅ Loading states display properly
- ✅ Responsive on mobile/tablet/desktop
- ✅ Navigation works correctly
- ✅ Data persists appropriately

## 🔐 Authentication Requirements

**Public Pages:** Landing, SignIn, SignUp
**Protected Pages:** All `/app/*` routes

Protected routes redirect to `/signin` if user not authenticated.

## 📊 Performance Optimization

- Lazy load routes with React.lazy()
- Memoize expensive computations
- Debounce input handlers
- Paginate large data sets
- Cache API responses when appropriate

## 🐛 Common Issues

### "Cannot read property of undefined"
- Check if data is loaded before rendering
- Use optional chaining: `data?.property`

### State not updating
- Don't mutate state directly
- Use spread operator: `setState({...state, key: value})`

### API CORS errors
- Ensure backend has CORS enabled
- Check API_URL is correct

### Styles not applying
- Check Tailwind class names
- Verify Tailwind config includes correct paths
- Restart dev server after config changes

---

## 📚 Additional Resources

- [React Hooks Guide](https://react.dev/reference/react)
- [React Router Documentation](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🤝 Contributing

When modifying pages:
1. Follow existing component structure
2. Use TypeScript types if migrating to TS
3. Add comments for complex logic
4. Update this README with changes
5. Test on multiple screen sizes

---

**Last Updated:** January 6, 2026
**Main Feature:** SoilHealth.jsx (Soil Health Analysis)
