import React from 'react';
import { Stethoscope } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

const Header: React.FC = () => {
  const { resetLocation } = useLocation();

  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={resetLocation}
          >
            <Stethoscope className="text-blue-500" size={28} />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Hospital Quick</h1>
              <p className="text-xs text-gray-500">Find hospitals near you</p>
            </div>
          </div>
          
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors text-sm">
                  Appointments
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors text-sm">
                  My Account
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;