const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  carregarRecomendados();
});

async function carregarRecomendados() {
  const grid = document.getElementById('gridRecomendados');
  if (!grid) return;

  try {
    const res = await fetch(`${API_URL}/livros`);
    const livros = await res.json();

    grid.innerHTML = '';

    // Mapeamento de capas estilizadas para os livros
    const classesCapas = ['cover-red', 'cover-beige', 'cover-blue', 'cover-navy'];

    if (livros.length === 0) {
      grid.innerHTML = '<p style="grid-column: span 4; color: #666;">Nenhum livro cadastrado no momento.</p>';
      return;
    }

    livros.slice(0, 4).forEach((livro, index) => {
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
    console.error('Erro ao carregar recomendados:', error);
  }
}
