// backend/src/app.js
const express = require('express');
const app = express();

// Middlewares globais para parse de JSON
app.use(express.json());

// Importação das rotas
const turmaRoutes = require('./routes/turma.routes'); // <-- Verifique esta linha
const livroRoutes = require('./routes/livro.routes');
const emprestimoRoutes = require('./routes/emprestimo.routes');
const relatorioRoutes = require('./routes/relatorio.routes');

// Mapeamento das rotas da API
app.use('/api/turmas', turmaRoutes); // <-- Verifique se esta linha existe!
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
