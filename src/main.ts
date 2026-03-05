import './style.css'

const STORAGE_KEY = 'sidebar-collapsed'

const sidebar = document.getElementById('sidebar')
const toggleBtn = document.getElementById('sidebar-toggle')

if (sidebar && toggleBtn) {
  // Restore persisted collapse state
  if (localStorage.getItem(STORAGE_KEY) === 'true') {
    sidebar.classList.add('collapsed')
  }

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed')
    localStorage.setItem(
      STORAGE_KEY,
      String(sidebar.classList.contains('collapsed'))
    )
  })
}

