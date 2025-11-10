import React, { useMemo } from 'react';
import { PriceHistory } from '../types';

interface CandlestickChartProps {
  data: PriceHistory[];
  commodityName: string;
  height?: number;
  showVolume?: boolean;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  commodityName,
  height = 300,
  showVolume = false
}) => {
  const chartData = useMemo(() => {
    if (data.length === 0) return null;

    // Calculate min and max prices for scaling
    const allPrices = data.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const priceRange = maxPrice - minPrice;
    const padding = priceRange * 0.1; // 10% padding

    // Volume calculations
    const maxVolume = showVolume ? Math.max(...data.map(d => d.volume || 0)) : 0;

    return {
      minPrice: minPrice - padding,
      maxPrice: maxPrice + padding,
      priceRange: priceRange + (padding * 2),
      maxVolume,
      dataPoints: data
    };
  }, [data, showVolume]);

  if (!chartData || chartData.dataPoints.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 text-center text-gray-400">
        <p>No price history available yet.</p>
        <p className="text-sm mt-2">Charts will update as the game progresses.</p>
      </div>
    );
  }

  const { minPrice, maxPrice, priceRange, maxVolume, dataPoints } = chartData;
  const volumeHeight = showVolume ? height * 0.25 : 0;
  const priceChartHeight = height - volumeHeight;
  const candleWidth = Math.max(4, Math.min(20, 600 / dataPoints.length));
  const candleGap = 2;
  const chartWidth = (candleWidth + candleGap) * dataPoints.length;

  const getPriceY = (price: number): number => {
    return priceChartHeight - ((price - minPrice) / priceRange * priceChartHeight);
  };

  const latestPrice = dataPoints[dataPoints.length - 1]?.close || 0;
  const priceChange = dataPoints.length > 1
    ? dataPoints[dataPoints.length - 1].close - dataPoints[dataPoints.length - 2].close
    : 0;
  const priceChangePercent = dataPoints.length > 1
    ? (priceChange / dataPoints[dataPoints.length - 2].close) * 100
    : 0;

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-blue-300">{commodityName}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-2xl font-bold text-white">${latestPrice.toFixed(2)}</span>
            <span className={`text-sm font-semibold ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="text-right text-xs text-gray-400">
          <div>High: ${maxPrice.toFixed(2)}</div>
          <div>Low: ${minPrice.toFixed(2)}</div>
          <div>Data Points: {dataPoints.length}</div>
        </div>
      </div>

      <div className="relative bg-gray-900 rounded overflow-x-auto" style={{ height: `${height}px` }}>
        <svg width={chartWidth} height={height} className="min-w-full">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = priceChartHeight * ratio;
            const price = maxPrice - (priceRange * ratio);
            return (
              <g key={idx}>
                <line
                  x1={0}
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="#374151"
                  strokeWidth={1}
                  strokeDasharray="4,4"
                />
                <text
                  x={5}
                  y={y - 5}
                  fill="#9CA3AF"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  ${price.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Candlesticks */}
          {dataPoints.map((candle, idx) => {
            const x = idx * (candleWidth + candleGap) + candleWidth / 2;
            const isGreen = candle.close >= candle.open;
            const color = isGreen ? '#10B981' : '#EF4444';
            const bodyTop = getPriceY(Math.max(candle.open, candle.close));
            const bodyBottom = getPriceY(Math.min(candle.open, candle.close));
            const bodyHeight = Math.max(1, bodyBottom - bodyTop);

            return (
              <g key={idx}>
                {/* Wick (high-low line) */}
                <line
                  x1={x}
                  y1={getPriceY(candle.high)}
                  x2={x}
                  y2={getPriceY(candle.low)}
                  stroke={color}
                  strokeWidth={1}
                />
                {/* Body (open-close rectangle) */}
                <rect
                  x={x - candleWidth / 2}
                  y={bodyTop}
                  width={candleWidth}
                  height={bodyHeight}
                  fill={color}
                  opacity={0.8}
                />
              </g>
            );
          })}

          {/* Volume bars */}
          {showVolume && dataPoints.map((candle, idx) => {
            const x = idx * (candleWidth + candleGap);
            const volume = candle.volume || 0;
            const volumeBarHeight = (volume / maxVolume) * volumeHeight;
            const isGreen = candle.close >= candle.open;
            const color = isGreen ? '#10B981' : '#EF4444';

            return (
              <rect
                key={`vol-${idx}`}
                x={x}
                y={height - volumeBarHeight}
                width={candleWidth}
                height={volumeBarHeight}
                fill={color}
                opacity={0.3}
              />
            );
          })}
        </svg>
      </div>

      <div className="mt-2 text-xs text-gray-500 flex justify-between">
        <span>{dataPoints.length > 0 ? `Turn ${dataPoints[0].turn}` : ''}</span>
        <span>{dataPoints.length > 0 ? `Turn ${dataPoints[dataPoints.length - 1].turn}` : ''}</span>
      </div>
    </div>
  );
};
