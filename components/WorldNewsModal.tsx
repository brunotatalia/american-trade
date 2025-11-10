import React from 'react';
import { WorldNewsEvent } from '../types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { NewsIcon } from './icons';
import { formatDate } from '../services/historicalData';

interface WorldNewsModalProps {
  newsEvents: WorldNewsEvent[];
  currentDate: { month: number; year: number };
  onClose: () => void;
}

export const WorldNewsModal: React.FC<WorldNewsModalProps> = ({ newsEvents, currentDate, onClose }) => {
  if (newsEvents.length === 0) {
    return (
      <Modal isOpen={true} onClose={onClose} title={formatDate(currentDate)}>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg">
            <NewsIcon className="text-blue-400 w-12 h-12" />
            <div>
              <p className="text-gray-300">
                A quiet month. Markets continue their steady pace. No major news to report.
              </p>
            </div>
          </div>
          <Button onClick={onClose} variant="primary" fullWidth>
            Continue
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={`World News - ${formatDate(currentDate)}`}>
      <div className="space-y-4">
        {newsEvents.map((event, index) => (
          <div
            key={event.id}
            className="p-4 bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-lg border border-blue-700/30 animate-fadeInScale"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-3">
              <NewsIcon className="text-yellow-400 w-8 h-8 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-white mb-2">{event.title}</h3>
                <p className="text-gray-300 mb-3 leading-relaxed">{event.description}</p>
                {event.impact && (
                  <div className="mt-3 p-3 bg-black/30 rounded border-l-4 border-yellow-500">
                    <p className="text-sm font-semibold text-yellow-400">
                      📊 Market Impact:
                    </p>
                    {event.impact.commodityId && (
                      <p className="text-sm text-gray-300 mt-1">
                        <span className="font-medium">{event.impact.commodityId}</span>
                        {event.impact.priceChange && (
                          <span className={event.impact.priceChange > 0 ? 'text-green-400' : 'text-red-400'}>
                            {' '}{event.impact.priceChange > 0 ? '▲' : '▼'} {Math.abs(event.impact.priceChange)}%
                          </span>
                        )}
                      </p>
                    )}
                    {!event.impact.commodityId && event.impact.priceChange && (
                      <p className="text-sm text-gray-300 mt-1">
                        All markets
                        <span className={event.impact.priceChange > 0 ? 'text-green-400' : 'text-red-400'}>
                          {' '}{event.impact.priceChange > 0 ? '▲' : '▼'} {Math.abs(event.impact.priceChange)}%
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div className="pt-4 border-t border-gray-700">
          <Button onClick={onClose} variant="primary" fullWidth>
            Continue Trading
          </Button>
        </div>
      </div>
    </Modal>
  );
};
