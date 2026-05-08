import {test, expect} from "@playwright/test"
import {faker} from "@faker-js/faker"

const nomeValid = faker.person.fullName();
const emailValid = faker.internet.email().toLowerCase()
test.beforeEach(async ({page}) => {
    await page.goto("https://automationexercise.com/login")
    
    

})

test("Criar User", async({page})=> {
    
    

    const nomeInput = page.locator(`input[data-qa="signup-name"]`)
    const emailInput = page.locator(`input[type="email"][data-qa="signup-email"]`)
    const buttonSubmit = page.locator(`button[type="submit"][data-qa="signup-button"]`)
    await nomeInput.fill(nomeValid);
    await emailInput.fill(emailValid);
    await buttonSubmit.click();

    await expect(nomeInput).toHaveValue(nomeValid);
    await expect(emailInput).toHaveValue(emailValid);
    await expect(page).toHaveURL(/signup/i)


})



