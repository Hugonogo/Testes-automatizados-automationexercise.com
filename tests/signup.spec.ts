import { test, expect } from "@playwright/test";
import { createUserData } from "./helpers/users-factory";
import { faker } from "@faker-js/faker";


 const user = createUserData();

test.beforeEach(async ({ page }) => {
  await page.goto("https://automationexercise.com/login");
});

test("Criar User", async ({ page }) => {
 
  const nomeInput = page.locator('input[data-qa="signup-name"]');
  const emailInput = page.locator('input[type="email"][data-qa="signup-email"]');
  const buttonSubmit = page.locator('button[type="submit"][data-qa="signup-button"]');

  const radioInput = page.locator(`input[type="radio"][id="id_gender${user.gender}"]`);

  const passInput = page.locator('input[data-qa="password"][id="password"]');

  const daySelect = page.locator('select[data-qa="days"][id="days"]');
  const monthsSelect = page.locator('select[data-qa="months"][id="months"]');
  const yearSelect = page.locator('select[data-qa="years"][id="years"]');

  const firstNameInput = page.locator('input[data-qa="first_name"]');
  const lastNameInput = page.locator('input[data-qa="last_name"]');

  const companyInput = page.locator('input[data-qa="company"]');

  const addressInput = page.locator('input[data-qa="address"]');
  const addressInput2 = page.locator('input[data-qa="address2"]');

  const signupInputName = page.locator('input[id="name"][data-qa="name"]');
  const signupInputEmail = page.locator('input[data-qa="email"][id="email"]');

  const countrySelect = page.locator('select[data-qa="country"]');

  const stateInput = page.locator('input[data-qa="state"]');
  const cityInput = page.locator('input[data-qa="city"]');
  const zipCodeInput = page.locator('input[data-qa="zipcode"]');
  const numberInput = page.locator('input[data-qa="mobile_number"]');

  const createButton = page.locator('button[data-qa="create-account"]');

  await nomeInput.fill(user.nome);
  await emailInput.fill(user.email);
  await buttonSubmit.click();

  await expect(page).toHaveURL(/signup/i);

  await radioInput.check();
  await passInput.fill(user.senha);

  await daySelect.selectOption(user.day);
  await monthsSelect.selectOption(user.month);
  await yearSelect.selectOption(user.year);

  await firstNameInput.fill(user.firstName);
  await lastNameInput.fill(user.lastName);

  await companyInput.fill(user.company);

  await addressInput.fill(user.address);
  await addressInput2.fill(user.address2);

  await countrySelect.selectOption(user.country);

  await stateInput.fill(user.state);
  await cityInput.fill(user.city);
  await zipCodeInput.fill(user.zipCode);
  await numberInput.fill(user.mobileNumber);

  await expect(signupInputName).toHaveValue(user.nome);
  await expect(signupInputEmail).toHaveValue(user.email);
  await expect(passInput).toHaveValue(user.senha);
  await expect(radioInput).toBeChecked();

  await expect(daySelect).toHaveValue(user.day);
  await expect(monthsSelect).toHaveValue(user.month);
  await expect(yearSelect).toHaveValue(user.year);

  await expect(firstNameInput).toHaveValue(user.firstName);
  await expect(lastNameInput).toHaveValue(user.lastName);

  await expect(companyInput).toHaveValue(user.company);
  await expect(countrySelect).toHaveValue(user.country);
  await expect(stateInput).toHaveValue(user.state);
  await expect(cityInput).toHaveValue(user.city);
  await expect(zipCodeInput).toHaveValue(user.zipCode);
  await expect(numberInput).toHaveValue(user.mobileNumber);

  await createButton.click();

  await expect(page).toHaveURL(/account_created/i);
});

test("fazer Login válido", async ({page}) => {
    const emailInput = page.locator(`input[data-qa="login-email"]`);
    const passinput = page.locator(`input[data-qa="login-password"]`);

    const buttonLogin = page.locator(`button[data-qa="login-button"]`);

    await emailInput.fill("neoma45@hotmail.com");
    await passinput.fill("uMv5hnylwvklhVy");

    await buttonLogin.click();

    await expect(page.getByText(/logged/i)).toBeVisible()


});

test("fazer Login com user que não existe", async({page}) =>{
    const invalidUser = createUserData();

    const emailInput = page.locator(`input[data-qa="login-email"]`);
    const passinput = page.locator(`input[data-qa="login-password"]`);

    const buttonLogin = page.locator(`button[data-qa="login-button"]`);

    
    await emailInput.fill(invalidUser.email);
    await passinput.fill(invalidUser.senha);

    await buttonLogin.click();

    await expect(page.getByText(/Your email or password is incorrect!/i)).toBeVisible();

});

test("fazer Login com email e sem senha", async({page}) =>{
    

    const emailInput = page.locator(`input[data-qa="login-email"]`);
    const passinput = page.locator(`input[data-qa="login-password"]`);

    const buttonLogin = page.locator(`button[data-qa="login-button"]`);

    
    await emailInput.fill(user.email);
    

    await buttonLogin.click();

    const validationMessage = await passinput.evaluate(
        (input: HTMLInputElement ) => input.validationMessage
    );
    
    expect(validationMessage).toMatch(/preencha || fill/i);
});

test("fazer Login sem email e com senha", async({page}) =>{
    

    const emailInput = page.locator(`input[data-qa="login-email"]`);
    const passinput = page.locator(`input[data-qa="login-password"]`);

    const buttonLogin = page.locator(`button[data-qa="login-button"]`);

    
    await passinput.fill(user.senha);
    

    await buttonLogin.click();

    const validationMessage = await emailInput.evaluate(
        (input: HTMLInputElement ) => input.validationMessage
    );
    
    expect(validationMessage).toMatch(/preencha || fill/i);
});