const API_URL = 'http://localhost:3000/api';
let listaAlunosCache = [];

document.addEventListener('DOMContentLoaded', () => {
  carregarAlunos();
  setupModal();
  setupBusca();
});

// Função para mapear as cores das capas baseada no curso
function obterClasseCorPorCurso(nomeCurso = '', turmaSigla = '') {
  const texto = (String(nomeCurso) + ' ' + String(turmaSigla)).toLowerCase();
  
  if (texto.includes('desenvolvimento de sistemas') || texto.includes('ads') || texto.includes('dam') || texto.includes('º d')) {
    return 'cover-ads';          // Azul
  } else if (texto.includes('biotecnologia') || texto.includes('biotec') || texto.includes('º b')) {
    return 'cover-biotec';       // Verde Esmeralda
  } else if (texto.includes('edificações') || texto.includes('edif') || texto.includes('º c')) {
    return 'cover-edif';         // Terracota
  } else if (texto.includes('eletromecânica') || texto.includes('º e')) {
    return 'cover-eletromec';    // Azul Aço
  } else if (texto.includes('eletrônica') || texto.includes('º n')) {
    return 'cover-eletronica';   // Laranja
  } else if (texto.includes('farmácia') || texto.includes('º f')) {
    return 'cover-farmacia';     // Verde Água
  } else if (texto.includes('manutenção automotiva') || texto.includes('º z')) {
    return 'cover-automotiva';   // Cinza Grafite
  } else if (texto.includes('mecânica') || texto.includes('º w')) {
    return 'cover-mecanica';     // Vermelho
  } else if (texto.includes('meio ambiente') || texto.includes('º m')) {
    return 'cover-ambiente';     // Verde Oliva
  } else if (texto.includes('jogos digitais') || texto.includes('º j')) {
    return 'cover-jogos';        // Roxo Criativo
  } else if (texto.includes('química') || texto.includes('º q')) {
    return 'cover-quimica';      // Amarelo Ouro
  }
  
  return 'cover-default';        
}

async function carregarAlunos() {
  const grid = document.getElementById('gridAlunos');
  if (!grid) return;

  try {
    const res = await fetch(`${API_URL}/alunos`);
    listaAlunosCache = await res.json();
    renderizarGrid(listaAlunosCache);
  } catch (error) {
    console.error('Erro ao carregar alunos:', error);
  }
}

  function renderizarGrid(alunos) {
  const grid = document.getElementById('gridAlunos');
  if (!grid) return;
  
  grid.innerHTML = '';

  if (!alunos || alunos.length === 0) {
    grid.innerHTML = '<p style="grid-column: span 4; color: #666; font-size: 14px;">Nenhum aluno encontrado.</p>';
    return;
  }

  alunos.forEach((aluno) => {
    const siglaTurma = aluno.turma || aluno.nome_turma || 'Turma';
    const nomeCurso = aluno.nome_turma || '';
    
    // CORREÇÃO: Utiliza a função inteligente baseada no curso/turma do CEEP
    const corClasse = obterClasseCorPorCurso(nomeCurso, siglaTurma);
    const identificador = aluno.cgm || aluno.matricula || 'N/A';

    const card = document.createElement('div');
    card.className = 'book-card';
    card.onclick = () => abrirModalEdicao(aluno);

    card.innerHTML = `
      <div class="book-cover ${corClasse}" style="position: relative; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; text-align: center; height: 240px; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); cursor: pointer;">
        <!-- Botão de fechar/editar idêntico ao módulo de livros -->
        <button type="button" title="Editar aluno" onclick="event.stopPropagation(); abrirModalEdicao(${JSON.stringify(aluno).replace(/"/g, '&quot;')});" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.3); border: none; color: white; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px;">✕</button>
        
        <h3 style="font-size: 1.15rem; text-transform: uppercase; color: #ffffff !important; margin: 0; font-family: 'Playfair Display', serif; line-height: 1.3; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">
          ${aluno.nome}
        </h3>
      </div>
      <div class="book-title-text" style="margin-top: 8px; font-weight: 600; color: #2c3e50;">Turma: ${siglaTurma}</div>
      <div class="subtext-info" style="font-size: 13px; color: #666;">CGM: ${identificador}</div>
    `;

    grid.appendChild(card);
  });
}

// Busca instantânea a cada letra digitada
function setupBusca() {
  const inputBusca = document.getElementById('inputBuscaAluno');
  if (!inputBusca) return;

  inputBusca.addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase().trim();
    const filtrados = listaAlunosCache.filter(aluno => {
      const nome = (aluno.nome || '').toLowerCase();
      const cgm = String(aluno.matricula || aluno.cgm || '');
      return nome.includes(termo) || cgm.includes(termo);
    });
    renderizarGrid(filtrados);
  });
}

