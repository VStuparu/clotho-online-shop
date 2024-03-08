const cartItemUpdateFormElements = document.querySelectorAll(
  ".cart-item-management"
);
const cartTotalPriceElement = document.getElementById("cart-total-price");
const cartBadge = document.querySelector(".nav-items .badge");

async function updateCartItem(event) {
  event.preventDefault();

  const form = event.target;

  const productId = form.dataset.productid;
  const quantity = form.firstElementChild.value;
  let response;

  try {
    response = await fetch("/cart/items", {
      method: "PATCH",
      body: JSON.stringify({
        productId: productId,
        quantity: quantity,
      }),

      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return;
  }

  if (!response.ok) {
    alert("something went wrong");
    return;
  }

  const responseData = await response.json();

  console.log(responseData);

  if (responseData.updatedCartData.updatedItemPrice === 0) {
    responseData.updatedCartData.newTotalQuantity = 0;
    form.parentElement.parentElement.remove();
  } else {
    const cartItemTotalPriceElement =
      document.querySelector(".cart-item-total");
    cartItemTotalPriceElement.textContent =
      responseData.updatedCartData.updatedItemPrice.toFixed(2);
  }

  cartTotalPriceElement.textContent =
    responseData.updatedCartData.newTotalPrice.toFixed(2);

  cartBadge.textContent = responseData.updatedCartData.newTotalQuantity || "0";
  // responseData.updatedCartData.newTotalQuantity = 0;
}

for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener("submit", updateCartItem);
}
