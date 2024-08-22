import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { fakerEN_US, fakerES, fakerEN_GB, faker } from '@faker-js/faker';
import { new_card } from '@/lib/generate_card';

const locales = [fakerEN_US, fakerES, fakerEN_GB];

// Defining character sets for password generation
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const symbolChars = '!@#$%^&*-_=+;:,.?';
const numberChars = '0123456789';

export const generatePassword = (
  length = 13,
  {
    lowercase = true,
    uppercase = true,
    symbols = true,
    numbers = true,
  }: {
    lowercase?: boolean;
    uppercase?: boolean;
    symbols?: boolean;
    numbers?: boolean;
  } = {}
) => {
  let chars = '';
  let password = '';
  // Add characters based on options
  if (lowercase) chars += lowercaseChars;
  if (uppercase) chars += uppercaseChars;
  if (symbols) chars += symbolChars;
  if (numbers) chars += numberChars;

  // If no characters were selected, default to all character sets
  if (!lowercase && !uppercase && !symbols && !numbers) {
    chars = lowercaseChars + uppercaseChars + symbolChars + numberChars;
  }

  // Generate a password with at least one character from each selected character set
  while (
    !password.match(/[a-z]/) ||
    !password.match(/[A-Z]/) ||
    !password.match(/[0-9]/) ||
    !password.match(/[!@#$%^&*-_=+;:,.?]/)
  ) {
    password = Array.from({ length }, () => {
      const randomIndex = Math.floor(Math.random() * chars.length);
      return chars[randomIndex];
    }).join('');
  }

  return password;
};

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const generateUserData = (email: string) => {
  return {
    identifier: email,
    avatar: `https://picsum.photos/500`,
    job_title: faker.person.jobTitle(),
    name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    phone: faker.phone.number(),
    tel: faker.phone.number(),
    company: faker.company.name(),
    organization: faker.company.name(),
    username: faker.internet.userName(),
    password: generatePassword(),
  };
};

export const generateAddress = (localeIndex = 0) => {
  // Randomly pick one of the available locales and map it as "faker", also save the randomly picked country so it can be used below again
  const localeCountry = ['United States', 'Spain', 'United Kingdom'][
    localeIndex
  ];
  const localeCountryCode = ['US', 'ES', 'GB'][localeIndex];
  const addressFakerInstance = locales[localeIndex];
  const street = addressFakerInstance.location.streetAddress();
  const state = addressFakerInstance.location.state();
  return {
    state,
    city: addressFakerInstance.location.city(),
    street_address: street,
    street,
    zipcode: addressFakerInstance.location.zipCode(),
    country: localeCountry,
    country_code: localeCountryCode,
    suite: addressFakerInstance.location.secondaryAddress(),
    apartment: addressFakerInstance.location.secondaryAddress(),
  };
};

export const generateFinancials = (country_code: string) => {
  const referenceBic = faker.finance.bic({
    includeBranchCode: true,
  });
  const bic =
    referenceBic.substring(0, 4) + country_code + referenceBic.substring(6);
  const accountNumber = faker.finance.accountNumber();
  const routingNumber = faker.finance.routingNumber();
  const currencyCode = {
    US: 'USD',
    ES: 'EUR',
    GB: 'GBP',
  }?.[country_code];
  return {
    currency: currencyCode,
    iban:
      country_code === 'US'
        ? faker.finance.iban()
        : faker.finance.iban({
            countryCode: country_code,
          }),
    bic,
    swift: bic,
    swiftCode: bic,
    swift_code: bic,
    account: accountNumber,
    accountNumber,
    account_number: accountNumber,
    accountName: faker.finance.accountName(),
    routingNumber,
    routing_number: routingNumber,
  };
};

export const generateDate = () => ({
  dateofbirth: faker.date.past({ years: 50 }).toISOString().split('T')[0],
  date: faker.date.past({ years: 50 }).toISOString().split('T')[0],
});

export const generateCode = (otp: string) => ({
  otp,
  code: otp,
  verification_code: otp,
});

export const generateCard = (
  advancedCardMode: boolean,
  cardParams: {
    provider?: 'stripe' | 'paypal' | 'amazon' | 'fawrypay' | 'paymob' | 'none';
    brand?: 'visa' | 'mastercard';
    variant?: 'basic' | 'debit' | 'declined' | 'expired' | 'secure';
  }
) => {
  const cvc = `${Math.floor(Math.random() * 899) + 100}`;
  const card_expiry_month = `0${Math.floor(Math.random() * 8) + 1}`;
  const card_expiry_year = `${Math.floor(Math.random() * 5) + 24}`;
  const card_expiry = `${card_expiry_month}/${card_expiry_year}`;
  const card_number = new_card({
    advancedMode: advancedCardMode ?? false,
    ...cardParams,
  });
  return {
    card_number,
    'cc-number': card_number,
    cardNumber: card_number,
    card_expiry,
    'cc-exp': card_expiry,
    expMonth: card_expiry_month,
    expYear: card_expiry_year,
    MM: card_expiry_month,
    YY: card_expiry_year,
    cvc,
    card_verification: cvc,
    'cc-csc': cvc,
  };
};

export const fill = (message: any) => chrome?.runtime?.sendMessage(message);
