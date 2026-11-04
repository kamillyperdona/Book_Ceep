const API_URL = 'http://localhost:3000/api';

let paginaAtual = 1;
const itensPorPagina = 20;
let listaGlobalLivros = [];

document.addEventListener('DOMContentLoaded', () => {
  // 1. Carregar o nome correto do funcionário logado
  const usuarioSalvo = localStorage.getItem('usuarioLogado');
  if (usuarioSalvo) {
    try {
      const funcionario = JSON.parse(usuarioSalvo);
      const spanNome = document.getElementById('nomeFuncionario');
      if (spanNome && funcionario.nome) {
        spanNome.textContent = funcionario.nome;
      }
    } catch (e) {
      console.error('Erro ao ler utilizador:', e);
    }
  }

  carregarLivros();
  setupBusca();
  setupModal();
});

// --- CARREGAR LIVROS DO BACKEND ---
async function carregarLivros(termo = '') {
  const grid = document.getElementById('gridLivrosCatalogo');
  if (!grid) return;

  try {
    const res = await fetch(`${API_URL}/livros${termo ? `?pesquisa=${encodeURIComponent(termo)}` : ''}`);
    const dados = await res.json();

    if (dados.success) {
      listaGlobalLivros = dados.livros;
      renderizarPagina(1);
      renderizarPaginacao();
    }
  } catch (error) {
    console.error('Erro ao carregar acervo:', error);
  }
}

// --- RENDERIZAR OS CARDS COM ESTOQUE REAL ---
function renderizarPagina(pagina) {
  paginaAtual = pagina;
  const grid = document.getElementById('gridLivrosCatalogo');
  grid.innerHTML = '';

  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const livrosPagina = listaGlobalLivros.slice(inicio, fim);

  // Paleta de cores estéticas estendida
  const classesCapas = [
    'cover-terracotta', 'cover-beige', 'cover-navy', 'cover-sage', 
    'cover-mustard', 'cover-wine', 'cover-forest', 'cover-teal', 'cover-plum'
  ];

  if (livrosPagina.length === 0) {
    grid.innerHTML = '<p style="grid-column: span 3; color: #666; text-align:center;">Nenhum livro encontrado.</p>';
    return;
  }

  livrosPagina.forEach((livro, index) => {
    const corCapa = classesCapas[index % classesCapas.length];
    
    const total = parseInt(livro.total_exemplares) || 0;
    const disponiveis = parseInt(livro.exemplares_disponiveis) || 0;
    const temDisponivel = disponiveis > 0;

    grid.innerHTML += `
      <div class="book-card">
        <button class="btn-excluir-livro" onclick="excluirLivro('${livro.ISBN}')" title="Excluir livro">&times;</button>
        
        <div class="book-cover ${corCapa}">
          <h3>${livro.titulo}</h3>
        </div>
        <div class="book-status" style="color: ${temDisponivel ? '#2e7d32' : '#d32f2f'}">
          ● ${temDisponivel ? `Disponível (${disponiveis}/${total})` : `Indisponível (0/${total})`}
        </div>
        <div class="book-title-text">${livro.titulo}</div>
        <div class="book-author">Ano: ${livro.ano_lancamento || 'N/A'} | ISBN: ${livro.ISBN}</div>
      </div>
    `;
  });
}

// --- FUNÇÃO GLOBAL DE EXCLUSÃO DE LIVRO ---
async function excluirLivro(isbn) {
  if (!confirm('Deseja realmente excluir este livro e todos os seus exemplares do acervo?')) return;

  try {
    // Note o uso de ${API_URL} para garantir que vá para http://localhost:3000/api/livros/...
    const res = await fetch(`${API_URL}/livros/${isbn}`, {
      method: 'DELETE'
    });
    
    const resultado = await res.json();

    if (res.ok && resultado.success) {
      carregarLivros(); // Recarrega o catálogo atualizado
    } else {
      alert(resultado.message || 'Erro ao excluir o livro.');
    }
  } catch (error) {
    console.error('Erro na requisição de exclusão:', error);
    alert('Erro de conexão com o servidor.');
  }
}

// --- GERADOR DINÂMICO DE BOTÕES DE PAGINAÇÃO ---
function renderizarPaginacao() {
  const container = document.getElementById('paginacaoContainer');
  if (!container) return;

  const totalPaginas = Math.ceil(listaGlobalLivros.length / itensPorPagina);
  container.innerHTML = '';

  if (totalPaginas <= 1) return;

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement('button');
    btn.className = `btn-page ${i === paginaAtual ? 'active' : ''}`;
    btn.textContent = i;
    btn.addEventListener('click', () => {
      renderizarPagina(i);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    container.appendChild(btn);
  }
}

// --- CONFIGURAR BOTÃO DE CONSULTAR/BUSCA POR TÍTULO ---
function setupBusca() {
  const btnConsultar = document.getElementById('btnConsultar');
  const inputBusca = document.getElementById('inputBusca');

  if (!btnConsultar || !inputBusca) return;

  btnConsultar.addEventListener('click', () => {
    carregarLivros(inputBusca.value.trim());
  });

  inputBusca.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      carregarLivros(inputBusca.value.trim());
    }
  });
}

// --- CONTROLE DO MODAL DE CADASTRO ---
function setupModal() {
  const modal = document.getElementById('modalLivro');
  const btnOpen = document.getElementById('btnOpenModal');
  const btnClose = document.getElementById('btnCloseModal');
  const form = document.getElementById('formCadastrarLivro');

  if (!modal || !btnOpen) return;

  btnOpen.addEventListener('click', () => modal.classList.add('active'));
  btnClose.addEventListener('click', () => modal.classList.remove('active'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const titulo = document.getElementById('tituloLivro').value;
    const isbn = document.getElementById('isbnLivro').value;
    const ano_lancamento = document.getElementById('anoLivro').value;
    const quantidade_exemplares = document.getElementById('qtdExemplares').value;

    try {
      const res = await fetch(`${API_URL}/livros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, isbn, ano_lancamento, quantidade_exemplares })
      });

      const resultado = await res.json();

      if (res.ok && resultado.success) {
        modal.classList.remove('active');
        form.reset();
        carregarLivros();
      } else {
        alert(resultado.message || 'Erro ao cadastrar o livro. Verifique os dados.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão com o servidor.');
    }
  });
}
