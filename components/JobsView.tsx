import React, { useMemo } from 'react';
import { GameState, Job } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { SkillIcon, MoneyIcon, TrendUpIcon } from './icons';

interface JobsViewProps {
  gameState: GameState;
  onSelectJob: (jobId: string) => void;
  onWorkShift: (jobId: string) => void;
}

export const JobsView: React.FC<JobsViewProps> = ({ gameState, onSelectJob, onWorkShift }) => {
  const { jobs, player, currentEra } = gameState;

  const availableJobs = useMemo(() => {
    return Object.values(jobs).filter(job => {
      // Check if player has required skills
      return job.requiredSkills.every(skillId => player.skills.includes(skillId));
    }).sort((a, b) => b.basePayPerTurn - a.basePayPerTurn); // Sort by pay
  }, [jobs, player.skills]);

  const lockedJobs = useMemo(() => {
    return Object.values(jobs).filter(job => {
      return !job.requiredSkills.every(skillId => player.skills.includes(skillId));
    }).sort((a, b) => b.basePayPerTurn - a.basePayPerTurn);
  }, [jobs, player.skills]);

  const currentJobData = player.currentJob ? jobs[player.currentJob] : null;

  const getCategoryColor = (category: Job['category']): string => {
    switch (category) {
      case 'white_collar': return 'text-blue-400';
      case 'blue_collar': return 'text-orange-400';
      case 'service': return 'text-green-400';
      case 'tech': return 'text-purple-400';
      case 'management': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: Job['difficulty']): string => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPerformanceStats = (jobId: string) => {
    return player.jobPerformance[jobId] || {
      gamesPlayed: 0,
      gamesWon: 0,
      averageScore: 0,
      bestScore: 0,
      totalEarnings: 0,
      streak: 0
    };
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-2xl font-semibold mb-2 text-blue-300">Job Board</h2>
        <p className="text-sm text-gray-400 mb-4">
          Select a job and work shifts to earn money. Performance affects your pay!
        </p>

        {currentJobData && (
          <Card className="mb-4 bg-gradient-to-r from-blue-900 to-purple-900 border-2 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-300">Current Job</div>
                <div className="text-xl font-bold text-blue-300">{currentJobData.title}</div>
                <div className="text-sm text-gray-400 mt-1">
                  Base Pay: ${currentJobData.basePayPerTurn}/shift
                </div>
              </div>
              <div className="text-right">
                <Button
                  onClick={() => onWorkShift(currentJobData.id)}
                  variant="primary"
                  leftIcon={<MoneyIcon />}
                  className="mb-2"
                >
                  Work Shift
                </Button>
                <div className="text-xs text-gray-400">
                  {getPerformanceStats(currentJobData.id).gamesPlayed} shifts completed
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-green-300">Available Jobs ({availableJobs.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableJobs.map(job => {
            const stats = getPerformanceStats(job.id);
            const isCurrentJob = player.currentJob === job.id;
            const winRate = stats.gamesPlayed > 0 ? (stats.gamesWon / stats.gamesPlayed * 100).toFixed(0) : 0;

            return (
              <Card key={job.id} title={job.title} icon={job.icon || <SkillIcon />} className={
                isCurrentJob ? 'border-2 border-blue-500' : ''
              }>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={getCategoryColor(job.category)}>
                      {job.category.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={getDifficultyColor(job.difficulty)}>
                      {job.difficulty.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400">{job.description}</p>

                  <div className="bg-gray-700 p-2 rounded text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">Base Pay:</span>
                      <span className="text-green-400 font-semibold">${job.basePayPerTurn}/shift</span>
                    </div>
                    {job.requiredSkills.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        ✓ All requirements met
                      </div>
                    )}
                  </div>

                  {stats.gamesPlayed > 0 && (
                    <div className="bg-gray-800 p-2 rounded text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Win Rate:</span>
                        <span className="text-blue-400">{winRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Earned:</span>
                        <span className="text-green-400">${stats.totalEarnings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Streak:</span>
                        <span className="text-yellow-400">{stats.streak} 🔥</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {!isCurrentJob && (
                      <Button
                        onClick={() => onSelectJob(job.id)}
                        variant="secondary"
                        className="flex-1"
                        size="sm"
                      >
                        Select Job
                      </Button>
                    )}
                    <Button
                      onClick={() => onWorkShift(job.id)}
                      variant="primary"
                      className="flex-1"
                      size="sm"
                      leftIcon={<MoneyIcon />}
                    >
                      Work Now
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {lockedJobs.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-400">Locked Jobs ({lockedJobs.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedJobs.map(job => (
              <Card key={job.id} title={job.title} icon={job.icon || <SkillIcon />} className="opacity-60">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={getCategoryColor(job.category)}>
                      {job.category.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-gray-500">LOCKED</span>
                  </div>

                  <p className="text-xs text-gray-400">{job.description}</p>

                  <div className="bg-gray-700 p-2 rounded text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">Potential Pay:</span>
                      <span className="text-gray-400">${job.basePayPerTurn}/shift</span>
                    </div>
                  </div>

                  <div className="bg-red-900 bg-opacity-20 border border-red-700 p-2 rounded text-xs">
                    <div className="text-red-400 font-semibold mb-1">Required Skills:</div>
                    {job.requiredSkills.map(skillId => (
                      <div key={skillId} className="text-gray-400">
                        • {gameState.skills[skillId]?.name || skillId}
                      </div>
                    ))}
                  </div>

                  <Button
                    disabled
                    variant="secondary"
                    className="w-full"
                    size="sm"
                  >
                    Unlock Skills First
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
