/**
 * Centralized account configuration.
 * Change values here and they propagate across the entire app:
 * Login, Dashboard, Card overlay, PDF statements, etc.
 */

export const ACCOUNT_CONFIG = {
  /** Full name of the account owner */
  ownerName: 'MIGUEL IGNACIO',

  /** First name used on the login greeting */
  loginDisplayName: 'Juan Pedro',

  /** Initials shown on the avatar badge */
  initials: 'MI',

  /** Login initials (may differ from card initials) */
  loginInitials: 'JP',

  /** Account number suffix shown in the UI */
  accountSuffix: '7925',

  /** Full IBAN (masked version for statements) */
  iban: 'ES12 0182 **** **** 0067',

  /** Full card number displayed on the debit card */
  cardNumber: '4658 8520 3179 7925',

  /** Card expiry date */
  cardExpiry: '12/28',

  /** CVV display (masked) */
  cardCvv: '***',

  /** Email shown on PDF statements */
  email: 'CUSTOMER@EMAIL.COM',

  /** Address shown on PDF statements */
  address: 'MADRID - SPAIN',

  /** Branch address for statements */
  branchAddress: 'C/ Gran Vía 1, Madrid',

  /** Branch phone for statements */
  branchPhone: '00 34 912 345 678',
} as const;
