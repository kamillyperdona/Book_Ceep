const API_URL = 'http://localhost:3000/api';

let paginaAtual = 1;
const itensPorPagina = 12;
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

// --- RENDERIZAR OS CARDS COM CLIQUE PARA DETALHES ---
function renderizarPagina(pagina) {
  paginaAtual = pagina;
  const grid = document.getElementById('gridLivrosCatalogo');
  grid.innerHTML = '';

  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const livrosPagina = listaGlobalLivros.slice(inicio, fim);

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

    // Convertemos o objeto do livro para string segura para passar no clique
    const livroJson = encodeURIComponent(JSON.stringify(livro));

    grid.innerHTML += `
      <div class="book-card" style="cursor: pointer;" onclick="abrirDetalhesLivro(JSON.parse(decodeURIComponent('${livroJson}')))">
        <button class="btn-excluir-livro" onclick="event.stopPropagation(); excluirLivro('${livro.ISBN}')" title="Excluir livro">&times;</button>
        
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

// --- ABRIR MODAL DE DETALHES/EDIÇÃO ---
function abrirDetalhesLivro(livro) {
  const modal = document.getElementById('modalDetalhesLivro');
  if (!modal) return;

  document.getElementById('editIsbn').value = livro.ISBN;
  document.getElementById('editTitulo').value = livro.titulo || '';
  document.getElementById('editAno').value = livro.ano_lancamento || '';
  document.getElementById('editIdioma').value = livro.idioma || '';
  
  // GARANTA QUE ESTA LINHA ESTÁ EXATAMENTE ASSIM:
  document.getElementById('editSinopse').value = livro.sinopse || '';
  
  document.getElementById('editNovosExemplares').value = 0;

  modal.classList.add('active');
}

// Fechar modal de detalhes
document.addEventListener('DOMContentLoaded', () => {
  const modalDetalhes = document.getElementById('modalDetalhesLivro');
  const btnCloseDetalhes = document.getElementById('btnCloseDetalhes');
  const formEditar = document.getElementById('formEditarLivro');

  if (btnCloseDetalhes) {
    btnCloseDetalhes.addEventListener('click', () => modalDetalhes.classList.remove('active'));
  }

  if (formEditar) {
    formEditar.addEventListener('submit', async (e) => {
      e.preventDefault();

      const isbn = document.getElementById('editIsbn').value;
      const titulo = document.getElementById('editTitulo').value;
      const ano_lancamento = document.getElementById('editAno').value;
      const idioma = document.getElementById('editIdioma').value;
      const sinopse = document.getElementById('editSinopse').value;
      const novos_exemplares = document.getElementById('editNovosExemplares').value;

      try {
        const res = await fetch(`${API_URL}/livros/${isbn}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ titulo, ano_lancamento, idioma, sinopse, novos_exemplares })
        });

        const resultado = await res.json();

        if (res.ok && resultado.success) {
          modalDetalhes.classList.remove('active');
          carregarLivros(); // Atualiza a listagem na tela
        } else {
          alert(resultado.message || 'Erro ao atualizar o livro.');
        }
      } catch (error) {
        console.error('Erro ao atualizar:', error);
        alert('Erro de conexão com o servidor.');
      }
    });
  }
});

// --- FUNÇÃO GLOBAL DE EXCLUSÃO DE LIVRO ---
async function excluirLivro(isbn) {
  if (!confirm('Deseja realmente excluir este livro e todos os seus exemplares do acervo?')) return;

  try {
    const res = await fetch(`${API_URL}/livros/${isbn}`, {
      method: 'DELETE'
    });
    
    const resultado = await res.json();

    if (res.ok && resultado.success) {
      carregarLivros(); // Recarrega o catálogo atualizado na tela
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
    const containerPaginacao = document.getElementById('paginacao'); // substitua pelo ID do container de paginação no seu HTML
    if (!containerPaginacao) return;
    
    containerPaginacao.innerHTML = '';
    const totalPaginas = Math.ceil(listaGlobalLivros.length / itensPorPagina);

    for (let i = 1; i <= totalPaginas; i++) {
      const btn = document.createElement('button');
      
      // AQUI ESTÁ O SEGREDO: Adiciona a classe 'active' apenas se for a página atual
      btn.className = `btn-page ${i === paginaAtual ? 'active' : ''}`;
      
      btn.innerText = i;
      btn.onclick = () => {
        renderizarPagina(i);
        renderizarPaginacao(); // Reenha os botões para atualizar qual está ativo
      };
      
      containerPaginacao.appendChild(btn);
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
