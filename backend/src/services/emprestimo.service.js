const EmprestimoModel = require('../models/emprestimo.model');
const db = require('../config/db');

class EmprestimoService {
  async realizarEmprestimo(data) {
    const { CGM, id_exemplar } = data;

    // 1. Validar se o Aluno existe e se não está suspenso
    const [alunos] = await db.query('SELECT CGM, status, suspenso_ate FROM aluno WHERE CGM = ?', [CGM]);
    if (alunos.length === 0) throw new Error('Aluno não encontrado.');
    
    const aluno = alunos[0];
    if (aluno.status !== 'ATIVO') throw new Error('Aluno com cadastro inativo.');

    // Trava de suspensão por atraso anterior
    if (aluno.suspenso_ate && new Date(aluno.suspenso_ate) > new Date()) {
      const dataFormatada = new Date(aluno.suspenso_ate).toLocaleDateString('pt-BR');
      throw new Error(`Aluno suspenso de realizar novos empréstimos até ${dataFormatada} devido a atraso anterior.`);
    }

    // 2. Trava de 1 livro por aluno (Verifica se já tem empréstimo ATIVO)
    const [emprestimosAtivos] = await db.query(
      "SELECT id_emprestimo FROM emprestimo WHERE CGM = ? AND status = 'ATIVO'",
      [CGM]
    );
    if (emprestimosAtivos.length > 0) {
      throw new Error('O aluno já possui um livro emprestado. É necessário devolvê-lo antes de retirar outro.');
    }

    // 3. Validar se o exemplar está disponível
    const [exemplares] = await db.query('SELECT status FROM exemplar WHERE id_exemplar = ?', [id_exemplar]);
    if (exemplares.length === 0) throw new Error('Exemplar não encontrado.');
    if (exemplares[0].status !== 'DISPONIVEL') {
      throw new Error('Exemplar indisponível para empréstimo.');
    }

    // 4. Marca o exemplar como EMPRESTADO
    await db.query("UPDATE exemplar SET status = 'EMPRESTADO' WHERE id_exemplar = ?", [id_exemplar]);

    // 5. Registra o empréstimo
    return await EmprestimoModel.criar(data);
  }

  async registrarDevolucao(id_emprestimo, dadosDevolucao) {
    const { observacao, justificativa } = dadosDevolucao;

    const emprestimo = await EmprestimoModel.getById(id_emprestimo);
    if (!emprestimo) throw new Error('Empréstimo não encontrado.');
    if (emprestimo.status === 'CONCLUIDO') throw new Error('Este empréstimo já foi devolvido.');

    const hoje = new Date();
    const dataPrevista = new Date(emprestimo.data_prevista_devolucao);

    hoje.setHours(0, 0, 0, 0);
    dataPrevista.setHours(0, 0, 0, 0);

    // Calcula se houve atraso
    const diffTempo = hoje.getTime() - dataPrevista.getTime();
    const diasAtraso = Math.ceil(diffTempo / (1000 * 3600 * 24));

    let mensagemPenalidade = '';

    // Aplica a lógica da Penalidade (1 dia de atraso = 7 dias / 1 semana sem pegar livro)
    if (diasAtraso > 0) {
      if (justificativa && justificativa.trim() !== '') {
        mensagemPenalidade = `Devolução entregue com ${diasAtraso} dia(s) de atraso, mas a penalidade foi abonada devido à justificativa.`;
      } else {
        const diasPenalidade = diasAtraso * 7;
        const dataFimSuspensao = new Date();
        dataFimSuspensao.setDate(dataFimSuspensao.getDate() + diasPenalidade);

        // Atualiza a data de suspensão do aluno no banco
        await db.query('UPDATE aluno SET suspenso_ate = ? WHERE CGM = ?', [dataFimSuspensao, emprestimo.CGM]);

        const dataFormatada = dataFimSuspensao.toLocaleDateString('pt-BR');
        mensagemPenalidade = `Devolução realizada com ${diasAtraso} dia(s) de atraso. O aluno foi suspenso por ${diasPenalidade} dias (até ${dataFormatada}).`;
      }
    }

    // Libera o exemplar no banco de dados
    await db.query("UPDATE exemplar SET status = 'DISPONIVEL' WHERE id_exemplar = ?", [emprestimo.id_exemplar]);

    // Atualiza a devolução no banco
    await EmprestimoModel.devolver(id_emprestimo, observacao, justificativa);

    return {
      message: 'Devolução registrada com sucesso!',
      atraso: diasAtraso > 0,
      diasAtraso: diasAtraso > 0 ? diasAtraso : 0,
      detalhesPenalidade: mensagemPenalidade
    };
  }
}

module.exports = new EmprestimoService();
