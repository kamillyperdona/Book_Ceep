const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  carregarAlunos();
  setupModal();
});

async function carregarAlunos() {
  const grid = document.getElementById('gridAlunos');
  if (!grid) return;

  try {
    const res = await fetch(`${API_URL}/alunos`);
    const alunos = await res.json();

    grid.innerHTML = '';

    const cores = ['cover-maroon', 'cover-indigo', 'cover-teal', 'cover-red'];

    if (alunos.length === 0) {
      grid.innerHTML = '<p style="grid-column: span 4; color: #666;">Nenhum aluno cadastrado.</p>';
      return;
    }

    alunos.forEach((aluno, index) => {
      const cor = cores[index % cores.length];

      grid.innerHTML += `
        <div class="book-card">
          <div class="book-cover ${cor}">
            <h3 style="font-size: 1.1rem; text-transform: uppercase;">TURMA ${aluno.nome_turma || '3DAM'}</h3>
          </div>
          <div class="book-title-text" style="margin-top: 8px;">${aluno.nome}</div>
          <div class="subtext-info">Matrícula: ${aluno.matricula}</div>
        </div>
      `;
    });
  } catch (error) {
    console.error('Erro ao carregar alunos:', error);
  }
}

function setupModal() {
  const modal = document.getElementById('modalAluno');
  const btnOpen = document.getElementById('btnOpenModalAluno');
  const btnClose = document.getElementById('btnCloseModalAluno');
  const form = document.getElementById('formCadastrarAluno');

  if (!modal || !btnOpen) return;

  btnOpen.addEventListener('click', () => modal.classList.add('active'));
  btnClose.addEventListener('click', () => modal.classList.remove('active'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeAluno').value;
    const matricula = document.getElementById('matriculaAluno').value;
    const id_turma = document.getElementById('idTurmaAluno').value;

    try {
      const res = await fetch(`${API_URL}/alunos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, matricula, id_turma })
      });

      if (res.ok) {
        modal.classList.remove('active');
        form.reset();
        carregarAlunos();
      } else {
        alert('Erro ao cadastrar aluno.');
      }
    } catch (error) {
      alert('Erro de conexão com o servidor.');
    }
  });
}