async function carregarTurmas(selectElementId = 'selectTurma') {
  try {
    const resposta = await fetch(`${API_URL}/turmas`);
    const dados = await resposta.json();
    const select = document.getElementById(selectElementId);
    if (!select) return;

    select.innerHTML = '<option value="" selected disabled>Selecione a turma...</option>';
    const listaTurmas = Array.isArray(dados) ? dados : (dados.turmas || []);

    listaTurmas.forEach(turma => {
      const option = document.createElement('option');
      const id = turma.id_turma || turma.ID_TURMA;
      option.value = id;

      const sigla = turma.turma || '';
      const nome = turma.nome_turma || '';
      const serie = turma.serie || '';

      option.textContent = `${sigla} - ${nome} (${serie})`.trim();
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar turmas:', error);
  }
}

function abrirModalEdicao(aluno) {
  const modal = document.getElementById('modalEditarAluno');
  
  // Pega qualqer campo identificador disponível no objeto do aluno
  const identificadorUnico = aluno.cgm || aluno.matricula || aluno.id_aluno || aluno.id;
  
  document.getElementById('editIdAluno').value = identificadorUnico;
  document.getElementById('editNomeAluno').value = aluno.nome;
  document.getElementById('editMatriculaAluno').value = aluno.cgm || aluno.matricula;

  carregarTurmas('editSelectTurma').then(() => {
    if (aluno.id_turma) {
      document.getElementById('editSelectTurma').value = aluno.id_turma;
    }
  });

  modal.classList.add('active');
}

function setupModal() {
  const modalCad = document.getElementById('modalAluno');
  const btnOpenCad = document.getElementById('btnOpenModalAluno');
  const btnCloseCad = document.getElementById('btnCloseModalAluno');
  const formCad = document.getElementById('formCadastrarAluno');

  const modalEdit = document.getElementById('modalEditarAluno');
  const btnCloseEdit = document.getElementById('btnCloseModalEditar');
  const formEdit = document.getElementById('formEditarAluno');
  const btnDeletar = document.getElementById('btnDeletarAluno');

  // Modal Cadastro
  btnOpenCad.addEventListener('click', () => {
    modalCad.classList.add('active');
    carregarTurmas('selectTurma');
  });
  btnCloseCad.addEventListener('click', () => modalCad.classList.remove('active'));

  formCad.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nomeAluno').value;
    const cgm = document.getElementById('matriculaAluno').value;
    const id_turma = document.getElementById('selectTurma').value;

    if (cgm.length !== 10 || !/^\d+$/.test(cgm)) {
      alert('O CGM deve conter exatamente 10 números!');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/alunos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cgm, matricula: cgm, id_turma })
      });

      if (res.ok) {
        modalCad.classList.remove('active');
        formCad.reset();
        carregarAlunos();
      } else {
        const err = await res.json();
        alert(err.error || 'Erro ao cadastrar aluno.');
      }
    } catch (error) {
      alert('Erro de conexão com o servidor.');
    }
  });

  // Modal Edição
  // Deletar Aluno com depuração no console
  btnDeletar.addEventListener('click', async () => {
    const cgm = document.getElementById('editIdAluno').value;
    console.log("ID/CGM enviado para exclusão:", cgm); // Vê isto na consola do navegador (F12)

    if (!cgm) {
      alert('Erro: O ID ou CGM do aluno está vazio!');
      return;
    }

    if (confirm(`Tem certeza de que deseja remover este aluno?`)) {
      try {
        const urlCompleta = `${API_URL}/alunos/${cgm}`;
        console.log("Fazendo fetch para:", urlCompleta);

        const res = await fetch(urlCompleta, { method: 'DELETE' });
        
        console.log("Status da resposta:", res.status);
        
        if (res.ok) {
          modalEdit.classList.remove('active');
          carregarAlunos();
        } else {
          const erroServidor = await res.json();
          alert('Erro do servidor: ' + (erroServidor.error || 'Desconhecido'));
        }
      } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro de conexão com a API.');
      }
    }
  });  

  // Deletar Aluno
  // Deletar Aluno
  btnDeletar.addEventListener('click', async () => {
    const cgm = document.getElementById('editIdAluno').value;
    
    if (confirm(`Tem certeza de que deseja remover este aluno?`)) {
      try {
        const res = await fetch(`${API_URL}/alunos/${cgm}`, { method: 'DELETE' });
        
        // Se a resposta for bem-sucedida, fecha o modal e atualiza a grid na hora
        if (res.ok) {
          modalEdit.classList.remove('active');
          carregarAlunos();
        } else {
          const erroServidor = await res.json();
          alert('Erro ao excluir aluno: ' + (erroServidor.error || 'Erro desconhecido'));
        }
      } catch (error) {
        console.error('Erro de conexão:', error);
      }
    }
  });
}
