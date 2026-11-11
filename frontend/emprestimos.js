const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  carregarEmprestimos();
  setupModalEmprestimo();
});

// --- CARREGAR EMPRÉSTIMOS DO BACKEND ---
async function carregarEmprestimos() {
  const grid = document.getElementById('gridEmprestimos');
  if (!grid) return;

  try {
    const res = await fetch(`${API_URL}/emprestimos`);
    const dados = await res.json();
    const emprestimos = Array.isArray(dados) ? dados : (dados.emprestimos || dados.data || []);

    grid.innerHTML = ''; 
    const cores = ['cover-terracotta', 'cover-beige', 'cover-navy', 'cover-sage', 'cover-mustard'];

    if (emprestimos.length === 0) {
      grid.innerHTML = '<p style="color: #666; font-size: 1rem; padding: 20px;">Nenhum empréstimo registrado no momento.</p>';
      return;
    }

    emprestimos.forEach((emp, index) => {
      const cor = cores[index % cores.length];
      
      let dataFormatada = 'Pendente';
      let dataPrevista = null;

      if (emp.data_devolucao_prevista) {
        dataPrevista = new Date(emp.data_devolucao_prevista);
        dataFormatada = String(dataPrevista.getDate()).padStart(2, '0') + '/' + 
                        String(dataPrevista.getMonth() + 1).padStart(2, '0') + '/' + 
                        dataPrevista.getFullYear();
      }

      // Lógica de Datas para as Cores
      const hoje = new Date();
      hoje.setHours(0,0,0,0);
      if (dataPrevista) dataPrevista.setHours(0,0,0,0);

      let tagCor = '';
      let tagTexto = `• Devolução: ${dataFormatada}`;
      let acaoClick = '';
      let opacidade = '1';

      if (emp.data_devolucao_real || emp.status === 'concluido') {
        tagCor = 'background-color: #e2e8f0; color: #475569;'; // Cinza (Devolvido)
        tagTexto = '• Devolvido';
        opacidade = '0.5'; // Deixa o card apagadinho
      } else if (dataPrevista && hoje > dataPrevista) {
        tagCor = 'background-color: #fee2e2; color: #ef4444; border: 1px solid #fca5a5;'; // Vermelho (Atrasado)
        tagTexto = `• Atrasado: ${dataFormatada}`;
        acaoClick = `onclick="registrarDevolucao(${emp.id})" style="cursor: pointer;" title="Clique para devolver"`;
      } else {
        tagCor = 'background-color: #dcfce3; color: #16a34a; border: 1px solid #86efac;'; // Verde (No prazo)
        acaoClick = `onclick="registrarDevolucao(${emp.id})" style="cursor: pointer;" title="Clique para devolver"`;
      }

      grid.innerHTML += `
        <div class="book-card" ${acaoClick} style="opacity: ${opacidade}; transition: all 0.2s ease;">
          <div class="book-cover ${cor}" style="display: flex; align-items: center; justify-content: center; text-align: center;">
            <h3 style="font-size: 1.3rem; margin: 0; padding: 0 10px;">${emp.nome_aluno ? emp.nome_aluno.split(' ')[0] : 'Aluno'}</h3>
          </div>
          <div class="status-tag" style="border-radius: 6px; padding: 4px 8px; font-size: 0.75rem; font-weight: 600; width: fit-content; margin-bottom: 8px; ${tagCor}">${tagTexto}</div>
          <div class="book-title-text">${emp.nome_aluno || 'Aluno (ID: ' + emp.id_aluno + ')'}</div>
          <div class="subtext-info">${emp.titulo_livro || 'Livro (Cód: ' + emp.id_exemplar + ')'}</div>
        </div>
      `;
    });
  } catch (error) {
    console.error('Erro ao carregar empréstimos:', error);
  }
}

