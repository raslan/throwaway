import { faker } from "@faker-js/faker";
import { useCallback, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import useEmail from "./useEmail";
import { new_card } from "src/lib/generate_card.js";

const flatten = (obj: Record<string, any>) => {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object") {
      const flat = flatten(value);
      for (const [subKey, subValue] of Object.entries(flat)) {
        result[`${key}.${subKey}`] = subValue;
      }
    } else {
      result[key] = value;
    }
  }
  return result;
};

const useIdentity = (): {
  identity: Record<string, any>;
  newIdentity: () => void;
} => {
  const { email } = useEmail();
  const [identity, setIdentity] = useLocalStorage<Record<string, any>>(
    "throwaway-identity",
    {}
  );

  const newIdentity = useCallback(() => {
    const name = faker.name.findName();
    const generatedIdentity = {
      ...flatten(faker.helpers.contextualCard()),
      email,
      name,
      avatar: `https://api.lorem.space/image?w=500&h=500&x=${
        Math.floor(Math.random() * 899) + 100
      }`,
      card_expiry: `0${Math.floor(Math.random() * 8) + 1}/${
        Math.floor(Math.random() * 7) + 22
      }`,
      card_number: new_card(),
      card_verification: `${Math.floor(Math.random() * 899) + 100}`,
      job_title: faker.name.jobTitle(),
      first_name: name.split(" ")[0],
      last_name: name.split(" ")[1],
      state: faker.address.state(),
      city: faker.address.city(),
      street_address: faker.address.streetAddress(),
      zipcode: faker.address.zipCode(),
      phone: faker.phone.phoneNumber(),
      country: faker.address.country(),
      company: faker.company.companyName(),
      organization: faker.company.companyName(),
      username: faker.internet.userName(),
      password: faker.internet.password() + faker.internet.password(),
      suite: faker.address.secondaryAddress(),
      apartment: faker.address.secondaryAddress(),
      dateofbirth: faker.date.past(50).toISOString().split("T")[0],
      date: faker.date.past(50).toISOString().split("T")[0],
    };
    setIdentity(generatedIdentity);
  }, [email]);

  useEffect(() => {
    if (!identity.name) {
      newIdentity();
    } else {
      setIdentity({ ...identity, email });
    }
  }, [email]);

  useEffect(() => {
    chrome.storage.local.set({ identity: JSON.stringify(identity) });
  }, [identity]);

  return {
    identity,
    newIdentity,
  };
};

export default useIdentity;
