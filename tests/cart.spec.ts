import {faker} from "@faker-js/faker"

import {test, expect, Page} from "@playwright/test"

async function addItemToCart(page:Page, productId: number){
   const items = page.locator(`.product-image-wrapper`).filter({
        has: page.locator(`.productinfo a.add-to-cart[data-product-id = "${productId}"]`)
    }).first();

    await expect(items).toBeVisible();


    const addToCartButton = items.locator(
    `.productinfo a.add-to-cart[data-product-id="${productId}"]`
  );

    
    
    await addToCartButton.scrollIntoViewIfNeeded();
    await addToCartButton.click();

    await expect(page.getByText(/Your product has been added to cart./i)).toBeVisible();

}

test.beforeEach(async ({page}) =>{

    await page.goto(`https://automationexercise.com/login`)

    const emailInput = page.locator(`input[data-qa="login-email"]`);
    const passinput = page.locator(`input[data-qa="login-password"]`);

    const buttonLogin = page.locator(`button[data-qa="login-button"]`);

    await emailInput.fill("neoma45@hotmail.com");
    await passinput.fill("uMv5hnylwvklhVy");

    await buttonLogin.click();

    await expect(page.getByText(/logged/i)).toBeVisible()

    

})



test("Adicionando um item no carrinho e verificar se foi adicionado", async({page})=>{
    const productId = 2;
    await page.goto("https://automationexercise.com/products")
    
    
    addItemToCart(page, productId)

    await expect(page.getByText(/Your product has been added to carrinho./i)).toBeVisible();

    await page.goto("https://automationexercise.com/view_cart");

    const cartItem = page.locator(`tr[id="product-${productId}"]`)

    await expect(cartItem).toHaveAttribute( "id", `product-${productId}`,);


})

test("Remover items do carrinho", async({page}) =>{
    await page.goto("https://automationexercise.com/view_cart")

    const buttonDeleteCart = page.locator("a.cart_quantity_delete")

    while (await buttonDeleteCart.count() > 0){
        await buttonDeleteCart.dispatchEvent("click");

    }

    await expect(buttonDeleteCart).toHaveCount(0);
});

