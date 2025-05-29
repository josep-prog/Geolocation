# Rwanda Hospital Finder

A modern web application to help users find hospitals in Rwanda based on their location. The app provides a hierarchical location selection system (Province > District > Sector > Cell > Village) and displays detailed information about nearby hospitals.

## Features

- 🌍 Hierarchical location selection (Province, District, Sector, Cell, Village)
- 📍 GPS-based auto-location detection
- 🏥 Detailed hospital information including:
  - Services offered
  - Specialties
  - Contact information
  - Working hours
  - Ratings and reviews
- 📱 Responsive design for all devices
- 🎯 Distance-based sorting
- ⚡ Fast and efficient filtering

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (for icons)

## Prerequisites

- Node.js 16.x or later
- npm 7.x or later

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/rwanda-hospital-finder.git
   cd rwanda-hospital-finder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
rwanda-hospital-finder/
├── public/
│   └── data/
│       ├── hospitals.json     # Hospital data
│       └── rw_locations.json  # Rwanda location hierarchy
├── src/
│   ├── components/
│   │   ├── LocationSelector.tsx
│   │   └── HospitalList.tsx
│   ├── context/
│   │   └── LocationContext.tsx
│   ├── utils/
│   │   └── geoLocation.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Data Structure

### Location Hierarchy
The application uses a hierarchical structure for locations in Rwanda:
```
Province
└── District
    └── Sector
        └── Cell
            └── Village
```

### Hospital Information
Each hospital entry includes:
- Basic information (name, type)
- Location details
- Coordinates
- Services offered
- Specialties
- Contact information
- Working hours
- Ratings and reviews

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Data provided by the Rwanda Ministry of Health
- Icons by Lucide React
- UI components styled with Tailwind CSS