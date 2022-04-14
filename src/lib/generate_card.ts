const checksum = (input: any) => {
  const string = input.toString();
  let sum = 0;
  let parity = 2;
  for (let i = string.length - 1; i >= 0; i--) {
    const digit = Math.max(parity, 1) * +string[i];
    sum +=
      digit > 9
        ? digit
            .toString()
            .split("")
            .map(Number)
            .reduce((a, b) => a + b, 0)
        : digit;
    parity *= -1;
  }
  sum %= 10;
  return sum > 0 ? 10 - sum : 0;
};

const generate = (input: any, inputOptions?: any) => {
  let string = input.toString();
  const options = { pad: 0, weightFactor: 2 };
  // option pad
  if (typeof inputOptions !== "undefined") {
    if (typeof inputOptions.pad !== "undefined") {
      options.pad = inputOptions.pad;
      if (options.pad > string.length) {
        string = Array(options.pad - String(string).length).join("0") + string;
      }
    }
  }
  return string + checksum(string);
};

const random = (input: any, inputOptions?: any) => {
  const getRandomStringOfNumbers = (length: any) => {
    let randomStringOfNumbers = "";
    while (randomStringOfNumbers.length < length) {
      const random = Math.random().toString();
      randomStringOfNumbers += random.substr(2, random.length);
      if (randomStringOfNumbers.length > length) {
        randomStringOfNumbers = randomStringOfNumbers.substr(0, length);
      }
    }
    return randomStringOfNumbers;
  };
  return generate(getRandomStringOfNumbers(input - 1), inputOptions);
};

const generateIIN = () => {
  // Generate '4' or '5'
  return `${Math.floor(Math.random() * 2) + 4}${Array(3)
    .fill(Math.floor(Math.random() * 4) + 1)
    .join(``)}`;
};

export const new_card = () => generate(generateIIN() + random(11));
