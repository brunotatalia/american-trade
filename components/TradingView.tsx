import React, { useState, useMemo } from 'react';
import { GameState, OptionsContract, LeveragedPosition } from '../types';
import { CandlestickChart } from './CandlestickChart';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { TrendUpIcon, TrendDownIcon, MoneyIcon } from './icons';

interface TradingViewProps {
  gameState: GameState;
  onBuyOption: (commodityId: string, type: 'CALL' | 'PUT', strikePrice: number, premium: number, quantity: number, expirationTurns: number) => void;
  onExerciseOption: (optionId: string) => void;
  onSellOption: (optionId: string) => void;
  onOpenLeveragePosition: (commodityId: string, type: 'LONG' | 'SHORT', leverage: number, quantity: number) => void;
  onCloseLeveragePosition: (positionId: string) => void;
}

export const TradingView: React.FC<TradingViewProps> = ({
  gameState,
  onBuyOption,
  onExerciseOption,
  onSellOption,
  onOpenLeveragePosition,
  onCloseLeveragePosition
}) => {
  const [selectedCommodityId, setSelectedCommodityId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chart' | 'options' | 'leverage'>('chart');

  // Options trading state
  const [optionType, setOptionType] = useState<'CALL' | 'PUT'>('CALL');
  const [optionQuantity, setOptionQuantity] = useState(1);
  const [optionExpiration, setOptionExpiration] = useState(5);

  // Leverage trading state
  const [leverageType, setLeverageType] = useState<'LONG' | 'SHORT'>('LONG');
  const [leverageMultiplier, setLeverageMultiplier] = useState<2 | 5 | 10>(2);
  const [leverageQuantity, setLeverageQuantity] = useState(1);

  const availableCommodities = useMemo(() => {
    if (!gameState.currentEra) return [];
    return gameState.currentEra.availableCommodities
      .map(id => gameState.commodities[id])
      .filter(c => c);
  }, [gameState.currentEra, gameState.commodities]);

  const selectedCommodity = selectedCommodityId ? gameState.commodities[selectedCommodityId] : null;
  const priceHistory = selectedCommodityId ? gameState.priceHistory[selectedCommodityId] || [] : [];

  // Calculate option premium (simplified Black-Scholes approximation)
  const calculateOptionPremium = (strikePrice: number, currentPrice: number, type: 'CALL' | 'PUT'): number => {
    const intrinsicValue = type === 'CALL'
      ? Math.max(0, currentPrice - strikePrice)
      : Math.max(0, strikePrice - currentPrice);
    const timeValue = strikePrice * 0.05 * (optionExpiration / 10); // Simplified time value
    return parseFloat((intrinsicValue + timeValue).toFixed(2));
  };

  // Calculate leverage margin requirement
  const calculateMarginRequirement = (price: number, quantity: number, leverage: number): number => {
    return parseFloat(((price * quantity) / leverage).toFixed(2));
  };

  // Calculate liquidation price
  const calculateLiquidationPrice = (entryPrice: number, leverage: number, type: 'LONG' | 'SHORT'): number => {
    const liquidationPercent = 1 / leverage;
    return type === 'LONG'
      ? entryPrice * (1 - liquidationPercent)
      : entryPrice * (1 + liquidationPercent);
  };

  const handleBuyOption = () => {
    if (!selectedCommodity) return;

    const currentPrice = selectedCommodity.price;
    const strikePrice = optionType === 'CALL'
      ? currentPrice * 1.05 // Strike 5% above current for calls
      : currentPrice * 0.95; // Strike 5% below current for puts

    const premium = calculateOptionPremium(strikePrice, currentPrice, optionType);

    onBuyOption(
      selectedCommodity.id,
      optionType,
      parseFloat(strikePrice.toFixed(2)),
      premium,
      optionQuantity,
      optionExpiration
    );
  };

  const handleOpenLeveragePosition = () => {
    if (!selectedCommodity) return;

    onOpenLeveragePosition(
      selectedCommodity.id,
      leverageType,
      leverageMultiplier,
      leverageQuantity
    );
  };

  const getPositionPnL = (position: LeveragedPosition): number => {
    const currentPrice = gameState.commodities[position.commodityId]?.price || position.entryPrice;
    const priceChange = currentPrice - position.entryPrice;
    const pnl = position.type === 'LONG'
      ? priceChange * position.quantity * position.leverage
      : -priceChange * position.quantity * position.leverage;
    return parseFloat(pnl.toFixed(2));
  };

  const getPositionPnLPercent = (position: LeveragedPosition): number => {
    const pnl = getPositionPnL(position);
    return parseFloat(((pnl / position.margin) * 100).toFixed(2));
  };

  const isNearLiquidation = (position: LeveragedPosition): boolean => {
    const currentPrice = gameState.commodities[position.commodityId]?.price || position.entryPrice;
    const priceDistance = Math.abs(currentPrice - position.liquidationPrice);
    const warningDistance = Math.abs(position.entryPrice - position.liquidationPrice) * 0.2;
    return priceDistance < warningDistance;
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-2xl font-semibold mb-2 text-purple-300">Advanced Trading Platform</h2>
        <p className="text-sm text-gray-400 mb-4">
          Trade options and leveraged positions. Higher risk, higher reward!
        </p>
      </div>

      {/* Commodity Selector */}
      <Card title="Select Commodity">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {availableCommodities.map(commodity => (
            <Button
              key={commodity.id}
              variant={selectedCommodityId === commodity.id ? 'primary' : 'secondary'}
              onClick={() => setSelectedCommodityId(commodity.id)}
              size="sm"
              className="text-xs"
            >
              <div className="text-left w-full">
                <div className="font-semibold truncate">{commodity.name}</div>
                <div className="text-green-400">${commodity.price.toFixed(2)}</div>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {selectedCommodity && (
        <>
          {/* Tab Navigation */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'chart' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('chart')}
            >
              Price Chart
            </Button>
            <Button
              variant={activeTab === 'options' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('options')}
            >
              Options Trading
            </Button>
            <Button
              variant={activeTab === 'leverage' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('leverage')}
            >
              Leverage Trading
            </Button>
          </div>

          {/* Chart Tab */}
          {activeTab === 'chart' && (
            <CandlestickChart
              data={priceHistory}
              commodityName={selectedCommodity.name}
              height={400}
              showVolume={true}
            />
          )}

          {/* Options Tab */}
          {activeTab === 'options' && (
            <div className="space-y-4">
              <Card title="Buy Options Contract">
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <Button
                      variant={optionType === 'CALL' ? 'primary' : 'secondary'}
                      onClick={() => setOptionType('CALL')}
                      leftIcon={<TrendUpIcon />}
                      className="flex-1"
                    >
                      CALL (Bet on rise)
                    </Button>
                    <Button
                      variant={optionType === 'PUT' ? 'primary' : 'secondary'}
                      onClick={() => setOptionType('PUT')}
                      leftIcon={<TrendDownIcon />}
                      className="flex-1"
                    >
                      PUT (Bet on fall)
                    </Button>
                  </div>

                  <div className="bg-gray-700 p-3 rounded">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="text-gray-400">Current Price:</label>
                        <div className="text-white font-semibold">${selectedCommodity.price.toFixed(2)}</div>
                      </div>
                      <div>
                        <label className="text-gray-400">Strike Price:</label>
                        <div className="text-white font-semibold">
                          ${(optionType === 'CALL' ? selectedCommodity.price * 1.05 : selectedCommodity.price * 0.95).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-400">Premium per Contract:</label>
                        <div className="text-yellow-400 font-semibold">
                          ${calculateOptionPremium(
                            optionType === 'CALL' ? selectedCommodity.price * 1.05 : selectedCommodity.price * 0.95,
                            selectedCommodity.price,
                            optionType
                          ).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-400">Total Cost:</label>
                        <div className="text-red-400 font-semibold">
                          ${(calculateOptionPremium(
                            optionType === 'CALL' ? selectedCommodity.price * 1.05 : selectedCommodity.price * 0.95,
                            selectedCommodity.price,
                            optionType
                          ) * optionQuantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm text-gray-400">Quantity:</label>
                      <input
                        type="number"
                        min="1"
                        value={optionQuantity}
                        onChange={(e) => setOptionQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-400">Expiration (turns):</label>
                      <select
                        value={optionExpiration}
                        onChange={(e) => setOptionExpiration(parseInt(e.target.value))}
                        className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      >
                        <option value={3}>3 turns</option>
                        <option value={5}>5 turns</option>
                        <option value={10}>10 turns</option>
                        <option value={20}>20 turns</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    onClick={handleBuyOption}
                    variant="primary"
                    className="w-full"
                    leftIcon={<MoneyIcon />}
                  >
                    Buy {optionType} Option
                  </Button>
                </div>
              </Card>

              {/* Active Options */}
              <Card title={`Active Options (${gameState.player.optionsContracts.length})`}>
                {gameState.player.optionsContracts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No active options contracts</p>
                ) : (
                  <div className="space-y-2">
                    {gameState.player.optionsContracts.map(option => {
                      const commodity = gameState.commodities[option.commodityId];
                      const currentPrice = commodity?.price || 0;
                      const intrinsicValue = option.type === 'CALL'
                        ? Math.max(0, currentPrice - option.strikePrice)
                        : Math.max(0, option.strikePrice - currentPrice);
                      const turnsLeft = option.expirationTurn - gameState.gameTurn;
                      const isExpiring = turnsLeft <= 2;
                      const isITM = intrinsicValue > 0;

                      return (
                        <div key={option.id} className={`bg-gray-700 p-3 rounded border-2 ${isExpiring ? 'border-red-500' : isITM ? 'border-green-500' : 'border-gray-600'}`}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-semibold text-white flex items-center gap-2">
                                {commodity?.name}
                                <span className={`text-xs px-2 py-0.5 rounded ${option.type === 'CALL' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                  {option.type}
                                </span>
                              </div>
                              <div className="text-sm text-gray-400 mt-1 space-y-0.5">
                                <div>Strike: ${option.strikePrice.toFixed(2)} | Current: ${currentPrice.toFixed(2)}</div>
                                <div>Quantity: {option.quantity} | Premium Paid: ${(option.premium * option.quantity).toFixed(2)}</div>
                                <div className={isExpiring ? 'text-red-400 font-semibold' : ''}>
                                  Expires in {turnsLeft} turns
                                </div>
                                <div className={`font-semibold ${intrinsicValue > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                                  Intrinsic Value: ${(intrinsicValue * option.quantity).toFixed(2)}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              {isITM && (
                                <Button
                                  onClick={() => onExerciseOption(option.id)}
                                  variant="primary"
                                  size="sm"
                                >
                                  Exercise
                                </Button>
                              )}
                              <Button
                                onClick={() => onSellOption(option.id)}
                                variant="secondary"
                                size="sm"
                              >
                                Close
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Leverage Tab */}
          {activeTab === 'leverage' && (
            <div className="space-y-4">
              <Card title="Open Leveraged Position">
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <Button
                      variant={leverageType === 'LONG' ? 'primary' : 'secondary'}
                      onClick={() => setLeverageType('LONG')}
                      leftIcon={<TrendUpIcon />}
                      className="flex-1"
                    >
                      LONG (Buy)
                    </Button>
                    <Button
                      variant={leverageType === 'SHORT' ? 'primary' : 'secondary'}
                      onClick={() => setLeverageType('SHORT')}
                      leftIcon={<TrendDownIcon />}
                      className="flex-1"
                    >
                      SHORT (Sell)
                    </Button>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Leverage:</label>
                    <div className="flex gap-2 mt-1">
                      {[2, 5, 10].map((lev) => (
                        <Button
                          key={lev}
                          variant={leverageMultiplier === lev ? 'primary' : 'secondary'}
                          onClick={() => setLeverageMultiplier(lev as 2 | 5 | 10)}
                          className="flex-1"
                          disabled={gameState.player.tradingLevel < lev}
                        >
                          {lev}x
                          {gameState.player.tradingLevel < lev && <span className="text-xs ml-1">(Locked)</span>}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Quantity:</label>
                    <input
                      type="number"
                      min="1"
                      value={leverageQuantity}
                      onChange={(e) => setLeverageQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>

                  <div className="bg-gray-700 p-3 rounded">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="text-gray-400">Entry Price:</label>
                        <div className="text-white font-semibold">${selectedCommodity.price.toFixed(2)}</div>
                      </div>
                      <div>
                        <label className="text-gray-400">Position Size:</label>
                        <div className="text-white font-semibold">
                          ${(selectedCommodity.price * leverageQuantity * leverageMultiplier).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-400">Margin Required:</label>
                        <div className="text-yellow-400 font-semibold">
                          ${calculateMarginRequirement(selectedCommodity.price, leverageQuantity, leverageMultiplier)}
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-400">Liquidation Price:</label>
                        <div className="text-red-400 font-semibold">
                          ${calculateLiquidationPrice(selectedCommodity.price, leverageMultiplier, leverageType).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleOpenLeveragePosition}
                    variant="primary"
                    className="w-full"
                    leftIcon={<MoneyIcon />}
                  >
                    Open {leverageType} Position {leverageMultiplier}x
                  </Button>
                </div>
              </Card>

              {/* Active Positions */}
              <Card title={`Active Positions (${gameState.player.leveragedPositions.length})`}>
                {gameState.player.leveragedPositions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No active leveraged positions</p>
                ) : (
                  <div className="space-y-2">
                    {gameState.player.leveragedPositions.map(position => {
                      const commodity = gameState.commodities[position.commodityId];
                      const currentPrice = commodity?.price || position.entryPrice;
                      const pnl = getPositionPnL(position);
                      const pnlPercent = getPositionPnLPercent(position);
                      const nearLiq = isNearLiquidation(position);

                      return (
                        <div key={position.id} className={`bg-gray-700 p-3 rounded border-2 ${nearLiq ? 'border-red-500 animate-pulse' : pnl >= 0 ? 'border-green-500' : 'border-red-500'}`}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-semibold text-white flex items-center gap-2">
                                {commodity?.name}
                                <span className={`text-xs px-2 py-0.5 rounded ${position.type === 'LONG' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                  {position.type}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded bg-purple-900 text-purple-300">
                                  {position.leverage}x
                                </span>
                              </div>
                              <div className="text-sm text-gray-400 mt-1 space-y-0.5">
                                <div>Entry: ${position.entryPrice.toFixed(2)} | Current: ${currentPrice.toFixed(2)}</div>
                                <div>Quantity: {position.quantity} | Margin: ${position.margin.toFixed(2)}</div>
                                <div className={nearLiq ? 'text-red-400 font-semibold' : ''}>
                                  Liquidation: ${position.liquidationPrice.toFixed(2)}
                                  {nearLiq && ' ⚠️ NEAR LIQUIDATION'}
                                </div>
                                <div className={`text-lg font-bold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  P&L: ${pnl.toFixed(2)} ({pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)
                                </div>
                              </div>
                            </div>
                            <Button
                              onClick={() => onCloseLeveragePosition(position.id)}
                              variant={pnl >= 0 ? 'primary' : 'secondary'}
                              size="sm"
                            >
                              Close Position
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};
