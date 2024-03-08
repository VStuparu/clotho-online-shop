const addToCartButtonElement = document.querySelector(
  ".details-buttons-container button"
);

const cartBadgeElement = document.querySelector(".nav-items .badge");

async function addToCart() {
  const productId = addToCartButtonElement.dataset.productid;
  let response;
  try {
    response = await fetch("/cart/items", {
      method: "POST",
      body: JSON.stringify({
        productId: productId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
    return;
  }

  if (!response.ok) {
    console.log(response);
    alert("Something went wrong!");
    return;
  }

  const responseData = await response.json();

  // console.log(responseData);

  const newTotalQuantity = responseData.newTotalItems;

  cartBadgeElement.textContent = newTotalQuantity;
  // console.log(newTotalQuantity);
}

addToCartButtonElement.addEventListener("click", addToCart);
