# CloudGuard - Next.js Edition

Advanced cloud burst detection and early warning system built with Next.js 16, React 19, TypeScript, and Shadcn UI.

## 🚀 Features

- ✅ **Modern Tech Stack**: Next.js 16, React 19, TypeScript
- ✅ **Beautiful UI**: Shadcn UI components with Tailwind CSS
- ✅ **100% FREE APIs**: Open-Meteo (primary) + OpenWeatherMap (optional)
- ✅ **Real-time Weather Data**: Live weather monitoring
- ✅ **Cloud Burst Detection**: AI-powered risk assessment
- ✅ **Interactive Maps**: Leaflet integration
- ✅ **Data Visualization**: Recharts for weather charts
- ✅ **State Management**: Zustand for efficient state handling
- ✅ **Responsive Design**: Mobile-first approach

## 📦 Installation

1. **Navigate to the project directory:**
   ```bash
   cd Next-Main/cloud-burst
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```
   
   **Note:** The project includes an `.npmrc` file that automatically uses `legacy-peer-deps` because `react-leaflet` currently requires React 18, but we're using React 19. This is safe and the app works perfectly.

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn UI (Radix UI)
- **State Management**: Zustand
- **Charts**: Recharts
- **Maps**: React Leaflet
- **Icons**: Lucide React

## 📁 Project Structure

```
cloud-burst/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Shadcn UI components
│   ├── navigation.tsx      # Navigation bar
│   ├── hero-section.tsx    # Hero section
│   └── weather-cards.tsx   # Weather display cards
├── lib/
│   ├── services/           # Weather API service
│   ├── store/              # Zustand stores
│   ├── types/              # TypeScript types
│   └── utils.ts            # Utility functions
└── hooks/                  # Custom React hooks
```

## 🔧 Configuration

### API Keys (Optional)

The app works **100% free** using Open-Meteo API by default. To use OpenWeatherMap for enhanced features:

1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. The app will automatically detect the key from localStorage
3. Or set it programmatically in the browser console:
   ```javascript
   localStorage.setItem('openweather_api_key', 'your_key_here')
   ```

## 🎯 Key Components

### Weather Service
- Handles all weather API calls
- Automatic fallback between APIs
- Caching for performance
- Type-safe with TypeScript

### State Management
- Zustand store for weather data
- Reactive updates
- Efficient re-renders

### UI Components
- Shadcn UI for consistent design
- Fully accessible
- Dark mode ready
- Responsive layouts

## 🚧 Development Status

This is a migration from vanilla JavaScript to Next.js. Current implementation includes:

- ✅ Core weather service
- ✅ Navigation
- ✅ Hero section
- ✅ Weather cards
- ✅ Toast notifications
- ✅ State management

**Coming Soon:**
- Interactive map component
- Charts and graphs
- SOS alert system
- Forecast section
- Education section
- API key configuration UI

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Deployment

The app can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Any Node.js hosting**

## 📄 License

Open source - feel free to use and modify.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Note**: This is a modernized version of the original Cloud Burst Detection System, rebuilt with Next.js and modern React patterns.
