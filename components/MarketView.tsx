

import React, { useState, useMemo } from 'react';
import { GameState, Commodity, Order } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { MoneyIcon, TrendUpIcon, TrendDownIcon, LoadingSpinnerIcon } from './icons';
import { QuickTradePanel } from './QuickTradePanel';

// --- News Ticker Component ---
const NewsTicker: React.FC<{ newsItems: string[], isLoading: boolean }> = ({ newsItems, isLoading }) => {
    if (isLoading && newsItems.length === 0) {
        return (
            <div className="relative flex items-center bg-gray-750 p-2.5 rounded-lg mb-6 border border-gray-600">
                <LoadingSpinnerIcon className="mr-2 text-yellow-400"/>
                <span className="text-sm text-yellow-400">Fetching latest market news...</span>
            </div>
        );
    }

    if (!newsItems || newsItems.length === 0) {
         return (
            <div className="relative flex items-center bg-gray-750 p-2.5 rounded-lg mb-6 border border-gray-600">
                <span className="text-sm text-gray-400 mx-4">Awaiting market news... No updates at this time.</span>
            </div>
        );
    }

    const fullNewsString = newsItems.map(item => `✦ ${item}`).join('   ');
    
    return (
        <div className="relative flex overflow-x-hidden bg-gray-750 p-2 rounded-lg mb-6 border border-gray-600 group">
            <div className="animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap flex">
                <span className="text-sm text-blue-300 mx-4">{fullNewsString}</span>
                <span className="text-sm text-blue-300 mx-4" aria-hidden="true">{fullNewsString}</span>
            </div>
            {/* Fades for edges */}
            <div className="absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none"></div>
        </div>
    );
};


