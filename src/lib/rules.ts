/**
 * Arabic character normalization rules
 */

// Normalization map for specific Arabic characters
export const NORMALIZATION_MAP: Record<string, string> = {
  // Alif/Hamza Group normalize all to 'أ'
  'ا': 'أ',
  'أ': 'أ',
  'إ': 'أ',
  'آ': 'أ',
  'ى': 'أ',
  'ء': 'أ',
  'ؤ': 'أ',
  'ئ': 'أ',
  'ٱ': 'أ',
  
  // Ta Group normalize all to 'ت'
  'ة': 'ت',
  'ت': 'ت',

  // Ha Group normalize all to 'ه'
  'ه': 'ه',
  'ھ': 'ه', // Heh Doachashmee
};

// Arabic character range regex (includes common Arabic letters and spaces)
export const ARABIC_REGEX = /^[\u0600-\u06FF\s]*$/;

/**
 * Normalize Arabic text according to the rules:
 * - Convert (إ, آ, ى, ء, ئ, ؤ) and 'ا' to 'أ'
 * - Convert 'ة' to 'ت'
 * - Keep 'ه' as is, map 'ھ' (Heh Doachashmee) to 'ه'
 * - Strip spaces, tatweel, and special characters
 * @param text - Input Arabic text
 * @returns Normalized text
 */
export function normalizeArabicText(text: string): string {
  // 1. Remove diacritics (tashkeel)
  const withoutDiacritics = removeDiacritics(text);
  
  // 2. Normalize and filter characters
  let result = '';
  for (let i = 0; i < withoutDiacritics.length; i++) {
    const char = withoutDiacritics[i];
    
    if (char in NORMALIZATION_MAP) {
      result += NORMALIZATION_MAP[char];
    } else {
      // Check if it's any other standard Arabic letter in range U+0621 to U+064A (excluding Tatweel U+0640)
      const code = char.charCodeAt(0);
      if (code >= 0x0621 && code <= 0x064A && code !== 0x0640) {
        result += char;
      }
    }
  }
  
  return result;
}

/**
 * Validate that input contains only Arabic characters and spaces
 * @param text - Input text to validate
 * @returns true if valid, false otherwise
 */
export function validateArabicInput(text: string): boolean {
  return ARABIC_REGEX.test(text);
}

/**
 * Clean text by removing diacritics (tashkeel)
 * @param text - Input text
 * @returns Cleaned text
 */
export function removeDiacritics(text: string): string {
  // Remove Arabic diacritics:
  // \u064B-\u0652: standard tashkeel
  // \u0670: Superscript Alif (dagger alif)
  // \u0610-\u061A: more specific quranic marks
  return text.replace(/[\u064B-\u0652\u0670\u0610-\u061A]/g, '');
}


