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

// --- MODAL DE TERMOS DE SERVIÇO E POLÍTICA DE PRIVACIDADE ---
const textoTermos = `
  <h3>1. Aceitação dos Termos</h3>
  <p>Ao utilizar o sistema <strong>BookCeep</strong>, o utilizador declara estar ciente e de acordo com as regras internas de gestão de acervo e empréstimo de livros da biblioteca do CEEP.</p>
  <h3>2. Uso do Sistema</h3>
  <p>O acesso é restrito aos funcionários autorizados. O uso das credenciais é pessoal e intransferível, sendo da responsabilidade do utilizador qualquer ação realizada sob o seu login.</p>
  <h3>3. Finalidade</h3>
  <p>A plataforma destina-se exclusivamente ao controle patrimonial, catálogo de títulos, cadastro de alunos e gestão de empréstimos e devoluções escolares.</p>
`;

const textoPrivacidade = `
  <h3>1. Coleta de Dados</h3>
  <p>O BookCeep armazena exclusivamente informações institucionais necessárias para a gestão escolar, incluindo nome, e-mail institucional, cargo e registos de empréstimos de livros.</p>
  <h3>2. Segurança das Informações</h3>
  <p>Todos os dados cadastrados na base de dados do CEEP são protegidos contra acesso não autorizado e utilizados estritamente para os fins pedagógicos e operacionais da instituição.</p>
  <h3>3. Direitos do Utilizador</h3>
  <p>A equipa da biblioteca tem direito ao acesso, correção e atualização dos seus dados cadastrais mediante solicitação à administração do sistema.</p>
`;

const modalTermos = document.getElementById('modalTermos');
const tituloModalTermos = document.getElementById('tituloModalTermos');
const conteudoModalTermos = document.getElementById('conteudoModalTermos');

document.getElementById('linkTermos')?.addEventListener('click', (e) => {
  e.preventDefault();
  tituloModalTermos.textContent = 'Termos de Serviço';
  conteudoModalTermos.innerHTML = textoTermos;
  modalTermos.classList.add('active');
});

document.getElementById('linkPrivacidade')?.addEventListener('click', (e) => {
  e.preventDefault();
  tituloModalTermos.textContent = 'Política de Privacidade';
  conteudoModalTermos.innerHTML = textoPrivacidade;
  modalTermos.classList.add('active');
});

document.getElementById('btnFecharTermos')?.addEventListener('click', () => {
  modalTermos.classList.remove('active');
});