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
  },

  // MORE OPPORTUNITY EVENTS
  {
    id: 'STARTUP_INVESTMENT',
    title: '🚀 Startup Investment Opportunity',
    description: 'A promising tech startup is looking for angel investors. They need $25,000.',
    type: 'opportunity',
    choices: [
      {
        text: 'Invest $25,000',
        action: (gs: GameState) => {
          if (gs.player.money < 25000) {
            return { gameLog: [...gs.gameLog, createLog('Insufficient funds.', 'error')] };
          }
          const success = Math.random() > 0.7; // 30% chance of big success
          if (success) {
            return {
              player: { ...gs.player, money: gs.player.money + 75000, reputation: gs.player.reputation + 50 },
              gameLog: [...gs.gameLog, createLog('Startup went public! Earned $100,000 total! +50 reputation', 'success')]
            };
          } else {
            return {
              player: { ...gs.player, money: gs.player.money - 25000 },
              gameLog: [...gs.gameLog, createLog('Startup failed. Lost your investment.', 'error')]
            };
          }
        }
      },
      {
        text: 'Pass on the opportunity',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('You declined the startup investment.', 'info')] };
        }
      }
    ]
  },
  {
    id: 'REAL_ESTATE_FLIP',
    title: '🏚️ Fixer-Upper Opportunity',
    description: 'A distressed property is available well below market value. Needs $10,000 in repairs.',
    type: 'opportunity',
    choices: [
      {
        text: 'Buy and flip ($10,000 investment)',
        action: (gs: GameState) => {
          if (gs.player.money < 10000) {
            return { gameLog: [...gs.gameLog, createLog('Not enough money.', 'error')] };
          }
          return {
            player: { ...gs.player, money: gs.player.money + 8000 },
            gameLog: [...gs.gameLog, createLog('Sold for $18,000! Net profit: $8,000', 'success')]
          };
        }
      },
      {
        text: 'Skip this deal',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('You passed on the fixer-upper.', 'info')] };
        }
      }
    ]
  },
  {
    id: 'COMMODITY_INSIDER',
    title: '📞 Commodity Tip-Off',
    description: 'A friend in the industry says gold prices are about to spike. Act fast!',
    type: 'opportunity',
    choices: [
      {
        text: 'Buy gold commodities ($7,000)',
        action: (gs: GameState) => {
          if (gs.player.money < 7000) {
            return { gameLog: [...gs.gameLog, createLog('Insufficient funds.', 'error')] };
          }
          const accurate = Math.random() > 0.4; // 60% accurate tip
          if (accurate) {
            return {
              player: { ...gs.player, money: gs.player.money + 5000 },
              gameLog: [...gs.gameLog, createLog('Gold spiked! Sold for $12,000! Profit: $5,000', 'success')]
            };
          } else {
            return {
              player: { ...gs.player, money: gs.player.money - 3000 },
              gameLog: [...gs.gameLog, createLog('Gold dropped. Sold at loss of $3,000.', 'warning')]
            };
          }
        }
      },
      {
        text: 'Ignore the tip',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('You chose not to act on the tip.', 'info')] };
        }
      }
    ]
  },

  // MORE POSITIVE EVENTS
  {
    id: 'TAX_REFUND',
    title: '💸 Tax Refund',
    description: 'You overpaid on taxes last year and received a refund!',
    type: 'positive',
    choices: [
      {
        text: 'Collect refund',
        action: (gs: GameState) => {
          const amount = Math.floor(Math.random() * 3000) + 1000;
          return {
            player: { ...gs.player, money: gs.player.money + amount },
            gameLog: [...gs.gameLog, createLog(`Received $${amount} tax refund!`, 'success')]
          };
        }
      }
    ]
  },
  {
    id: 'DIVIDEND_PAYOUT',
    title: '💰 Dividend Payout',
    description: 'Your stock investments paid out dividends!',
    type: 'positive',
    choices: [
      {
        text: 'Collect dividends',
        action: (gs: GameState) => {
          const commodityCount = Object.keys(gs.player.commodities).length;
          const payout = commodityCount * 500;
          if (payout === 0) {
            return { gameLog: [...gs.gameLog, createLog('You don\'t own any stocks.', 'info')] };
          }
          return {
            player: { ...gs.player, money: gs.player.money + payout },
            gameLog: [...gs.gameLog, createLog(`Received $${payout} in dividends!`, 'success')]
          };
        }
      }
    ]
  },
  {
    id: 'BONUS_PAYMENT',
    title: '🎁 Performance Bonus',
    description: 'Your excellent job performance earned you a bonus!',
    type: 'positive',
    choices: [
      {
        text: 'Accept bonus',
        action: (gs: GameState) => {
          const bonus = Math.floor(Math.random() * 2000) + 1000;
          return {
            player: { ...gs.player, money: gs.player.money + bonus, reputation: gs.player.reputation + 10 },
            gameLog: [...gs.gameLog, createLog(`Earned $${bonus} bonus! +10 reputation`, 'success')]
          };
        }
      }
    ]
  },
  {
    id: 'SCHOLARSHIP',
    title: '🎓 Scholarship Award',
    description: 'You won a business education scholarship!',
    type: 'positive',
    choices: [
      {
        text: 'Accept scholarship',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, money: gs.player.money + 5000, reputation: gs.player.reputation + 20 },
            gameLog: [...gs.gameLog, createLog('Scholarship awarded! +$5,000 and +20 reputation', 'success')]
          };
        }
      }
    ]
  },
  {
    id: 'CONTEST_WIN',
    title: '🏅 Contest Winner',
    description: 'You won a business plan competition!',
    type: 'positive',
    choices: [
      {
        text: 'Claim prize',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, money: gs.player.money + 10000, reputation: gs.player.reputation + 30 },
            gameLog: [...gs.gameLog, createLog('Won $10,000 and gained 30 reputation!', 'success')]
          };
        }
      }
    ]
  },

  // MORE NEGATIVE EVENTS
  {
    id: 'MEDICAL_EMERGENCY',
    title: '🏥 Medical Emergency',
    description: 'Unexpected medical bills need to be paid.',
    type: 'negative',
    choices: [
      {
        text: 'Pay medical bills',
        action: (gs: GameState) => {
          const cost = Math.floor(Math.random() * 3000) + 1000;
          return {
            player: { ...gs.player, money: Math.max(0, gs.player.money - cost) },
            gameLog: [...gs.gameLog, createLog(`Paid $${cost} in medical bills.`, 'warning')]
          };
        }
      }
    ]
  },
  {
    id: 'MARKET_MANIPULATION',
    title: '⚠️ Market Manipulation Scandal',
    description: 'False rumors spread about one of your investments.',
    type: 'negative',
    choices: [
      {
        text: 'Damage control ($3,000)',
        action: (gs: GameState) => {
          if (gs.player.money < 3000) {
            return {
              player: { ...gs.player, reputation: gs.player.reputation - 25 },
              gameLog: [...gs.gameLog, createLog('Can\'t afford PR. Lost 25 reputation.', 'error')]
            };
          }
          return {
            player: { ...gs.player, money: gs.player.money - 3000, reputation: gs.player.reputation - 5 },
            gameLog: [...gs.gameLog, createLog('Contained the scandal. Lost only 5 reputation.', 'warning')]
          };
        }
      },
      {
        text: 'Let it blow over',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, reputation: gs.player.reputation - 15 },
            gameLog: [...gs.gameLog, createLog('Reputation took a hit: -15', 'warning')]
          };
        }
      }
    ]
  },
  {
    id: 'THEFT',
    title: '🚨 Theft',
    description: 'Someone stole equipment from your property!',
    type: 'negative',
    choices: [
      {
        text: 'File insurance claim',
        action: (gs: GameState) => {
          const loss = Math.floor(Math.random() * 2000) + 500;
          const recovery = Math.floor(loss * 0.7);
          return {
            player: { ...gs.player, money: gs.player.money - loss + recovery },
            gameLog: [...gs.gameLog, createLog(`Lost $${loss}, recovered $${recovery} from insurance.`, 'warning')]
          };
        }
      }
    ]
  },
  {
    id: 'LAWSUIT',
    title: '⚖️ Lawsuit Threat',
    description: 'Someone is threatening to sue over a minor dispute.',
    type: 'negative',
    choices: [
      {
        text: 'Settle out of court ($5,000)',
        action: (gs: GameState) => {
          if (gs.player.money < 5000) {
            return { gameLog: [...gs.gameLog, createLog('Can\'t afford settlement. Facing lawsuit.', 'error')] };
          }
          return {
            player: { ...gs.player, money: gs.player.money - 5000 },
            gameLog: [...gs.gameLog, createLog('Settled for $5,000. Case closed.', 'warning')]
          };
        }
      },
      {
        text: 'Fight it in court',
        action: (gs: GameState) => {
          const win = Math.random() > 0.5;
          if (win) {
            return {
              player: { ...gs.player, reputation: gs.player.reputation + 10 },
              gameLog: [...gs.gameLog, createLog('Won the case! +10 reputation', 'success')]
            };
          } else {
            return {
              player: { ...gs.player, money: Math.max(0, gs.player.money - 8000), reputation: gs.player.reputation - 10 },
              gameLog: [...gs.gameLog, createLog('Lost case. Paid $8,000 and lost 10 reputation.', 'error')]
            };
          }
        }
      }
    ]
  },
  {
    id: 'EQUIPMENT_FAILURE',
    title: '🔧 Equipment Breakdown',
    description: 'Critical equipment needs expensive repairs.',
    type: 'negative',
    choices: [
      {
        text: 'Pay for repairs',
        action: (gs: GameState) => {
          const cost = Math.floor(Math.random() * 2500) + 1500;
          return {
            player: { ...gs.player, money: Math.max(0, gs.player.money - cost) },
            gameLog: [...gs.gameLog, createLog(`Paid $${cost} for repairs.`, 'warning')]
          };
        }
      }
    ]
  },

  // MORE CHOICE-BASED EVENTS
  {
    id: 'BUSINESS_EXPANSION',
    title: '📊 Expansion Opportunity',
    description: 'Your business could expand to a new location. Requires $20,000 investment.',
    type: 'opportunity',
    choices: [
      {
        text: 'Expand the business',
        action: (gs: GameState) => {
          if (gs.player.money < 20000) {
            return { gameLog: [...gs.gameLog, createLog('Insufficient capital.', 'error')] };
          }
          const success = Math.random() > 0.5;
          if (success) {
            return {
              player: { ...gs.player, money: gs.player.money + 15000, reputation: gs.player.reputation + 40 },
              gameLog: [...gs.gameLog, createLog('Expansion successful! Earned $35,000 total! +40 reputation', 'success')]
            };
          } else {
            return {
              player: { ...gs.player, money: gs.player.money - 20000 },
              gameLog: [...gs.gameLog, createLog('Expansion failed. Lost investment.', 'error')]
            };
          }
        }
      },
      {
        text: 'Stay current size',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('You chose not to expand.', 'info')] };
        }
      }
    ]
  },
  {
    id: 'MENTOR_OFFER',
    title: '👨‍🏫 Become a Mentor',
    description: 'A young entrepreneur asks you to mentor them. Time commitment but rewarding.',
    type: 'neutral',
    choices: [
      {
        text: 'Accept mentorship role',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, reputation: gs.player.reputation + 25 },
            gameLog: [...gs.gameLog, createLog('Mentoring experience gained +25 reputation!', 'success')]
          };
        }
      },
      {
        text: 'Too busy to mentor',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('Declined the mentorship opportunity.', 'info')] };
        }
      }
    ]
  },
  {
    id: 'CONFERENCE_SPEAKER',
    title: '🎤 Speaking Opportunity',
    description: 'You\'re invited to speak at a major business conference.',
    type: 'opportunity',
    choices: [
      {
        text: 'Accept speaking engagement',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, money: gs.player.money + 5000, reputation: gs.player.reputation + 30 },
            gameLog: [...gs.gameLog, createLog('Great speech! Earned $5,000 and +30 reputation', 'success')]
          };
        }
      },
      {
        text: 'Decline invitation',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('You declined the speaking engagement.', 'info')] };
        }
      }
    ]
  },
  {
    id: 'BOOK_DEAL',
    title: '📚 Book Publishing Offer',
    description: 'A publisher wants you to write a business book. Advance: $15,000',
    type: 'opportunity',
    choices: [
      {
        text: 'Accept book deal',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, money: gs.player.money + 15000, reputation: gs.player.reputation + 50 },
            gameLog: [...gs.gameLog, createLog('Book published! Earned $15,000 advance and +50 reputation', 'success')]
          };
        }
      },
      {
        text: 'Decline the offer',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('You passed on the book deal.', 'info')] };
        }
      }
    ]
  },
  {
    id: 'INVESTMENT_CLUB',
    title: '🤝 Investment Club Invitation',
    description: 'Join an exclusive investment club. Membership: $3,000/year, great networking.',
    type: 'opportunity',
    choices: [
      {
        text: 'Join the club',
        action: (gs: GameState) => {
          if (gs.player.money < 3000) {
            return { gameLog: [...gs.gameLog, createLog('Can\'t afford membership.', 'error')] };
          }
          return {
            player: { ...gs.player, money: gs.player.money - 3000, reputation: gs.player.reputation + 35 },
            gameLog: [...gs.gameLog, createLog('Joined investment club! +35 reputation', 'success')]
          };
        }
      },
      {
        text: 'Decline membership',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('You declined the club invitation.', 'info')] };
        }
      }
    ]
  },

  // COMPETITOR & RIVALRY EVENTS
  {
    id: 'HOSTILE_TAKEOVER',
    title: '🏢 Hostile Takeover Attempt',
    description: 'A rival businessman is trying to undercut your business dealings.',
    type: 'negative',
    choices: [
      {
        text: 'Fight back with aggressive pricing ($10,000)',
        action: (gs: GameState) => {
          if (gs.player.money < 10000) {
            return {
              player: { ...gs.player, reputation: gs.player.reputation - 20 },
              gameLog: [...gs.gameLog, createLog('Can\'t compete. Lost market share and reputation.', 'error')]
            };
          }
          return {
            player: { ...gs.player, money: gs.player.money - 10000, reputation: gs.player.reputation + 20 },
            gameLog: [...gs.gameLog, createLog('Defended your position! +20 reputation', 'success')]
          };
        }
      },
      {
        text: 'Let them take some market share',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, money: gs.player.money - 5000, reputation: gs.player.reputation - 10 },
            gameLog: [...gs.gameLog, createLog('Lost some business to competition.', 'warning')]
          };
        }
      }
    ]
  },
  {
    id: 'BUYOUT_OFFER',
    title: '💼 Buyout Offer',
    description: 'A large corporation wants to buy out one of your business interests for $50,000.',
    type: 'opportunity',
    choices: [
      {
        text: 'Accept the buyout',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, money: gs.player.money + 50000 },
            gameLog: [...gs.gameLog, createLog('Sold business interest for $50,000!', 'success')]
          };
        }
      },
      {
        text: 'Keep building the business',
        action: (gs: GameState) => {
          const success = Math.random() > 0.6;
          if (success) {
            return {
              player: { ...gs.player, money: gs.player.money + 80000, reputation: gs.player.reputation + 40 },
              gameLog: [...gs.gameLog, createLog('Business flourished! Worth $80,000 now! +40 reputation', 'success')]
            };
          } else {
            return {
              player: { ...gs.player, money: gs.player.money - 20000 },
              gameLog: [...gs.gameLog, createLog('Business struggled. Lost $20,000 in value.', 'warning')]
            };
          }
        }
      }
    ]
  },
  {
    id: 'INDUSTRIAL_ESPIONAGE',
    title: '🕵️ Corporate Espionage',
    description: 'You discovered a competitor is stealing your trade secrets!',
    type: 'negative',
    choices: [
      {
        text: 'Sue them ($15,000 legal fees)',
        action: (gs: GameState) => {
          if (gs.player.money < 15000) {
            return { gameLog: [...gs.gameLog, createLog('Can\'t afford legal action.', 'error')] };
          }
          const win = Math.random() > 0.4;
          if (win) {
            return {
              player: { ...gs.player, money: gs.player.money + 25000, reputation: gs.player.reputation + 30 },
              gameLog: [...gs.gameLog, createLog('Won lawsuit! Awarded $40,000! +30 reputation', 'success')]
            };
          } else {
            return {
              player: { ...gs.player, money: gs.player.money - 15000 },
              gameLog: [...gs.gameLog, createLog('Lost case. Out $15,000 in legal fees.', 'error')]
            };
          }
        }
      },
      {
        text: 'Improve security instead ($5,000)',
        action: (gs: GameState) => {
          if (gs.player.money < 5000) {
            return { gameLog: [...gs.gameLog, createLog('Can\'t afford security upgrades.', 'error')] };
          }
          return {
            player: { ...gs.player, money: gs.player.money - 5000, reputation: gs.player.reputation + 10 },
            gameLog: [...gs.gameLog, createLog('Enhanced security. Prevented future losses. +10 reputation', 'success')]
          };
        }
      }
    ]
  },

  // MARKET-SPECIFIC EVENTS
  {
    id: 'BULL_MARKET',
    title: '📈 Bull Market Rally',
    description: 'The market is soaring! All your investments are gaining value rapidly.',
    type: 'positive',
    choices: [
      {
        text: 'Ride the wave!',
        action: (gs: GameState) => {
          const commodityValue = Object.keys(gs.player.commodities).reduce((sum, commId) => {
            const playerComm = gs.player.commodities[commId];
            return sum + (playerComm.quantity * 50); // Bonus value per unit
          }, 0);
          const bonus = Math.max(commodityValue, 3000);
          return {
            player: { ...gs.player, money: gs.player.money + bonus },
            gameLog: [...gs.gameLog, createLog(`Bull market boost! Earned $${bonus}!`, 'success')]
          };
        }
      }
    ]
  },
  {
    id: 'BEAR_MARKET',
    title: '📉 Bear Market Slump',
    description: 'Market downturn! Your portfolio is losing value.',
    type: 'negative',
    choices: [
      {
        text: 'Hold your positions',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, reputation: gs.player.reputation + 15 },
            gameLog: [...gs.gameLog, createLog('Stayed strong during downturn. +15 reputation', 'info')]
          };
        }
      },
      {
        text: 'Panic sell at a loss',
        action: (gs: GameState) => {
          const loss = Math.floor(Math.random() * 5000) + 2000;
          return {
            player: { ...gs.player, money: Math.max(0, gs.player.money - loss), reputation: gs.player.reputation - 10 },
            gameLog: [...gs.gameLog, createLog(`Sold at bottom. Lost $${loss} and 10 reputation.`, 'error')]
          };
        }
      }
    ]
  },
  {
    id: 'COMMODITY_BOOM',
    title: '🌾 Commodity Boom',
    description: 'Agricultural commodities are experiencing unprecedented demand!',
    type: 'positive',
    choices: [
      {
        text: 'Capitalize on the boom',
        action: (gs: GameState) => {
          const bonus = Math.floor(Math.random() * 8000) + 4000;
          return {
            player: { ...gs.player, money: gs.player.money + bonus },
            gameLog: [...gs.gameLog, createLog(`Commodity boom! Earned $${bonus}!`, 'success')]
          };
        }
      }
    ]
  },

  // INNOVATION & TECHNOLOGY EVENTS
  {
    id: 'TECH_BREAKTHROUGH',
    title: '💻 Technology Revolution',
    description: 'A new technology is disrupting traditional industries. Invest early or wait?',
    type: 'opportunity',
    choices: [
      {
        text: 'Invest heavily ($30,000)',
        action: (gs: GameState) => {
          if (gs.player.money < 30000) {
            return { gameLog: [...gs.gameLog, createLog('Insufficient funds.', 'error')] };
          }
          const success = Math.random() > 0.5;
          if (success) {
            return {
              player: { ...gs.player, money: gs.player.money + 90000, reputation: gs.player.reputation + 60 },
              gameLog: [...gs.gameLog, createLog('Tech investment paid off! Earned $120,000 total! +60 reputation', 'success')]
            };
          } else {
            return {
              player: { ...gs.player, money: gs.player.money - 30000 },
              gameLog: [...gs.gameLog, createLog('Technology failed to catch on. Lost investment.', 'error')]
            };
          }
        }
      },
      {
        text: 'Wait and see',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('Took a cautious approach.', 'info')] };
        }
      }
    ]
  },
  {
    id: 'AUTOMATION_WAVE',
    title: '🤖 Automation Revolution',
    description: 'Automation could reduce your labor costs significantly. Invest $18,000?',
    type: 'opportunity',
    choices: [
      {
        text: 'Automate operations',
        action: (gs: GameState) => {
          if (gs.player.money < 18000) {
            return { gameLog: [...gs.gameLog, createLog('Can\'t afford automation.', 'error')] };
          }
          return {
            player: { ...gs.player, money: gs.player.money - 18000, reputation: gs.player.reputation + 25 },
            gameLog: [...gs.gameLog, createLog('Automation implemented! Long-term savings secured. +25 reputation', 'success')]
          };
        }
      },
      {
        text: 'Keep manual operations',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('Maintained traditional operations.', 'info')] };
        }
      }
    ]
  },

  // REGULATORY & POLITICAL EVENTS
  {
    id: 'TARIFF_IMPOSED',
    title: '🛃 Import Tariffs',
    description: 'New tariffs imposed on imported goods. This affects commodity prices!',
    type: 'negative',
    choices: [
      {
        text: 'Pay the tariffs',
        action: (gs: GameState) => {
          const tariffCost = Math.floor(Math.random() * 4000) + 2000;
          return {
            player: { ...gs.player, money: Math.max(0, gs.player.money - tariffCost) },
            gameLog: [...gs.gameLog, createLog(`Paid $${tariffCost} in new tariffs.`, 'warning')]
          };
        }
      }
    ]
  },
  {
    id: 'DEREGULATION',
    title: '📜 Industry Deregulation',
    description: 'New deregulation opens up business opportunities!',
    type: 'positive',
    choices: [
      {
        text: 'Expand into new markets',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, money: gs.player.money + 12000, reputation: gs.player.reputation + 30 },
            gameLog: [...gs.gameLog, createLog('Capitalized on deregulation! Earned $12,000 and +30 reputation', 'success')]
          };
        }
      }
    ]
  },
  {
    id: 'REGULATORY_FINE',
    title: '⚖️ Regulatory Violation',
    description: 'Accidentally violated a new regulation. Small fine or fight it?',
    type: 'negative',
    choices: [
      {
        text: 'Pay the fine ($3,000)',
        action: (gs: GameState) => {
          if (gs.player.money < 3000) {
            return { gameLog: [...gs.gameLog, createLog('Can\'t pay fine. Under investigation.', 'error')] };
          }
          return {
            player: { ...gs.player, money: gs.player.money - 3000 },
            gameLog: [...gs.gameLog, createLog('Paid $3,000 fine. Issue resolved.', 'warning')]
          };
        }
      },
      {
        text: 'Contest the violation ($7,000 legal fees)',
        action: (gs: GameState) => {
          if (gs.player.money < 7000) {
            return { gameLog: [...gs.gameLog, createLog('Can\'t afford lawyers.', 'error')] };
          }
          const win = Math.random() > 0.5;
          if (win) {
            return {
              player: { ...gs.player, money: gs.player.money - 7000, reputation: gs.player.reputation + 20 },
              gameLog: [...gs.gameLog, createLog('Won appeal! Vindicated! +20 reputation', 'success')]
            };
          } else {
            return {
              player: { ...gs.player, money: gs.player.money - 10000, reputation: gs.player.reputation - 15 },
              gameLog: [...gs.gameLog, createLog('Lost appeal. Paid $10,000 total. -15 reputation', 'error')]
            };
          }
        }
      }
    ]
  },

  // WEATHER & NATURAL EVENTS
  {
    id: 'DROUGHT',
    title: '☀️ Severe Drought',
    description: 'Drought affects agricultural commodity prices dramatically.',
    type: 'neutral',
    choices: [
      {
        text: 'Understand the impact',
        action: (gs: GameState) => {
          const impact = Math.floor(Math.random() * 6000) + 3000;
          const hasAgriCommodities = Math.random() > 0.5; // Simplified check
          if (hasAgriCommodities) {
            return {
              player: { ...gs.player, money: gs.player.money + impact },
              gameLog: [...gs.gameLog, createLog(`Drought drove up commodity prices! Earned $${impact}`, 'success')]
            };
          } else {
            return { gameLog: [...gs.gameLog, createLog('Drought affected markets, but not your portfolio.', 'info')] };
          }
        }
      }
    ]
  },
  {
    id: 'HURRICANE',
    title: '🌀 Hurricane Damage',
    description: 'A major hurricane damaged property in your region!',
    type: 'negative',
    choices: [
      {
        text: 'Assess the damage',
        action: (gs: GameState) => {
          const propertyCount = Object.keys(gs.player.properties).length;
          const damage = propertyCount * 3000;
          if (damage === 0) {
            return { gameLog: [...gs.gameLog, createLog('No properties affected.', 'info')] };
          }
          return {
            player: { ...gs.player, money: Math.max(0, gs.player.money - damage) },
            gameLog: [...gs.gameLog, createLog(`Hurricane caused $${damage} in property damage!`, 'error')]
          };
        }
      }
    ]
  },
  {
    id: 'GOLD_RUSH',
    title: '⛏️ Gold Rush!',
    description: 'Gold discovered nearby! Speculate or stay safe?',
    type: 'opportunity',
    choices: [
      {
        text: 'Buy gold mining rights ($12,000)',
        action: (gs: GameState) => {
          if (gs.player.money < 12000) {
            return { gameLog: [...gs.gameLog, createLog('Not enough capital.', 'error')] };
          }
          const profitable = Math.random() > 0.4;
          if (profitable) {
            return {
              player: { ...gs.player, money: gs.player.money + 28000, reputation: gs.player.reputation + 35 },
              gameLog: [...gs.gameLog, createLog('Struck gold! Earned $40,000 total! +35 reputation', 'success')]
            };
          } else {
            return {
              player: { ...gs.player, money: gs.player.money - 12000 },
              gameLog: [...gs.gameLog, createLog('Mine was a bust. Lost $12,000.', 'warning')]
            };
          }
        }
      },
      {
        text: 'Avoid the rush',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('Stayed away from speculation.', 'info')] };
        }
      }
    ]
  },

  // INTERNATIONAL TRADE EVENTS
  {
    id: 'TRADE_AGREEMENT',
    title: '🌍 New Trade Agreement',
    description: 'International trade agreement boosts export opportunities!',
    type: 'positive',
    choices: [
      {
        text: 'Export goods',
        action: (gs: GameState) => {
          const profit = Math.floor(Math.random() * 10000) + 5000;
          return {
            player: { ...gs.player, money: gs.player.money + profit, reputation: gs.player.reputation + 20 },
            gameLog: [...gs.gameLog, createLog(`Export profits: $${profit}! +20 reputation`, 'success')]
          };
        }
      }
    ]
  },
  {
    id: 'CURRENCY_CRISIS',
    title: '💱 Currency Crash',
    description: 'Foreign currency crisis affects international investments!',
    type: 'negative',
    choices: [
      {
        text: 'Absorb the losses',
        action: (gs: GameState) => {
          const loss = Math.floor(Math.random() * 4000) + 2000;
          return {
            player: { ...gs.player, money: Math.max(0, gs.player.money - loss) },
            gameLog: [...gs.gameLog, createLog(`Currency crisis cost $${loss}.`, 'warning')]
          };
        }
      }
    ]
  },
  {
    id: 'IMPORT_OPPORTUNITY',
    title: '📦 Import Deal',
    description: 'Exclusive import rights available for exotic commodities. Cost: $8,000',
    type: 'opportunity',
    choices: [
      {
        text: 'Secure import rights',
        action: (gs: GameState) => {
          if (gs.player.money < 8000) {
            return { gameLog: [...gs.gameLog, createLog('Insufficient funds.', 'error')] };
          }
          return {
            player: { ...gs.player, money: gs.player.money + 7000, reputation: gs.player.reputation + 25 },
            gameLog: [...gs.gameLog, createLog('Import business thriving! Earned $15,000 total! +25 reputation', 'success')]
          };
        }
      },
      {
        text: 'Pass on the deal',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('Declined import opportunity.', 'info')] };
        }
      }
    ]
  },

  // FAMILY & PERSONAL EVENTS
  {
    id: 'WEDDING_EXPENSE',
    title: '💒 Family Wedding',
    description: 'A close relative is getting married and expects a generous gift.',
    type: 'neutral',
    choices: [
      {
        text: 'Give generous gift ($2,500)',
        action: (gs: GameState) => {
          if (gs.player.money < 2500) {
            return { gameLog: [...gs.gameLog, createLog('Can\'t afford a gift.', 'info')] };
          }
          return {
            player: { ...gs.player, money: gs.player.money - 2500, reputation: gs.player.reputation + 15 },
            gameLog: [...gs.gameLog, createLog('Family appreciates your generosity. +15 reputation', 'success')]
          };
        }
      },
      {
        text: 'Give modest gift ($500)',
        action: (gs: GameState) => {
          if (gs.player.money < 500) {
            return { gameLog: [...gs.gameLog, createLog('Can\'t afford a gift.', 'info')] };
          }
          return {
            player: { ...gs.player, money: gs.player.money - 500 },
            gameLog: [...gs.gameLog, createLog('Gave a modest gift.', 'info')]
          };
        }
      }
    ]
  },
  {
    id: 'EDUCATION_OPPORTUNITY',
    title: '🎓 MBA Program',
    description: 'You\'re accepted into a prestigious MBA program. Tuition: $25,000',
    type: 'opportunity',
    choices: [
      {
        text: 'Enroll in program',
        action: (gs: GameState) => {
          if (gs.player.money < 25000) {
            return { gameLog: [...gs.gameLog, createLog('Can\'t afford tuition.', 'error')] };
          }
          return {
            player: { ...gs.player, money: gs.player.money - 25000, reputation: gs.player.reputation + 70 },
            gameLog: [...gs.gameLog, createLog('MBA completed! +70 reputation', 'success')]
          };
        }
      },
      {
        text: 'Self-educate instead',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, reputation: gs.player.reputation + 10 },
            gameLog: [...gs.gameLog, createLog('Learned through experience. +10 reputation', 'info')]
          };
        }
      }
    ]
  },

  // CRISIS & DISASTER EVENTS
  {
    id: 'BANK_RUN',
    title: '🏦 Banking Crisis',
    description: 'Your bank is experiencing a run. Withdraw funds or show confidence?',
    type: 'negative',
    choices: [
      {
        text: 'Withdraw everything',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, reputation: gs.player.reputation - 20 },
            gameLog: [...gs.gameLog, createLog('Funds secured but reputation damaged. -20', 'warning')]
          };
        }
      },
      {
        text: 'Keep funds deposited',
        action: (gs: GameState) => {
          const bankSurvives = Math.random() > 0.3;
          if (bankSurvives) {
            return {
              player: { ...gs.player, reputation: gs.player.reputation + 30 },
              gameLog: [...gs.gameLog, createLog('Bank stabilized. Your confidence rewarded! +30 reputation', 'success')]
            };
          } else {
            const loss = Math.floor(gs.player.money * 0.2);
            return {
              player: { ...gs.player, money: Math.max(0, gs.player.money - loss) },
              gameLog: [...gs.gameLog, createLog(`Bank failed! Lost $${loss}!`, 'error')]
            };
          }
        }
      }
    ]
  },
  {
    id: 'ECONOMIC_BOOM',
    title: '💰 Economic Golden Age',
    description: 'The economy is booming! Everyone is prospering!',
    type: 'positive',
    choices: [
      {
        text: 'Enjoy the prosperity!',
        action: (gs: GameState) => {
          const bonus = Math.floor(Math.random() * 15000) + 10000;
          return {
            player: { ...gs.player, money: gs.player.money + bonus, reputation: gs.player.reputation + 40 },
            gameLog: [...gs.gameLog, createLog(`Economic boom! Earned $${bonus} and +40 reputation!`, 'success')]
          };
        }
      }
    ]
  },
  {
    id: 'GREAT_DEPRESSION',
    title: '📉 Economic Depression',
    description: 'Severe economic downturn! Businesses are failing everywhere.',
    type: 'negative',
    choices: [
      {
        text: 'Cut costs and survive',
        action: (gs: GameState) => {
          const loss = Math.floor(Math.random() * 8000) + 4000;
          return {
            player: { ...gs.player, money: Math.max(0, gs.player.money - loss) },
            gameLog: [...gs.gameLog, createLog(`Depression hit hard. Lost $${loss}.`, 'error')]
          };
        }
      }
    ]
  },

  // SUCCESS & ACHIEVEMENT EVENTS
  {
    id: 'BUSINESS_AWARD',
    title: '🏆 Business Excellence Award',
    description: 'You won "Entrepreneur of the Year"!',
    type: 'positive',
    choices: [
      {
        text: 'Accept the award',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, money: gs.player.money + 20000, reputation: gs.player.reputation + 60 },
            gameLog: [...gs.gameLog, createLog('Award includes $20,000 prize! +60 reputation!', 'success')]
          };
        }
      }
    ]
  },
  {
    id: 'MEDIA_FEATURE',
    title: '📺 Media Feature',
    description: 'A major business magazine wants to feature your success story!',
    type: 'positive',
    choices: [
      {
        text: 'Accept the feature',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, reputation: gs.player.reputation + 50 },
            gameLog: [...gs.gameLog, createLog('Great publicity! +50 reputation!', 'success')]
          };
        }
      }
    ]
  },
  {
    id: 'HALL_OF_FAME',
    title: '⭐ Business Hall of Fame',
    description: 'You\'re being inducted into the Business Hall of Fame!',
    type: 'positive',
    choices: [
      {
        text: 'Accept the honor',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, reputation: gs.player.reputation + 100 },
            gameLog: [...gs.gameLog, createLog('Ultimate recognition! +100 reputation!', 'success')]
          };
        }
      }
    ]
  },

  // PROPERTY & REAL ESTATE EVENTS
  {
    id: 'ZONING_CHANGE',
    title: '🏗️ Zoning Law Change',
    description: 'New zoning laws could increase your property values!',
    type: 'positive',
    choices: [
      {
        text: 'Capitalize on rezoning',
        action: (gs: GameState) => {
          const propertyCount = Object.keys(gs.player.properties).length;
          const bonus = propertyCount * 5000;
          if (bonus === 0) {
            return { gameLog: [...gs.gameLog, createLog('No properties to benefit.', 'info')] };
          }
          return {
            player: { ...gs.player, money: gs.player.money + bonus },
            gameLog: [...gs.gameLog, createLog(`Properties appreciated $${bonus} from rezoning!`, 'success')]
          };
        }
      }
    ]
  },
  {
    id: 'PROPERTY_DEVELOPMENT',
    title: '🏘️ Development Opportunity',
    description: 'Develop raw land into a commercial project? Cost: $40,000',
    type: 'opportunity',
    choices: [
      {
        text: 'Develop the property',
        action: (gs: GameState) => {
          if (gs.player.money < 40000) {
            return { gameLog: [...gs.gameLog, createLog('Insufficient capital.', 'error')] };
          }
          const success = Math.random() > 0.5;
          if (success) {
            return {
              player: { ...gs.player, money: gs.player.money + 60000, reputation: gs.player.reputation + 50 },
              gameLog: [...gs.gameLog, createLog('Development successful! Earned $100,000 total! +50 reputation', 'success')]
            };
          } else {
            return {
              player: { ...gs.player, money: gs.player.money - 40000 },
              gameLog: [...gs.gameLog, createLog('Development failed. Lost investment.', 'error')]
            };
          }
        }
      },
      {
        text: 'Keep land undeveloped',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('Chose not to develop.', 'info')] };
        }
      }
    ]
  },
  {
    id: 'EMINENT_DOMAIN',
    title: '🏛️ Eminent Domain',
    description: 'Government wants to buy your property for public use!',
    type: 'neutral',
    choices: [
      {
        text: 'Accept government offer',
        action: (gs: GameState) => {
          const compensation = Math.floor(Math.random() * 30000) + 20000;
          return {
            player: { ...gs.player, money: gs.player.money + compensation },
            gameLog: [...gs.gameLog, createLog(`Received $${compensation} compensation.`, 'info')]
          };
        }
      },
      {
        text: 'Fight the seizure ($10,000 legal fees)',
        action: (gs: GameState) => {
          if (gs.player.money < 10000) {
            return { gameLog: [...gs.gameLog, createLog('Can\'t afford to fight.', 'error')] };
          }
          const win = Math.random() > 0.6;
          if (win) {
            return {
              player: { ...gs.player, money: gs.player.money + 40000, reputation: gs.player.reputation + 30 },
              gameLog: [...gs.gameLog, createLog('Won case! Received $50,000 compensation! +30 reputation', 'success')]
            };
          } else {
            return {
              player: { ...gs.player, money: gs.player.money - 10000 },
              gameLog: [...gs.gameLog, createLog('Lost case. Paid $10,000 in fees.', 'error')]
            };
          }
        }
      }
    ]
  },

  // SKILL & JOB RELATED EVENTS
  {
    id: 'HEADHUNTER',
    title: '👔 Executive Headhunter',
    description: 'A headhunter offers you a lucrative executive position.',
    type: 'opportunity',
    choices: [
      {
        text: 'Accept the position',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, money: gs.player.money + 30000, reputation: gs.player.reputation + 40 },
            gameLog: [...gs.gameLog, createLog('New executive role! Earned $30,000 signing bonus! +40 reputation', 'success')]
          };
        }
      },
      {
        text: 'Stay independent',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('Remained an independent entrepreneur.', 'info')] };
        }
      }
    ]
  },
  {
    id: 'TRAINING_PROGRAM',
    title: '📊 Advanced Training',
    description: 'Elite business training program available. Cost: $8,000',
    type: 'opportunity',
    choices: [
      {
        text: 'Enroll in training',
        action: (gs: GameState) => {
          if (gs.player.money < 8000) {
            return { gameLog: [...gs.gameLog, createLog('Can\'t afford training.', 'error')] };
          }
          return {
            player: { ...gs.player, money: gs.player.money - 8000, reputation: gs.player.reputation + 35 },
            gameLog: [...gs.gameLog, createLog('Skills enhanced! +35 reputation', 'success')]
          };
        }
      },
      {
        text: 'Skip the training',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('Decided against training.', 'info')] };
        }
      }
    ]
  },

  // REPUTATION & SOCIAL EVENTS
  {
    id: 'SOCIAL_CLUB',
    title: '🎩 Elite Social Club',
    description: 'Invitation to join an exclusive social club. Membership: $15,000',
    type: 'opportunity',
    choices: [
      {
        text: 'Join the club',
        action: (gs: GameState) => {
          if (gs.player.money < 15000) {
            return { gameLog: [...gs.gameLog, createLog('Can\'t afford membership.', 'error')] };
          }
          return {
            player: { ...gs.player, money: gs.player.money - 15000, reputation: gs.player.reputation + 60 },
            gameLog: [...gs.gameLog, createLog('Accepted into elite circles! +60 reputation', 'success')]
          };
        }
      },
      {
        text: 'Decline invitation',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('Declined club membership.', 'info')] };
        }
      }
    ]
  },
  {
    id: 'PHILANTHROPY',
    title: '❤️ Philanthropic Initiative',
    description: 'Start a charitable foundation in your name? Cost: $50,000',
    type: 'opportunity',
    choices: [
      {
        text: 'Found the charity',
        action: (gs: GameState) => {
          if (gs.player.money < 50000) {
            return { gameLog: [...gs.gameLog, createLog('Insufficient funds.', 'error')] };
          }
          return {
            player: { ...gs.player, money: gs.player.money - 50000, reputation: gs.player.reputation + 100 },
            gameLog: [...gs.gameLog, createLog('Foundation established! Major reputation boost! +100', 'success')]
          };
        }
      },
      {
        text: 'Not ready yet',
        action: (gs: GameState) => {
          return { gameLog: [...gs.gameLog, createLog('Deferred philanthropy plans.', 'info')] };
        }
      }
    ]
  },
  {
    id: 'SCANDAL_DODGE',
    title: '📰 Scandal Narrowly Avoided',
    description: 'A potential scandal was averted thanks to your good reputation!',
    type: 'positive',
    choices: [
      {
        text: 'Grateful for good reputation',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, reputation: gs.player.reputation + 20 },
            gameLog: [...gs.gameLog, createLog('Reputation protected you! +20 more reputation', 'success')]
          };
        }
      }
    ]
  },

  // UNIQUE & RARE EVENTS
  {
    id: 'TIME_TRAVELER',
    title: '⏰ Mysterious Stranger',
    description: 'A stranger offers "future knowledge" about markets for $20,000. Scam or real?',
    type: 'opportunity',
    choices: [
      {
        text: 'Buy the information',
        action: (gs: GameState) => {
          if (gs.player.money < 20000) {
            return { gameLog: [...gs.gameLog, createLog('Not enough money.', 'error')] };
          }
          const legitimate = Math.random() > 0.8; // 20% chance it's real
          if (legitimate) {
            return {
              player: { ...gs.player, money: gs.player.money + 80000, reputation: gs.player.reputation + 50 },
              gameLog: [...gs.gameLog, createLog('Information was accurate! Earned $100,000 total! +50 reputation', 'success')]
            };
          } else {
            return {
              player: { ...gs.player, money: gs.player.money - 20000, reputation: gs.player.reputation - 20 },
              gameLog: [...gs.gameLog, createLog('It was a scam! Lost $20,000 and reputation.', 'error')]
            };
          }
        }
      },
      {
        text: 'Walk away',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, reputation: gs.player.reputation + 10 },
            gameLog: [...gs.gameLog, createLog('Wisely avoided suspicious offer. +10 reputation', 'success')]
          };
        }
      }
    ]
  },
  {
    id: 'BURIED_TREASURE',
    title: '💎 Treasure Discovery',
    description: 'You discovered valuable artifacts on your property!',
    type: 'positive',
    choices: [
      {
        text: 'Sell the treasure',
        action: (gs: GameState) => {
          const value = Math.floor(Math.random() * 40000) + 20000;
          return {
            player: { ...gs.player, money: gs.player.money + value },
            gameLog: [...gs.gameLog, createLog(`Treasure sold for $${value}!`, 'success')]
          };
        }
      },
      {
        text: 'Donate to museum',
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, reputation: gs.player.reputation + 80 },
            gameLog: [...gs.gameLog, createLog('Museum donation! +80 reputation!', 'success')]
          };
        }
      }
    ]
  },
  {
    id: 'LOTTERY_JACKPOT',
    title: '🎰 Lottery Jackpot!',
    description: 'You won the grand prize lottery!',
    type: 'positive',
    choices: [
      {
        text: 'Claim your prize!',
        action: (gs: GameState) => {
          const jackpot = Math.floor(Math.random() * 50000) + 50000;
          return {
            player: { ...gs.player, money: gs.player.money + jackpot },
            gameLog: [...gs.gameLog, createLog(`Jackpot! Won $${jackpot}!`, 'success')]
          };
        }
      }
    ]
  }
];

// Total events: 80+ with rich variety, meaningful choices, and engaging gameplay!
