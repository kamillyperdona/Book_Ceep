const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  carregarLivros();
  setupModal();
});

// --- CARREGAR LIVROS DO BACKEND MYSQL ---
async function carregarLivros() {
  const grid = document.getElementById('gridLivrosCatalogo');
  if (!grid) return;

  try {
    const res = await fetch(`${API_URL}/livros`);
    const livros = await res.json();

    grid.innerHTML = '';

    const classesCapas = ['cover-red', 'cover-beige', 'cover-blue', 'cover-navy'];

    if (livros.length === 0) {
      grid.innerHTML = '<p style="grid-column: span 3; color: #666;">Nenhum livro encontrado no acervo.</p>';
      return;
    }

    livros.forEach((livro, index) => {
      const corCapa = classesCapas[index % classesCapas.length];

      grid.innerHTML += `
        <div class="book-card">
          <div class="book-cover ${corCapa}">
            <h3>${livro.titulo}</h3>
          </div>
          <div class="book-status">• Disponível para empréstimo</div>
          <div class="book-title-text">${livro.titulo}</div>
          <div class="book-author">Ano: ${livro.ano_publicacao || 'N/A'}</div>
        </div>
      `;
    });
  } catch (error) {
    console.error('Erro ao carregar acervo de livros:', error);
  }
}

// --- CONTROLE DO MODAL DE CADASTRO DE LIVROS ---
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
    const ano_publicacao = document.getElementById('anoLivro').value;

    try {
      const res = await fetch(`${API_URL}/livros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, isbn, ano_publicacao })
      });

      if (res.ok) {
        modal.classList.remove('active');
        form.reset();
        carregarLivros(); // Recarrega a lista dinamicamente!
      } else {
        alert('Erro ao cadastrar o livro.');
      }
    } catch (error) {
      alert('Erro de conexão com o servidor.');
    }
  });
}
