import { ShoppingBag, ShoppingCart, Car, Home, Tv, ArrowLeftRight, Package, Fuel, Train, Smartphone, Wifi, Zap, Gamepad2, Music, CreditCard, Store } from 'lucide-react';
import type { Transaction } from '@/lib/transactions';
import bizumLogo from '@/assets/bizum.svg';

/**
 * Brand color map: merchant name → { bg color, text color, short label }
 * Uses tailwind-compatible HSL or hex values for inline styling.
 */
const brandMap: Record<string, { bg: string; fg: string; label: string }> = {
  // Food & grocery
  'Mercadona':       { bg: '#00a650', fg: '#fff', label: 'M' },
  'Carrefour':       { bg: '#004a9f', fg: '#fff', label: 'C' },
  'Lidl':            { bg: '#0050aa', fg: '#fff', label: 'L' },
  'Aldi':            { bg: '#00005f', fg: '#fff', label: 'A' },
  'Día':             { bg: '#e30613', fg: '#fff', label: 'D' },
  'Alcampo':         { bg: '#e2001a', fg: '#fff', label: 'A' },

  // Delivery
  'Uber Eats':       { bg: '#06c167', fg: '#fff', label: 'UE' },
  'Glovo':           { bg: '#ffc244', fg: '#000', label: 'G' },

  // Shopping
  'Amazon':          { bg: '#ff9900', fg: '#000', label: 'A' },
  'Zara':            { bg: '#000000', fg: '#fff', label: 'Z' },
  'El Corte Inglés': { bg: '#00a04e', fg: '#fff', label: 'ECI' },
  'MediaMarkt':      { bg: '#df0000', fg: '#fff', label: 'MM' },
  'IKEA':            { bg: '#0058a3', fg: '#ffdb00', label: 'IK' },
  'Primark':         { bg: '#0074c1', fg: '#fff', label: 'P' },
  'Decathlon':       { bg: '#0082c3', fg: '#fff', label: 'D' },

  // Transport
  'Renfe':           { bg: '#6b2382', fg: '#fff', label: 'R' },
  'Metro Madrid':    { bg: '#255b9a', fg: '#fff', label: 'M' },
  'Cabify':          { bg: '#7b4eff', fg: '#fff', label: 'C' },
  'Repsol':          { bg: '#ff6600', fg: '#fff', label: 'R' },
  'BP Gasolinera':   { bg: '#009a4e', fg: '#ffde00', label: 'BP' },

  // Bills
  'Iberdrola':       { bg: '#49a942', fg: '#fff', label: 'I' },
  'Vodafone':        { bg: '#e60000', fg: '#fff', label: 'V' },
  'Naturgy':         { bg: '#003b71', fg: '#fff', label: 'N' },
  'Movistar':        { bg: '#0b9ed9', fg: '#fff', label: 'M' },
  'Endesa':          { bg: '#00a3e0', fg: '#fff', label: 'E' },

  // Entertainment / subscriptions
  'Netflix':         { bg: '#e50914', fg: '#fff', label: 'N' },
  'Spotify':         { bg: '#1db954', fg: '#fff', label: 'S' },
  'HBO Max':         { bg: '#5822b4', fg: '#fff', label: 'H' },
  'Steam':           { bg: '#1b2838', fg: '#fff', label: 'S' },
  'PlayStation Store': { bg: '#003087', fg: '#fff', label: 'PS' },

  // Transfer / Bizum
  'Bizum - Juan':    { bg: '#004481', fg: '#fff', label: 'bizum' },
  'Bizum - María':   { bg: '#004481', fg: '#fff', label: 'bizum' },
  'Bizum - Carlos':  { bg: '#004481', fg: '#fff', label: 'bizum' },

  // Subscriptions
  'iCloud Storage':  { bg: '#3693f5', fg: '#fff', label: '☁' },
  'Google One':      { bg: '#4285f4', fg: '#fff', label: 'G' },
  'Gym membership':  { bg: '#ff5722', fg: '#fff', label: '💪' },
};

const categoryIconMap: Record<Transaction['category'], { icon: React.ElementType; bg: string; fg: string }> = {
  shopping:      { icon: ShoppingBag, bg: '#f59e0b', fg: '#fff' },
  food:          { icon: ShoppingCart, bg: '#22c55e', fg: '#fff' },
  transport:     { icon: Car, bg: '#6366f1', fg: '#fff' },
  bills:         { icon: Home, bg: '#0ea5e9', fg: '#fff' },
  entertainment: { icon: Tv, bg: '#ef4444', fg: '#fff' },
  transfer:      { icon: ArrowLeftRight, bg: '#14b8a6', fg: '#fff' },
  subscription:  { icon: Package, bg: '#8b5cf6', fg: '#fff' },
};

interface TransactionIconProps {
  txn: Transaction;
  size?: number;
}

export const TransactionIcon = ({ txn, size = 40 }: TransactionIconProps) => {
  // Check for Bizum prefix
  const desc = txn.description;
  const isBizum = desc.startsWith('Bizum');
  const bizumMatch = isBizum ? brandMap['Bizum - Juan'] : undefined;
  const brand = brandMap[desc] || bizumMatch;

  if (brand) {
    // Use Bizum SVG logo for any Bizum transaction
    if (isBizum || brand.label === 'bizum') {
      return (
        <div
          className="rounded-full flex items-center justify-center shrink-0"
          style={{
            width: size,
            height: size,
            backgroundColor: '#004481',
          }}
        >
          <img
            src={bizumLogo}
            alt="Bizum"
            style={{
              width: size * 0.6,
              height: size * 0.6,
              filter: 'brightness(0) invert(1)',
            }}
          />
        </div>
      );
    }

    return (
      <div
        className="rounded-full flex items-center justify-center font-bold shrink-0"
        style={{
          width: size,
          height: size,
          backgroundColor: brand.bg,
          color: brand.fg,
          fontSize: size * 0.3,
        }}
      >
        {brand.label}
      </div>
    );
  }

  // Fallback to category icon
  const catInfo = categoryIconMap[txn.category];
  const IconComp = catInfo.icon;
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: catInfo.bg,
        color: catInfo.fg,
      }}
    >
      <IconComp size={size * 0.5} />
    </div>
  );
};
