const checkoutForm = document.getElementById("checkout-form");
const confirmationPopup = document.getElementById("confirmation-popup");
const confirmButton = document.getElementById("confirm-button");
const cancelButton = document.getElementById("cancel-button");
const overlay = document.getElementById("overlay");

function showConfirmationPopup() {
  confirmationPopup.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function hideConfirmationPopup() {
  confirmationPopup.classList.add("hidden");
  overlay.classList.add("hidden");
}

checkoutForm.addEventListener("submit", function (event) {
  event.preventDefault();
  showConfirmationPopup();
});

confirmButton.addEventListener("click", function () {
  checkoutForm.submit();
});

cancelButton.addEventListener("click", function () {
  hideConfirmationPopup();
});
