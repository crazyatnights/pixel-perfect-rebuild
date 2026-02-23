import type { Transaction } from './transactions';

/**
 * CUSTOM TRANSACTIONS FILE
 * 
 * Add your own transactions here. These will be merged with auto-generated
 * transactions and sorted by date (newest first).
 * 
 * Each transaction needs:
 * - id: unique string (prefix with "custom-" to avoid collisions)
 * - description: merchant/payee name
 * - amount: negative for expenses, positive for income
 * - date: JavaScript Date object
 * - category: one of 'shopping' | 'food' | 'transport' | 'bills' | 'entertainment' | 'transfer' | 'subscription'
 * - icon: emoji icon for the category
 * 
 * The auto-generator is also aware of these entries: any custom descriptions
 * you add will be included in the random generation pool for their category.
 */

export const customTransactions: Transaction[] = [
  // ── Example entries (edit/remove as you wish) ──────────────────────
  {
    id: 'custom-1',
    description: 'Bizum - Carlos',
    amount: -25.00,
    date: new Date(2026, 1, 20), // Feb 20, 2026
    category: 'transfer',
    icon: '🏦',
  },
  {
    id: 'custom-2',
    description: 'Mercadona',
    amount: -47.83,
    date: new Date(2026, 1, 18),
    category: 'food',
    icon: '🛒',
  },
  {
    id: 'custom-3',
    description: 'Netflix',
    amount: -17.99,
    date: new Date(2026, 1, 15),
    category: 'entertainment',
    icon: '🎬',
  },
  // ── Add your own below ─────────────────────────────────────────────
];

/**
 * Extra descriptions per category that the auto-generator should also use.
 * Add merchant names here and they'll appear in randomly generated transactions.
 */
export const extraDescriptions: Partial<Record<Transaction['category'], string[]>> = {
  // Example: add more food merchants to the random pool
  // food: ['Aldi', 'Día', 'Alcampo'],
  // shopping: ['Primark', 'Decathlon'],
};
