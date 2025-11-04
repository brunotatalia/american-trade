
import React, { useEffect, useState, useRef } from 'react';
import { Player, Commodity, Property, Skill, GameState } from '../types';
import { MoneyIcon, ReputationIcon, CommodityIcon, PropertyIcon, SkillIcon, InfoIcon, TrendUpIcon, TrendDownIcon } from './icons';
import { Card } from './ui/Card';

interface DashboardProps {
  gameState: GameState;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode, subtext?: string, flashClass?: string }> = ({ title, value, icon, subtext, flashClass }) => (
  <Card className="flex-1 min-w-[150px]">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-gray-700 rounded-full">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{title}</p>
        <p className={`text-xl font-bold text-gray-100 transition-all duration-200 ${flashClass || ''}`}>{value}</p>
        {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
      </div>
    </div>
  </Card>
);


export const Dashboard: React.FC<DashboardProps> = ({ gameState }) => {
  const { player, commodities, properties, skills, gameTurn, currentEra } = gameState;
  const [moneyFlash, setMoneyFlash] = useState<'green' | 'red' | null>(null);
  const prevMoneyRef = useRef<number>(player.money);

  // Visual feedback for money changes
  useEffect(() => {
    const prevMoney = prevMoneyRef.current;
    const currentMoney = player.money;

    if (currentMoney > prevMoney) {
      setMoneyFlash('green');
      setTimeout(() => setMoneyFlash(null), 500);
    } else if (currentMoney < prevMoney) {
      setMoneyFlash('red');
      setTimeout(() => setMoneyFlash(null), 500);
    }

    prevMoneyRef.current = currentMoney;
  }, [player.money]);

  const moneyFlashClass = moneyFlash === 'green' ? 'text-green-400 scale-110' : moneyFlash === 'red' ? 'text-red-400 scale-110' : '';

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <StatCard title="Money" value={`$${player.money.toLocaleString()}`} icon={<MoneyIcon className="text-green-400"/>} flashClass={moneyFlashClass} />
        <StatCard title="Reputation" value={player.reputation} icon={<ReputationIcon className="text-blue-400"/>} />
        <StatCard title="Game Turn" value={gameTurn} icon={<InfoIcon className="text-yellow-400"/>} subtext={currentEra?.name || ''} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Owned Commodities" icon={<CommodityIcon className="text-yellow-400"/>}>
          {Object.keys(player.commodities).length > 0 ? (
            <ul className="space-y-2 text-sm">
              {/* FIX: Changed from Object.entries to Object.keys to fix type inference on 'data' */}
              {Object.keys(player.commodities).map((id) => {
                const data = player.commodities[id];
                const commodityDetails = commodities[id];
                const marketPrice = commodityDetails?.price || 0;
                const totalValue = data.quantity * marketPrice;
                const profitLoss = totalValue - (data.avgBuyPrice * data.quantity);
                const isProfit = profitLoss >= 0;

                return (
                  <li key={id} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                    <div>
                      <span className="font-semibold">{commodities[id]?.name || id}</span>: {data.quantity} units
                      <br/>
                      <span className="text-xs text-gray-400">Avg Buy: ${data.avgBuyPrice.toFixed(2)} | Market: ${marketPrice.toFixed(2)}</span>
                    </div>
                    <div className={`flex items-center text-xs ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                      {isProfit ? <TrendUpIcon className="mr-1"/> : <TrendDownIcon className="mr-1"/>}
                      {isProfit ? '+' : ''}${profitLoss.toFixed(2)}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">No commodities owned.</p>
          )}
        </Card>

        <Card title="Owned Properties" icon={<PropertyIcon className="text-green-400"/>}>
          {player.properties.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {player.properties.map(id => (
                <li key={id} className="p-2 bg-gray-700 rounded">
                  <span className="font-semibold">{properties[id]?.name || id}</span>
                  <br/>
                  <span className="text-xs text-gray-400">Rent/Turn: ${properties[id]?.rentPerTurn.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">No properties owned.</p>
          )}
        </Card>

        <Card title="Unlocked Skills" icon={<SkillIcon className="text-purple-400"/>}>
          {player.skills.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {player.skills.map(id => (
                <li key={id} className="p-2 bg-gray-700 rounded">
                  <span className="font-semibold">{skills[id]?.name || id}</span>
                   <br/>
                  <span className="text-xs text-gray-400">{skills[id]?.effectDescription}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">No skills unlocked.</p>
          )}
        </Card>
      </div>
    </div>
  );
};