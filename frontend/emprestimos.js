const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  carregarEmprestimos();
  setupModal();
});

async function carregarEmprestimos() {
  const grid = document.getElementById('gridEmprestimos');
  if (!grid) return;

  try {
    const res = await fetch(`${API_URL}/emprestimos`);
    const emprestimos = await res.json();

    grid.innerHTML = '';

    const cores = ['cover-maroon', 'cover-indigo', 'cover-teal', 'cover-red'];

    if (emprestimos.length === 0) {
      grid.innerHTML = '<p style="grid-column: span 4; color: #666;">Nenhum empréstimo registrado no momento.</p>';
      return;
    }

    emprestimos.forEach((emp, index) => {
      const cor = cores[index % cores.length];

      grid.innerHTML += `
        <div class="book-card">
          <div class="book-cover ${cor}">
            <h3 style="font-size: 1.5rem;">${emp.nome_aluno ? emp.nome_aluno.split(' ')[0] : 'Aluno'}</h3>
          </div>
          <div class="status-tag pendente">• Devolução pendente</div>
          <div class="book-title-text">${emp.nome_aluno || 'Aluno ID: ' + emp.id_aluno}</div>
          <div class="subtext-info">${emp.titulo_livro || 'Livro ID: ' + emp.id_exemplar}</div>
        </div>
      `;
    });
  } catch (error) {
    console.error('Erro ao carregar empréstimos:', error);
  }
}

function setupModal() {
  const modal = document.getElementById('modalEmprestimo');
  const btnOpen = document.getElementById('btnOpenModalEmprestimo');
  const btnClose = document.getElementById('btnCloseModalEmprestimo');
  const form = document.getElementById('formCadastrarEmprestimo');

  if (!modal || !btnOpen) return;

  btnOpen.addEventListener('click', () => modal.classList.add('active'));
  btnClose.addEventListener('click', () => modal.classList.remove('active'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id_aluno = document.getElementById('idAluno').value;
    const id_exemplar = document.getElementById('idExemplar').value;
    const id_funcionario = document.getElementById('idFuncionario').value;

    try {
      const res = await fetch(`${API_URL}/emprestimos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_aluno, id_exemplar, id_funcionario })
      });

      if (res.ok) {
        modal.classList.remove('active');
        form.reset();
        carregarEmprestimos();
      } else {
        alert('Erro ao registrar empréstimo.');
      }
    } catch (error) {
      alert('Erro de conexão com o servidor.');
    }
  });
}
