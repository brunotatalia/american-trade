
import React, { CSSProperties } from 'react';
import { Player, Commodity, Property, Skill, GameState } from '../types';
import { MoneyIcon, ReputationIcon, CommodityIcon, PropertyIcon, SkillIcon, InfoIcon, TrendUpIcon, TrendDownIcon } from './icons';
import { Card } from './ui/Card';

interface DashboardProps {
  gameState: GameState;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode, subtext?: string }> = ({ title, value, icon, subtext }) => {
  const iconContainerStyle: CSSProperties = {
    backgroundColor: 'var(--color-surface-hover)',
    color: 'var(--color-accent)',
  };

  const titleStyle: CSSProperties = {
    color: 'var(--color-text-muted)',
  };

  const valueStyle: CSSProperties = {
    color: 'var(--color-text)',
  };

  const subtextStyle: CSSProperties = {
    color: 'var(--color-text-secondary)',
  };

  return (
    <Card className="flex-1 min-w-[150px]">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-full" style={iconContainerStyle}>{icon}</div>
        <div>
          <p className="text-xs" style={titleStyle}>{title}</p>
          <p className="text-xl font-bold" style={valueStyle}>{value}</p>
          {subtext && <p className="text-xs" style={subtextStyle}>{subtext}</p>}
        </div>
      </div>
    </Card>
  );
};


export const Dashboard: React.FC<DashboardProps> = ({ gameState }) => {
  const { player, commodities, properties, skills, gameTurn, currentEra } = gameState;

  const itemStyle: CSSProperties = {
    backgroundColor: 'var(--color-surface-hover)',
    borderRadius: 'var(--radius-button)',
  };

  const emptyTextStyle: CSSProperties = {
    color: 'var(--color-text-muted)',
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <StatCard title="Money" value={`$${player.money.toLocaleString()}`} icon={<MoneyIcon />} />
        <StatCard title="Reputation" value={player.reputation} icon={<ReputationIcon />} />
        <StatCard title="Game Turn" value={gameTurn} icon={<InfoIcon />} subtext={currentEra?.name || ''} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Owned Commodities" icon={<CommodityIcon />}>
          {Object.keys(player.commodities).length > 0 ? (
            <ul className="space-y-2 text-sm">
              {Object.keys(player.commodities).map((id) => {
                const data = player.commodities[id];
                const commodityDetails = commodities[id];
                const marketPrice = commodityDetails?.price || 0;
                const totalValue = data.quantity * marketPrice;
                const profitLoss = totalValue - (data.avgBuyPrice * data.quantity);
                const isProfit = profitLoss >= 0;

                const profitLossStyle: CSSProperties = {
                  color: isProfit ? 'var(--color-success)' : 'var(--color-danger)',
                };

                return (
                  <li key={id} className="flex justify-between items-center p-2" style={itemStyle}>
                    <div>
                      <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
                        {commodities[id]?.name || id}
                      </span>
                      : {data.quantity} units
                      <br/>
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        Avg Buy: ${data.avgBuyPrice.toFixed(2)} | Market: ${marketPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center text-xs" style={profitLossStyle}>
                      {isProfit ? <TrendUpIcon className="mr-1"/> : <TrendDownIcon className="mr-1"/>}
                      {isProfit ? '+' : ''}${profitLoss.toFixed(2)}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm" style={emptyTextStyle}>No commodities owned.</p>
          )}
        </Card>

        <Card title="Owned Properties" icon={<PropertyIcon />}>
          {player.properties.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {player.properties.map(id => (
                <li key={id} className="p-2" style={itemStyle}>
                  <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    {properties[id]?.name || id}
                  </span>
                  <br/>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    Rent/Turn: ${properties[id]?.rentPerTurn.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm" style={emptyTextStyle}>No properties owned.</p>
          )}
        </Card>

        <Card title="Unlocked Skills" icon={<SkillIcon />}>
          {player.skills.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {player.skills.map(id => (
                <li key={id} className="p-2" style={itemStyle}>
                  <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    {skills[id]?.name || id}
                  </span>
                   <br/>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {skills[id]?.effectDescription}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm" style={emptyTextStyle}>No skills unlocked.</p>
          )}
        </Card>
      </div>
    </div>
  );
};