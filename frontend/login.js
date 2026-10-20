const API_URL = 'http://localhost:3000/api';

// Alternar visibilidade da senha (com ícones SVG)
document.getElementById('toggleSenha').addEventListener('click', () => {
  const inputSenha = document.getElementById('senha');
  const iconEye = document.getElementById('iconEye');
  const iconEyeOff = document.getElementById('iconEyeOff');
  
  if (inputSenha.type === 'password') {
    inputSenha.type = 'text';
    iconEye.style.display = 'none';
    iconEyeOff.style.display = 'block';
  } else {
    inputSenha.type = 'password';
    iconEye.style.display = 'block';
    iconEyeOff.style.display = 'none';
  }
});

// Envio do formulário de login
document.getElementById('formLogin').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const erroMsg = document.getElementById('mensagemErro');

  try {
    const resposta = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const resultado = await resposta.json();

    if (resposta.ok && resultado.sucess) {
      localStorage.setItem('usuario_logado', JSON.stringify(resultado.usuario));
      window.location.href = 'index.html';
    } else {
      erroMsg.style.display = 'block';
      erroMsg.textContent = resultado.message || 'E-mail ou senha incorretos.';
    }
  } catch (error) {
    erroMsg.style.display = 'block';
    erroMsg.textContent = 'Erro de conexão com o servidor. Verifique se o backend está ativo.';
  }
});

// Lógica do Modal de Recuperação de Senha
const btnEsqueceu = document.getElementById('btnEsqueceuSenha');
const modalRecuperar = document.getElementById('modalRecuperar');
const btnCancelar = document.getElementById('btnCancelarRecuperar');

if (btnEsqueceu && modalRecuperar && btnCancelar) {
  btnEsqueceu.addEventListener('click', () => {
    modalRecuperar.classList.add('active');
  });

  btnCancelar.addEventListener('click', () => {
    modalRecuperar.classList.remove('active');
  });

  document.getElementById('formRecuperar').addEventListener('submit', (e) => {
    e.preventDefault();
    const emailRec = document.getElementById('emailRecuperar').value.trim();
    
    if (emailRec) {
      alert(`Instruções de recuperação enviadas com sucesso para: ${emailRec}`);
      modalRecuperar.classList.remove('active');
      document.getElementById('emailRecuperar').value = '';
    }
  });
}
