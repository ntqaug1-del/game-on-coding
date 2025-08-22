import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExchangeAlt } from 'react-icons/fa';

const UnitConverterBlock: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate('/unit-converter')}
    >
      <div className="flex flex-col items-center">
        <div className="bg-blue-100 p-4 rounded-full mb-4">
          <FaExchangeAlt className="text-blue-600 text-3xl" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Unit Converter</h3>
        <p className="text-gray-600 text-center">
          Convert between different units of measurement including length, mass, temperature, and more.
        </p>
      </div>
    </div>
  );
};

export default UnitConverterBlock; 