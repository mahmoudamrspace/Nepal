import { Package } from '@/types';

export function calculateBookingTotal(
  packagePrice: number,
  numberOfTravelers: number,
  taxRate: number = 0.13, // 13% tax
  serviceFee: number = 50 // Fixed service fee
): {
  basePrice: number;
  taxes: number;
  fees: number;
  total: number;
} {
  const basePrice = packagePrice * numberOfTravelers;
  const taxes = basePrice * taxRate;
  const fees = serviceFee * numberOfTravelers;
  const total = basePrice + taxes + fees;

  return {
    basePrice,
    taxes,
    fees,
    total,
  };
}

export function generateBookingNumber(): string {
  const prefix = 'PVD';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function isDateAvailable(date: string, packageData: Package): boolean {
  if (!packageData.availableDates || packageData.availableDates.length === 0) {
    return true; // If no dates specified, assume all dates available
  }
  return packageData.availableDates.includes(date);
}

