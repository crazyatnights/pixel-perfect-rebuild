export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: Date;
  category: 'shopping' | 'food' | 'transport' | 'bills' | 'entertainment' | 'transfer' | 'subscription';
  icon: string;
}

const descriptions: Record<Transaction['category'], string[]> = {
  shopping: ['Amazon', 'Zara', 'El Corte Inglés', 'MediaMarkt', 'IKEA'],
  food: ['Mercadona', 'Carrefour', 'Lidl', 'Uber Eats', 'Glovo'],
  transport: ['Renfe', 'Metro Madrid', 'Cabify', 'Repsol', 'BP Gasolinera'],
  bills: ['Iberdrola', 'Vodafone', 'Naturgy', 'Movistar', 'Endesa'],
  entertainment: ['Netflix', 'Spotify', 'HBO Max', 'Steam', 'PlayStation Store'],
  transfer: ['Bizum - Juan', 'Bizum - María', 'Transfer to savings', 'BBVA plan estars...'],
  subscription: ['Gym membership', 'iCloud Storage', 'Google One', 'Debit viva agua s...'],
};

const categoryIcons: Record<Transaction['category'], string> = {
  shopping: '🛍️',
  food: '🛒',
  transport: '🚗',
  bills: '🏠',
  entertainment: '🎬',
  transfer: '🏦',
  subscription: '📦',
};

export function generateTransactions(startDate: Date, endDate: Date, count: number = 20): Transaction[] {
  const transactions: Transaction[] = [];
  const categories = Object.keys(descriptions) as Transaction['category'][];
  const range = endDate.getTime() - startDate.getTime();

  for (let i = 0; i < count; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const descs = descriptions[cat];
    const desc = descs[Math.floor(Math.random() * descs.length)];
    const amount = -(Math.random() * 150 + 1);
    const date = new Date(startDate.getTime() + Math.random() * range);

    transactions.push({
      id: `txn-${i}`,
      description: desc,
      amount: Math.round(amount * 100) / 100,
      date,
      category: cat,
      icon: categoryIcons[cat],
    });
  }

  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
}