// --- FUNÇÃO PARA DEVOLVER CLICANDO NO CARD ---
window.registrarDevolucao = async function(idEmprestimo) {
  if (!confirm('Deseja registrar a devolução deste livro?')) return;

  try {
    const res = await fetch(`${API_URL}/emprestimos/${idEmprestimo}/devolver`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    const dados = await res.json();
    
    if (res.ok && dados.success) {
      carregarEmprestimos(); // Recarrega os cards atualizados
    } else {
      alert(dados.message || 'Erro ao registrar devolução.');
    }
  } catch (erro) {
    console.error('Erro de conexão:', erro);
    alert('Erro de comunicação com o servidor.');
  }
};

// --- CONTROLE DO MODAL DE EMPRÉSTIMO ---
function setupModalEmprestimo() {
  const modal = document.getElementById('modalEmprestimo');
  const btnOpen = document.getElementById('btnOpenModal');
  const btnClose = document.getElementById('btnCloseModalEmprestimo');
  const form = document.getElementById('formCadastrarEmprestimo');

  if (!modal || !btnOpen) return;

  btnOpen.addEventListener('click', () => {
    modal.classList.add('active');
    preencherDatasAutomaticas();
    carregarAlunosEExemplares(); // Carrega os selects ao abrir o modal
  });

  if (btnClose) {
    btnClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

// Envio do formulário de novo empréstimo
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const id_aluno = document.getElementById('selectAluno').value;
      const id_exemplar = document.getElementById('selectLivro').value;
      
      // Pega o ID do funcionário logado (ou define 1 caso não esteja salvo no localStorage)
      let id_funcionario = 1;
      const usuarioSalvo = localStorage.getItem('usuarioLogado');
      if (usuarioSalvo) {
        try {
          const func = JSON.parse(usuarioSalvo);
          id_funcionario = func.id || func.id_funcionario || 1;
        } catch (e) {
          console.error('Erro ao ler utilizador:', e);
        }
      }

      if (!id_aluno || !id_exemplar) {
        alert('Selecione um aluno e um livro válidos.');
        return;
      }

      try {
        const res = await fetch(`${API_URL}/emprestimos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_aluno, id_exemplar, id_funcionario })
        });

        const resultado = await res.json();

        if (res.ok && resultado.success) {
          modal.classList.remove('active');
          form.reset();
          carregarEmprestimos();
        } else {
          alert(resultado.message || 'Erro ao registrar empréstimo.');
        }
      } catch (error) {
        console.error('Erro ao salvar empréstimo:', error);
        alert('Erro de conexão com o servidor.');
      }
    });
  }
}

// --- PREENCHER DATAS AUTOMÁTICAS (CORRIGIDO PARA 2 MESES) ---
function preencherDatasAutomaticas() {
  const hoje = new Date();
  const devolucao = new Date();
  
  // Adiciona exatamente 2 meses corretamente sem alterar o ano indevidamente
  devolucao.setMonth(devolucao.getMonth() + 2);

  const formatarData = (data) => {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const inputEmissao = document.getElementById('dataEmissao');
  const inputDevolucao = document.getElementById('dataDevolucao');

  if (inputEmissao) inputEmissao.value = formatarData(hoje);
  if (inputDevolucao) inputDevolucao.value = formatarData(devolucao);
}

// --- CARREGAR ALUNOS E LIVROS NOS SELECTS ---
async function carregarAlunosEExemplares() {
  try {
    // 1. Carregar Alunos cadastrados
    const resAlunos = await fetch(`${API_URL}/alunos`);
    const dadosAlunos = await resAlunos.json();
    const selectAluno = document.getElementById('selectAluno');

    if (selectAluno) {
      selectAluno.innerHTML = '<option value="">Selecione o aluno...</option>';
      
      const listaAlunos = Array.isArray(dadosAlunos) ? dadosAlunos : (dadosAlunos.alunos || dadosAlunos.data || []);

      listaAlunos.forEach(aluno => {
        const idAluno = aluno.cgm || aluno.id_aluno || aluno.id;
        const nomeAluno = aluno.nome || aluno.nome_aluno;
        
        if (idAluno && nomeAluno) {
          const cgmLimpo = String(idAluno).replace(/^[^0-9]*/, '');
          selectAluno.innerHTML += `<option value="${idAluno}">${nomeAluno} (CGM: ${cgmLimpo})</option>`;
        }
      });
    }

    // 2. Carregar Livros disponíveis (Agora resgatando o ISBN perfeitamente)
    const resLivros = await fetch(`${API_URL}/livros`);
    const dadosLivros = await resLivros.json();
    const selectLivro = document.getElementById('selectLivro');

    if (selectLivro) {
      selectLivro.innerHTML = '<option value="">Selecione o livro...</option>';
      
      const listaLivros = Array.isArray(dadosLivros) ? dadosLivros : (dadosLivros.livros || dadosLivros.data || []);

      listaLivros.forEach(livro => {
        // Trazemos o ISBN de volta, pois o banco agora é VARCHAR e aceita textos longos
        const idLivro = livro.ISBN || livro.isbn || livro.id || livro.id_livro || livro.id_exemplar;
        const tituloLivro = livro.titulo || livro.nome;

        if (idLivro && tituloLivro) {
          selectLivro.innerHTML += `<option value="${idLivro}">${tituloLivro}</option>`;
        }
      });
    }
  } catch (error) {
    console.error('Erro ao buscar dados para os selects:', error);
  }
}
