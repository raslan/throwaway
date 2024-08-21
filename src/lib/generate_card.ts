// Import testing cards from major payment providers for QA
import { testingCards } from '@/lib/testing_cards';

/**
 * Calculates the checksum for a given input string representing a credit card number.
 * The checksum is a crucial part of validating credit card numbers according to Luhn's algorithm.
 *
 * @param input - The input string representing a credit card number.
 * @returns The calculated checksum value.
 */
const checksum = (input: any) => {
  const string = input.toString();
  let sum = 0;
  let parity = 2;

  // Iterate over the string in reverse order
  for (let i = string.length - 1; i >= 0; i--) {
    const digit = Math.max(parity, 1) * +string[i];

    // If the digit is greater than 9, sum its individual digits
    if (digit > 9) {
      sum += digit
        .toString()
        .split('')
        .map(Number)
        .reduce((a, b) => a + b, 0);
    } else {
      sum += digit;
    }

    // Flip the parity for the next iteration
    parity *= -1;
  }

  // Calculate the final checksum and return it
  sum %= 10;
  return sum > 0 ? 10 - sum : 0;
};

/**
 * Generates a valid credit card number with the given input. It supports padding the input
 * to meet the required length for a credit card number and appends the calculated checksum.
 *
 * @param input - The base input for generating the credit card number.
 * @param inputOptions - Optional parameters to customize the generation process, such as padding.
 * @returns A complete credit card number including the original input and appended checksum.
 */
const generate = (input: any, inputOptions?: any) => {
  let string = input.toString();

  // Set default options
  const options = { pad: 0, weightFactor: 2 };

  // Override default options if provided
  if (typeof inputOptions !== 'undefined') {
    if (typeof inputOptions.pad !== 'undefined') {
      options.pad = inputOptions.pad;
      if (options.pad > string.length) {
        string = Array(options.pad - String(string).length).join('0') + string;
      }
    }
  }

  // Generate and append the checksum to the string
  return string + checksum(string);
};

/**
 * Generates a random string of numbers of the specified length. This utility function is used
 * to create a base for generating random credit card numbers.
 *
 * @param length - The desired length of the random string.
 * @returns A randomly generated string of numbers.
 */
const getRandomStringOfNumbers = (length: any) => {
  let randomStringOfNumbers = '';
  while (randomStringOfNumbers.length < length) {
    const random = Math.random().toString();
    randomStringOfNumbers += random.substring(2, random.length);
    if (randomStringOfNumbers.length > length) {
      randomStringOfNumbers = randomStringOfNumbers.substring(0, length);
    }
  }
  return randomStringOfNumbers;
};

/**
 * Generates a random credit card number based on the input length. It combines the base
 * random string with the checksum to produce a fully formed credit card number.
 *
 * @param input - The base length for generating the random credit card number.
 * @param inputOptions - Optional parameters to customize the generation process.
 * @returns A randomly generated credit card number.
 */
const random = (input: any, inputOptions?: any) => {
  return generate(getRandomStringOfNumbers(input - 1), inputOptions);
};

/**
 * Generates the IIN of a credit card number. These digits identify the issuing institution.
 *
 * @returns A randomly generated IIN prefix.
 */
const generateIIN = () => {
  // Generate '4' or '5'
  return `${Math.floor(Math.random() * 2) + 4}${Array(3)
    .fill(Math.floor(Math.random() * 4) + 1)
    .join(``)}`;
};

/**
 * Generates a new random or testing-specific credit card number based on the provided criteria.
 * In advanced mode, it selects a specific card from the testing database. Otherwise, it generates
 * a random card number.
 *
 * @param options - An object specifying whether to use advanced mode, the payment provider, brand, and variant.
 * @returns A credit card number based on the provided criteria.
 */
export const new_card = ({
  advancedMode = false,
  provider = 'none',
  brand = 'visa',
  variant = 'basic',
}: {
  advancedMode?: boolean;
  provider?: 'stripe' | 'paypal' | 'amazon' | 'fawrypay' | 'paymob' | 'none';
  brand?: 'visa' | 'mastercard';
  variant?: 'basic' | 'debit' | 'declined' | 'expired' | 'secure';
}) => {
  if (advancedMode && provider !== 'none') {
    return testingCards[provider][brand][variant];
  } else return generate(generateIIN() + random(11));
};
