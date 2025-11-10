
import React from 'react';
import { GameState, Property } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { MoneyIcon, PropertyIcon as BuildingIcon } from './icons';

interface RealEstateViewProps {
  gameState: GameState;
  onBuyProperty: (propertyId: string) => void;
}

export const RealEstateView: React.FC<RealEstateViewProps> = ({ gameState, onBuyProperty }) => {
  const { properties, player, currentEra } = gameState;

  const availableProperties = React.useMemo(() => {
    if (!currentEra) return [];
    return currentEra.availableProperties.map(id => properties[id]).filter(Boolean);
  }, [properties, currentEra]);
  
  if (!currentEra) {
    return <p className="p-4 text-gray-400">Select an Era to view real estate.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-2 text-green-300">Real Estate Market</h2>
      <p className="text-sm text-gray-400 mb-6">Era: {currentEra.name}. Invest in properties for steady income.</p>
      
      {availableProperties.length === 0 && <p className="text-gray-400">No properties available in this era yet.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableProperties.map((property) => {
          const isOwned = !!player.properties[property.id];
          // Include 6% transaction fee in affordability check
          const totalCost = property.cost * 1.06;
          const canAfford = player.money >= totalCost;
          return (
            <Card key={property.id} title={property.name} icon={property.icon || <BuildingIcon />}>
              <p className="text-sm text-gray-400 mb-2">{property.description}</p>
              <div className="space-y-1 text-sm mb-4">
                <p><span className="font-semibold text-gray-300">Cost:</span> ${property.cost.toLocaleString()}</p>
                <p className="text-xs text-gray-400">(+6% commission = ${totalCost.toLocaleString()} total)</p>
                <p><span className="font-semibold text-gray-300">Rent per Turn:</span> ${property.rentPerTurn.toLocaleString()}</p>
              </div>
              <Button
                onClick={() => onBuyProperty(property.id)}
                disabled={isOwned || !canAfford}
                variant={isOwned ? "secondary" : "primary"}
                className="w-full"
                leftIcon={<MoneyIcon />}
              >
                {isOwned ? 'Owned' : (canAfford ? 'Buy Property' : 'Cannot Afford')}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
