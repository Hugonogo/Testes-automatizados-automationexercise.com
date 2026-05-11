import { faker } from "@faker-js/faker";

export type UserData = {
  nome: string;
  email: string;
  senha: string;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  mobileNumber: string;
  day: string;
  month: string;
  year: string;
  gender: string;
};

export function getRandomValue(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function splitName(nome: string): string[] {
  return nome.trim().split(" ");
}

export function selectCountry(): string {
  const countries = [
    "India",
    "United States",
    "Canada",
    "Australia",
    "New Zealand",
    "Singapore",
  ];

  return faker.helpers.arrayElement(countries);
}

export function createUserData(): UserData {
  const nome = faker.person.fullName();
  const partesNome = splitName(nome);

  return {
    nome,
    email: faker.internet.email().toLowerCase(),
    senha: faker.internet.password(),

    firstName: partesNome[0],
    lastName: partesNome[partesNome.length - 1],

    company: faker.company.name(),
    address: faker.location.streetAddress(),
    address2: faker.location.streetAddress(),

    country: selectCountry(),
    state: faker.location.state(),
    city: faker.location.city(),
    zipCode: faker.location.zipCode(),
    mobileNumber: faker.phone.number({ style: "international" }),

    day: String(getRandomValue(1, 31)),
    month: String(getRandomValue(1, 12)),
    year: String(getRandomValue(1900, 2026)),
    gender: String(getRandomValue(1, 2)),
  };
}