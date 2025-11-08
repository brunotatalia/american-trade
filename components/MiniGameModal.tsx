import React from 'react';
import { Modal } from './ui/Modal';
import { MiniGameResult, Job } from '../types';
import { MathQuiz } from './minigames/MathQuiz';
import { PatternMatch } from './minigames/PatternMatch';
import { DataEntry } from './minigames/DataEntry';
import { CargoLoad } from './minigames/CargoLoad';
import { AssemblyLine } from './minigames/AssemblyLine';
import { DeliveryRoute } from './minigames/DeliveryRoute';
import { WordScramble } from './minigames/WordScramble';
import { TriviaQuiz } from './minigames/TriviaQuiz';
import { Negotiation } from './minigames/Negotiation';

interface MiniGameModalProps {
  job: Job | null;
  onClose: () => void;
  onComplete: (result: MiniGameResult) => void;
}

export const MiniGameModal: React.FC<MiniGameModalProps> = ({ job, onClose, onComplete }) => {
  if (!job) return null;

  const renderGame = () => {
    const props = {
      difficulty: job.difficulty,
      basePay: job.basePayPerTurn,
      onComplete: (result: MiniGameResult) => {
        onComplete(result);
        setTimeout(onClose, 2000); // Close modal 2 seconds after completion
      }
    };

    switch (job.miniGameType) {
      case 'math_quiz':
        return <MathQuiz {...props} />;
      case 'pattern_match':
        return <PatternMatch {...props} />;
      case 'data_entry':
        return <DataEntry {...props} />;
      case 'cargo_load':
        return <CargoLoad {...props} />;
      case 'assembly_line':
        return <AssemblyLine {...props} />;
      case 'delivery_route':
        return <DeliveryRoute {...props} />;
      case 'word_scramble':
        return <WordScramble {...props} />;
      case 'trivia_quiz':
        return <TriviaQuiz {...props} />;
      case 'negotiation':
        return <Negotiation {...props} />;
      default:
        return <div className="p-4 text-center">Game type not found</div>;
    }
  };

  return (
    <Modal isOpen={!!job} onClose={onClose} title={`${job.title} - Work Shift`}>
      <div className="bg-gray-900 rounded-lg">
        {renderGame()}
      </div>
    </Modal>
  );
};
