import { GameDate, WorldNewsEvent } from '../types';

/**
 * Historical Data Service
 *
 * This service provides real historical prices for commodities and world news events.
 * Data is based on actual historical records to allow players with history knowledge
 * to make profitable decisions.
 */

// Helper function to compare dates
export function compareDates(date1: GameDate, date2: GameDate): number {
  if (date1.year !== date2.year) return date1.year - date2.year;
  return date1.month - date2.month;
}

export function dateToKey(date: GameDate): string {
  return `${date.year}-${String(date.month).padStart(2, '0')}`;
}

export function formatDate(date: GameDate): string {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[date.month - 1]} ${date.year}`;
}

export function advanceMonth(date: GameDate): GameDate {
  if (date.month === 12) {
    return { month: 1, year: date.year + 1 };
  }
  return { month: date.month + 1, year: date.year };
}

// Historical commodity prices (approximate averages for each period)
// Format: { 'YYYY-MM': price }
interface HistoricalPriceData {
  [commodityId: string]: {
    [dateKey: string]: number;
  };
}

/**
 * Real Historical Prices
 * Sources: Federal Reserve Economic Data (FRED), US Bureau of Labor Statistics,
 * Historical commodity databases
 */
export const HISTORICAL_PRICES: HistoricalPriceData = {
  // Gold (per troy ounce)
  GOLD: {
    '1950-01': 34.72, '1950-06': 34.72, '1951-01': 34.72, '1952-01': 34.72,
    '1953-01': 34.92, '1954-01': 35.04, '1955-01': 35.03, '1955-07': 35.03,
    '1956-01': 34.99, '1957-01': 34.95, '1958-01': 35.10, '1959-01': 35.10,
    '1960-01': 35.27, '1961-01': 35.25, '1962-01': 35.23, '1963-01': 35.09,
    '1964-01': 35.10, '1965-01': 35.12, '1966-01': 35.13, '1967-01': 34.95,
    '1968-01': 35.20, '1968-06': 39.50, '1969-01': 41.10, '1970-01': 35.94,
    '1971-01': 37.62, '1971-08': 43.48, '1972-01': 58.60, '1973-01': 64.90,
    '1974-01': 159.70, '1975-01': 160.86, '1976-01': 124.80, '1977-01': 147.84,
    '1978-01': 193.40, '1979-01': 226.00, '1979-09': 414.50, '1980-01': 589.50,
    '1980-09': 666.75, '1981-01': 589.75, '1982-01': 384.00, '1983-01': 447.00,
    '1984-01': 374.25, '1985-01': 303.00, '1986-01': 345.70, '1987-01': 478.00,
    '1988-01': 437.00, '1989-01': 381.50, '1990-01': 410.25, '1991-01': 362.15,
    '1992-01': 354.10, '1993-01': 329.00, '1994-01': 383.25, '1995-01': 383.79,
    '1996-01': 387.80, '1997-01': 288.55, '1998-01': 288.80, '1999-01': 287.05,
    '2000-01': 283.25, '2001-01': 265.90, '2001-09': 283.00, '2002-01': 278.00,
    '2003-01': 347.00, '2004-01': 410.00, '2005-01': 427.00, '2006-01': 565.00,
    '2007-01': 631.20, '2008-01': 889.00, '2008-10': 806.00, '2009-01': 865.00,
    '2010-01': 1087.50, '2011-01': 1412.00, '2011-09': 1895.00, '2012-01': 1657.50,
    '2013-01': 1694.00, '2014-01': 1205.50, '2015-01': 1160.00, '2016-01': 1248.00,
    '2017-01': 1257.00, '2018-01': 1309.00, '2019-01': 1392.00, '2020-01': 1571.00,
    '2020-08': 1979.00, '2021-01': 1854.00, '2022-01': 1828.00, '2023-01': 1925.00,
    '2024-01': 2063.00, '2025-01': 2750.00
  },

  // Silver (per troy ounce)
  SILVER: {
    '1950-01': 0.74, '1955-01': 0.89, '1955-07': 0.89, '1960-01': 0.91,
    '1965-01': 1.29, '1968-01': 2.14, '1970-01': 1.64, '1973-01': 2.56,
    '1974-01': 4.71, '1975-01': 4.42, '1976-01': 4.35, '1977-01': 4.62,
    '1978-01': 5.40, '1979-01': 6.06, '1980-01': 20.63, '1980-02': 36.00,
    '1981-01': 10.50, '1982-01': 7.95, '1983-01': 11.44, '1984-01': 8.14,
    '1985-01': 6.14, '1986-01': 5.47, '1987-01': 7.01, '1988-01': 6.53,
    '1989-01': 5.50, '1990-01': 4.82, '1991-01': 4.04, '1992-01': 3.94,
    '1993-01': 3.95, '1994-01': 5.29, '1995-01': 5.15, '1996-01': 5.19,
    '1997-01': 4.89, '1998-01': 5.54, '1999-01': 5.30, '2000-01': 5.00,
    '2001-01': 4.37, '2002-01': 4.60, '2003-01': 4.88, '2004-01': 6.67,
    '2005-01': 7.31, '2006-01': 11.55, '2007-01': 13.38, '2008-01': 14.99,
    '2009-01': 14.67, '2010-01': 18.16, '2011-01': 31.22, '2011-04': 48.70,
    '2012-01': 30.66, '2013-01': 30.87, '2014-01': 19.08, '2015-01': 15.68,
    '2016-01': 17.14, '2017-01': 17.05, '2018-01': 16.21, '2019-01': 16.03,
    '2020-01': 17.88, '2020-08': 28.95, '2021-01': 25.14, '2022-01': 23.29,
    '2023-01': 23.94, '2024-01': 24.35, '2025-01': 32.00
  },

  // Oil (per barrel, West Texas Intermediate)
  OIL: {
    '1950-01': 2.57, '1955-01': 2.77, '1960-01': 2.88, '1965-01': 2.86,
    '1970-01': 3.18, '1973-01': 3.56, '1973-10': 5.02, '1974-01': 10.11,
    '1975-01': 11.53, '1976-01': 12.80, '1977-01': 14.22, '1978-01': 14.57,
    '1979-01': 25.10, '1980-01': 37.42, '1981-01': 35.75, '1982-01': 31.83,
    '1983-01': 29.08, '1984-01': 28.75, '1985-01': 26.92, '1986-01': 14.44,
    '1987-01': 17.75, '1988-01': 14.87, '1989-01': 18.33, '1990-01': 23.19,
    '1990-08': 36.50, '1991-01': 20.20, '1992-01': 19.25, '1993-01': 18.45,
    '1994-01': 15.66, '1995-01': 18.42, '1996-01': 22.12, '1997-01': 20.61,
    '1998-01': 12.52, '1999-01': 17.44, '2000-01': 29.69, '2001-01': 25.98,
    '2001-09': 26.20, '2002-01': 23.74, '2003-01': 31.08, '2004-01': 37.66,
    '2005-01': 50.04, '2006-01': 63.92, '2007-01': 64.20, '2008-01': 99.67,
    '2008-07': 145.31, '2008-12': 41.68, '2009-01': 50.58, '2010-01': 79.48,
    '2011-01': 94.87, '2012-01': 102.56, '2013-01': 97.91, '2014-01': 94.74,
    '2014-12': 59.29, '2015-01': 48.66, '2016-01': 43.29, '2017-01': 51.91,
    '2018-01': 64.94, '2019-01': 56.99, '2020-01': 57.52, '2020-04': 16.55,
    '2021-01': 58.00, '2022-01': 94.29, '2022-06': 114.67, '2023-01': 78.46,
    '2024-01': 77.22, '2025-01': 75.00
  },

  // Wheat (per bushel)
  WHEAT: {
    '1950-01': 2.00, '1955-01': 2.06, '1960-01': 1.78, '1965-01': 1.35,
    '1970-01': 1.33, '1972-01': 1.76, '1973-01': 3.95, '1974-01': 5.12,
    '1975-01': 3.55, '1976-01': 3.81, '1977-01': 2.60, '1978-01': 3.43,
    '1979-01': 3.99, '1980-01': 4.80, '1981-01': 4.27, '1982-01': 3.60,
    '1983-01': 3.55, '1984-01': 3.53, '1985-01': 3.42, '1986-01': 2.61,
    '1987-01': 2.94, '1988-01': 3.78, '1989-01': 4.11, '1990-01': 2.98,
    '1991-01': 3.01, '1992-01': 3.38, '1993-01': 3.43, '1994-01': 3.55,
    '1995-01': 4.63, '1996-01': 5.64, '1997-01': 3.54, '1998-01': 2.70,
    '1999-01': 2.63, '2000-01': 2.73, '2001-01': 2.75, '2002-01': 3.26,
    '2003-01': 3.47, '2004-01': 3.71, '2005-01': 3.45, '2006-01': 4.04,
    '2007-01': 6.48, '2008-01': 10.23, '2008-03': 13.34, '2009-01': 5.11,
    '2010-01': 5.04, '2011-01': 7.97, '2012-01': 7.77, '2013-01': 7.02,
    '2014-01': 6.03, '2015-01': 5.12, '2016-01': 4.72, '2017-01': 4.72,
    '2018-01': 5.28, '2019-01': 5.13, '2020-01': 5.47, '2021-01': 6.64,
    '2022-01': 9.72, '2022-05': 12.94, '2023-01': 7.43, '2024-01': 6.52,
    '2025-01': 6.20
  },

  // Corn (per bushel)
  CORN: {
    '1950-01': 1.52, '1955-01': 1.38, '1960-01': 1.00, '1965-01': 1.16,
    '1970-01': 1.33, '1972-01': 1.27, '1973-01': 2.55, '1974-01': 3.50,
    '1975-01': 2.71, '1976-01': 2.63, '1977-01': 2.13, '1978-01': 2.47,
    '1979-01': 2.79, '1980-01': 3.70, '1981-01': 2.83, '1982-01': 2.63,
    '1983-01': 3.47, '1984-01': 2.84, '1985-01': 2.53, '1986-01': 1.92,
    '1987-01': 1.87, '1988-01': 2.77, '1989-01': 2.52, '1990-01': 2.40,
    '1991-01': 2.50, '1992-01': 2.37, '1993-01': 2.63, '1994-01': 2.50,
    '1995-01': 3.29, '1996-01': 4.38, '1997-01': 2.60, '1998-01': 2.17,
    '1999-01': 2.07, '2000-01': 1.99, '2001-01': 2.05, '2002-01': 2.36,
    '2003-01': 2.47, '2004-01': 2.88, '2005-01': 2.05, '2006-01': 3.21,
    '2007-01': 4.20, '2008-01': 5.47, '2008-06': 7.88, '2009-01': 3.90,
    '2010-01': 3.99, '2011-01': 6.22, '2012-01': 6.89, '2012-08': 8.43,
    '2013-01': 6.87, '2014-01': 4.39, '2015-01': 3.86, '2016-01': 3.65,
    '2017-01': 3.71, '2018-01': 3.77, '2019-01': 3.85, '2020-01': 3.90,
    '2021-01': 5.48, '2022-01': 6.60, '2022-05': 8.03, '2023-01': 6.54,
    '2024-01': 4.73, '2025-01': 4.50
  },

  // Cotton (per pound)
  COTTON: {
    '1950-01': 0.40, '1955-01': 0.34, '1960-01': 0.32, '1965-01': 0.29,
    '1970-01': 0.22, '1973-01': 0.50, '1974-01': 0.51, '1975-01': 0.48,
    '1976-01': 0.69, '1977-01': 0.64, '1978-01': 0.66, '1979-01': 0.73,
    '1980-01': 0.88, '1981-01': 0.64, '1982-01': 0.65, '1983-01': 0.72,
    '1984-01': 0.70, '1985-01': 0.58, '1986-01': 0.54, '1987-01': 0.69,
    '1988-01': 0.58, '1989-01': 0.69, '1990-01': 0.74, '1991-01': 0.69,
    '1992-01': 0.57, '1993-01': 0.59, '1994-01': 0.73, '1995-01': 0.91,
    '1996-01': 0.77, '1997-01': 0.72, '1998-01': 0.62, '1999-01': 0.57,
    '2000-01': 0.60, '2001-01': 0.47, '2002-01': 0.46, '2003-01': 0.67,
    '2004-01': 0.67, '2005-01': 0.54, '2006-01': 0.58, '2007-01': 0.62,
    '2008-01': 0.72, '2009-01': 0.56, '2010-01': 0.92, '2011-01': 1.80,
    '2011-03': 2.25, '2012-01': 0.91, '2013-01': 0.83, '2014-01': 0.88,
    '2015-01': 0.64, '2016-01': 0.68, '2017-01': 0.72, '2018-01': 0.83,
    '2019-01': 0.72, '2020-01': 0.64, '2021-01': 0.86, '2022-01': 1.18,
    '2022-05': 1.43, '2023-01': 0.84, '2024-01': 0.82, '2025-01': 0.78
  }
};

/**
 * Get historical price for a commodity at a specific date
 * If exact date not found, interpolate between nearest dates
 */
export function getHistoricalPrice(commodityId: string, date: GameDate): number | null {
  const priceData = HISTORICAL_PRICES[commodityId];
  if (!priceData) return null;

  const dateKey = dateToKey(date);

  // Check for exact match
  if (priceData[dateKey]) {
    return priceData[dateKey];
  }

  // Find nearest dates and interpolate
  const dates = Object.keys(priceData).sort();
  let before: string | null = null;
  let after: string | null = null;

  for (const key of dates) {
    if (key < dateKey) {
      before = key;
    } else if (key > dateKey && !after) {
      after = key;
      break;
    }
  }

  // If we have both before and after, interpolate
  if (before && after) {
    const priceBefore = priceData[before];
    const priceAfter = priceData[after];

    // Linear interpolation
    const [yearBefore, monthBefore] = before.split('-').map(Number);
    const [yearAfter, monthAfter] = after.split('-').map(Number);
    const totalMonths = (yearAfter - yearBefore) * 12 + (monthAfter - monthBefore);
    const currentMonths = (date.year - yearBefore) * 12 + (date.month - monthBefore);

    const ratio = currentMonths / totalMonths;
    return priceBefore + (priceAfter - priceBefore) * ratio;
  }

  // If only before, use that price
  if (before) return priceData[before];

  // If only after, use that price
  if (after) return priceData[after];

  return null;
}

/**
 * Historical World News Events
 * Major events that impacted markets and society
 */
export const WORLD_NEWS_EVENTS: WorldNewsEvent[] = [
  // 1950s - Post-War Boom
  {
    id: 'korean-war-start',
    date: { month: 6, year: 1950 },
    title: 'Korean War Begins',
    description: 'North Korea invades South Korea. UN forces intervene. Markets react to war tensions.',
    impact: { commodityId: 'OIL', priceChange: 5 }
  },
  {
    id: 'eisenhower-elected',
    date: { month: 11, year: 1952 },
    title: 'Eisenhower Elected President',
    description: 'Dwight D. Eisenhower wins presidential election, promising stability and prosperity.',
  },
  {
    id: 'korean-war-end',
    date: { month: 7, year: 1953 },
    title: 'Korean War Ends',
    description: 'Armistice agreement signed. Markets stabilize as war economy transitions to peace.',
  },
  {
    id: 'recession-1953',
    date: { month: 7, year: 1953 },
    title: 'Economic Recession Begins',
    description: 'Post-war recession hits as defense spending drops. GDP declines 2.5%.',
    impact: { priceChange: -3 }
  },
  {
    id: 'polio-vaccine',
    date: { month: 4, year: 1955 },
    title: 'Polio Vaccine Announced',
    description: 'Dr. Jonas Salk\'s polio vaccine declared safe and effective. Medical stocks soar.',
  },
  {
    id: 'interstate-highway',
    date: { month: 6, year: 1956 },
    title: 'Interstate Highway System Authorized',
    description: 'Massive infrastructure investment begins. Construction and auto industries boom.',
    impact: { commodityId: 'OIL', priceChange: 3 }
  },
  {
    id: 'sputnik',
    date: { month: 10, year: 1957 },
    title: 'Soviet Union Launches Sputnik',
    description: 'First artificial satellite shocks America. Space race begins, tech investment surges.',
  },
  {
    id: 'recession-1958',
    date: { month: 4, year: 1958 },
    title: 'Recession of 1958',
    description: 'Sharp but brief recession. Unemployment rises to 7.5%. Markets decline.',
    impact: { priceChange: -5 }
  },
  {
    id: 'alaska-hawaii',
    date: { month: 8, year: 1959 },
    title: 'Alaska and Hawaii Become States',
    description: 'Two new states join the union. Real estate opportunities expand westward.',
  },

  // 1960s
  {
    id: 'kennedy-elected',
    date: { month: 11, year: 1960 },
    title: 'Kennedy Wins Close Election',
    description: 'John F. Kennedy elected president, promising a "New Frontier" of opportunity.',
  },
  {
    id: 'cuban-missile-crisis',
    date: { month: 10, year: 1962 },
    title: 'Cuban Missile Crisis',
    description: 'Nuclear standoff with Soviet Union. Markets plunge on war fears, recover quickly.',
    impact: { commodityId: 'GOLD', priceChange: 8 }
  },
  {
    id: 'kennedy-assassination',
    date: { month: 11, year: 1963 },
    title: 'President Kennedy Assassinated',
    description: 'Nation in shock as President Kennedy killed in Dallas. Markets close briefly.',
    impact: { priceChange: -4 }
  },
  {
    id: 'civil-rights-act',
    date: { month: 7, year: 1964 },
    title: 'Civil Rights Act Passed',
    description: 'Landmark legislation outlaws discrimination. Social and economic transformation begins.',
  },
  {
    id: 'vietnam-escalation',
    date: { month: 8, year: 1964 },
    title: 'Vietnam War Escalates',
    description: 'Gulf of Tonkin incident leads to deeper US involvement. Defense stocks rise.',
    impact: { commodityId: 'OIL', priceChange: 4 }
  },
  {
    id: 'medicare-medicaid',
    date: { month: 7, year: 1965 },
    title: 'Medicare and Medicaid Created',
    description: 'Healthcare programs for elderly and poor established. Healthcare sector expands.',
  },
  {
    id: 'moon-landing',
    date: { month: 7, year: 1969 },
    title: 'Man Lands on Moon',
    description: 'Apollo 11 achieves Kennedy\'s goal. American technology and engineering triumph.',
  },
  {
    id: 'woodstock',
    date: { month: 8, year: 1969 },
    title: 'Woodstock Festival',
    description: 'Counterculture reaches peak. Cultural shifts impact consumer behavior.',
  },

  // 1970s - Stagflation Era
  {
    id: 'kent-state',
    date: { month: 5, year: 1970 },
    title: 'Kent State Shootings',
    description: 'National Guard kills four students protesting Vietnam War. Social unrest grows.',
  },
  {
    id: 'gold-standard-end',
    date: { month: 8, year: 1971 },
    title: 'Nixon Ends Gold Standard',
    description: 'Dollar no longer convertible to gold. Era of floating currencies begins.',
    impact: { commodityId: 'GOLD', priceChange: 15 }
  },
  {
    id: 'watergate',
    date: { month: 6, year: 1972 },
    title: 'Watergate Break-in',
    description: 'Political scandal unfolds. Will lead to presidential resignation.',
  },
  {
    id: 'oil-embargo',
    date: { month: 10, year: 1973 },
    title: 'OPEC Oil Embargo',
    description: 'Arab nations cut oil exports. Prices quadruple. Energy crisis begins.',
    impact: { commodityId: 'OIL', priceChange: 300 }
  },
  {
    id: 'nixon-resigns',
    date: { month: 8, year: 1974 },
    title: 'Nixon Resigns',
    description: 'First president to resign. Gerald Ford becomes president. Market uncertainty.',
    impact: { priceChange: -3 }
  },
  {
    id: 'recession-1975',
    date: { month: 3, year: 1975 },
    title: 'Deepest Postwar Recession',
    description: 'Unemployment hits 9%. Inflation remains high. Stagflation era in full swing.',
    impact: { priceChange: -8 }
  },
  {
    id: 'bicentennial',
    date: { month: 7, year: 1976 },
    title: 'US Bicentennial Celebration',
    description: 'America celebrates 200 years. National pride boost amid economic troubles.',
  },
  {
    id: 'carter-elected',
    date: { month: 11, year: 1976 },
    title: 'Jimmy Carter Elected',
    description: 'Outsider wins presidency promising honesty after Watergate. Markets cautious.',
  },
  {
    id: 'energy-crisis-79',
    date: { month: 3, year: 1979 },
    title: 'Second Energy Crisis',
    description: 'Iranian Revolution disrupts oil supply. Gas lines return. Inflation accelerates.',
    impact: { commodityId: 'OIL', priceChange: 150 }
  },
  {
    id: 'three-mile-island',
    date: { month: 3, year: 1979 },
    title: 'Three Mile Island Accident',
    description: 'Nuclear reactor partial meltdown. Nuclear energy plans curtailed nationwide.',
  },
  {
    id: 'volcker-rates',
    date: { month: 10, year: 1979 },
    title: 'Fed Raises Interest Rates Dramatically',
    description: 'Paul Volcker fights inflation with sky-high rates. Recession inevitable.',
    impact: { priceChange: -6 }
  },

  // 1980s - Reagan Era
  {
    id: 'reagan-elected',
    date: { month: 11, year: 1980 },
    title: 'Reagan Wins Landslide',
    description: 'Ronald Reagan elected on promise to restore American prosperity. Markets optimistic.',
  },
  {
    id: 'recession-1981',
    date: { month: 7, year: 1981 },
    title: 'Severe Recession Begins',
    description: 'Highest unemployment since Depression. Fed\'s inflation fight takes toll.',
    impact: { priceChange: -10 }
  },
  {
    id: 'recession-ends-82',
    date: { month: 11, year: 1982 },
    title: 'Recession Ends, Bull Market Begins',
    description: 'Economy recovers. Start of longest bull market in history. Optimism returns.',
    impact: { priceChange: 15 }
  },
  {
    id: 'tax-reform-1986',
    date: { month: 10, year: 1986 },
    title: 'Major Tax Reform Passed',
    description: 'Sweeping tax changes. Top rate drops from 50% to 28%. Business climate shifts.',
  },
  {
    id: 'black-monday',
    date: { month: 10, year: 1987 },
    title: 'Black Monday - Market Crashes 22%',
    description: 'Largest single-day percentage decline in stock market history. Panic selling.',
    impact: { priceChange: -22 }
  },
  {
    id: 'berlin-wall',
    date: { month: 11, year: 1989 },
    title: 'Berlin Wall Falls',
    description: 'Cold War ending. German reunification ahead. New era of global markets.',
  },

  // 1990s - Dot-com Era
  {
    id: 'gulf-war',
    date: { month: 8, year: 1990 },
    title: 'Iraq Invades Kuwait',
    description: 'Gulf War begins. Oil prices spike briefly. Military buildup in Middle East.',
    impact: { commodityId: 'OIL', priceChange: 60 }
  },
  {
    id: 'recession-1990',
    date: { month: 7, year: 1990 },
    title: 'Recession Begins',
    description: 'Savings and Loan crisis and oil shock trigger recession. Markets decline.',
    impact: { priceChange: -5 }
  },
  {
    id: 'soviet-collapse',
    date: { month: 12, year: 1991 },
    title: 'Soviet Union Collapses',
    description: 'Cold War officially ends. US emerges as sole superpower. Global markets open.',
  },
  {
    id: 'internet-commercial',
    date: { month: 4, year: 1993 },
    title: 'Internet Goes Commercial',
    description: 'Web browser released. Internet revolution begins. Tech stocks start climbing.',
  },
  {
    id: 'nafta',
    date: { month: 1, year: 1994 },
    title: 'NAFTA Takes Effect',
    description: 'Free trade agreement with Canada and Mexico. Supply chains transform.',
  },
  {
    id: 'netscape-ipo',
    date: { month: 8, year: 1995 },
    title: 'Netscape IPO Soars',
    description: 'Internet company stock doubles first day. Dot-com boom accelerates.',
    impact: { commodityId: 'TECH_STOCKS', priceChange: 50 }
  },
  {
    id: 'welfare-reform',
    date: { month: 8, year: 1996 },
    title: 'Welfare Reform Passed',
    description: 'Major overhaul of social safety net. Bipartisan achievement in divided government.',
  },
  {
    id: 'asian-crisis',
    date: { month: 7, year: 1997 },
    title: 'Asian Financial Crisis',
    description: 'Currency collapse spreads across Asia. Global contagion fears. Markets volatile.',
    impact: { priceChange: -8 }
  },
  {
    id: 'clinton-impeachment',
    date: { month: 12, year: 1998 },
    title: 'Clinton Impeached',
    description: 'President impeached by House over scandal. Markets largely unaffected.',
  },
  {
    id: 'y2k-fears',
    date: { month: 12, year: 1999 },
    title: 'Y2K Millennium Bug Fears',
    description: 'Concerns about computer failures. Tech spending surges. Markets hit records.',
  },

  // 2000s - Modern Era
  {
    id: 'dotcom-peak',
    date: { month: 3, year: 2000 },
    title: 'Dot-com Bubble Peaks',
    description: 'NASDAQ reaches all-time high. Tech valuations astronomical. Bubble warnings.',
    impact: { commodityId: 'TECH_STOCKS', priceChange: 25 }
  },
  {
    id: 'dotcom-crash',
    date: { month: 4, year: 2000 },
    title: 'Dot-com Bubble Bursts',
    description: 'Tech stocks plunge. Many internet companies bankrupt. Market correction begins.',
    impact: { commodityId: 'TECH_STOCKS', priceChange: -40 }
  },
  {
    id: '9-11',
    date: { month: 9, year: 2001 },
    title: 'September 11 Attacks',
    description: 'Terrorist attacks devastate nation. Markets closed 4 days. Sharp decline follows.',
    impact: { priceChange: -7 }
  },
  {
    id: 'afghanistan-war',
    date: { month: 10, year: 2001 },
    title: 'War in Afghanistan Begins',
    description: 'US invades Afghanistan. Long war begins. Defense stocks rise.',
    impact: { commodityId: 'OIL', priceChange: 10 }
  },
  {
    id: 'iraq-war',
    date: { month: 3, year: 2003 },
    title: 'Iraq War Starts',
    description: 'US invades Iraq. Oil supply concerns. Markets volatile on war news.',
    impact: { commodityId: 'OIL', priceChange: 25 }
  },
  {
    id: 'housing-boom',
    date: { month: 1, year: 2005 },
    title: 'Housing Market Boom Peaks',
    description: 'Home prices soaring nationwide. Easy credit fuels speculation. Subprime lending grows.',
  },
  {
    id: 'katrina',
    date: { month: 8, year: 2005 },
    title: 'Hurricane Katrina Devastates Gulf Coast',
    description: 'Catastrophic hurricane. New Orleans flooded. Oil refineries damaged.',
    impact: { commodityId: 'OIL', priceChange: 20 }
  },
  {
    id: 'oil-peak-2008',
    date: { month: 7, year: 2008 },
    title: 'Oil Hits $145 per Barrel',
    description: 'Oil reaches record high. Gas prices soar. Economic strain intensifies.',
    impact: { commodityId: 'OIL', priceChange: 50 }
  },
  {
    id: 'lehman-collapse',
    date: { month: 9, year: 2008 },
    title: 'Lehman Brothers Collapses',
    description: 'Major investment bank fails. Financial crisis explodes. Credit markets freeze.',
    impact: { priceChange: -25 }
  },
  {
    id: 'financial-crisis',
    date: { month: 10, year: 2008 },
    title: 'Global Financial Crisis',
    description: 'Markets in free fall. Banks failing. Government bailouts. Worst crisis since Depression.',
    impact: { priceChange: -30 }
  },
  {
    id: 'obama-elected',
    date: { month: 11, year: 2008 },
    title: 'Barack Obama Elected President',
    description: 'First African American president elected amid economic crisis. Historic moment.',
  },
  {
    id: 'stimulus-2009',
    date: { month: 2, year: 2009 },
    title: 'Massive Stimulus Package Passed',
    description: '$787 billion economic stimulus. Government intervention to prevent depression.',
    impact: { priceChange: 5 }
  },
  {
    id: 'recovery-begins',
    date: { month: 6, year: 2009 },
    title: 'Economic Recovery Begins',
    description: 'Recession officially ends. Slow recovery starts. Markets begin long climb.',
    impact: { priceChange: 10 }
  },

  // 2010s
  {
    id: 'flash-crash',
    date: { month: 5, year: 2010 },
    title: 'Flash Crash',
    description: 'Markets plunge 1000 points in minutes, then recover. Algorithmic trading blamed.',
    impact: { priceChange: -6 }
  },
  {
    id: 'arab-spring',
    date: { month: 12, year: 2010 },
    title: 'Arab Spring Begins',
    description: 'Pro-democracy uprisings across Middle East. Oil markets volatile. Geopolitical shifts.',
    impact: { commodityId: 'OIL', priceChange: 15 }
  },
  {
    id: 'bin-laden',
    date: { month: 5, year: 2011 },
    title: 'Osama bin Laden Killed',
    description: 'Al-Qaeda leader killed by US forces. Symbolic victory in war on terror.',
  },
  {
    id: 'debt-ceiling-crisis',
    date: { month: 8, year: 2011 },
    title: 'US Debt Ceiling Crisis',
    description: 'Political standoff. Credit rating downgraded for first time. Markets tumble.',
    impact: { priceChange: -12 }
  },
  {
    id: 'fiscal-cliff',
    date: { month: 12, year: 2012 },
    title: 'Fiscal Cliff Averted',
    description: 'Last-minute deal prevents automatic tax hikes. Budget battles continue.',
  },
  {
    id: 'taper-tantrum',
    date: { month: 5, year: 2013 },
    title: 'Taper Tantrum',
    description: 'Fed signals end to QE stimulus. Bond markets convulse. Emerging markets hit.',
    impact: { priceChange: -5 }
  },
  {
    id: 'oil-crash-2014',
    date: { month: 6, year: 2014 },
    title: 'Oil Prices Collapse',
    description: 'Oversupply and weak demand. Oil falls from $100+ to under $50. Energy sector crisis.',
    impact: { commodityId: 'OIL', priceChange: -50 }
  },
  {
    id: 'china-slowdown',
    date: { month: 8, year: 2015 },
    title: 'China Economic Slowdown',
    description: 'Chinese markets crash. Global growth concerns. Commodities plunge.',
    impact: { priceChange: -8 }
  },
  {
    id: 'brexit-vote',
    date: { month: 6, year: 2016 },
    title: 'Brexit Vote Shocks Markets',
    description: 'UK votes to leave EU. Pound plunges. Global markets tumble then recover.',
    impact: { priceChange: -4 }
  },
  {
    id: 'trump-elected',
    date: { month: 11, year: 2016 },
    title: 'Donald Trump Wins Upset Victory',
    description: 'Reality TV star elected president. Markets rally on tax cut hopes.',
    impact: { priceChange: 5 }
  },
  {
    id: 'tax-cuts-2017',
    date: { month: 12, year: 2017 },
    title: 'Major Tax Cuts Passed',
    description: 'Corporate tax rate slashed. Stock buybacks surge. Market rally accelerates.',
    impact: { priceChange: 15 }
  },
  {
    id: 'trade-war',
    date: { month: 3, year: 2018 },
    title: 'Trade War with China Begins',
    description: 'Tariffs imposed on Chinese goods. Retaliation follows. Supply chains disrupted.',
    impact: { priceChange: -3 }
  },
  {
    id: 'december-2018-selloff',
    date: { month: 12, year: 2018 },
    title: 'Market Selloff',
    description: 'Worst December since Depression. Fed rate hikes and trade war fears combine.',
    impact: { priceChange: -9 }
  },
  {
    id: 'repo-crisis',
    date: { month: 9, year: 2019 },
    title: 'Repo Market Disruption',
    description: 'Short-term lending rates spike. Fed intervenes with liquidity. Financial plumbing issues.',
  },

  // 2020s
  {
    id: 'covid-19',
    date: { month: 3, year: 2020 },
    title: 'COVID-19 Pandemic',
    description: 'Global pandemic. Lockdowns begin. Fastest bear market in history. Economy frozen.',
    impact: { priceChange: -34 }
  },
  {
    id: 'oil-negative',
    date: { month: 4, year: 2020 },
    title: 'Oil Prices Turn Negative',
    description: 'Historic first: oil futures drop below zero. Storage full. Demand collapsed.',
    impact: { commodityId: 'OIL', priceChange: -300 }
  },
  {
    id: 'massive-stimulus',
    date: { month: 3, year: 2020 },
    title: 'Unprecedented Stimulus Measures',
    description: 'Trillions in government spending. Fed unlimited QE. Markets bottom and rocket higher.',
    impact: { priceChange: 25 }
  },
  {
    id: 'biden-elected',
    date: { month: 11, year: 2020 },
    title: 'Joe Biden Elected President',
    description: 'Disputed election. Biden wins. Transition drama. Markets focused on stimulus.',
  },
  {
    id: 'capitol-riot',
    date: { month: 1, year: 2021 },
    title: 'Capitol Riot',
    description: 'Mob storms US Capitol. Democracy shaken. Political polarization extreme.',
  },
  {
    id: 'gamestop-squeeze',
    date: { month: 1, year: 2021 },
    title: 'GameStop Short Squeeze',
    description: 'Retail traders on Reddit drive massive short squeeze. Hedge funds lose billions.',
  },
  {
    id: 'inflation-rises',
    date: { month: 5, year: 2021 },
    title: 'Inflation Accelerates',
    description: 'CPI jumps. Supply chain chaos. "Transitory" inflation narrative begins.',
    impact: { priceChange: -2 }
  },
  {
    id: 'crypto-crash-may-2021',
    date: { month: 5, year: 2021 },
    title: 'Cryptocurrency Crash',
    description: 'Bitcoin plunges 50%. China crackdown. Environmental concerns grow.',
    impact: { commodityId: 'BITCOIN', priceChange: -50 }
  },
  {
    id: 'infrastructure-bill',
    date: { month: 11, year: 2021 },
    title: 'Infrastructure Bill Passes',
    description: 'Bipartisan infrastructure investment. Construction and materials sector boost.',
  },
  {
    id: 'omicron',
    date: { month: 11, year: 2021 },
    title: 'Omicron Variant Spreads',
    description: 'New COVID variant. Travel restrictions. Markets sell off then recover.',
    impact: { priceChange: -4 }
  },
  {
    id: 'ukraine-war',
    date: { month: 2, year: 2022 },
    title: 'Russia Invades Ukraine',
    description: 'Major European war. Energy crisis. Sanctions on Russia. Commodities soar.',
    impact: { commodityId: 'OIL', priceChange: 40 }
  },
  {
    id: 'fed-hikes-begin',
    date: { month: 3, year: 2022 },
    title: 'Fed Begins Aggressive Rate Hikes',
    description: 'Inflation fight intensifies. Interest rates surge. Bear market begins.',
    impact: { priceChange: -8 }
  },
  {
    id: 'crypto-winter',
    date: { month: 5, year: 2022 },
    title: 'Crypto Winter Deepens',
    description: 'Luna/UST collapse. Celsius freezes withdrawals. Crypto crash accelerates.',
    impact: { commodityId: 'BITCOIN', priceChange: -50 }
  },
  {
    id: 'bear-market-2022',
    date: { month: 6, year: 2022 },
    title: 'Bear Market Confirmed',
    description: 'S&P 500 down 20% from peak. Inflation at 40-year high. Recession fears mount.',
    impact: { priceChange: -15 }
  },
  {
    id: 'ftx-collapse',
    date: { month: 11, year: 2022 },
    title: 'FTX Exchange Collapses',
    description: 'Major crypto exchange bankrupt. Founder arrested for fraud. Crypto credibility damaged.',
    impact: { commodityId: 'BITCOIN', priceChange: -25 }
  },
  {
    id: 'bank-failures-2023',
    date: { month: 3, year: 2023 },
    title: 'Silicon Valley Bank Fails',
    description: 'Bank run and collapse. Contagion fears. Government steps in. Banking crisis averted.',
    impact: { priceChange: -7 }
  },
  {
    id: 'ai-boom',
    date: { month: 5, year: 2023 },
    title: 'AI Revolution Accelerates',
    description: 'ChatGPT sparks AI frenzy. Tech stocks soar. New era of computing begins.',
    impact: { commodityId: 'TECH_STOCKS', priceChange: 35 }
  },
  {
    id: 'inflation-cooling',
    date: { month: 11, year: 2023 },
    title: 'Inflation Shows Signs of Cooling',
    description: 'CPI declining. Soft landing hopes rise. Markets rally strongly.',
    impact: { priceChange: 10 }
  },
  {
    id: 'bitcoin-etf',
    date: { month: 1, year: 2024 },
    title: 'Bitcoin ETF Approved',
    description: 'SEC approves spot Bitcoin ETFs. Mainstream adoption milestone. Prices surge.',
    impact: { commodityId: 'BITCOIN', priceChange: 25 }
  },
  {
    id: 'election-2024',
    date: { month: 11, year: 2024 },
    title: '2024 Presidential Election',
    description: 'Highly contested election. Markets volatile on policy uncertainty.',
  },
  {
    id: 'ai-breakthrough',
    date: { month: 3, year: 2025 },
    title: 'Major AI Breakthrough',
    description: 'New AI capabilities shock world. Productivity revolution predicted. Tech stocks hit records.',
    impact: { commodityId: 'TECH_STOCKS', priceChange: 20 }
  }
];

/**
 * Get news events for a specific date
 */
export function getNewsForDate(date: GameDate): WorldNewsEvent[] {
  return WORLD_NEWS_EVENTS.filter(event =>
    event.date.year === date.year && event.date.month === date.month
  );
}

/**
 * Get all news events between two dates
 */
export function getNewsBetweenDates(startDate: GameDate, endDate: GameDate): WorldNewsEvent[] {
  return WORLD_NEWS_EVENTS.filter(event => {
    const eventComp = compareDates(event.date, startDate);
    const endComp = compareDates(event.date, endDate);
    return eventComp >= 0 && endComp <= 0;
  });
}
