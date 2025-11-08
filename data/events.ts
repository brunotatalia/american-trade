import { GameEvent, GameState } from '../types';
import * as GameLogic from '../services/gameLogic';

// Helper to create log
const createLog = GameLogic.createLog;

export const GAME_EVENTS: GameEvent[] = [
  // POSITIVE OPPORTUNITY EVENTS
  {
    id: 'HOT_TIP',
    title: '💡 Hot Stock Tip',
    description: 'A reliable source gives you inside information about a commodity that\'s about to surge. Do you act on this tip?',
    type: 'opportunity',
    choices: [
      {
        text: 'Invest $5,000 (Risky but potentially profitable)',
        action: (gs: GameState) => {
          if (gs.player.money < 5000) {
            return { gameLog: [...gs.gameLog, createLog('Not enough money for this investment!', 'error')] };
          }
          const profitable = Math.random() > 0.3; // 70% success rate
          if (profitable) {
            return {
              player: { ...gs.player, money: gs.player.money + 8000 },
              gameLog: [...gs.gameLog, createLog('The tip paid off! Earned $8,000!', 'success')]
            };
          } else {
            return {
              player: { ...gs.player, money: gs.player.money - 5000 },
              gameLog: [...gs.gameLog, createLog('The tip was wrong. Lost $5,000.', 'warning')]
            };
          }
        }
      },
      {
        text: 'Play it safe and pass',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('You decided not to risk it.', 'info')] };
        }
      }
    ]
  },
  {
    id: 'INHERITANCE',
    title: '💰 Unexpected Inheritance',
    description: 'A distant relative has passed away and left you a small inheritance!',
    type: 'positive',
    choices: [
      {
        text: 'Claim the inheritance',
        action: (gs: GameState) => {
          const amount = Math.floor(Math.random() * 15000) + 5000;
          return {
            player: { ...gs.player, money: gs.player.money + amount },
            gameLog: [...gs.gameLog, createLog(`Received $${amount} inheritance!`, 'success')]
          };
        }
      }
    ]
  },
  {
    id: 'BUSINESS_MENTOR',
    title: '🎓 Mentor Opportunity',
    description: 'A successful businessman offers to mentor you for free, sharing valuable insights.',
    type: 'positive',
    choices: [
      {
        text: 'Accept the mentorship',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, reputation: gs.player.reputation + 50 },
            gameLog: [...gs.gameLog, createLog('Gained 50 reputation from mentorship!', 'success')]
          };
        }
      }
    ]
  },
  {
    id: 'LOTTERY_WIN',
    title: '🎰 Lottery Win!',
    description: 'You won a small prize in the lottery!',
    type: 'positive',
    choices: [
      {
        text: 'Collect your winnings',
        action: (gs: GameState) => {
          const amount = Math.floor(Math.random() * 3000) + 1000;
          return {
            player: { ...gs.player, money: gs.player.money + amount },
            gameLog: [...gs.gameLog, createLog(`Won $${amount} in the lottery!`, 'success')]
          };
        }
      }
    ]
  },
  {
    id: 'PROPERTY_APPRECIATION',
    title: '🏠 Property Value Surge',
    description: 'Your properties have appreciated significantly due to a booming real estate market!',
    type: 'positive',
    choices: [
      {
        text: 'Excellent news!',
        action: (gs: GameState) => {
          const propertyCount = Object.keys(gs.player.properties).length;
          const bonus = propertyCount * 2000;
          if (propertyCount === 0) {
            return { gameLog: [...gs.gameLog, createLog('You don\'t own any properties.', 'info')] };
          }
          return {
            player: { ...gs.player, money: gs.player.money + bonus },
            gameLog: [...gs.gameLog, createLog(`Properties appreciated! Gained $${bonus}`, 'success')]
          };
        }
      }
    ]
  },

  // NEGATIVE/CRISIS EVENTS
  {
    id: 'MARKET_CRASH',
    title: '📉 Market Crash!',
    description: 'The stock market has crashed! Your investments are taking a hit.',
    type: 'negative',
    choices: [
      {
        text: 'Sell everything to minimize losses',
        action: (gs: GameState) => {
          const totalValue = Object.keys(gs.player.commodities).reduce((sum, commId) => {
            const comm = gs.commodities[commId];
            const playerComm = gs.player.commodities[commId];
            return sum + (comm ? comm.price * playerComm.quantity * 0.7 : 0); // 30% loss
          }, 0);
          return {
            player: {
              ...gs.player,
              money: gs.player.money + totalValue,
              commodities: {} // Sell everything
            },
            gameLog: [...gs.gameLog, createLog(`Panic sold! Recovered $${Math.floor(totalValue)}`, 'warning')]
          };
        }
      },
      {
        text: 'Hold your positions and wait it out',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, reputation: gs.player.reputation + 20 },
            gameLog: [...gs.gameLog, createLog('You held strong through the crash. +20 reputation', 'info')]
          };
        }
      }
    ]
  },
  {
    id: 'UNEXPECTED_BILL',
    title: '💸 Unexpected Expense',
    description: 'You received an unexpected bill for repairs and maintenance.',
    type: 'negative',
    choices: [
      {
        text: 'Pay the bill',
        action: (gs: GameState) => {
          const amount = Math.floor(Math.random() * 2000) + 500;
          return {
            player: { ...gs.player, money: Math.max(0, gs.player.money - amount) },
            gameLog: [...gs.gameLog, createLog(`Paid $${amount} in unexpected expenses.`, 'warning')]
          };
        }
      }
    ]
  },
  {
    id: 'SCAM_ALERT',
    title: '⚠️ Investment Scam',
    description: 'Someone approaches you with a "too good to be true" investment opportunity.',
    type: 'opportunity',
    choices: [
      {
        text: 'Invest $10,000 (Extremely risky)',
        action: (gs: GameState) => {
          if (gs.player.money < 10000) {
            return { gameLog: [...gs.gameLog, createLog('Not enough money!', 'error')] };
          }
          const isScam = Math.random() > 0.2; // 80% chance it's a scam
          if (isScam) {
            return {
              player: { ...gs.player, money: gs.player.money - 10000, reputation: gs.player.reputation - 10 },
              gameLog: [...gs.gameLog, createLog('It was a scam! Lost $10,000 and reputation.', 'error')]
            };
          } else {
            return {
              player: { ...gs.player, money: gs.player.money + 20000 },
              gameLog: [...gs.gameLog, createLog('Surprisingly, it was legitimate! Earned $20,000!', 'success')]
            };
          }
        }
      },
      {
        text: 'Decline the offer',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, reputation: gs.player.reputation + 5 },
            gameLog: [...gs.gameLog, createLog('You wisely avoided a potential scam. +5 reputation', 'success')]
          };
        }
      }
    ]
  },
  {
    id: 'TAX_AUDIT',
    title: '🏛️ Tax Audit',
    description: 'The IRS is auditing your finances. You need to pay additional taxes.',
    type: 'negative',
    choices: [
      {
        text: 'Pay the taxes',
        action: (gs: GameState) => {
          const taxAmount = Math.floor(gs.player.money * 0.1);
          return {
            player: { ...gs.player, money: Math.max(0, gs.player.money - taxAmount) },
            gameLog: [...gs.gameLog, createLog(`Paid $${taxAmount} in back taxes.`, 'warning')]
          };
        }
      }
    ]
  },
  {
    id: 'REPUTATION_SCANDAL',
    title: '📰 Media Scandal',
    description: 'False rumors are spreading about your business practices.',
    type: 'negative',
    choices: [
      {
        text: 'Hire a PR firm to fix it ($5,000)',
        action: (gs: GameState) => {
          if (gs.player.money < 5000) {
            return {
              player: { ...gs.player, reputation: gs.player.reputation - 30 },
              gameLog: [...gs.gameLog, createLog('Can\'t afford PR. Lost 30 reputation.', 'error')]
            };
          }
          return {
            player: { ...gs.player, money: gs.player.money - 5000, reputation: gs.player.reputation + 10 },
            gameLog: [...gs.gameLog, createLog('PR campaign successful! Reputation restored.', 'success')]
          };
        }
      },
      {
        text: 'Ignore it and move on',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, reputation: gs.player.reputation - 20 },
            gameLog: [...gs.gameLog, createLog('Reputation suffered from the scandal.', 'warning')]
          };
        }
      }
    ]
  },

  // NEUTRAL/CHOICE EVENTS
  {
    id: 'CHARITY_REQUEST',
    title: '❤️ Charity Donation Request',
    description: 'A local charity asks for a donation to help the community.',
    type: 'neutral',
    choices: [
      {
        text: 'Donate $2,000',
        action: (gs: GameState) => {
          if (gs.player.money < 2000) {
            return { gameLog: [...gs.gameLog, createLog('Not enough money to donate.', 'error')] };
          }
          return {
            player: { ...gs.player, money: gs.player.money - 2000, reputation: gs.player.reputation + 30 },
            gameLog: [...gs.gameLog, createLog('Donation made! Gained 30 reputation.', 'success')]
          };
        }
      },
      {
        text: 'Politely decline',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('You declined the donation request.', 'info')] };
        }
      }
    ]
  },
  {
    id: 'NETWORKING_EVENT',
    title: '🤝 Networking Opportunity',
    description: 'You\'re invited to an exclusive networking event. Attendance fee: $1,000',
    type: 'opportunity',
    choices: [
      {
        text: 'Attend the event',
        action: (gs: GameState) => {
          if (gs.player.money < 1000) {
            return { gameLog: [...gs.gameLog, createLog('Can\'t afford the entrance fee.', 'error')] };
          }
          const success = Math.random() > 0.4;
          if (success) {
            return {
              player: { ...gs.player, money: gs.player.money - 1000, reputation: gs.player.reputation + 40 },
              gameLog: [...gs.gameLog, createLog('Made valuable connections! +40 reputation', 'success')]
            };
          } else {
            return {
              player: { ...gs.player, money: gs.player.money - 1000 },
              gameLog: [...gs.gameLog, createLog('Event was disappointing. Lost $1,000.', 'warning')]
            };
          }
        }
      },
      {
        text: 'Skip the event',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('You decided to skip the networking event.', 'info')] };
        }
      }
    ]
  },
  {
    id: 'BUSINESS_PARTNER',
    title: '🤝 Partnership Proposal',
    description: 'Someone wants to partner with you on a business venture. They need $15,000 investment.',
    type: 'opportunity',
    choices: [
      {
        text: 'Invest in the partnership',
        action: (gs: GameState) => {
          if (gs.player.money < 15000) {
            return { gameLog: [...gs.gameLog, createLog('Not enough capital to invest.', 'error')] };
          }
          const success = Math.random() > 0.5;
          if (success) {
            return {
              player: { ...gs.player, money: gs.player.money + 10000, reputation: gs.player.reputation + 20 },
              gameLog: [...gs.gameLog, createLog('Partnership thrived! Earned $25,000 total!', 'success')]
            };
          } else {
            return {
              player: { ...gs.player, money: gs.player.money - 15000 },
              gameLog: [...gs.gameLog, createLog('Partnership failed. Lost your investment.', 'error')]
            };
          }
        }
      },
      {
        text: 'Decline the partnership',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('You passed on the partnership opportunity.', 'info')] };
        }
      }
    ]
  },
  {
    id: 'PATENT_OPPORTUNITY',
    title: '💡 Patent for Sale',
    description: 'An inventor is selling a patent that could be valuable. Price: $20,000',
    type: 'opportunity',
    choices: [
      {
        text: 'Buy the patent',
        action: (gs: GameState) => {
          if (gs.player.money < 20000) {
            return { gameLog: [...gs.gameLog, createLog('Can\'t afford the patent.', 'error')] };
          }
          const valuable = Math.random() > 0.6; // 40% chance it's valuable
          if (valuable) {
            return {
              player: { ...gs.player, money: gs.player.money + 30000 },
              gameLog: [...gs.gameLog, createLog('Patent was valuable! Sold for $50,000!', 'success')]
            };
          } else {
            return {
              player: { ...gs.player, money: gs.player.money - 20000 },
              gameLog: [...gs.gameLog, createLog('Patent was worthless. Lost $20,000.', 'warning')]
            };
          }
        }
      },
      {
        text: 'Pass on the patent',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('You declined the patent purchase.', 'info')] };
        }
      }
    ]
  },
  {
    id: 'EMERGENCY_SALE',
    title: '🔥 Fire Sale!',
    description: 'A business is having an emergency liquidation sale. Great deals available!',
    type: 'opportunity',
    choices: [
      {
        text: 'Buy discounted inventory ($8,000)',
        action: (gs: GameState) => {
          if (gs.player.money < 8000) {
            return { gameLog: [...gs.gameLog, createLog('Not enough money for inventory.', 'error')] };
          }
          return {
            player: { ...gs.player, money: gs.player.money + 4000 },
            gameLog: [...gs.gameLog, createLog('Flipped inventory for $12,000! Net profit: $4,000', 'success')]
          };
        }
      },
      {
        text: 'Skip the sale',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('You passed on the fire sale.', 'info')] };
        }
      }
    ]
  }
];

// Add more events here - this is just the start!
// Events will continue to be added...
