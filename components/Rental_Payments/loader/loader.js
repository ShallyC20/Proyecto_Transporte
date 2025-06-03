window.addEventListener("load", () => {
  const duration = window.loaderDuration || 2000; // Usa 2000ms si no se define
  setTimeout(() => {
    const loader = document.getElementById("loader");
    const content = document.getElementById("main-content");
    if (loader) loader.style.display = "none";
    if (content) content.style.display = "block";
  }, duration);
});