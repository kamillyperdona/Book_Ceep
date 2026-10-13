document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;

  if (email) {
    // Guarda o email da sessão localmente
    localStorage.setItem('usuario_email', email);
    
    // Redireciona para a página principal / catálogo (index.html)
    window.location.href = 'index.html';
  }
});

document.getElementById('btnGoogle').addEventListener('click', () => {
  alert('Integração com o Google pode ser configurada futuramente.');
});
