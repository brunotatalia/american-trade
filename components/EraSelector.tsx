
import React from 'react';
import { Era } from '../types';
import { ERAS_DATA } from '../constants';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface EraSelectorProps {
  onSelectEra: (era: Era) => void;
}

export const EraSelector: React.FC<EraSelectorProps> = ({ onSelectEra }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-gray-100">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4">
          American Dream Trader
        </h1>
        <p className="text-xl text-gray-400">Embark on your journey to build an empire.</p>
      </div>
      
      <Card className="w-full max-w-2xl mb-8" title="Choose Your Starting Era">
        <div className="space-y-6 p-2">
          {ERAS_DATA.map((era) => (
            <div key={era.id} className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-semibold text-blue-300 mb-2">{era.name}</h3>
              <p className="text-gray-300 mb-3 text-sm">{era.description}</p>
              <p className="text-sm text-gray-400 mb-1">
                <span className="font-semibold">Starting Capital:</span> ${era.startingMoney}
              </p>
              <p className="text-sm text-gray-400">
                <span className="font-semibold">Market Modifier:</span> {era.marketVolatilityModifier}x Volatility
              </p>
              <Button 
                onClick={() => onSelectEra(era)} 
                className="w-full mt-4"
                variant="primary"
              >
                Start in {era.name}
              </Button>
            </div>
          ))}
        </div>
      </Card>
      <footer className="text-center text-gray-500 text-sm mt-8">
        <p>&copy; {new Date().getFullYear()} ADT Simulations. All rights reserved.</p>
        <p>Inspired by classics, powered by your decisions.</p>
      </footer>
    </div>
  );
};
