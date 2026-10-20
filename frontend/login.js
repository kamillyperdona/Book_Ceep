document.getElementById('formLogin').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  if (email && senha) {
    // Guarda os dados na sessão localmente
    localStorage.setItem('usuario_email', email);
    
    // Redireciona para a página principal (index.html)
    window.location.href = 'index.html';
  }
});

document.getElementById('btnGoogle').addEventListener('click', () => {
  alert('Integração com o Google pode ser configurada futuramente.');
});
