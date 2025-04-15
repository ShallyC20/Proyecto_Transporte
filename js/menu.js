//menu.js
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
    const body = document.body;
  
    if (sidebar.classList.contains('show')) {
      sidebar.classList.remove('show');
      body.classList.remove('menu-open');
    } else {
      sidebar.classList.add('show');
      body.classList.add('menu-open');
    }
  }