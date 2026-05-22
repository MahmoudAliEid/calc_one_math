'use server';

import { calculateArabicPower, CalculationResult } from '@/lib/calculate';

/**
 * Server action to perform the heavy calculation on the server.
 * Offloading this from the client ensures the UI stays responsive
 * even for 300+ words.
 */
export async function calculatePowerAction(text: string): Promise<{ success: boolean; data?: CalculationResult; error?: string }> {
  try {
    // Basic validation
    if (!text || text.trim().length === 0) {
      return { success: false, error: 'Input is required' };
    }

    // Perform the calculation on the server
    const result = calculateArabicPower(text);
    
    return { success: true, data: result };
  } catch (err) {
    console.error('Calculation Action Error:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'حدث خطأ أثناء المعالجة' 
    };
  }
}
