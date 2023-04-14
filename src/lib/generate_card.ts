import { testingCards } from './testing_cards';

// This function calculates the checksum for a given input
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

// This function generates a valid credit card number with the given input
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

// This function generates a random string of numbers of the given length
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

// This function generates a random credit card number with the given input
const random = (input: any, inputOptions?: any) => {
  return generate(getRandomStringOfNumbers(input - 1), inputOptions);
};

// This function generates the first 6 digits (IIN) of a credit card number
const generateIIN = () => {
  // Generate '4' or '5'
  return `${Math.floor(Math.random() * 2) + 4}${Array(3)
    .fill(Math.floor(Math.random() * 4) + 1)
    .join(``)}`;
};

// This function generates a new random or testing specific credit card number
export const new_card = ({
  advancedMode = false,
  provider = 'none',
  brand = 'visa',
  variant = 'basic',
}: {
  advancedMode?: boolean;
  provider?: 'stripe' | 'paypal' | 'amazon' | 'fawrypay' | 'none';
  brand?: 'visa' | 'mastercard';
  variant?: 'basic' | 'debit' | 'declined' | 'expired' | 'secure';
}) => {
  if (advancedMode && provider !== 'none') {
    return testingCards[provider][brand][variant];
  } else return generate(generateIIN() + random(11));
};
