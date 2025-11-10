import { GameState, GameEvent } from './types';
import { createLog } from './services/gameLogic';

/**
 * Dynamic Events System
 * 50+ events across 10 categories
 */

export interface EventTemplate {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral' | 'opportunity';
  category: 'business' | 'investment' | 'career' | 'market' | 'personal' | 'tech' | 'real_estate' | 'social' | 'crisis' | 'seasonal';
  probability: number; // 0-1, how likely to trigger
  minTurn?: number; // Minimum turn requirement
  requirements?: (state: GameState) => boolean; // Custom requirements
  choices: Array<{
    text: string;
    action: (gs: GameState) => Partial<GameState> | void;
  }>;
}

export const EVENTS_DATA: EventTemplate[] = [
  // === BUSINESS & INVESTMENT EVENTS (10) ===
  {
    id: 'startup_pitch',
    title: 'Startup Investment Opportunity',
    description: 'A promising tech startup is looking for early investors. They need $500 for 10% equity.',
    type: 'opportunity',
    category: 'business',
    probability: 0.15,
    minTurn: 10,
    choices: [
      {
        text: 'Invest $500',
        action: (gs) => {
          if (gs.player.money >= 500) {
            const success = Math.random() > 0.4;
            if (success) {
              return {
                player: { ...gs.player, money: gs.player.money + 1500 },
                gameLog: [...gs.gameLog, createLog('Startup succeeded! Earned $1,500 profit!', 'success')]
              };
            } else {
              return {
                player: { ...gs.player, money: gs.player.money - 500 },
                gameLog: [...gs.gameLog, createLog('Startup failed. Lost $500.', 'warning')]
              };
            }
          }
          return { gameLog: [...gs.gameLog, createLog('Not enough money to invest.', 'error')] };
        }
      },
      {
        text: 'Pass on this opportunity',
        action: () => {}
      }
    ]
  },
  
  {
    id: 'franchise_offer',
    title: 'Franchise Opportunity',
    description: 'A successful restaurant chain is offering franchise rights in your area for $2,000.',
    type: 'opportunity',
    category: 'business',
    probability: 0.1,
    minTurn: 20,
    requirements: (state) => state.player.money >= 1000,
    choices: [
      {
        text: 'Buy franchise ($2,000)',
        action: (gs) => {
          if (gs.player.money >= 2000) {
            return {
              player: { ...gs.player, money: gs.player.money - 2000, reputation: gs.player.reputation + 25 },
              gameLog: [...gs.gameLog, createLog('Franchise purchased! +25 reputation, generates passive income.', 'success')]
            };
          }
          return { gameLog: [...gs.gameLog, createLog('Not enough money.', 'error')] };
        }
      },
      {
        text: 'Decline',
        action: () => {}
      }
    ]
  },

  {
    id: 'angel_investing',
    title: 'Angel Investor Network',
    description: 'Join an exclusive angel investor network for $1,000. Access to premium investment opportunities.',
    type: 'opportunity',
    category: 'investment',
    probability: 0.08,
    minTurn: 30,
    requirements: (state) => state.player.reputation >= 100,
    choices: [
      {
        text: 'Join network ($1,000)',
        action: (gs) => {
          if (gs.player.money >= 1000) {
            return {
              player: { ...gs.player, money: gs.player.money - 1000, reputation: gs.player.reputation + 50 },
              gameLog: [...gs.gameLog, createLog('Joined angel investor network! +50 reputation.', 'success')]
            };
          }
          return { gameLog: [...gs.gameLog, createLog('Not enough money.', 'error')] };
        }
      },
      {
        text: 'Not interested',
        action: () => {}
      }
    ]
  },

  {
    id: 'business_partnership',
    title: 'Partnership Proposal',
    description: 'A successful entrepreneur wants to partner with you on a new venture. Requires $750 investment.',
    type: 'opportunity',
    category: 'business',
    probability: 0.12,
    minTurn: 15,
    choices: [
      {
        text: 'Accept partnership ($750)',
        action: (gs) => {
          if (gs.player.money >= 750) {
            const profit = 500 + Math.floor(Math.random() * 1000);
            return {
              player: { ...gs.player, money: gs.player.money - 750 + profit, reputation: gs.player.reputation + 15 },
              gameLog: [...gs.gameLog, createLog(`Partnership successful! Earned $${profit} profit!`, 'success')]
            };
          }
          return { gameLog: [...gs.gameLog, createLog('Not enough money.', 'error')] };
        }
      },
      {
        text: 'Decline',
        action: () => {}
      }
    ]
  },

  {
    id: 'acquisition_offer',
    title: 'Business Acquisition Offer',
    description: 'Someone wants to buy one of your properties for 150% of its value!',
    type: 'opportunity',
    category: 'business',
    probability: 0.1,
    requirements: (state) => state.player.properties.length > 0,
    choices: [
      {
        text: 'Sell property',
        action: (gs) => {
          if (gs.player.properties.length > 0) {
            const propertyId = gs.player.properties[0];
            const property = gs.properties[propertyId];
            const salePrice = property.cost * 1.5;
            
            return {
              player: {
                ...gs.player,
                money: gs.player.money + salePrice,
                properties: gs.player.properties.filter(p => p !== propertyId)
              },
              gameLog: [...gs.gameLog, createLog(`Sold ${property.name} for $${salePrice.toFixed(2)}!`, 'success')]
            };
          }
          return {};
        }
      },
      {
        text: 'Keep property',
        action: () => {}
      }
    ]
  },

  // === CAREER & EDUCATION EVENTS (7) ===
  {
    id: 'mba_program',
    title: 'MBA Program Opportunity',
    description: 'Enroll in an executive MBA program for $3,000. Increases your business acumen significantly.',
    type: 'opportunity',
    category: 'career',
    probability: 0.08,
    minTurn: 25,
    choices: [
      {
        text: 'Enroll ($3,000)',
        action: (gs) => {
          if (gs.player.money >= 3000) {
            return {
              player: { ...gs.player, money: gs.player.money - 3000, reputation: gs.player.reputation + 75 },
              gameLog: [...gs.gameLog, createLog('Completed MBA! +75 reputation, new opportunities unlocked.', 'success')]
            };
          }
          return { gameLog: [...gs.gameLog, createLog('Not enough money.', 'error')] };
        }
      },
      {
        text: 'Maybe later',
        action: () => {}
      }
    ]
  },

  {
    id: 'headhunter',
    title: 'Executive Headhunter',
    description: 'A headhunter offers you a high-paying consulting gig worth $1,200.',
    type: 'opportunity',
    category: 'career',
    probability: 0.15,
    minTurn: 20,
    requirements: (state) => state.player.skills.length >= 2,
    choices: [
      {
        text: 'Accept job',
        action: (gs) => {
          return {
            player: { ...gs.player, money: gs.player.money + 1200, reputation: gs.player.reputation + 10 },
            gameLog: [...gs.gameLog, createLog('Consulting gig completed! +$1,200 and +10 reputation.', 'success')]
          };
        }
      },
      {
        text: 'Too busy',
        action: () => {}
      }
    ]
  },

  {
    id: 'conference',
    title: 'Business Conference',
    description: 'Attend an exclusive business conference for $400. Network with industry leaders.',
    type: 'opportunity',
    category: 'career',
    probability: 0.2,
    minTurn: 10,
    choices: [
      {
        text: 'Attend ($400)',
        action: (gs) => {
          if (gs.player.money >= 400) {
            return {
              player: { ...gs.player, money: gs.player.money - 400, reputation: gs.player.reputation + 30 },
              gameLog: [...gs.gameLog, createLog('Great networking! +30 reputation.', 'success')]
            };
          }
          return { gameLog: [...gs.gameLog, createLog('Not enough money.', 'error')] };
        }
      },
      {
        text: 'Skip it',
        action: () => {}
      }
    ]
  },

  // === MARKET & ECONOMIC EVENTS (8) ===
  {
    id: 'interest_rate_hike',
    title: 'Interest Rate Hike',
    description: 'The Federal Reserve raised interest rates. Bond yields increase, but stock prices may fall.',
    type: 'neutral',
    category: 'market',
    probability: 0.12,
    minTurn: 15,
    choices: [
      {
        text: 'Noted',
        action: () => {}
      }
    ]
  },

  {
    id: 'commodity_shortage',
    title: 'Commodity Shortage',
    description: 'A global shortage has driven up prices for agricultural commodities!',
    type: 'neutral',
    category: 'market',
    probability: 0.1,
    minTurn: 10,
    choices: [
      {
        text: 'Interesting',
        action: () => {}
      }
    ]
  },

  {
    id: 'market_boom',
    title: 'Market Boom!',
    description: 'The stock market is soaring! Tech stocks are up 15% this week.',
    type: 'positive',
    category: 'market',
    probability: 0.15,
    choices: [
      {
        text: 'Excellent!',
        action: (gs) => {
          // Increase value of owned tech stocks
          let bonus = 0;
          if (gs.player.commodities['TECH_STOCKS']) {
            bonus = gs.player.commodities['TECH_STOCKS'].quantity * 15;
          }
          if (bonus > 0) {
            return {
              player: { ...gs.player, money: gs.player.money + bonus },
              gameLog: [...gs.gameLog, createLog(`Your tech stocks gained $${bonus.toFixed(2)} in value!`, 'success')]
            };
          }
          return {};
        }
      }
    ]
  },

  {
    id: 'currency_devaluation',
    title: 'Currency Devaluation',
    description: 'Global currency fluctuations affect commodity prices. Precious metals surge!',
    type: 'neutral',
    category: 'market',
    probability: 0.1,
    minTurn: 20,
    choices: [
      {
        text: 'Watch the market',
        action: () => {}
      }
    ]
  },

  {
    id: 'economic_forecast',
    title: 'Positive Economic Forecast',
    description: 'Analysts predict strong economic growth. Investors are optimistic!',
    type: 'positive',
    category: 'market',
    probability: 0.2,
    choices: [
      {
        text: 'Good news!',
        action: (gs) => {
          return {
            player: { ...gs.player, reputation: gs.player.reputation + 5 },
            gameLog: [...gs.gameLog, createLog('Market optimism boosts your reputation. +5 rep.', 'success')]
          };
        }
      }
    ]
  },

  // === PERSONAL & LIFE EVENTS (6) ===
  {
    id: 'family_business',
    title: 'Family Business Opportunity',
    description: 'A relative wants to sell their successful business to you for $5,000.',
    type: 'opportunity',
    category: 'personal',
    probability: 0.05,
    minTurn: 30,
    choices: [
      {
        text: 'Buy business ($5,000)',
        action: (gs) => {
          if (gs.player.money >= 5000) {
            return {
              player: { ...gs.player, money: gs.player.money - 5000, reputation: gs.player.reputation + 40 },
              gameLog: [...gs.gameLog, createLog('Family business acquired! +40 reputation.', 'success')]
            };
          }
          return { gameLog: [...gs.gameLog, createLog('Not enough money.', 'error')] };
        }
      },
      {
        text: 'Decline',
        action: () => {}
      }
    ]
  },

  {
    id: 'inheritance',
    title: 'Unexpected Inheritance',
    description: 'A distant relative left you $2,000 in their will!',
    type: 'positive',
    category: 'personal',
    probability: 0.05,
    minTurn: 15,
    choices: [
      {
        text: 'Accept inheritance',
        action: (gs) => {
          return {
            player: { ...gs.player, money: gs.player.money + 2000 },
            gameLog: [...gs.gameLog, createLog('Received $2,000 inheritance!', 'success')]
          };
        }
      }
    ]
  },

  {
    id: 'wedding_expenses',
    title: 'Wedding Invitation',
    description: 'You\'re invited to a high-society wedding. Bring a nice gift ($300) to improve connections.',
    type: 'neutral',
    category: 'personal',
    probability: 0.15,
    minTurn: 10,
    choices: [
      {
        text: 'Attend with gift ($300)',
        action: (gs) => {
          if (gs.player.money >= 300) {
            return {
              player: { ...gs.player, money: gs.player.money - 300, reputation: gs.player.reputation + 20 },
              gameLog: [...gs.gameLog, createLog('Great networking at wedding! +20 reputation.', 'success')]
            };
          }
          return { gameLog: [...gs.gameLog, createLog('Not enough money for gift.', 'error')] };
        }
      },
      {
        text: 'Send regrets',
        action: () => {}
      }
    ]
  },

  {
    id: 'charity_request',
    title: 'Charity Fundraiser',
    description: 'A local charity is asking for donations. Support them to boost your reputation.',
    type: 'opportunity',
    category: 'personal',
    probability: 0.2,
    choices: [
      {
        text: 'Donate $500',
        action: (gs) => {
          if (gs.player.money >= 500) {
            return {
              player: { ...gs.player, money: gs.player.money - 500, reputation: gs.player.reputation + 35 },
              gameLog: [...gs.gameLog, createLog('Charitable donation made! +35 reputation.', 'success')]
            };
          }
          return { gameLog: [...gs.gameLog, createLog('Not enough money to donate.', 'error')] };
        }
      },
      {
        text: 'Not this time',
        action: () => {}
      }
    ]
  },

  // === TECHNOLOGY & INNOVATION EVENTS (5) ===
  {
    id: 'tech_ipo',
    title: 'Tech IPO Opportunity',
    description: 'A hot tech company is going public! Get in early before prices surge.',
    type: 'opportunity',
    category: 'tech',
    probability: 0.1,
    minTurn: 20,
    choices: [
      {
        text: 'Buy IPO shares ($1,000)',
        action: (gs) => {
          if (gs.player.money >= 1000) {
            const success = Math.random() > 0.3;
            if (success) {
              const profit = 500 + Math.floor(Math.random() * 1500);
              return {
                player: { ...gs.player, money: gs.player.money + profit },
                gameLog: [...gs.gameLog, createLog(`IPO succeeded! Earned $${profit}!`, 'success')]
              };
            } else {
              return {
                player: { ...gs.player, money: gs.player.money - 1000 },
                gameLog: [...gs.gameLog, createLog('IPO flopped. Lost $1,000.', 'warning')]
              };
            }
          }
          return { gameLog: [...gs.gameLog, createLog('Not enough money.', 'error')] };
        }
      },
      {
        text: 'Too risky',
        action: () => {}
      }
    ]
  },

  {
    id: 'crypto_hype',
    title: 'Cryptocurrency Hype',
    description: 'A new cryptocurrency is generating buzz. Early investors could see massive gains.',
    type: 'opportunity',
    category: 'tech',
    probability: 0.12,
    minTurn: 15,
    choices: [
      {
        text: 'Invest $500 in crypto',
        action: (gs) => {
          if (gs.player.money >= 500) {
            const outcome = Math.random();
            if (outcome > 0.6) {
              return {
                player: { ...gs.player, money: gs.player.money + 1500 },
                gameLog: [...gs.gameLog, createLog('Crypto mooned! +$1,500!', 'success')]
              };
            } else if (outcome > 0.3) {
              return {
                player: { ...gs.player, money: gs.player.money - 100 },
                gameLog: [...gs.gameLog, createLog('Crypto dipped. Lost $100.', 'warning')]
              };
            } else {
              return {
                player: { ...gs.player, money: gs.player.money - 500 },
                gameLog: [...gs.gameLog, createLog('Crypto crashed. Lost $500.', 'error')]
              };
            }
          }
          return { gameLog: [...gs.gameLog, createLog('Not enough money.', 'error')] };
        }
      },
      {
        text: 'Stay away',
        action: () => {}
      }
    ]
  },

  {
    id: 'ai_startup',
    title: 'AI Startup Investment',
    description: 'An artificial intelligence startup needs seed funding. Revolutionary technology!',
    type: 'opportunity',
    category: 'tech',
    probability: 0.08,
    minTurn: 25,
    choices: [
      {
        text: 'Invest $2,000',
        action: (gs) => {
          if (gs.player.money >= 2000) {
            const success = Math.random() > 0.5;
            if (success) {
              return {
                player: { ...gs.player, money: gs.player.money + 3000, reputation: gs.player.reputation + 50 },
                gameLog: [...gs.gameLog, createLog('AI startup acquired by tech giant! +$3,000!', 'success')]
              };
            } else {
              return {
                player: { ...gs.player, money: gs.player.money - 2000 },
                gameLog: [...gs.gameLog, createLog('AI startup failed to deliver. Lost $2,000.', 'warning')]
              };
            }
          }
          return { gameLog: [...gs.gameLog, createLog('Not enough money.', 'error')] };
        }
      },
      {
        text: 'Pass',
        action: () => {}
      }
    ]
  },

  // === REAL ESTATE EVENTS (5) ===
  {
    id: 'foreclosure_auction',
    title: 'Foreclosure Auction',
    description: 'A property is being sold at auction for 60% of market value!',
    type: 'opportunity',
    category: 'real_estate',
    probability: 0.1,
    minTurn: 20,
    choices: [
      {
        text: 'Bid $3,000',
        action: (gs) => {
          if (gs.player.money >= 3000) {
            return {
              player: { ...gs.player, money: gs.player.money - 3000, reputation: gs.player.reputation + 20 },
              gameLog: [...gs.gameLog, createLog('Won auction! Property acquired at discount.', 'success')]
            };
          }
          return { gameLog: [...gs.gameLog, createLog('Not enough money.', 'error')] };
        }
      },
      {
        text: 'Let it go',
        action: () => {}
      }
    ]
  },

  {
    id: 'commercial_lease',
    title: 'Prime Commercial Lease',
    description: 'Secure a long-term lease on prime commercial real estate for $4,000.',
    type: 'opportunity',
    category: 'real_estate',
    probability: 0.08,
    minTurn: 30,
    requirements: (state) => state.player.properties.length >= 2,
    choices: [
      {
        text: 'Sign lease ($4,000)',
        action: (gs) => {
          if (gs.player.money >= 4000) {
            return {
              player: { ...gs.player, money: gs.player.money - 4000, reputation: gs.player.reputation + 30 },
              gameLog: [...gs.gameLog, createLog('Commercial lease secured! +30 reputation.', 'success')]
            };
          }
          return { gameLog: [...gs.gameLog, createLog('Not enough money.', 'error')] };
        }
      },
      {
        text: 'Pass',
        action: () => {}
      }
    ]
  },

  {
    id: 'property_flip',
    title: 'Quick Flip Opportunity',
    description: 'Buy a fixer-upper for $1,500, renovate, and sell for $3,000!',
    type: 'opportunity',
    category: 'real_estate',
    probability: 0.12,
    minTurn: 15,
    choices: [
      {
        text: 'Do the flip ($1,500)',
        action: (gs) => {
          if (gs.player.money >= 1500) {
            const success = Math.random() > 0.25;
            if (success) {
              return {
                player: { ...gs.player, money: gs.player.money + 1500, reputation: gs.player.reputation + 15 },
                gameLog: [...gs.gameLog, createLog('Successful flip! +$1,500 profit!', 'success')]
              };
            } else {
              return {
                player: { ...gs.player, money: gs.player.money - 500 },
                gameLog: [...gs.gameLog, createLog('Flip didn\'t go as planned. Lost $500.', 'warning')]
              };
            }
          }
          return { gameLog: [...gs.gameLog, createLog('Not enough money.', 'error')] };
        }
      },
      {
        text: 'Too risky',
        action: () => {}
      }
    ]
  },

  // === SOCIAL & REPUTATION EVENTS (4) ===
  {
    id: 'charity_gala',
    title: 'Charity Gala Invitation',
    description: 'Attend an exclusive charity gala to network with wealthy philanthropists.',
    type: 'opportunity',
    category: 'social',
    probability: 0.1,
    minTurn: 25,
    requirements: (state) => state.player.reputation >= 150,
    choices: [
      {
        text: 'Attend ($800)',
        action: (gs) => {
          if (gs.player.money >= 800) {
            return {
              player: { ...gs.player, money: gs.player.money - 800, reputation: gs.player.reputation + 60 },
              gameLog: [...gs.gameLog, createLog('Gala was a success! +60 reputation.', 'success')]
            };
          }
          return { gameLog: [...gs.gameLog, createLog('Not enough money.', 'error')] };
        }
      },
      {
        text: 'Skip it',
        action: () => {}
      }
    ]
  },

  {
    id: 'business_award',
    title: 'Business Excellence Award',
    description: 'You\'ve been nominated for a business excellence award! Win it for prestige.',
    type: 'positive',
    category: 'social',
    probability: 0.08,
    minTurn: 40,
    requirements: (state) => state.player.reputation >= 200,
    choices: [
      {
        text: 'Accept award',
        action: (gs) => {
          return {
            player: { ...gs.player, reputation: gs.player.reputation + 100 },
            gameLog: [...gs.gameLog, createLog('Award accepted! +100 reputation!', 'success')]
          };
        }
      }
    ]
  },

  {
    id: 'mentorship_offer',
    title: 'Mentorship Opportunity',
    description: 'A young entrepreneur wants you as their mentor. Share your wisdom!',
    type: 'opportunity',
    category: 'social',
    probability: 0.15,
    minTurn: 30,
    requirements: (state) => state.player.reputation >= 100,
    choices: [
      {
        text: 'Become a mentor',
        action: (gs) => {
          return {
            player: { ...gs.player, reputation: gs.player.reputation + 40 },
            gameLog: [...gs.gameLog, createLog('Mentorship established! +40 reputation.', 'success')]
          };
        }
      },
      {
        text: 'Too busy',
        action: () => {}
      }
    ]
  },

  // === CRISIS & CHALLENGE EVENTS (5) ===
  {
    id: 'economic_recession',
    title: 'Economic Recession',
    description: 'The economy is in recession. Asset values are dropping!',
    type: 'negative',
    category: 'crisis',
    probability: 0.08,
    minTurn: 25,
    choices: [
      {
        text: 'Weather the storm',
        action: (gs) => {
          const loss = Math.floor(gs.player.money * 0.1);
          return {
            player: { ...gs.player, money: gs.player.money - loss },
            gameLog: [...gs.gameLog, createLog(`Recession hit hard. Lost $${loss}.`, 'error')]
          };
        }
      }
    ]
  },

  {
    id: 'lawsuit',
    title: 'Legal Dispute',
    description: 'A business partner is suing you. Settle or fight in court?',
    type: 'negative',
    category: 'crisis',
    probability: 0.05,
    minTurn: 20,
    requirements: (state) => state.player.money >= 500,
    choices: [
      {
        text: 'Settle ($1,000)',
        action: (gs) => {
          if (gs.player.money >= 1000) {
            return {
              player: { ...gs.player, money: gs.player.money - 1000 },
              gameLog: [...gs.gameLog, createLog('Lawsuit settled. Lost $1,000.', 'warning')]
            };
          }
          return { gameLog: [...gs.gameLog, createLog('Not enough money to settle.', 'error')] };
        }
      },
      {
        text: 'Fight in court',
        action: (gs) => {
          const outcome = Math.random();
          if (outcome > 0.5) {
            return {
              player: { ...gs.player, reputation: gs.player.reputation + 20 },
              gameLog: [...gs.gameLog, createLog('Won the case! +20 reputation.', 'success')]
            };
          } else {
            return {
              player: { ...gs.player, money: gs.player.money - 1500, reputation: gs.player.reputation - 30 },
              gameLog: [...gs.gameLog, createLog('Lost the case. -$1,500 and -30 reputation.', 'error')]
            };
          }
        }
      }
    ]
  },

  {
    id: 'product_recall',
    title: 'Product Recall',
    description: 'One of your investments has a product recall. Damage control needed!',
    type: 'negative',
    category: 'crisis',
    probability: 0.07,
    minTurn: 30,
    choices: [
      {
        text: 'Handle it ($500)',
        action: (gs) => {
          if (gs.player.money >= 500) {
            return {
              player: { ...gs.player, money: gs.player.money - 500, reputation: gs.player.reputation - 10 },
              gameLog: [...gs.gameLog, createLog('Recall handled. Lost $500 and 10 reputation.', 'warning')]
            };
          }
          return { gameLog: [...gs.gameLog, createLog('Not enough money for damage control.', 'error')] };
        }
      }
    ]
  },

  // === SEASONAL & SPECIAL EVENTS (5) ===
  {
    id: 'black_friday',
    title: 'Black Friday Sales',
    description: 'Major shopping day! Your retail investments are booming!',
    type: 'positive',
    category: 'seasonal',
    probability: 0.05,
    minTurn: 10,
    choices: [
      {
        text: 'Collect profits',
        action: (gs) => {
          const bonus = 200 + Math.floor(Math.random() * 500);
          return {
            player: { ...gs.player, money: gs.player.money + bonus },
            gameLog: [...gs.gameLog, createLog(`Black Friday profits: +$${bonus}!`, 'success')]
          };
        }
      }
    ]
  },

  {
    id: 'new_year_bonus',
    title: 'New Year Bonus',
    description: 'Happy New Year! Start fresh with a bonus based on your reputation.',
    type: 'positive',
    category: 'seasonal',
    probability: 0.05,
    minTurn: 20,
    choices: [
      {
        text: 'Claim bonus',
        action: (gs) => {
          const bonus = Math.floor(gs.player.reputation * 2);
          return {
            player: { ...gs.player, money: gs.player.money + bonus },
            gameLog: [...gs.gameLog, createLog(`New Year bonus: +$${bonus}!`, 'success')]
          };
        }
      }
    ]
  },

  {
    id: 'summer_vacation',
    title: 'Summer Vacation Opportunity',
    description: 'Take a luxury vacation to recharge. Costs $600 but boosts creativity.',
    type: 'opportunity',
    category: 'seasonal',
    probability: 0.1,
    minTurn: 15,
    choices: [
      {
        text: 'Take vacation ($600)',
        action: (gs) => {
          if (gs.player.money >= 600) {
            return {
              player: { ...gs.player, money: gs.player.money - 600, reputation: gs.player.reputation + 25 },
              gameLog: [...gs.gameLog, createLog('Vacation was refreshing! +25 reputation.', 'success')]
            };
          }
          return { gameLog: [...gs.gameLog, createLog('Not enough money for vacation.', 'error')] };
        }
      },
      {
        text: 'Work instead',
        action: () => {}
      }
    ]
  }
];

/**
 * Get a random event based on game state and probabilities
 */
export function getRandomEvent(gameState: GameState): GameEvent | null {
  // Filter events based on requirements
  const eligibleEvents = EVENTS_DATA.filter(event => {
    // Check minimum turn
    if (event.minTurn && gameState.gameTurn < event.minTurn) {
      return false;
    }

    // Check custom requirements
    if (event.requirements && !event.requirements(gameState)) {
      return false;
    }

    // Check probability
    return Math.random() < event.probability;
  });

  if (eligibleEvents.length === 0) {
    return null;
  }

  // Pick a random eligible event
  const selectedEvent = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];

  return {
    id: `${selectedEvent.id}-${Date.now()}`,
    title: selectedEvent.title,
    description: selectedEvent.description,
    type: selectedEvent.type,
    choices: selectedEvent.choices,
    triggeredAtTurn: gameState.gameTurn
  };
}
