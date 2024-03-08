const mobileButtonElement = document.getElementById("mobile-menu-btn");
const mobileMenuElement = document.getElementById("mobile-menu");

function toggleMobileMenu() {
  mobileMenuElement.classList.toggle("open");
}

mobileButtonElement.addEventListener("click", toggleMobileMenu);
