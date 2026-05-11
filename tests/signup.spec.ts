import { test, expect, type Locator, type Page } from "@playwright/test";
import { createUserData } from "./helpers/users-factory";

type UserData = ReturnType<typeof createUserData>;

test.beforeEach(async ({ page }) => {
  await page.goto("https://automationexercise.com/login");
});

async function expectCampoObrigatorio(input: Locator) {
  const validationMessage = await input.evaluate(
    (element: HTMLInputElement | HTMLSelectElement) => element.validationMessage
  );

  expect(validationMessage.length).toBeGreaterThan(0);
}

async function iniciarCadastro(page: Page, user: UserData) {
  const nomeInput = page.locator('input[data-qa="signup-name"]');
  const emailInput = page.locator('input[data-qa="signup-email"]');
  const buttonSubmit = page.locator('button[data-qa="signup-button"]');

  await nomeInput.fill(user.nome);
  await emailInput.fill(user.email);
  await buttonSubmit.click();

  await expect(page).toHaveURL(/signup/i);
}

async function preencherFormularioCadastro(page: Page, user: UserData, skip: string[] = []
) {
  const shouldFill = (field: string) => !skip.includes(field);

  if (shouldFill("gender")) {
    await page.locator(`input[id="id_gender${user.gender}"]`).check();
  }

  if (shouldFill("password")) {
    await page.locator('input[data-qa="password"]').fill(user.senha);
  }

  if (shouldFill("day")) {
    await page.locator('select[data-qa="days"]').selectOption(user.day);
  }

  if (shouldFill("month")) {
    await page.locator('select[data-qa="months"]').selectOption(user.month);
  }

  if (shouldFill("year")) {
    await page.locator('select[data-qa="years"]').selectOption(user.year);
  }

  if (shouldFill("firstName")) {
    await page.locator('input[data-qa="first_name"]').fill(user.firstName);
  }

  if (shouldFill("lastName")) {
    await page.locator('input[data-qa="last_name"]').fill(user.lastName);
  }

  if (shouldFill("company")) {
    await page.locator('input[data-qa="company"]').fill(user.company);
  }

  if (shouldFill("address")) {
    await page.locator('input[data-qa="address"]').fill(user.address);
  }

  if (shouldFill("address2")) {
    await page.locator('input[data-qa="address2"]').fill(user.address2);
  }

  if (shouldFill("country")) {
    await page.locator('select[data-qa="country"]').selectOption(user.country);
  }

  if (shouldFill("state")) {
    await page.locator('input[data-qa="state"]').fill(user.state);
  }

  if (shouldFill("city")) {
    await page.locator('input[data-qa="city"]').fill(user.city);
  }

  if (shouldFill("zipCode")) {
    await page.locator('input[data-qa="zipcode"]').fill(user.zipCode);
  }

  if (shouldFill("mobileNumber")) {
    await page.locator('input[data-qa="mobile_number"]').fill(user.mobileNumber);
  }
}

async function validarFormularioPreenchido(page: Page, user: UserData) {
  await expect(page.locator('input[data-qa="name"]')).toHaveValue(user.nome);
  await expect(page.locator('input[data-qa="email"]')).toHaveValue(user.email);
  await expect(page.locator('input[data-qa="password"]')).toHaveValue(user.senha);

  await expect(page.locator(`input[id="id_gender${user.gender}"]`)).toBeChecked();

  await expect(page.locator('select[data-qa="days"]')).toHaveValue(user.day);
  await expect(page.locator('select[data-qa="months"]')).toHaveValue(user.month);
  await expect(page.locator('select[data-qa="years"]')).toHaveValue(user.year);

  await expect(page.locator('input[data-qa="first_name"]')).toHaveValue(user.firstName);
  await expect(page.locator('input[data-qa="last_name"]')).toHaveValue(user.lastName);
  await expect(page.locator('input[data-qa="company"]')).toHaveValue(user.company);

  await expect(page.locator('input[data-qa="address"]')).toHaveValue(user.address);
  await expect(page.locator('input[data-qa="address2"]')).toHaveValue(user.address2);

  await expect(page.locator('select[data-qa="country"]')).toHaveValue(user.country);
  await expect(page.locator('input[data-qa="state"]')).toHaveValue(user.state);
  await expect(page.locator('input[data-qa="city"]')).toHaveValue(user.city);
  await expect(page.locator('input[data-qa="zipcode"]')).toHaveValue(user.zipCode);
  await expect(page.locator('input[data-qa="mobile_number"]')).toHaveValue(user.mobileNumber);
}

async function criarUsuarioValido(page: Page, user: UserData) {
  await iniciarCadastro(page, user);
  await preencherFormularioCadastro(page, user);
  await validarFormularioPreenchido(page, user);

  await page.locator('button[data-qa="create-account"]').click();

  await expect(page).toHaveURL(/account_created/i);
  await expect(page.getByText(/Account Created!/i)).toBeVisible();
}

test("Criar User Válido", async ({ page }) => {
  const user = createUserData();

  await criarUsuarioValido(page, user);
});

test("não deve iniciar cadastro sem nome", async ({ page }) => {
  const user = createUserData();

  const nomeInput = page.locator('input[data-qa="signup-name"]');
  const emailInput = page.locator('input[data-qa="signup-email"]');
  const buttonSubmit = page.locator('button[data-qa="signup-button"]');

  await emailInput.fill(user.email);
  await buttonSubmit.click();

  await expectCampoObrigatorio(nomeInput);
});

