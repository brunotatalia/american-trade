
import React from 'react';
import { GameEvent, GameState } from '../types';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { InfoIcon, AlertIcon } from './icons';

interface EventPopupProps {
  event: GameEvent | null;
  onClose: () => void;
  onChoice: (choiceAction: (game: GameState) => Partial<GameState> | void) => void;
  gameState: GameState;
}

export const EventPopup: React.FC<EventPopupProps> = ({ event, onClose, onChoice, gameState }) => {
  if (!event) return null;

  const handleChoice = (choiceAction: (game: GameState) => Partial<GameState> | void) => {
    onChoice(choiceAction);
    onClose();
  };
  
  const Icon = event.type === 'negative' ? <AlertIcon className="text-red-400 mr-2"/> : <InfoIcon className="text-blue-400 mr-2"/>;

  return (
    <Modal isOpen={!!event} onClose={onClose} title={event.title}>
        <div className="flex items-start mb-4">
            {Icon}
            <p className="text-gray-300">{event.description}</p>
        </div>
        {event.choices && event.choices.length > 0 && (
            <div className="mt-6 space-y-3">
            {event.choices.map((choice, index) => (
                <Button
                key={index}
                onClick={() => handleChoice(choice.action)}
                variant={index === 0 ? "primary" : "secondary"}
                className="w-full"
                >
                {choice.text}
                </Button>
            ))}
            </div>
        )}
        {!event.choices || event.choices.length === 0 && (
             <Button
                onClick={onClose}
                variant="primary"
                className="w-full mt-6"
                >
                Okay
            </Button>
        )}
    </Modal>
  );
};
