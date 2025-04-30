import React from 'react';
import { LocationProvider } from './context/LocationContext';
import Header from './components/Header';
import LocationSelector from './components/LocationSelector';
import HospitalList from './components/HospitalList';

function App() {
  return (
    <LocationProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Find Hospitals Near You</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover hospitals in your district with available appointment slots. 
              Get real-time distance information to help you make the best choice.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <LocationSelector />
            <HospitalList />
          </div>
        </main>
        
        <footer className="bg-white py-6 border-t border-gray-200">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>© 2025 Hospital Quick. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </LocationProvider>
  );
}

export default App;