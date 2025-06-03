document.addEventListener("DOMContentLoaded", () => {
  fetch("/components/Rental_Payments/loader/loader.html")
    .then((res) => res.text())
    .then((html) => {
      const container = document.createElement("div");
      container.innerHTML = html;
      document.body.insertBefore(container, document.body.firstChild);
    });
});