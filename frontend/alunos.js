const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  carregarAlunos();
  setupModal();
  carregarTurmas(); // Carrega as turmas logo ao abrir a página
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
          <div class="subtext-info">Matrícula: ${aluno.matricula || aluno.cgm}</div>
        </div>
      `;
    });
  } catch (error) {
    console.error('Erro ao carregar alunos:', error);
  }
}

// Função para buscar e preencher as turmas de forma dinâmica no <select>
async function carregarTurmas() {
  try {
    const resposta = await fetch(`${API_URL}/turmas`); 
    const dados = await resposta.json();
    
    const selectTurma = document.getElementById('selectTurma');
    if (!selectTurma) return;

    selectTurma.innerHTML = '<option value="" selected disabled>Selecione a turma...</option>';

    const listaTurmas = Array.isArray(dados) ? dados : (dados.turmas || []);

    listaTurmas.forEach(turma => {
      const option = document.createElement('option');
      option.id_turma = turma.id_turma || turma.ID_TURMA;
      option.value = option.id_turma; 
      
      // Abordagem dinâmica: junta automaticamente os campos informativos da turma que vierem do banco
      const sigla = turma.turma || turma.TURMA || '';
      const nome = turma.nome_turma || turma.NOME_TURMA || '';
      const serie = turma.serie || turma.SERIE || '';
      const ano = turma.ano_letivo || turma.ANO_LETIVO || '';

      // Monta o texto de forma limpa, ignorando campos vazios
      let textoExibicao = [sigla, nome, serie ? `(${serie})` : '', ano ? `[${ano}]` : ''].filter(Boolean).join(' - ');
      
      if (!textoExibicao) {
        // Fallback caso os nomes das chaves sejam completamente diferentes
        textoExibicao = Object.values(turma).filter(val => val !== option.value).join(' - ');
      }

      option.textContent = textoExibicao || `Turma ID: ${option.value}`;
      selectTurma.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar turmas:', error);
  }
}

function setupModal() {
  const modal = document.getElementById('modalAluno');
  const btnOpen = document.getElementById('btnOpenModalAluno');
  const btnClose = document.getElementById('btnCloseModalAluno');
  const form = document.getElementById('formCadastrarAluno');

  if (!modal || !btnOpen) return;

  btnOpen.addEventListener('click', () => {
    modal.classList.add('active');
    carregarTurmas(); // Atualiza a lista sempre que o modal abre
  });

  btnClose.addEventListener('click', () => modal.classList.remove('active'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeAluno').value;
    const valorMatricula = document.getElementById('matriculaAluno').value;
    const id_turma = document.getElementById('selectTurma').value; 

    // Enviamos tanto 'matricula' quanto 'cgm' para garantir compatibilidade com o backend
    const payload = {
      nome,
      matricula: valorMatricula,
      cgm: valorMatricula, 
      id_turma
    };

    try {
      const res = await fetch(`${API_URL}/alunos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        modal.classList.remove('active');
        form.reset();
        carregarAlunos();
      } else {
        const erroData = await res.json().catch(() => ({}));
        alert(erroData.error || 'Erro ao cadastrar aluno.');
      }
    } catch (error) {
      alert('Erro de conexão com o servidor.');
    }
  });
}
