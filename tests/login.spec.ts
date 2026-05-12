import { test, expect } from "@playwright/test";
import { createUserData } from "./helpers/users-factory";
import { faker } from "@faker-js/faker";


const user = createUserData();

test.beforeEach(async ({ page }) => {
  await page.goto("https://automationexercise.com/login");
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

test("fazer logout", async({page}) =>{
     const emailInput = page.locator(`input[data-qa="login-email"]`);
    const passinput = page.locator(`input[data-qa="login-password"]`);

    const buttonLogin = page.locator(`button[data-qa="login-button"]`);

    await emailInput.fill("neoma45@hotmail.com");
    await passinput.fill("uMv5hnylwvklhVy");

    await buttonLogin.click();
    await expect(page.getByText(/logged/i)).toBeVisible();

    const logoutButton = page.locator(`a[href="/logout"]`);

    await logoutButton.click();

    const signalSignup = page.locator(`a[href="/login"]`)

    await expect(signalSignup).toHaveText(/signup/i)

})

test("Não deve fazer Login com user que não existe", async({page}) =>{
    const invalidUser = createUserData();

    const emailInput = page.locator(`input[data-qa="login-email"]`);
    const passinput = page.locator(`input[data-qa="login-password"]`);

    const buttonLogin = page.locator(`button[data-qa="login-button"]`);

    
    await emailInput.fill(invalidUser.email);
    await passinput.fill(invalidUser.senha);

    await buttonLogin.click();

    await expect(page.getByText(/Your email or password is incorrect!/i)).toBeVisible();

});

test("Não deve fazer Login com email e sem senha", async({page}) =>{
    

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

test("Não deve fazer Login sem email e com senha", async({page}) =>{
    

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


test("Não deve fazer Login sem email e sem senha", async({page}) =>{
    
    const emailInput = page.locator(`input[data-qa="login-email"]`);
    const passinput = page.locator(`input[data-qa="login-password"]`);

    const buttonLogin = page.locator(`button[data-qa="login-button"]`);

    await buttonLogin.click();

    const validationMessage = await emailInput.evaluate(
        (input: HTMLInputElement ) => input.validationMessage
    );
    
    expect(validationMessage).toMatch(/preencha || fill/i);
});