// --- Order Modal Component ---
interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  commodity: Commodity;
  player: GameState['player'];
  onPlaceOrder: (order: Omit<Order, 'id' | 'createdAtTurn'>) => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, commodity, player, onPlaceOrder }) => {
    const [orderType, setOrderType] = useState<Order['type']>('LIMIT_BUY');
    const [price, setPrice] = useState<string>(commodity.price.toFixed(2));
    const [quantity, setQuantity] = useState<string>("1");

    const numQuantity = parseInt(quantity) || 0;
    const numPrice = parseFloat(price) || 0;

    const committedCommodities = useMemo(() => {
        const committed: Record<string, number> = {};
        player.orders
            .filter(o => o.type === 'LIMIT_SELL' || o.type === 'STOP_LOSS_SELL')
            .forEach(o => {
                committed[o.commodityId] = (committed[o.commodityId] || 0) + o.quantity;
            });
        return committed;
    }, [player.orders]);

    const availableOwned = (player.commodities[commodity.id]?.quantity || 0) - (committedCommodities[commodity.id] || 0);

    const handleSubmit = () => {
        if (numQuantity > 0 && numPrice > 0) {
            onPlaceOrder({
                commodityId: commodity.id,
                type: orderType,
                price: numPrice,
                quantity: numQuantity,
            });
            onClose();
        }
    };

    const getHelperText = () => {
        switch (orderType) {
            case 'LIMIT_BUY': return `Buy ${commodity.name} if price drops to or below $${numPrice.toFixed(2)}.`;
            case 'LIMIT_SELL': return `Sell ${commodity.name} if price rises to or above $${numPrice.toFixed(2)}.`;
            case 'STOP_LOSS_SELL': return `Sell ${commodity.name} if price drops to or below $${numPrice.toFixed(2)} to limit losses.`;
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Place Order for ${commodity.name}`}>
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-gray-400">Order Type</label>
                    <div className="flex space-x-2 mt-1">
                        {(['LIMIT_BUY', 'LIMIT_SELL', 'STOP_LOSS_SELL'] as const).map(type => (
                            <Button key={type} onClick={() => setOrderType(type)} variant={orderType === type ? 'primary' : 'secondary'} size="sm">
                                {type.replace('_', ' ')}
                            </Button>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-400">Target Price</label>
                    <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} className="w-full mt-1 px-2 py-1.5 bg-gray-900 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-400">Quantity</label>
                    <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} min="1" className="w-full mt-1 px-2 py-1.5 bg-gray-900 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <p className="text-xs text-gray-500 h-4">{getHelperText()}</p>
                <Button onClick={handleSubmit} className="w-full" disabled={numQuantity <= 0 || numPrice <= 0 || (orderType !== 'LIMIT_BUY' && numQuantity > availableOwned)}>
                    Place Order
                </Button>
            </div>
        </Modal>
    );
};

// --- Active Orders List Component ---
interface ActiveOrdersListProps {
    orders: Order[];
    commodities: Record<string, Commodity>;
    onCancelOrder: (orderId: string) => void;
}
const ActiveOrdersList: React.FC<ActiveOrdersListProps> = ({ orders, commodities, onCancelOrder }) => {
    if (orders.length === 0) {
        return null;
    }
    const orderTypeClasses: Record<Order['type'], string> = {
        LIMIT_BUY: 'border-l-4 border-green-500',
        LIMIT_SELL: 'border-l-4 border-blue-500',
        STOP_LOSS_SELL: 'border-l-4 border-red-500'
    }

    return (
        <Card title="Active Orders" className="mb-6">
            <ul className="space-y-2 max-h-40 overflow-y-auto">
                {orders.map(order => (
                    <li key={order.id} className={`flex justify-between items-center p-2 bg-gray-700 rounded ${orderTypeClasses[order.type]}`}>
                        <div className="text-sm">
                            <span className="font-semibold">{commodities[order.commodityId]?.name}</span>
                            <span className="text-gray-400 ml-2">{order.type.replace('_', ' ')}</span>
                            <p className="text-xs text-gray-300">
                                Qty: {order.quantity} @ ${order.price.toFixed(2)}
                            </p>
                        </div>
                        <Button variant="danger" size="sm" onClick={() => onCancelOrder(order.id)}>Cancel</Button>
                    </li>
                ))}
            </ul>
        </Card>
    );
}


interface MarketViewProps {
  gameState: GameState;
  onBuyCommodity: (commodityId: string, quantity: number) => void;
  onSellCommodity: (commodityId: string, quantity: number) => void;
  onPlaceOrder: (order: Omit<Order, 'id' | 'createdAtTurn'>) => void;
  onCancelOrder: (orderId: string) => void;
}

interface CommodityRowProps {
  commodity: Commodity;
  ownedQuantity: number;
  committedQuantity: number;
  avgBuyPrice: number;
  onBuy: (quantity: number) => void;
  onSell: (quantity: number) => void;
  onSetOrder: () => void;
  playerMoney: number;
}

const CommodityRow: React.FC<CommodityRowProps> = ({ commodity, ownedQuantity, committedQuantity, avgBuyPrice, onBuy, onSell, onSetOrder, playerMoney }) => {
  const [quantity, setQuantity] = useState<string>("1");
  const numQuantity = parseInt(quantity) || 0;
  const availableToSell = ownedQuantity - committedQuantity;

  const handleBuy = () => {
    if (numQuantity > 0) onBuy(numQuantity);
  };

  const handleSell = () => {
    if (numQuantity > 0) onSell(numQuantity);
  };
  
  const potentialProfitLossPerUnit = ownedQuantity > 0 ? commodity.price - avgBuyPrice : 0;
  const totalPotentialProfitLoss = potentialProfitLossPerUnit * ownedQuantity;

  return (
    <Card className="mb-4 bg-gray-750" title={commodity.name} icon={commodity.icon || <MoneyIcon />}>
        <p className="text-sm text-gray-400 mb-2">{commodity.description}</p>
        <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
                <p className="text-xs text-gray-500">Market Price</p>
                <p className="text-lg font-semibold">${commodity.price.toFixed(2)}</p>
            </div>
            <div>
                <p className="text-xs text-gray-500">Owned</p>
                <p className="text-lg font-semibold">{ownedQuantity} units</p>
            </div>
            {ownedQuantity > 0 && (
                <>
                    <div>
                        <p className="text-xs text-gray-500">Committed</p>
                        <p className="text-lg font-semibold">{committedQuantity} units</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Total P/L</p>
                        <p className={`text-lg font-semibold flex items-center ${totalPotentialProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {totalPotentialProfitLoss >=0 ? <TrendUpIcon className="mr-1"/> : <TrendDownIcon className="mr-1"/>}
                            {totalPotentialProfitLoss >= 0 ? '+' : ''}${totalPotentialProfitLoss.toFixed(2)}
                        </p>
                    </div>
                </>
            )}
        </div>
      
        <div className="flex items-center space-x-2">
            <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            className="w-20 px-2 py-1.5 bg-gray-800 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Qty"
            />
            <Button onClick={handleBuy} size="sm" variant="primary" disabled={numQuantity <=0 || playerMoney < commodity.price * numQuantity}>Buy</Button>
            <Button onClick={handleSell} size="sm" variant="secondary" disabled={numQuantity <=0 || availableToSell < numQuantity}>Sell</Button>
            <Button onClick={onSetOrder} size="sm" variant="ghost">Set Order</Button>
      </div>
    </Card>
  );
};


