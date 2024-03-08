const deleteProductButtonsElements =
  document.querySelectorAll(".overlay button");

async function deleteProduct(event) {
  const buttonElement = event.target;
  // console.log(buttonElement);
  const productId = buttonElement.dataset.productid;
  let response;

  try {
    response = await fetch(`/admin/products/${productId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.log(error);
  }

  if (!response.ok) {
    alert("Something went wrong!");
    return;
  }

  buttonElement.parentElement.parentElement.parentElement.remove();
}

for (const deleteProductButtonElement of deleteProductButtonsElements) {
  deleteProductButtonElement.addEventListener("click", deleteProduct);
  console.log(deleteProductButtonElement);
}