test("não deve iniciar cadastro sem email", async ({ page }) => {
  const user = createUserData();

  const nomeInput = page.locator('input[data-qa="signup-name"]');
  const emailInput = page.locator('input[data-qa="signup-email"]');
  const buttonSubmit = page.locator('button[data-qa="signup-button"]');

  await nomeInput.fill(user.nome);
  await buttonSubmit.click();

  await expectCampoObrigatorio(emailInput);
});

test("não deve iniciar cadastro com email inválido", async ({ page }) => {
  const user = createUserData();

  const nomeInput = page.locator('input[data-qa="signup-name"]');
  const emailInput = page.locator('input[data-qa="signup-email"]');
  const buttonSubmit = page.locator('button[data-qa="signup-button"]');

  await nomeInput.fill(user.nome);
  await emailInput.fill("email-invalido");
  await buttonSubmit.click();

  await expectCampoObrigatorio(emailInput);
});

test("não deve criar conta sem senha", async ({ page }) => {
  const user = createUserData();

  await iniciarCadastro(page, user);
  await preencherFormularioCadastro(page, user, ["password"]);

  const passInput = page.locator('input[data-qa="password"]');
  const buttonCreateAccount = page.locator('button[data-qa="create-account"]')
  await buttonCreateAccount.click();

  await expectCampoObrigatorio(passInput);
});

test("não deve criar conta sem primeiro nome", async ({ page }) => {
  const user = createUserData();

  await iniciarCadastro(page, user);
  await preencherFormularioCadastro(page, user, ["firstName"]);

  const firstNameInput = page.locator('input[data-qa="first_name"]');
  
  const buttonCreateAccount = page.locator('button[data-qa="create-account"]')
  await buttonCreateAccount.click();

  await expectCampoObrigatorio(firstNameInput);
});

test("não deve criar conta sem último nome", async ({ page }) => {
  const user = createUserData();

  await iniciarCadastro(page, user);
  await preencherFormularioCadastro(page, user, ["lastName"]);

  const lastNameInput = page.locator('input[data-qa="last_name"]');

  const buttonCreateAccount = page.locator('button[data-qa="create-account"]')
  await buttonCreateAccount.click();

  await expectCampoObrigatorio(lastNameInput);
});

test("não deve criar conta sem endereço principal", async ({ page }) => {
  const user = createUserData();

  await iniciarCadastro(page, user);
  await preencherFormularioCadastro(page, user, ["address"]);

  const addressInput = page.locator('input[data-qa="address"]');

  const buttonCreateAccount = page.locator('button[data-qa="create-account"]')
  await buttonCreateAccount.click();

  await expectCampoObrigatorio(addressInput);
});

test("não deve criar conta sem estado", async ({ page }) => {
  const user = createUserData();

  await iniciarCadastro(page, user);
  await preencherFormularioCadastro(page, user, ["state"]);

  const stateInput = page.locator('input[data-qa="state"]');

  const buttonCreateAccount = page.locator('button[data-qa="create-account"]')
  await buttonCreateAccount.click();

  await expectCampoObrigatorio(stateInput);
});

test("não deve criar conta sem cidade", async ({ page }) => {
  const user = createUserData();

  await iniciarCadastro(page, user);
  await preencherFormularioCadastro(page, user, ["city"]);

  const cityInput = page.locator('input[data-qa="city"]');

  const buttonCreateAccount = page.locator('button[data-qa="create-account"]')
  await buttonCreateAccount.click();

  await expectCampoObrigatorio(cityInput);
});

test("não deve criar conta sem zipcode", async ({ page }) => {
  const user = createUserData();

  await iniciarCadastro(page, user);
  await preencherFormularioCadastro(page, user, ["zipCode"]);

  const zipCodeInput = page.locator('input[data-qa="zipcode"]');

  const buttonCreateAccount = page.locator('button[data-qa="create-account"]')
  await buttonCreateAccount.click();

  await expectCampoObrigatorio(zipCodeInput);
});

test("não deve criar conta sem número de telefone", async ({ page }) => {
  const user = createUserData();

  await iniciarCadastro(page, user);
  await preencherFormularioCadastro(page, user, ["mobileNumber"]);

  const mobileNumberInput = page.locator('input[data-qa="mobile_number"]');

  const buttonCreateAccount = page.locator('button[data-qa="create-account"]')
  await buttonCreateAccount.click();

  await expectCampoObrigatorio(mobileNumberInput);
});

test("não deve cadastrar usuário com email já existente", async ({ page }) => {
  const user = createUserData();

  await criarUsuarioValido(page, user);

  await page.locator('a[data-qa="continue-button"]').click();

  await expect(page.getByText(/Logged in as/i)).toBeVisible();

  await page.getByRole("link", { name: /logout/i }).click();

  await expect(page).toHaveURL(/login/i);

  const nomeInput = page.locator('input[data-qa="signup-name"]');
  const emailInput = page.locator('input[data-qa="signup-email"]');
  const buttonSubmit = page.locator('button[data-qa="signup-button"]');

  await nomeInput.fill(user.nome);
  await emailInput.fill(user.email);
  await buttonSubmit.click();

  await expect(page.getByText(/Email Address already exist!/i)).toBeVisible();
});