
import React from 'react';
import { Player, Commodity, Property, Skill, GameState } from '../types';
import {
  MoneyIcon, CommodityIcon, PropertyIcon, SkillIcon, InfoIcon, TrendUpIcon, TrendDownIcon,
  InfluenceIconicIcon, InfluencePositiveIcon, InfluenceNeutralIcon, InfluenceNegativeIcon, InfluenceNotoriousIcon
} from './icons';
import { Card } from './ui/Card';
import { INFLUENCE_LEVELS } from '../constants';

interface DashboardProps {
  gameState: GameState;
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode,
  subtext?: string;
  valueColor?: string;
}> = ({ title, value, icon, subtext, valueColor }) => (
  <Card className="flex-1 min-w-[150px]">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-gray-700 rounded-full">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{title}</p>
        <p className={`text-xl font-bold ${valueColor || 'text-gray-100'}`}>{value}</p>
        {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
      </div>
    </div>
  </Card>
);

const getInfluenceLevel = (influence: number) => {
  if (influence >= INFLUENCE_LEVELS.ICONIC.min) return INFLUENCE_LEVELS.ICONIC;
  if (influence >= INFLUENCE_LEVELS.RESPECTED.min) return INFLUENCE_LEVELS.RESPECTED;
  if (influence >= INFLUENCE_LEVELS.FAVORABLE.min) return INFLUENCE_LEVELS.FAVORABLE;
  if (influence >= INFLUENCE_LEVELS.NEUTRAL.min) return INFLUENCE_LEVELS.NEUTRAL;
  if (influence >= INFLUENCE_LEVELS.QUESTIONABLE.min) return INFLUENCE_LEVELS.QUESTIONABLE;
  return INFLUENCE_LEVELS.NOTORIOUS;
};

const getInfluenceIcon = (influence: number) => {
  const level = getInfluenceLevel(influence);
  if (influence >= 75) return <InfluenceIconicIcon className={level.color} />;
  if (influence >= 25) return <InfluencePositiveIcon className={level.color} />;
  if (influence >= -24) return <InfluenceNeutralIcon className={level.color} />;
  if (influence >= -49) return <InfluenceNegativeIcon className={level.color} />;
  return <InfluenceNotoriousIcon className={level.color} />;
};


export const Dashboard: React.FC<DashboardProps> = ({ gameState }) => {
  const { player, commodities, properties, skills, gameTurn, currentEra } = gameState;

  const influenceLevel = getInfluenceLevel(player.influence);
  const influenceIcon = getInfluenceIcon(player.influence);

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <StatCard title="Money" value={`$${player.money.toLocaleString()}`} icon={<MoneyIcon className="text-green-400"/>} />
        <StatCard
          title="Influence"
          value={player.influence}
          icon={influenceIcon}
          valueColor={influenceLevel.color}
          subtext={influenceLevel.label}
        />
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