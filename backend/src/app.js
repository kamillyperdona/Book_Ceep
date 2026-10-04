// backend/src/app.js
const express = require('express');
const cors = require('cors'); // Importante para integração com o Front-end
const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Importação das rotas
const turmaRoutes = require('./routes/turma.routes');
const alunoRoutes = require('./routes/aluno.routes'); // <-- ADICIONADO
const livroRoutes = require('./routes/livro.routes');
const emprestimoRoutes = require('./routes/emprestimo.routes');
const relatorioRoutes = require('./routes/relatorio.routes');

// Mapeamento das rotas da API
app.use('/api/turmas', turmaRoutes);
app.use('/api/alunos', alunoRoutes); // <-- ADICIONADO
app.use('/api/livros', livroRoutes);
app.use('/api/emprestimos', emprestimoRoutes);
app.use('/api/relatorios', relatorioRoutes);

// Middleware de tratamento de erros (deve ser o último)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    sucess: false,
    message: err.message || 'Erro interno no servidor'
  });
});

module.exports = app;
