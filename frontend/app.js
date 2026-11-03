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

document.addEventListener('DOMContentLoaded', async () => {
  const usuarioSalvo = localStorage.getItem('usuarioLogado');
  if (usuarioSalvo) {
    try {
      const funcionario = JSON.parse(usuarioSalvo);
      // Procura o span onde está escrito "Nome do funcionário" no HTML
      const userBadgeSpan = document.querySelector('.user-badge span');
      if (userBadgeSpan && funcionario.nome) {
        userBadgeSpan.textContent = funcionario.nome;
      }
    } catch (e) {
      console.error('Erro ao ler os dados do utilizador:', e);
    }
  } else {
    // Se não houver sessão ativa, redireciona para o login
    window.location.href = 'login.html';
    return;
  }

  carregarEmprestimosPendencias();
});

async function carregarEmprestimosPendencias() {
  const containerEmprestimos = document.getElementById('listaEmprestimosHome');
  if (!containerEmprestimos) return; // Se a tabela não existir nesta página, ignora

  try {
    const resposta = await fetch('http://localhost:3000/api/emprestimos');
    const dados = await resposta.json();

    if (dados.success && dados.emprestimos) {
      // Ordena por data de devolução: da mais próxima (urgente) para a mais distante
      const ordenados = dados.emprestimos.sort((a, b) => new Date(a.data_devolucao) - new Date(b.data_devolucao));

      containerEmprestimos.innerHTML = '';

      ordenados.forEach(emp => {
        const hoje = new Date();
        const dataDev = new Date(emp.data_devolucao);
        const atrasado = dataDev < hoje && emp.status === 'Ativo';

        const linha = document.createElement('tr');
        if (atrasado) {
          linha.style.backgroundColor = '#f8d7da'; // Destaque suave para pendências/atrasos
        }

        linha.innerHTML = `
          <td>${emp.nome_aluno || 'Aluno'}</td>
          <td>${emp.titulo_livro || 'Livro'}</td>
          <td>${new Date(emp.data_emprestimo).toLocaleDateString('pt-BR')}</td>
          <td>${dataDev.toLocaleDateString('pt-BR')}</td>
          <td>${atrasado ? '<strong>Pendente / Atrasado</strong>' : 'Em dia'}</td>
        `;
        containerEmprestimos.appendChild(linha);
      });
    }
  } catch (erro) {
    console.error('Erro ao carregar lista de empréstimos:', errom);
  }
}