export const MarketView: React.FC<MarketViewProps> = ({ gameState, onBuyCommodity, onSellCommodity, onPlaceOrder, onCancelOrder }) => {
  const { commodities, player, currentEra, marketNews, isLoadingEvent } = gameState;
  const [orderModalState, setOrderModalState] = useState<{ isOpen: boolean; commodity: Commodity | null }>({ isOpen: false, commodity: null });

  const availableCommodities = useMemo(() => {
    if (!currentEra) return [];
    return currentEra.availableCommodities.map(id => commodities[id]).filter(Boolean);
  }, [commodities, currentEra]);

  const { committedMoney, committedCommodities } = useMemo(() => {
    const money = player.orders
      .filter(o => o.type === 'LIMIT_BUY')
      .reduce((sum, o) => sum + o.price * o.quantity, 0);

    const comms: Record<string, number> = {};
    player.orders
      .filter(o => o.type === 'LIMIT_SELL' || o.type === 'STOP_LOSS_SELL')
      .forEach(o => {
          comms[o.commodityId] = (comms[o.commodityId] || 0) + o.quantity;
      });
    return { committedMoney: money, committedCommodities: comms };
  }, [player.orders]);

  const playerAvailableMoney = player.money - committedMoney;

  if (!currentEra) {
    return <p className="p-4 text-gray-400">Select an Era to start trading.</p>;
  }

  const handleOpenOrderModal = (commodity: Commodity) => {
      setOrderModalState({isOpen: true, commodity});
  }

  return (
    <div className="p-4">
      {orderModalState.isOpen && orderModalState.commodity && (
        <OrderModal
            isOpen={orderModalState.isOpen}
            onClose={() => setOrderModalState({ isOpen: false, commodity: null })}
            commodity={orderModalState.commodity}
            player={player}
            onPlaceOrder={onPlaceOrder}
        />
      )}

      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2 text-blue-300">Marketplace</h2>
        <p className="text-sm text-gray-400 mb-4">Era: {currentEra.name}. Trade wisely to build your fortune.</p>
        <NewsTicker newsItems={marketNews} isLoading={isLoadingEvent} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-4">
          <ActiveOrdersList orders={player.orders} commodities={commodities} onCancelOrder={onCancelOrder} />

          {availableCommodities.length === 0 && <p className="text-gray-400">No commodities available in this era yet.</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableCommodities.map((commodity) => (
              <CommodityRow
                key={commodity.id}
                commodity={commodity}
                ownedQuantity={player.commodities[commodity.id]?.quantity || 0}
                committedQuantity={committedCommodities[commodity.id] || 0}
                avgBuyPrice={player.commodities[commodity.id]?.avgBuyPrice || 0}
                onBuy={(quantity) => onBuyCommodity(commodity.id, quantity)}
                onSell={(quantity) => onSellCommodity(commodity.id, quantity)}
                onSetOrder={() => handleOpenOrderModal(commodity)}
                playerMoney={playerAvailableMoney}
              />
            ))}
          </div>
        </div>

        {/* Quick Trade Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <QuickTradePanel
              gameState={gameState}
              onTrade={(updates) => {
                if (updates.player) {
                  // Update player state through the parent
                  onBuyCommodity('dummy', 0); // Trigger refresh - not ideal but works
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};