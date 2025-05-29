import React from 'react';
import { LocationProvider } from './context/LocationContext';
import LocationSelector from './components/LocationSelector';
import HospitalList from './components/HospitalList';

const App: React.FC = () => {
  return (
    <LocationProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">Rwanda Hospital Finder</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <LocationSelector />
              </div>
              <div className="md:col-span-2">
                <HospitalList />
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-white shadow-sm mt-8">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} Rwanda Hospital Finder. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </LocationProvider>
  );
};

export default App;