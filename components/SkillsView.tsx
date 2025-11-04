
import React from 'react';
import { GameState, Skill } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { MoneyIcon, SkillIcon as BrainIcon } from './icons';

interface SkillsViewProps {
  gameState: GameState;
  onUnlockSkill: (skillId: string) => void;
}

export const SkillsView: React.FC<SkillsViewProps> = ({ gameState, onUnlockSkill }) => {
  const { skills, player, currentEra } = gameState;

  const availableSkills = React.useMemo(() => {
    if (!currentEra) return [];
    return currentEra.availableSkills.map(id => skills[id]).filter(Boolean);
  }, [skills, currentEra]);

  if (!currentEra) {
    return <p className="p-4 text-gray-400">Select an Era to develop skills.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-2 text-purple-300">Skill Development</h2>
      <p className="text-sm text-gray-400 mb-6">Era: {currentEra.name}. Invest in yourself to gain an edge.</p>

      {availableSkills.length === 0 && <p className="text-gray-400">No skills available in this era yet.</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableSkills.map((skill) => {
          const isUnlocked = player.skills.includes(skill.id);
          const canAfford = player.money >= skill.cost;
          return (
            <Card key={skill.id} title={skill.name} icon={skill.icon || <BrainIcon />}>
              <p className="text-sm text-gray-400 mb-2">{skill.description}</p>
              <p className="text-sm text-gray-300 italic mb-2">Effect: {skill.effectDescription}</p>
              <p className="text-sm font-semibold text-gray-300 mb-4">Cost: ${skill.cost.toLocaleString()}</p>
              <Button
                onClick={() => onUnlockSkill(skill.id)}
                disabled={isUnlocked || !canAfford}
                variant={isUnlocked ? "secondary" : "primary"}
                className="w-full"
                leftIcon={<MoneyIcon />}
              >
                {isUnlocked ? 'Unlocked' : (canAfford ? 'Unlock Skill' : 'Cannot Afford')}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
