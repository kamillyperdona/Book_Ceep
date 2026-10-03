-- ============================================================
-- Dados de exemplo (seed) para a Biblioteca Book_Ceep
-- Rode DEPOIS do schema.sql
-- ============================================================
USE book_ceep;

-- Turmas
INSERT INTO turmas (nome) VALUES
('1º Ano - Desenvolvimento de Sistemas'),
('2º Ano - Desenvolvimento de Sistemas'),
('3º Ano - Desenvolvimento de Sistemas');

-- Alunos
INSERT INTO alunos (nome, matricula, id_turma) VALUES
('Kamilly Perdoná', '2026001', 3),
('Pietra Pedro', '2026002', 2),
('Bianca Bucker', '2026003', 1);

-- Funcionários
INSERT INTO funcionarios (nome, cargo) VALUES
('Ana Bibliotecária', 'Atendente'),
('Roberto Souza', 'Administrador');

-- Autores
INSERT INTO autores (nome) VALUES
('Machado de Assis'),
('George Orwell'),
('Clarice Lispector');

-- Editoras
INSERT INTO editoras (nome) VALUES
('Companhia das Letras'),
('Penguin Classic'),
('Rocco');

-- Gêneros
INSERT INTO generos (nome) VALUES
('Romance'),
('Ficção Científica'),
('Literatura Brasileira');

-- Livros
INSERT INTO livros (titulo, isbn, ano_publicacao, id_autor, id_editora, id_genero) VALUES
('Dom Casmurro', '9788535914849', 1899, 1, 1, 3),
('1984', '9788535902778', 1949, 2, 2, 2),
('A Hora da Estrela', '9788532511010', 1977, 3, 3, 1);

-- Exemplares
INSERT INTO exemplares (id_livro, tombo, localizacao, status) VALUES
(1, 'T-001', 'Estante A1', 'disponivel'),
(1, 'T-002', 'Estante A1', 'disponivel'),
(2, 'T-003', 'Estante B2', 'disponivel'),
(3, 'T-004', 'Estante C1', 'disponivel');
