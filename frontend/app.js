const API_URL = 'http://localhost:3000/api';

// Executa assim que a página carrega
document.addEventListener('DOMContentLoaded', () => {
  carregarTurmas();
  carregarAlunos();
});

// --- FUNÇÕES DE TURMA ---
async function carregarTurmas() {
  try {
    const res = await fetch(`${API_URL}/turmas`);
    const turmas = await res.json();
    const lista = document.getElementById('listaTurmas');
    lista.innerHTML = '';

    turmas.forEach(t => {
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';

      li.innerHTML = `
        <span>ID: ${t.id} - Nome: ${t.nome}</span>
        <button onclick="deletarTurma(${t.id})" class="btn-delete">Excluir</button>
      `;
      lista.appendChild(li);
    });
  } catch (error) {
    console.error('Erro ao carregar turmas:', error);
  }
}

async function deletarTurma(id) {
  if (confirm('Deseja realmente apagar esta turma?')) {
    try {
      const res = await fetch(`${API_URL}/turmas/${id}`, { method: 'DELETE' });
      if (res.ok) carregarTurmas();
    } catch (error) {
      alert('Erro ao apagar turma.');
    }
  }
}

document.getElementById('formTurma').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nomeTurma').value;

  try {
    const res = await fetch(`${API_URL}/turmas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome })
    });

    if (res.ok) {
      document.getElementById('nomeTurma').value = '';
      carregarTurmas();
    }
  } catch (error) {
    alert('Erro ao cadastrar turma.');
  }
});

// --- FUNÇÕES DE ALUNO ---
async function carregarAlunos() {
  try {
    const res = await fetch(`${API_URL}/alunos`);
    const alunos = await res.json();
    const lista = document.getElementById('listaAlunos');
    lista.innerHTML = '';

    alunos.forEach(a => {
      const li = document.createElement('li');
      li.textContent = `Matrícula: ${a.matricula} | Nome: ${a.nome} | Turma: ${a.nome_turma || a.id_turma}`;
      lista.appendChild(li);
    });
  } catch (error) {
    console.error('Erro ao carregar alunos:', error);
  }
}

document.getElementById('formAluno').addEventListener('submit', async (e) => {
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
      document.getElementById('nomeAluno').value = '';
      document.getElementById('matriculaAluno').value = '';
      document.getElementById('idTurmaAluno').value = '';
      carregarAlunos();
    }
  } catch (error) {
    alert('Erro ao cadastrar aluno.');
  }
});
