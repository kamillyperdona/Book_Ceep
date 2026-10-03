const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Importação das rotas
const homeRoutes = require('./routes/home.routes');
const turmaRoutes = require('./routes/turma.routes');
const alunoRoutes = require('./routes/aluno.routes');
const autorRoutes = require('./routes/autor.routes');
const editoraRoutes = require('./routes/editora.routes');
const generoRoutes = require('./routes/genero.routes');
const livroRoutes = require('./routes/livro.routes');
const exemplarRoutes = require('./routes/exemplar.routes');
const emprestimoRoutes = require('./routes/emprestimo.routes');
const funcionarioRoutes = require('./routes/funcionario.routes');
const relatorioRoutes = require('./routes/relatorio.routes');

// Registro de prefixos de URL
app.use('/', homeRoutes);
app.use('/turmas', turmaRoutes);
app.use('/alunos', alunoRoutes);
app.use('/autores', autorRoutes);
app.use('/editoras', editoraRoutes);
app.use('/generos', generoRoutes);
app.use('/livros', livroRoutes);
app.use('/exemplares', exemplarRoutes);
app.use('/emprestimos', emprestimoRoutes);
app.use('/funcionarios', funcionarioRoutes);
app.use('/api/relatorios', relatorioRoutes);

module.exports = app;
