  document.addEventListener("click", function (e) {
    const dropdown = document.getElementById("userDropdown");
    const menu = document.getElementById("userMenu");
    const avatar = document.getElementById("userAvatar");

    if (!dropdown || !menu || !avatar) return;

    // Si haces clic en el avatar
    if (avatar.contains(e.target)) {
      dropdown.classList.toggle("open");
    } else if (!menu.contains(e.target)) {
      // Si haces clic fuera del menú
      dropdown.classList.remove("open");
    }
  });