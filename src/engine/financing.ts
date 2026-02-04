// Financing calculations
import type { FinancingOption } from './types';

/**
 * Calculate monthly payment using standard amortization formula
 * M = P * [r(1+r)^n] / [(1+r)^n - 1]
 * where:
 * - M = monthly payment
 * - P = principal (loan amount)
 * - r = monthly interest rate
 * - n = number of months
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  if (annualRate === 0) {
    return principal / termMonths;
  }

  const monthlyRate = annualRate / 100 / 12;
  const factor = Math.pow(1 + monthlyRate, termMonths);
  const payment = principal * (monthlyRate * factor) / (factor - 1);

  return Math.round(payment * 100) / 100;
}

/**
 * Generate financing options based on total price
 */
export function generateFinancingOptions(
  totalPrice: number,
  options: {
    apr?: number;
    terms?: number[];
    dealerFeePercent?: number;
  } = {}
): FinancingOption[] {
  const {
    apr = 12.99,
    terms = [60, 84, 120, 180],
    dealerFeePercent = 0,
  } = options;

  // Calculate dealer fee if applicable
  const dealerFee = dealerFeePercent > 0
    ? Math.round(totalPrice * dealerFeePercent / 100 * 100) / 100
    : undefined;

  // Principal includes dealer fee if present
  const principal = totalPrice + (dealerFee || 0);

  return terms.map(termMonths => {
    const monthlyPayment = calculateMonthlyPayment(principal, apr, termMonths);
    const totalPayment = Math.round(monthlyPayment * termMonths * 100) / 100;

    return {
      termMonths,
      apr,
      monthlyPayment,
      totalPayment,
      dealerFee,
    };
  });
}

/**
 * Calculate how much interest is paid over the loan term
 */
export function calculateTotalInterest(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termMonths);
  const totalPayment = monthlyPayment * termMonths;
  return Math.round((totalPayment - principal) * 100) / 100;
}

/**
 * Calculate amortization schedule
 */
export function calculateAmortizationSchedule(
  principal: number,
  annualRate: number,
  termMonths: number
): Array<{
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}> {
  const schedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }> = [];

  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termMonths);
  const monthlyRate = annualRate / 100 / 12;
  let balance = principal;

  for (let month = 1; month <= termMonths; month++) {
    const interest = balance * monthlyRate;
    const principalPortion = monthlyPayment - interest;
    balance = Math.max(0, balance - principalPortion);

    schedule.push({
      month,
      payment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(principalPortion * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    });
  }

  return schedule;
}

/**
 * Format a financing option for display
 */
export function formatFinancingOption(option: FinancingOption): string {
  const years = option.termMonths / 12;
  return `$${option.monthlyPayment.toFixed(2)}/mo for ${years} years @ ${option.apr}% APR`;
}
